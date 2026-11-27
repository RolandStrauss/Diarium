## Naming Rules

| Item | Rule | Example | Evidence |
|---|---|---|---|
| Files | Lower camel-case module names | `fileTimeTracker.ts` | `src/` |
| Classes | PascalCase | `FileTimeTracker`, `StorageInUseError` | `src/fileTimeTracker.ts`, `src/storageOwnership.ts` |
| Interfaces and types | PascalCase | `TrackerState`, `TimeEntry` | `src/extension.ts`, `src/timeData.ts` |
| Functions | camelCase | `validateEntry`, `createTimesheetTransfer` | `src/timeData.ts`, `src/extension.ts` |
| Constants | Upper snake-case | `STORAGE_KEY`, `MAX_TIMESHEET_IMPORT_BYTES` | `src/extension.ts` |
| Test suites | `suite` and `test` names describe behavior | `preserves valid partial entries` | `src/test/*.test.ts` |

## Formatting and Linting

- TypeScript strict mode is enabled by `tsconfig.json`.
- ESLint 10 uses `typescript-eslint`, with warning-level naming, curly-brace, equality, throw, and semicolon rules.
- Formatting is predominantly TypeScript-native tabs or repository-established source layout, with no dedicated formatter dependency.
- Run:

```bash
npm run compile
npm run lint
npm test
```

## Import and Module Conventions

- Relative modules use explicit `./` imports.
- Node built-ins use `node:` prefixes.
- Modules expose interfaces and focused functions directly; no barrel modules are present.
- Active modules are imported by `src/extension.ts`.
- Legacy modules are not imported and should not be used as active architecture.

## Error and Logging Conventions

- Validation functions return user-readable error strings or `undefined`.
- Persistence and storage failures are surfaced with actionable messages and recovery paths.
- Import and migration failures reject partial or invalid state instead of overwriting local data.
- Storage ownership failures identify the lock file and recovery action.
- `[TODO] No centralized logging or observability framework is present.`

## Testing Conventions

- Tests use Mocha `suite` and `test` declarations inside `src/test/*.test.ts`.
- Unit tests exercise pure modules and tracker behavior.
- Extension-host tests verify command registration and VS Code integration.
- Some tests replace VS Code or file-system dependencies with focused test doubles.
- Performance benchmarks are opt-in with `RUN_PERFORMANCE_BENCHMARK`.
- No coverage threshold is configured.

## Evidence

- `tsconfig.json`
- `eslint.config.mjs`
- `src/extension.ts`
- `src/fileTimeTracker.ts`
- `src/test/extension.test.ts`
- `src/test/fileTimeTracker.test.ts`

