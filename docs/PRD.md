# Time Tracker Product Requirements Document

## 1. Purpose and Evidence Boundary

This product requirements document (PRD) defines the current product and the requirements for a trustworthy
release of Time Tracker, a Visual Studio Code (VS Code) extension. It consolidates the timesheet requirements
with the relevant file-activity requirements from [the timer draft](timer_PRD.md).

**Status:** Draft requirements with recommended product decisions. The working-tree source, including local
changes, is the baseline; it is not evidence of an installed or published release. Baseline statements are
static observations, not proof of runtime behavior. Requirements describe the desired release, including
work not yet implemented. Evidence is indexed in section 13.

The timer draft describes a different implementation and contains outdated paths, commands, dependencies,
and test claims. Where it conflicts with the current source, this document preserves the current product's
capabilities and treats the draft's additional requirements as proposed work, not existing behavior.

## 2. Product Summary

Time Tracker provides two separate, local-first experiences:

- **Manual timesheet:** Record multiple task-and-time pairs per date, review date-based totals, and produce a
  configurable reporting-cycle PDF.
- **Automatic file activity:** See cumulative time for selected local files while the VS Code window is focused,
  including idle time. Review a shared timer snapshot and export a time card.

File activity is an indicator of selected-file time, not evidence of active work, attendance, productivity,
or billable hours. It must never be added automatically to manual timesheet entries. Neither experience requires
an account or network service. [E1, E3, E4, E5]

## 3. Users and Goals

The primary user is an individual using VS Code who wants to record work, review hours, understand file
activity, and share a suitable report. These needs are inferred from the repository, not validated by research.

The product must:

- Make manual entry, correction, filtering, and period review straightforward.
- Calculate and present durations consistently, including overnight and incomplete entries.
- Keep automatic file totals explainable across file switches, focus changes, pauses, and restarts.
- Preserve records locally and make errors, storage scope, and sharing implications clear.
- Produce readable reports without accounts, network services, or unnecessary configuration.

**Non-goals:** payroll, tax, invoicing, attendance or productivity scoring, screenshots, automatic idle detection,
other-application monitoring, accounts, cloud synchronization, team approval, calendar integration, and a
native always-on-top overlay. File-activity history is cumulative; daily, weekly, and monthly file-activity
analytics are not in scope. Synchronization, templates, and additional export formats are not included.

User-triggered, versioned JSON export and merge-only import are supported for manual timesheet entries and
public holidays. They do not transfer automatic file activity, file paths, exclusions, reporting preferences,
or existing reports.

## 4. Current Product Baseline

These observations describe the active working-tree code, not verified release behavior. [E3-E8]

- **Discovery:** Startup activation and nine `time-tracker.*` commands are declared in the manifest.
- **Timesheet:** A webview provides entries, date and task filters, calendar-year grid, summaries, and a report.
- **Manual storage:** A JSON file in extension global storage holds entries and preferences. Older
  `time-tracker.data` state is read when the file is absent.
- **Portable timesheets:** Versioned JSON export includes manual entries and public holidays. Import validates
  the complete file, requires confirmation, and merges only non-conflicting records through the manual store.
- **Reporting:** Print opens a locally generated landscape A4 PDF in an external viewer; another action saves PDF.
- **File tracking:** Focused local files accrue elapsed time, including idle time. Pause, switches, focus,
  checkpoints, and shutdown settle intervals.
- **File storage:** Cumulative totals and exact-file exclusions share a versioned extension `globalState`
  record across workspaces. Previous records remain available for recovery.
- **Views:** Status bar opens the timesheet; File activity and the floating timer use file-tracker snapshots.
  Exclusions and confirmed reset are available through Command Palette commands.
- **Time cards:** The active card previews all files and exports standalone HTML or paginated PDF. Duplicate
  names are numbered.

The floating timer is a VS Code webview, not an operating-system overlay. Hide closes the panel without
pausing; manual pause lasts for the extension session. Card timestamps are UTC; cards include file names,
not directory paths. PDF card export currently rejects names outside printable ASCII and Latin-1. [E1, E4, E6]

