## Integration Inventory

| System | Type | Purpose | Auth model | Criticality | Evidence |
|---|---|---|---|---|---|
| Visual Studio Code extension API | Platform API | Commands, webviews, storage, dialogs, active-editor and focus events | VS Code host authorization | High | `package.json`, `src/extension.ts` |
| Local file system | Storage/report export | Save timesheets, PDF reports, HTML cards, JSON imports and exports | OS process permissions | High | `src/extension.ts`, `src/pdfReport.ts`, `src/timeCard.ts` |
| PDFKit | Library | Generate PDF documents | No network authentication | High | `package.json`, `src/pdfReport.ts`, `src/timeCard.ts` |
| Outlook `.ics` files | File import format | Import calendar events as manual entries | User-selected local file | Medium | `src/timeData.ts`, `src/extension.ts` |
| GitHub Actions | CI/CD | Compile, lint, test, package, inspect | Repository-provided runner permissions | Medium | `.github/workflows/playwright.yml` |

No external HTTP APIs are called by the active source code.

## Data Stores

| Store | Role | Access layer | Key risk | Evidence |
|---|---|---|---|---|
| VS Code `globalState` | Automatic totals, exclusions, legacy/manual migration state | `src/extension.ts`, `src/fileTimeTracker.ts` | Storage corruption or stale ownership | `src/extension.ts`, `src/storageOwnership.ts` |
| VS Code `globalStorageUri/timesheet.json` | Manual entries, period, rate, holidays | `src/extension.ts` | Invalid writes or interrupted atomic replacement | `src/extension.ts` |
| Owner lock file | Prevents concurrent shared-store mutation | `src/storageOwnership.ts` | Stale lock after crash | `src/storageOwnership.ts` |

The project has no database server or remote data store.

## Secrets and Credentials

- No environment secrets or credentials are used by active source code.
- No `.env` template is present.
- Outlook, timesheet, and file-activity data remain local to VS Code and user-selected export files.
- Exported JSON and HTML/PDF files can contain task names or file names, so sharing them may expose user data.

## Reliability and Failure Behavior

- Storage writes are serialized and use validation before replacement.
- Manual state loading validates entries, periods, hourly rate, and holidays before use.
- Timesheet imports reject unsupported schema, duplicate/conflicting identifiers, oversize files, and malformed JSON.
- Storage ownership prevents two active hosts from mutating shared stores.
- Report and import operations return actionable errors instead of silently replacing data.
- `[TODO] No retry/backoff policy or network timeout policy is applicable because the active integration set is local.`

## Observability

- No telemetry or remote analytics is configured.
- VS Code webview and message status text provide local user-visible state.
- CI produces test and packaging output through GitHub Actions.
- No application metrics, traces, remote logs, or alerting integration is present.

## Evidence

- `src/extension.ts`
- `src/storageOwnership.ts`
- `src/timeData.ts`
- `src/pdfReport.ts`
- `src/timeCard.ts`
- `.github/workflows/playwright.yml`
- `README.md`

