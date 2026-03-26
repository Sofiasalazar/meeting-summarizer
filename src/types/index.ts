export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
}

export interface ActionItem {
  task: string;
  assignee: string | null;
  deadline: string | null;
}

export interface MeetingSummary {
  executiveSummary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  topicsDiscussed: string[];
  participants: string[];
  followUpQuestions: string[];
}

export interface SummaryEntry {
  id: string;
  transcriptPreview: string;
  fullTranscript: string;
  summary: MeetingSummary | null;
  narrativeSummary: string | null;
  format: 'structured' | 'narrative';
  tokens: { input: number; output: number };
  timestamp: number;
}

export type OutputFormat = 'structured' | 'narrative';
