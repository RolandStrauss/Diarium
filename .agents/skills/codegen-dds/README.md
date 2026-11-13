---
description: "Quick runbook for the codegen-dds skill"
applyTo: "**/*.md"
---

## codegen-dds quick runbook

Use this skill to scaffold IBM i DDS **data-source** members:

- `PF` (`.pf`)
- `LF` (`.lf`)

For `DSPF` or `PRTF`, use `codegen-dspf`.

For full behavior and constraints, see `SKILL.md`.

## Generate one member

```bash
python .agents/skills/codegen-dds/scripts/generate-dds-member.py --type pf --name TPLCUSPF --out QDDSSRC/tplcuspf.pf
python .agents/skills/codegen-dds/scripts/generate-dds-member.py --type lf --name TPLCUSLF --pfile TPLCUSPF --out QDDSSRC/tplcuslf.lf
```

## Validate one member

```bash
python .agents/skills/codegen-dds/scripts/validate-dds-source.py --type pf QDDSSRC/tplcuspf.pf
python .agents/skills/codegen-dds/scripts/validate-dds-source.py --type lf QDDSSRC/tplcuslf.lf
```

## Notes

- Member/object names are normalized to IBM i-compatible 10-character names.
- Use `--force` to overwrite existing outputs.
- Validator enforces baseline DDS structure and type-specific PF/LF checks.

@AGENTS.md
