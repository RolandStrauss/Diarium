---
title: "Plan 021: Add Fun metrics tab"
status: "Planning"
---

## Status

- Priority: P1
- Effort: M
- Risk: MED
- Depends on: plans 013-018
- Category: enhancement
- Status: TODO

## Why

Users need a small, understandable view of long-term VS Code usage patterns. Fun metrics derive existing
workspace activity. They must not infer productivity, attendance, or quality of work.

## Product decisions

- Add a sixth tab named `Fun metrics` beside the current Timesheet tabs.
- Tracking remains opt-in through `diarium.workspaceActivity.enabled`.
- Metrics are read-only. No new telemetry or network request is allowed.
- A day has usage only when VS Code workspace open time is positive on that local calendar date.
- Streak means consecutive usage days ending today or, if today has no settled usage, ending yesterday.
- A streak of zero is shown when the current streak cannot include today or yesterday.
- Long working hours means strictly more than 480 settled minutes on one local calendar day.
- Longest week means Monday through Sunday with the highest settled VS Code open time.
- Ties use the earliest date or the first stable name in alphabetical order, and the UI states that rule.
- "Least used language" means the extension with the least positive save count.
  Plan 015 calls this a language extension; do not relabel it as a language percentage.
- "Re-used branch names" includes each branch name used in two or more distinct workspace identities.
- "Busiest day with least debugging" uses the highest workspace open time among days with zero debug starts.
- Missing or unavailable collectors show `Unavailable`, not guessed zero.

## Metrics

Show one card or row per metric:

1. Current streak and longest streak.
2. Most used workspace.
3. Most used branch, scoped and labeled by workspace.
4. Most used language extension, ranked by save count.
5. Least used language extension, ranked by positive save count.
6. Longest day.
7. Re-used branch names.
8. Day with most tasks executed.
9. Day with most debug sessions started.
10. Busiest day with least debugging.
11. Project with most debug sessions started.
12. Busiest week.
13. Number of days over eight working hours.

Streak may use all available settled history. The other metrics use all available local history.
Add a visible data-period label from the earliest to latest usable date.

## Data boundaries

Derive every metric from plans 013-017:

- Open time: plan 013.
- Branch time and names: plan 014.
- Extension save counts: plan 015.
- Task start counts: plan 016.
- Debug session start counts: plan 017.

Do not derive these metrics from manual timesheet entries, file activity, source contents, or export reports.
Do not persist derived cards. Recompute in memory after workspace snapshots or data refresh.

## Scope

- Add the Fun metrics tab and keyboard navigation to the existing Timesheet webview.
- Add one pure derivation module for testable metric calculations.
- Add empty, disabled, partial, and stale-data states.
- Format durations in `0h 00m`.
- Format counts as whole numbers.
- Protect names and values from HTML and forced-colors rendering issues.
- Provide a text-only tie rule and unavailable explanation.
- Keep print output free of Fun metrics controls and cards.
- Update README and the PRD baseline.

## Steps

1. Define stable metric input and output types beside the workspace activity modules.
2. Implement pure, deterministic functions for the 13 metrics.
3. Add a snapshot adapter that combines plans 013-017 once.
4. Render the Fun metrics tab with no editable fields.
5. Add refresh behavior when workspace activity settles or its snapshot changes.
6. Test display, tie, DST, missing-data, and opt-in-disabled behavior.
7. Update documentation and architecture evidence.

## Test plan

- Streak for consecutive days, today-only start, yesterday fallback, and no usage.
- More than 480 minutes counts as a long day; exactly 480 minutes does not.
- Monday-to-Sunday week totals across year, month, DST, and leap boundaries.
- Most used workspace and branch tie behavior.
- Save-count most and least extension rules.
- Re-used branch names across one and multiple workspaces.
- Task and debug busiest days.
- Busiest day with zero debug starts.
- Project with highest debug session starts.
- Partial collectors show unavailable rather than false zero.
- Tracking disabled stores no history and clears derived cards.
- Keyboard, print, forced-colors, and reduced-motion behavior.

## Done criteria

- [ ] Fun metrics tab exists in the Timesheet webview.
- [ ] All 13 metrics use only workspace-activity data.
- [ ] Streak and eight-hour rules are explicit.
- [ ] Unavailable and tied values have clear text.
- [ ] Metrics recompute from shared snapshots only.
- [ ] Tests, documentation, and architecture match.

## STOP conditions

- A metric would require manual entry data or file-activity totals.
- The view would expose file paths, task command lines, or debug launch secrets.
- The implementation duplicates any workspace collector or persists derived metrics.
