## Architectural Style

- Primary style: local-first modular extension host with webview presentations.
- Why: VS Code owns activation and commands, while the extension coordinates domain modules and local stores.
- Primary constraints:
  - Only one extension host may own shared storage at a time.
  - Automatic file activity and manual timesheet data remain separate.
  - Export and report operations must stay local to the host machine.

## System Flow

```text
VS Code activation or command
  -> src/extension.ts command routing
  -> storage ownership and module initialization
  -> webview message or tracker event
  -> timeData/fileTimeTracker domain logic
  -> globalState or globalStorage JSON
  -> webview/status/PDF export update
```

1. Activation registers commands and starts storage ownership.
2. The open-timesheet command creates or reuses webviews.
3. Webview messages pass to `src/extension.ts`, which validates and updates state.
4. Manual state serializes to `globalStorageUri/timesheet.json`.
5. File events update `FileTimeTracker`, which persists checkpoints to `globalState`.
6. Status, panels, cards, and PDFs derive or export snapshots from the shared tracker state.

## Responsibilities

| Layer or module | Owns | Must not own | Evidence |
|---|---|---|---|
| `src/extension.ts` | Activation, commands, storage, ownership, panel lifecycle | Low-level PDF drawing | `src/extension.ts` |
| `src/fileTimeTracker.ts` | Elapsed-time calculation, checkpoint writes, pause/exclusions | Manual entry validation | `src/fileTimeTracker.ts` |
| `src/timeData.ts` | Date, time, entry, holiday, and `.ics` validation | File-system persistence | `src/timeData.ts` |
| `src/webview.ts` | Main panel HTML and draft state rendering | Direct VS Code storage writes | `src/webview.ts` |
| `src/pdfReport.ts` | Timesheet PDF rendering | Stored-state migration | `src/pdfReport.ts` |
| `src/timeCard.ts` | Time-card snapshot and HTML/PDF output | Live file tracking | `src/timeCard.ts` |
| `src/storageOwnership.ts` | Shared-storage lock | Application data migration | `src/storageOwnership.ts` |

## Reused Patterns

| Pattern | Where found | Why it exists |
|---|---|---|
| Central command dispatcher | `src/extension.ts` | Keeps VS Code command routing and lifecycle in one extension host |
| Serialized asynchronous writes | `src/extension.ts`, `src/fileTimeTracker.ts` | Prevents overlapping storage updates |
| Explicit snapshots | `src/fileTimeTracker.ts`, `src/timeCard.ts` | Separates live display data from stable export data |
| Migration with validation | `src/extension.ts` | Preserves and verifies legacy/manual stored data before use |
| Owner lock | `src/storageOwnership.ts` | Prevents simultaneous VS Code hosts from changing shared records |

## Storage and Data Boundaries

- Manual timesheet: `globalStorageUri/timesheet.json`.
- Automatic activity: `context.globalState.time-tracker.file-activity`.
- Legacy activity: `context.globalState.fileTimers`, preserved without automatic merge.
- Legacy manual state: `context.globalState.time-tracker.data`, read as migration input.
- Owner lock: `globalStorageUri/time-tracker.owner.lock`.

Timesheet JSON export contains entries and public holidays only. It excludes file paths, durations,
exclusions, report settings, and source documents.

## Known Architectural Risks

- `src/extension.ts` is large and coordinates many features, so it remains a high-change and high-coupling area.
- Two storage representations exist during migration and must retain non-destructive recovery behavior.
- Shared storage supports only one owner; stale lock recovery requires explicit user intervention.
- Legacy modules remain in the source tree even though the active entry point does not import them.

## Evidence

- `src/extension.ts`
- `src/fileTimeTracker.ts`
- `src/timeData.ts`
- `src/storageOwnership.ts`
- `docs/ARCHITECTURE.md`

