import React from 'react';
import { FileText, Key } from 'lucide-react';

interface Props {
  hasApiKey: boolean;
  onOpenSettings: () => void;
}

export const EmptyState: React.FC<Props> = ({ hasApiKey, onOpenSettings }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mb-6">
        <FileText size={32} className="text-[#8b5cf6]" />
      </div>
      <h2 className="text-[22px] font-bold text-[#F5F5F5] mb-2">
        Summarize any meeting transcript
      </h2>
      <p className="text-[14px] text-[#A3A3A3] max-w-md mb-6">
        Paste a transcript or upload a .txt, .srt, or .vtt file. Get structured
        summaries with action items, decisions, and follow-ups in seconds.
      </p>
      {!hasApiKey && (
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-[14px] font-semibold rounded-lg transition-colors"
        >
          <Key size={16} />
          Set up API key to start
        </button>
      )}
    </div>
  );
};
