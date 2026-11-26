---
title: "Plan 015: Track language extensions and edit saves"
status: "Done"
---

## Status

- Priority: P1
- Effort: M
- Risk: MED
- Depends on: plan 013
- Category: enhancement
- Status: DONE

## Why

Users need to see which development tools are used and how much editing activity occurs. VS Code data can be
aggregated without source contents.

## Product decisions

- Track document language IDs and matching installed extensions.
- Count:
  - edits: change batches or dirty-document change events, capped at one edit count per active document burst
  - saves: each successful `onDidSaveTextDocument` event
- Do not count source text, file names, or document contents.
- Use extension ID and display name from extension manifests.
- If no matching extension can be identified, label the language as Built-in or Unknown.
- A document language change updates the matching extension for later events.

## Edit count rules

Use a short debounce, such as 500 ms, to turn a continuous typing burst into one edit event. Keep saves
separate and never infer one save as an edit.

Store only totals and the last-seen timestamp unless a future plan explicitly adds history.

## Scope

- Listen to `onDidChangeTextDocument` and `onDidSaveTextDocument`.
- Resolve language contributions from installed extensions.
- Resolve matching extension IDs once and cache them in memory.
- Aggregate edit/save counts per workspace and extension ID.
- Persist counts through the shared workspace-activity write queue.

## Test plan

- Typing burst counts as a bounded edit event.
- Saving counts exactly once per successful save event.
- Save outside workspace does not add a workspace attribution.
- Language changes and extension disablement recover safely.
- Source content is never persisted or transmitted.

## Done criteria

- [x] Extension usage reports edit and save totals.
- [x] Counting rules are deterministic.
- [x] Workspace attribution is conservative.
- [x] No source content or file paths enter the store.

## STOP conditions

- VS Code exposes no reliable extension-to-language mapping.
- Counting edits would require reading document contents or diffs.
