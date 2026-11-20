---
title: "Plan 004: Verify accessibility and visual modes"
status: "Complete"
---

> **Executor instructions**: Run the drift check first. Keep this plan within the listed surfaces.
> Stop at the listed stop conditions instead of expanding the UI scope.
> Update `plans/README.md` after verification passes.

> **Drift check (run first)**:
> `git diff --stat 09ab1c6 -- src/webview.ts src/floatingTimer.ts src/timeCard.ts src/test`

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plan 002
- **Category**: accessibility
- **Status**: DONE
- **Planned at**: working tree after `09ab1c6`, 2026-11-20

## Why this matters

The PRD requires keyboard access, field-associated errors, meaningful state text, high-contrast support,
reduced motion, and grayscale-readable reports. The current markup has useful labels and ARIA, but existing
tests do not prove complete keyboard or visual behavior.

## Current state

- `src/webview.ts` provides tab roles, table labels, live regions, `aria-invalid`, and error associations.
- `src/floatingTimer.ts` exposes textual state and keyboard-focus styles.
- `src/timeCard.ts` supports reduced motion and includes action labels.
- Tests inspect selected HTML strings and VM behavior, but do not exercise focus movement or theme rendering.
- The fixed-color time-card design has no automated contrast or forced-colors check.

## Commands you need

| Purpose | Command | Expected success |
|---------|---------|------------------|
| Typecheck | `npx tsc -p tsconfig.json --noEmit` | Exit 0, no errors |
| Lint | `npm run lint` | Exit 0, no errors or warnings |
| Test | `npm test` | Existing and new focused tests pass |
| Package | `npm run package:optimized` | VSIX builds successfully |

## Scope

**In scope**:

- `src/webview.ts`
- `src/floatingTimer.ts`
- `src/timeCard.ts`
- Focused tests under `src/test/`
- Documentation only when a verified behavior or limitation changes

**Out of scope**:

- UI redesign
- New web frameworks or accessibility dependencies
- New product features
- Changes to time calculations or persistence

## Steps

### Step 1: Audit the interaction contract

Inspect every interactive control in the timesheet, floating timer, and time-card preview.

Confirm:

- Keyboard activation works for tabs, forms, filters, actions, pause, hide, refresh, and exports.
- Tab changes move focus to the selected panel or otherwise expose a predictable keyboard path.
- Errors remain associated with the affected field after validation failures.
- Dynamic totals and tracking states remain readable without color.
- Repeated panel open, close, and focus changes do not leave stale controls or handlers.

Record missing behavior as one focused defect. Do not redesign the surrounding layout.

**Verify**: Add or update one focused test for each behavior change. Run `npm test`.

### Step 2: Add focused regression checks

Extend existing VM and rendered-HTML tests with the smallest assertions that prevent regressions.

Prefer checks for:

- selected-tab state and keyboard focus behavior
- error IDs referenced by inputs
- textual running, paused, excluded, and waiting states
- disabled or pending action recovery
- reduced-motion and print overrides

Do not add a DOM or accessibility framework.

**Verify**: `npm test` passes.

### Step 3: Verify visual modes in the extension host

Test the three webviews in:

- VS Code light and dark themes
- A high-contrast VS Code theme
- A grayscale or forced-colors rendering
- A reduced-motion environment
- Narrow and normal panel widths

Use keyboard-only navigation for one complete entry, filter, pause/resume, card refresh, and export-cancel path.

Fix only barriers found by this pass. Record limitations that belong to VS Code rather than the extension.

**Verify**: No control disappears, overlaps, or becomes unreadable in the supported modes.

### Step 4: Verify output readability

Inspect timesheet and card PDF samples plus standalone card HTML.

Confirm:

- Weekend and incomplete states use text or patterns as well as color.
- PDF font sizes stay at or above 7.5 points.
- Printed card and report content remain readable in grayscale.
- Unsupported PDF characters route users to HTML/browser printing without corruption.

**Verify**: Existing PDF tests and a manual print-preview inspection pass.

## Test plan

- Complete every primary flow with keyboard only.
- Check labels and field errors under light, dark, and high contrast.
- Confirm reduced motion removes time-card animation.
- Confirm grayscale reports preserve status meaning.
- Run repeated webview open, hide, and close flows.

## Done criteria

- [x] All primary controls are keyboard reachable and operable.
- [x] Field errors are associated with the affected control and receive focus.
- [x] State remains understandable without color.
- [x] Light/dark theme tokens, forced-colors, reduced-motion, and grayscale print paths are covered.
- [x] Focused automated regressions cover changed behavior.
- [x] `npx tsc -p tsconfig.json --noEmit` exits 0.
- [x] `npm run lint` exits 0.
- [x] `npm test` exits 0.
- [x] `npm run package:optimized` exits 0.
- [x] `plans/README.md` status is updated.

## STOP conditions

- A proposed fix requires a UI redesign outside the PRD.
- A browser accessibility package is required for a check that can be covered by existing tests or manual host review.
- VS Code owns the blocked behavior and the extension cannot change it.
- A visual requirement conflicts with the restrictive CSP.

## Maintenance notes

Preserve VS Code theme variables in extension webviews. Keep standalone card colors self-contained and verify print
behavior separately.
