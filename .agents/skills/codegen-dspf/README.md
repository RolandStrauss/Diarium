---
description: "Quick runbook for the codegen-dspf skill"
applyTo: "**/*.md"
---

## codegen-dspf quick runbook

Use this skill to scaffold IBM i DDS **presentation** members:

- `DSPF` (`.dspf`)
- `PRTF` (`.prtf`)

For `PF` or `LF`, use `codegen-dds`.

For full behavior and constraints, see `SKILL.md`.

## Generate one member

```bash
python .agents/skills/codegen-dspf/scripts/generate-dspf-member.py --type dspf --name TPLDSP01 --out QDDSSRC/tpldsp01.dspf
python .agents/skills/codegen-dspf/scripts/generate-dspf-member.py --type prtf --name TPLPRT01 --out QDDSSRC/tplprt01.prtf
```

## Validate one member

```bash
python .agents/skills/codegen-dspf/scripts/validate-dspf-source.py --type dspf QDDSSRC/tpldsp01.dspf
python .agents/skills/codegen-dspf/scripts/validate-dspf-source.py --type prtf QDDSSRC/tplprt01.prtf
```

## Notes

- Member/object names are normalized to IBM i-compatible 10-character names.
- Use `--force` to overwrite existing outputs.
- Validator enforces baseline DDS structure and type-specific DSPF/PRTF checks.

@AGENTS.md
