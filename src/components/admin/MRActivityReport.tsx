import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, DollarSign, Wallet, User, Calendar, Gift, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { getVisitsByMR, formatDate, formatTime, formatDuration, type DoctorVisit } from '../../utils/dataStorage';
import { getAllUsers } from '../../utils/authStorage';

interface MRActivityReportProps {
  mrUsername: string;
  onBack: () => void;
}

export default function MRActivityReport({ mrUsername, onBack }: MRActivityReportProps) {
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const [mrName, setMRName] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('all');

  useEffect(() => {
    // Load MR details
    const users = getAllUsers();
    const mr = users.find(u => u.username === mrUsername);
    if (mr) {
      setMRName(mr.name);
    }

    // Load visits
    const mrVisits = getVisitsByMR(mrUsername);
    setVisits(mrVisits);
  }, [mrUsername]);

  // Get unique dates for filter
  const uniqueDates = Array.from(new Set(visits.map(v => v.date))).sort().reverse();

  // Filter visits by selected date
  const filteredVisits = selectedDate === 'all' 
    ? visits 
    : visits.filter(v => v.date === selectedDate);

  // Calculate totals
  const totalVisits = filteredVisits.length;
  const totalPOB = filteredVisits.reduce((sum, v) => sum + v.totalPOB, 0);
  const totalCollection = filteredVisits.reduce((sum, v) => sum + v.collectionAmount, 0);
  const totalOutstanding = totalPOB - totalCollection;
  const totalDuration = filteredVisits.reduce((sum, v) => sum + v.duration, 0);

  return (
    <div className="p-4 lg:p-8 min-w-0 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-[#1F2937]">MR Activity Report</h1>
            <p className="text-sm text-gray-500 mt-1">
              {mrName} ({mrUsername})
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              {uniqueDates.map(date => (
                <SelectItem key={date} value={date}>
                  {formatDate(date)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Visits</p>
            <User size={20} className="text-[#2563EB]" />
          </div>
          <p className="text-[#1F2937]">{totalVisits}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDuration(totalDuration)} total time
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total POB</p>
            <DollarSign size={20} className="text-[#10B981]" />
          </div>
          <p className="text-[#1F2937]">₹{totalPOB.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Purchase Order Booking</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Collection</p>
            <Wallet size={20} className="text-[#2563EB]" />
          </div>
          <p className="text-[#1F2937]">₹{totalCollection.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalPOB > 0 ? Math.round((totalCollection / totalPOB) * 100) : 0}% collection rate
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Outstanding</p>
            <DollarSign size={20} className="text-[#F59E0B]" />
          </div>
          <p className="text-[#1F2937]">₹{totalOutstanding.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Pending collection</p>
        </div>
      </div>

      {/* Visit Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-[#1F2937]">Visit Details</h2>
        </div>

        {filteredVisits.length === 0 ? (
          <div className="p-12 text-center">
            <User size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {selectedDate === 'all' 
                ? 'No visits recorded yet' 
                : 'No visits on selected date'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Complete doctor visits to see activity here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredVisits.map((visit) => (
              <div key={visit.id} className="p-6 hover:bg-gray-50 transition-colors">
                {/* Visit Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-[#1F2937]">{visit.doctorName}</h3>
                      <p className="text-sm text-gray-500">{visit.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{formatDate(visit.date)}</p>
                    <p className="text-xs text-gray-400">{formatTime(visit.startTime)}</p>
                  </div>
                </div>

                {/* Visit Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={14} className="text-gray-400" />
                      <p className="text-xs text-gray-500">Duration</p>
                    </div>
                    <p className="text-sm text-[#1F2937]">
                      {formatDuration(visit.duration)}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign size={14} className="text-green-500" />
                      <p className="text-xs text-gray-500">POB Amount</p>
                    </div>
                    <p className="text-sm text-[#1F2937]">
                      ₹{visit.totalPOB.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet size={14} className="text-blue-500" />
                      <p className="text-xs text-gray-500">Collection</p>
                    </div>
                    <p className="text-sm text-[#1F2937]">
                      ₹{visit.collectionAmount.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift size={14} className="text-purple-500" />
                      <p className="text-xs text-gray-500">Gift</p>
                    </div>
                    <p className="text-sm text-[#1F2937]">
                      {visit.giftName ? `${visit.giftName} (${visit.giftQuantity})` : 'No gift'}
                    </p>
                  </div>
                </div>

                {/* POB Products */}
                {visit.pobProducts.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Package size={16} className="text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Products Ordered - {visit.stockist}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {visit.pobProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex-1">
                            <p className="text-sm text-[#1F2937]">{product.productName}</p>
                            <p className="text-xs text-gray-500">
                              {product.quantity} units × ₹{product.rate}
                            </p>
                          </div>
                          <p className="text-sm text-[#1F2937]">
                            ₹{product.total.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
