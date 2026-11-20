---
title: "Plan 008: Export and import timesheet data"
status: "Complete"
---

> **Executor instructions**: Run the drift check first. Preserve valid local data on every import path.
> Use the existing storage parser and write queue instead of creating a second store.
> Update `plans/README.md` after verification passes.

> **Drift check (run first)**:
> `git diff --stat 09ab1c6 -- package.json src/extension.ts src/webview.ts src/test README.md docs/prd.md`

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plan 002
- **Category**: enhancement
- **Status**: DONE
- **Planned at**: 2026-11-20

## Why this matters

Users need to move manual timesheet records between VS Code profiles, machines, and test environments.
Copying extension-global storage files manually is opaque, unsafe, and easy to combine with stale data.

The current PRD explicitly excludes user-facing import. This enhancement requires a narrow PRD revision and
must keep automatic file activity, exclusions, and existing reports outside the portable file.

## Current state

- `src/extension.ts` stores manual entries, report period, hourly rate, and holidays in `timesheet.json`.
- `parseState()` validates dates, times, identifiers, rates, periods, holidays, and duplicate IDs.
- `writeState()` writes through a temporary file before renaming into place.
- `changeState()` serializes edits and broadcasts durable state to open panels.
- Existing `saveDocument()` already handles user-selected destinations and cancellation.
- No `showOpenDialog` flow or portable schema exists.
- Raw file-activity recovery export is separate and must remain unchanged.

## Data contract

Use one versioned UTF-8 JSON envelope:

```json
{
  "kind": "time-tracker-timesheet",
  "schemaVersion": 1,
  "exportedAt": "2026-11-20T20:00:00.000Z",
  "entries": {},
  "holidays": []
}
```

Rules:

- Export manual `entries` and `holidays` only.
- Preserve stored entry IDs and field values exactly.
- Do not export the reporting period or hourly rate.
- Do not export file paths, file-activity totals, exclusions, or source contents.
- Reject unknown schema versions, invalid shapes, invalid records, or duplicate IDs.
- Treat the file as untrusted input and impose a practical byte-size limit using project-native filesystem APIs.

## Commands you need

| Purpose | Command | Expected success |
|---------|---------|------------------|
| Typecheck | `npx tsc -p tsconfig.json --noEmit` | Exit 0, no errors |
| Lint | `npm run lint` | Exit 0, no errors or warnings |
| Test | `npm test` | Existing and import/export tests pass |
| Package | `npm run package:optimized` | VSIX builds successfully |

## Scope

**In scope**:

- `package.json` for discoverable export and import commands
- `src/extension.ts`
- `src/webview.ts` only if panel shortcuts are added
- Focused tests in `src/test/reportActions.test.ts` or a new focused test file
- `README.md`
- `docs/prd.md` to replace the import non-goal with the defined enhancement scope

**Out of scope**:

- Cloud synchronization
- Automatic background import or sync
- File-activity totals or exclusions
- Merge conflict user interfaces
- CSV, database, ZIP, or encrypted formats
- Importing reporting periods, rates, or templates

## Steps

### Step 1: Define and test the portable parser

Add a small parser for the versioned envelope in the manual-timesheet module boundary.

Reuse `parseState()` for record validation rather than duplicating date, entry, ID, and holiday rules. Build a
temporary state with the current preferences, then extract validated `entries` and `holidays`.

Add focused tests for:

- valid round-trip content
- malformed JSON
- wrong `kind`
- unsupported `schemaVersion`
- invalid entry or holiday
- duplicate entry ID
- excessive file size

**Verify**: Invalid input is rejected before any state mutation or file write.

### Step 2: Add manual export

Register `time-tracker.exportTimesheet`.

Await pending writes and load the authoritative state. Prompt for a destination through `showSaveDialog`.
Write the envelope with standard UTF-8 JSON. Confirm success only after the complete file is written.

Cancellation writes nothing and reports no success.

Do not expose raw global-storage internals or automatic file activity.

**Verify**: Exported JSON round-trips through the portable parser and matches current entries and holidays.

### Step 3: Add atomic merge-only import

Register `time-tracker.importTimesheet`.

Use `showOpenDialog` to select one JSON file. Read and validate the complete file before changing state.

Merge with the current state through `changeState()`:

- Keep existing local entries.
- Add imported entries whose IDs do not exist locally.
- Ignore imported entries whose IDs and content exactly match local entries.
- Reject the whole import if an ID already exists with different content.
- Keep existing holidays and add only missing date/name pairs.
- Keep local period and hourly-rate preferences.

Require a modal confirmation that shows added-entry and added-holiday counts. On cancellation, write nothing.
If merge validation or persistence fails, retain the previous durable state and show an actionable error.

**Verify**: A repeated import adds nothing, and an ID conflict changes nothing.

### Step 4: Wire discoverable controls

Add the export and import commands to `package.json`.

Add one compact data action in the Timesheet panel only if it reuses the existing command callbacks cleanly.
Do not create a settings page or import wizard.

Labels must mention that the file contains task descriptions and is intended for local transfer.

**Verify**: Both commands are discoverable and work when no timesheet panel is open.

### Step 5: Document limits and update the PRD

Update the PRD non-goal and storage requirements to describe:

- versioned manual timesheet import/export
- merge-only semantics
- retained local period and hourly-rate preferences
- exclusion of automatic file activity and source contents
- requirement to review task and holiday text before sharing

Update `README.md` with the two commands, privacy warning, repeat-import behavior, and conflict behavior.

**Verify**: Documentation matches the installed commands and tested merge behavior.

## Test plan

- Export cancellation, success, and write failure.
- Import cancellation, success, invalid JSON, oversized input, and write failure.
- Merge into empty and populated stores.
- Repeated identical import is idempotent.
- Conflicting entry ID rejects the complete import.
- Holidays merge without duplicates.
- Local period and hourly rate remain unchanged.
- Existing panels and storage-write queue observe only one durable state broadcast.
- File-activity state remains byte-for-byte unchanged.

## Done criteria

- [x] A versioned JSON timesheet format is implemented and documented.
- [x] Export writes only manual entries and holidays after a user-selected destination.
- [x] Import validates the complete file before mutation.
- [x] Import merges atomically and leaves local preferences unchanged.
- [x] Repeated imports are idempotent.
- [x] Conflicting IDs reject the complete import without data loss.
- [x] Import/export work without an open webview.
- [x] File-activity data, exclusions, and source contents are never exported.
- [x] Cancellation, malformed data, oversized data, and write failure paths are tested.
- [x] `npm test`, `npm run lint`, typecheck, and package build pass.
- [x] README and PRD match the implemented behavior.
- [x] `plans/README.md` status is updated.

## STOP conditions

- The imported file cannot be fully validated before any write.
- Existing local records could be overwritten or discarded by an ambiguous import.
- Portable data requires transmitting data through a service or account.
- The only available parser duplicates `parseState()` rules instead of reusing them.
- Importing file-activity paths becomes necessary to satisfy the request.

## Maintenance notes

Keep schema evolution additive. A future version must explicitly validate and migrate older versions before
using local state; do not accept unknown versions as current data.
