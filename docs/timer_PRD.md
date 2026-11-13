---
title: "Time Tracker Product Requirements Document"
date: "2026-11-13"
status: "Draft for product-owner review"
---

## 1. Purpose and Evidence Boundary

This product requirements document (PRD) defines the purpose, existing capabilities, and proposed
release requirements for Time Tracker, a Visual Studio Code (VS Code) extension.

The baseline is the current working-tree source, including existing local changes, not an installed
Marketplace release or either packaged extension. The manifest identifies version `0.1.2`.
Requirements below are proposals, not features implemented by this document.

Analysis covered the five application source files, extension manifest, compiler configuration,
user documentation, packaging exclusions, and continuous integration (CI) workflow.
No knowledge graph exists in this checkout. Inspection was static; extension-host behavior,
Marketplace availability, packaged binaries, and performance were not tested.

Evidence references E1-E9 in section 13 identify the sources for baseline claims.

## 2. Product Summary

Time Tracker helps developers see how much elapsed time they spend with individual files selected
in VS Code. It provides cumulative totals, a file breakdown, manual pause controls, file exclusions,
and a visual time-card preview without a separate application or account.

The central product problem is visibility: developers need a low-effort way to understand where
their editor time goes. The immediate delivery problem is trust: totals and controls must behave
consistently before users rely on reports.

**Positioning:** a lightweight personal editor-time tool, not a measure of productivity, verified
working time, or billable effort. Selecting a file is not proof that a person is actively editing it.

The repository documents automatic tracking, persistence, reporting, and exclusions as its core
intent. Claims of workspace storage, HTML export, and a freely movable timer exceed the inspected
implementation; those differences are recorded below. [E1, E2, E3, E5, E7]

## 3. Users and Goals

These user needs are inferred from the repository's feature set, not validated through user research.

### Primary User

A developer working in VS Code who wants to:

- Start tracking with minimal setup.
- Compare cumulative time across files.
- Pause tracking during breaks and exclude unrelated files.
- Review a readable summary and share a time card.
- Keep recorded totals when VS Code closes and reopens.

### Product Goals

- Produce explainable, accurate elapsed-time totals.
- Keep pause, exclusion, reset, and display behavior consistent.
- Preserve existing records and make storage scope explicit.
- Retain a small, local-first experience without accounts or network services.
- Restore the documented ability to save an HTML time card.

### Non-Goals for This Scope

- Billing, invoicing, attendance monitoring, or employee performance scoring.
- Daily, weekly, or monthly filtering; current data has no interval history.
- Automatic idle detection, activity scoring, or background application tracking.
- Cloud synchronization, shared team dashboards, or account management.
- Productivity goals, template customization, or additional export formats.
- A native always-on-top desktop overlay.

Analytics, goals, multiple export formats, synchronization, and templates appear only as
"Coming Soon" items in the changelog. They are not committed requirements here. [E3]

## 4. Current Product Baseline

This section describes inspected behavior, not a guarantee that every feature works correctly.

### Capabilities

| Area | Observed implementation | Evidence |
| --- | --- | --- |
| Tracking | Active-editor changes select a file; the periodic update runs every 60 seconds. | E5 |
| Persistence | Timer records and exclusions use extension `globalState`. | E5, E8 |
| Status bar | Total and current-file durations display as `HH:MM`; clicking opens Explorer. | E5 |
| Explorer view | Total Time and Active Files nodes; refresh every 10 seconds. | E6 |
| Floating timer | Scripted webview beside the editor; sends stored totals every second. | E7 |
| Pause | Command and floating-timer button call the same tracker toggle. | E5, E7 |
| Exclusions | Exact file-path membership; Quick Pick supports exclusion and reinclusion. | E8 |
| Time card | Static HTML with an 800-by-600 SVG and the five longest-duration files. | E9 |
| Reset | Modal confirmation clears timer records but does not clear exclusions. | E5, E8 |

The time card totals and file count include every stored record, not only its five displayed rows.
Percentages use the complete total and are independently rounded. The displayed date is the
generation date; the data is cumulative, not filtered to that date. [E9]

The floating timer is a VS Code editor webview. Its Hide button dims and shrinks the content;
it does not close the panel. One-second messages do not imply one-second accrual, because the
panel reads stored totals without advancing the tracker. [E5, E7]

### Commands and Entry Points

Retain these existing command identifiers for compatibility with user-defined bindings. [E4, E5]

