interface SimpleProgressProps {
  value: number;
  className?: string;
}

export function SimpleProgress({ value, className = '' }: SimpleProgressProps) {
  return (
    <div className={`w-full bg-[#D1FAE5] rounded-full overflow-hidden h-2 ${className}`}>
      <div
        className="h-full bg-[#10B981] transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
