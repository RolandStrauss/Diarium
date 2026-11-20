---
title: "Plan 005: Verify extension host and packaged VSIX"
status: "Planning"
---

> **Executor instructions**: Run the drift check first. Execute source checks before packaging.
> Record platform evidence; do not claim a platform passed without a real run.
> Update `plans/README.md` after verification passes.

> **Drift check (run first)**:
> `git diff --stat 09ab1c6 -- package.json .vscodeignore .vscode-test.mjs src src/test`

## Status

- **Priority**: P0
- **Effort**: M
- **Risk**: MED
- **Depends on**: plan 002
- **Category**: release
- **Status**: TODO
- **Planned at**: working tree after `09ab1c6`, 2026-11-20

## Why this matters

Automated tests cover extension logic, but the PRD also requires extension-host, supported-platform,
packaged-extension, path-identity, storage, and export checks. Package creation alone does not prove installed
runtime behavior.

## Current state

- `npm test` runs compiled tests in a VS Code test host.
- `.vscodeignore` excludes source, docs, tests, and repository-only guidance.
- `package:optimized` creates a VSIX but the package script allows a missing repository.
- Runtime bundle and PDFKit are included through the existing package configuration.
- No recorded Windows, macOS, and Linux installed-VSIX smoke evidence exists in the plan set.

## Commands you need

| Purpose | Command | Expected success |
|---------|---------|------------------|
| Install | `npm ci` | Exit 0, no manifest or lock drift |
| Full source checks | `npm test` | Exit 0 |
| Package | `npm run package:optimized` | One VSIX is produced |
| Inspect package | `npx vsce ls --tree` | Only intended runtime files are listed |

## Scope

**In scope**:

- `package.json`
- `.vscodeignore`
- `.vscode-test.mjs`
- `.github/workflows/` when release automation is required
- Focused extension-host smoke tests under `src/test/`
- A release evidence document created by plan 007

**Out of scope**:

- Publishing
- Marketplace account or publisher setup
- New CI platform matrix unless GitHub-hosted runners can cover it without new dependencies
- Product behavior not named by the PRD smoke checklist

## Steps

### Step 1: Verify the source baseline

Run `npm ci` and `npm test`.

Confirm the clean install does not alter `package-lock.json` and the compiled test host exercises the current
bundle.

**Verify**: Both commands exit 0, and the worktree has no install-generated manifest drift.

### Step 2: Inspect the package contents

Run `npm run package:optimized`, then run `npx vsce ls --tree`.

Confirm:

- `out/extension.js` is present.
- Required PDF runtime files are present.
- `src/`, tests, docs, repository guidance, maps, and repository-only caches are absent.
- No local data, reports, secrets, or generated time cards are packaged.
- Package metadata is internally consistent with the intended release owner.

**Verify**: Save the VSIX path and a concise package-content note for plan 007.

### Step 3: Smoke-test the installed VSIX

Install the generated VSIX into a clean VS Code profile, without reusing development extension state.

Exercise:

1. Startup and all seven commands.
2. Manual entry create, edit, delete, save, discard, filter, and restart persistence.
3. File switch, focus loss, pause/resume, exclusion, reset cancel, and reset confirm.
4. Floating timer show/hide and repeated open/close.
5. Timesheet PDF print-open and save, including cancellation and failure.
6. Time-card refresh, HTML export, PDF export, cancellation, and failure.
7. Corrupt-store or ownership-unavailable diagnostic without modifying stored data.
8. Extension deactivation and VS Code restart.

**Verify**: Record pass/fail, VS Code version, operating system, Node version, and package path.

### Step 4: Repeat on supported platforms

Run the installed-VSIX smoke on Windows, macOS, and Linux.

Use actual local paths for each platform. Confirm path display, exact exclusion identity, duplicate basenames,
storage persistence, save dialogs, and external PDF viewer behavior.

**Verify**: Each platform has explicit evidence or a blocking reason. Never infer parity from one platform.

### Step 5: Add CI only where deterministic

Keep source tests in the existing CI gate. Add package-content inspection only if it remains stable on the
GitHub runner and requires no new dependency.

Do not put external PDF viewer or operating-system interaction into CI unless a stable non-interactive probe is
available.

**Verify**: The CI workflow remains green without flaky display-dependent steps.

## Test plan

- Clean install and test baseline.
- Packaged VSIX inventory.
- Clean-profile installed extension.
- Seven commands and critical persistence transitions.
- Export cancellation, success, and failure.
- Windows, macOS, and Linux path and storage smoke.

## Done criteria

- [ ] `npm ci` and `npm test` pass without manifest drift.
- [ ] The VSIX is created and its contents are inspected.
- [ ] No repository-only or sensitive file is packaged.
- [ ] All seven commands pass in an installed VSIX.
- [ ] Windows, macOS, and Linux each have recorded results or explicit blockers.
- [ ] Critical storage, timing, panel, and export flows pass in the extension host.
- [ ] CI contains no unverified or flaky browser/viewer claim.
- [ ] Evidence is available for plan 007.
- [ ] `plans/README.md` status is updated.

## STOP conditions

- Required platform access is unavailable.
- Packaging exposes source, tests, local data, reports, or secrets.
- Installed behavior differs materially from the source-test host.
- Release ownership or metadata cannot be verified.

## Maintenance notes

Keep OS-specific manual steps in release evidence, not in product code. Add automation only when the host
interaction is deterministic and repeatable.
