interface DeadlineItemProps {
  title: string;
  date: string;
  color: 'red' | 'orange' | 'green';
}

const colorClasses = {
  red: 'bg-[#EF4444]',
  orange: 'bg-[#F59E0B]',
  green: 'bg-[#10B981]',
};

export function DeadlineItem({ title, date, color }: DeadlineItemProps) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className={`w-2 h-2 rounded-full ${colorClasses[color]}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-[#1F2937]">{title}</p>
        <p className="text-xs text-[#6B7280] mt-0.5">{date}</p>
      </div>
    </div>
  );
}
