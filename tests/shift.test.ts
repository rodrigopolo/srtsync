import { describe, it, expect } from "vitest";
import { applyShift } from "../src/shift.js";
import type { Subtitle } from "../src/parser.js";

function makeSubs(): Subtitle[] {
  return [
    { index: 1, startMs: 1000, endMs: 2000, text: "A" },
    { index: 2, startMs: 3000, endMs: 4000, text: "B" },
  ];
}

describe("applyShift", () => {
  it("shifts timestamps by a positive offset", () => {
    const result = applyShift(makeSubs(), 500);
    expect(result[0].startMs).toBe(1500);
    expect(result[0].endMs).toBe(2500);
    expect(result[1].startMs).toBe(3500);
    expect(result[1].endMs).toBe(4500);
  });

  it("shifts timestamps by a negative offset", () => {
    const result = applyShift(makeSubs(), -500);
    expect(result[0].startMs).toBe(500);
    expect(result[0].endMs).toBe(1500);
  });

  it("clamps to zero on large negative offset", () => {
    const result = applyShift(makeSubs(), -1500);
    expect(result[0].startMs).toBe(0);
    expect(result[0].endMs).toBe(500);
  });

  it("identity with zero offset", () => {
    const subs = makeSubs();
    const result = applyShift(subs, 0);
    expect(result[0].startMs).toBe(subs[0].startMs);
    expect(result[1].endMs).toBe(subs[1].endMs);
  });

  it("does not mutate original array", () => {
    const subs = makeSubs();
    applyShift(subs, 1000);
    expect(subs[0].startMs).toBe(1000);
  });
});
