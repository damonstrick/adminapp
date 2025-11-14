import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  showDirtyDot?: boolean;
  action?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  showDirtyDot = false,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`w-full flex items-center gap-2 mb-4 h-6 ${className}`}>
      <div className="flex items-center gap-2 flex-1 h-6">
        <p className="font-semibold text-sm text-[#121313]">{title}</p>
        {showDirtyDot && <div className="w-2 h-2 bg-[#16696d] rounded-full ml-1" />}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

