---
description: "Quick runbook for the codegen-clle skill"
applyTo: "**/*.md"
---

## codegen-clle quick runbook

Use this skill to scaffold IBM i CL members (CLLE-first):

- `CLLE` (`.clle`)
- `CLP` (`.clp`, compatibility only)
- generic `CL` (`.cl`, compatibility only)

For full behavior and constraints, see `SKILL.md`.

## Compile guidance

Prefer ILE two-step build for CLLE:

1. compile module with `CRTCLMOD`
1. bind program with `CRTPGM`

Use `CRTBNDCL` only when explicitly requested as a single-step shortcut.
Use `CRTCLPGM` only for explicit OPM compatibility requests.

## Generate one member

```bash
python .agents/skills/codegen-clle/scripts/generate-cl-member.py --type clle --name TPLRUN01 --out QCLLESRC/tplrun01.clle
python .agents/skills/codegen-clle/scripts/generate-cl-member.py --type clp --name TPLRUN01 --out QCLLESRC/tplrun01.clp
python .agents/skills/codegen-clle/scripts/generate-cl-member.py --type cl --name TPLRUN01 --out QCLLESRC/tplrun01.cl
```

## Validate one member

```bash
python .agents/skills/codegen-clle/scripts/validate-cl-source.py --type clle QCLLESRC/tplrun01.clle
python .agents/skills/codegen-clle/scripts/validate-cl-source.py --type clp QCLLESRC/tplrun01.clp
python .agents/skills/codegen-clle/scripts/validate-cl-source.py --type cl QCLLESRC/tplrun01.cl
```

## Task shortcuts

Use VS Code tasks for repeatable checks:

- `codegen-clle-e2e-proof`
- `codegen-clle-e2e-proof-rerun`
- `codegen-clle-regenerate-clle-sample`
- `codegen-clle-validate-tplrun`

## Expected generated samples

After running `codegen-clle-e2e-proof`, sample outputs are in:

- `.agents/skills/codegen-clle/samples/tplcl01.clle`
- `.agents/skills/codegen-clle/samples/tplcl02.clp`
- `.agents/skills/codegen-clle/samples/tplcl03.cl`

## Notes

- Program names are normalized to IBM i-compatible 10-character names.
- Use `--force` to overwrite an existing output file.
- Validator enforces structure (`PGM`, `ENDPGM`, executable commands) and modern CLLE checks (no `GOTO`, BIF usage, and CRASH-style fallback pattern).

@AGENTS.md
