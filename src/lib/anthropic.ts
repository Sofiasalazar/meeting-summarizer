import { STRUCTURED_PROMPT, NARRATIVE_PROMPT } from './system-prompt';
import type { MeetingSummary, OutputFormat } from '../types';

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface SummarizeResult {
  summary: MeetingSummary | null;
  narrativeText: string | null;
  rawText: string;
  inputTokens: number;
  outputTokens: number;
}

function extractJSON(text: string): MeetingSummary | null {
  // Try raw parse first
  try {
    return JSON.parse(text) as MeetingSummary;
  } catch {
    // continue
  }

  // Strip markdown fences
  const stripped = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    return JSON.parse(stripped) as MeetingSummary;
  } catch {
    // continue
  }

  // Find first { to last }
  const firstBrace = stripped.indexOf('{');
  const lastBrace = stripped.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(stripped.slice(firstBrace, lastBrace + 1)) as MeetingSummary;
    } catch {
      // continue
    }
  }

  return null;
}

function validateSummary(obj: MeetingSummary): MeetingSummary {
  return {
    executiveSummary: obj.executiveSummary || '',
    keyDecisions: Array.isArray(obj.keyDecisions) ? obj.keyDecisions : [],
    actionItems: Array.isArray(obj.actionItems)
      ? obj.actionItems.map((item) => ({
          task: item.task || '',
          assignee: item.assignee || null,
          deadline: item.deadline || null,
        }))
      : [],
    topicsDiscussed: Array.isArray(obj.topicsDiscussed) ? obj.topicsDiscussed : [],
    participants: Array.isArray(obj.participants) ? obj.participants : [],
    followUpQuestions: Array.isArray(obj.followUpQuestions) ? obj.followUpQuestions : [],
  };
}

export async function summarizeTranscript(
  apiKey: string,
  transcript: string,
  format: OutputFormat
): Promise<SummarizeResult> {
  const systemPrompt = format === 'structured' ? STRUCTURED_PROMPT : NARRATIVE_PROMPT;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: transcript }],
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 401) throw new Error('Invalid API key. Check your key in Settings and try again.');
    if (status === 429) throw new Error('Rate limit reached. Wait a moment and try again.');
    if (status === 529) throw new Error('Anthropic is overloaded. Try again in a few seconds.');
    throw new Error('Could not reach Anthropic. Check your connection and try again.');
  }

  const data: AnthropicResponse = await response.json();
  const text = data.content[0]?.text || '';

  if (format === 'structured') {
    const parsed = extractJSON(text);
    return {
      summary: parsed ? validateSummary(parsed) : null,
      narrativeText: null,
      rawText: text,
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
    };
  }

  return {
    summary: null,
    narrativeText: text.trim(),
    rawText: text,
    inputTokens: data.usage.input_tokens,
    outputTokens: data.usage.output_tokens,
  };
}
