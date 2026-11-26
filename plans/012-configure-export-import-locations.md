---
title: "Plan 012: Configure export and import locations"
status: "Done"
---

## Status

- Priority: P1
- Effort: M
- Risk: MED
- Depends on: plan 008
- Category: enhancement
- Status: DONE

## Why

Repeated timesheet and Outlook transfers should start from predictable folders. The extension needs explicit
fallback behavior for missing, moved, or invalid directories.

## Settings

Add VS Code settings with absolute or workspace-relative folder rules resolved by the extension:

- `diarium.exportDirectory`: default export folder.
- `diarium.importDirectory`: default source folder.
- `diarium.outlookImportDirectory`: default source folder for Outlook `.ics` files.

Use no settings as the default. Existing save/open dialogs remain the fallback.

Directory settings must not accept file names. They apply to the existing JSON timesheet transfer and to
timesheet report exports, including future CSV and JSON report documents. Resolve relative paths against the workspace folder only when
one unambiguous workspace exists; otherwise use the extension host machine as the base and show the resolved
path. Do not create directories silently before export succeeds.

For import, missing or unreadable directories open a normal OS picker and show one actionable warning.
For export, missing directories are not created automatically. Reuse the normal save dialog so the user chooses
a valid destination.

Outlook `.ics` import should prefer `diarium.outlookImportDirectory`, then `diarium.importDirectory`, then no
default folder. JSON import uses `diarium.importDirectory`.

## Scope

- Add `contributes.configuration` to `package.json`.
- Centralize VS Code configuration lookup and folder validation.
- Apply settings to `showSaveDialog`, `showOpenDialog`, and Outlook `.ics` selection.
- Keep cancellation, overwrite confirmation, and write behavior unchanged.
- Document setting scope and fallback behavior.

## Steps

1. Add configuration keys with clear descriptions and string types.
2. Add one folder resolver for absolute and relative paths.
3. Add a regular-directory check before opening or saving.
4. Pass the resolved default URI only when valid.
5. Fall back to normal dialogs and visible warnings.
6. Test settings, invalid folders, relative folders, and cancellation.

## Test plan

- Default settings preserve current dialog behavior.
- Absolute export/import directories are used.
- Invalid or missing directories do not block a user-selected fallback.
- Relative directories resolve consistently for one-folder workspaces.
- Multi-root workspaces do not guess a folder.
- Settings never create directories or move files.

## Done criteria

- [x] Settings appear in VS Code configuration.
- [x] Timesheet JSON export/import and Outlook import use correct defaults.
- [x] Invalid paths fall back safely.
- [x] Documentation explains scope and privacy.

## STOP conditions

- A setting would silently create or overwrite data.
- Workspace-relative resolution is ambiguous.
- Implementation requires a custom settings webview or dependency.
