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

## Native indentation and spacing (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md`.

- Preserve existing DSPF/PRTF indentation, spacing, and fixed-column layout
  when editing an existing member.
- Do not re-space coordinates, keywords, `ALIAS(...)`, `DSPATR(...)`, or paired
  attribute-field lines unless the developer explicitly asks for formatting changes.
- For new presentation DDS, use validator-compliant fixed-format layout only.

## Scope boundary (strict)

- This skill owns **only** presentation DDS types:
  - `DSPF` (`.dspf`)
  - `PRTF` (`.prtf`)
- This skill does **not** own data-source DDS types.
  - For `PF` and `LF`, use `codegen-dds`.

## DSPF Anatomy & Standard Scaffold (authoritative)

**Reference Implementation:** `qddssrc/doddruldf.dspf` (production proven 2026-08-28).

### High-Level Anatomy

A production DSPF scaffold follows this proven structure:

```
1. Header Comments (Metadata, Synopsis, Revision History)
2. File-Level Keywords (DSPSIZ, PRINT, INDARA, CSRINPONLY, function keys)
3. Shared Navigation Records (Screen Header overlay, separators)
4. Primary List Screen (Subfile detail + control + function keys)
5. Primary Detail Screen (Entry form + function keys overlay)
6. Message Subfile & Control (for job/user messages)
7. End Marker (DUMMY record)
```

### Record Pattern Detail

#### 1. Screen Header (SH_HDR)
- **Purpose:** Display system name, user, date, time, screen title on every page
- **Keywords:** `OVERLAY`, `TEXT('Screen Header')`
- **Fields:**
  - `SYSNAME` (literal, position row 1 col 2)
  - `SH_SCR` (12A O, displayable screen title) + `SH_SCRA` (1A P, attribute control)
  - `SH_APPNAM` (30A O, app name) + `SH_APPNAMA` (1A P, attribute control)
  - `DATE` (literal, position row 1 col 124, EDTCDE(Y))
  - `USER` (literal, position row 2 col 2)
  - `SH_PNLNAM` (100A O, panel/screen description) + `SH_PNLNAMA` (1A P, attribute control)
  - `TIME` (literal, position row 2 col 124)
- **Pattern:** One header instance shared across all screens via OVERLAY

#### 2. Subfile Detail Record (SFLXXX where XXX is business entity)
- **Purpose:** One repeating row in a scrollable list
- **Keywords:** `SFL`
- **Fields:**
  - Option field (1Y 0 B, EDTCDE(4)) at row 7 col 2 (user selects option 1-9)
  - Data fields (display-only or input)
  - Hidden fields (1A H or other, for program use)
  - All data fields must have ALIAS and (if displayable) DSPATR
- **Example:** SFLRUL with SFOPT, SFUID, SFMTRNAM, SFBUSUNI, etc.

#### 3. Subfile Control Record (SFLCTL)
- **Purpose:** Manage subfile navigation, pagination, cursor tracking
- **Keywords:** `SFLCTL(SFLXXX)`, `OVERLAY`, `SFLSIZ(200)`, `SFLPAG(015)`, `RTNCSRLOC`, `SFLCSRRRN`
- **Fields:**
  - Option text header (`SC_OPTTXT` 120A O at row 4 col 2)
  - Column headers (literals with DSPATR(HI) at row 6)
  - Hidden fields: `SCRRN` (5S 0 H, cursor row), `RCD` (10A H, record name), `FLD` (10A H, field name), `POS` (4S 0 H, position)
  - Indicators: 31 = SFLDSP (display subfile), 32 = SFLDSPCTL & SFLCLR & SFLEND
- **Pattern:** One control per subfile; manages 200-row subfile at 15 rows per page

#### 4. Function Key Strip (SFT_FKEY for list; SD_FKEY for detail)
- **Purpose:** Provide push-button controls for screen navigation
- **Keywords:** `OVERLAY`, `PSHBTNFLD`, `CHCAVAIL((*COLOR BLU))`
- **Fields:**
  - Button field (2Y 0 B 25 2) with push-button choices (Enter, F3=Exit, F5=Refresh, F6=Add, etc.)
  - Each button maps to a function-key indicator (CA03, CA05, CA06, etc.)
- **Pattern:** One strip overlays at row 25 for list; another for detail

