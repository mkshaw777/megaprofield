import { useState, useEffect } from 'react';
import { CheckSquare, Calendar, Flag, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Task, TaskStatus } from '../../utils/types';
import { getTasksByUser, updateTaskStatus, getTaskStats } from '../../utils/dataStorage';
import { getCurrentUser } from '../../utils/authStorage';

export default function ManagerTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const userTasks = getTasksByUser(currentUser.userId);
    const sortedTasks = userTasks.sort((a, b) => {
      const aOverdue = a.status !== 'completed' && a.dueDate < Date.now();
      const bOverdue = b.status !== 'completed' && b.dueDate < Date.now();
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return a.dueDate - b.dueDate;
    });

    setTasks(sortedTasks);
    const taskStats = getTaskStats(currentUser.userId);
    setStats(taskStats);
  };

  const handleUpdateStatus = (status: TaskStatus) => {
    if (!selectedTask) return;
    updateTaskStatus(selectedTask.taskId, status, notes);
    loadTasks();
    setIsDialogOpen(false);
    setSelectedTask(null);
    setNotes('');
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setNotes(task.notes || '');
    setIsDialogOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (task: Task) => {
    return task.status !== 'completed' && task.dueDate < Date.now();
  };

  const getDaysRemaining = (dueDate: number) => {
    const days = Math.ceil((dueDate - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days remaining`;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-white mb-2">My Tasks</h1>
        <p className="text-sm opacity-90">Track and manage your assigned tasks</p>
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-[#1F2937]">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 shadow-sm text-center border border-yellow-200">
            <p className="text-xs text-yellow-700 mb-1">Pending</p>
            <p className="text-yellow-900">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 shadow-sm text-center border border-blue-200">
            <p className="text-xs text-blue-700 mb-1">Active</p>
            <p className="text-blue-900">{stats.inProgress}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 shadow-sm text-center border border-red-200">
            <p className="text-xs text-red-700 mb-1">Overdue</p>
            <p className="text-red-900">{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <CheckSquare size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-[#1F2937] mb-2">No Tasks Assigned</h3>
            <p className="text-sm text-gray-500">
              You don't have any tasks yet. Check back later!
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.taskId}
              onClick={() => openTaskDetails(task)}
              className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                isOverdue(task) ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-[#1F2937] flex-1 pr-2">{task.title}</h4>
                <Badge className={`capitalize text-xs ${getPriorityColor(task.priority)}`}>
                  <Flag size={10} className="mr-1" />
                  {task.priority}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={`capitalize text-xs ${getStatusColor(task.status)}`}>
                    {task.status === 'completed' && <CheckCircle size={12} className="mr-1" />}
                    {task.status === 'in-progress' && <Clock size={12} className="mr-1" />}
                    {task.status.replace('-', ' ')}
                  </Badge>
                  {task.targetAmount && (
                    <span className="text-xs text-[#2563EB] font-medium">
                      Target: ₹{task.targetAmount.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  isOverdue(task) ? 'text-red-600' : 'text-gray-500'
                }`}>
                  <Calendar size={12} />
                  {formatDate(task.dueDate)}
                </div>
              </div>

              {isOverdue(task) && (
                <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <Clock size={12} />
                  {getDaysRemaining(task.dueDate)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Task Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <DialogDescription>
                  Assigned by {selectedTask.assignedByName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                  <p className="text-sm text-gray-600">{selectedTask.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Priority</p>
                    <Badge className={`capitalize ${getPriorityColor(selectedTask.priority)}`}>
                      <Flag size={12} className="mr-1" />
                      {selectedTask.priority}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Due Date</p>
                    <div className={`text-sm ${isOverdue(selectedTask) ? 'text-red-600' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(selectedTask.dueDate)}
                      </div>
                      <p className="text-xs mt-1">{getDaysRemaining(selectedTask.dueDate)}</p>
                    </div>
                  </div>
                </div>

                {selectedTask.targetAmount && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Target Amount</p>
                    <p className="text-[#2563EB] font-medium">
                      ₹{selectedTask.targetAmount.toLocaleString()}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Current Status</p>
                  <Badge className={`capitalize ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status.replace('-', ' ')}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Notes (Optional)</p>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes or updates about this task..."
                    rows={3}
                  />
                </div>

                {selectedTask.status !== 'completed' && (
                  <div className="flex flex-col gap-2 pt-4">
                    {selectedTask.status === 'pending' && (
                      <Button
                        onClick={() => handleUpdateStatus('in-progress')}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      >
                        <Clock size={16} className="mr-2" />
                        Start Working
                      </Button>
                    )}
                    
                    {selectedTask.status === 'in-progress' && (
                      <Button
                        onClick={() => handleUpdateStatus('completed')}
                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                )}

                {selectedTask.status === 'completed' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <CheckCircle size={24} className="mx-auto text-green-600 mb-2" />
                    <p className="text-sm text-green-800 font-medium">Task Completed</p>
                    {selectedTask.completedAt && (
                      <p className="text-xs text-green-600 mt-1">
                        {formatDate(selectedTask.completedAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
