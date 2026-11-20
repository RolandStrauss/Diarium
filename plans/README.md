# Implementation Plans

Plans 001-003 were generated 2026-11-20 against commit `2b515c2`.
Plans 004-008 extend that set from `docs/prd.md` and the current working tree.

## Execution order and status

| Plan | Title | Priority | Effort | Depends on | Status |
|------|-------|----------|--------|------------|--------|
| 001 | Prevent duplicate manual entries | P1 | S | — | DONE |
| 002 | Restore the extension CI verification gate | P1 | S | — | TODO |
| 003 | Remove unreferenced legacy timer modules | P2 | S | — | DONE |
| 004 | Verify accessibility and visual modes | P1 | M | 002 | TODO |
| 005 | Verify extension host and packaged VSIX | P0 | M | 002 | TODO |
| 006 | Verify in-host file-activity performance | P1 | S | 002 | TODO |
| 008 | Export and import timesheet data | P1 | M | 002 | DONE |
| 007 | Align release evidence and documentation | P0 | S | 004-006, 008 | TODO |

## Dependency notes

- 002 supplies the CI gate used to verify 001 and 003.
- 003 can run independently after 002 establishes a baseline.
- 004, 005, and 006 use the CI baseline from 002 but cover separate release risks.
- 008 adds portable manual-timesheet exchange without changing automatic file activity.
- 007 closes only after the accessibility, runtime, performance, and portable-data evidence exists.

## Findings considered and rejected

- Remove or rewrite stale `docs/timer_PRD.md`: top-fix scope only; `docs/PRD.md` explicitly marks this draft superseded, and no code change is required now.
- Fix only the warning in `src/excludeFiles.ts`: the entire module is unreferenced; plan 003 removes it instead of preserving legacy code.
