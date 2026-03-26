import { useState, useCallback } from 'react';
import { parseTranscript } from '../lib/parsers';

const ACCEPTED_EXTENSIONS = ['.txt', '.srt', '.vtt'];

export function useFileUpload(onTextLoaded: (text: string) => void) {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        return 'Unsupported file type. Please upload .txt, .srt, or .vtt.';
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const parsed = parseTranscript(content, file.name);
        if (!parsed.trim()) {
          return;
        }
        onTextLoaded(parsed);
      };
      reader.readAsText(file);
      return null;
    },
    [onTextLoaded]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = '';
    },
    [processFile]
  );

  const dragHandlers = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
  };

  return { handleFileSelect, isDragging, dragHandlers };
}