The unreferenced `ExcludeFiles`, `TimeTrackerProvider`, and `TimeCardGenerator` modules are not wired into the
active entry point. Their old command names, Explorer view, and top-five card must not be described as active
capabilities. The manifest currently declares version `0.1.3`, VS Code `^1.140.0`,
and the `pdfkit` runtime dependency. [E3, E4, E9]

Current command identifiers are `time-tracker.openTimesheet`, `time-tracker.openTimeCard`,
`time-tracker.showFloatingTimer`, `time-tracker.hideFloatingTimer`, and `time-tracker.toggleTracking`.
The remaining commands are `time-tracker.manageExclusions`, `time-tracker.resetFileTimes`,
`time-tracker.exportTimesheet`, and `time-tracker.importTimesheet`. Preserve these identifiers and the
status-bar route to the timesheet.

## 5. Gaps That Affect Product Trust

The analysis identified defects in storage validation, failed writes, concurrent edits, exclusions, reset,
display refresh, report clipping, and calendar boundaries. The working tree now contains repairs and focused
tests for these areas. Full release confidence still requires the checks in sections 9 and 10. [E4-E9]

- **Recovery:** Invalid saved data is reported without silently overwriting it. Raw file-activity data can be
  exported for recovery. A stale ownership lock requires the documented manual recovery procedure.
- **Concurrency:** A local ownership lock prevents multiple extension hosts from writing the shared stores.
  Timesheet panels reject stale edits. Other windows remain unavailable until the owner exits and they reload.
- **Legacy totals:** Older `fileTimers` data remains separate and is not automatically merged. Users must
  reconcile its ownership and contents before relying on totals.
- **Reports:** The paginated timesheet PDF rejects unsupported task characters. Timesheet PDF tasks support
  printable ASCII only; the viewer controls physical print settings.
- **Validation readiness:** Automated tests do not establish accessibility, cross-platform behavior, or release
  readiness by themselves. The Playwright workflow references tooling absent from the manifest.

## 6. Scope and Priorities

Both P0 and P1 are required for this proposed release. Priority determines sequence, not permission to omit work.

| Priority | Scope |
| --- | --- |
| P0 | Entry and timer correctness; non-destructive storage, concurrency, privacy, reset, and error handling. |
| P1 | Filtering, summaries, accessibility, transfer, timesheet PDF, exclusions, and card exports. |

Preserve existing behavior unless a requirement below explicitly changes it. Do not add a service, account,
new framework, or dependency merely to implement these requirements.

## 7. Functional Requirements

Requirements apply to the release target. A baseline observation in section 4 does not itself satisfy them.

### FR-01: Manual Entries

- Each saved entry has a valid local calendar date, a nonblank task description, and zero, one, or two
  24-hour `HH:mm` times. The date is the shift's start date. Any number of entries may share a date.
- Users can add, edit, or delete entries independently. Overlapping time ranges are allowed; totals sum each
  completed entry and may therefore exceed elapsed time when ranges overlap.
- A task-only entry is saved but has no duration and is not incomplete. A row with no task and no times is blank.
  A time without a task is invalid and must remain available for correction rather than being saved.
- Exactly one time makes an entry incomplete. Keep the entered value, label the row, and exclude it from
  completed counts and totals. Two valid times make it complete, including a zero-duration pair.
- Reject invalid dates and times with a field-specific message; do not silently normalize or save them.
  Calculate minutes as wall-clock time: an earlier Time Out is on the next day; equal times mean zero,
  not 24 hours. Do not adjust for daylight-saving transitions.
- Display calculated duration as read-only hours and minutes. Sum integer minutes, without rounding each entry
  to whole hours. Timesheet values are not a guarantee of actual elapsed time across clock changes.

### FR-02: Views, Filtering, and Periods

- Show every date in the selected calendar year: 365 or 366 dates, with one row per saved entry and an editable
  blank row when a date has no entries. Never discard leap-day records.
- Filter by exact date and case-insensitive task substring. With a task filter, search saved entries across
  years; when both filters are set, apply both. With neither filter, show the selected year.
- Show daily totals, filtered hours, and completed-entry counts for visible matching entries. Update them on add,
  edit, delete, and filter changes. Daily, Monday-to-Sunday weekly, calendar-month, and calendar-year summaries
  use the selected summary date and include both endpoints; they are independent of grid filters.
