import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, User, Flag, CheckCircle, Clock, XCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Task, TaskPriority, TaskStatus, User as UserType } from '../../utils/types';
import {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getAllUsers,
  updateTask,
} from '../../utils/dataStorage';
import { getCurrentUser } from '../../utils/authStorage';

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as TaskPriority,
    dueDate: '',
    targetAmount: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allTasks = getAllTasks();
    setTasks(allTasks);

    const allUsers = getAllUsers();
    const staffUsers = allUsers.filter(u => u.role === 'mr' || u.role === 'manager');
    setUsers(staffUsers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const assignedUser = users.find(u => u.userId === formData.assignedTo);
    if (!assignedUser) return;

    const taskData = {
      title: formData.title,
      description: formData.description,
      assignedTo: formData.assignedTo,
      assignedToName: assignedUser.name,
      assignedToRole: assignedUser.role,
      assignedBy: currentUser.userId,
      assignedByName: currentUser.name,
      priority: formData.priority,
      status: 'pending' as TaskStatus,
      dueDate: new Date(formData.dueDate).getTime(),
      targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : undefined,
    };

    if (editingTask) {
      updateTask(editingTask.taskId, taskData);
    } else {
      createTask(taskData);
    }

    loadData();
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      targetAmount: '',
    });
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      targetAmount: task.targetAmount?.toString() || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      loadData();
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedToName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
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

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'in-progress': return <Clock size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'cancelled': return <XCircle size={16} />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN');
  };

  const isOverdue = (task: Task) => {
    return task.status !== 'completed' && task.dueDate < Date.now();
  };

  return (
    <div className="p-4 lg:p-8 min-w-0 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[#1F2937]">Task Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Assign and track tasks for MRs and Managers
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563EB] hover:bg-blue-700 text-white">
              <Plus size={20} className="mr-2" />
              Assign New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Assign New Task'}</DialogTitle>
              <DialogDescription>
                Create and assign tasks to MRs and Managers
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Task Title*</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Visit 10 doctors this week"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed task description..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignedTo">Assign To*</Label>
                  <select
                    id="assignedTo"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    required
                  >
                    <option value="">Select user...</option>
                    <optgroup label="Medical Representatives">
                      {users.filter(u => u.role === 'mr').map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.name} (@{user.username})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Managers">
                      {users.filter(u => u.role === 'manager').map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.name} (@{user.username})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority*</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date*</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="targetAmount">Target Amount (Optional)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="e.g., 50000"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-[#2563EB] hover:bg-blue-700 text-white">
                  {editingTask ? 'Update Task' : 'Assign Task'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tasks or assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                      ? 'No tasks found matching your filters'
                      : 'No tasks assigned yet. Click "Assign New Task" to get started.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task.taskId}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#1F2937]">{task.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
                        {task.targetAmount && (
                          <p className="text-xs text-[#2563EB] mt-1">
                            Target: ₹{task.targetAmount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <div>
                          <p className="font-medium text-[#1F2937]">{task.assignedToName}</p>
                          <p className="text-xs text-gray-500 capitalize">{task.assignedToRole}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${getPriorityColor(task.priority)}`}>
                        <Flag size={12} className="mr-1" />
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={isOverdue(task) ? 'text-red-600' : ''}>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(task.dueDate)}
                        </div>
                        {isOverdue(task) && (
                          <p className="text-xs text-red-600 mt-1">Overdue</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${getStatusColor(task.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(task.status)}
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(task)}
                          className="text-[#2563EB] hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(task.taskId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
          <p className="text-[#1F2937]">{tasks.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-200">
          <p className="text-sm text-yellow-800 mb-1">Pending</p>
          <p className="text-yellow-900">{tasks.filter(t => t.status === 'pending').length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-200">
          <p className="text-sm text-blue-800 mb-1">In Progress</p>
          <p className="text-blue-900">{tasks.filter(t => t.status === 'in-progress').length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-200">
          <p className="text-sm text-green-800 mb-1">Completed</p>
          <p className="text-green-900">{tasks.filter(t => t.status === 'completed').length}</p>
        </div>
      </div>
    </div>
  );
}
