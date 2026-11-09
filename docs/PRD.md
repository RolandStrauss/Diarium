# Product Requirements: Time Tracker

## 1. Overview

**Product:** Time Tracker, a timesheet tracking and logging extension for Visual Studio Code  
**Status:** Draft  
**Audience:** Individuals who need to record work hours and produce clear timesheet reports

Time Tracker lets a user record daily work, review totals over useful reporting periods, and print a compact monthly timesheet. Records are stored locally by the extension; the product does not require a service or account.

## 2. Problem and goals

Users need a low-friction way to maintain accurate work-time records without leaving VS Code. A useful timesheet must handle overnight shifts, identify incomplete entries, calculate durations and totals consistently, and produce a readable report for a configurable 21st-to-20th reporting cycle.

### Goals

- Create and maintain dated time entries with a task description and in/out times.
- Calculate shift duration, hours, and entry counts automatically.
- Support standard daily, weekly, monthly, and yearly views, as well as a configurable reporting cycle.
- Make incomplete or invalid time entries easy to identify and correct.
- Produce a one-page, print-friendly report for a reporting period.
- Keep records available across VS Code restarts without requiring network access.

### Non-goals for the initial release

- Cloud synchronization, accounts, team administration, or manager approval workflows.
- Payroll, tax, invoicing, or compliance certification.
- Automatic activity tracking, screenshots, or monitoring of user activity.
- Calendar integrations or external time-clock integrations.

## 3. Users and primary scenarios

**Primary user:** An individual recording their own work time.

1. The user opens the Time Tracker view and records the date, task description, time in, and time out.
2. The extension calculates the duration, including when a shift ends after midnight.
3. The user filters records and reviews totals for a day, week, month, year, or reporting period.
4. The user configures a period start date, checks the automatically calculated end date, and prints the period report.
5. The user notices a highlighted partial entry, completes or corrects it, and sees the totals update.

## 4. Product requirements

### 4.1 Timesheet entries

Each entry contains:

- **Date:** The local calendar date on which the shift starts.
- **Task description:** Free text describing the work.
- **Time In:** Local time in 24-hour `HH:mm` format.
- **Time Out:** Local time in 24-hour `HH:mm` format.
- **Duration:** Automatically calculated elapsed time; read-only.

The entry list must provide 365 rows and filtering by date and task-description text. Empty rows are available for new records; saved records remain available when filtered. The initial product assumes one entry per date. If a user tries to create a second entry for the same date, the extension must explain the one-entry-per-date constraint rather than silently overwrite an entry.

The interface must show the total hours and the number of completed entries for the currently selected/filter-matched set. Totals must update when entries are added, edited, removed, or filtered. Incomplete entries do not contribute to duration or completed-entry totals.

### 4.2 Duration and input validation

- Dates must be valid calendar dates.
- Times must be valid 24-hour clock values from `00:00` through `23:59`.
- A completed entry requires both Time In and Time Out.
- If Time Out is earlier than Time In, interpret Time Out as occurring on the following calendar day. For example, `22:00` to `06:00` is 8 hours.
- If Time Out equals Time In, calculate zero hours; do not assume a 24-hour shift.
- Reject invalid values with a clear, field-specific message. Do not save invalid values or silently normalize them.
- If exactly one time field is populated, mark the entry as incomplete and apply warning highlighting. Keep the entered value so the user can finish the entry.
- If neither time field is populated, treat the row as a blank row, not as a warning.
- Durations are elapsed time, displayed to the minute and summed without rounding individual entries to whole hours.

### 4.3 Reporting periods

Provide period views for:

- **Daily:** One selected calendar date.
- **Weekly:** The selected date's week, Monday through Sunday.
- **Monthly:** The selected calendar month.
- **Yearly:** The selected calendar year.
- **Custom reporting cycle:** A user-configurable start date and automatically calculated end date.

The standard reporting cycle starts on the 21st of a month and ends on the 20th of the following month, inclusive. The initial configured **Period Start** is **21 October 2026** and its calculated **Period End** is **20 November 2026**.

