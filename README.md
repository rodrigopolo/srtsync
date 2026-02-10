# srtsync

Resync SRT subtitle files — shift timestamps by a fixed offset or linearly rescale them to match a different video duration.

Works as a **CLI tool** and as a **Node.js / browser library**. Zero runtime dependencies.

## Install

```bash
npm install srtsync
```

## CLI

### Shift all timestamps by a fixed offset

```bash
srtsync shift <offset> <file.srt> [-o output.srt]
```

The offset format is `[+|-]HH:MM:SS.mmm`:

```bash
# Shift subtitles forward by 1.5 seconds
srtsync shift +00:00:01.500 movie.srt > movie-fixed.srt

# Shift subtitles back by 3 seconds, write to file
srtsync shift -00:00:03.000 movie.srt -o movie-fixed.srt
```

### Linearly rescale timestamps

Use this when the video has been rate-stretched (e.g. PAL speed-up from 24fps to 25fps) and all timestamps need proportional adjustment.

```bash
srtsync linear <newFirst> <newLast> <file.srt> [-o output.srt]
```

You provide the correct start time for the **first** and **last** subtitle. Every timestamp in between is linearly interpolated:

```bash
# The first subtitle should start at 00:00:21.278
# and the last subtitle should start at 01:18:48.956
srtsync linear 00:00:21.278 01:18:48.956 movie.srt > movie-fixed.srt
```

Output goes to **stdout** by default (pipe-friendly), or use `-o` to write directly to a file.

## Library

### `timeShift(srtContent, offset)`

Parse an SRT string, shift all timestamps, and return the resynced SRT string.

```js
import { timeShift } from "srtsync";
import { readFileSync } from "fs";

const srt = readFileSync("movie.srt", "utf-8");
const shifted = timeShift(srt, "+00:00:02.000");
```

### `linearCorrection(srtContent, newFirst, newLast)`

Parse an SRT string, linearly rescale all timestamps between two reference points, and return the resynced SRT string.

```js
import { linearCorrection } from "srtsync";
import { readFileSync } from "fs";

const srt = readFileSync("movie.srt", "utf-8");
const corrected = linearCorrection(srt, "00:00:21.278", "01:18:48.956");
```

### Lower-level API

For more control, you can work with parsed subtitle objects directly:

```js
import {
  parseSrt,
  formatSrt,
  applyShift,
  applyLinearCorrection,
  parseTimestamp,
  formatTimestamp,
} from "srtsync";

const subs = parseSrt(srtContent);
// => [{ index: 1, startMs: 20400, endMs: 21680, text: "Hello" }, ...]

// Shift by 5 seconds
const shifted = applyShift(subs, 5000);

// Or linearly rescale
const corrected = applyLinearCorrection(subs, 21278, 4728956);

// Serialize back to SRT
const output = formatSrt(corrected);
```

The `Subtitle` type is also exported:

```ts
import type { Subtitle } from "srtsync";
```

## How linear correction works

Given the start time of the first and last subtitles as reference points, every timestamp is rescaled with a linear mapping:

```
scale = (newLast - newFirst) / (origLast - origFirst)
new_t = newFirst + (t - origFirst) * scale
```

This corrects uniform drift caused by frame-rate conversion, player speed changes, or different video cuts.

## Timestamp format

All timestamp arguments accept both SRT-standard comma separators and dot separators:

- `00:01:30,500` (SRT standard)
- `00:01:30.500` (also accepted)

Offsets accept an optional `+`/`-` sign prefix. Unsigned offsets are treated as positive.

## License

MIT
