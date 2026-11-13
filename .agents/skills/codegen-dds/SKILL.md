---
name: codegen-dds
description: Generate IBM i DDS data-source artifacts (PF, LF) using repository-aligned templates. Use when the user asks to create or scaffold physical or logical file members.
version: 1.0.0
author: Roland Strauss
category: IBMi
tags:
  - ibmi
  - dds
  - db2
  - data
---

## Purpose

Generate IBM i `PF` and `LF` DDS source members quickly and consistently.

## Strategic modernization guidance (authoritative)

**Canonical Reference:** See `.github/instructions/modernizing-ibmi-applications.instructions.md`.

Use that file when the request is about whether DDS should be preserved,
wrapped, or incrementally modernized toward SQL-centric designs.

- This skill owns PF/LF DDS source generation, structure, and validation.
- The modernization instruction owns the larger data-modernization strategy,
  including when to favor SQL DDL, data-centric design, integration readiness,
  and iterative migration over abrupt replacement.
- Prefer compatibility-preserving DDS work when required, but treat new data
  design as a candidate for SQL-first modernization unless the user requests DDS
  explicitly.

## Ferraria standards authority and role semantics (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-ferraria-standards.instructions.md`.

Use that file as the cross-skill authority when DDS generation touches Legacy Solutions / Ferraria naming semantics or layered-responsibility questions.

- `FM` is the intended data-access boundary behind services.
- Preserve existing contractual names even when older suffixes no longer map cleanly to modern roles.
- Use `QT` as the canonical current MQT suffix; treat `LD` as legacy only.

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

- Apply "when/if applicable": DDS members are declarative and may not use all categories.
- For DDS, map sequence intent to record/field declaration ordering and keep dependencies ordered.
- If any example/template ordering in this file differs, the canonical instruction above wins.

## Opening metadata/comment block (DDS artifacts)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md` for DDS comment-format and opening-metadata guidance.

All DDS files (PF, LF) should start with metadata block, then synopsis, then revision history:

```dds
A* <Metadata>
A* Source Name .........: CUSTPF
A* Created By ...........: Your Name
A* Date Created .........: YYYY-MM-DD
A* Source Description ..: Customer master physical file.
A* Jira ..................: LSPS-XXXX (or N/A)
A* </Metadata>
A*
A* <Synopsis>
A* Customer master data storage with keyed access. Used by CUSTMAINT.
A* </Synopsis>
A*
A* <Revision History>
A* Revisioner | Date | Jira No (if known) | Change |
A* Your Name | YYYY-MM-DD | LSPS-XXXX | Initial scaffold |
A* </Revision History>
A
     R CUSTREC
```

**Comment-block rules:**
- Sections in order: Metadata → Synopsis → Revision History → record format
- Use opening `A*` comment lines in the repo's validator-compliant DDS layout; DDS does not use a separate free-form narrative header outside spec/comment lines
- Date format: ISO 8601 (`YYYY-MM-DD`)
- Jira: Full ticket number (e.g., `LSPS-4295`) or `N/A`
- When modifying existing code, add entry to Revision History; preserve all existing entries
- Place the opening comment block at the very beginning of the file, before first record format

**Metadata contents (universal across all skills):**
- Source Name (actual member name)
- Created By (developer name)
- Date Created (ISO 8601: `YYYY-MM-DD`)
- Source Description (single-line summary)
- Jira (ticket or `N/A`)

## Native indentation and spacing (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md`.

- Preserve existing DDS indentation, spacing, and fixed-column positioning when
  editing an existing member.
- Do not shift `A` specs, record lines, field lines, key lines, or keyword
  spacing unless the developer explicitly asks for formatting changes.
- For new members, use validator-compliant fixed-format DDS layout only.

## Scope boundary (strict)

- This skill owns **only** data-source DDS types:
  - `PF` (`.pf`)
  - `LF` (`.lf`)
- This skill does **not** own display or print DDS types.
  - For `DSPF` and `PRTF` (including 5250 screen layouts), use `codegen-dspf`.
