---
title: "Plan 013: Track workspace open time"
status: "Planning"
---

## Status

- Priority: P1
- Effort: M
- Risk: MED
- Depends on: plan 002
- Category: enhancement
- Status: TODO

## Why

Workspace names and open time are the baseline for understanding where VS Code time goes. The feature needs
explicit opt-in because it records work-context metadata.

## Product decisions

- Add `diarium.workspaceActivity.enabled`, default `false`.
- Tracking runs locally only; no telemetry or network request.
- Workspace open time means VS Code remained running and its window was focused with a workspace folder open.
  Idle time counts, matching existing file tracking.
- Untitled windows and workspace folders outside a named workspace can be identified with a non-secret label.
- Store cumulative seconds plus open intervals separately to avoid overwriting live state.
- Add reset and raw-export maintenance controls only after storage and UI plans are implemented.

## Data model

Use one versioned `globalState` record:

```json
{
  "version": 1,
  "workspaces": {},
  "sessions": []
}
```

Keep the exact implementation shape small. Store stable workspace identity and display name separately.
Do not store file paths or source contents. Aggregate sessions after an implementation review if raw session
storage grows materially.

Each settled session should carry a local start/end date. Preserve sessions across the local midnight boundary
by attributing elapsed time to the local calendar date on which it elapsed. Status and report summaries read
these sessions; they do not maintain a second workspace-timing counter.

## Scope

- Listen to workspace-folder changes and window-focus changes.
- Start and settle intervals on enable, disable, window focus, workspace change, checkpoint, and shutdown.
- Persist at 60-second checkpoints and meaningful transitions.
- Do not count time while VS Code is unfocused or the tracking setting is disabled.
- Reopening VS Code starts a new interval.
- Reuse one ownership guard and one write queue for concurrent windows.

## Test plan

- Deterministic clocks cover open, switch, focus loss, focus regain, pause/disable, restart, reset, and failure.
- No interval is attributed twice.
- A workspace switch settles the old interval and starts the new one.
- Opt-in off records nothing.
- Invalid stored data produces a visible recovery path.

## Done criteria

- [ ] Opt-in setting exists and defaults to false.
- [ ] Workspace open time is accurate and cumulative.
- [ ] Storage is separate from timesheet and file-activity data.
- [ ] Shutdown and checkpoint behavior are tested.

## STOP conditions

- Tracking would send workspace names outside the local extension.
- The implementation requires storing file contents or full workspace paths.
- One workspace cannot be distinguished safely across VS Code restarts.
