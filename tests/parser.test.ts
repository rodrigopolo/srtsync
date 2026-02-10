import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { parseSrt, formatSrt } from "../src/parser.js";

const FIXTURE_DIR = resolve(import.meta.dirname, "..");

describe("parseSrt", () => {
  it("parses a minimal SRT", () => {
    const srt = `1
00:00:01,000 --> 00:00:02,000
Hello

2
00:00:03,000 --> 00:00:04,000
World
`;
    const result = parseSrt(srt);
    expect(result).toHaveLength(2);
    expect(result[0].startMs).toBe(1000);
    expect(result[0].endMs).toBe(2000);
    expect(result[0].text).toBe("Hello");
    expect(result[1].text).toBe("World");
  });

  it("handles CRLF line endings", () => {
    const srt = "1\r\n00:00:01,000 --> 00:00:02,000\r\nHello\r\n\r\n";
    const result = parseSrt(srt);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("Hello");
  });

  it("handles multi-line subtitle text", () => {
    const srt = `1
00:00:01,000 --> 00:00:02,000
Line one
Line two
`;
    const result = parseSrt(srt);
    expect(result[0].text).toBe("Line one\nLine two");
  });

  it("parses sub.srt fixture with 821 subtitles", () => {
    const content = readFileSync(resolve(FIXTURE_DIR, "sub.srt"), "utf-8");
    const subs = parseSrt(content);
    expect(subs).toHaveLength(821);
    expect(subs[0].startMs).toBe(20400); // 00:00:20,400
    expect(subs[820].startMs).toBe(4535220); // 01:15:35,220
  });
});

describe("formatSrt", () => {
  it("re-indexes from 1", () => {
    const subs = [
      { index: 5, startMs: 1000, endMs: 2000, text: "Hello" },
      { index: 10, startMs: 3000, endMs: 4000, text: "World" },
    ];
    const result = formatSrt(subs);
    expect(result).toContain("1\n00:00:01,000");
    expect(result).toContain("2\n00:00:03,000");
  });

  it("round-trips parse -> format -> parse", () => {
    const original = `1
00:00:01,000 --> 00:00:02,000
Hello

2
00:00:03,000 --> 00:00:04,000
World
`;
    const subs = parseSrt(original);
    const formatted = formatSrt(subs);
    const reparsed = parseSrt(formatted);
    expect(reparsed).toEqual(subs.map((s, i) => ({ ...s, index: i + 1 })));
  });
});
