---
name: codegen-clle
description: Generate and edit IBM i CL artifacts with a CLLE-first, ILE-structured approach. Use when the user asks to create, refactor, or scaffold CL members such as .clle, .clp, or .cl.
version: 1.0.0
author: Roland Strauss
category: IBMi
tags:
   - ibmi
   - clle
   - automation
---

## Purpose

Generate or modernize IBM i CL source members for `QCLLESRC` / `QCMDSRC` workflows using deterministic, compile-ready scaffolds.

## Strategic modernization guidance (authoritative)

**Canonical Reference:** See `.github/instructions/modernizing-ibmi-applications.instructions.md`.

Use that file when the request is about modernization sequencing, DevOps
enablement, rollout strategy, or operational change beyond the CL member itself.

- This skill owns CL/CLLE artifact structure, compile-ready scaffolds, and
   orchestration-focused edit rules.
- The modernization instruction owns the broader guidance for iterative
   modernization, automation, secure delivery, testing expectations, and change
   management.
- Prefer CLLE changes that improve repeatability, orchestration clarity, and
   deployment safety without expanding CL into unnecessary business-logic weight.

## Ferraria standards authority and role semantics (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-ferraria-standards.instructions.md`.

Use that file as the cross-skill authority when CL generation touches Legacy Solutions / Ferraria architecture, handler naming, batch-control roles, or layered-responsibility questions.

- `SH` presents and routes; it does not own core business logic.
- Narrow repo-proven exception: a `DODDRULSH`-style screen handler may perform
   list-only subfile hydration for visible rows, while row-level CRUD/helper
   work stays in `RH` / `SP` / `FM`.
- `BR` and `ML` keep their batch-controller / multithread-bridge meanings.
- `SP` / `FM` remain the reusable service and data-access boundaries.
- Preserve existing contracts when legacy suffixes do not reliably describe current responsibility.

## Variable declaration sequence (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-variable-declaration-sequence.instructions.md`.

When creating declarations (global or local), apply this order when applicable:

1. Files
2. Copy member include of declaratives
3. Procedure Interface
4. Data Structures
5. Stand Alone Variables
6. Enumeration
7. Constants

Rules:

- Apply "when/if applicable": skip categories that do not exist for the artifact.
- For CL, map categories to nearest equivalents (`INCLUDE`/`COPY`, parameter interface, grouped declarations, scalar `DCL`, named sets, constants).
- If any example/template ordering in this file differs, the canonical instruction above wins.

## Scope and precedence

- Default target is **CLLE** (`CLLE` source type).
- `CLP` and `CL` are compatibility targets only; use only when explicitly requested.
- For compile guidance, use ILE flow first: `CRTCLMOD` then `CRTPGM`.
- Do not suggest OPM `CRTCLPGM` unless user explicitly asks for OPM compatibility.

## 5250 screen-generation routing (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-dspf-routing.instructions.md` for authoritative 5250 delegation rules.

**Summary:** This skill does not generate `DSPF`/`PRTF` members.
- When a request includes 5250 screen concerns (layout, fields, attributes, `ALIAS`, `DSPATR`, subfiles, popups), delegate to `codegen-dspf`.
- This skill focuses on CL orchestration and control flow; coordinate with DSPF generation for mixed requests.

## Jackson Structured Programming scaffold (required)

**Authoritative Reference:** See
`.github/instructions/ibmi-jsp-scaffold.instructions.md` for the canonical JSP
pattern, shared across all IBM i codegen skills.

**CL-Specific Application:**
- Apply JSP to the whole `PGM` / `ENDPGM` flow.
- Initialize once, validate inputs once, keep branching explicit, and return
   through one deterministic completion path.
- Do not duplicate validation or fallback logic across multiple branches.

## Companion `DODDRULSH.loadSubfile` reference

**Authoritative Reference:** See
`.github/instructions/ibmi-jsp-scaffold.instructions.md`, section
`Canonical Subfile List-Hydration Procedure (DODDRULSH.loadSubfile)`.

- CL may launch, wrap, or automate a maintenance shell, but it does not own the
   subfile list-hydration routine itself.
- When CL participates in a mixed flow, keep list refresh in the RPG `SH`
   program and keep CL focused on orchestration, setup, and run/build control.

## Required structure

Apply this lifecycle for every generated or edited CL member:

1. **Initialise**
   - Declare state with `DCL`.
   - Initialize status and message variables once.
