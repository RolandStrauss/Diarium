---
name: codegen-cblle
description: Generate IBM i COBOL artifacts (CBLLE, SQLCBLLE, CPY) using repository-aligned templates. Use when user asks to create or scaffold COBOL members.
version: 1.0.0
author: Roland Strauss
category: IBMi
tags:
   - ibmi
   - cobol
   - db2
   - automation
---

## Purpose

Generate COBOL source members quickly, consistently, and deterministically from strict templates for `QCBLLESRC` / copybook workflows.

## Strategic modernization guidance (authoritative)

**Canonical Reference:** See `.github/instructions/modernizing-ibmi-applications.instructions.md`.

Use that file when the request is about modernization direction, sequencing,
delivery outcomes, or how COBOL changes fit into a wider IBM i application
evolution plan.

- This skill owns COBOL artifact structure, templates, validation, and source
   generation mechanics.
- The modernization instruction owns problem-first strategy, iterative rollout,
   secure-by-design expectations, and cross-layer modernization priorities.
- Prefer incremental COBOL modernization that improves readability,
   maintainability, and integration readiness without breaking contractual
   behavior.

## Ferraria standards authority and role semantics (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-Ferraria-standards.instructions.md`.

Use that file as the cross-skill authority when COBOL generation touches Legacy Solutions / Ferraria architecture, handler naming, or layered-responsibility questions.

- `SH` owns presentation flow, not business logic.
- Narrow repo-proven exception: a `DODDRULSH`-style screen handler may perform
   list-only subfile hydration while row-level CRUD/helper work remains in `RH`
   and reusable `SP` / `FM` layers.
- `CH` means **Content Handler**, not Orbit's Completion Handler.
- `RH` is a routed request-program role; do not infer a blanket Ferraria-wide SQL ban from Orbit-specific guidance.
- `SP` / `FM` remain the reusable service and data-access boundaries.

## Variable declaration sequence (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-variable-declaration-sequence.instructions.md`.

When creating declarations (global or local), apply this order when applicable:

1. Metadata header
2. control options
3. Files
4. Copy member include of declaratives
5. Procedure Interface
6. Data Structures
7. Stand Alone Variables
8. Enumeration
9. Constants

Rules:

- Apply "when/if applicable": skip categories that do not exist for the artifact.
- For COBOL, map categories to nearest equivalents (for example COPY/includes, interface/parameter definitions, grouped structures, scalar work fields, named domains, constants).
- If any example/template ordering in this file differs, the canonical instruction above wins.

## Metadata header format (all COBOL artifacts)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md` for unified IBM i comment and metadata-block rules.

All COBOL files start with metadata block, then synopsis, then revision history (before `IDENTIFICATION DIVISION`):

```cobol
      *> <Metadata>
      *> Source Name .........: MYPGM
      *> Created By ...........: Your Name
      *> Date Created .........: YYYY-MM-DD
      *> Source Description ..: Single-line summary of purpose.
      *> Jira ..................: LSPS-XXXX (or N/A)
      *> </Metadata>
      *>
      *> <Synopsis>
      *> Brief description of runtime behavior and key integration points.
      *> </Synopsis>
      *>
      *> <Revision History>
      *> Revisioner | Date | Jira No (if known) | Change |
      *> Your Name | YYYY-MM-DD | LSPS-XXXX | Initial scaffold |
      *> </Revision History>

       IDENTIFICATION DIVISION.
       PROGRAM-ID. MYPGM.
```

**Header rules:**
- Sections in order: Metadata → Synopsis → Revision History → IDENTIFICATION DIVISION
- All sections use `*>` comment style (starting in column 7 with 6 leading spaces) with `<SectionName>` delimiters
- Date format: ISO 8601 (`YYYY-MM-DD`)
- Jira: Full ticket number (e.g., `LSPS-4295`) or `N/A`
- When modifying existing code, add entry to Revision History; preserve all existing entries
- Place metadata block before IDENTIFICATION DIVISION, immediately after any file-level comments

**Metadata contents (universal across all skills):**
- Source Name (actual member name)
- Created By (developer name)
- Date Created (ISO 8601: `YYYY-MM-DD`)
- Source Description (single-line summary)
- Jira (ticket or `N/A`)

## Native indentation and spacing (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md`.

- Preserve existing COBOL indentation and spacing when editing an existing
   member.
- Do not reindent or re-space Area A / Area B layout, PIC clauses, or aligned
   VALUE/USAGE blocks unless the developer explicitly asks for formatting changes.