- The custom period defaults to 21 October 2026 for new data. Its editable start determines its read-only end:
  add one calendar month, clamping the day to the last day of the target month if needed, then subtract one day.
  For example, 21 December 2026 ends on 20 January 2027, and 31 January 2026 ends on 27 February 2026.
- Reject a start date if its calculated period cannot be represented as a four-digit calendar date.
  Do not overwrite the last valid period on rejection.
- The cycle report includes each inclusive date, day of week, every task and its editable times and duration,
  summed daily duration, total hours, and count of dates with one or more complete valid pairs. Distinguish
  weekends and incomplete entries with text or patterns as well as color.

### FR-03: Hourly Estimate and Timesheet PDF

- Show the configured optional, finite, non-negative hourly rate. Calculate `total minutes / 60 × rate`,
  displayed to two decimal places as an informational estimate. A blank rate removes the estimate. No currency
  is implied or displayed.
- Print opens the generated PDF in the default viewer; the user starts printing in that viewer. Save as PDF
  prompts for a destination. Cancellation writes nothing; errors are visible; success is reported only after
  the file is written or the viewer is opened, respectively.
- The report uses landscape A4 PDF pages and includes every date and entry without clipping or omission. Repeat
  table headings on each page. Include the task column, period boundaries, daily and period totals, and days
  logged. Use at least 7.5-point type and label weekends and incomplete entries in grayscale. Never silently
  truncate or corrupt a task; explain content that cannot be represented and do not claim a complete report.
- The viewer and printer control paper size, scaling, and margins. Tell users to print the generated A4 pages
  at a suitable scale; do not promise to detect every external printer setting.

### FR-04: Automatic File Tracking

- After activation, track the selected local `file` editor only while its VS Code window is focused, tracking
  is running, and the file is not excluded. Files outside workspace roots are eligible. Untitled and virtual
  files are not. Idle time while focused counts; activity outside VS Code does not.
- Start an eligible already-open file without requiring a switch. Settle the prior file exactly once on a
  switch, loss of eligibility, pause, exclusion, reset, checkpoint, or orderly shutdown. Never attribute one
  file's interval to another or count an interval twice.
- A snapshot includes the current eligible interval once. Reopening starts a new interval and never counts
  time while the extension was closed. Persist cumulative totals, not live timing anchors.
- Pause and resume use one shared session state across the command and floating timer. Pausing settles time;
  file and focus changes while paused cannot resume tracking. Resuming starts the currently eligible file
  from the resume boundary, excluding the paused interval. Restart resets manual pause to running.

### FR-05: Exclusions and Reset

- Provide exact-local-path exclusion and reinclusion through a discoverable control. Preserve historical totals
  when excluding a file; settle the active interval before exclusion and start a fresh interval on reinclusion.
  Persist exclusions across restarts and ordinary resets. Do not introduce glob patterns.
- Distinguish duplicate basenames in the exclusion picker. Cancellation changes nothing; an attempt to exclude
  without an eligible file explains why.
- Provide an explicit, modal confirmation before resetting all automatic file totals in the shared store.
  Cancellation changes nothing. Confirmation clears only automatic file totals, not exclusions, manual
  timesheets, preferences, or existing exports. An eligible active file starts a new zero-based interval.
- Reset must not report success until persistence succeeds. On failure, report the error and retain or recover
  the prior durable data. Never silently include unresolved legacy records in a reset.

### FR-06: Consistent File-Activity Displays

- The status bar, File activity, floating timer, and time-card snapshot use the same cumulative totals and
  tracking state. Total equals the sum of all scoped file totals, with the current interval included once.
- File activity lists paths and readable hour/minute durations; duplicate basenames remain distinguishable.
  Count a file only after it has a positive total or is currently eligible, consistently across displays and cards.
- The floating timer shows total and current-file durations as `HH:mm:ss` and refreshes every second while
  visible. It uses the shared snapshot, not an independent counter; refreshes do not cause per-second writes.
- Pause, resume, focus, exclusion, reset, and file changes update visible state promptly. Show running, paused,
  excluded, or waiting status in text, not color alone.
