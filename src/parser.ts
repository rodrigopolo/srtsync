import { parseTimestamp, formatTimestamp } from "./time.js";

export interface Subtitle {
  index: number;
  startMs: number;
  endMs: number;
  text: string;
}

/**
 * Parse an SRT file into an array of Subtitle objects.
 */
export function parseSrt(content: string): Subtitle[] {
  // Strip BOM and normalize line endings
  const normalized = content.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Split on blank lines (one or more consecutive empty lines)
  const blocks = normalized.trim().split(/\n\n+/);
  const subtitles: Subtitle[] = [];

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 3) continue;

    const index = parseInt(lines[0], 10);
    if (isNaN(index)) continue;

    const timeLine = lines[1];
    const timeMatch = timeLine.match(
      /(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})/
    );
    if (!timeMatch) continue;

    const startMs = parseTimestamp(timeMatch[1]);
    const endMs = parseTimestamp(timeMatch[2]);
    const text = lines.slice(2).join("\n");

    subtitles.push({ index, startMs, endMs, text });
  }

  return subtitles;
}

/**
 * Serialize an array of Subtitle objects back to SRT format.
 * Re-indexes subtitles starting from 1.
 */
export function formatSrt(subtitles: Subtitle[]): string {
  return subtitles
    .map((sub, i) => {
      const idx = i + 1;
      const start = formatTimestamp(sub.startMs);
      const end = formatTimestamp(sub.endMs);
      return `${idx}\n${start} --> ${end}\n${sub.text}`;
    })
    .join("\n\n") + "\n";
}
