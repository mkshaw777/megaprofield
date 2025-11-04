import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import TeamLiveView from './TeamLiveView';
import Approvals from './Approvals';
import { MapPin, CheckCircle } from 'lucide-react';

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-white text-center mb-2">Team Management</h1>
        <p className="text-center text-sm opacity-90">Monitor & approve team activities</p>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <MapPin size={16} />
              Live View
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <CheckCircle size={16} />
              Approvals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-0">
            <TeamLiveView />
          </TabsContent>

          <TabsContent value="approvals" className="mt-0">
            <Approvals />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