- Show and hide commands and the File activity entry point reuse one panel. Hide or close only affects
  presentation; it never pauses tracking. The panel can move to another VS Code window but is not a native
  always-on-top overlay.

### FR-07: File-Activity Time Cards

- A card is an explicit snapshot of cumulative automatic file activity, separate from manual reports. Label its
  timestamp as the generation time in UTC and state that idle time while focused is included.
- Show every counted file in descending duration order, total duration, file count, and each file's share of the
  unrounded total. Display durations in whole minutes and percentages to one decimal place; independent rounding
  need not sum to 100%. Handle empty and zero totals without division errors.
- Render file names as text, distinguish duplicate basenames with unique numbered labels, and omit directory
  paths and source contents from exports. Warn users that names can still be sensitive.
- Preview can refresh its snapshot. HTML and PDF export use the displayed snapshot and a user-selected
  destination; cancellation writes nothing. Show actionable errors and confirm success only after writing.
- HTML is standalone, offline, and contains no scripts. PDF may span pages without omitting files. If PDF fonts
  cannot represent a name, report the limitation and offer HTML/browser printing rather than corrupting text.

### FR-08: Persistence, Migration, and Concurrency

- Store manual entries and preferences in local extension-global storage; store automatic totals and exclusions
  globally across workspaces, including a no-workspace window. The two datasets remain separate.
- Persist manual edits and preferences after validation. Checkpoint eligible file activity at least every
  60 seconds during normal operation and settle it on meaningful transitions and orderly shutdown.
  Await writes before confirming success; report failures and allow a later retry.
- Invalid or unreadable stored data must produce a visible diagnostic and a non-destructive recovery path.
  Preserve the original data; never silently replace it with an empty store or discard malformed records.
- Read legacy single-entry-per-date records as one-entry lists and preserve their date, task, and time values.
- Migrate known legacy data only after validating it. Preserve the source until the destination is durably
  written, and make migration repeatable. If old and new totals both exist and their relationship is unknown,
  retain both without automatically summing or overwriting them; require explicit user reconciliation.
  Existing aggregate totals cannot reconstruct previously miscounted intervals.
- Prevent lost updates across timesheet panels and extension hosts. Use one shared authoritative state and
  a single writer for each global store; other hosts must not track or modify that store while ownership is
  unavailable. Show a clear read-only or paused state and allow safe recovery after an owner exits or crashes.
  Never silently merge competing whole-store snapshots.

### FR-09: Portable Manual Timesheet Data

- Provide discoverable export and import commands that work without an open timesheet panel.
- Export a versioned UTF-8 JSON envelope containing manual entries and public holidays. Preserve entry IDs and
  values, and include an export timestamp. Do not export reporting period, hourly rate, automatic file activity,
  file paths, exclusions, source contents, or existing reports.
- Validate the complete import before mutation. Reject malformed JSON, unsupported versions, invalid timestamps,
  invalid records, duplicate IDs, and files larger than 5 MiB. Never pass through unsupported top-level fields.
- Import through the same serialized manual-store writer used by normal edits. Require modal confirmation with
  added-entry and added-holiday counts. Cancellation writes nothing and reports no success.
- Keep local entries, reporting period, and hourly rate. Add only records not already present. Treat an identical
  entry ID and value as already imported, add missing holidays once, and reject the complete import when an entry
  ID conflicts with a different local value.
- Confirm export only after the user-selected file is written. On import or export failure, show an actionable
  error and retain the previous durable data. Warn users that task and holiday descriptions can be sensitive.

## 8. Non-Functional Requirements

- **Privacy:** Do not transmit file paths, names, timesheet data, rates, or source contents. Manual timesheet
  export is local and user-initiated; it contains task and holiday text that users must review before sharing.
  File tracking must not read file contents. Explain global storage and export sensitivity in user documentation.
- **Security:** Escape dynamic text and attributes in their rendering contexts. Validate webview messages and
  apply a restrictive Content Security Policy (CSP); exported HTML needs no scripts or remote resources.
- **Accessibility:** Support keyboard navigation and meaningful labels for all inputs and actions. Associate
  errors with their fields; do not rely on color, icons, or motion alone. Support light, dark, high-contrast,
  reduced-motion, and grayscale output.
