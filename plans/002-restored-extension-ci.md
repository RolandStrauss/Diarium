# Plan 002: Restore the extension CI verification gate

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md`.

> **Drift check (run first)**: `git diff --stat 2b515c2..HEAD -- .github/workflows package.json`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `2b515c2`, 2026-11-20

## Why this matters

The repository has a VS Code extension test suite and lint/type/build scripts, but CI invokes a Playwright workflow without Playwright dependencies or Playwright tests. Push and pull-request validation currently does not execute the real test suite.

## Current state

- `package.json:48-72` provides `compile`, `bundle`, `lint`, `test`, and `pretest`.
- `package.json:52-72` does not contain `@playwright/test` or a Playwright script.
- `.github/workflows/playwright.yml:13-21` installs dependencies, then installs Playwright and runs `npx playwright test`.
- The repository contains no Playwright test files. Existing tests are Mocha suites under `src/test/*.test.ts`.

## Commands you need

| Purpose | Command | Expected success |
|---------|---------|------------------|
| Install | `npm ci` | Exit 0 |
| Lint/type/bundle/test | `npm test` | Pretest compiles, bundles, and lints; VS Code tests pass |
| Headless CI test | `xvfb-run -a npm test` | Exit 0 on Ubuntu |

## Scope

**In scope**:
- `.github/workflows/playwright.yml`

**Out of scope**:
- Playwright configuration or browser testing
- Test implementation beyond existing failures exposed by CI
- Package dependencies

## Git workflow

- Branch: `advisor/002-restored-extension-ci`
- Commit only logical units; use existing Conventional Commit style
- Do not push or open a PR

## Steps

### Step 1: Replace stale Playwright workflow

Rename or repurpose `.github/workflows/playwright.yml` as the repository's extension test workflow.

Keep:

- `actions/checkout@v4`
- `actions/setup-node@v4` with `node-version: lts/*`
- push and pull-request triggers for `main` and `master`

Replace Playwright steps with:

```yaml
- name: Install dependencies
  run: npm ci
- name: Run extension checks
  run: xvfb-run -a npm test
```

Set an appropriate timeout, for example 60 minutes. Do not add Playwright browser installation or upload a nonexistent `playwright-report` artifact.

**Verify**: Inspect `.github/workflows/*.yml` and assert no `playwright` command or report path remains.

### Step 2: Run the CI command locally

On Windows, first run `npm test`. On Linux CI shape, validate `xvfb-run -a npm test` when available. Do not add an npm script unless the CI command fails for a repository-specific reason.

**Verify**:
- `npm test` exit 0
- lint produces no warnings or errors
- compile and bundle succeed
- extension tests pass

### Step 3: Confirm workflow shape

Check the workflow through GitHub Actions or YAML tooling only after changes are committed to a branch. Do not claim CI success until a workflow run completes.

**Verify**: workflow run shows install and `xvfb-run -a npm test` completed successfully.

## Test plan

- Push branch: workflow starts.
- Pull request branch: workflow starts.
- `npm ci`: lockfile dependencies install without manifest drift.
- `npm test`: pretest and VS Code suite pass.

## Done criteria

- [ ] Workflow contains no Playwright install/run/upload steps.
- [ ] Workflow runs `npm ci`.
- [ ] Workflow runs `xvfb-run -a npm test`.
- [ ] `npm test` exits 0 on the executor's supported environment.
- [ ] Workflow run is green on a test branch or a GitHub Actions run URL is recorded in a follow-up.
- [ ] No files outside `.github/workflows/playwright.yml` are modified by this plan.
- [ ] `plans/README.md` status row is updated.

## STOP conditions

- GitHub-hosted Ubuntu cannot run VS Code Electron without a dependency not present in the repository.
- `npm ci` changes the lockfile.
- `npm test` fails outside the current lint/test baseline.
- The workflow has additional repository-specific triggers that were not visible in recon.

## Maintenance notes

Keep CI tied to `npm test`, because `pretest` already runs compile, bundle, and lint. Do not add Playwright unless browser tests are also added and installed as dependencies.