- For new members, use the native template layout, including column-7 comment
   placement and stable COBOL area alignment.

## 5250 screen-generation routing (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-dspf-routing.instructions.md`.

- This skill does not generate `DSPF`/`PRTF` source.
- When a request includes IBM i 5250 screen files, display attributes,
  `ALIAS`, `DSPATR`, or screen-field layout concerns, delegate that part to
  `codegen-dspf`.
- Keep this skill focused on COBOL/SQLCOBOL program and copybook generation.

## Companion `DODDRULSH.loadSubfile` reference

**Authoritative Reference:** See
`.github/instructions/ibmi-jsp-scaffold.instructions.md`, section
`Canonical Subfile List-Hydration Procedure (DODDRULSH.loadSubfile)`.

- COBOL does not own the 5250 subfile refresh loop in this repo.
- If COBOL participates behind a maintenance shell, keep list hydration in the
   `SH` program and keep COBOL focused on service/data work, validation, and
   row-level processing.

## Jackson Structured Programming scaffold (required)

**Authoritative Reference:** See `.github/instructions/ibmi-jsp-scaffold.instructions.md` for the canonical JSP pattern, shared across all IBM i codegen skills.

**COBOL-Specific Application:**
- Apply JSP to **every SECTION and PARAGRAPH** within PROCEDURE DIVISION
- Organize sections/paragraphs to reflect the 4-stage lifecycle: INITIALIZE → INPUT → PROCESS → OUTPUT
- **Copybooks** (`.cpy` artifacts): JSP does not apply (declaration-only, no executable code)

**Quick Reference (COBOL):**

1. **Initialise** — dedicated section (e.g., `INITIALIZE-LEG`), call exactly once
2. **Input** — read parameters/records, validate single boundary check
3. **Process** — explicit branching (EVALUATE/IF), bounded iteration (PERFORM UNTIL)
4. **Output** — write results deterministically, then GOBACK/STOP RUN

**De-Duplication:** No duplicate initialization logic in input/process/output sections; no contradictory branch outcomes; preserve existing contracts.

## Core-principle alignment (Caveman, Lindy, Ponytail)

- **Caveman:** concise, deterministic scaffolds with explicit stage boundaries.
- **Lindy:** proven COBOL control-flow and validation-first behavior.
- **Ponytail:** smallest safe structure that fully covers initialise → input → process → output.

## Artifact types

- **`cblle`** — ILE COBOL source program (preferred for new members)
- **`sqlcblle`** — Embedded SQL COBOL program (use for database access)
- **`cpy`** — Copybook declarations only (no executable code)

## Source Member Naming (IBM i Standard: 10-character Maximum)

**Authoritative Reference:** See `.github/instructions/ibmi-source-naming.instructions.md` for complete naming standards and rules.

### Naming enforcement (automatic)

- All `generate-cblle-member.py` outputs enforce **maximum 10-character member names** via `normalize_name()` function
- Input names are automatically truncated to fit IBM i object-naming limits
- This is a **hard system limit**, not a preference

### Examples by artifact type

| Artifact | Example Input | Normalized Output | Notes |
|----------|---|---|---|
| CBLLE Program | `"AccountMaintenance"` | `ACCOUNTMAI` | First 10 chars |
| SQLCBLLE Program | `"CustomerAccountSQL"` | `CUSTOMERAC` | Truncated; SQL-embedded COBOL |
| Copybook (CPY) | `"SharedConstants"` | `SHAREDCONS` | Typically shorter for copybooks |

### Rationale

IBM i object names are limited to 10 characters by the operating system. This applies to:
- Compiled COBOL program objects (CBLLE/SQLCBLLE)
- COBOL module objects in service programs
- Physical source member names (before compilation)

## Modules and service programs (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-service-programs.instructions.md` for complete service program architecture, module patterns, binder strategy, and backward compatibility rules.

Use that file when the request involves creating reusable service programs, module bindings, or shared COBOL APIs.

- This skill generates individual CBLLE/SQLCBLLE modules and programs.
- The service-programs instruction owns module organization, binder architecture, export strategies, and cross-program contracts.
- For module-based requests, generate individual modules; coordinate with build automation and binder configuration as documented in the instruction.

## Hard rules (non-negotiable)

