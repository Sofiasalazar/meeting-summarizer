import React, { useRef } from 'react';
import { Upload, Loader2, Trash2 } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';

interface Props {
  transcript: string;
  onChange: (value: string) => void;
  onSummarize: () => void;
  isProcessing: boolean;
  hasApiKey: boolean;
  onOpenSettings: () => void;
}

export const TranscriptInput: React.FC<Props> = ({
  transcript,
  onChange,
  onSummarize,
  isProcessing,
  hasApiKey,
  onOpenSettings,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileSelect, isDragging, dragHandlers } = useFileUpload((text) => {
    onChange(text);
  });

  const charCount = transcript.length;
  const isLong = charCount > 100_000;
  const isEmpty = charCount === 0;

  const handleSubmit = () => {
    if (!hasApiKey) {
      onOpenSettings();
      return;
    }
    onSummarize();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-[#F5F5F5]">Transcript</h3>
        <div className="flex items-center gap-2">
          {!isEmpty && (
            <button
              onClick={() => onChange('')}
              className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors p-1 rounded"
              aria-label="Clear transcript"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-[12px] text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
          >
            <Upload size={14} />
            Upload file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.srt,.vtt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      <div
        className={`relative flex-1 min-h-0 ${isDragging ? 'ring-2 ring-[#8b5cf6] rounded-lg' : ''}`}
        {...dragHandlers}
      >
        <textarea
          value={transcript}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your meeting transcript here, or drag and drop a file..."
          disabled={isProcessing}
          className="w-full h-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-3 text-[14px] text-[#F5F5F5] font-normal placeholder:text-[#525252] resize-none focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/30 disabled:opacity-50"
        />
        {isDragging && (
          <div className="absolute inset-0 bg-[#8b5cf6]/10 border-2 border-dashed border-[#8b5cf6] rounded-lg flex items-center justify-center">
            <p className="text-[14px] text-[#8b5cf6] font-medium">Drop file here</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <span className={`text-[12px] ${isLong ? 'text-[#ef4444]' : 'text-[#A3A3A3]'}`}>
            {charCount.toLocaleString()} characters
          </span>
          {isLong && (
            <span className="text-[11px] text-[#ef4444]">
              Very long transcript -- may use significant tokens
            </span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isEmpty || isProcessing}
          className="flex items-center gap-2 px-5 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:bg-[#262626] disabled:text-[#525252] text-white text-[14px] font-semibold rounded-lg transition-colors"
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Summarizing...
            </>
          ) : (
            'Summarize'
          )}
        </button>
      </div>
    </div>
  );
};
