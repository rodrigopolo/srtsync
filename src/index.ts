export type { Subtitle } from "./parser.js";
export { parseSrt, formatSrt } from "./parser.js";
export { parseTimestamp, formatTimestamp } from "./time.js";
export { applyShift } from "./shift.js";
export { applyLinearCorrection } from "./linear.js";

import { parseSrt, formatSrt } from "./parser.js";
import { parseOffset, parseTimestamp } from "./time.js";
import { applyShift } from "./shift.js";
import { applyLinearCorrection } from "./linear.js";

/**
 * Parse an SRT string, shift all timestamps by the given offset, and return
 * the resynced SRT string.
 *
 * @param srtContent - Raw SRT file content
 * @param offset - Signed offset like "+00:00:01.000" or "-00:00:02.500"
 */
export function timeShift(srtContent: string, offset: string): string {
  const subs = parseSrt(srtContent);
  const offsetMs = parseOffset(offset);
  return formatSrt(applyShift(subs, offsetMs));
}

/**
 * Parse an SRT string, linearly rescale timestamps so that the first subtitle
 * starts at `newFirst` and the last subtitle starts at `newLast`, and return
 * the resynced SRT string.
 *
 * @param srtContent - Raw SRT file content
 * @param newFirst - New start time for the first subtitle (e.g. "00:00:21.278")
 * @param newLast  - New start time for the last subtitle (e.g. "01:18:48.956")
 */
export function linearCorrection(
  srtContent: string,
  newFirst: string,
  newLast: string
): string {
  const subs = parseSrt(srtContent);
  const newFirstMs = parseTimestamp(newFirst);
  const newLastMs = parseTimestamp(newLast);
  return formatSrt(applyLinearCorrection(subs, newFirstMs, newLastMs));
}
