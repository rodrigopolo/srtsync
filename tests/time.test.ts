import { describe, it, expect } from "vitest";
import { parseTimestamp, formatTimestamp, parseOffset } from "../src/time.js";

describe("parseTimestamp", () => {
  it("parses comma-separated SRT format", () => {
    expect(parseTimestamp("00:00:20,400")).toBe(20400);
  });

  it("parses dot-separated format", () => {
    expect(parseTimestamp("00:00:20.400")).toBe(20400);
  });

  it("parses hours correctly", () => {
    expect(parseTimestamp("01:15:35,220")).toBe(
      1 * 3600000 + 15 * 60000 + 35 * 1000 + 220
    );
  });

  it("parses zero", () => {
    expect(parseTimestamp("00:00:00,000")).toBe(0);
  });

  it("throws on invalid input", () => {
    expect(() => parseTimestamp("invalid")).toThrow();
    expect(() => parseTimestamp("00:00:20")).toThrow();
  });
});

describe("formatTimestamp", () => {
  it("formats milliseconds to SRT format", () => {
    expect(formatTimestamp(20400)).toBe("00:00:20,400");
  });

  it("formats with hours", () => {
    expect(formatTimestamp(4535220)).toBe("01:15:35,220");
  });

  it("formats zero", () => {
    expect(formatTimestamp(0)).toBe("00:00:00,000");
  });

  it("clamps negative values to zero", () => {
    expect(formatTimestamp(-1000)).toBe("00:00:00,000");
  });

  it("pads single digits", () => {
    expect(formatTimestamp(1001)).toBe("00:00:01,001");
  });
});

describe("parseOffset", () => {
  it("parses positive offset with +", () => {
    expect(parseOffset("+00:00:01.000")).toBe(1000);
  });

  it("parses negative offset with -", () => {
    expect(parseOffset("-00:00:02.500")).toBe(-2500);
  });

  it("parses unsigned offset as positive", () => {
    expect(parseOffset("00:00:01.000")).toBe(1000);
  });

  it("parses large offset", () => {
    expect(parseOffset("+01:30:00.000")).toBe(5400000);
  });

  it("throws on invalid input", () => {
    expect(() => parseOffset("invalid")).toThrow();
  });
});
