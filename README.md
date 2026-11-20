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
- Record multiple task-and-time pairs per date. A time out earlier than time in is treated as an overnight shift.
  Overlapping ranges are allowed and summed independently.
- Edits to entries and report settings stay as drafts until you choose **Save** or **Discard**.
  Deleting an entry also requires saving its draft. Other drafts and saved values stay unchanged.
- Browse the 365 or 366 dates in a calendar year, filter by date or task, and review filtered totals.
- Review daily, Monday-to-Sunday weekly, monthly, or yearly totals.
- Use **Public holidays** to add or remove named holidays on specific dates. Multiple holidays can share a date.
  Holidays appear in entries and period reports, including exported PDFs, but do not add hours or affect estimates.
  Dates do not repeat automatically. PDF holiday names, like tasks, must use printable ASCII.
- Open **Period report** to edit the 21st-to-20th reporting cycle and configure an optional hourly rate. **Print report** opens a landscape A4 PDF in your default PDF viewer; use the viewer's **Print** command to print it. A print copy is kept in extension storage without prompting for a save location. **Save as PDF** lets you choose where to save the report.
- The hourly rate and estimated value stay on screen and are omitted from printed and PDF reports.
- Timesheet PDFs use multiple landscape A4 pages when needed. Tasks support printable ASCII only; unsupported
  characters are reported instead of truncating or corrupting the report.
- Incomplete time pairs are highlighted and excluded from totals. Entries and preferences are saved as JSON in VS Code extension storage and persist across restarts; existing extension-stored data is migrated automatically.

The initial reporting period starts on 21 October 2026. Its end date is calculated automatically. The hourly estimate is informational and does not represent payroll or an invoice.

Only one VS Code window can use Time Tracker's shared storage at a time. Other
windows show an unavailable status and do not track or modify records. Close the
owning window, then reload another window to use the extension.

After an unexpected crash, a storage lock may remain. Close all VS Code windows
and ensure their extension hosts have stopped. Then remove only the lock file
named in the error message and reopen VS Code. Do not remove the timesheet or
other storage files.

## Move timesheet data

Use **Time Tracker: Export Timesheet Data** and **Time Tracker: Import Timesheet Data**
to transfer manual entries and public holidays between VS Code profiles or machines.

- Exports use a versioned UTF-8 JSON file.
- The file contains manual entries and holidays, including task and holiday text.
  Review it before sharing because those descriptions can be sensitive.
- Imports merge into the local timesheet. Repeating the same import adds nothing.
- Existing local entries, reporting period, and hourly rate stay unchanged.
- A conflicting entry identifier rejects the complete import without replacing local data.
- Automatic file paths, durations, exclusions, reports, and source contents are not exported or imported.
- Files larger than 5 MiB and unsupported schema versions are rejected.

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
- PDF cards support printable ASCII and Latin-1 file names. For other characters, save HTML and use your
  browser's print-to-PDF option. The extension reports unsupported names instead of corrupting them.

Existing timesheet reports and tracking data remain unchanged. Exporting does not reset tracked time.

## Floating timer

Run **Time Tracker: Show Floating Timer**, or choose **Show floating timer** in **File activity**.

- The compact panel shows total and current-file activity as `HH:mm:ss`, updated every second.
  It reads the existing tracker; updates do not write storage every second.
- The panel opens beside the editor without taking focus. Keep it in a separate editor group,
  or use VS Code's **Move into New Window** action on its tab.
  This is a VS Code panel, not a desktop always-on-top overlay.
- **Pause** saves elapsed file time and stops all automatic file tracking, including idle time.
  **Resume** starts from the currently focused local file without counting the paused interval.
  File changes and window focus changes do not cancel a manual pause.
- **Hide timer**, closing the tab, or **Time Tracker: Hide Floating Timer** closes only the panel.
  Tracking continues unless paused. Showing the timer again restores live totals.
- **Time Tracker: Pause / Resume File Tracking** also works when the panel is closed.
  The status bar and File activity indicate a manual pause.
- Manual pause lasts for the current extension session. After restarting VS Code, automatic
  tracking resumes. Stored totals, daily entries, reports, and time cards remain unchanged.
- **Time Tracker: Manage File Exclusions** includes or excludes individual local file paths.
  Excluding a file preserves its past activity; exclusions survive restarts and resets.
- **Time Tracker: Reset File Activity** asks for confirmation before clearing automatic totals
  across workspaces. It does not remove timesheet entries, exclusions, or exported files.

## Development

- `npm run compile` compiles the extension.
- `npm run lint` checks the source.
- `npm test` runs the VS Code extension tests against the bundled extension; the test runner downloads a VS Code instance when one is not already available.
- `npm run package:optimized` builds a smaller VSIX by excluding repository-only
  instructions and dependency-manager caches. Required PDF runtime dependencies
  remain included.


Made with ❤️ for better productivity
