---
title: "Plan 007: Align release evidence and documentation"
status: "Planning"
---

> **Executor instructions**: Run the drift check first. Use verified behavior only.
> Do not approve release ownership or publication on the user's behalf.
> Update `plans/README.md` after all evidence and documentation pass review.

> **Drift check (run first)**:
> `git diff --stat 09ab1c6 -- README.md CHANGELOG.md docs/prd.md package.json plans`

## Status

- **Priority**: P0
- **Effort**: S
- **Risk**: MED
- **Depends on**: plans 004, 005, 006, and 008
- **Category**: release
- **Status**: TODO
- **Planned at**: working tree after `09ab1c6`, 2026-11-20

## Why this matters

The PRD blocks release claims until behavior, accessibility, supported platforms, packaging, performance,
storage ownership, and release metadata have recorded evidence. Documentation currently describes behavior,
but it does not provide a single release evidence record or approval boundary.

## Current state

- `README.md` documents the timesheet, file activity, exports, exclusions, reset, and lock recovery.
- `docs/prd.md` defines the release checks and warns that the document alone is not release proof.
- `package.json` contains extension identity and target metadata, but release ownership still requires explicit
  confirmation.
- `package:optimized` intentionally allows a missing repository.
- Plans 004-006 and 008 will produce the missing acceptance and enhancement evidence.

## Commands you need

| Purpose | Command | Expected success |
|---------|---------|------------------|
| Source checks | `npm test` | Exit 0 |
| Package | `npm run package:optimized` | VSIX builds |
| Package inventory | `npx vsce ls --tree` | Expected files only |
| Worktree audit | `git status --short` | Only intended changes remain |

## Scope

**In scope**:

- `README.md`
- `CHANGELOG.md`, if release claims need an entry
- `docs/prd.md`, limited to verified baseline or evidence updates
- `package.json` release metadata only after ownership is confirmed
- One concise release evidence document under `docs/`
- `plans/README.md`

**Out of scope**:

- Publishing to a Marketplace
- Inventing publisher, support, or repository ownership
- Adding telemetry
- Rewriting the PRD as marketing copy
- Claims not supported by plans 004-006 and 008

## Steps

### Step 1: Collect release evidence

Create one concise evidence document under `docs/`.

For each PRD check, record:

- Source or test command
- Result and date
- Commit and dirty-tree note
- VS Code, Node, and operating-system versions
- Hardware where performance is measured
- Artifact path or CI run URL where applicable
- Pass, fail, blocked, or not-run status

Do not convert a plan, test existence, package creation, or prior probe into a pass claim.

**Verify**: Every Definition of Done item in `docs/prd.md` has linked evidence or an explicit blocker.

### Step 2: Reconcile documentation with verified behavior

Compare the evidence against:

- `README.md`
- `docs/prd.md`
- command identifiers in `package.json`
- release notes in `CHANGELOG.md`

Update only proven differences in storage scope, tracking focus, pause, exclusions, reset, exports, supported
characters, locking recovery, and command names.

**Verify**: No documented active feature contradicts the installed VSIX smoke result.

### Step 3: Audit release metadata

Confirm:

- version
- publisher identity
- repository and support links, if used
- license and package contents
- VS Code engine target
- runtime dependencies
- command identifiers

If ownership is unknown, mark publication blocked. Do not choose metadata by assumption.

**Verify**: Metadata is either confirmed by the product owner or recorded as a blocker.

### Step 4: Close the release boundary

Review the evidence with the product owner.

Record:

- accepted checks
- rejected or deferred checks
- known limitations
- release decision
- approval date

Keep unresolved legacy totals, unsupported PDF characters, abrupt-termination limits, and untested platforms
visible as limitations or blockers.

**Verify**: Release approval is explicit and traceable; this plan never infers approval.

## Test plan

- Full source checks pass.
- Packaged VSIX contents pass inventory.
- Documentation commands and identifiers match `package.json`.
- Accessibility, platform, package, and benchmark evidence links resolve.
- Release blockers and known limitations remain visible.

## Done criteria

- [ ] One release evidence document exists.
- [ ] Every PRD Definition of Done item has pass/fail/blocked evidence.
- [ ] README and PRD baseline statements match verified installed behavior.
- [ ] Export, storage, focus, reset, and lock-recovery limitations are documented.
- [ ] Package metadata has confirmed ownership or a recorded publication blocker.
- [ ] No unverified release claim appears in README, changelog, or PRD.
- [ ] `npm test` and `npm run package:optimized` pass.
- [ ] Product owner decision is recorded explicitly.
- [ ] `plans/README.md` status is updated.

## STOP conditions

- A required evidence link is missing.
- A documented behavior differs from the installed VSIX.
- Publisher, repository, support, or release ownership is unresolved.
- Product owner approval is absent.
- Required tests fail or are only theoretical.

## Maintenance notes

Treat evidence as a release snapshot, not a permanent claim. Add a new evidence row when release commit, package
contents, platform results, or product behavior changes.
