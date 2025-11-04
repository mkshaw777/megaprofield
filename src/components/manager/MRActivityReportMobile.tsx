import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, DollarSign, Wallet, Calendar, Gift, Navigation } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface MRActivityReportMobileProps {
  onBack: () => void;
  mrName: string;
}

interface VisitDetail {
  id: number;
  date: string;
  time: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  location: string;
  coordinates: string;
  checkInTime: string;
  checkOutTime: string;
  duration: string;
  pobAmount: number;
  collectionAmount: number;
  outstandingAmount: number;
  giftDistributed: boolean;
}

const mockVisits: VisitDetail[] = [
  {
    id: 1,
    date: '2025-10-21',
    time: '09:30 AM',
    doctorName: 'Dr. Rajesh Kumar',
    specialty: 'Cardiologist',
    hospital: 'Apollo Hospital',
    location: 'Andheri West, Mumbai',
    coordinates: '19.1136° N, 72.8697° E',
    checkInTime: '09:30 AM',
    checkOutTime: '10:15 AM',
    duration: '45 mins',
    pobAmount: 15000,
    collectionAmount: 12000,
    outstandingAmount: 3000,
    giftDistributed: true,
  },
  {
    id: 2,
    date: '2025-10-21',
    time: '11:00 AM',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'Pediatrician',
    hospital: 'Lilavati Hospital',
    location: 'Bandra East, Mumbai',
    coordinates: '19.0596° N, 72.8295° E',
    checkInTime: '11:00 AM',
    checkOutTime: '11:40 AM',
    duration: '40 mins',
    pobAmount: 18000,
    collectionAmount: 10000,
    outstandingAmount: 8000,
    giftDistributed: true,
  },
  {
    id: 3,
    date: '2025-10-21',
    time: '02:30 PM',
    doctorName: 'Dr. Amit Patel',
    specialty: 'Orthopedic',
    hospital: 'Fortis Hospital',
    location: 'Borivali West, Mumbai',
    coordinates: '19.2403° N, 72.8512° E',
    checkInTime: '02:30 PM',
    checkOutTime: '03:10 PM',
    duration: '40 mins',
    pobAmount: 12000,
    collectionAmount: 10000,
    outstandingAmount: 2000,
    giftDistributed: false,
  },
];

export default function MRActivityReportMobile({ onBack, mrName }: MRActivityReportMobileProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const totalPOB = mockVisits.reduce((sum, visit) => sum + visit.pobAmount, 0);
  const totalCollection = mockVisits.reduce((sum, visit) => sum + visit.collectionAmount, 0);
  const totalOutstanding = mockVisits.reduce((sum, visit) => sum + visit.outstandingAmount, 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 h-8 w-8 p-0">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-white">Activity Details</h1>
            <p className="text-sm opacity-90">{mrName}</p>
          </div>
        </div>
        
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="bg-white/20 border-white/30 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-[#2563EB]" />
            <p className="text-xs text-gray-600">Visits</p>
          </div>
          <p className="text-[#1F2937]">{mockVisits.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-[#10B981]" />
            <p className="text-xs text-gray-600">POB</p>
          </div>
          <p className="text-[#1F2937]">₹{totalPOB.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-[#2563EB]" />
            <p className="text-xs text-gray-600">Collection</p>
          </div>
          <p className="text-[#1F2937]">₹{totalCollection.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-[#F59E0B]" />
            <p className="text-xs text-gray-600">Outstanding</p>
          </div>
          <p className="text-[#1F2937]">₹{totalOutstanding.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <Tabs defaultValue="visits" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="visits">Visits</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          {/* Visit Details */}
          <TabsContent value="visits" className="space-y-3">
            {mockVisits.map((visit) => (
              <div key={visit.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[#1F2937]">{visit.doctorName}</h3>
                    <span className="text-xs text-gray-600">{visit.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{visit.specialty}</p>
                  <p className="text-xs text-gray-500">{visit.hospital}</p>
                </div>
                
                <div className="p-4 space-y-3">
                  {/* Location */}
                  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={16} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm text-[#1F2937]">{visit.location}</p>
                      <p className="text-xs text-gray-400 mt-1">{visit.coordinates}</p>
                    </div>
                  </div>
                  
                  {/* Timing */}
                  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <Clock size={16} className="text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm text-[#1F2937]">{visit.checkInTime} - {visit.checkOutTime}</p>
                      <p className="text-xs text-gray-400 mt-1">{visit.duration}</p>
                    </div>
                  </div>
                  
                  {/* Financial Details */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">POB</p>
                      <p className="text-sm text-[#1F2937]">₹{visit.pobAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Collection</p>
                      <p className="text-sm text-[#1F2937]">₹{visit.collectionAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Outstanding</p>
                      <p className="text-sm text-[#1F2937]">₹{visit.outstandingAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Gift</p>
                      <p className="text-sm text-[#1F2937]">{visit.giftDistributed ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Map View */}
          <TabsContent value="map">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 h-64 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Navigation size={32} className="text-gray-400" />
                </div>
                
                {/* Visit markers */}
                {mockVisits.map((visit, index) => (
                  <div
                    key={visit.id}
                    className="absolute bg-white rounded-lg shadow-lg p-2"
                    style={{
                      top: `${15 + index * 22}%`,
                      left: `${20 + index * 15}%`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                        <MapPin size={12} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-[#1F2937]">{visit.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 space-y-2">
                <h4 className="text-[#1F2937] mb-2">Route</h4>
                {mockVisits.map((visit, index) => (
                  <div key={visit.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                    <div className="w-6 h-6 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1F2937] truncate">{visit.location}</p>
                      <p className="text-xs text-gray-500">{visit.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
