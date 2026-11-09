# Time Tracker

A local-first Visual Studio Code extension for recording daily work time and exporting configurable timesheet reports.

## Use

Run **Time Tracker: Open Timesheet** from the Command Palette.

- Record one task and time pair per date. A time out earlier than time in is treated as an overnight shift.
- Browse the 365 or 366 dates in a calendar year, filter by date or task, and review filtered totals.
- Review daily, Monday-to-Sunday weekly, monthly, or yearly totals.
- Open **Period report** to edit the 21st-to-20th reporting cycle and configure an optional hourly rate. Choose **Print report** or **Save as PDF** to export it.
- Incomplete time pairs are highlighted and excluded from totals. All entries and preferences are stored in VS Code extension storage.

The initial reporting period starts on 21 October 2026. Its end date is calculated automatically. The hourly estimate is informational and does not represent payroll or an invoice.

## Development

- `npm run compile` compiles the extension.
- `npm run lint` checks the source.
- `npm test` runs the VS Code extension tests; the test runner downloads a VS Code instance when one is not already available.