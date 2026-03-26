export function parseSRT(content: string): string {
  return content
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      if (/^\d+$/.test(trimmed)) return false;
      if (/\d{2}:\d{2}:\d{2}[,.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,.]\d{3}/.test(trimmed)) return false;
      return true;
    })
    .join('\n')
    .trim();
}

export function parseVTT(content: string): string {
  const lines = content.split(/\r?\n/);
  const result: string[] = [];
  let skipNext = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === 'WEBVTT' || trimmed.startsWith('NOTE ') || trimmed.startsWith('Kind:') || trimmed.startsWith('Language:')) {
      continue;
    }
    if (/\d{2}:\d{2}[:.]\d{2,3}\s*-->\s*\d{2}:\d{2}[:.]\d{2,3}/.test(trimmed)) {
      skipNext = false;
      continue;
    }
    if (/^\d+$/.test(trimmed)) {
      continue;
    }
    if (!trimmed) {
      skipNext = false;
      continue;
    }
    // Strip inline VTT tags like <v Speaker>, </v>, <c>, etc.
    const cleaned = trimmed.replace(/<[^>]+>/g, '').trim();
    if (cleaned) {
      result.push(cleaned);
    }
  }

  return result.join('\n').trim();
}

export function detectFormat(filename: string): 'srt' | 'vtt' | 'txt' {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'srt') return 'srt';
  if (ext === 'vtt') return 'vtt';
  return 'txt';
}

export function parseTranscript(content: string, filename: string): string {
  const format = detectFormat(filename);
  switch (format) {
    case 'srt':
      return parseSRT(content);
    case 'vtt':
      return parseVTT(content);
    default:
      return content.trim();
  }
}
