---
title: "Plan 016: Track executed tasks"
status: "Planning"
---

## Status

- Priority: P2
- Effort: M
- Risk: MED
- Depends on: plan 013
- Category: enhancement
- Status: TODO

## Why

Task execution is a useful work-context signal. The record must exclude commands and arguments.

## Product decisions

- Record task name, task source, task type, start time, end time, result, and workspace.
- Do not store task command lines, arguments, environment variables, secrets, or output.
- Prefer names from VS Code task objects, with fallback labels for unnamed tasks.
- Store repeated executions by stable task label within one workspace.
- A task process start or end is optional evidence but never required for a completed task record.

## Scope

- Subscribe to `vscode.tasks.onDidStartTask` and `onDidEndTask`.
- Optional process execution events use only process start/end status.
- If the end event is unavailable after shutdown, mark the task as interrupted.
- Serialize task metadata in the workspace-activity store.
- Expose task counts and durations in plan 018.

## Test plan

- Task start and end create one duration record.
- Same-named tasks repeat in a workspace as separate executions.
- No command text or arguments enter the store.
- Crashes and shutdowns produce interrupted status without doubling duration.
- Task lifecycle remains unaffected by workspace switch.

## Done criteria

- [ ] Task counts and durations are visible in workspace activity.
- [ ] Sensitive task arguments are never recorded.
- [ ] Repeated and interrupted tasks are represented correctly.

## STOP conditions

- Task metadata cannot be collected without executing or shelling commands.
- Task output or arguments are the only reliable task identifiers.
