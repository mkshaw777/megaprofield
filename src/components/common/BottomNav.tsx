import { Home, Users, Receipt, Calendar, User, LayoutDashboard, Map, CheckCircle, BarChart, Briefcase, CheckSquare } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Tab[];
}

const iconMap: Record<string, any> = {
  home: Home,
  users: Users,
  receipt: Receipt,
  calendar: Calendar,
  user: User,
  'layout-dashboard': LayoutDashboard,
  map: Map,
  'check-circle': CheckCircle,
  'check-square': CheckSquare,
  'bar-chart': BarChart,
  briefcase: Briefcase,
};

export default function BottomNav({ activeTab, onTabChange, tabs }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 safe-area-inset-bottom">
      <div className="flex justify-around items-center max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const Icon = iconMap[tab.icon];
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 px-3 py-2 min-w-0"
            >
              <Icon
                size={24}
                className={isActive ? 'text-[#2563EB]' : 'text-gray-500'}
              />
              <span
                className={`text-xs ${
                  isActive ? 'text-[#2563EB]' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
