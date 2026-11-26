---
title: "Plan 018: Show and export workspace activity"
status: "Planning"
---

## Status

- Priority: P1
- Effort: L
- Risk: MED
- Depends on: plans 013-017
- Category: enhancement
- Status: TODO

## Why

The activity collectors must produce one explainable local view. No collector should appear useful until it has
clear opt-in, reset, export, and failure behavior.

## Scope

Add one Workspace activity view to the Timesheet webview and one Maintenance section for reset/export.

Show:

- Workspace folder names and open duration.
- Git branch names and duration by workspace.
- Extension or language usage with edit and save counts.
- Task names, execution counts, and duration.
- Debug session names, execution counts, and duration.
- Clear Unknown or unavailable states.

Do not show source contents, file paths, task commands, launch configuration data, environment variables, or
debug expressions.

## Export

- Add a versioned UTF-8 JSON export for workspace activity.
- Add no cloud, account, or synchronization feature.
- Export only user-confirmed data and show a privacy warning for workspace and branch names.
- Keep an export separate from the manual-timesheet transfer format.
- Export failure, cancellation, and success follow existing local-save behavior.

## Reset

- Require modal confirmation.
- Reset only workspace activity; preserve manual entries, file activity, exclusions, preferences, and exports.
- An active workspace starts a new zero-based interval after successful reset.
- On persistence failure, keep previous durable data and report an error.

## Steps

1. Add a tab or a discoverable view to the existing Timesheet panel.
2. Read only the shared workspace-activity snapshot.
3. Add deterministic duration and count formatting.
4. Add JSON export and reset through extension-host callbacks.
5. Add empty, unavailable, partial-Git, and no-extension states.
6. Update README, PRD, architecture, tests, and evidence.

## Test plan

- The view reflects each collector without duplicating open-time totals.
- Empty and opt-in-disabled states are clear.
- Export includes no source content or prohibited metadata.
- Reset and export cancellation preserve data.
- Long workspace, branch, task, and extension lists remain readable.
- Forced-colors, reduced motion, keyboard access, and print behavior remain intact.

## Done criteria

- [ ] Workspace activity is readable in one local view.
- [ ] JSON export is versioned and privacy-safe.
- [ ] Reset is confirmation-gated and non-destructive.
- [ ] Partial collectors produce clear unavailable states.
- [ ] Documentation and tests match implementation.

## STOP conditions

- The UI would expose file paths, source contents, command lines, or launch secrets.
- A collector cannot be represented honestly with available VS Code APIs.
- The plan introduces a service or telemetry dependency.