#### 5. Extended Detail Screen (EXTRULEDTL or similar)
- **Purpose:** Add/edit form for business entity details
- **Keywords:** `OVERLAY`, `RTNCSRLOC(&DRCD &DFLD &DPOS)` (cursor tracking)
- **Fields:**
  - Title (literal with DSPATR(HI) at row 1)
  - Input fields with labels (ALIAS, DSPATR required for displayable)
  - Hidden fields (1A H) for action code, status, etc.
  - Instructions (literals with COLOR(BLU) for guidance)
  - All input fields B (both) usage; CHECK() for validation
- **Pattern:** Form layout; row/col positioned for clarity

#### 6. Message Subfile (MSGSFL)
- **Purpose:** Display job/user messages from the system
- **Keywords:** `SFL SFLMSGRCD(27)`
- **Fields:**
  - `MSGKEY` (SFLMSGKEY)
  - `PGMNAME` (SFLPGMQ)
- **Pattern:** Standard IBM i messaging; 27 is typical message row

#### 7. Message Control (MSGCTL)
- **Purpose:** Manage message subfile display and pagination
- **Keywords:** `SFLCTL(MSGSFL)`, `SFLDSP`, `SFLDSPCTL`, `SFLINZ`, `N99` indicator logic
- **Fields:**
  - `PGMNAME` (SFLPGMQ)
  - `SFLPAG(1)`, `SFLSIZ(10)` (1 message per page, 10 total capacity)
- **Pattern:** Standard message control using indicator 99

#### 8. Dummy Record (DUMMY)
- **Purpose:** Marks end of file; ensures validator/compiler consistency
- **Keywords:** None
- **Fields:**
  - One literal (1 char at row 1 col 2, typically blank)
- **Pattern:** Always present; required by validator

### File-Level Keywords (Summary)

```dds
A                                      DSPSIZ(27 132 *DS4)
A                                      PRINT
A                                      INDARA
A                                      CSRINPONLY
A                                      CA03
A                                      CF04
A                                      CA05
A                                      CA06
A                                      CA07
A                                      CA12
A                                      CA21
```

- **DSPSIZ(27 132 *DS4):** 27 rows, 132 columns, enhanced display capability
- **PRINT:** Optional; allows printing via print key (PrtScn or similar)
- **INDARA:** Indicators in the Indicator Area (not in data record)
- **CSRINPONLY:** Cursor-sensitive input only (read-only unless field is input-capable)
- **CA03, etc.:** Command Attention keys mapped to indicators (03=Exit, 04=Prompt, 05=Refresh, 06=Add, 07=Confirm, 12=Cancel, 21=Help)

### Naming Conventions (Cross-Skill Authority)

- **Screen Header:** `SH_*` prefix
- **Subfile Detail:** `SFL*` (e.g., SFLRUL for rules subfile)
- **Subfile Control:** `SFLCTL` (literal; only one per screen)
- **Function Key Strip:** `SFT_FKEY` (list screen) or `SD_FKEY` (detail screen)
- **Extended Detail:** `EXTRULEDTL` or `EXT<ENTITY>` prefix
- **Message Subfile:** `MSGSFL` (literal; standard IBM i)
- **Message Control:** `MSGCTL` (literal; standard IBM i)
- **Dummy:** `DUMMY` (literal; end marker)
- **Field Attribute Pairs:** `FIELDNAME` + `FIELDNAMEA` (1A P) for DSPF displayable fields

### Validation Checkpoint

Generated DSPF must pass:
1. `validate-dspf-source.py --type dspf <member>` with zero errors
2. ALIAS check: every program-addressable field has underscore-style ALIAS ≤25 chars
3. Attribute check: every displayable field has matching `<FIELDNAME>A` (1A P) in same record
4. Position check: all row/col coordinates ≤ DSPSIZ (27 rows, 132 cols)
5. Naming check: record names, field names ≤10 chars (IBM i limit)

### Companion RPG `loadSubfile` contract

**Authoritative Reference:** See
`.github/instructions/ibmi-jsp-scaffold.instructions.md`, section
`Canonical Subfile List-Hydration Procedure (DODDRULSH.loadSubfile)`.

When this DSPF pairs with a `DODDRULSH`-style shell, the display source must
support the shell-owned list-hydration seam:

- one subfile detail record plus one `SFLCTL` control record,
- indicators that let the shell clear the subfile before reload and enable it
  only when rows exist,
- program-addressable visible/hidden fields for row mapping,
- optional `RTNCSRLOC`/cursor fields when detail F6 helper flows depend on
  cursor-aware path editing,
- separate message-subfile control so messages are not mixed into row loading.

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
