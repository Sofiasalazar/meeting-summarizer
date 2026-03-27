import React from 'react';
import { Plus, Clock, Trash2 } from 'lucide-react';
import type { SummaryEntry } from '../types';

interface Props {
  entries: SummaryEntry[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export const HistorySidebar: React.FC<Props> = ({
  entries,
  activeId,
  onSelect,
  onDelete,
  onNew,
}) => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]">
        <h3 className="text-[13px] font-semibold text-[#F5F5F5]">History</h3>
        <button
          onClick={onNew}
          className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors p-1 rounded"
          aria-label="New summary"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-[12px] text-[#525252]">No summaries yet</p>
          </div>
        ) : (
          <div className="py-1">
            {entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelect(entry.id)}
                className={`group flex items-start gap-2 px-4 py-2.5 cursor-pointer transition-colors ${
                  activeId === entry.id
                    ? 'bg-[#8b5cf6]/10 border-l-2 border-[#8b5cf6]'
                    : 'hover:bg-[#141414] border-l-2 border-transparent'
                }`}
              >
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-[13px] text-[#d4d4d4] truncate block max-w-full">
                    {entry.transcriptPreview}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={10} className="text-[#525252]" />
                    <span className="text-[11px] text-[#525252]">
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-[#525252] hover:text-[#ef4444] transition-all p-0.5"
                  aria-label="Delete entry"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
