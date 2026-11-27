## Top Risks

| Severity | Concern | Evidence | Impact | Suggested action |
|---|---|---|---|---|
| High | Shared storage has crash/stale-lock recovery but recovery depends on all VS Code hosts stopping | `src/storageOwnership.ts`, `README.md` | Tracking or editing pauses until lock is removed | Add automated lock ownership diagnostics and clear recovery tests |
| High | `src/extension.ts` is a large coordination point | `src/extension.ts` | Regression risk across commands, storage, panels, and imports | Split feature coordinators behind the existing modules |
| Medium | Main webview implementation is tightly coupled and highly changed | `src/webview.ts`, recent git churn | UI validation and message regressions | Add feature-level webview action tests for each Maintenance card |
| Medium | Legacy modules remain in source but are inactive | `src/excludeFiles.ts`, `src/timeTrackerProvider.ts`, `src/timeCardGenerator.ts` | Reader confusion and accidental reuse | Remove only after compatibility and repository intent are confirmed |
| Medium | README and changelog describe a newer display name than some lock/error text | `README.md`, `CHANGELOG.md`, `src/storageOwnership.ts` | Mixed user-facing branding | Replace remaining Time Tracker wording where Diarium is expected |

## Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|---|---|---|---|---|
| Large extension coordinator | Features accumulated in one entry point | `src/extension.ts` | Difficult review and hidden interactions | Extract storage, command, and panel coordination incrementally |
| Legacy source modules | Previous implementation removed from active entry point | `src/excludeFiles.ts`, `src/timeTrackerProvider.ts`, `src/timeCardGenerator.ts` | Dead code and false architecture signals | Delete after confirming no external build references |
| Legacy lock and migration compatibility | Existing installations require upgrade support | `src/extension.ts`, `src/storageOwnership.ts` | Compatibility regressions | Keep migration tests beside each storage format change |
| Stale package-lock identity | Lockfile root name and version differ from current manifest | `package-lock.json`, `package.json` | Confusing dependency metadata and reproducibility checks | `[ASK USER] Confirm whether regenerate or manual correction is intended` |
| Generated output in source tree | Compiled `out/` and VSIX artifacts are tracked | `out/`, `*.vsix` | Large diffs and stale binaries | `[ASK USER] Confirm release process for committing generated artifacts` |

## Security Concerns

| Risk | OWASP category | Evidence | Current mitigation | Gap |
|---|---|---|---|---|
| Exported task and file names may expose sensitive data | Security misconfiguration / information exposure | `README.md`, `src/extension.ts`, `src/timeCard.ts` | README warns users to review exports | No in-app redaction is appropriate because data may be needed |
| Shared storage lock and JSON validation are security-sensitive | Integrity | `src/storageOwnership.ts`, `src/extension.ts` | Single-owner lock and strict parsing | Lock freshness and ownership are not cryptographically authenticated across local processes |
| PDF text and HTML output process user-controlled names | Injection / malformed output | `src/pdfReport.ts`, `src/timeCard.ts` | Printable-character checks and escaped HTML | Keep tests covering unsafe text and Latin-1 boundaries |

No hardcoded credentials or secret lookup were found in active source.

## Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---|---|---|---|---|
| Large file-activity totals and time-card rendering | `src/fileTimeTracker.ts`, `docs/performance-evidence.md` | Benchmark stays below 200 ms at 1,000 records | Large workspaces may grow beyond benchmark size | Add larger measured benchmarks and paging if UI degrades |
| Main webview receives and redraws complete state | `src/webview.ts`, `src/extension.ts` | `[TODO] No manual worst-case UI timing evidence` | Many entries and panels increase serialization/render cost | Measure and reduce updates for large timesheets |
| 60-second checkpoint and one-second display refresh | `src/extension.ts`, `docs/ARCHITECTURE.md` | Display updates do not write on every tick | Long-running sessions may accumulate pending writes | Keep display-only snapshots and preserve write serialization |

## Fragile and High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|---|---|---|---|
| `src/webview.ts` | Central presentation and message handling | 18 recorded git changes | Change one feature at a time with report-action and accessibility tests |
| `src/extension.ts` | Activation, storage, commands, and lifecycle | 15 recorded git changes | Preserve storage ownership and deactivation behavior in tests |
| `src/test/timeData.test.ts` | Validation and date arithmetic coverage | 14 recorded git changes | Add table-style cases before changing validation |
| `src/test/reportActions.test.ts` | Webview/report action seams | 13 recorded git changes | Extend existing test harness rather than introducing a second harness |
| `out/` and compiled test output | Generated and high-churn | 44 combined recorded changes | Rebuild rather than hand-edit |

## Ask User

1. `[ASK USER] Should legacy source modules be removed now, or retained until a later compatibility release?`
2. `[ASK USER] Are compiled `out/` files and tracked VSIX packages intentionally committed release artifacts?`
3. `[ASK USER] Should the package-lock name and version be normalized to the current `Diarium` manifest?`
4. `[ASK USER] Is Playwright used or planned for current webview UI tests, or should it be described as an available workflow only?`

## Evidence

- `src/extension.ts`
- `src/webview.ts`
- `src/storageOwnership.ts`
- `src/test/`
- `package.json`
- `package-lock.json`
- `docs/performance-evidence.md`
- Git churn: 18 changes for `src/webview.ts` and 15 for `src/extension.ts` in the scan history.
