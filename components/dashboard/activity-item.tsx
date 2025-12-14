import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  icon: LucideIcon;
  description: string;
  time: string;
}

export function ActivityItem({ icon: Icon, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 hover:bg-[#F8FAFC] rounded-lg transition-colors">
      <div className="p-2 bg-[#D1FAE5] rounded-lg">
        <Icon className="h-5 w-5 text-[#065F46]" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[#1F2937]">{description}</p>
        <p className="text-xs text-[#6B7280] mt-1">{time}</p>
      </div>
    </div>
  );
}
