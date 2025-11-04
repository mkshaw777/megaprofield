import { useState, useEffect } from 'react';
import { MapPin, DollarSign, Wallet, Clock, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import StatsCard from '../common/StatsCard';
import logo from 'figma:asset/e251b5c18758a36c694bcd1e83413a4344519727.png';
import { getCurrentUser } from '../../utils/authStorage';
import { getDashboardStats, getActiveVisitByMR, getTodayVisits, formatCurrency } from '../../utils/dataStorage';

interface MRDashboardProps {
  userName: string;
}

export default function MRDashboard({ userName }: MRDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeVisit, setActiveVisit] = useState<any>(null);
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalPOB: 0,
    totalCollection: 0,
    outstanding: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setIsLoading(true);
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Get active visit
    const active = getActiveVisitByMR(currentUser.userId);
    setActiveVisit(active);

    // Get today's stats
    const todayVisits = getTodayVisits(currentUser.userId);
    const todayPOB = todayVisits.reduce((sum, v) => sum + (v.pobAmount || 0), 0);
    const todayCollection = todayVisits.reduce((sum, v) => sum + (v.collectionAmount || 0), 0);

    setStats({
      totalVisits: todayVisits.length,
      totalPOB: todayPOB,
      totalCollection: todayCollection,
      outstanding: todayPOB - todayCollection,
    });

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Welcome back,</p>
            <h1 className="text-white mt-1">{userName}</h1>
          </div>
          <img src={logo} alt="Logo" className="h-10 brightness-0 invert" />
        </div>
        
        {activeVisit ? (
          <div className="bg-green-500/20 backdrop-blur-sm border-2 border-green-300 rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white">Active Visit</span>
              </div>
              <span className="text-xs text-white/80">
                {new Date(activeVisit.checkInTimestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-white font-medium">{activeVisit.doctorName}</p>
            <p className="text-xs text-white/80 mt-1">{activeVisit.specialty || 'Doctor Visit'}</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mt-4 text-center">
            <Clock size={24} className="mx-auto mb-2 text-white/70" />
            <p className="text-sm text-white/90">No active visit</p>
            <p className="text-xs text-white/70 mt-1">Go to Doctors tab to start a visit</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#1F2937]">Today's Performance</h3>
          <button 
            onClick={loadDashboardData}
            className="text-[#2563EB] text-sm flex items-center gap-1 hover:underline"
          >
            <TrendingUp size={14} />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Today's Visits"
            value={isLoading ? '...' : stats.totalVisits.toString()}
            icon={MapPin}
            iconColor="#2563EB"
          />
          <StatsCard
            title="Total POB"
            value={isLoading ? '...' : formatCurrency(stats.totalPOB)}
            icon={DollarSign}
            iconColor="#10B981"
          />
          <StatsCard
            title="Collection"
            value={isLoading ? '...' : formatCurrency(stats.totalCollection)}
            icon={Wallet}
            iconColor="#F59E0B"
          />
          <StatsCard
            title="Outstanding"
            value={isLoading ? '...' : formatCurrency(stats.outstanding)}
            icon={Clock}
            iconColor={stats.outstanding > 0 ? "#EF4444" : "#10B981"}
          />
        </div>
      </div>

      {/* Map Section */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-[#1F2937] mb-3">Your Location</h3>
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50"></div>
            <div className="relative z-10 text-center">
              <MapPin size={48} className="text-[#2563EB] mx-auto mb-2" />
              <p className="text-sm text-gray-600">Mumbai - Central Zone</p>
              <p className="text-xs text-gray-500 mt-1">19.0760° N, 72.8777° E</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-4 pb-20">
        <h3 className="text-[#1F2937] mb-3">Quick Tips</h3>
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1F2937] mb-1">Visit Doctors</p>
                <p className="text-sm text-gray-600">
                  Go to Doctors tab → Select doctor → Start Visit
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1F2937] mb-1">Submit Expenses</p>
                <p className="text-sm text-gray-600">
                  Add daily expenses after 8 PM for auto DA/TA calculation
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1F2937] mb-1">Plan Your Tours</p>
                <p className="text-sm text-gray-600">
                  Use Tour Plan tab to schedule visits and get approvals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
