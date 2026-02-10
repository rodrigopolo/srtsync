import type { Subtitle } from "./parser.js";

/**
 * Add a fixed offset (in milliseconds) to every subtitle timestamp.
 * Clamps results to 0.
 */
export function applyShift(subtitles: Subtitle[], offsetMs: number): Subtitle[] {
  return subtitles.map((sub) => ({
    ...sub,
    startMs: Math.max(0, sub.startMs + offsetMs),
    endMs: Math.max(0, sub.endMs + offsetMs),
  }));
}