2. **Input**
   - Receive parameters and validate values.
3. **Process**
   - Use explicit selection (`IF`/`ELSE`, `SELECT`/`WHEN`).
   - Use iteration only when needed (`DOFOR`, `DOWHILE`, `DOUNTIL`).
4. **Output**
   - Emit deterministic completion/failure messaging and return cleanly.

Allowed primitives:

- **Sequence**
- **Selection**
- **Iteration**

Do not generate duplicate branches, contradictory paths, or ambiguous fallbacks.

## Logic and syntax rules

- Prefer structured blocks (`IF`, `DO`, `ELSE`, `ENDDO`, `SELECT`) over `GOTO`/label jumps.
- In CLLE, avoid `TFRCTL`; use structured flow and `CALL`/`CALLPRC` where needed.
- Prefer CL BIFs in expressions: `%TRIM`, `%SST`, `%SCAN`, `%PARMS`, `%SWITCH` (and related `%INT`/`%UINT` conversions as needed).
- Use clear names for variables (`&VAR`), labels, and subroutines.

## Core principles alignment (Caveman, Lindy, Ponytail)

- **Caveman:** output concise, deterministic, and compile-ready scaffolds.
- **Lindy:** prefer proven IBM i ILE CL patterns (`PGM`/`ENDPGM`, `MONMSG CPF0000`, explicit `DCL`, `CRTCLMOD` + `CRTPGM`).
- **Ponytail:** minimum code that works; avoid speculative abstraction and unnecessary complexity.

## Source Member Naming (IBM i Standard: 10-character Maximum)

**Authoritative Reference:** See `.github/instructions/ibmi-source-naming.instructions.md` for complete naming standards and rules.

### Naming enforcement (automatic)

- All `generate-cl-member.py` outputs enforce **maximum 10-character member names** via `normalize_name()` function
- Input names are automatically truncated to fit IBM i object-naming limits
- This is a **hard system limit**, not a preference

### Examples by artifact type

| Artifact | Example Input | Normalized Output | Notes |
|----------|---|---|---|
| CLLE Program | `"CustomerMaintenance"` | `CUSTOMERM` | First 10 chars |
| CLP Program | `"BatchProcessing"` | `BATCHPROC` | Truncated; native CL naming |
| CL Module | `"UtilityRoutines"` | `UTILITYROU` | Supports modular CL design |

### Rationale

IBM i object names are limited to 10 characters by the operating system. This applies to:
- Compiled CL/CLLE program objects
- CL procedure modules in service programs
- Physical source member names (before compilation)

## Modules and service programs (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-service-programs.instructions.md` for complete service program architecture, module patterns, binder strategy, and backward compatibility rules.

Use that file when the request involves creating reusable service programs, module bindings, or shared CL APIs.

- This skill generates individual CLLE modules and programs.
- The service-programs instruction owns module organization, binder architecture, export strategies, and cross-program contracts.
- For module-based requests, generate individual modules; coordinate with build automation and binder configuration as documented in the instruction.

## Hard rules (non-negotiable)

1. Every generated member includes `PGM` and `ENDPGM`.
2. Every generated member includes at least one executable CL command.
3. `CLLE` members include explicit declarations (`DCL`) and modern typing where relevant (`*INT`, `*UINT`, `*CHAR`, `*DEC`).
4. `CLLE` members include `MONMSG MSGID(CPF0000)` and a deterministic **CRASH** subroutine pattern that reads joblog context with `RCVMSG` and escalates via `SNDPGMMSG ... MSGTYPE(*ESCAPE)`.
5. Do not include hardcoded credentials, API keys, or destructive actions by default.
6. Do not introduce `GOTO` in generated CLLE scaffolds.

## Workflow

### 1) Determine target artifact

Classify user request as one of:

- `clle` (ILE CL source member)
- `clp` (OPM CL source member)
- `cl` (generic CL scaffold)

If unclear, choose `clle` by default.

### 2) Generate from strict template

Use one of the templates in this skill folder:

- `templates/CLLE.template.clle`
- `templates/CLP.template.clp`
- `templates/CL.template.cl`

### 3) Enforce CL gate

Before returning output, verify:

- `PGM` and `ENDPGM` are present
- at least one executable command exists
- `CLLE` members contain declarations, modern BIF usage, and `MONMSG MSGID(CPF0000)`
- `CLLE` members include a `CRASH` subroutine pattern with `RCVMSG`
- `CLLE` members do not use `GOTO`
- no obvious hardcoded credential patterns are present