| Command identifier | Manifest title |
| --- | --- |
| `timeTracker.toggle` | Toggle Timer |
| `timeTracker.openPanel` | Open Time Tracker |
| `timeTracker.generateTimeCard` | Generate Time Card |
| `timeTracker.showFloatingTimer` | Show Floating Timer |
| `timeTracker.toggleExclude` | Toggle Exclude |
| `timeTracker.reset` | Time Tracker: Reset All Time Data |

The Explorer view identifier is `timeTrackerView`. Its title menu exposes time-card generation,
the floating timer, and reset. No default keybindings or contributed settings exist. [E4]

The manifest targets VS Code `^1.74.0`, with an empty `activationEvents` array and command/view
contributions. Automatic activation from opening a file alone requires extension-host verification;
it must not be treated as tested from the README claim. [E1, E4]

## 5. Gaps That Affect Product Trust

These findings follow source paths. Their user-visible effects require runtime regression tests
before fixes are considered complete.

### Timing and State Transitions

- **Initial file:** the constructor selects an already-open file without creating its timer record.
  Tracking can remain empty until an editor-change event creates a record.
- **Pause and resume:** toggling changes the global flag but does not settle or reset the file's
  `lastStartTime`. A later update can include the paused interval.
- **Switch while paused:** `onEditorChange` returns before updating `currentFile`. Resuming can
  attribute time to the previously selected file.
- **Exclude and reinclude:** exclusion changes do not settle or reanchor the active timer.
  A later update can include an excluded interval or omit eligible time.
- **Reopen:** saved records contain `lastStartTime` and `isTracking`; loading does not reanchor them.
  An update can include time while the extension was not running.
- **Reset:** clearing the map does not recreate a record for the still-open file. Tracking may not
  restart until another editor change.
- **Persistence:** writes happen on the minute update or reset, not on editor changes or shutdown.
  Storage promises are not awaited, so completion and failure are not confirmed. [E5, E8]

### Documentation and Presentation

- The guide describes workspace-specific storage, but both stores use `globalState`. Files from
  different workspaces can appear in one total. [E2, E5, E8]
- The README and guide promise HTML saving; the generator contains no save dialog or file write. [E1, E2, E9]
- The guide describes a movable timer; source creates an editor webview without custom dragging. [E2, E7]
- Time-card filenames are interpolated into SVG text without escaping. Rendering must preserve
  names as text rather than interpret markup. [E9]
- Basename-only rows can make different files with the same name hard to distinguish. [E6, E9]
- Manifest version and project links differ from README/changelog history and this checkout's
  repository identity. Release ownership and support links need confirmation. [E1, E3, E4]

## 6. Scope and Priorities

P0 means release-blocking correctness or data protection. P1 completes the core reporting experience.
Both priorities belong to this proposed scope; the sequence does not authorize dropping P1.

| Priority | Requirement group | Delivery intent |
| --- | --- | --- |
| P0 | FR-01 through FR-04 | Reliable tracking, pause, exclusions, and durable data |
| P0 | FR-05 and FR-08 | Consistent views and safe reset |
| P0 | NFR-01 through NFR-04 | Privacy, rendering safety, accessibility, and lifecycle |
| P1 | FR-06 and FR-07 | Trustworthy preview and explicit HTML export |

Storage scope, focus behavior, and concurrent-window ownership need approval before implementation.
Other requirements preserve or repair documented core behavior, rather than add a broader platform.

## 7. Functional Requirements

Acceptance criteria define proposed behavior. Existing implementations are partial unless stated otherwise.

### FR-01: Automatic Per-File Tracking

After activation, begin tracking an eligible current file without requiring a file switch or manual start.
Use elapsed duration, not keystroke counts. No file may receive another file's interval. [E1, E5]

- An already-open, previously untracked file starts accruing immediately.
- Switching files settles the previous file once and starts the selected file.
- With no active text editor, no file accrues time.
- Reading a total includes the current eligible interval without counting it twice.
- Reopening VS Code starts a new interval; time while the extension was closed is never counted.
- Storage scope follows the approved decision in section 12, including files outside workspace roots.

### FR-02: Consistent Pause and Resume

Command Palette and floating-timer controls operate on one shared tracking state. [E5, E7]

