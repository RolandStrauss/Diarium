---
title: "Plan 010: Move Outlook Calendar import to Maintenance"
status: "Complete"
---

## Status

- Priority: P1
- Effort: S
- Risk: LOW
- Depends on: plan 009
- Category: enhancement
- Status: DONE

## Why

Outlook import is maintenance, not date-entry editing. Its current Entries-tab button mixes data transfer
with daily record editing.

## Scope

Move only the existing `.ics` import control:

- Remove the Import Outlook Calendar button and listener from the Entries tab.
- Add one button to the Maintenance Timesheet data card.
- Route it through the existing `importOutlookCalendar` webview message and extension-host flow.
- Keep the current 5 MiB limit, confirmation, cancellation, duplicate filtering, and error handling.
- Keep the Command Palette behavior unchanged.

Do not add an Outlook command or duplicate import logic.

## Steps

1. Remove the Entries-toolbar button and `#import-outlook-calendar` listener.
2. Add a labeled maintenance action under Timesheet data.
3. Route it to the existing extension-host message handler.
4. Pass a neutral view value; no Entries-tab-specific result is required.
5. Update tests and user documentation.

## Test plan

- Maintenance action opens the Outlook file picker.
- Entries tab contains no import button.
- Confirmation, cancellation, duplicate imports, invalid files, and file-size rejection remain unchanged.
- Keyboard navigation reaches the maintenance action.

## Done criteria

- [x] Import control exists only in Maintenance.
- [x] Existing import behavior is unchanged.
- [x] Focused tests and documentation pass.

## STOP conditions

- The enhancement requires changing the Outlook parser or import contract.
- The existing maintenance route would copy or bypass confirmation logic.
