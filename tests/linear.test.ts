import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { parseSrt } from "../src/parser.js";
import { applyLinearCorrection } from "../src/linear.js";

const FIXTURE_DIR = resolve(import.meta.dirname, "..");

describe("applyLinearCorrection", () => {
  it("linearly rescales timestamps", () => {
    const subs = [
      { index: 1, startMs: 0, endMs: 1000, text: "A" },
      { index: 2, startMs: 1000, endMs: 2000, text: "B" },
      { index: 3, startMs: 2000, endMs: 3000, text: "C" },
    ];
    const result = applyLinearCorrection(subs, 0, 4000);
    expect(result[0].startMs).toBe(0);
    expect(result[1].startMs).toBe(2000);
    expect(result[2].startMs).toBe(4000);
  });

  it("throws with fewer than 2 subtitles", () => {
    const subs = [{ index: 1, startMs: 0, endMs: 1000, text: "A" }];
    expect(() => applyLinearCorrection(subs, 0, 1000)).toThrow();
  });

  it("matches sub-resync.srt within 1ms tolerance for all 821 subtitles", () => {
    const origContent = readFileSync(resolve(FIXTURE_DIR, "sub.srt"), "utf-8");
    const resyncContent = readFileSync(resolve(FIXTURE_DIR, "sub-resync.srt"), "utf-8");

    const origSubs = parseSrt(origContent);
    const expectedSubs = parseSrt(resyncContent);

    expect(origSubs).toHaveLength(821);
    expect(expectedSubs).toHaveLength(821);

    // Reference timestamps from resynced file
    const newFirstMs = expectedSubs[0].startMs;   // 00:00:21,278 = 21278
    const newLastMs = expectedSubs[820].startMs;   // 01:18:48,956 = 4728956

    const result = applyLinearCorrection(origSubs, newFirstMs, newLastMs);

    for (let i = 0; i < 821; i++) {
      expect(Math.abs(result[i].startMs - expectedSubs[i].startMs)).toBeLessThanOrEqual(1);
      expect(Math.abs(result[i].endMs - expectedSubs[i].endMs)).toBeLessThanOrEqual(1);
    }
  });
});
