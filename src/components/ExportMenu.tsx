import React, { useState, useRef, useEffect } from 'react';
import { Download, Copy, Check, ChevronDown, FileText, FileType, FileDown, Mail } from 'lucide-react';
import {
  summaryToMarkdown,
  summaryToPlainText,
  summaryToHtml,
  summaryToDocx,
  summaryToPdf,
  narrativeToMarkdown,
  narrativeToHtml,
  narrativeToDocx,
  narrativeToPdf,
  downloadFile,
  copyToClipboard,
} from '../lib/export';
import type { MeetingSummary } from '../types';

interface Props {
  summary: MeetingSummary | null;
  narrativeText: string | null;
  format: 'structured' | 'narrative';
}

export const ExportMenu: React.FC<Props> = ({ summary, narrativeText, format }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasContent =
    (format === 'structured' && summary) ||
    (format === 'narrative' && narrativeText);

  if (!hasContent) return null;

  const getMarkdown = () => {
    if (format === 'structured' && summary) return summaryToMarkdown(summary);
    if (format === 'narrative' && narrativeText) return narrativeToMarkdown(narrativeText);
    return '';
  };

  const getPlainText = () => {
    if (format === 'structured' && summary) return summaryToPlainText(summary);
    if (format === 'narrative' && narrativeText) return narrativeText;
    return '';
  };

  const handleCopy = async () => {
    const md = getMarkdown();
    const success = await copyToClipboard(md);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setIsOpen(false);
  };

  const handleDownloadMd = () => {
    downloadFile(getMarkdown(), 'meeting-summary.md', 'text/markdown');
    setIsOpen(false);
  };

  const handleDownloadTxt = () => {
    downloadFile(getPlainText(), 'meeting-summary.txt', 'text/plain');
    setIsOpen(false);
  };

  const handleDownloadHtml = () => {
    const html = format === 'structured' && summary
      ? summaryToHtml(summary)
      : narrativeText
        ? narrativeToHtml(narrativeText)
        : '';
    downloadFile(html, 'meeting-summary.html', 'text/html');
    setIsOpen(false);
  };

  const handleDownloadDocx = async () => {
    if (format === 'structured' && summary) {
      await summaryToDocx(summary);
    } else if (format === 'narrative' && narrativeText) {
      await narrativeToDocx(narrativeText);
    }
    setIsOpen(false);
  };

  const handleDownloadPdf = () => {
    if (format === 'structured' && summary) {
      summaryToPdf(summary);
    } else if (format === 'narrative' && narrativeText) {
      narrativeToPdf(narrativeText);
    }
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#A3A3A3] hover:text-[#F5F5F5] bg-[#141414] border border-[#262626] rounded-lg transition-colors"
      >
        {copied ? <Check size={14} className="text-[#84cc16]" /> : <Download size={14} />}
        {copied ? 'Copied' : 'Export'}
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-[#141414] border border-[#262626] rounded-lg shadow-xl overflow-hidden z-50">
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#d4d4d4] hover:bg-[#1a1a1a] transition-colors text-left"
          >
            <Copy size={14} className="text-[#A3A3A3]" />
            Copy as Markdown
          </button>
          <div className="border-t border-[#262626]" />
          <button
            onClick={handleDownloadMd}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#d4d4d4] hover:bg-[#1a1a1a] transition-colors text-left"
          >
            <FileText size={14} className="text-[#A3A3A3]" />
            Download .md
          </button>
          <button
            onClick={handleDownloadTxt}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#d4d4d4] hover:bg-[#1a1a1a] transition-colors text-left"
          >
            <FileDown size={14} className="text-[#A3A3A3]" />
            Download .txt
          </button>
          <div className="border-t border-[#262626]" />
          <button
            onClick={handleDownloadDocx}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#d4d4d4] hover:bg-[#1a1a1a] transition-colors text-left"
          >
            <FileType size={14} className="text-[#8b5cf6]" />
            Download .docx
          </button>
          <button
            onClick={handleDownloadPdf}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#d4d4d4] hover:bg-[#1a1a1a] transition-colors text-left"
          >
            <FileDown size={14} className="text-[#ef4444]" />
            Download .pdf
          </button>
          <button
            onClick={handleDownloadHtml}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#d4d4d4] hover:bg-[#1a1a1a] transition-colors text-left"
          >
            <Mail size={14} className="text-[#84cc16]" />
            Download .html (email)
          </button>
        </div>
      )}
    </div>
  );
};