- Pausing settles eligible time up to the pause boundary.
- No paused interval contributes to any total.
- Switching files while paused updates the selected file without accruing time.
- Resuming starts a fresh interval for the currently selected, non-excluded file.
- Every visible control and status indicator reflects the same paused or running state.
- Repeated pause/resume cycles do not lose or duplicate eligible intervals.

### FR-03: Exact-File Exclusion

Retain exact-file exclusions and the existing Quick Pick workflow; do not add glob patterns. [E8]

- Excluding the active file settles its eligible interval, then stops accrual.
- Reinclusion starts a fresh interval without counting excluded time.
- Excluding a file preserves its historical total.
- Exclusions survive reopen and an ordinary timer reset.
- Canceling a picker changes nothing; no active editor produces an informative message.
- Different paths with the same basename remain independently selectable.

### FR-04: Durable Data and Explicit Scope

Preserve cumulative time and exclusions within the approved storage scope. Protect existing
`fileTimers` and `excludedFiles` records when changing representation or scope. [E5, E8]

- Persist settled totals on meaningful transitions and orderly shutdown, with periodic checkpoints.
- Keep runtime timing anchors separate from persisted cumulative totals.
- Await storage completion where success is reported; surface failures without clearing valid records.
- Reject invalid stored values with a visible diagnostic and a non-destructive recovery path.
- Any migration preserves every legacy file total and exclusion; it never silently discards records.
- A migration is repeatable without duplicating totals and does not run until scope rules are approved.
- Do not promise recovery of previously miscounted time; the current aggregate data cannot reconstruct it.

### FR-05: Consistent Status, Explorer, and Timer Views

All surfaces read one coherent snapshot of selected-file time, cumulative time, and tracking state.
Display refreshes must not create separate counters. [E5, E6, E7]

- Total time equals the sum of scoped file totals, including the active eligible interval once.
- Status bar retains `HH:MM`; Explorer retains readable hour/minute durations.
- The floating timer displays `HH:MM:SS` and advances while tracking.
- Pause, exclusion, editor changes, and reset update visible state without waiting for the minute checkpoint.
- File rows distinguish duplicate basenames and provide a path tooltip.
- The existing status-bar click still focuses `timeTrackerView`.
- Hiding or closing the floating timer affects presentation only, not tracking.
- The approved Hide behavior is labeled accurately; do not promise a native desktop overlay.

### FR-06: Accurate Time-Card Preview

Generate a snapshot with cumulative total, tracked-file count, generation date, and descending
duration breakdown. Preserve the existing top-five summary rather than build an analytics dashboard. [E9]

- The card uses the same totals as the other views at generation time.
- Label the date as the generation date and the values as cumulative, not daily activity.
- If more than five records exist, disclose "Top 5 of N files"; total and count cover all records.
- Calculate each percentage against the complete total. Do not force rounded values to sum to 100%.
- Empty and zero-duration data display valid zero values without division errors.
- Render filenames as text, including markup characters and long or Unicode names.
- Distinguish duplicate basenames without exposing absolute paths by default.

### FR-07: Explicit HTML Export

Add the missing documented save path for the preview; export only after a user action. [E1, E2, E9]

- Users choose the output destination through a save dialog.
- Save standalone HTML matching the preview snapshot, with no account or remote asset requirement.
- Canceling leaves the preview and tracked data unchanged and writes no file.
- A failed write shows an actionable error; report success only after the write completes.
- Do not export absolute paths, source contents, or other metadata beyond the displayed summary by default.
- HTML export does not add CSV, PDF, image export, or period filtering.

### FR-08: Safe Reset

Retain explicit modal confirmation and preserve exclusions. Reset affects only the clearly described
approved scope. [E5, E8]

- Cancel, No, or dismissal leaves counters and persisted data unchanged.
- Confirming clears the relevant totals and immediately updates every visible surface.
- An eligible still-open file starts a new zero-based interval without requiring a switch.
- Reset does not alter exclusions or previously exported files.
- A persistence failure is reported as a failure, not a completed reset.
- Any unreconciled legacy data is excluded from reset unless the confirmation explicitly includes it.

## 8. Non-Functional Requirements

These safeguards apply to all functional requirements.

### NFR-01: Local-First Privacy

The inspected source has no network service, authentication, or telemetry integration, and the
manifest declares no runtime dependencies. Preserve that baseline. [E4-E9]

- Do not transmit file paths, timing records, or source contents.
- Store only data needed for tracking; do not read file contents to measure elapsed time.
- Explain storage scope and sharing implications in user documentation.
- Treat file names and paths as potentially sensitive information when exporting.

