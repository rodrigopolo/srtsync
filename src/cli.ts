import { readFileSync, writeFileSync } from "fs";
import { timeShift, linearCorrection } from "./index.js";

function usage(): never {
  console.error(
    `Usage:
  srtsync shift <offset> <file.srt> [-o output.srt]
  srtsync linear <newFirst> <newLast> <file.srt> [-o output.srt]

Examples:
  srtsync shift +00:00:01.000 input.srt > output.srt
  srtsync linear 00:00:21.278 01:18:48.956 input.srt -o output.srt`
  );
  process.exit(1);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) usage();

  const command = args[0];
  let result: string;

  if (command === "shift") {
    if (args.length < 3) usage();
    const offset = args[1];
    const file = args[2];
    const content = readFileSync(file, "utf-8");
    result = timeShift(content, offset);
  } else if (command === "linear") {
    if (args.length < 4) usage();
    const newFirst = args[1];
    const newLast = args[2];
    const file = args[3];
    const content = readFileSync(file, "utf-8");
    result = linearCorrection(content, newFirst, newLast);
  } else {
    usage();
  }

  // Check for -o flag
  const oIdx = args.indexOf("-o");
  if (oIdx !== -1 && args[oIdx + 1]) {
    writeFileSync(args[oIdx + 1], result, "utf-8");
  } else {
    process.stdout.write(result);
  }
}

main();
