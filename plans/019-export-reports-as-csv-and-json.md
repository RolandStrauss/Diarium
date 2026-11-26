---
title: "Plan 019: Export reports as CSV and JSON"
status: "Planning"
---

## Status

- Priority: P1
- Effort: M
- Risk: MED
- Depends on: plans 011 and 012
- Category: enhancement
- Status: TODO

## Why

Users need machine-readable copies of the selected reporting period. CSV and JSON complement the existing
print and PDF actions without replacing either.

## Contract

Keep the print/PDF report and the portable timesheet JSON envelope separate:

- Print report opens a temporary landscape A4 PDF in the default PDF viewer.
- Save as PDF writes the existing timesheet PDF.
- Save as CSV writes one flat report table.
- Save as JSON writes a versioned report envelope.

Do not reuse the `time-tracker-timesheet` merge/import format. Report JSON is an export document, not import data.

## CSV shape

Use one row per report entry and include these columns in this order:

```text
Date,Day,Activity,Time In,Time Out,Entry Duration,Daily Total,Public Holidays,Weekend,Incomplete
```

Use the selected period boundaries and saved report state only. Do not include draft edits.
UTF-8 encode the file, quote fields containing commas or line breaks, and escape embedded double quotes.
Write `INCOMPLETE` for exactly one time. Write an empty entry duration for a task-only or blank row.

One row must represent every date and entry. Dates with no entry remain one blank activity row.
Daily total appears only on the first row for that date. Holidays are semicolon-separated in their own field.

## JSON shape

Use one versioned UTF-8 JSON report envelope:

```json
{
  "kind": "time-tracker-report",
  "schemaVersion": 1,
  "exportedAt": "2026-11-26T09:00:00.000Z",
  "period": {
    "start": "2026-10-21",
    "end": "2026-11-20"
  },
  "totalMinutes": 0,
  "daysLogged": 0,
  "holidays": [],
  "entries": []
}
```

Each entry object contains date, day, activity, timeIn, timeOut, durationMinutes, dailyMinutes,
weekend, incomplete, and holidays fields. Preserve wall-clock values. Exclude hourly rate and estimated value.

## Scope

- Replace the two-choice report quick pick with Print report, Save as PDF, Save as CSV, and Save as JSON.
- Generate CSV and JSON from the authoritative saved state, not webview draft state.
- Use plan 012 export-folder settings as the default save directory.
- Reject export when unsaved period, rate, or entry drafts exist.
- Confirm success only after the file is fully written.
- Cancellation writes nothing and reports no success.
- Keep source, file-activity, and file-path data out of report exports.
- Add CSV/JSON filters to the VS Code save dialog.

## Steps

1. Add a small report serialization module or functions beside `timeData.ts`.
2. Build CSV and JSON only after pending writes and saved state are authoritative.
3. Include one row/object for every date and entry.
4. Add JSON schema metadata and `exportedAt` validation only for future import, not now.
5. Extend `saveDocument()` with the existing `json` format and a `csv` format.
6. Reuse the existing export-directory resolver from plan 012.
7. Update print quick-pick labels, tests, README, PRD, and architecture docs.

## Test plan

- Print, PDF, CSV, and JSON success, cancellation, and write failure.
- Empty report, leap year, weekends, holidays, incomplete entries, overnight entries, and overlapping entries.
- CSV commas, quotes, embedded text, Unicode, and line breaks.
- JSON round-trip shape and exact wall-clock values.
- Unsaved draft rejection.
- No hourly estimate, file activity, file paths, or source contents in exports.
- Default export folder used where valid, then normal save dialog fallback.

## Done criteria

- [ ] Report action offers print, PDF, CSV, and JSON.
- [ ] CSV includes the complete period and all entries.
- [ ] JSON uses the distinct versioned report envelope.
- [ ] Exported data is machine-readable and privacy-safe.
- [ ] Draft, cancellation, failure, and folder behavior are tested.

## STOP conditions

- CSV or JSON would overwrite or alter the local timesheet store.
- Report JSON is merged into the manual-timesheet import contract.
- Export would require a new dependency or remote service.
