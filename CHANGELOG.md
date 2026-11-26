# Changelog

All notable changes to Diarium will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Move Outlook Calendar `.ics` import from the Entries tab to Maintenance.

## [0.1.7] - 2026-11-26

### Changed

- Update the bundled VSIX and package version.

## [0.1.6] - 2026-11-24

### Added

- Add a Maintenance tab for common tracking, export, timer, and recovery actions.
- Add Outlook Calendar `.ics` import for timed and all-day entries.
- Add custom timesheet period end dates.

### Fixed

- Restore the maintenance-action extension test harness.

## [0.1.5] - 2026-11-24

### Added

- Sort manual time entries by Time In, with blank times listed last.

## [0.1.4] - 2026-11-21

### Added

- Add versioned JSON export and merge-only import for manual entries and public holidays.
- Add keyboard tab navigation, invalid-field focus, forced-colors fallbacks, and explicit
  file-tracking states.
- Add extension-host, accessibility, package, and performance verification evidence.

### Changed

- Rename the extension and its primary display metadata to Diarium.
- Keep automatic file activity, exclusions, file paths, and reports outside portable timesheet files.
- Prevent duplicate manual-entry acknowledgements from creating repeated entries.

### Fixed

- Preserve stored data when validation, import, or persistence fails.
- Report invalid or unreadable storage without overwriting it.

### Removed

- Remove unreferenced legacy timer, exclusion, and time-card modules.

## [0.1.3] - 2026-11-17

### Added

- Add named public holidays that appear in entries, period reports, and PDF exports.
- Add non-destructive storage recovery and ownership checks.

### Changed

- Synchronize entry changes and rendering across open timesheet panels.
- Omit hourly estimates from printed and saved timesheet reports.

### Fixed

- Improve error reporting for invalid input and failed storage operations.

## [0.1.2] - 2026-11-13

### Added

- Support multiple manual entries for the same date.
- Treat a Time Out earlier than Time In as an overnight shift.

## [0.1.1] - 2026-11-13

### Added

- Add all-file time-card previews with standalone HTML and paginated PDF export.
- Add floating timer, file-exclusion, pause/resume, and file-activity reset commands.

### Changed

- Display status-bar totals and open the timesheet from the status bar.
- Use shared file-activity snapshots without writing storage on each timer refresh.

## [0.1.0] - 2026-11-13

### Added

- Start automatic per-file tracking when the extension activates.
- Add reduced-motion-aware time-card presentation.

### Changed

- Bundle the extension with esbuild before tests and packaging.
- Refactor file tracking, report generation, and extension lifecycle into focused modules.

## [0.0.3] - 2026-11-12

### Changed

- Improve timesheet state handling and report generation.
- Add the bundled extension build and optimized VSIX packaging workflow.

## [0.0.1] - 2026-11-09

### Added

- Add the initial Time Tracker timesheet command.
- Add daily, weekly, monthly, and yearly reporting.
- Add configurable timesheet PDF export.
- Add an hourly estimate for on-screen timesheet totals.

[Unreleased]: https://github.com/RolandStrauss/Diarium/compare/9919dfa...HEAD
[0.1.7]: https://github.com/RolandStrauss/Diarium/commit/9919dfa
[0.1.6]: https://github.com/RolandStrauss/Diarium/commit/eac0799
[0.1.5]: https://github.com/RolandStrauss/Diarium/commit/0b9564d
[0.1.4]: https://github.com/RolandStrauss/Diarium/commit/080778c
[0.1.3]: https://github.com/RolandStrauss/Diarium/commit/5901134
[0.1.2]: https://github.com/RolandStrauss/Diarium/commit/95ff1d0
[0.1.1]: https://github.com/RolandStrauss/Diarium/commit/f0444cd
[0.1.0]: https://github.com/RolandStrauss/Diarium/commit/3b26a39
[0.0.3]: https://github.com/RolandStrauss/Diarium/commit/dbf968b
[0.0.1]: https://github.com/RolandStrauss/Diarium/commit/4b5cace
