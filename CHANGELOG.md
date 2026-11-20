# Change Log

All notable changes to the "time-tracker" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Add versioned JSON export and merge-only import for manual entries and public holidays.
- Validate imported timesheets before mutation, reject conflicting entry identifiers, and keep local preferences.
- Keep automatic file activity, exclusions, file paths, and reports outside portable timesheet files.
- Add a reusable floating timer panel with live second-level totals and show/hide controls.
- Pause and resume the existing automatic tracker without losing partial elapsed time or counting
  paused intervals; keep manual pause across file and focus changes.
- Use shared snapshots and totals for the timer and status bar, with no per-second storage writes.
- Add file-activity time-card previews with gradients, reduced-motion-aware animations,
  and standalone HTML or paginated PDF export.
- Include every tracked file in cards, escape file names, omit directory paths, and handle empty totals.
- Exclude repository-only guidance and Yarn caches from VSIX packages.
- Show total and current-file activity time in the status bar; click it to open
  the existing Time Tracker panel.
- Initial release