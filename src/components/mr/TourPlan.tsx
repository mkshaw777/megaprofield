import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';

interface TourPlanItem {
  id: number;
  date: Date;
  location: string;
  doctors: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function TourPlan() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tourPlans, setTourPlans] = useState<TourPlanItem[]>([
    {
      id: 1,
      date: new Date(2025, 9, 25),
      location: 'Andheri - Bandra',
      doctors: '3 doctors',
      status: 'approved',
    },
    {
      id: 2,
      date: new Date(2025, 9, 26),
      location: 'Borivali - Kandivali',
      doctors: '4 doctors',
      status: 'pending',
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newDoctors, setNewDoctors] = useState('');

  const handleAddPlan = () => {
    if (!date || !newLocation || !newDoctors) {
      toast.error('Please fill all fields');
      return;
    }

    const newPlan: TourPlanItem = {
      id: tourPlans.length + 1,
      date,
      location: newLocation,
      doctors: newDoctors,
      status: 'pending',
    };

    setTourPlans([...tourPlans, newPlan]);
    setNewLocation('');
    setNewDoctors('');
    setIsDialogOpen(false);
    toast.success('Tour plan added successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-white mb-2">Tour Plan</h1>
        <p className="text-sm opacity-90">Plan and manage your visits</p>
      </div>

      {/* Calendar */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md mx-auto"
          />
        </div>
      </div>

      {/* Tour Plans List */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[#1F2937]">Upcoming Plans</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#2563EB] hover:bg-blue-700">
                <Plus size={16} className="mr-1" />
                Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Tour Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Selected Date</Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CalendarIcon size={16} className="text-gray-500" />
                    <span className="text-sm">{date?.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location/Area</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Andheri - Bandra"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctors">Number of Doctors</Label>
                  <Input
                    id="doctors"
                    placeholder="e.g., 3 doctors"
                    value={newDoctors}
                    onChange={(e) => setNewDoctors(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddPlan} className="w-full bg-[#10B981] hover:bg-green-600">
                  Add Tour Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {tourPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {plan.date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-[#1F2937]">{plan.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">{plan.doctors}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusColor(plan.status)}`}>
                {plan.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
