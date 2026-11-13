# Time Tracker

A local-first Visual Studio Code extension for recording daily work time and exporting configurable timesheet reports.

## Use

Run **Time Tracker: Open Timesheet** from the Command Palette.

- The status bar shows total file time and current-file time. Click it to open
  the Time Tracker panel.
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

## Time cards

Run **Time Tracker: Preview Time Card** from the Command Palette, or choose
**Preview time card** in **File activity**.

- Cards summarize all-time automatic file activity across workspaces, not timesheet entries.
  They include idle time while VS Code is focused.
- The preview uses a green-and-gold gradient, animated progress bars, and a responsive layout.
  Motion stops when reduced motion is enabled and when printing.
- **Save HTML** exports a standalone, offline card with no scripts or external assets.
  Open it in a browser to share or print. **Save PDF** exports a static A4 card using
  the existing PDF engine. Long lists continue across pages; no files are omitted.
- **Refresh snapshot** updates the preview. Exports use the displayed snapshot, not changing live totals.
  The snapshot timestamp uses UTC. Durations display whole minutes; percentages use unrounded time.
- Exports contain file names only, not directory paths. Repeated names are numbered.
  Review file names before sharing because names can contain sensitive information.
- PDF cards support Latin file names. For other scripts or emoji, save HTML and use your
  browser's print-to-PDF option. The extension reports unsupported names instead of corrupting them.

Existing timesheet reports and tracking data remain unchanged. Exporting does not reset tracked time.

## Development

- `npm run compile` compiles the extension.
- `npm run lint` checks the source.
- `npm test` runs the VS Code extension tests against the bundled extension; the test runner downloads a VS Code instance when one is not already available.
- `npm run package:optimized` builds a smaller VSIX by excluding repository-only
  instructions and dependency-manager caches. Required PDF runtime dependencies
  remain included.


Made with ❤️ for better productivity
