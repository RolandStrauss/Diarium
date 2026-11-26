---
title: "Plan 020: Add workspace usage to the Diarium status bar item"
status: "Done"
---

## Status

- Priority: P1
- Effort: S
- Risk: LOW
- Depends on: plan 013
- Category: enhancement
- Status: DONE

## Why

Users need one glance at recent VS Code workspace usage. The existing status item shows live file totals;
a combined text format keeps workspace context visible in the existing Diarium status item.
Do not create a second status-bar item.

## Metric

Use workspace open time from plan 013, not manual timesheet entries or automatic file-activity totals.

- Last day: the previous local calendar day, meaning midnight-to-midnight.
- Seven-day: the previous seven local calendar days, including yesterday and excluding today.
- Format: `$(watch) 1h 30m | 1h 00m | Yesterday 2h 15m | 7d 18h 40m`.
- Replace or extend the existing status text with both file totals and workspace usage.
- Keep the existing file-activity status item as the one Diarium status item.
- Tooltip: yesterday and seven-day totals, tracking state, and click action.
- Click: open the Workspace activity view after plan 018 exists; until then, open the Timesheet panel.
- If workspace tracking is disabled, append `Usage off` instead of usage values.
- If workspace data is unavailable or invalid, append `Usage unavailable` and keep file totals unchanged.

Do not count future, paused, unfocused, untitled-window, or uninitialized time.
Do not mix overnight sessions; split them by local calendar date.

## Scope

- Reuse the existing Diarium status-bar item; do not add another item.
- Read settled workspace sessions only.
- Include the current eligible interval in neither workspace summary until it is settled.
- Refresh yesterday and seven-day values from settled data at existing checkpoints and after settlement.
- Recalculate after midnight.
- Keep workspace refresh independent of the one-second file-display timer.
- Leave the existing file-activity status item unchanged.
- Reuse plan 013 open-time and persistence boundaries.

## Data and rendering

For deterministic local-date boundaries:

1. Read the host's local timezone.
2. Resolve yesterday and start of the 7-day period.
3. Sum settled seconds with session overlap in each local date.
4. Use whole elapsed minutes for display; floor sub-minute totals.
5. Format zero as `0h 00m`.

Do not compare date strings lexically. Use validated local calendar dates or a UTC-normalized date representation.

## Test plan

- Yesterday only, excluding today.
- Inclusive previous-seven-day range, with local-midnight boundaries.
- Overnight sessions split across two dates.
- DST start and DST end do not change elapsed seconds incorrectly.
- Tracking disabled and unavailable states.
- Existing file status item remains unchanged.
- Status tooltip and click route remain stable.
- No live session is double-counted.

## Done criteria

- [x] Existing Diarium status item remains the only status item.
- [x] Existing file totals remain visible.
- [x] Yesterday and previous-seven-day totals use workspace open time.
- [x] Unfocused, disabled, and unavailable workspace states are explicit.
- [x] Local midnight and DST cases are tested.
- [x] Existing file-activity behavior is unchanged apart from added usage text.

## STOP conditions

- Plan 013 cannot provide settled local-date session data.
- The status item would combine manual or file-activity totals.
- A live in-progress interval would be estimated or persisted by display refresh.
