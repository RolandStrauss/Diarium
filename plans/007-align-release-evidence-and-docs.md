---
title: "Plan 007: Align release evidence and documentation"
status: "Planning"
---

# Plan 007: Align release evidence and documentation

> **Executor instructions**: Follow this plan in order. Run the drift check first.
> Use only behavior proven by tests, package inspection, or installed-VSIX evidence.
> Do not approve release ownership or publication on the user's behalf.
> Update `plans/README.md` after the release evidence and documentation pass review.
>
> **Drift check (run first)**:
> `git diff --stat 9919dfa..HEAD -- README.md CHANGELOG.md docs\PRD.md package.json plans src\extension.ts src\webview.ts src\timeData.ts src\test\reportActions.test.ts src\test\timeData.test.ts`
>
> If any listed file changed since this plan was written, compare the excerpts in
> “Current state” with the live files before proceeding. On a mismatch, stop and
> report the drift.

## Status

- **Priority**: P0
- **Effort**: S
- **Risk**: MED
- **Depends on**: `plans/005-verify-extension-host-and-package.md`, plus plans 004, 006, 008, and 009
- **Category**: docs
- **Status**: TODO
- **Planned at**: commit `9919dfa`, 2026-11-26

## Why this matters

The PRD blocks release claims until runtime, platform, package, accessibility,
performance, storage, and metadata evidence exists. The current PRD still says the
manifest is version `0.1.3`, while `package.json` declares `0.1.7`. Outlook calendar
import is also active and tested but absent from the README, PRD, and changelog.

Closing these gaps prevents users, maintainers, and release reviewers from making
decisions from a stale product baseline. This plan does not replace the blocked
installed-VSIX and cross-platform work in plan 005.

## Current state

- `package.json` is the extension manifest. At line 5, it declares version `0.1.7`.
- `docs/PRD.md` is the product baseline and release checklist. Line 83 still says
  the manifest declares version `0.1.3`.
- `src/webview.ts` previously rendered an **Import Outlook Calendar** button in the
  Entries view.
- `src/extension.ts` line 824 handles `importOutlookCalendar`, limits the `.ics`
  file to 5 MiB, parses timed and all-day events, asks for confirmation, and
  skips duplicate semantic entries.
- `src/timeData.ts` contains `parseOutlookCalendarIcs`. It skips cancelled events
  and currently produces manual `TimeEntry` values from Outlook event dates,
  summaries, start times, and end times.
- `src/test/reportActions.test.ts` line 708 verifies `.ics` import, persistence,
  and duplicate-import behavior. `src/test/timeData.test.ts` verifies parser
  behavior independently.
- `README.md`, `docs/PRD.md`, and `CHANGELOG.md` do not describe the active
  Outlook calendar import feature.
- `plans/005-verify-extension-host-and-package.md` remains BLOCKED. Plan 005 owns
  installed-VSIX and Windows/macOS/Linux evidence.
- `docs/performance-evidence.md` shows the accepted repository evidence style:
  environment, method, raw results, and limitations.

The README uses short user-facing bullets under `## Use`. Preserve that style.
The PRD separates verified baseline facts from proposed release checks. Do not
promote an unverified check into a requirement that appears to have passed.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Read-only typecheck | `npm exec tsc -- --noEmit` | Exit 0, no errors |
| Lint | `npm run lint` | Exit 0 |
| Full extension checks | `npm test` | All tests pass |
| Package | `npm run package:optimized` | One VSIX is produced |
| Package inventory | `npx vsce ls --tree` | Only intended runtime files are listed |
| Verify stale version removal | `rg -n "0\.1\.3" docs\PRD.md` | No match |
| Verify Outlook docs | `rg -n "Outlook Calendar" README.md docs\PRD.md CHANGELOG.md` | At least one match in each file |
| Whitespace errors | `git diff --check` | Exit 0 |
| Scope audit | `git status --short` | Only in-scope files appear |

## Scope

**In scope**:

- `README.md`
- `CHANGELOG.md`
- `docs/PRD.md`
- One concise release evidence document under `docs/`
- `package.json`, but only for a verified release-metadata correction
- `plans/README.md`

**Out of scope**:

- Publishing to a Marketplace
- Inventing publisher, repository, support, or release ownership
- Changing source or test behavior in `src/`
- Adding telemetry
- Rewriting the PRD as marketing copy
- Reproducing plan 005's installed-VSIX or cross-platform work
- Claims unsupported by plans 004, 005, 006, 008, and 009

## Git workflow

- Use branch `advisor/007-release-evidence` if a separate branch is requested.
- Keep the work in one logical documentation commit.
- Match recent commit style, for example `docs: align release evidence`.
- Do not push, open a pull request, publish, or approve a release unless the
  operator explicitly requests it.

## Steps

### Step 1: Resolve or record the plan 005 prerequisite

Read `plans/README.md` and plan 005.

If plan 005 is still `BLOCKED`, record the exact blocker in the release evidence
document and stop. Keep plan 007 `TODO` or `BLOCKED`; do not label the release
ready. Do not perform an artificial source-only substitute for installed-VSIX
and cross-platform evidence.

If plan 005 has been completed, collect its recorded VS Code, Node, operating
system, package path, command-flow, and blocker results.

**Verify**: `plans/README.md` shows the current plan 005 status and the evidence
document links to real plan 005 results or records one explicit blocker.

### Step 2: Collect existing evidence

Create one concise evidence document under `docs/`, following the structure of
`docs/performance-evidence.md`.

For every PRD Definition of Done item, record:

