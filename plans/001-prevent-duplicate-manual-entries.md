# Plan 001: Prevent duplicate manual entries

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md`.

> **Drift check (run first)**: `git diff --stat 2b515c2..HEAD -- src/extension.ts src/webview.ts src/test`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Status**: DONE
- **Planned at**: commit `2b515c2`, 2026-11-20

## Why this matters

Repeated form submission can create the same manual entry more than once. The server also creates a fresh entry ID for every `createEntry` message, with no request-id deduplication.

## Current state

- `src/webview.ts:449-455` validates the add-entry form, stores a new `requestId`, and posts `createEntry`.
- `src/webview.ts:506-512` clears form fields only after `entryCreated`.
- `src/extension.ts:562-577` validates `createEntry`, creates a new ID, and appends it without checking whether the request ID was already handled.

```typescript
pendingFormEntries[requestId] = entry;
vscode.postMessage({ type: 'createEntry', entry, requestId });
```

```typescript
const created: StoredTimeEntry = {
	...entry, id: newEntryId(), task: entry.task.trim(),
};
await changeState(state => ({
	...state,
	entries: { ...state.entries, [entry.date]: [...(state.entries[entry.date] ?? []), created] },
}));
```

The existing webview convention uses `draft.pending` and `pendingFormEntries` to correlate responses. Match that pattern. Manual entry storage is a JSON file; see `changeState` in `src/extension.ts:260-278`.

## Commands you need

| Purpose | Command | Expected success |
|---------|---------|------------------|
| Typecheck | `npx tsc -p tsconfig.json --noEmit` | Exit 0, no errors |
| Lint | `npm run lint` | Exit 0, no errors or warnings |
| Test | `npm test` | Extension suite passes |

## Scope

**In scope**:
- `src/extension.ts`
- `src/webview.ts`
- `src/test/reportActions.test.ts`
- `src/test/extension.test.ts` only if needed to add a focused unit test

**Out of scope**:
- Entry validation rules
- Public timesheet storage format
- Report generation
- File-activity tracking

## Git workflow

- Branch: `advisor/001-prevent-duplicate-manual-entries`
- Commit only logical units; use existing Conventional Commit style from `git log`
- Do not push or open a PR

## Steps

### Step 1: Lock repeated form submits

In `src/webview.ts`, when `add-form` submits:

1. Track an in-flight add request by request ID in `pendingFormEntries`.
2. Disable the add form submit control while that request is pending.
3. Re-enable it on `entryCreated` or the matching `error` message.
4. Do not clear or alter fields until `entryCreated` proves the entry was created.

Use existing `pendingFormEntries[message.requestId]` handling in the response switch as the single place for cleanup.

**Verify**: `npx tsc -p tsconfig.json --noEmit` → exit 0.

### Step 2: Deduplicate create requests on the extension side

In `src/extension.ts`, maintain an in-memory map from validated `requestId` to the corresponding `StoredTimeEntry`.

For each `createEntry` message:

1. Validate the request ID and entry as existing code does.
2. If the request ID exists and the stored entry fields match the incoming entry, post `entryCreated` with the existing entry and return.
3. If the request ID exists but fields differ, return the existing invalid-request error.
4. Otherwise create and append one entry, store it in the map, and post `entryCreated`.

Clear the map only with extension deactivation or keep it limited to the activation lifetime. Do not add request IDs to persisted JSON.

**Verify**: `npx tsc -p tsconfig.json --noEmit` → exit 0.

### Step 3: Add a duplicate-submit regression test

In `src/test/reportActions.test.ts`, model after the existing webview command harness.

Send the same `createEntry` message twice with the same request ID, entry, and ID-free state. Assert the saved state contains one entry and both responses can identify the same entry ID.

Also send the same request ID with a changed entry and assert it is rejected or does not append an entry.

**Verify**: `npm test` → suite passes, including the new duplicate-submit test.

## Test plan

- Repeated same request ID: one entry only.
- Repeated same request ID after the first response: same entry ID.
- Same request ID with changed fields: no second or modified entry.
- Normal first submission: existing behavior and form clearing remain intact.

Use `src/test/reportActions.test.ts` as the structural pattern.

## Done criteria

- [ ] Two identical `createEntry` messages with one request ID append exactly one entry.
- [ ] Identical retries return the original entry ID.
- [ ] Conflicting retries do not append or modify entries.
- [ ] Add form submit control is disabled while creation is pending.
- [ ] `npx tsc -p tsconfig.json --noEmit` exits 0.
- [ ] `npm run lint` exits 0.
- [ ] `npm test` exits 0.
- [ ] `git diff --stat 2b515c2..HEAD -- src/extension.ts src/webview.ts src/test` contains only this plan's in-scope files.
- [ ] `plans/README.md` status row is updated.

## STOP conditions

- Live code differs from the excerpts in "Current state".
- The request ID or entry type is persisted elsewhere and must be part of migration work.
- The test harness cannot receive a second create message without source changes beyond `src/test/reportActions.test.ts`.
- Verification fails twice after reasonable fixes.

## Maintenance notes

Keep request-id deduplication at the extension message boundary. Do not rely only on disabling browser controls, because retries can still arrive through message delivery or a reopened webview.
