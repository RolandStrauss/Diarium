---
name: codegen-dspf
description: Generate IBM i DDS presentation artifacts (DSPF, PRTF) using repository-aligned templates. Use when the user asks to create or scaffold display or printer file members.
version: 1.0.0
author: Roland Strauss
category: IBMi
tags:
  - ibmi
  - dds
  - 5250
  - presentation
---

## Purpose

Generate IBM i `DSPF` and `PRTF` DDS source members quickly and consistently.

## Strategic modernization guidance (authoritative)

**Canonical Reference:** See `.github/instructions/modernizing-ibmi-applications.instructions.md`.

Use that file when the request is about interface modernization goals,
workflow redesign, or how DSPF work fits into a broader IBM i modernization
journey.

- This skill owns DSPF/PRTF source structure, DDS presentation rules, aliases,
  and validator-ready output.
- The modernization instruction owns the higher-level goal: improve user
  workflow, accessibility, maintainability, and integration outcomes rather
  than chasing cosmetic screen changes alone.
- Prefer interface improvements that reduce user friction and preserve valuable
  business behavior, instead of superficial restyling with unchanged workflow
  pain.

## Ferraria standards authority and role semantics (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-ferraria-standards.instructions.md`.

Use that file as the cross-skill authority when presentation generation touches Legacy Solutions / Ferraria role separation or naming ambiguity.

- `SH` owns presentation and navigation concerns.
- Keep business logic and direct data access out of DSPF/PRTF guidance.
- Preserve local suffixes/contracts where printer naming remains unresolved (`RF` vs `SO`).

## Variable declaration sequence (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-variable-declaration-sequence.instructions.md`.

When creating declarations, apply this order when applicable:

1. Files
2. Copy member include of declaratives
3. Procedure Interface
4. Data Structures
5. Stand Alone Variables
6. Enumeration
7. Constants

Rules:

- Apply "when/if applicable": DSPF/PRTF members are declarative and may not use all categories.
- Preserve DSPF ownership rules in this skill; this sequence governs declaration ordering only.
- If any example/template ordering in this file differs, the canonical instruction above wins.

## Opening metadata/comment block (DDS presentation artifacts)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md` for DDS comment-format and opening-metadata guidance.

All DDS presentation files (DSPF, PRTF) should start with metadata block, then synopsis, then revision history:

```dds
A* <Metadata>
A* Source Name .........: CUSTDSPF
A* Created By ...........: Your Name
A* Date Created .........: YYYY-MM-DD
A* Source Description ..: Customer maintenance 5250 display file.
A* Jira ..................: LSPS-XXXX (or N/A)
A* </Metadata>
A*
A* <Synopsis>
A* 5250 display for customer add/update/delete operations.
A* Primary format: CUSTFMT with subfile SFL + option field.
A* </Synopsis>
A*
A* <Revision History>
A* Revisioner | Date | Jira No (if known) | Change |
A* Your Name | YYYY-MM-DD | LSPS-XXXX | Initial scaffold |
A* </Revision History>
A
     A                                      DSPSIZ(24 80)
```

**Comment-block rules:**
- Sections in order: Metadata → Synopsis → Revision History → file-level keywords
- Use opening `A*` comment lines in the repo's validator-compliant DDS layout; DDS does not use a separate free-form narrative header outside spec/comment lines
- Date format: ISO 8601 (`YYYY-MM-DD`)
- Jira: Full ticket number (e.g., `LSPS-4295`) or `N/A`
- When modifying existing code, add entry to Revision History; preserve all existing entries
- Place the opening comment block at the very beginning of the file, before file-level keywords

**Metadata contents (universal across all skills):**
- Source Name (actual member name)
- Created By (developer name)
- Date Created (ISO 8601: `YYYY-MM-DD`)
- Source Description (single-line summary)
- Jira (ticket or `N/A`)

## Scope boundary (strict)

- This skill owns **only** presentation DDS types:
  - `DSPF` (`.dspf`)
  - `PRTF` (`.prtf`)
- This skill does **not** own data-source DDS types.
  - For `PF` and `LF`, use `codegen-dds`.

## Canonical 5250 ownership contract (authoritative)

- This skill is the single owner for IBM i 5250 screen-file source generation:
  - `DSPF` screen layouts
  - `PRTF` presentation layouts
- Other IBM i coding skills must not redefine DSPF/PRTF layout rules.
- Other IBM i coding skills must delegate DSPF/PRTF generation to this skill,
  then consume the generated field model.

De-duplication rule:

- `ALIAS(...)`, `DSPATR(...)`, display-attribute fields (`<FIELD>A`), and
  displayable-field naming/length constraints are defined here only.
- When guidance elsewhere differs, this skill wins for 5250/DSPF behavior.

## Canonical DDS rules (single source)

These rules apply to generated output unless user explicitly requests otherwise.

1. Use DDS fixed format (80-column model).
2. Non-comment specification lines must place `A` in column 6 (5 leading spaces).
3. Keep every line at 80 columns or less.
4. Include at least one record format line (`R` at column 17).
5. Never include secrets, credentials, API keys, or host-specific values.

