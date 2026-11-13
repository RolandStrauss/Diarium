# Time Tracker

A local-first Visual Studio Code extension for recording daily work time and exporting configurable timesheet reports.

## Use

Run **Time Tracker: Open Timesheet** from the Command Palette.

- File activity starts automatically. It tracks local files while the VS Code
  window is focused, counts idle periods, pauses when focus leaves, and persists
  totals across sessions. Open **File activity** to review per-file totals.
- File activity uses VS Code extension storage across workspaces. It stores
  local file paths and durations. It does not track untitled or virtual files,
  and it stays separate from daily entries and PDF reports.
- Record one task and time pair per date. A time out earlier than time in is treated as an overnight shift.
- Browse the 365 or 366 dates in a calendar year, filter by date or task, and review filtered totals.
- Review daily, Monday-to-Sunday weekly, monthly, or yearly totals.
- Open **Period report** to edit the 21st-to-20th reporting cycle and configure an optional hourly rate. **Print report** opens a landscape A4 PDF in your default PDF viewer; use the viewer's **Print** command to print it. A print copy is kept in extension storage without prompting for a save location. **Save as PDF** lets you choose where to save the report.
- Incomplete time pairs are highlighted and excluded from totals. Entries and preferences are saved as JSON in VS Code extension storage and persist across restarts; existing extension-stored data is migrated automatically.

The initial reporting period starts on 21 October 2026. Its end date is calculated automatically. The hourly estimate is informational and does not represent payroll or an invoice.

## Development

- `npm run compile` compiles the extension.
- `npm run lint` checks the source.
- `npm test` runs the VS Code extension tests against the bundled extension; the test runner downloads a VS Code instance when one is not already available.
- `npm run package:optimized` builds a VSIX with the PDF runtime dependencies included.


Made with ❤️ for better productivity
