---
title: "File activity performance evidence"
status: "Verified"
---

## Reference environment

| Item | Value |
|---|---|
| Date | 2026-11-21 |
| Operating system | Microsoft Windows 11 Pro, build 26300 |
| Hardware | Intel Core i7-12700 |
| VS Code | 1.145.3 |
| Node.js | v24.20.0 |
| Extension host | VS Code extension test host |
| Workload | Exactly 1,000 valid file records |
| Warm-ups | 2 |
| Measurements | 10 per operation |
| Threshold | 200 ms maximum |

## Method

The opt-in benchmark runs in `src/test/timeCard.test.ts`. Enable it with:

```powershell
$env:RUN_PERFORMANCE_BENCHMARK='1'; npm test
```

Each iteration measures `FileTimeTracker.snapshot()` separately from
`createTimeCard(snapshot.fileTimes)` plus `renderTimeCardHtml(card)`.

## Raw results

| Operation | Measurements in milliseconds | Maximum |
|---|---|---:|
| Snapshot | 0.256, 0.291, 0.257, 0.217, 0.301, 0.178, 0.342, 0.365, 0.512, 0.720 | 0.720 ms |
| Card and HTML | 0.700, 0.764, 0.639, 0.647, 0.644, 0.584, 0.683, 0.733, 1.144, 0.648 | 1.144 ms |

Both maxima remain below the 200 ms threshold. The opt-in benchmark passed in the extension-host test run with
100 tests passing.

## Display limitation

Normal timer and panel refresh code is unchanged. The 1,000-record panel and time-card UI were not manually
timed in this run, so visible one-second responsiveness remains a separate manual check.
