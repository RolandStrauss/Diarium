---
title: "Plan 011: Rename Task to Activity"
status: "Planning"
---

## Status

- Priority: P1
- Effort: S
- Risk: LOW
- Depends on: none
- Category: enhancement
- Status: TODO

## Why

Task is narrower than the product's manual work-description field. Activity is consistent on screen and in reports.

## Data compatibility

Keep `task` in TypeScript types and JSON schemas. Renaming storage now would break existing records.
The change is presentation-only unless a separate schema migration is explicitly approved.

Replace user-facing text in:

- Entries tab labels, filters, placeholders, validation, and accessible names.
- Period report table and accessible names.
- Browser print view.
- Timesheet PDF headings and unsupported-character errors.
- README and PRD terminology.

Keep existing CSS identifiers and internal field names unless a named refactor is separately approved.

## Steps

1. Replace visible and accessibility text with Activity.
2. Update print styles and PDF header text.
3. Update validation text to say activity.
4. Rename test assertions and DOM assertions that describe visible text.
5. Leave entry identifiers and `task` JSON fields unchanged.

## Test plan

- No visible Task label remains in Entries or Period report.
- Print and PDF use Activity.
- Existing saved entries remain readable.
- Existing JSON transfer files remain accepted.
- Accessibility names describe Activity.

## Done criteria

- [ ] User-facing text consistently says Activity.
- [ ] Internal storage remains backward compatible.
- [ ] Print, webview, PDF, tests, and docs agree.

## STOP conditions

- User-facing change would require renaming portable JSON fields.
- Any saved data must be rewritten to complete the UI rename.