- **Lifecycle:** Dispose listeners, timers, and panels when their owners close. Reopening a floating panel
  repeatedly must not multiply intervals. Preserve current command identifiers and existing valid data.
- **Compatibility:** Target the manifest's VS Code `^1.140.0` unless a separate compatibility decision changes
  it. Test path identity, storage, and exports on Windows, macOS, and Linux. Preserve local wall-clock
  timesheet values without timezone conversion.

## 9. Proposed Release Checks and Success Measures

These are acceptance targets, not observed measurements or business metrics.

- Deterministic-clock tests produce exact millisecond totals through activation, file switches, pause, focus,
  exclusions, reset, checkpoints, shutdown, and restart, with no duplicate or ineligible intervals.
- During normal, unblocked extension-host operation, a visible timer and state changes appear within one second.
  The 60-second checkpoint bounds normally unpersisted eligible time; failed writes or abrupt termination can
  exceed that bound and must not be represented as lossless recovery.
- Restart preserves successfully settled data exactly. Repeated migration, canceled reset, write failures,
  malformed data, concurrent panels, and concurrent hosts preserve all applicable durable records.
- Timesheet PDF contains every required date, entry, and total across landscape A4 pages, or reports a
  representation limitation without claiming success. Card exports match the preview snapshot and include every
  counted file.
- Timesheet export round-trips every manual entry and holiday without preferences or file-activity data.
  Repeated import adds nothing, conflicts reject the complete operation, and cancellation or failure preserves
  local durable data.
- With 1,000 seeded file records, snapshot and card generation each complete within 200 ms on a documented
  reference machine. Record hardware, operating system, VS Code version, input, and timing method.

No adoption, revenue, or productivity target is supported by current evidence. Do not add telemetry solely
to measure success.

An exploratory 1,000-record probe on Windows `10.0.26100`, Intel Core Ultra 7 265U, and Node `26.13.1`
measured maxima of 1.78 ms for snapshots and 4.66 ms for card creation plus HTML rendering. It used two
warm-up iterations and ten measured iterations. This ran outside the VS Code `1.146.0` extension host;
the release check still requires an in-host measurement.

## 10. Validation Strategy

Use focused automated cases, then test the extension host and generated artifacts. Existing tests are starting
points, not evidence that the full release criteria have passed. [E8]

- Test dates, leap years, month-end clamping, year boundaries, invalid input, multiple entries per date,
  partial rows, equal times, overnight and overlapping times, filters, counts, estimates, and restart persistence.
- Use a deterministic clock for start, switch, no editor, focus loss and regain, pause/resume, exclusions,
  reset, checkpoint, restart, and persistence-failure sequences.
- Exercise simultaneous panels and extension hosts, ownership loss and recovery, failed writes and retry,
  malformed storage, and repeatable migration with conflicting legacy data.
- Test portable timesheet export and import with valid, repeated, conflicting, invalid, oversized, canceled,
  and failed-write cases. Verify local preferences and automatic file-activity state remain unchanged.
- Inspect generated PDFs for page count, every date and entry, totals, long tasks, weekends, incomplete entries,
  grayscale readability, and unsupported characters. Test print-viewer and save success, cancellation, and failure.
- Test cards with empty data, more than five files, repeated and special-character names, long names, Unicode,
  multi-page PDFs, and preview/export snapshot equality.
- Verify keyboard access, labels, themes, reduced motion, repeated panel open/close, and extension disposal.
  Run supported-platform extension-host and packaged-extension smoke tests.
- Run `npm run compile`, `npm run lint`, and `npm test` for implementation changes. Use
  `npm run package:optimized` for release verification. Fix or replace the unverified Playwright workflow
  before relying on it; do not equate its existence with coverage.

## 11. Implementation Boundaries and Delivery Sequence

Use the existing TypeScript modules and VS Code APIs; do not introduce a separate timing counter or service.

1. Establish shared-store ownership, non-destructive recovery, and repeatable migration for both datasets.
1. Repair and test manual entry, period, report, and persistence failure paths.
1. Complete automatic tracking, exact-file exclusions, safe reset, and coherent snapshots.
1. Align displays and exports with the shared snapshots; retain existing HTML and PDF card capabilities.
1. Add validated, merge-only portable manual-timesheet exchange without adding synchronization or file tracking.
1. Verify accessibility, extension-host behavior, supported platforms, packaging, and release metadata;
   update user documentation to describe actual behavior.

