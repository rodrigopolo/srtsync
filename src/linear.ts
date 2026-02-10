import type { Subtitle } from "./parser.js";

/**
 * Linearly rescale all timestamps so that the first subtitle's start time
 * maps to `newFirstMs` and the last subtitle's start time maps to `newLastMs`.
 */
export function applyLinearCorrection(
  subtitles: Subtitle[],
  newFirstMs: number,
  newLastMs: number
): Subtitle[] {
  if (subtitles.length < 2) {
    throw new Error("Need at least 2 subtitles for linear correction");
  }

  const origFirst = subtitles[0].startMs;
  const origLast = subtitles[subtitles.length - 1].startMs;
  const scale = (newLastMs - newFirstMs) / (origLast - origFirst);

  return subtitles.map((sub) => ({
    ...sub,
    startMs: Math.max(0, Math.round(newFirstMs + (sub.startMs - origFirst) * scale)),
    endMs: Math.max(0, Math.round(newFirstMs + (sub.endMs - origFirst) * scale)),
  }));
}