- source or test command
- result and date
- commit and whether the worktree was clean
- VS Code, Node, and operating-system versions
- hardware and timing method where performance is measured
- artifact path or CI run URL where applicable
- `PASS`, `FAIL`, `BLOCKED`, or `NOT RUN`

Link evidence from plans 004, 005, 006, 008, and 009. Do not turn test existence,
package creation, or an old local probe into a passing claim.

**Verify**: Every Definition of Done item in `docs/PRD.md` has one evidence row
or one explicit blocker. No row lacks a command or artifact reference.

### Step 3: Reconcile the verified product baseline

Update `README.md`, `docs/PRD.md`, and `CHANGELOG.md` using verified behavior only.

Required drift corrections:

1. Replace the stale PRD manifest-version statement with `0.1.7`.
2. Document **Import Outlook Calendar** in the README. State that it accepts an
   `.ics` file up to 5 MiB, imports timed and all-day entries, asks before
   mutation, and skips duplicate entries and cancelled events.
3. Add Outlook calendar import to the PRD's verified baseline and evidence index.
4. Add the Outlook import behavior to the Unreleased changelog.

Preserve existing statements for storage scope, tracking focus, pause,
exclusions, reset, exports, supported characters, lock recovery, and command
identifiers unless the collected evidence proves a change.

**Verify**:

- `rg -n "0\.1\.3" docs\PRD.md` returns no match.
- `rg -n "Outlook Calendar" README.md docs\PRD.md CHANGELOG.md` finds the feature
  in all three files.
- `git diff --check` exits 0.

### Step 4: Audit release metadata and package contents

Confirm the values and behavior for:

- extension version
- publisher identity
- repository and support links, if present
- license
- VS Code engine target
- runtime dependencies
- command identifiers
- VSIX contents

If ownership cannot be verified, record publication as blocked. Do not invent or
change metadata to remove the blocker.

**Verify**:

- `npm run package:optimized` exits 0 and creates one VSIX.
- `npx vsce ls --tree` lists only intended runtime files.
- The evidence document names the VSIX and records package contents.
- Any metadata correction is supported by explicit owner input or repository
  evidence.

### Step 5: Run the complete release-documentation checks

Run `npm exec tsc -- --noEmit`, `npm run lint`, and `npm test`.

Then inspect the full diff and worktree. Confirm no source or test file changed.

**Verify**:

- Both read-only checks and `npm test` exit 0.
- `git diff --check` exits 0.
- `git status --short` lists only files named in **Scope**.
- `README.md`, `docs/PRD.md`, and `CHANGELOG.md` contain no unsupported pass
  claim.

### Step 6: Close the release boundary

Review the evidence with the product owner.

Record:

- accepted checks
- rejected or deferred checks
- known limitations
- release decision
- approval date

Keep abrupt-termination limits, unsupported PDF characters, legacy totals, and
any untested platform visible as limitations or blockers.

Update plan 007's status in `plans/README.md` only after the evidence review.
This plan must not infer publication approval.

**Verify**: The evidence document contains an explicit release decision or an
explicit blocker. `plans/README.md` reflects that state.

## Test plan

- Run the full source gate: `npm test`.
- Run the package gate: `npm run package:optimized`.
- Inspect the package with `npx vsce ls --tree`.
- Check the stale version and Outlook documentation with the two `rg` commands
  in “Commands you will need.”
- Use `git diff --check` and `git status --short` to validate documentation and
  scope.

No new automated test is expected because this plan documents verified behavior;
it does not change behavior. If documentation describes a new behavioral claim
without an existing test or plan-005 result, stop and add that evidence gap
instead of inventing a claim.

## Done criteria

All must hold:

- [ ] Plan 005 has completed evidence, or plan 007 remains explicitly blocked.
- [ ] One release evidence document under `docs/` covers every PRD Definition of
      Done item.
- [ ] `docs/PRD.md` names manifest version `0.1.7`; no stale `0.1.3` manifest
      baseline remains.
- [ ] README, PRD, and changelog describe Outlook calendar import using only
      verified behavior.
- [ ] `npm exec tsc -- --noEmit`, `npm run lint`, and `npm test` exit 0.
- [ ] `npm run package:optimized` and `npx vsce ls --tree` pass.
- [ ] Every release claim links to a command, artifact, or explicit blocker.
- [ ] Package metadata has confirmed ownership or a recorded publication
      blocker.
- [ ] `git diff --check` exits 0.
- [ ] No files outside **Scope** changed.
- [ ] `plans/README.md` contains the correct plan 007 status.

## STOP conditions

Stop and report without improvising if:

- Plan 005 remains blocked and an installed-VSIX claim would be needed.
- Any current-state excerpt no longer matches the repository.
- Outlook import tests fail or current source behavior differs from the
  documented 5 MiB, timed/all-day, confirmation, or duplicate behavior.
- Package inspection exposes source, tests, local data, reports, secrets, or
  other repository-only content.
- Publisher, repository, support, or release ownership is unresolved.
- Product-owner approval is absent.
- A required platform result is unavailable.
- A step would require modifying any out-of-scope file.
- A verification command fails twice after a reasonable correction attempt.

## Maintenance notes

Treat the release evidence as a dated snapshot, not a permanent approval. Refresh
it after the release commit, package contents, supported platforms, command
surface, or verified product behavior changes.

Keep Outlook parser and persistence behavior in `src/`; this plan only records
verified behavior. If future work changes `.ics` limits, event semantics, time
zones, or deduplication, update the README, PRD baseline, changelog, and release
evidence together.