### NFR-02: Safe Rendering and Messages

- Escape dynamic HTML/SVG text and attributes according to their rendering context.
- Keep time-card scripts disabled unless a requirement explicitly needs them.
- Limit floating-timer messages to supported actions and validate incoming message shape.
- Apply an appropriate Content Security Policy (CSP) to webviews without remote resources.

These are proposed release safeguards, not a completed security audit. [E7, E9]

### NFR-03: Accessible and Clear Controls

- Support keyboard operation and meaningful accessible names for timer controls.
- Show text for paused, running, and excluded states; color or icons alone are insufficient.
- Keep controls usable in light, dark, and high-contrast VS Code themes.
- Avoid clipped or unreadable filenames in the view and time-card preview.

### NFR-04: Reliable Lifecycle and Compatibility

- Dispose event subscriptions, refresh intervals, and webview resources when their owner closes.
- Closing and reopening the timer repeatedly must not multiply background intervals.
- Keep existing command/view identifiers and stored data compatible.
- Preserve VS Code `^1.74.0` support unless a separate compatibility decision approves a change.
- Verify platform-sensitive file identity and export behavior on Windows, macOS, and Linux.

Source currently uses TypeScript strict mode with CommonJS output. No replacement framework or
new runtime dependency is required by this PRD. [E4, E7, E6]

## 9. Proposed Release Checks and Success Measures

These thresholds are proposed acceptance targets, not observed performance or approved business metrics.
They must be verified before declaring the associated requirement complete.

- **Timing accuracy:** deterministic-clock tests produce exact expected millisecond totals for start,
  switch, pause, resume, exclude, reinclude, reset, and reopen sequences.
- **Live timer:** a visible running timer reflects elapsed time within one second of an eligible interval,
  except while the extension host is blocked; no independent counter may drift from the shared total.
- **State feedback:** pause, exclusion, and reset become visible within one second under normal host operation.
- **Persistence:** orderly reopen preserves exact settled totals; a checkpoint target of at most 60 seconds
  bounds unpersisted eligible time during normal operation, not during failed writes or abrupt termination.
- **Data protection:** migration and reset-cancel tests preserve every applicable record and exclusion.
- **Reporting:** preview and exported HTML show identical snapshot totals, file count, and selected rows.
- **Responsiveness:** with 1,000 seeded records, snapshot and card generation each finish within 200 ms
  on a documented reference machine; report the baseline and measurement method.

No adoption, revenue, or productivity-improvement target is established by repository evidence.
User research is needed before setting business success metrics. Do not add telemetry solely to measure them.

## 10. Validation Strategy

Validation must exercise the extension host and its shared timer logic, not only the rendered webview.

### Focused Automated Cases

- Activation with an already-open file and activation with no editor.
- Switch between two files, switch to no editor, and switch while paused.
- Pause/resume and exclude/reinclude both before and across a minute checkpoint.
- Reopen with persisted records containing old runtime anchors.
- Reset cancellation, confirmed reset with the current file still open, and failed persistence.
- Legacy migration repeated twice, malformed stored values, and agreed scope boundaries.
- Empty time cards, more than five files, duplicate basenames, and special characters in filenames.
- HTML save success, cancellation, and failure; exported snapshot equality.
- Repeated floating-timer open/close cycles and extension disposal.

### Current Validation Readiness

- `npm run compile` runs the strict TypeScript build. [E4]
- `npm test` references `out/test/runTest.js`, but neither that runner nor application test sources
  exist in the inspected checkout.
- A Playwright workflow exists, but no Playwright dependency or root Playwright configuration
  accompanies it. Workflow presence is not proof of executable coverage. [E4]
- The launch configuration supports an Extension Development Host with a watch prelaunch task.
- `npm run package:optimized` uses the VS Code extension packager; exclusions omit source files
  and source maps. Packaging and minimum-version compatibility were not validated. [E1, E4]

Complete the focused test setup as part of implementation, then perform manual checks in an
Extension Development Host. This documentation-only change does not repair the build or CI workflow.

## 11. Implementation Boundaries and Delivery Sequence

The existing small module structure can support this scope without a new service layer.

