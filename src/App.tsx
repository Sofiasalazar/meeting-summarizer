import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTokenCounter } from './hooks/useTokenCounter';
import { summarizeTranscript } from './lib/anthropic';
import { Header } from './components/Header';
import { DataNotice } from './components/DataNotice';
import { FooterCTA } from './components/FooterCTA';
import { SettingsModal } from './components/SettingsModal';
import { EmptyState } from './components/EmptyState';
import { TranscriptInput } from './components/TranscriptInput';
import { SummaryOutput } from './components/SummaryOutput';
import { FormatToggle } from './components/FormatToggle';
import { ExportMenu } from './components/ExportMenu';
import { HistorySidebar } from './components/HistorySidebar';
import type { MeetingSummary, OutputFormat, SummaryEntry } from './types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const App: React.FC = () => {
  const [apiKey, setApiKey] = useLocalStorage('agenticsis_meeting-summarizer_api_key', '');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { usage, totalTokens, addUsage } = useTokenCounter();

  // Current session state
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [narrativeText, setNarrativeText] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [format, setFormat] = useState<OutputFormat>('structured');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History (session-only)
  const [history, setHistory] = useState<SummaryEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  // Sidebar visibility on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hasApiKey = apiKey.length > 0;
  const hasResult = summary !== null || narrativeText !== null;

  const handleSummarize = useCallback(async () => {
    if (!apiKey || !transcript.trim()) return;
    setIsProcessing(true);
    setError(null);

    try {
      const result = await summarizeTranscript(apiKey, transcript, format);
      setSummary(result.summary);
      setNarrativeText(result.narrativeText);
      setRawText(result.rawText);
      addUsage(result.inputTokens, result.outputTokens);

      const entry: SummaryEntry = {
        id: generateId(),
        transcriptPreview: transcript.slice(0, 80).replace(/\n/g, ' '),
        fullTranscript: transcript,
        summary: result.summary,
        narrativeSummary: result.narrativeText,
        format,
        tokens: { input: result.inputTokens, output: result.outputTokens },
        timestamp: Date.now(),
      };
      setHistory((prev) => [entry, ...prev]);
      setActiveEntryId(entry.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  }, [apiKey, transcript, format, addUsage]);

  const handleSelectEntry = useCallback((id: string) => {
    const entry = history.find((e) => e.id === id);
    if (!entry) return;
    setTranscript(entry.fullTranscript);
    setSummary(entry.summary);
    setNarrativeText(entry.narrativeSummary);
    setRawText(null);
    setFormat(entry.format);
    setActiveEntryId(id);
    setError(null);
    setSidebarOpen(false);
  }, [history]);

  const handleDeleteEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
    if (activeEntryId === id) {
      setActiveEntryId(null);
    }
  }, [activeEntryId]);

  const handleNew = useCallback(() => {
    setTranscript('');
    setSummary(null);
    setNarrativeText(null);
    setRawText(null);
    setError(null);
    setActiveEntryId(null);
    setSidebarOpen(false);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <Header
        hasApiKey={hasApiKey}
        tokenUsage={usage}
        totalTokens={totalTokens}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <DataNotice />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={setApiKey}
        onClearApiKey={() => setApiKey('')}
      />

      {/* Main content area */}
      <main className="flex-1 flex pt-14 pb-12 min-h-0 overflow-hidden">
        {/* Sidebar - hidden on mobile, shown on lg+ */}
        {history.length > 0 && (
          <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-60 flex-shrink-0 border-r border-[#262626] bg-[#0A0A0A]">
              <HistorySidebar
                entries={history}
                activeId={activeEntryId}
                onSelect={handleSelectEntry}
                onDelete={handleDeleteEntry}
                onNew={handleNew}
              />
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-[90] lg:hidden">
                <div
                  className="absolute inset-0 bg-black/60"
                  onClick={() => setSidebarOpen(false)}
                />
                <aside className="absolute left-0 top-14 bottom-12 w-72 bg-[#0A0A0A] border-r border-[#262626]">
                  <HistorySidebar
                    entries={history}
                    activeId={activeEntryId}
                    onSelect={handleSelectEntry}
                    onDelete={handleDeleteEntry}
                    onNew={handleNew}
                  />
                </aside>
              </div>
            )}
          </>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
            {/* Input panel */}
            <div className="flex flex-col p-4 lg:w-[35%] lg:flex-shrink-0 lg:border-r lg:border-[#262626] min-h-[200px] lg:min-h-0">
              <TranscriptInput
                transcript={transcript}
                onChange={setTranscript}
                onSummarize={handleSummarize}
                isProcessing={isProcessing}
                hasApiKey={hasApiKey}
                onOpenSettings={() => setSettingsOpen(true)}
              />
            </div>

            {/* Output panel */}
            <div className="flex-1 flex flex-col p-4 min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-[14px] font-semibold text-[#F5F5F5]">Summary</h3>
                  <FormatToggle format={format} onChange={setFormat} />
                  {history.length > 0 && (
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="lg:hidden text-[12px] text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
                    >
                      History ({history.length})
                    </button>
                  )}
                </div>
                <ExportMenu
                  summary={summary}
                  narrativeText={narrativeText}
                  format={format}
                />
              </div>

              {error && (
                <div className="mb-3 px-3 py-2 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg">
                  <p className="text-[13px] text-[#ef4444]">{error}</p>
                </div>
              )}

              <div className="flex-1 overflow-y-auto min-h-0">
                {!hasResult && !isProcessing ? (
                  <EmptyState
                    hasApiKey={hasApiKey}
                    onOpenSettings={() => setSettingsOpen(true)}
                  />
                ) : (
                  <SummaryOutput
                    summary={summary}
                    narrativeText={narrativeText}
                    rawText={rawText}
                    format={format}
                    isProcessing={isProcessing}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterCTA />
    </div>
  );
};

export default App;
