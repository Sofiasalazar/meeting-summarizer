import React from 'react';
import type { OutputFormat } from '../types';

interface Props {
  format: OutputFormat;
  onChange: (format: OutputFormat) => void;
}

export const FormatToggle: React.FC<Props> = ({ format, onChange }) => {
  return (
    <div className="inline-flex bg-[#141414] border border-[#262626] rounded-lg p-0.5">
      <button
        onClick={() => onChange('structured')}
        className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
          format === 'structured'
            ? 'bg-[#8b5cf6] text-white'
            : 'text-[#A3A3A3] hover:text-[#F5F5F5]'
        }`}
      >
        Structured
      </button>
      <button
        onClick={() => onChange('narrative')}
        className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
          format === 'narrative'
            ? 'bg-[#8b5cf6] text-white'
            : 'text-[#A3A3A3] hover:text-[#F5F5F5]'
        }`}
      >
        Narrative
      </button>
    </div>
  );
};