| Component | Existing responsibility | Requirements it must support |
| --- | --- | --- |
| `TimeTracker` and activation | Timing, commands, storage, status bar | FR-01, FR-02, FR-04, FR-05, FR-08 |
| `ExcludeFiles` | Membership, picker, exclusion indicator | FR-03, FR-04, FR-05 |
| `TimeTrackerProvider` | Explorer totals and file rows | FR-05 |
| `FloatingTimer` | Timer webview and control messages | FR-02, FR-05, NFR-02, NFR-04 |
| `TimeCardGenerator` | Snapshot formatting and SVG preview | FR-06, FR-07, NFR-02 |
| Manifest and user documentation | Discovery, compatibility, claims | All approved user-visible behavior |

Evidence: [E4-E9]. The implementation must update dependent consumers together rather than
introduce another timing source for each view.

1. Approve storage, focus, and concurrent-window decisions; agree on migration handling.
1. Repair timing transitions and persistence with focused regression cases.
1. Align displays, exclusions, reset feedback, and lifecycle ownership.
1. Make the card snapshot safe and truthful, then implement explicit HTML export.
1. Validate the extension host, packaging, accessibility, and compatibility; update user documentation.

This is a proposed sequence, not a scheduled roadmap. Estimates and release dates remain unassigned.

## 12. Open Product Decisions

These decisions require product-owner approval. Recommendations are not current implementation facts.

1. **Storage scope:** retain global totals or make records workspace-specific?
   Recommendation: workspace-specific records to match the guide, with an explicit no-workspace bucket.
   Preserve legacy global records separately until ownership is resolved; never copy them into every workspace.
1. **Focus policy:** count elapsed selected-file time while VS Code is unfocused?
   Recommendation: suspend accrual on window blur, without adding idle heuristics.
   This is an intentional change from source that currently has no window-focus listener.
1. **Concurrent windows:** how should simultaneous extension hosts share or isolate records?
   Recommendation: prevent shared-store overwrite and double attribution; approve ownership rules
   before claiming support for concurrent windows in the same workspace.
1. **Floating Hide behavior:** retain the current dimmed presentation or truly hide timer content?
   Recommendation: hide content while leaving a keyboard-accessible Show control; closing remains separate.
1. **Distribution ownership:** which publisher, repository, support links, and release version are authoritative?
   Confirm before changing manifest metadata or publishing a package.
1. **Acceptance targets:** approve the proposed latency and checkpoint targets, reference machine,
   supported platform matrix, and responsibility for runtime validation.

## 13. Evidence Index

Relative links point to inspected source and documentation. Symbol names identify the relevant logic.

- **E1:** [README](../README.md): product intent, automatic start, export claims, packaging guidance.
- **E2:** [Operation guide](../GUIDE.md): workflows, workspace-storage claim, timer movement and saving claims.
- **E3:** [Changelog](../CHANGELOG.md): historical feature description and uncommitted future ideas.
- **E4:** [Manifest](../package.json), [compiler settings](../tsconfig.json),
  [packaging exclusions](../.vscodeignore), [debug launch](../.vscode/launch.json), and
  [Playwright workflow](../.github/workflows/playwright.yml): runtime, discovery, build, and validation setup.
- **E5:** [Tracker and activation](../src/extension.ts): `activate`, `toggle`, `onEditorChange`, `update`,
  `updateCurrentFileTimer`, `loadFileTimers`, `saveFileTimers`, and `resetAllTimers`.
- **E6:** [Explorer provider](../src/timeTrackerProvider.ts): constructor interval and `getChildren`.
- **E7:** [Floating timer](../src/floatingTimer.ts): `createPanel`, `toggleVisibility`, `updateTimer`, and `dispose`.
- **E8:** [File exclusions](../src/excludeFiles.ts): `toggleFile`, dialogs, and global-state persistence.
- **E9:** [Time-card generator](../src/timeCardGenerator.ts): `generateTimeCard`, `getWebviewContent`,
  and `generateSVG`.

## 14. Definition of Done

The proposed product work is complete only when:

- Approved P0 and P1 criteria pass with recorded evidence.
- Timing, storage, migration, reset, and reporting checks cover their failure paths.
- Command identifiers and legacy data remain compatible.
- Documentation describes actual storage, pause, hide, and export behavior.
- Packages pass extension-host smoke checks; publishing metadata has confirmed ownership.
- No claim of billing accuracy, period reporting, or cross-device synchronization is introduced.

This PRD is a persistent analysis artifact. It does not claim that any proposed product work,
security validation, compiler check, performance measurement, or release verification has been completed.
