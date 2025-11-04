import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

export default function StatsCard({ title, value, icon: Icon, iconColor = '#2563EB', bgColor = 'bg-white' }: StatsCardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-4 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        {Icon && (
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${iconColor}15` }}>
            <Icon size={20} style={{ color: iconColor }} />
          </div>
        )}
      </div>
      <p className="text-[#1F2937]">{value}</p>
    </div>
  );
}
