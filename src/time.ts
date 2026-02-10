/**
 * Parse an SRT timestamp (HH:MM:SS,mmm or HH:MM:SS.mmm) into milliseconds.
 */
export function parseTimestamp(ts: string): number {
  const m = ts.trim().match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/);
  if (!m) throw new Error(`Invalid timestamp: "${ts}"`);
  const [, h, min, sec, ms] = m;
  return Number(h) * 3600000 + Number(min) * 60000 + Number(sec) * 1000 + Number(ms);
}

/**
 * Format milliseconds into SRT timestamp format (HH:MM:SS,mmm).
 * Clamps negative values to 0.
 */
export function formatTimestamp(ms: number): string {
  if (ms < 0) ms = 0;
  const h = Math.floor(ms / 3600000);
  ms %= 3600000;
  const min = Math.floor(ms / 60000);
  ms %= 60000;
  const sec = Math.floor(ms / 1000);
  const millis = ms % 1000;
  return (
    String(h).padStart(2, "0") +
    ":" +
    String(min).padStart(2, "0") +
    ":" +
    String(sec).padStart(2, "0") +
    "," +
    String(millis).padStart(3, "0")
  );
}

/**
 * Parse a signed offset string like "+00:00:01.000" or "-00:00:02.500" into
 * signed milliseconds.
 */
export function parseOffset(offset: string): number {
  const m = offset.trim().match(/^([+-]?)(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/);
  if (!m) throw new Error(`Invalid offset: "${offset}"`);
  const [, sign, h, min, sec, ms] = m;
  const value = Number(h) * 3600000 + Number(min) * 60000 + Number(sec) * 1000 + Number(ms);
  return sign === "-" ? -value : value;
}
