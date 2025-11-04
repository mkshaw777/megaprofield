import { useState } from 'react';
import { LayoutDashboard, Users, Database, BarChart, Settings, LogOut, HardDrive, Menu, X, CheckSquare } from 'lucide-react';
import AdminDashboard from './admin/AdminDashboard';
import StaffManagement from './admin/StaffManagement';
import DataManagement from './admin/DataManagement';
import DatabaseManagement from './admin/DatabaseManagement';
import AdminReports from './admin/AdminReports';
import SettingsPage from './admin/SettingsPage';
import TaskManagement from './admin/TaskManagement';
import logo from 'figma:asset/e251b5c18758a36c694bcd1e83413a4344519727.png';

interface AdminAppProps {
  userName: string;
  onLogout: () => void;
}

export default function AdminApp({ userName, onLogout }: AdminAppProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Management', icon: CheckSquare },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'database', label: 'Database Cleanup', icon: HardDrive },
    { id: 'reports', label: 'Reports', icon: BarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'tasks':
        return <TaskManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'data':
        return <DataManagement />;
      case 'database':
        return <DatabaseManagement />;
      case 'reports':
        return <AdminReports />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Megapro Innovation" className="h-8" />
          <div>
            <p className="text-sm font-medium text-[#1F2937]">Megapro Innovation</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative
        w-64 bg-white border-r border-gray-200 
        flex flex-col flex-shrink-0
        h-full lg:h-auto
        transition-transform duration-300 ease-in-out
        z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Desktop Logo */}
        <div className="hidden lg:block p-6 border-b border-gray-200">
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt="Megapro Innovation" className="h-10 mb-2" />
            <p className="text-[#1F2937]">Megapro Innovation</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        {/* Mobile Header in Sidebar */}
        <div className="lg:hidden p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Megapro Innovation" className="h-8" />
            <div>
              <p className="text-sm font-medium text-[#1F2937]">Menu</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false); // Close sidebar on mobile after selection
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#1F2937] hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="mb-4 px-4">
            <p className="text-sm text-gray-500">Logged in as</p>
            <p className="text-[#1F2937]">{userName}</p>
            <p className="text-xs text-gray-400 mt-1">Admin</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          
          {/* Footer Branding */}
          <div className="mt-4 px-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">© 2025 Megapro Innovation</p>
            <p className="text-xs text-gray-400 text-center mt-1">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto min-w-0 w-full pt-16 lg:pt-0">
        {renderContent()}
      </div>
    </div>
  );
}
