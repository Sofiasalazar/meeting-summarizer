import React from 'react';
import {
  FileText,
  CheckSquare,
  ListChecks,
  MessageSquare,
  Users,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { SummarySection } from './SummarySection';
import type { MeetingSummary } from '../types';

interface Props {
  summary: MeetingSummary | null;
  narrativeText: string | null;
  rawText: string | null;
  format: 'structured' | 'narrative';
  isProcessing: boolean;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="border border-[#262626] rounded-lg p-4">
        <div className="h-4 bg-[#262626] rounded w-1/3 mb-3" />
        <div className="space-y-2">
          <div className="h-3 bg-[#1a1a1a] rounded w-full" />
          <div className="h-3 bg-[#1a1a1a] rounded w-4/5" />
        </div>
      </div>
    ))}
  </div>
);

export const SummaryOutput: React.FC<Props> = ({
  summary,
  narrativeText,
  rawText,
  format,
  isProcessing,
}) => {
  if (isProcessing) return <LoadingSkeleton />;

  if (format === 'narrative' && narrativeText) {
    return (
      <div className="border border-[#262626] rounded-lg p-5">
        <p className="text-[14px] text-[#d4d4d4] leading-relaxed whitespace-pre-wrap">
          {narrativeText}
        </p>
      </div>
    );
  }

  if (format === 'structured' && !summary && rawText) {
    return (
      <div className="border border-[#262626] rounded-lg p-5">
        <div className="flex items-start gap-2 mb-3">
          <AlertCircle size={16} className="text-[#ef4444] mt-0.5 flex-shrink-0" />
          <p className="text-[13px] text-[#ef4444]">
            Could not parse structured output. Showing raw response.
          </p>
        </div>
        <p className="text-[14px] text-[#d4d4d4] leading-relaxed whitespace-pre-wrap">
          {rawText}
        </p>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-3">
      <SummarySection icon={FileText} title="Executive Summary">
        <p>{summary.executiveSummary}</p>
      </SummarySection>

      {summary.keyDecisions.length > 0 && (
        <SummarySection
          icon={CheckSquare}
          title="Key Decisions"
          count={summary.keyDecisions.length}
        >
          <ul className="space-y-1.5">
            {summary.keyDecisions.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#8b5cf6] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#8b5cf6] flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </SummarySection>
      )}

      {summary.actionItems.length > 0 && (
        <SummarySection
          icon={ListChecks}
          title="Action Items"
          count={summary.actionItems.length}
        >
          <ul className="space-y-2">
            {summary.actionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-4 h-4 border border-[#525252] rounded mt-0.5 flex-shrink-0" />
                <div>
                  <span>{item.task}</span>
                  {item.assignee && (
                    <span className="ml-2 text-[12px] text-[#8b5cf6] bg-[#8b5cf6]/10 px-1.5 py-0.5 rounded">
                      {item.assignee}
                    </span>
                  )}
                  {item.deadline && (
                    <span className="ml-1.5 text-[12px] text-[#A3A3A3]">
                      by {item.deadline}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </SummarySection>
      )}

      {summary.topicsDiscussed.length > 0 && (
        <SummarySection
          icon={MessageSquare}
          title="Topics Discussed"
          count={summary.topicsDiscussed.length}
        >
          <ul className="space-y-1.5">
            {summary.topicsDiscussed.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#8b5cf6] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#8b5cf6] flex-shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </SummarySection>
      )}

      {summary.participants.length > 0 && (
        <SummarySection
          icon={Users}
          title="Participants"
          count={summary.participants.length}
        >
          <div className="flex flex-wrap gap-2">
            {summary.participants.map((p, i) => (
              <span
                key={i}
                className="text-[13px] text-[#F5F5F5] bg-[#262626] px-2.5 py-1 rounded-full"
              >
                {p}
              </span>
            ))}
          </div>
        </SummarySection>
      )}

      {summary.followUpQuestions.length > 0 && (
        <SummarySection
          icon={HelpCircle}
          title="Follow-up / Open Items"
          count={summary.followUpQuestions.length}
        >
          <ul className="space-y-1.5">
            {summary.followUpQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#84cc16] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#84cc16] flex-shrink-0" />
                {q}
              </li>
            ))}
          </ul>
        </SummarySection>
      )}
    </div>
  );
};
