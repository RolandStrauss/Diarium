---
title: "Plan 006: Verify in-host file-activity performance"
status: "Planning"
---

> **Executor instructions**: Run the drift check first. Use the PRD reference workload, not a reduced proxy.
> Record the environment and raw timings. Update `plans/README.md` after verification passes.

> **Drift check (run first)**:
> `git diff --stat 09ab1c6 -- src/fileTimeTracker.ts src/timeCard.ts src/webview.ts src/test`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plan 002
- **Category**: performance
- **Status**: DONE
- **Planned at**: working tree after `09ab1c6`, 2026-11-20

## Why this matters

The PRD sets a 200 ms limit for snapshot and time-card generation with 1,000 file records. The existing
probe ran outside the VS Code extension host, so it does not satisfy the release check.

## Current state

- `FileTimeTracker.snapshot()` copies and filters cumulative file totals.
- `createTimeCard()` sorts files and creates unique display labels.
- `renderTimeCardHtml()` builds the full standalone card.
- Existing tests cover correctness but do not record the required in-host workload.
- No performance benchmark is enforced in CI.

## Commands you need

| Purpose | Command | Expected success |
|---------|---------|------------------|
| Typecheck | `npx tsc -p tsconfig.json --noEmit` | Exit 0, no errors |
| Lint | `npm run lint` | Exit 0, no errors or warnings |
| Test | `npm test` | Existing suite passes |
| Release package | `npm run package:optimized` | Package builds |

## Scope

**In scope**:

- `src/fileTimeTracker.ts`
- `src/timeCard.ts`
- One focused test or opt-in benchmark under `src/test/`
- Evidence output used by plan 007

**Out of scope**:

- CI timing enforcement on shared runners
- New telemetry
- Historical analytics or pagination features
- Caching or data-structure replacement without a measured failure

## Steps

### Step 1: Add the smallest benchmark

Seed exactly 1,000 valid file records with deterministic paths and durations.

Measure:

1. `FileTimeTracker.snapshot()`
2. `createTimeCard(snapshot.fileTimes)` plus `renderTimeCardHtml(card)`

Run two warm-up iterations and ten measured iterations in the VS Code extension-host test process.
Keep raw timings, then calculate the maximum for each operation.

Avoid a generic benchmark framework. Make the benchmark opt-in if normal CI timing would be unstable.

**Verify**: The benchmark executes in the extension host and outputs all ten measurements plus the maximum.

### Step 2: Run the PRD threshold

Run the benchmark on a documented reference machine. Record:

- Hardware
- Operating system
- VS Code version
- Node version
- Input shape
- Warm-up count
- Measured iteration count
- Raw and maximum timing results

Require a maximum below 200 ms for both measured operations.

**Verify**: Results contain evidence from the extension host, not only standalone Node.

### Step 3: Optimize only if the threshold fails

First inspect whether the workload or measurement method is wrong.

If a real operation exceeds 200 ms:

1. Profile the measured operation.
2. Change the smallest proven hotspot.
3. Preserve ordering, labels, escaping, snapshot equality, and empty-data behavior.
4. Re-run correctness tests and all benchmark iterations.

Do not add memoization, workers, pagination, or a data framework preemptively.

**Verify**: Correctness tests and the same benchmark both pass.

### Step 4: Check display responsiveness

With the 1,000-record snapshot, open File activity and the time-card preview in the extension host.

Confirm visible timer and state updates appear within one second during normal operation. Treat failed writes or
blocked extension hosts separately from this normal-path target.

**Verify**: Manual timing and visible behavior agree with the 1,000-record benchmark.

## Test plan

- 1,000 seeded file records.
- Two warm-up iterations.
- Ten measured iterations.
- Maximum below 200 ms for snapshot and card generation.
- Existing correctness tests remain green.
- Normal display updates remain within one second.

## Done criteria

- [x] Benchmark workload uses exactly 1,000 valid records.
- [x] Benchmark runs inside the VS Code extension host.
- [x] Two warm-ups and ten raw measurements are recorded.
- [x] Snapshot and card maxima are below 200 ms.
- [x] Environment and timing method are recorded.
- [ ] Display responsiveness is checked under the same workload. Manual 1,000-record panel timing remains unverified.
- [x] `npm test`, lint, typecheck, and package build pass.
- [x] Evidence is available for plan 007.
- [x] `plans/README.md` status is updated.

## STOP conditions

- Required in-host instrumentation cannot be added without a broad test-framework change.
- The reference machine cannot produce repeatable results.
- A threshold failure requires a UX or storage redesign rather than a focused hotspot fix.
- The extension host is blocked or the measurement is dominated by debugger overhead.

## Maintenance notes

Keep the benchmark opt-in if shared CI machines make the 200 ms threshold noisy. Recheck the threshold after a
material change to snapshot, card, or path-label logic.
