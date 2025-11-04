import { useState, useEffect } from 'react';
import { Users, DollarSign, Wallet, AlertCircle, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import StatsCard from '../common/StatsCard';
import MRActivityReportMobile from './MRActivityReportMobile';
import logo from 'figma:asset/e251b5c18758a36c694bcd1e83413a4344519727.png';
import { getCurrentUser } from '../../utils/authStorage';
import { getMRsByManager, getDashboardStats, getMRLocations, getPendingExpenses, getPendingTourPlans } from '../../utils/dataStorage';

interface ManagerDashboardProps {
  userName: string;
}

interface MRStatus {
  id: string;
  name: string;
  status: 'on-field' | 'checked-in' | 'offline';
  location?: string;
  lastActivity: string;
}

export default function ManagerDashboard({ userName }: ManagerDashboardProps) {
  const [selectedMR, setSelectedMR] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<MRStatus[]>([]);
  const [stats, setStats] = useState({
    totalPOB: 0,
    totalCollection: 0,
    teamMembersCount: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'manager') return;

    // Get team members
    const mrs = getMRsByManager(currentUser.userId);
    setStats(prev => ({ ...prev, teamMembersCount: mrs.length }));

    // Get MR locations and status
    const locations = getMRLocations(currentUser.userId);
    const mrStatuses: MRStatus[] = locations.map(loc => {
      const timeDiff = Date.now() - loc.lastUpdate;
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      const minsAgo = Math.floor(timeDiff / (1000 * 60));
      
      let lastActivity = '';
      if (hoursAgo > 0) {
        lastActivity = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
      } else {
        lastActivity = `${minsAgo} min${minsAgo !== 1 ? 's' : ''} ago`;
      }

      let status: 'on-field' | 'checked-in' | 'offline' = 'offline';
      let location: string | undefined;

      if (loc.status === 'in_visit') {
        status = 'checked-in';
        location = loc.currentDoctorName;
      } else if (loc.status === 'idle' && timeDiff < 30 * 60 * 1000) {
        status = 'on-field';
      }

      return {
        id: loc.mrId,
        name: loc.mrName,
        status,
        location,
        lastActivity,
      };
    });

    setTeamMembers(mrStatuses);

    // Get dashboard stats
    const dashboardStats = getDashboardStats(currentUser.userId, 'manager');
    
    // Get pending approvals (expenses + tour plans)
    const pendingExpenses = getPendingExpenses(currentUser.userId);
    const pendingTourPlans = getPendingTourPlans(currentUser.userId);
    const totalPending = pendingExpenses.length + pendingTourPlans.length;

    setStats({
      totalPOB: dashboardStats.totalPOB,
      totalCollection: dashboardStats.totalCollection,
      teamMembersCount: mrs.length,
      pendingApprovals: totalPending,
    });
  }, []);

  if (selectedMR) {
    return <MRActivityReportMobile onBack={() => setSelectedMR(null)} mrName={selectedMR} />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return 'bg-green-100 text-green-800';
      case 'on-field':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checked-in':
        return <CheckCircle size={16} />;
      case 'on-field':
        return <Clock size={16} />;
      default:
        return <XCircle size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Welcome back,</p>
            <h1 className="text-white mt-1">{userName}</h1>
          </div>
          <img src={logo} alt="Logo" className="h-10 brightness-0 invert" />
        </div>
      </div>

      {/* Team Performance Stats */}
      <div className="p-4">
        <h3 className="text-[#1F2937] mb-3">Team Performance</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Total Team POB"
            value={`₹${(stats.totalPOB / 1000).toFixed(1)}K`}
            icon={DollarSign}
            iconColor="#10B981"
          />
          <StatsCard
            title="Total Collection"
            value={`₹${(stats.totalCollection / 1000).toFixed(1)}K`}
            icon={Wallet}
            iconColor="#2563EB"
          />
          <StatsCard
            title="Team Members"
            value={stats.teamMembersCount.toString()}
            icon={Users}
            iconColor="#8B5CF6"
          />
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals.toString()}
            icon={AlertCircle}
            iconColor="#F59E0B"
          />
        </div>
      </div>

      {/* MR Status */}
      <div className="p-4">
        <h3 className="text-[#1F2937] mb-3">Team Status</h3>
        {teamMembers.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No team members assigned yet</p>
            <p className="text-gray-400 text-xs mt-2">Contact admin to assign MRs to your team</p>
          </div>
        ) : (
          <div className="space-y-3">
            {teamMembers.map((mr) => (
              <div key={mr.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[#1F2937]">{mr.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs capitalize flex items-center gap-1 ${getStatusColor(mr.status)}`}>
                    {getStatusIcon(mr.status)}
                    {mr.status}
                  </span>
                </div>
                {mr.location && (
                  <p className="text-sm text-gray-600 mb-1">Currently at: {mr.location}</p>
                )}
                <p className="text-xs text-gray-500 mb-3">Last activity: {mr.lastActivity}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedMR(mr.name)}
                  className="w-full"
                >
                  <Eye size={14} className="mr-2" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
