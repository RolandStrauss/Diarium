# Test Stack and Commands

- Primary framework: Mocha through `@vscode/test-cli`.
- Extension environment: `@vscode/test-electron`.
- Assertion library: Node.js `assert`.
- Mocking: focused test doubles for VS Code APIs and file-system operations.
- Main commands:

```bash
npm run compile
npm run lint
npm test
npm run package:optimized
npx vsce ls --tree
```

GitHub Actions runs `xvfb-run -a npm test` on Ubuntu before package inspection.

## Test Layout

- Test files live in `src/test/`.
- Tests use names matching implementation areas:
  - `extension.test.ts`
  - `fileTimeTracker.test.ts`
  - `pdfReport.test.ts`
  - `reportActions.test.ts`
  - `storageOwnership.test.ts`
  - `storageRecovery.test.ts`
  - `timeCard.test.ts`
  - `timeData.test.ts`
  - `timesheetTransfer.test.ts`
- There is no separate integration-test directory.

## Test Scope Matrix

| Scope | Covered? | Typical target | Notes |
| --- | --- | --- | --- |
| Unit | Yes | Time data, file tracker, PDF, transfer parsing | Pure or narrowly isolated behavior |
| Extension integration | Yes | Command registration and VS Code webviews | Runs in the VS Code test host |
| File-system integration | Yes | Save/import/reset/ownership behavior | Uses temporary directories and real Node.js file operations |
| End-to-end browser UI | `[TODO]` | Webview interaction | Playwright configuration exists but its exact role needs validation |
| Coverage | No threshold | `[TODO]` | No coverage report or threshold is configured |

## Mocking and Isolation

- Tests isolate file totals and timing with injected callbacks and clocks.
- Storage recovery tests use temporary directories and extension-like context doubles.
- Report-action tests replace selected VS Code dialog APIs.
- Temporary files and directories are removed after tests.
- `[TODO] Confirm whether Playwright is a separate future flow or currently used by extension tests.`

## Coverage and Quality Signals

- No coverage threshold or coverage report is configured.
- CI requires successful compile, lint, bundle, extension tests, packaging, and package listing.
- Performance evidence documents an opt-in 1,000-record benchmark in `docs/performance-evidence.md`.
- The benchmark is separate from manual visible-panel timing.

## Evidence

- `package.json`
- `.github/workflows/playwright.yml`
- `src/test/`
- `docs/performance-evidence.md`