No delivery date or effort estimate is implied.

## 12. Open Product Decisions

The following recommendations resolve the draft's decisions for this PRD. They are product requirements,
not claims that the current implementation already meets them. A product owner may revise them explicitly.

1. **Storage:** Retain existing global-across-workspaces storage for both datasets. It avoids a disruptive,
   ambiguous migration; workspace isolation can be reconsidered only with a user-controlled migration plan.
1. **Focus:** Count selected local-file time only while the window is focused, including idle time. This
   preserves the current product's policy without introducing unreliable activity detection.
1. **Concurrent windows:** Permit one writer per global store. Other hosts show a clear unavailable/read-only
   or paused state until safe ownership is acquired; never silently lose or double-count data.
1. **Floating Hide:** Close the panel and keep tracking. The existing Show command restores it.
1. **Calendar and currency:** Show 366 rows in leap years; use a numeric, currency-neutral hourly estimate.
   Keep the specified 21 October 2026 seed and the clamped-month end rule in FR-02.
1. **Portable data:** Keep timesheet transfer local, explicit, versioned, and merge-only. A portable file does
   not include automatic file activity or local preferences.
1. **Distribution:** Do not change publisher, repository, support links, or release version by assumption.
   Block publication until ownership and metadata are verified; package creation does not approve publication.
1. **Release targets:** Use the checks in section 9 and record their test environment. Product ownership must
   accept the evidence before release; no unmeasured target is reported as achieved.

## 13. Evidence Index

Links identify the inspected working-tree sources; the timer draft is historical input, not baseline evidence.

- **E1:** [README](../README.md): documented workflows, storage, exports, and floating timer.
- **E2:** [Timer draft](timer_PRD.md) and [changelog](../CHANGELOG.md): proposed timer requirements and history.
- **E3:** [Manifest](../package.json), [TypeScript configuration](../tsconfig.json),
  [test configuration](../.vscode-test.mjs), and [Playwright workflow](../.github/workflows/playwright.yml):
  commands, dependencies, supported version, and validation setup.
- **E4:** [Activation and persistence](../src/extension.ts) and [file tracker](../src/fileTimeTracker.ts):
  storage, transfer, tracking transitions, commands, and report actions.
- **E5:** [Timesheet data](../src/timeData.ts), [timesheet webview](../src/webview.ts), and
  [timesheet PDF](../src/pdfReport.ts): validation, periods, presentation, and report generation.
- **E6:** [Floating timer](../src/floatingTimer.ts) and [time card](../src/timeCard.ts):
  panel lifecycle, snapshot rendering, and exports.
- **E7:** [Packaging exclusions](../.vscodeignore) and [launch configuration](../.vscode/launch.json):
  packaging and extension-host launch setup.
- **E8:** [Extension tests](../src/test/extension.test.ts), [report-action tests](../src/test/reportActions.test.ts),
  and [card tests](../src/test/timeCard.test.ts): existing test cases and their limits.
- **E9:** [Legacy exclusions](../src/excludeFiles.ts), [legacy provider](../src/timeTrackerProvider.ts), and
  [legacy card generator](../src/timeCardGenerator.ts): unconnected draft-era modules, not active features.

## 14. Definition of Done

The proposed release is complete only when:

- All P0 and P1 requirements pass, including failure, recovery, concurrency, and accessibility paths.
- Timing, storage, migration, reset, manual reports, and card exports have recorded automated and
  extension-host evidence against sections 9 and 10.
- Portable timesheet export/import passes round-trip, idempotence, conflict, cancellation, failure, and
  file-activity separation checks.
- Existing command identifiers and valid records remain compatible; unresolved legacy data is preserved.
- Documentation matches verified storage, transfer, focus, pause, exclusion, reset, print, and export behavior.
- Supported-platform and packaged-extension smoke checks pass, and release ownership is confirmed.

This document alone does not implement requirements or establish security, runtime, performance, or release
validation.
