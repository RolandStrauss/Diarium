## Runtime Summary

| Area | Value | Evidence |
|---|---|---|
| Primary language | TypeScript | `src/extension.ts`, `src/*.ts`, `src/test/*.ts` |
| Runtime | Visual Studio Code extension host; Node.js 18 target in esbuild | `package.json`, `tsconfig.json` |
| Package manager | npm | `package-lock.json`, `package.json` |
| Module system | Node16 TypeScript modules compiled to CommonJS | `tsconfig.json`, `package.json` |
| Extension engine | VS Code 1.140.0 or newer | `package.json` |

## Production Frameworks and Dependencies

| Dependency | Version | Role | Evidence |
|---|---|---|---|
| `vscode` | Engine type 1.140.0 | Commands, webviews, storage, dialogs, editor events | `package.json`, `src/extension.ts` |
| `pdfkit` | 0.20.2 | Generate local PDF timesheet and time-card reports | `package.json`, `src/pdfReport.ts`, `src/timeCard.ts` |

## Development Toolchain

| Tool | Purpose | Evidence |
|---|---|---|
| TypeScript 6.0.3 | Strict extension compilation | `package.json`, `tsconfig.json` |
| esbuild 0.28.2 | Bundle `src/extension.ts` for extension runtime | `package.json` |
| ESLint 10 with `typescript-eslint` | Static analysis for TypeScript | `package.json`, `eslint.config.mjs` |
| `@vscode/test-cli` and `@vscode/test-electron` | VS Code extension test runner | `package.json`, `src/test/*.test.ts` |
| Mocha types | Test suite API | `package.json`, `src/test/*.test.ts` |
| `@vscode/vsce` | Extension package inspection and VSIX creation | `package.json`, `.github/workflows/playwright.yml` |

## Key Commands

```bash
npm ci
npm run compile
npm run bundle
npm run lint
npm test
npm run package:optimized
```

`npm test` runs the compile, bundle, lint, and VS Code test sequence through `pretest`.

## Environment and Configuration

- Required environment variables: `[TODO] No repository environment template or runtime environment-variable contract is present.`
- Performance benchmark variable: `RUN_PERFORMANCE_BENCHMARK` enables the optional 1,000-record benchmark in `src/test/timeCard.test.ts`.
- VS Code launch configuration: `.vscode/launch.json`.
- VS Code watch task: `.vscode/tasks.json`.
- GitHub Actions check: `.github/workflows/playwright.yml`.
- Deployment constraint: extension package targets Node 18 through esbuild and VS Code 1.140.0 or newer.

## Evidence

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `eslint.config.mjs`
- `.github/workflows/playwright.yml`
- `src/extension.ts`

