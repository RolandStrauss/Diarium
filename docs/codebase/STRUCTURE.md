## Top-Level Map

| Path | Purpose | Evidence |
|---|---|---|
| `src/` | Active extension, domain modules, rendering, storage, and tests | `src/extension.ts`, `src/*.ts`, `src/test/*.test.ts` |
| `docs/` | Product requirements, architecture, plans, performance evidence | `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/performance-evidence.md` |
| `plans/` | Ordered implementation plans and verification records | `plans/README.md`, `plans/*.md` |
| `.github/workflows/` | Continuous integration for extension tests and packaging | `.github/workflows/playwright.yml` |
| `.vscode/` | Extension-host launch and watch-task configuration | `.vscode/launch.json`, `.vscode/tasks.json` |
| `out/` | Compiled JavaScript and source maps | `tsconfig.json`, `package.json` |
| `docs/codebase/` | Evidence-backed codebase knowledge documents | Generated in this repository |

## Entry Points

- Runtime entry: `src/extension.ts`, compiled to `out/extension.js` and declared as `main` in `package.json`.
- Test entry: `src/test/*.test.ts`, executed through `@vscode/test-cli` and `@vscode/test-electron`.
- Module entry selection: VS Code activation starts `src/extension.ts`; activation also occurs with `onStartupFinished` or the open-timesheet command.
- Packaging entry: `npm run bundle` invokes esbuild for `src/extension.ts`.

## Module Boundaries

| Boundary | Owns | Must not own | Evidence |
|---|---|---|---|
| Extension host | Command registration, lifecycle, storage, ownership, panel coordination | PDF and time-card rendering internals | `src/extension.ts` |
| File tracking | File intervals, pause state, exclusions, persisted totals | Manual entries or report presentation | `src/fileTimeTracker.ts` |
| Timesheet data | Entry and holiday validation, date arithmetic, `.ics` parsing | VS Code APIs or persistence | `src/timeData.ts` |
| Main webview | Timesheet HTML, draft messages, synchronization | Direct storage implementation | `src/webview.ts`, `src/extension.ts` |
| PDF reports | PDF report layout and document generation | Timesheet storage policy | `src/pdfReport.ts` |
| Time cards | Card snapshots and HTML/PDF rendering | Automatic tracker state updates | `src/timeCard.ts` |
| Floating timer | Timer panel lifecycle and display | Tracking interval implementation | `src/floatingTimer.ts` |
| Storage ownership | Single-owner lock lifecycle | Timesheet business validation | `src/storageOwnership.ts` |

## Naming and Organization Rules

- Source files use lower camel-case names such as `fileTimeTracker.ts` and `storageOwnership.ts`.
- Test files use the same module name plus `.test.ts`, for example `timeData.test.ts`.
- Implementation modules live flat under `src/`; tests live under `src/test/`.
- Relative imports use `./` module paths; no TypeScript path aliases are configured.
- Active modules are referenced directly from `src/extension.ts`.
- Legacy modules `src/excludeFiles.ts`, `src/timeTrackerProvider.ts`, and `src/timeCardGenerator.ts` remain outside active imports.

## Evidence

- `package.json`
- `src/`
- `src/extension.ts`
- `docs/ARCHITECTURE.md`
- `plans/README.md`

