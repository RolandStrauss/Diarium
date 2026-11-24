---
title: "Plan 009: Maintenance tab"
status: "Complete"
---

> **Executor instructions**: Run the drift check first. Keep maintenance actions behind the existing tabs.
> Reuse existing command registrations and confirmation behavior; do not duplicate action logic.
> Update `plans/README.md` after implementation and verification pass.

> **Drift check (run first)**:
> `git diff --stat 09ab1c6 -- src/extension.ts src/webview.ts src/test package.json README.md docs/prd.md`

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans 002 and 008
- **Category**: enhancement
- **Status**: DONE
- **Planned at**: 2026-11-21

## Why this matters

Timesheet portability and file-activity maintenance actions are currently distributed across Command Palette
commands. A dedicated Maintenance tab gives users one discoverable place to back up data and manage tracking
state without mixing maintenance controls into entry editing.

## Current state

- The Timesheet webview now has five tabs: Entries, Period report, Public holidays, File activity, and Maintenance.
- Export and import commands already exist for manual entries and holidays.
- File-tracking maintenance already exists through pause/resume, exclusion, reset, and recovery prompts.
- Tab rendering and keyboard navigation are implemented in `src/webview.ts`.
- Command callback behavior lives in `src/extension.ts`.

## Commands you need

| Purpose | Command | Expected success |
|---------|---------|------------------|
| Typecheck | `npx tsc -p tsconfig.json --noEmit` | Exit 0, no errors |
| Lint | `npm run lint` | Exit 0, no errors or warnings |
| Test | `npm test` | Existing and new maintenance tests pass |
| Package | `npm run package:optimized` | VSIX builds successfully |

## Scope

**In scope**:

- A fifth Maintenance tab in `src/webview.ts`
- Maintenance actions that call existing `time-tracker.*` command callbacks
- Focused tests under `src/test/`
- `README.md` and `docs/prd.md`
- Any existing tabs or print styles that must hide or update the new tab

**Out of scope**:

- New storage formats
- New import/export rules
- Cloud backup or synchronization
- New file-tracking data models
- Direct filesystem operations in webview JavaScript
- Publishing or marketplace changes

## Maintenance actions

Add buttons for these existing operations:

| Button | Existing operation | Notes |
|---|---|---|
| Import timesheet data | `time-tracker.importTimesheet` | Keep existing validation, merge, and confirmation behavior |
| Export timesheet data | `time-tracker.exportTimesheet` | Export manual entries and holidays only |
| Pause / resume tracking | `time-tracker.toggleTracking` | Button label and status reflect shared tracking state |
| Manage file exclusions | `time-tracker.manageExclusions` | Reuse exact-path picker and cancellation behavior |
| Reset file activity | `time-tracker.resetFileTimes` | Reuse modal confirmation and retain exclusions |

Also evaluate these existing recovery/display operations for the same tab:

- Show floating timer
- Preview time card
- Export raw file-activity data when recovery is available

Do not add an operation unless it reuses an existing callback or deterministic VS Code API.
Do not expose raw global-storage internals as a normal maintenance action.

## Steps

### Step 1: Add the Maintenance tab and panel — DONE

Add `Maintenance` after `File activity` in the tablist and add a matching maintenance panel.
Preserve the existing roving-tab, arrow, Home, and End behavior.
Include the tab and maintenance panel in print and forced-colors handling.

**Verify**: Keyboard navigation reaches Maintenance and hides every other panel.

### Step 2: Route buttons through existing commands — DONE

When a maintenance button is selected, send a webview message containing only the existing command identifier.
The extension host resolves it with `vscode.commands.executeCommand(...)`.
Do not copy import, export, reset, exclusion, or tracking logic into `src/webview.ts`.

Keep the shared tracking state visible on the tab. Update the pause/resume label after broadcasts.

**Verify**: Each button invokes its existing command and inherits cancellation, failure, and success behavior.

### Step 3: Protect privacy and destructive operations — DONE

Label the portable export as manual timesheet data containing entries and holidays.
Keep reset confirmation and exclusion changes in the existing command callbacks.
Do not display raw file paths or stored data unless an existing recovery flow does so already.

**Verify**: Maintenance actions never change data before existing confirmation or validation succeeds.

### Step 4: Test and document — DONE

Add focused tests for:

- Maintenance tab presence and keyboard navigation
- Every maintenance button routing to the expected command
- Pause/resume label updates from shared tracking state
- No duplicate action execution on repeated button clicks
- Print and forced-colors behavior

Update `README.md` and the PRD baseline to describe the tab and its relationship to Command Palette commands.

**Verify**: `npm test`, lint, typecheck, and package build pass.

## Test plan

- Tab selection and roving focus.
- Import/export success and cancellation from the tab.
- Pause/resume state and repeated clicks.
- Exclusion picker and cancellation.
- Reset confirmation, success, and failure.
- Raw recovery remains unavailable unless the existing storage flow makes it available.
- Print output does not show maintenance controls.

## Done criteria

- [x] Maintenance tab appears next to the existing four tabs.
- [x] Import and export data buttons use existing command callbacks.
- [x] Pause/resume, exclusions, and reset are available through the tab.
- [x] Optional timer and card actions reuse existing behavior; raw recovery export remains unavailable.
- [x] Repeated clicks do not duplicate actions.
- [x] Cancellation and destructive-confirmation behavior remain unchanged.
- [x] README and PRD match the implemented UI.
- [x] Tests, lint, typecheck, and package build pass.
- [x] `plans/README.md` status is updated.

## STOP conditions

- A maintenance button would duplicate or bypass existing command validation.
- A proposed action has no existing callback or confirmation boundary.
- Maintenance controls expose raw storage or sensitive paths without an existing recovery flow.
- Reset or import behavior would change outside its existing implementation.
- A new dependency is needed for tab or command routing.

## Maintenance notes

Keep Maintenance as an action hub, not a second settings store. Reuse command identifiers and shared state so
future maintenance features require one webview route and one existing extension callback.
