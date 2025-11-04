import { useState } from 'react';
import ManagerDashboard from './manager/ManagerDashboard';
import TeamManagement from './manager/TeamManagement';
import ManagerTasks from './manager/ManagerTasks';
import Profile from './common/Profile';
import BottomNav from './common/BottomNav';
import DoctorList from './mr/DoctorList';
import ExpenseForm from './mr/ExpenseForm';
import ActiveVisit from './mr/ActiveVisit';

interface ManagerAppProps {
  userName: string;
  onLogout: () => void;
}

export default function ManagerApp({ userName, onLogout }: ManagerAppProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeVisit, setActiveVisit] = useState<{
    doctorName: string;
    specialty: string;
    startTime: Date;
  } | null>(null);

  const handleStartVisit = (doctorName: string, specialty: string) => {
    setActiveVisit({
      doctorName,
      specialty,
      startTime: new Date(),
    });
  };

  const handleEndVisit = () => {
    setActiveVisit(null);
    setActiveTab('dashboard');
  };

  // If active visit, show visit screen
  if (activeVisit) {
    return <ActiveVisit visit={activeVisit} onEndVisit={handleEndVisit} userName={userName} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ManagerDashboard userName={userName} />;
      case 'doctors':
        return <DoctorList onStartVisit={handleStartVisit} />;
      case 'tasks':
        return <ManagerTasks />;
      case 'expenses':
        return <ExpenseForm />;
      case 'team':
        return <TeamManagement />;
      case 'profile':
        return <Profile userName={userName} role="Team Manager" onLogout={onLogout} />;
      default:
        return <ManagerDashboard userName={userName} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {renderContent()}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
          { id: 'doctors', label: 'Doctors', icon: 'users' },
          { id: 'tasks', label: 'Tasks', icon: 'check-square' },
          { id: 'team', label: 'Team', icon: 'briefcase' },
          { id: 'profile', label: 'Profile', icon: 'user' },
        ]}
      />
    </div>
  );
}
