# Implementation Plans

Plans 001-003 were generated 2026-11-20 against commit `2b515c2`.
Plans 004-006, 008, and 009 extend that set from `docs/PRD.md`.
Plan 007 was refreshed 2026-11-26 against commit `9919dfa` to include current
`0.1.7` and Outlook calendar-import documentation drift.
Plans 010-018 cover the next UI, settings, and workspace-activity enhancements.
Plan 019 adds report CSV and JSON export formats.
Plan 020 adds workspace usage to the existing Diarium status-bar item.
Plan 021 adds the read-only Fun metrics tab.

## Execution order and status

| Plan | Title | Priority | Effort | Depends on | Status |
|------|-------|----------|--------|------------|--------|
| 001 | Prevent duplicate manual entries | P1 | S | — | DONE |
| 002 | Restore the extension CI verification gate | P1 | S | — | DONE |
| 003 | Remove unreferenced legacy timer modules | P2 | S | — | DONE |
| 004 | Verify accessibility and visual modes | P1 | M | 002 | DONE |
| 005 | Verify extension host and packaged VSIX | P0 | M | 002 | BLOCKED |
| 006 | Verify in-host file-activity performance | P1 | S | 002 | DONE |
| 008 | Export and import timesheet data | P1 | M | 002 | DONE |
| 009 | Maintenance tab | P1 | M | 002, 008 | DONE |
| 007 | Align release evidence and documentation | P0 | S | 004-006, 008 | TODO |
| 010 | Move Outlook Calendar import to Maintenance | P1 | S | 009 | DONE |
| 011 | Rename Task to Activity | P1 | S | — | DONE |
| 012 | Configure export and import locations | P1 | M | 008 | TODO |
| 013 | Track workspace open time | P1 | M | 002 | TODO |
| 014 | Track workspace branches | P1 | M | 013 | TODO |
| 015 | Track language extensions and edit saves | P1 | M | 013 | TODO |
| 016 | Track executed tasks | P2 | M | 013 | TODO |
| 017 | Track debug sessions | P2 | M | 013 | TODO |
| 018 | Show and export workspace activity | P1 | L | 013-017 | TODO |
| 019 | Export reports as CSV and JSON | P1 | M | 011, 012 | TODO |
| 020 | Add yesterday and seven-day usage to Diarium status item | P1 | S | 013 | TODO |
| 021 | Add Fun metrics tab | P1 | M | 013-018 | TODO |

## Dependency notes

- 002 supplies the CI gate used to verify 001 and 003.
- 003 can run independently after 002 establishes a baseline.
- 004, 005, and 006 use the CI baseline from 002 but cover separate release risks.
- 008 adds portable manual-timesheet exchange without changing automatic file activity.
- 009 adds a discoverable action hub for existing maintenance and portability commands.
- 010 and 011 are independent UI terminology and navigation corrections.
- 012 extends the existing export/import commands with folder preferences.
- 013 provides the shared workspace-activity store and timing boundary.
- 014-017 add independent event collectors onto that store.
- 018 combines stored collectors into the user-facing workspace activity view.
- 019 adds report data formats without changing the portable timesheet JSON envelope.
- 020 adds workspace-open-time text to the existing Diarium status item using plan 013 data only.
- 021 derives Fun metrics from plans 013-018 without starting a second tracker.
- 007 closes only after the accessibility, runtime, performance, portable-data,
  and maintenance evidence exists. While 005 is blocked, 007 must record that
  blocker instead of claiming release readiness.

## Findings considered and rejected

- Remove or rewrite stale `docs/timer_PRD.md`: top-fix scope only; `docs/PRD.md` explicitly marks this draft superseded, and no code change is required now.
- Fix only the warning in `src/excludeFiles.ts`: the entire module is unreferenced; plan 003 removes it instead of preserving legacy code.
- Cache flattened webview entries: no measured UI regression exists, and the
  verified 1,000-record benchmark does not support added cache complexity.
- Add a separate webview mutation integration suite: `src/test/reportActions.test.ts`
  already drives message handling and persistence; remaining work belongs in
  focused regression tests when a behavior bug appears.
- Share the webview date validator directly with extension code: the validation
  runs across separate webview and extension-host runtimes, and no behavior
  drift currently exists.
