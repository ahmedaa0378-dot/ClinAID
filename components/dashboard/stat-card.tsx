import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  iconBgColor: string;
  iconColor: string;
}

export function StatCard({ icon: Icon, value, label, iconBgColor, iconColor }: StatCardProps) {
  return (
    <Card className="p-6 bg-white rounded-xl shadow-sm border-0">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold text-[#1F2937] mb-1">{value}</p>
          <p className="text-sm text-[#6B7280]">{label}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}
