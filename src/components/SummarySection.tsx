import React, { useState } from 'react';
import { ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}

export const SummarySection: React.FC<Props> = ({
  icon: Icon,
  title,
  children,
  defaultOpen = true,
  count,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#262626] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2.5 px-4 py-3 bg-[#141414] hover:bg-[#1a1a1a] transition-colors text-left"
      >
        {isOpen ? (
          <ChevronDown size={16} className="text-[#A3A3A3] flex-shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-[#A3A3A3] flex-shrink-0" />
        )}
        <Icon size={16} className="text-[#8b5cf6] flex-shrink-0" />
        <span className="text-[14px] font-semibold text-[#F5F5F5] flex-1">{title}</span>
        {count !== undefined && count > 0 && (
          <span className="text-[11px] text-[#A3A3A3] bg-[#262626] px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="px-4 py-3 text-[14px] text-[#d4d4d4] leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};
