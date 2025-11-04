import { useState } from 'react';
import MRDashboard from './mr/MRDashboard';
import DoctorList from './mr/DoctorList';
import ExpenseForm from './mr/ExpenseForm';
import TourPlan from './mr/TourPlan';
import MyTasks from './mr/MyTasks';
import Profile from './common/Profile';
import BottomNav from './common/BottomNav';
import ActiveVisit from './mr/ActiveVisit';

interface MRAppProps {
  userName: string;
  onLogout: () => void;
}

export default function MRApp({ userName, onLogout }: MRAppProps) {
  const [activeTab, setActiveTab] = useState('home');
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
    setActiveTab('home');
  };

  if (activeVisit) {
    return <ActiveVisit visit={activeVisit} onEndVisit={handleEndVisit} userName={userName} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <MRDashboard userName={userName} />;
      case 'doctors':
        return <DoctorList onStartVisit={handleStartVisit} />;
      case 'expenses':
        return <ExpenseForm />;
      case 'tasks':
        return <MyTasks />;
      case 'tour':
        return <TourPlan />;
      case 'profile':
        return <Profile userName={userName} role="Medical Representative" onLogout={onLogout} />;
      default:
        return <MRDashboard userName={userName} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {renderContent()}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'home', label: 'Home', icon: 'home' },
          { id: 'doctors', label: 'Doctors', icon: 'users' },
          { id: 'tasks', label: 'Tasks', icon: 'check-square' },
          { id: 'expenses', label: 'Expenses', icon: 'receipt' },
          { id: 'profile', label: 'Profile', icon: 'user' },
        ]}
      />
    </div>
  );
}