**All programs** (`cblle`, `sqlcblle`):
1. Must include `IDENTIFICATION DIVISION`, `PROGRAM-ID`, `PROCEDURE DIVISION`.
2. Must include `WORKING-STORAGE SECTION`.
3. Must have at least one executable statement (`DISPLAY`, `MOVE`, `PERFORM`, `CALL`, `EXEC SQL`, `GOBACK`, `STOP RUN`, etc.).
4. COBOL line comments must start in column 7 (exactly 6 leading spaces before `*>`).
5. Must NOT include hardcoded credentials, passwords, or destructive defaults.

**SQL programs** (`sqlcblle` only):
- Must include `EXEC SQL INCLUDE SQLCA END-EXEC`.
- Must explicitly handle SQL status: success (`SQLSTATE = '00000'`), no data (`'02000'`), error (other).
- If DDL includes `CREATE TABLE` or `CREATE OR REPLACE TABLE`, see `.github/instructions/ibmi-audit-columns.instructions.md` for canonical audit column list. Include only **missing** audit columns.

**Copybooks** (`cpy`):
- Must contain declarations only (no `PROCEDURE DIVISION`, no executable code).

## Audit columns (for DDL only)

**Authoritative Reference:** See `.github/instructions/ibmi-audit-columns.instructions.md` for the canonical 9-column audit list with exact SQL syntax, placement rules, and examples.

When generating SQL `CREATE TABLE` / `CREATE OR REPLACE TABLE`, include only **missing** audit columns from the canonical reference. Never duplicate existing columns.

## Generation workflow

1. **Ask for clarity** if user request is ambiguous. Confirm artifact type: `cblle`, `sqlcblle`, or `cpy`.
2. **Pick template** from `templates/` folder matching the type.
3. **Substitute placeholders**: `PROGRAM_NAME`, `TABLE_NAME`, `COPYBOOK_NAME` using user input.
4. **Validate** using `scripts/validate-*.py` before returning. If validation fails, regenerate.
5. **Output rules**:
   - One member per request (unless user asks for multiple).
   - File names: lower-case with lower-case extensions (e.g., `tplpgm.cblle`).
   - Use canonical pattern `filename.type`; do NOT insert `.pgm.` into name.
   - Output is compile-ready scaffold, not production code.

## Templates (stored in `templates/`)

Generator substitutes `PROGRAM_NAME` → member name, `TABLE_NAME` → table name, `COPYBOOK_NAME` → copybook name.

**CBLLE.template.cblle** — Basic executable program with DISPLAY.
**SQLCBLLE.template.sqlcblle** — SQL program with SQLCA, SELECT, and status handling.
**CPY.template.cpy** — Declaration-only copybook with sample 01-level groups.

See `templates/` directory for exact content. Validator ensures generated output meets all non-negotiable rules.

## Local tools (optional)

**Generator:**
```bash
python .agents/skills/codegen-cblle/scripts/generate-cblle-member.py --type cblle --name TPLCBL01 --out QCBLLESRC/tplcbl01.cblle
python .agents/skills/codegen-cblle/scripts/generate-cblle-member.py --type sqlcblle --name TPLSQLC1 --table DDGMTRRUL --out QCBLLESRC/tplsqlc01.sqlcblle
python .agents/skills/codegen-cblle/scripts/generate-cblle-member.py --type cpy --name TPLCTX --out QCBLLEREF/tplctx.cpy
```

**Validator:**
```bash
python .agents/skills/codegen-cblle/scripts/validate-cblle-source.py --type cblle QCBLLESRC/tplcbl01.cblle
python .agents/skills/codegen-cblle/scripts/validate-cblle-source.py --type sqlcblle QCBLLESRC/tplsqlc01.sqlcblle
python .agents/skills/codegen-cblle/scripts/validate-cblle-source.py --type cpy QCBLLEREF/tplctx.cpy
```

## Quality gate (must pass before delivery)

- [ ] IDENTIFICATION DIVISION, PROGRAM-ID, PROCEDURE DIVISION present (programs only)
- [ ] WORKING-STORAGE SECTION present (programs only)
- [ ] At least one executable statement (programs only)
- [ ] SQLCA and SQL status handling (SQLCBLLE only)
- [ ] No executable code in copybooks (CPY only)
- [ ] COBOL comments in column 7 (six leading spaces before `*>`)
- [ ] No hardcoded passwords, tokens, API keys, or destructive defaults
- [ ] File header (Metadata, Synopsis, Revision History) intact and properly formatted

@AGENTS.md
