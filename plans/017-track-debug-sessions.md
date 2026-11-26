---
title: "Plan 017: Track debug sessions"
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

Debug starts indicate focused development effort. Session details must stay out of stored or displayed secrets.

## Product decisions

- Record debug type, session name, workspace, start time, end time, and result.
- Do not store launch configurations, environment variables, arguments, breakpoints, expressions, or variable values.
- Use VS Code session labels and type names only.
- Count repeated sessions separately.
- Mark terminated sessions as interrupted when VS Code closes.

## Scope

- Subscribe to `onDidStartDebugSession` and `onDidTerminateDebugSession`.
- Match start and end events by session identity.
- Persist through the shared workspace-activity write queue.
- Expose debug count and duration in plan 018.

## Test plan

- Start and terminate create one completed record.
- Unrelated sessions do not cross-attribute.
- VS Code shutdown leaves an interrupted record once.
- Launch configuration fields never enter storage.
- Multiple workspaces remain separately attributed.

## Done criteria

- [ ] Debug session counts and durations are local.
- [ ] Sensitive launch data is excluded.
- [ ] Session lifecycle is tested.

## STOP conditions

- Debug metadata requires launch arguments or environment variables.
- VS Code does not expose stable session identity.