- Do not define or enforce `DSPF` display contracts here (`ALIAS`, `DSPATR`,
  `<FIELD>A` attribute fields). Those rules are owned by `codegen-dspf`.

## Companion `DODDRULSH.loadSubfile` contract (reference only)

**Authoritative Reference:** See
`.github/instructions/ibmi-jsp-scaffold.instructions.md`, section
`Canonical Subfile List-Hydration Procedure (DODDRULSH.loadSubfile)`.

DDS members are declarative, so JSP does not apply directly to PF/LF source.
When a PF/LF feeds a `DODDRULSH`-style maintenance shell:

- expose a stable business key for the hidden subfile key field,
- keep list-retrieval columns explicit and deterministic,
- leave display-only shortening to the shell `loadSubfile` routine,
- keep row-level CRUD semantics out of the list-hydration path.

## DDS baseline: fixed 80-column model

- All non-comment DDS lines must place `A` in column 6 (5 leading spaces).
- Maximum line length is 80 columns.
- At least one record format line (`R` at column 17) is required.

## Type-specific rules

### PF

- Must **not** include `PFILE(...)`.
- Key lines (`K` at column 17) are optional; include only when keyed access is intended.

### LF

- Must include `PFILE(...)` at file level.
- Key lines are optional; include when keyed logical ordering is intended.

## Source Member Naming (IBM i Standard: 10-character Maximum)

**Authoritative Reference:** See `.github/instructions/ibmi-source-naming.instructions.md` for complete naming standards and rules.

### Naming enforcement (automatic)

- All `generate-dds-member.py` outputs enforce **maximum 10-character member names** via `normalize_name()` function
- Input names are automatically truncated to fit IBM i object-naming limits
- This is a **hard system limit**, not a preference

### Examples by artifact type

| Artifact | Example Input | Normalized Output | Notes |
|----------|---|---|---|
| Physical File (PF) | `"CustomerMaster"` | `CUSTOMERM` | First 10 chars |
| Logical File (LF) | `"customer_detail_lf"` | `CUSTOMER_D` | LF suffix handled separately; base name truncated |
| Record Format | Derived from PF | `CUSTOMERMR` | PF name + "R" suffix; total ≤10 chars |

### Rationale

IBM i object names are limited to 10 characters by the operating system. This applies to:
- DDS physical file objects
- DDS logical file objects
- Record format names (derived from file name + suffix)
- Physical source member names (before compilation)

## Hard rules (non-negotiable)

1. Every non-comment, non-empty DDS line starts with `A` at column 6.
2. No line exceeds 80 characters.
3. At least one record format (`R` at column 17) exists.
4. `PF` excludes `PFILE(...)`.
5. `LF` includes `PFILE(...)`.
6. Do not include secrets, credentials, API keys, or host-specific values.

## Workflow

1. Determine target type (`pf` or `lf`).
2. Generate from strict template:
   - `templates/PF.template.pf`
   - `templates/LF.template.lf`
3. Validate with script gate before returning source.

## Optional local generator

```bash
python .agents/skills/codegen-dds/scripts/generate-dds-member.py --type pf --name TPLCUSPF --out QDDSSRC/tplcuspf.pf
python .agents/skills/codegen-dds/scripts/generate-dds-member.py --type lf --name TPLCUSLF --pfile TPLCUSPF --out QDDSSRC/tplcuslf.lf
```

## Optional local validator

```bash
python .agents/skills/codegen-dds/scripts/validate-dds-source.py --type pf QDDSSRC/tplcuspf.pf
python .agents/skills/codegen-dds/scripts/validate-dds-source.py --type lf QDDSSRC/tplcuslf.lf
```

## Validation checklist

- [ ] Non-empty/non-comment lines begin with `A` at column 6
- [ ] At least one record format exists (`R` at column 17)
- [ ] No line exceeds 80 characters
- [ ] `PF` excludes `PFILE(...)`
- [ ] `LF` includes `PFILE(...)`

@AGENTS.md
