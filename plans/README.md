# Implementation Plans

Generated 2026-11-20 against commit `2b515c2`.

## Execution order and status

| Plan | Title | Priority | Effort | Depends on | Status |
|------|-------|----------|--------|------------|--------|
| 001 | Prevent duplicate manual entries | P1 | S | — | DONE |
| 002 | Restore the extension CI verification gate | P1 | S | — | TODO |
| 003 | Remove unreferenced legacy timer modules | P2 | S | — | TODO |

## Dependency notes

- 002 supplies the CI gate used to verify 001 and 003.
- 003 can run independently after 002 establishes a baseline.

## Findings considered and rejected

- Remove or rewrite stale `docs/timer_PRD.md`: top-fix scope only; `docs/PRD.md` explicitly marks this draft superseded, and no code change is required now.
- Fix only the warning in `src/excludeFiles.ts`: the entire module is unreferenced; plan 003 removes it instead of preserving legacy code.
