# Plan 003: Remove unreferenced legacy timer modules

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" occur, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md`.

> **Drift check (run first)**: `git diff --stat 2b515c2..HEAD -- src/extension.ts src/excludeFiles.ts src/timeTrackerProvider.ts src/timeCardGenerator.ts`

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: MED
- **Depends on**: plan 002
- **Category**: tech-debt
- **Planned at**: commit `2b515c2`, 2026-11-20

## Why this matters

Three legacy modules describe old timer commands and view behavior, but active entry point `src/extension.ts` does not import them. The old modules increase maintenance surface and contain lint/type issues unrelated to active behavior.

## Current state

- `src/excludeFiles.ts:64` has the lint warning reported by `npm run lint`.
- `src/timeTrackerProvider.ts:16-20` creates a refresh interval in a legacy provider.
- `src/timeCardGenerator.ts:1-30` describes the old top-five SVG time-card implementation.
- `docs/PRD.md:4-7` identifies the working tree as current and marks the old timer draft superseded.
- The PRD also states these modules are unreferenced and must not be described as active capabilities.

## Commands you need

| Purpose | Command | Expected success |
|---------|---------|------------------|
| Confirm references | `rg "excludeFiles|TimeTrackerProvider|TimeCardGenerator" src package.json README.md docs` | No active imports or command references |
| Typecheck | `npx tsc -p tsconfig.json --noEmit` | Exit 0 |
| Lint | `npm run lint` | Exit 0, no warnings |
| Tests | `npm test` | Existing suite passes |

## Scope

**In scope**:
- `src/excludeFiles.ts`
- `src/timeTrackerProvider.ts`
- `src/timeCardGenerator.ts`

**Out of scope**:
- `src/extension.ts`
- Active file tracker, time card, floating timer, and webview modules
- `docs/PRD.md` and `docs/timer_PRD.md`

## Git workflow

- Branch: `advisor/003-remove-legacy-timer-modules`
- Commit only logical units; use existing Conventional Commit style
- Do not push or open a PR

## Steps

### Step 1: Confirm no live reference

Search the entire repository for imports or command identifiers belonging to the three legacy modules.

**Verify**: `rg "excludeFiles|TimeTrackerProvider|TimeCardGenerator" src package.json README.md docs` returns no active code references. Test files and historical docs are acceptable only if the search output proves they are not imports or live command wiring.

### Step 2: Remove legacy modules

Delete:

- `src/excludeFiles.ts`
- `src/timeTrackerProvider.ts`
- `src/timeCardGenerator.ts`

Do not delete any active module or test.

**Verify**: `npm run lint` → exit 0, no warning.

### Step 3: Rebuild and test

Run typecheck and the existing test suite after deletion.

**Verify**:
- `npx tsc -p tsconfig.json --noEmit` → exit 0
- `npm test` → passes

## Test plan

No new tests are needed if reference search is complete. Existing extension tests cover active commands and modules.

Run `npm test` and confirm no references to deleted modules are required at bundle time.

## Done criteria

- [ ] All three legacy modules are deleted.
- [ ] Search confirms no live import or command uses them.
- [ ] `npm run lint` exits 0 with no warnings.
- [ ] `npx tsc -p tsconfig.json --noEmit` exits 0.
- [ ] `npm test` exits 0.
- [ ] No active source or test file outside the three in-scope modules changed.
- [ ] `plans/README.md` status row is updated.

## STOP conditions

- Reference search finds an import or command wiring not inspected during recon.
- Deletion prevents extension compile or bundle.
- Tests depend on symbols exported by these modules.
- The module is needed for migration or backward compatibility.

## Maintenance notes

Do not recreate legacy provider/card implementations. Active behavior already lives in `src/extension.ts`, `src/floatingTimer.ts`, `src/timeCard.ts`, and `src/webview.ts`.