## Field alias policy (required)

Program-addressable fields must include `ALIAS(...)`.

Definition used by this skill:
- A program-addressable field is a named field specification line with a field
  name in columns 19-28 and a field length/type definition (for example
  `10A`, `7Y 0`, `1A`, etc.).

ALIAS requirements:
- `ALIAS(...)` must be present for every program-addressable field.
- Alias text must use underscore separators instead of spaces.
- Alias text length must be 1..25 characters.
- Alias text should be descriptive (for example `SCHEMA_NAME`,
  `COLLECTION_STATUS`).

## DSPF display-attribute contract (required)

For DSPF members, displayable fields must follow this contract.

Definition used by this skill:
- A displayable field is a named field spec inside a record format that has
  screen position coordinates and is not hidden/program-only (`H`/`P`).

Rules:
- Displayable field names must be 1..9 characters.
- Each displayable field must include `DSPATR(&<FIELDNAME>A)`.
- The same record must declare `<FIELDNAME>A` as a 1A `P` field.
- The `<FIELDNAME>A` field is used by screen-handling logic to control
  display characteristics (color, input/output mode, and related attributes).

Examples from `sample.dspf` style:
- `A            SF_LIBNAM     10A  O  8  6ALIAS(SCHEMA_NAME)`
- `A            SD_LIBNAM     10A  B  4 28ALIAS(SCHEMA_NAME)`

Comment note:
- `A*` comment lines are valid DDS comments.
- Existing/legacy samples may also include `*`-style comment lines; preserve them when editing existing members.

## Type-specific rules

### DSPF

- Must include `DSPSIZ(...)` at file level.
- File-level keywords must appear before the first record format.
- Do not emit field/constant-level content before the first `R` line.
- `PRINT` on DSPF is optional. It appears in some legacy members (for example `sample.dspf`) and is acceptable.
- Apply the display-attribute contract for all displayable fields.

### PRTF

- Must include `PRINT` keyword.
- Use output-capable fields (`O` usage) by default; only introduce interactive behavior when explicitly requested.

## Validation gate

Before returning generated source, validate with:
- `scripts/validate-dspf-source.py --type dspf ...` for DSPF
- `scripts/validate-dspf-source.py --type prtf ...` for PRTF

The validator is the authoritative structural gate for this skill.

## Source Member Naming (IBM i Standard: 10-character Maximum)

**Authoritative Reference:** See `.github/instructions/ibmi-source-naming.instructions.md` for complete naming standards and rules.

### Naming enforcement (automatic)

- All `generate-dspf-member.py` outputs enforce **maximum 10-character member names** via `normalize_name()` function
- Input names are automatically truncated to fit IBM i object-naming limits
- This is a **hard system limit**, not a preference

### Examples by artifact type

| Artifact | Example Input | Normalized Output | Notes |
|----------|---|---|---|
| Display File (DSPF) | `"CustomerMaintenance"` | `CUSTOMERM` | First 10 chars; no "DSPF" suffix added |
| Printer File (PRTF) | `"BatchReportPrinter"` | `BATCHREPOR` | Truncated; no "PRTF" suffix added |
| Record Format | Derived from file | `CUSTOMERMR` | File name + "R" suffix; total ≤10 chars |

### Rationale

IBM i object names are limited to 10 characters by the operating system. This applies to:
- DDS display file (DSPF) objects
- DDS printer file (PRTF) objects
- Record format names (derived from file name + suffix)
- Physical source member names (before compilation)

## Workflow

1. Determine target type (`dspf` or `prtf`).
2. Generate from strict template:
   - `templates/DSPF.template.dspf`
   - `templates/PRTF.template.prtf`
3. Validate with script gate before returning source.

## Optional local generator

```bash
python .agents/skills/codegen-dspf/scripts/generate-dspf-member.py --type dspf --name TPLDSP01 --out QDDSSRC/tpldsp01.dspf
python .agents/skills/codegen-dspf/scripts/generate-dspf-member.py --type prtf --name TPLPRT01 --out QDDSSRC/tplprt01.prtf
```

## Optional local validator

```bash
python .agents/skills/codegen-dspf/scripts/validate-dspf-source.py --type dspf QDDSSRC/tpldsp01.dspf
python .agents/skills/codegen-dspf/scripts/validate-dspf-source.py --type prtf QDDSSRC/tplprt01.prtf
```

## Quick acceptance checklist

- [ ] Correct type selected (`dspf` or `prtf`)
- [ ] Output generated from matching template
- [ ] Validator passes with zero errors
- [ ] All program-addressable fields have underscore-style `ALIAS(...)` values (`NO SPACES`) of 25 chars or fewer
- [ ] All DSPF displayable fields are 9 chars or fewer and use `DSPATR(&<FIELDNAME>A)` with matching `1A P` attribute fields in the same record
- [ ] Output contains no environment-specific secrets or host values

@AGENTS.md