Period End is calculated as one calendar month after Period Start, minus one day. For example, a start date of 21 January results in an end date of 20 February; a start date of 21 December results in an end date of 20 January of the following year. The user may change Period Start; Period End is not independently editable.

The custom-cycle report must show:

- Automatically generated date and day-of-week columns for every date in the period, inclusive.
- Editable Time In and Time Out fields for each date.
- Automatically calculated daily duration.
- Total hours for the reporting period.
- Number of days logged (dates with complete, valid time pairs).
- Weekend highlighting.
- Warning highlighting on dates with exactly one of Time In or Time Out entered.

### 4.4 Hourly rate

The user can set an hourly rate for estimating the value of recorded time. Display the configured rate and a calculated estimate for the selected report period, calculated as total hours multiplied by the rate. The estimate is informational only and must not be presented as payroll or an invoice. The rate is optional; hide the estimate until a valid rate is configured.

### 4.5 Print report

The user can print the custom reporting-cycle report. The print layout must:

- Fit on one printed page using a compact, legible layout.
- Include the period start and end, generated date/day columns, time in, time out, daily duration, total hours, and days logged.
- Preserve weekend and incomplete-entry distinction in print, using labels or patterns as well as color so the report remains understandable in grayscale.
- Omit application chrome and interactive controls.
- Avoid clipping or dropping period dates. If the user's print settings make one-page output impossible, show a clear print-layout warning rather than silently omit content.

## 5. Data, persistence, and privacy

- Store entries and preferences locally using VS Code extension storage.
- Preserve records and configured preferences across extension and VS Code restarts.
- Do not transmit timesheet data or hourly rate over the network.
- A user can edit and delete their own records.
- Dates and times represent local wall-clock values; no timezone conversion is performed.
- Data export/import is not required for the initial release.

## 6. UX and accessibility requirements

- Provide a discoverable VS Code command to open the timesheet and a clear route to the report.
- Make calculated fields visibly read-only and distinguishable from editable fields.
- Associate validation and incomplete-entry warnings with the affected date/field; do not rely on color alone.
- Support keyboard navigation and editing for all entry fields and report controls.
- Use accessible labels for date, task, time, duration, filters, and totals.
- Keep totals and current report-period boundaries visible while reviewing the corresponding entries.

## 7. Acceptance criteria

1. A user can create, edit, and delete a valid dated entry with a task description and both times; the record remains after restarting VS Code.
2. Duration for `09:00`–`17:30` is 8 hours 30 minutes; duration for `22:00`–`06:00` is 8 hours.
3. Equal in/out times produce a zero duration. Invalid dates and times cannot be saved.
4. A row with only one time value receives warning highlighting and is excluded from completed hours and days/entry counts; a blank row is not warned.
5. The list offers 365 entry rows and filters by date and task text; totals and entry counts reflect the filtered records.
6. Daily, Monday-to-Sunday weekly, calendar-month, and calendar-year views calculate totals over their respective inclusive date ranges.
7. With Period Start set to 21 October 2026, Period End is 20 November 2026. Changing the start date recalculates the end date using the defined calendar-month rule.
8. The custom-cycle report contains a row for every date in the inclusive period, correct day names, weekend styling, daily durations, period total hours, and days logged.
9. A configured hourly rate produces a clearly labeled estimate equal to period hours multiplied by the rate; no estimate appears without a valid rate.
10. Printing produces a one-page report with the required period details and no interactive controls, without losing dates or totals.
11. The extension works offline and timesheet data is not sent to an external service.

## 8. Open decisions and assumptions

- **One entry per date:** Assumed for the initial release because the requested report uses one time-in/time-out pair per day. Supporting multiple shifts per day would require a different row and aggregation model.
- **365 rows:** Interpreted as 365 available daily rows in the timesheet grid, with filtering across saved records. Whether the product should support leap-day/366-day display in the same grid should be confirmed before implementation; records themselves must not be lost if a calendar year contains 366 days.
- **Period start:** The requested initial date (21 October 2026) is treated as the seeded default, not a date dynamically chosen from the current system clock.
- **Currency:** The hourly-rate currency and locale are not specified. The initial implementation should use a user-configurable currency or clearly display the rate as a numeric amount without implying a currency until one is selected.