If any check fails, regenerate before responding.

### 4) Compile guidance policy

For ILE-first builds, prefer:

- `CRTCLMOD` to compile module
- `CRTPGM` to bind module (and optional service programs)

Allow `CRTBNDCL` only as a convenience shortcut when user explicitly asks for single-step creation.
Avoid `CRTCLPGM` unless user explicitly asks for OPM CL output.

## Metadata header format (all CL artifacts)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md` for unified IBM i comment and metadata-block rules.

All CL files start with metadata block, then synopsis, then revision history (before `PGM` statement):

```cl
/* <Metadata> */
/* Source Name .........: MYPGM */
/* Created By ...........: Your Name */
/* Date Created .........: YYYY-MM-DD */
/* Source Description ..: Single-line summary of purpose. */
/* Jira ..................: LSPS-XXXX (or N/A) */
/* </Metadata> */
/*
/* <Synopsis>
/* Brief description of runtime behavior and key integration points.
/* </Synopsis>
/*
/* <Revision History>
/* Revisioner | Date | Jira No (if known) | Change |
/* Your Name | YYYY-MM-DD | LSPS-XXXX | Initial scaffold |
/* </Revision History>
*/

PGM PARM(&REQUEST &RC)
```

**Header rules:**
- Sections in order: Metadata → Synopsis → Revision History → PGM statement
- All sections use `/*` block comment style with `<SectionName>` delimiters
- Date format: ISO 8601 (`YYYY-MM-DD`)
- Jira: Full ticket number (e.g., `LSPS-4295`) or `N/A`
- When modifying existing code, add entry to Revision History; preserve all existing entries
- Place metadata block before PGM statement

**Metadata contents (universal across all skills):**
- Source Name (actual member name)
- Created By (developer name)
- Date Created (ISO 8601: `YYYY-MM-DD`)
- Source Description (single-line summary)
- Jira (ticket or `N/A`)

## Native indentation and spacing (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md`.

- Preserve existing CL indentation and spacing when editing an existing member.
- Do not reindent or re-space unrelated commands, `DCL` blocks, or `MONMSG`
   lines unless the developer explicitly asks for formatting changes.
- For new members, follow the native CL layout in repo templates and keep block
   indentation consistent without decorative realignment.

## Output policy

When generating source for users:

- Return exactly one completed member unless asked for multiple.
- Use requested names in message text where applicable.
- Create generated artifact file paths with lower-case file names/extensions.
- Use canonical `filename.type` member pattern; do not use `.pgm.` in file names.
- Keep output concise and compile-ready as a scaffold.

## Optional local validator

Use `scripts/validate-cl-source.py` to enforce CL rules:

```bash
python .agents/skills/codegen-clle/scripts/validate-cl-source.py --type clle QCLLESRC/tplrun01.clle
python .agents/skills/codegen-clle/scripts/validate-cl-source.py --type clp QCLLESRC/tplrun01.clp
python .agents/skills/codegen-clle/scripts/validate-cl-source.py --type cl QCLLESRC/tplrun01.cl
```

## Optional local generator

Use `scripts/generate-cl-member.py` to scaffold members from strict templates:

```bash
python .agents/skills/codegen-clle/scripts/generate-cl-member.py --type clle --name TPLRUN01 --out QCLLESRC/tplrun01.clle
python .agents/skills/codegen-clle/scripts/generate-cl-member.py --type clp --name TPLRUN01 --out QCLLESRC/tplrun01.clp
python .agents/skills/codegen-clle/scripts/generate-cl-member.py --type cl --name TPLRUN01 --out QCLLESRC/tplrun01.cl
```

Supported types:

- `clle`
- `clp`
- `cl`

## Validation checklist

- [ ] member includes `PGM` and `ENDPGM`
- [ ] at least one executable command is present
- [ ] `CLLE` includes `DCL` and modern type usage where applicable
- [ ] `CLLE` includes `MONMSG MSGID(CPF0000)`
- [ ] `CLLE` includes CRASH subroutine pattern (`SUBR(CRASH)` + `RCVMSG` + escape)
- [ ] `CLLE` avoids `GOTO`
- [ ] `CLLE` uses at least one modern BIF (`%TRIM`, `%SST`, `%SCAN`, `%PARMS`, `%SWITCH`)
- [ ] no hardcoded credential patterns are present


@AGENTS.md
