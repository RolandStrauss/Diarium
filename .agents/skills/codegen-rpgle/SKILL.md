---
name: codegen-rpgle
description: Generate new IBM i RPG artifacts (RPGLE, SQLRPGLE, RPGLEINC) using fully free-format syntax only. Use when the user asks to create or scaffold RPGLE/SQLRPGLE/include members, convert fixed-form members to free-form, or requests new IBM i RPG source templates.
version: 1.0.0
author: Roland Strauss
category: IBMi
tags:
  - ibmi
  - rpgle
  - sqlrpgle
  - db2
---

## Purpose

Generate new `RPGLE`, `SQLRPGLE`, and `RPGLEINC` source members that are fully free format and compatible with the style used in this repository.
Apply the same standards when modernizing or modifying existing RPGLE/SQLRPGLE members, with explicit legacy-member safeguards for fixed-form sources.

## Strategic modernization guidance (authoritative)

**Canonical Reference:** See `.github/instructions/modernizing-ibmi-applications.instructions.md`.

Use that file when the request is about **why**, **when**, or **in what order**
RPG modernization should happen.

- This skill owns RPGLE artifact shape, syntax, scaffolding, validation, and
  refactor mechanics.
- The modernization instruction owns problem-first modernization strategy,
  sequencing, security-by-design, data-centric direction, and delivery
  outcomes.
- When modernizing existing RPG, prefer small, testable, modular refactors over
  big-bang rewrites unless the user explicitly asks otherwise.

## Ferraria standards authority and role semantics (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-ferraria-standards.instructions.md`.

Use that file as the cross-skill authority when RPGLE generation touches Legacy Solutions / Ferraria handler roles, routed request programs, service/data layering, or naming ambiguity.

- `SH` owns presentation flow and must not absorb business logic.
- Narrow repo-proven exception: list-only subfile hydration may remain in `SH`
  for `DODDRULSH`-style maintenance shells; single-row CRUD/helper side effects
  stay in `RH` / `SP` / `FM`.
- `RH` is a routed executable program role, not a service program.
- `CH` means **Content Handler** and should call the same back-end services used by interactive flows.
- `SP` / `FM` stay the reusable business/data boundary; preserve existing public contracts when legacy names drift.

## RPGLE anatomy (authoritative)

Apply this anatomy to all newly generated RPGLE/SQLRPGLE members.

### Program members

- Metadata header
- Use `ctl-opt main(main)` for programs.
- File-level declaration order:
  1. `dcl-f`
  2. `/include` (and `/copy` when used)
  3. `dcl-pr`
  4. `dcl-ds`
  5. `dcl-s`
  6. `dcl-enum`
  7. `dcl-c`

Main procedure shape:

```rpgle
dcl-proc main;
  dcl-pi *n;
  end-pi;

  monitor;
    // business logic
  on-error;
    // error handling
  endmon;

on-exit;
end-proc main;
```

### Module and service-program members

- Metadata header
- Use `ctl-opt nomain` for modules and service programs.
- For each procedure, apply local declaration order:
  1. `dcl-f`
  2. `/include` (and `/copy` when used)
  3. `dcl-pr`
  4. `dcl-ds`
  5. `dcl-s`
  6. `dcl-enum`
  7. `dcl-c`

Procedure shape:

```rpgle
dcl-proc proc1;
  dcl-pi *n;
  end-pi;

  dcl-f;
  /include;
  dcl-pr;
  dcl-ds;
  dcl-s;
  dcl-enum;
  dcl-c;

  monitor;
    // business logic
  on-error;
    // error handling
  endmon;

on-exit;
end-proc proc1;
```

### Comment-width rule

- Every RPG `//` comment line must be 100 columns or fewer.
- If a comment exceeds 100 characters, wrap to the next `//` line.

### Text and value line-width rule

- Keep generated RPGLE/SQLRPGLE/RPGLEINC lines containing text or values within
  100 columns, counting indentation and syntax.
- If text or a value would spill past column 100, put the spill-over on the next
  source line at a safe boundary.
- Split long text literals into concatenated string literals with `+` when needed,
  preserving the resulting value.
- Apply the canonical formatting guidance in
  `.github/instructions/ibmi-comment-formats.instructions.md`.

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
- If any example/template ordering in this file differs, the canonical instruction above wins.
- Preserve existing member behavior for targeted edits; do not reorder unrelated legacy declarations unless requested.

## generation hand-off (authoritative)

When a request is to **generate IBM i RPGLE subfile processing** (or equivalent intent such as SFL/SFLCTL lifecycle, READC option processing, detail-plus-subfile maintenance programs, popup subfiles, detail-screen option actions, or 5250 interactive loops), this skill must hand off to:

- `codegen-rpgle-subfile` (`.agents/skills/codegen-rpgle-subfile/SKILL.md`)

**Reference the proven RPGLE SH/RH anatomy:** See `codegen-rpgle-subfile` skill section "RPGLE Shell & Handler Anatomy (SH/RH Pattern)" for:
- Authoritative dual-program structure for interactive subfile maintenance
- Shell program (SH) structure: 14-section pattern with EXFMT loop and helper cluster
- Handler program (RH) structure: pointer-based request DS contract and CRUD action procedures
- Communication protocol: action codes (C/R/U/D/E), request/response fields, status procedures
- Canonical `loadSubfile` list-hydration seam: see
  `.github/instructions/ibmi-jsp-scaffold.instructions.md`, section
  `Canonical Subfile List-Hydration Procedure (DODDRULSH.loadSubfile)`

Rules:

- Do not duplicate architecture/scaffold rules in this skill.
- Keep this skill focused on general RPGLE/SQLRPGLE/RPGLEINC generation and non-subfile concerns.
- When a request mixes subfile flow + general RPGLE concerns, apply `codegen-rpgle-subfile` for flow and this skill for shared language/platform constraints only.
- For CRUD maintenance shells, prefer the `DODDRULSH`-style anatomy: `SH` owns UI flow, `RH` owns single-row CRUD/helper side effects, and one DSPF may contain both list and detail formats.
- Trigger hand-off immediately when prompts include terms like `SFL`, `SFLCTL`, `READC`, `subfile`, `detail screen`, `detail-plus-subfile`, `popup subfile`, `5250 interactive loop`, `detailRecord`, `showAddDialog`, `showChangeDialog`, or `SelectContacts`.

## 5250 DSPF generation hand-off (authoritative)

When a request includes IBM i screen-file generation (for example `DSPF`,
`PRTF`, 5250 layout, display formats, screen fields/coordinates,
`ALIAS`, `DSPATR`, or display attribute fields), this skill must delegate
presentation-source generation to:

- `codegen-dspf` (`.agents/skills/codegen-dspf/SKILL.md`)

**Reference the proven anatomy:** See `codegen-dspf` skill section "DSPF Anatomy & Standard Scaffold" for the authoritative record layout pattern (header, subfile detail/control, detail form, function keys, messages). Use this pattern when designing screen-based RPGLE programs.

Rules:

- Do not author DSPF/PRTF source directly in this skill.
- Do not duplicate or redefine DSPF contracts (`ALIAS`, `DSPATR`,
  `<FIELD>A` attribute fields, displayable field constraints).
- For mixed requests (RPG + screen):
  1) generate/refresh DSPF via `codegen-dspf`,
  2) generate RPG logic in this skill using the resulting DSPF field model.

## Jackson Structured Programming scaffold (required)

**Authoritative Reference:** See `.github/instructions/ibmi-jsp-scaffold.instructions.md` for the canonical JSP pattern, shared across all IBM i codegen skills.

**RPGLE-Specific Application:**
- Apply JSP to **every dcl-proc** (entry procedure + internal procedures)
- Each procedure must have explicit `dcl-pi` interface and `on-exit;` section
- For **RPGLEINC members** (declaration-only): JSP does not apply (no executable flow)

**Quick Reference (RPGLE):**

1. **Initialise** — dedicated `initialize` procedure, call exactly once at start
2. **Input** — receive parameters, validate with single boundary check
3. **Process** — explicit branching (If/Select), bounded iteration only
4. **Output** — deterministic completion path

**Unbounded Loops:** Use `dow (not %shtdn ) ;` (lowercase dow, explicit %shtdn check). Never use `Dow ('1' = '1');`.

**De-Duplication:** One canonical flow per procedure; call init exactly once; avoid duplicate validation across branches.

## Metadata header format (RPGLE artifacts)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md` for unified IBM i comment and metadata-block rules.

All RPGLE members should start with metadata block, then synopsis, then revision history (after `**free`):

```rpgle
**free
// <Metadata>
// Source Name .........: CUSTMAINT
// Created By ...........: Your Name
// Date Created .........: YYYY-MM-DD
// Source Description ..: Customer maintenance processor.
// Jira ..................: LSPS-XXXX (or N/A)
// </Metadata>
//
// <Synopsis>
// Customer CRUD operations.
// </Synopsis>
//
// <Revision History>
// Revisioner | Date | Jira No (if known) | Change |
// Your Name | YYYY-MM-DD | LSPS-XXXX | Initial scaffold |
// </Revision History>

ctl-opt main(mainProc);
```

Header rules:

- Sections in order: Metadata → Synopsis → Revision History → control options / procedures
- Use `//` comment style with `<SectionName>` delimiters
- Date format: ISO 8601 (`YYYY-MM-DD`)
- Jira: full ticket number (for example `LSPS-4295`) or `N/A`
- Preserve existing revision entries; add new rows for substantive changes
- Place metadata block after `**free`, before first `dcl-c`/`dcl-s`/`/INCLUDE`/`ctl-opt`

### Comment-style rules by source type

| Source Type | Comment Style | Example |
|-------------|---------------|----------|
| RPGLE/SQLRPGLE/RPGLEINC | `//` line comment | `// <Metadata>` |
| COBOL/SQLCBLLE/CBLLE | `*>` (column 7 start) | `      *> <Metadata>` (6 spaces then `*>`) |
| CL/CLLE/CLP | `/* */` block or `/*` prefix | `/* <Metadata> */` or `/*  <Metadata>` |
| SQL/SQLTABLE/SQLVIEW/SQLPROC/SQLTRIGGER/SQLINDEX | `--` line comment | `-- <Metadata>` |
| DDS PF/LF | `A*` (column 6 start) | `A* <Metadata>` (in column 6 position) |
| DDS DSPF/PRTF | `A*` (column 6 start) | `A* <Metadata>` (in column 6 position) |
| UIM MENU/PNLGRP | `:comment.` tag | `:comment. <Metadata>` |

### Placement rules (by source type)

- **RPGLE/SQLRPGLE/RPGLEINC:** After `**free`, before first `dcl-c`/`dcl-s`/`/INCLUDE`/`ctl-opt`
- **COBOL/SQLCBLLE/CBLLE:** Before `IDENTIFICATION DIVISION`
- **CL/CLLE/CLP:** Before `PGM` statement
- **SQL artifacts:** Before `SET CURRENT SCHEMA` or first SQL statement
- **DDS (all types):** At the very beginning of the file (line 1 area)
- **UIM:** Within first `:pnlgrp.` block, before structured content

### Metadata format template (universal)

```
Source Name .........: MEMBER_NAME
Created By ...........: Developer Name
Date Created .........: YYYY-MM-DD
Source Description ..: Single-line summary of purpose.
Jira ..................: LSPS-XXXX (or N/A)
```

### Canonical Revision History Update Rule

**When changing any IBM i source artifact, ensure the `Revision History` is updated appropriately.**

- Add new entry only when making substantive changes to source code or structure
- Use table-row format:
  ```
  // <Revision History>
  // Revisioner | Date | Jira No (if known) | Change |
  // Your Name | YYYY-MM-DD | LSPS-XXXX | Added missing audit columns per LSPS-1234 |
  // </Revision History>
  ```
- Preserve all existing revision entries; add new rows at the end
- Keep change descriptions concise and meaningful

## Legacy fixed-form preservation policy (new)

When editing an existing fixed-form `RPGLE`/`SQLRPGLE` member:

- Do **not** convert existing fixed-form code to free-form unless the user explicitly asks for a conversion.
- Preserve all existing fixed-form lines and column-sensitive layout.
- For new code added into fixed-form members, use free-form-compatible logic only where appropriate, but keep the source-member visual standard with Shift-6 placement (new code begins after six leading spaces / starts in column 7).
- Keep existing behavior and flow intact; avoid structural rewrites when the request is a targeted change.

When creating a **new** member, continue using full free-form (`**free`) as the default.

## Native indentation and spacing guardrail (authoritative)

All RPGLE/SQLRPGLE indentation and spacing must follow this precedence order:

1. **Existing member indentation and spacing** (highest priority) when editing/refactoring
2. **Workspace/editor indentation settings** (VS Code)
3. **Repository linter/validator formatting rules**
4. **Shift6 conventions** for fixed-form/legacy contexts

Rules:

- Do not reindent or re-space an entire file unless the developer explicitly
  requests reformatting.
- Preserve surrounding indentation and spacing style for targeted edits.
- For fixed-form members, preserve column-sensitive layout and Shift6 placement.
- For free-form members, keep indentation consistent with existing block depth
  and preserve nearby keyword/operator spacing and alignment choices.
- Never add artificial leading whitespace solely to bypass validation checks.

Ambiguity resolution:

- If indentation or spacing sources conflict, use the highest-priority source
  above and apply the smallest safe change (Ponytail).
- If no source is defined (new file), use repo templates and validator-compliant defaults (Lindy).

## Standards authority and harmonization (Lindy + Ponytail)

This `codegen-rpgle` skill is now the canonical, single source of truth for RPGLE/SQLRPGLE/RPGLEINC generation and refactor rules in this repository. All enforcement, templates, and task-time prompts should reference this skill. The former sources of truth (`.github/copilot-instructions.md` and `.github/prompts/refactor-rpgle.prompt.md`) have been migrated and now act only as pointers to this file.

Apply this section as an overlay to the rest of this skill.

- This `codegen-rpgle/SKILL.md` is the canonical authority for RPGLE rules and regulations used by generators and refactors.
- Keep this skill's proven architecture defaults (modular procedures, explicit interfaces, deterministic lifecycle), but normalize emitted code to the authoritative style/lint rules.
- For free-form directive casing, treat `**FREE` and `**free` as semantically equivalent; emit `**free` to stay consistent with repository tooling and validators.

When ambiguity exists, resolve with these defaults:

- Control-flow keyword casing: use TitleCase (`If`, `Else`, `ElseIf`, `EndIf`, `For`, `EndFor`, `Select`, `When`, `When-in`, `When-is`, `Other`, `EndSl`).
- Loop exception: for sentinel/unbounded loops, emit exactly `dow (not %shtdn ) ;` (lowercase `dow`) to keep a single canonical, shutdown-safe pattern.
- Declaration and built-in casing: use lowercase (`dcl-*`, `%passed`, `%omitted`, `%trim`, `%timestamp`, etc.).
- Procedure/function naming: use `camelCase` for all new and refactored procedure/function names.
  - **Note:** Internal RPG procedure names use camelCase (e.g., `dcl-proc mainProc`), while external IBM i object names remain UPPERCASE per OS naming standard (e.g., `extpgm('MAINPROC')`). A procedure may have both: `dcl-proc myFunc; ... extpgm('MYFUNC');`
- Data structures: always explicitly name `dcl-ds` definitions; use `qualified` on standalone or `template` data structures when fields must be accessed by name qualification. Do not add `qualified` to `dcl-ds` declarations that use `likeds(...)`, because qualification is inherited from the referenced data-structure type. Avoid unnamed DS and never use `OCCURS`.
- Character set: use letters, digits, and underscores only for new identifiers; do not introduce legacy IBM i special characters such as `@`, `#`, or `$`.
- Parameters: use `p_`-prefixed `camelCase` names with explicit typing (pattern: `p_[a-z][A-Za-z0-9]*`).
- Prototypes/interfaces: use either `pr_` / `pi_` + PascalCase suffix (patterns: `pr_[A-Z][A-Za-z0-9]*`, `pi_[A-Z][A-Za-z0-9]*`) or exact callable procedure-name match.
- Contract exception: preserve existing external/public non-camelCase signatures only when they are contractual and cannot be changed safely.
- Identifier length: keep internal RPG names readable (roughly 10-30 characters when practical), but keep external IBM i object names within the OS 10-character uppercase limit.
- Procedure boundaries: prefer small, single-responsibility `dcl-proc` units; remove duplicated inline logic and redundant temp variables.
- Use the canonical `filename.type` source-member pattern; do not insert `.pgm.` or `.srvpgm.` into file names.
- If an existing member uses `filename.pgm.type` or `filename.srvpgm.type`, rename it to `filename.type` before editing or regenerating it.

When creating new source folders and files, use lower-case names and lower-case extensions for generated artifact paths; the generator normalizes the output file name to lower-case when writing, while keeping IBM i source-library/object names unchanged where the toolchain requires them.

Lindy durability requirements:

- Preserve business outcomes, signatures, and external contracts when refactoring.
- Wrap high-risk operations in `monitor` / `on-error` / `end-mon` blocks.
- Check `SQLSTATE` or `SQLCODE` immediately after every `EXEC SQL` block, explicitly handling success, no-data (`02000`/`100`), and failure paths.
- Preserve public database and program contracts (external names, parameter shape/order/types, and return behavior) unless the user explicitly requests a contract change.

Ponytail IBM i safety requirements:

- Do not generate legacy subroutines (`BEGSR` / `EXSR` / `ENDSR`), `GOTO`, `**CTDATA`, or dynamic external program targets.
- Enforce restricted-call safety: do not generate `QCMD`, `QP2TERM`, `QSH`, `SYSTEM`, `QCMDEXC`, `QSYGETPH`, or `QWTSETP` references.
- For embedded SQL, do not generate `JOIN` statements or `EXEC SQL EXECUTE IMMEDIATE`; prefer host-variable-driven statements, staged queries, or existing views.
- Keep code free-form, explicit, and minimal: no speculative abstractions, no duplicate branches, no boilerplate without runtime value.

Template usage rule:

- Templates in this file are accelerators, not style authorities. If a template line conflicts with the authoritative rules in this `codegen-rpgle` skill, normalize it before returning code.
- Normalize template output before delivery: TitleCase control-flow keywords, lowercase declarations/built-ins, uppercase SQL keywords, explicit parentheses for procedure/function calls, and `/INCLUDE` relative paths.
- Apply indentation and spacing normalization minimally and locally; do not
  perform whole-file whitespace churn unless explicitly requested.

Editing mode selection: See **"Legacy fixed-form preservation policy"** above for how to handle existing fixed-form vs. new/free-form members.

## Industry best-practice profile (IBM i ILE RPG)

Apply these defaults unless the user explicitly asks otherwise:

- Keep generated members fully free-format with `**free` on the first non-empty line.
- Use `ctl-opt` with explicit runtime behavior (`dftactgrp(*no)`, explicit `actgrp(...)`, `option(*srcstmt: *nodebugio)`).
- Keep entry procedures thin and move business logic to internal procedures.
- Keep initialization logic out of the entry body; call a dedicated initialize procedure first, then continue with input/process/output.
- Use explicit interfaces (`dcl-pr` / `dcl-pi`) and clear data-structure types to reduce side effects.
- Prefer named constants (`dcl-c`) over magic values.
- Add explicit error-handling paths (`monitor` / `on-error`) for I/O and SQL-heavy flows.
- For SQLRPGLE, use host variables only, check `sqlstate` / `sqlcode`, and handle no-data (`02000`) explicitly.
- Keep `RPGLEINC` members declarative only (constants, templates, prototypes); no executable flow.
- Create every RPGLE copybook in `qrpglesrc` and use the `.rpgleinc` extension only.
- Avoid global mutable state where possible; pass data via parameters.

## Design and maintainability guidelines

- Favor small, single-purpose procedures with clear names over one large monolithic routine.
- Keep procedure interfaces stable: add optional parameters with `options(*nopass : *omit)` when evolving APIs.
- For optional/omittable parameters, use `%passed(parameter)` and `%omitted(parameter)` for flow control. Do not generate legacy availability checks based on `%parms/%parmnum/%addr` except when preserving existing legacy-fixed behavior.
- Prefer readable free-form control flow (`If`, `Select`, `For`, `Dou`) and avoid deeply nested branching.
- Keep business-meaningful comments; remove noise comments that restate obvious syntax.
- Use consistent naming:
  - Constants: upper snake case (for example, `MAX_ROWS`)
  - Procedures: camelCase action names (for example, `normalizeName`)
  - Parameters: `p_` + lowerCamelCase (for example, `p_customerId`, `p_outputResponse`)
  - Variables: camelCase descriptive names (for example, `customerId`)
  - Procedure prototypes/interfaces: use `pr_`/`pi_` + PascalCase or exact callable procedure-name match (Lindy default)
- Honor the naming defaults above; preserve existing external/public names when they are contractual, even if they reflect IBM i platform constraints.
- For indicators, never use raw numeric indicator references (for example `*in03`, `*in(03)`, `*in31`, `*in99`) in generated or refactored code. Use named indicators with business meaning instead (for example a qualified DS with `ind pos(nn)` entries such as `Exit`, `Prompt`, `Refresh`, `sflDsp`, `sflClr`).

## SQLRPGLE safety and performance guidelines

- Set SQL options intentionally (`commit`, `datfmt`, `closqlcsr`, and naming mode if required by the project).
- Parameterize SQL through host variables (`:var`) only; never concatenate untrusted input into SQL text.
- **Audit Columns:** See `.github/instructions/ibmi-audit-columns.instructions.md` for canonical audit column list and placement rules. When generating `CREATE TABLE` / `CREATE OR REPLACE TABLE`, include only **missing** audit columns from the canonical reference.
- Handle result states explicitly:
  - success (`sqlstate = '00000'`)
  - no row (`sqlstate = '02000'`)
  - all other errors (capture/return diagnostics path)
- Select only required columns; avoid broad `select *` in generated production members.
- Keep transaction intent explicit:
  - `commit(*none)` for read-only/simple utility flows
  - commit control enabled when user asks for transactional writes

## Error handling and operability guidelines

- Add `monitor` / `on-error` around risky sections when scaffolding production-oriented code.
- Ensure a deterministic end state (`*inlr = *on; return;`) for simple program templates.
- Make failure observable:
  - return status/output parameter
  - or emit structured message pattern placeholder for joblog integration
- Do not include secrets, credentials, or environment-specific values in generated source.

## IBM RPG Cafe augmentation (announcement + enhancements + how-to + utilities)

Apply these rules additively. Existing hard rules in this skill remain authoritative,
including free-format policy, `dcl-proc` + `dcl-pi` requirements, and
`ctl-opt main(...)` entry-proc enforcement.

### 1) Precedence, de-duplication, and compatibility policy

- Keep one compatibility rule only: **if feature requires compiler/runtime/PTF support,
  do not assume availability**. Emit feature only when target support is known.
- If support is unknown, use conservative fallback syntax.
- Distinguish compile-time and runtime controls clearly:
  - compile-time controls: command parameters, `ctl-opt`, compile-time envvars
  - runtime dependencies: runtime PTFs and runtime behavior
- Temporary RPG environment variables (announcement page) are **compile-time only**;
  they are not needed after successful compile unless IBM explicitly says otherwise.

### 2) Release-wave enhancement adoption (requested scope)

#### July 2026

- Assertion operations (`ASSERT-T`, `ASSERT-F`) and `ctl-opt assert(...)`:
  - use for explicit contracts/tests only
  - for `ASSERT(*CALL: ...)`, `%MSG` must use one message-string parameter
  - callback PI must match required signature shape
- Generic `ON-EXCP` IDs (for example `'ABC*'`):
  - first matching `ON-EXCP` wins
  - order from most specific to broadest wildcard
- `LIKE(*EXT)` support:
  - prefer for single external-field typing instead of full DS/file scaffolding
  - use explicit record format when ambiguity exists
  - use `inz(*extdft)` only when external default is desired
- `%LOOKUPNE` / `%TLOOKUPNE`:
  - prefer over manual loops for first-not-equal intent
- PSDS job type/subtype:
  - if generating PSDS-aware diagnostics, use documented positions (404/405)
  - treat values as environment metadata, not business identity

#### Fall 2025

- New conversion date formats `*DMYY`, `*MDYY`, `*YYMD`:
  - use for conversion operations only (`%CHAR`, `%DEC`, `%DATE`, `MOVE/MOVEL`, `TEST(D)`)
  - do not use to define date variable types
- Implicit CCSID conversion for built-in functions:
  - prefer explicit CCSID-safe coding when ambiguity exists
  - do not rely on implicit conversion behavior unless target support is confirmed
  - note: full page extraction failed in tooling; rule kept conservative
- Variables defined like typed enumerations:
  - use `dcl-s var like(myEnum)` when strong enum-domain typing is wanted
  - assign enum constants/typed vars only; avoid literal assignment to enum-typed fields

#### Spring 2025

- No new RPG language enhancements listed. Do not introduce synthetic feature flags.

#### Fall 2024

- DATEYY support for 2039-readiness:
  - use `DATEYY(*WARN)` for discovery scans
  - use `DATEYY(*NOALLOW)` for strict gates
  - use `*LONGJOBRUN` for 4-digit-year job-format conversions
- `%PROC()` in `ON-EXIT`:
  - inside `ON-EXIT`, require explicit selector (`*ONEXIT` or `*OWNER`)
- `%HIVAL` / `%LOVAL`:
  - prefer for bounds checks on variables and enumerations

#### Spring 2024

- `SND-MSG` expansion:
  - when used, support additional message types (`*COMP`, `*DIAG`, `*NOTIFY`, `*STATUS`)
  - support additional targets (`*CTLBDY`, `*PGMBDY`, `*EXT`) as needed
- Constant standalone/data-structure definitions:
  - use `const` on immutable module constants and immutable DS defaults
  - never generate writes to `const` objects

#### Fall 2023

- `%LEFT` / `%RIGHT`:
  - prefer over manual substring slicing for left/right extraction intent
  - for UTF-8/variable-width text, use CHARCOUNT-aware natural-mode forms as needed
- Enumerations (`dcl-enum`):
  - use for named domain constants
  - allow `qualified` style when namespace clarity is needed
  - when using enums as iterable/domain sets, prefer readable constructs (`for-each`, `in`)

#### Spring 2023

- `%PASSED` / `%OMITTED`:
  - required default for new optional/omittable parameter flow
  - replace legacy `%parms/%parmnum/%addr` availability checks during refactors unless explicit backward-compatibility constraints block the change
- `%SPLIT(...:*ALLSEP)`:
  - use only when empty-segment preservation is desired
  - keep runtime-PTF caution in compatibility note
- `SELECT` with operand + `WHEN-IS` / `WHEN-IN`:
  - use for cleaner branch intent when many equality/membership cases exist
- PCML boolean for indicators:
  - if PCML generation requires boolean indicator semantics, use `PGMINFO(...:*V8)`
  - or compile-time `QIBM_RPG_PCML_VERSION=8.0`

### 3) How-to and utility synthesis (deduplicated)

#### C/JNI and Java interop

- For C prototypes, prefer `EXTPROC(*CWIDEN : *DCLCASE)` unless headers require
  `*CNOWIDEN`.
- For string semantics:
  - null-terminated input: `pointer value options(*string)`
  - mutable/variable-size buffer: `char(n) options(*varsize)`
- For RPG→Java troubleshooting, document that JVM-start envvars are read at JVM
  startup in job context; later changes may not apply.

#### PCML operability

- If service exposure/introspection is requested, support:
  - `PGMINFO(*PCML : *MODULE)`
  - optional `*DCLCASE` for mixed-case names
  - optional V8 boolean indicator generation for PCML consumers

#### DATA-GEN and template replacement

- For marker substitution utilities, prefer `DATA-GEN ... %GEN(...)` patterns
  over bespoke multi-pass string replace loops when that reduces complexity.

#### Storage-corruption troubleshooting utility path

- When diagnosing QRNXIO-related file-operation corruption symptoms:
  - call out parameter-shape mismatch and `*NOPASS/*VARSIZE` misuse risk
  - use IBM check-files envvar workflow as a targeted diagnostic path
  - keep this workflow opt-in and separate from normal generation paths

### 4) Contradiction resolution notes

- `WHEN-IN`/`WHEN-IS` usage is compatible with this skill's TitleCase policy
  (`When-in`, `When-is`).
- `LIKE(*EXT)` and typed enums are additive to existing typing rules; they do not
  replace explicit interface discipline.
- New messaging/assertion features do not override repo safety constraints; avoid
  emitting diagnostic noise in production paths unless explicitly requested.

### 5) Source anchors used for this augmentation

- RPG Cafe Announcement: https://www.ibm.com/support/pages/rpg-cafe#announcement
- RPG Cafe Enhancements: https://www.ibm.com/support/pages/rpg-cafe#enhancements
- RPG Cafe How-To: https://www.ibm.com/support/pages/rpg-cafe#how-to
- RPG Cafe Utilities: https://www.ibm.com/support/pages/rpg-cafe#utilities
- Core nodes consumed include:
  - `7276258`, `7276358`, `7276353`, `7276362`, `7277470`
  - `7246938`, `7246937`, `7172105`, `7172104`, `7172133`
  - `7149564`, `7149873`, `7047134`, `7047175`
  - `6982093`, `6982241`, `6982199`, `6983230`
  - `7271860`, `7273537`

## Service program and module best practices

**Authoritative Reference:** See `.github/instructions/ibmi-service-programs.instructions.md` for complete service program architecture, module patterns, binder strategy, and backward compatibility rules.

**RPGLE-Specific Essentials:**

- **Prefer module + service program** for reusable logic; program entry points only for orchestration
- **Module pattern:** `ctl-opt nomain`, explicit `export` on public procedures, `dcl-proc serviceProc export;`
- **Public APIs:** shared RPGLEINC with prototypes only (no executable code)
- **Binding:** explicit binder source with versioned signatures (STRPGMEXP/ENDPGMEXP)
- **Export discipline:** never use `EXPORT(*ALL)`; export only stable procedures via binder source
- **Activation group:** default to `dftactgrp(*no)` and `actgrp(*caller)` for reusable service programs
- **Backward compatibility:** additive changes (new procedures, new optional parameters); breaking changes require new signature level

**Backward Compatibility via Binder Signatures:**
- `PGMLVL(*CURRENT)` — current API version with signature like `'MY_SVC_V2R0M0'`
- `PGMLVL(*PRV)` — previous version with older signature like `'MY_SVC_V1R0M0'`
- Old code links to old signature; new code links to new signature; both coexist in same job

## Repository baseline (derived from local analysis)

- 159 total source files analyzed:
  - 48 `*.rpgle`
  - 83 `*.sqlrpgle`
  - 28 `*.rpgleinc`
- 97 files start in free format (`**free` or `/free`), 62 do not.
- `ctl-opt` is used widely and should be retained for new programs.
- SQL programs are common (`exec sql` appears broadly); include SQL scaffolding for `SQLRPGLE`.

## Source Member Naming (IBM i Standard: 10-character Maximum)

**Authoritative Reference:** See `.github/instructions/ibmi-source-naming.instructions.md` for complete naming standards and rules.

### Naming enforcement (automatic)

- All `generate-rpgle-member.py` outputs enforce **maximum 10-character member names** via `normalize_name()` function
- Input names are automatically truncated to fit IBM i object-naming limits
- This is a **hard system limit**, not a preference

### Examples by artifact type

| Artifact | Example Input | Normalized Output | Notes |
|----------|---|---|---|
| Program | `"CustomerMaintenance"` | `CUSTOMERM` | First 10 chars; applied to RPGLE programs |
| Module | `"metric_rules_processor"` | `METRIC_RUL` | Truncated; underscores preserved |
| Service Program | `"UtilityServicePkg"` | `UTILITYSER` | Same rule; SVC suffix adds 3 chars |
| Include (RPGLEINC) | `"SharedConstants"` | `SHAREDCONS` | Typically shorter for includes |

### Rationale

IBM i object names are limited to 10 characters by the operating system. This applies to:
- Compiled program objects (`MYPGM`, `MYMOD`, etc.)
- Physical/logical file objects
- Table/view/procedure SQL objects
- Service programs and modules

While SQL allows optional longer `FOR SYSTEM NAME` aliases, the **physical source member name** (10 chars) must remain compatible with OS limits and native tools.

### How truncation works

The `normalize_name()` function:
1. Converts input to uppercase
2. Keeps only alphanumeric characters and underscores
3. Truncates to maximum 10 characters
4. Returns result or fallback name if empty

**Example:** `"customer_account_master"` → `CUSTOMER_A` (10 chars max)

## Hard rules (non-negotiable)

1. For **newly generated** `RPGLE`/`SQLRPGLE`/`RPGLEINC`, first non-empty line MUST be exactly:
   - `**free`
2. For **newly generated** members, never generate:
   - `/free` or `/end-free`
   - Fixed-format specs (`H`, `F`, `D`, `I`, `C`, `O`, `P`, `A` in fixed-form style)
3. For **newly generated** members, always use free-form declarations:
   - `ctl-opt`, `dcl-s`, `dcl-c`, `dcl-ds`, `dcl-pr`, `dcl-pi`, `dcl-proc`, `end-proc`
4. End every free-form statement with ` ;`.
5. Prefer explicit interfaces and clear procedure boundaries.
6. If SQL is used, keep SQL in free-form `exec sql ...;` blocks.
7. Do not create `dcl-pr` prototypes for local/private same-member procedures (`dcl-proc`). Keep `dcl-pr` only for external contracts (for example `extpgm(...)`, service API copybooks, or cross-member procedure contracts). If a local/private procedure has a matching local `dcl-pr`, remove the `dcl-pr` block.
8. Every `dcl-proc` must contain a `dcl-pi` interface block.
9. For newly generated programs, use `ctl-opt main(main)` and ensure a matching
   `dcl-proc main;` exists as the entry-point procedure.
  - Preserve existing non-`main` contractual entry names only when explicitly
    requested or required for compatibility.
10. In free-form `RPGLE`/`SQLRPGLE`, every `dcl-proc` must include an explicit `on-exit;` section before `end-proc;`.
  - Keep it minimal and deterministic: use it for cleanup/finalization only.
  - If `%proc()` is used inside `on-exit`, use explicit selector form (for example `%proc(*onexit)` or `%proc(*owner)`).
11. In legacy fixed-form members, do not rewrite existing fixed-form lines to free-form. New inserted lines must honor Shift-6 placement and preserve surrounding fixed-form conventions.
12. For optional or omittable parameters, use `%passed(parameter)` / `%omitted(parameter)` for availability checks. Do not generate `%parms/%parmnum/%addr` parameter-availability logic in new code.
13. Do not use raw numeric indicator references (`*inNN` or `*in(NN)`). Use named indicators that clearly describe behavior.
14. Never generate `Dow ('1' = '1');` (or equivalent always-true sentinel loops). Use `dow (not %shtdn ) ;` for unbounded loop scenarios.
15. Add a procedure header comment block immediately above every `dcl-proc`
  containing the procedure name and a short synopsis.
16. In RPGLE/SQLRPGLE comments, keep each comment line at 100 columns or fewer.
  If a procedure synopsis is longer, wrap it onto the next `//` line.
17. Keep generated RPGLE/SQLRPGLE/RPGLEINC text and value lines within 100
  columns; move spill-over to the next source line without changing the value.

## Quality gate (must pass before delivery)

1. Mode-aware compliance gate passes:
  - free-form mode: `**free`, no fixed-form directives/spec lines.
  - legacy-fixed mode: existing fixed-form retained; no unintended conversion.
2. Procedure interfaces are explicit (`dcl-pi`/`dcl-pr` where applicable).
3. SQL members handle success, no-data, and error paths.
4. Generated code uses clear names and no unresolved placeholders unless user requested stubs.
5. `RPGLEINC` output contains declarations only.
6. For service-program requests: exported API surface and binder signature strategy are explicit.
7. Optional/omittable parameter logic uses `%passed/%omitted` and avoids legacy `%parms/%parmnum/%addr` flow in new code.
8. Every free-form procedure includes an explicit `on-exit;` section.
9. Indentation and spacing are consistent with existing
  file/editor/linter/Shift6 precedence and avoid unnecessary whitespace-only churn.
10. Every procedure includes a header synopsis comment block directly above
  `dcl-proc`, with comment lines wrapped to 100 columns or fewer.
11. Generated RPGLE/SQLRPGLE/RPGLEINC text and value lines stay within 100
  columns, with spill-over continued on the next source line.

## Workflow

### 1) Determine target artifact

Classify the user request as one of:

- `RPGLE` (program/module/service procedure, no embedded SQL required)
- `SQLRPGLE` (embedded SQL required)
- `RPGLEINC` (shared declarations/constants/prototypes)

If unclear, ask which one they want.

### 2) Generate from strict template

Start from the matching template below and then fill business-specific names, types, and logic.
Also apply the best-practice profile above (modularity, SQL safety, explicit error paths).

### 3) Enforce free-format gate

Before returning output, verify:

- first non-empty line is `**free`
- no `/free` or `/end-free`
- no fixed-form spec lines
- all declarations are free-form

Legacy-fixed mode exception:

- If editing an existing fixed-form member, do not apply the free-format gate to unchanged legacy lines.
- Instead verify no accidental fixed-to-free rewrite occurred, and new inserted lines respect Shift-6 placement.

If any check fails, regenerate before responding.

### 4) Enforce production-readiness gate

Before returning output, verify:

- control options are explicit and intentional
- interfaces are explicit and typed
- SQL logic handles `00000` / `02000` / error state
- no secrets or environment-specific literals are embedded
- service-program/module requests define: prototypes, exports, and signature/version strategy

## Templates

Reusable template files are also available in this skill folder:

- `templates/RPGLE.template.rpgle`
- `templates/SQLRPGLE.template.sqlrpgle`
- `templates/RPGLEINC.template.rpgleinc`
- `templates/SRVPGM_MODULE.template.rpgle`
- `templates/SRVPGM_CONSUMER.template.rpgle`
- `templates/BINDER.template.bnd`
- `templates/SRVPGM_BUILD.template.clle`
- `templates/SERVICE_API.template.rpgleinc`

### Template: RPGLE (fully free)

```rpgle
**free
ctl-opt main(mainProc)
        option(*srcstmt: *nodebugio)
        datfmt(*iso)
        timfmt(*iso)
        dftactgrp(*no)
        actgrp(*new);

// <Procedure: buildResponse>
// Builds and returns response text using the provided input value.
// </Procedure: buildResponse>
dcl-proc buildResponse;
  dcl-pi *n                        varchar(512);
    p_inputValue                   varchar(256) const;
  end-pi;

  return 'Processed: ' + %trim(p_inputValue);
on-exit;
end-proc;

// <Procedure: initialize>
// Initializes program-level defaults and setup values before main processing.
// </Procedure: initialize>
dcl-proc initialize;
  dcl-pi *n;
  end-pi;

  // Initialization leg placeholder.
  // Keep defaults/constants setup here.

  return;
on-exit;
end-proc;

// <Procedure: mainProc>
// Orchestrates initialization and input handling, then returns control to caller.
// </Procedure: mainProc>
dcl-proc mainProc;
  dcl-pi *n                        extpgm('MAINPROC');
    p_inRequest                    varchar(256) const options(*nopass : *omit);
  end-pi;

  dcl-s response                   varchar(512) inz('');
  dcl-s DspMsg                     varchar(1024) inz(*Blank);
  dcl-s status                     packed(5);

  Monitor;
    initialize();

    If (%passed(p_inRequest));
      response = buildResponse(p_inRequest);
    ElseIf (%omitted(p_inRequest));
      response = buildResponse('OMITTED_INPUT');
    Else;
      response = buildResponse('NO_INPUT');
    EndIf;
  On-Error;
    status = %status();
    DspMsg = 'Unhandled Error in program: ' + %char(status);
    snd-msg *escape %trim(DspMsg);
  EndMon;

  *inlr = *on;
  return;
on-exit;
end-proc;
```

### Template: SQLRPGLE (fully free)

```rpgle
**free
ctl-opt main(mainSql)
        option(*srcstmt: *nodebugio)
        datfmt(*iso)
        timfmt(*iso)
        dftactgrp(*no)
        actgrp(*new)
        commit(*none)
        alwnull(*usrctl);

/INCLUDE 'qrpglesrc/sqlca.rpgleinc'

dcl-c SQLSTATE_OK                   const('00000');
dcl-c SQLSTATE_NO_DATA              const('02000');

// <Procedure: initialize>
// Sets SQL runtime options and prepares shared setup for SQL program execution.
// </Procedure: initialize>
dcl-proc initialize;
  dcl-pi *n;
  end-pi;

  exec sql
    set option commit = *none, datfmt = *iso, closqlcsr = *endmod;

  return;
on-exit;
end-proc;

// <Procedure: mainSql>
// Runs input-driven SQL lookup flow and handles success, no-data, and error paths.
// </Procedure: mainSql>
dcl-proc mainSql;
  dcl-pi *n                        extpgm('MAINSQL');
    p_inId                            packed(9:0) const options(*nopass : *omit);
  end-pi;

  dcl-s outName                       varchar(128) inz('');
  dcl-s rowCount                      int(10) inz(0);
  dcl-s hasError                      ind inz(*off);
  dcl-s DspMsg                        varchar(1024) inz(*Blank);
  dcl-s status                        packed(5);

  Monitor;
    initialize();

    If (%passed(p_inId));
      exec sql
        select NAME
          into :outName
          from MYTABLE
         where ID = :p_inId;

      If (sqlstate = SQLSTATE_OK);
        rowCount = 1;
      ElseIf (sqlstate = SQLSTATE_NO_DATA);
        rowCount = 0;
      Else;
        hasError = *on;
      EndIf;
    ElseIf (%omitted(p_inId));
      rowCount = 0;
    Else;
      rowCount = 0;
    EndIf;
  On-Error;
    status = %status();
    DspMsg = 'Unhandled Error in program: ' + %char(status);
    snd-msg *escape %trim(DspMsg);
  EndMon;

  If (hasError);
    // TODO: map SQL/runtime failure to caller-visible error contract.
  EndIf;

  *inlr = *on;
  return;
on-exit;
end-proc;
```

### Template: RPGLEINC (fully free include member)

```rpgle
**free
// Shared DS template

dcl-ds ApiError_t qualified template;
  code char(7);
  message varchar(512);
end-ds;

// Shared constants

dcl-c APP_NAME const('MYAPP');
dcl-c MAX_ROWS const(9999);
dcl-c SQLSTATE_OK const('00000');
dcl-c SQLSTATE_NO_DATA const('02000');

// Shared prototype

dcl-pr normalizeName varchar(128);
  p_inputValue varchar(256) const;
end-pr;
```

### Template: Service Program Module (fully free, nomain)

```rpgle
**free
ctl-opt nomain
        option(*srcstmt: *nodebugio)
        datfmt(*iso)
        timfmt(*iso)
        dftactgrp(*no)
        actgrp(*caller);

dcl-s DspMsg                        varchar(1024) inz(*Blank);
dcl-s status                        packed(5);

// <Procedure: serviceProc>
// Validates and delegates public service work, returning normalized output.
// </Procedure: serviceProc>
dcl-proc serviceProc export;
  dcl-pi *n                        varchar(256);
    p_inValue                       varchar(256) const;
  end-pi;

  dcl-s normalized                  varchar(256) inz('');

  Monitor;
    normalized = serviceProcInternal(p_inValue);
  On-Error;
    status = %status();
    DspMsg = 'Unhandled Error in program: ' + %char(status);
    snd-msg *escape %trim(DspMsg);
  EndMon;

  return normalized;
on-exit;
end-proc;

// <Procedure: serviceProcInternal>
// Applies internal normalization logic used by the exported service procedure.
// </Procedure: serviceProcInternal>
dcl-proc serviceProcInternal;
  dcl-pi *n                        varchar(256);
    p_inValue                       varchar(256) const;
  end-pi;

  return %trim(p_inValue);
on-exit;
end-proc;
```

### Template: Service Program Consumer (fully free, caller pattern)

```rpgle
**free
ctl-opt main(mainProc)
        option(*srcstmt: *nodebugio)
        datfmt(*iso)
        timfmt(*iso)
        dftactgrp(*no)
        actgrp(*caller);

/INCLUDE 'qrpglesrc/service_api_include_member.rpgleinc'

// <Procedure: mainProc>
// Calls the service API with optional input and handles runtime error reporting.
// </Procedure: mainProc>
dcl-proc mainProc;
  dcl-pi *n                        extpgm('MAINPROC');
    p_inValue                       varchar(256) const options(*nopass : *omit);
  end-pi;

  dcl-s outValue                    varchar(256) inz('');
  dcl-s DspMsg                      varchar(1024) inz(*Blank);
  dcl-s status                      packed(5);

  Monitor;
    If (%passed(p_inValue));
      outValue = serviceProc(p_inValue);
    ElseIf (%omitted(p_inValue));
      outValue = serviceProc('');
    Else;
      outValue = serviceProc('');
    EndIf;
  On-Error;
    status = %status();
    DspMsg = 'Unhandled Error in program: ' + %char(status);
    snd-msg *escape %trim(DspMsg);
  EndMon;

  *inlr = *on;
  return;
on-exit;
end-proc;
```

### Template: Binder source (QSRVSRC)

```text
STRPGMEXP  PGMLVL(*CURRENT)  SIGNATURE('SERVICE_SIGNATURE')
  EXPORT SYMBOL('serviceProc')
ENDPGMEXP
```

Binder note:

- Keep binder source minimal unless a local binder-comment standard already exists.
- Do not inject speculative metadata comments into binder source just for symmetry; this repo's canonical comment guidance does not currently define a binder-source header format.

### Template: Service API include (RPGLEINC)

```rpgle
**free
// <Metadata>
// Source Name .........: SERVICE_API_INCLUDE_MEMBER
// Created By ...........: Copilot
// Date Created .........: 2026-08-28
// Source Description ..: Public RPGLE include scaffold for service prototypes.
// Jira ..................: N/A
// </Metadata>
//
// <Synopsis>
// Declares exported service-program procedures for consumer members.
// </Synopsis>
//
// <Revision History>
// Revisioner | Date | Jira No (if known) | Change |
// Copilot | 2026-08-28 | N/A | Initial scaffold |
// </Revision History>

// Service program public API prototypes

dcl-pr serviceProc varchar(256);
  p_inValue varchar(256) const;
end-pr;
```

### Template: Service Program Build Recipe (CLLE)

```cl
/* <Metadata> */
/* Source Name .........: BUILD_MEMBER_NAME */
/* Created By ...........: Copilot */
/* Date Created .........: 2026-08-28 */
/* Source Description ..: CLLE build recipe scaffold for service program artifacts. */
/* Jira ..................: N/A */
/* </Metadata> */
/* */
/* <Synopsis> */
/* Builds the service module, service program, binding directory entry, and */
/* consumer program for SERVICE_NAME using the supplied library/bnddir values. */
/* </Synopsis> */
/* */
/* <Revision History> */
/* Revisioner | Date | Jira No (if known) | Change | */
/* Copilot | 2026-08-28 | N/A | Initial scaffold | */
/* </Revision History> */
/* */
/* Assumptions: */
/* - Module source member:   SERVICE_NAME (QRPGLESRC) */
/* - Binder source member:   SERVICE_NAME (QSRVSRC) */
/* - Consumer source member: CONSUMER_NAME (QRPGLESRC) */
/* - Library qualifier:      LIBRARY_NAME */
/* - Binding directory:      BNDDIR_NAME */

CRTRPGMOD MODULE(LIBRARY_NAME/SERVICE_NAME) SRCFILE(LIBRARY_NAME/QRPGLESRC) SRCMBR(SERVICE_NAME)
CRTSRVPGM SRVPGM(LIBRARY_NAME/SERVICE_NAME) MODULE(LIBRARY_NAME/SERVICE_NAME) EXPORT(*SRCFILE) SRCFILE(LIBRARY_NAME/QSRVSRC) SRCMBR(SERVICE_NAME) ACTGRP(*CALLER)
ADDBNDDIRE BNDDIR(LIBRARY_NAME/BNDDIR_NAME) OBJ((*LIBL/SERVICE_NAME *SRVPGM))
CRTRPGMOD MODULE(LIBRARY_NAME/CONSUMER_NAME) SRCFILE(LIBRARY_NAME/QRPGLESRC) SRCMBR(CONSUMER_NAME)
CRTPGM PGM(LIBRARY_NAME/CONSUMER_NAME) MODULE(LIBRARY_NAME/CONSUMER_NAME) BNDDIR(LIBRARY_NAME/BNDDIR_NAME)
DSPSRVPGM SRVPGM(LIBRARY_NAME/SERVICE_NAME) DETAIL(*PROCEXP)
```

Use this as a starting point; adjust library names, binding directory, and replace options per environment policy.

Build-recipe note:

- `srvpgm-build` is a **CL command recipe artifact**, not a standalone `PGM/ENDPGM` CL program scaffold.
- Do not run `validate-cl-source.py` against `srvpgm-build` output unless you first convert it into an executable CL member with `PGM`, `DCL`, error handling, and `ENDPGM` structure.
- Validate it by reviewing command completeness and by using the generated commands in the intended IBM i build flow.

## Output policy

When generating new source for users:

- Return exactly one completed member unless asked for multiple.
- Use requested member/object names in `main(...)` and `extpgm(...)`; normalize new/refactored procedure/function names to camelCase unless preserving a contractual external signature.
- For SQLRPGLE, include at least one `exec sql` block if the user asks for DB logic.
- For SQLRPGLE, include explicit success/no-data/error handling paths.
- Do not mix fixed and free format.
- For service-program/module requests, include a clear split between:
  - public prototypes (`RPGLEINC`)
  - exported procedures (`nomain` module)
  - binder signature/export intent (`QSRVSRC` snippet)
- Treat `srvpgm-build` as a helper build recipe rather than a validator-target CL program.
- Copybook output must target `qrpglesrc/*.rpgleinc`; do not emit RPGLE copybooks into `QRPGLESRC` or sample subfolders.

## Conversion policy (fixed to free)

If user asks to modernize existing fixed-form code:

1. Preserve behavior first.
2. Convert declarations and calculations to free-form equivalents.
3. Keep first line as `**free`.
4. Replace op-codes with free-form built-ins/procedural equivalents.
5. Retain comments that carry business meaning; remove dead noise.
6. Introduce explicit error paths where fixed-form code relied on implicit status handling.

If the user does **not** ask for modernization:

- Do not convert existing fixed-form source to free-form.
- Apply minimal, targeted edits only.
- Keep new inserted lines Shift-6 aligned to match fixed-form member standards.

## Validation checklist

- [ ] First non-empty line is `**free`
- [ ] No `/free` or `/end-free`
- [ ] No fixed-form specs
- [ ] `ctl-opt` present for programs/modules
- [ ] Every statement ends with `;`
- [ ] `dcl-ds ... likeds(...)` declarations do not redundantly specify `qualified`
- [ ] No local/private same-member `dcl-pr` exists for a matching local `dcl-proc`
- [ ] Every `dcl-proc` contains a `dcl-pi` block
- [ ] Every free-form `dcl-proc` contains an explicit `on-exit;` section
- [ ] Every `dcl-proc` has a short header synopsis comment block immediately above it
- [ ] RPGLE comment lines are 100 columns or fewer; long synopsis text is wrapped
- [ ] Generated RPGLE/SQLRPGLE/RPGLEINC text and value lines are 100 columns or
      fewer; spill-over continues on the next source line without changing value
- [ ] If `ctl-opt main(...)` is present, a matching `dcl-proc` entry-point exists
- [ ] Optional/omittable parameter checks use `%passed/%omitted` (not `%parms/%parmnum/%addr`)
- [ ] No raw numeric indicator usage (`*inNN` / `*in(NN)`); indicator usage is named and descriptive
- [ ] No always-true sentinel loop pattern (`Dow ('1' = '1');`); unbounded loop shape uses `dow (not %shtdn ) ;`
- [ ] SQL blocks (if any) compile in free-form SQLRPGLE style
- [ ] SQL state handling includes success (`00000`) and no-data (`02000`) behavior
- [ ] No secrets/environment-specific literals are embedded
- [ ] Service program/module outputs use `ctl-opt nomain` for implementation modules
- [ ] Exported procedures are explicitly marked (`export`) and match shared prototypes
- [ ] Binder source/signature plan is defined for service-program requests

Legacy-fixed checklist (when applicable):

- [ ] Existing fixed-form code remains fixed-form (no unsolicited conversion)
- [ ] New inserted lines in fixed-form members follow Shift-6 placement
- [ ] Existing spacing is preserved unless a formatting change was explicitly requested
- [ ] Existing behavior/flow is unchanged except requested fix

## Optional local validator

Use `scripts/validate-rpgle-free.py` to enforce the hard rules on generated output:

- first non-empty line must be `**free`
- `/free` and `/end-free` are blocked
- legacy fixed-format style lines are flagged
- free-form declaration/control statements are checked for `;`
- every `dcl-proc` must include a `dcl-pi` block
- every free-form `dcl-proc` must include an explicit `on-exit;` section
- every `dcl-proc` must have an immediate procedure header synopsis block:
  `// <Procedure: name>` ... `// </Procedure: name>`
- RPG `//` comment lines must not exceed 100 columns (long comments must wrap)
- `ctl-opt main(<name>)` must have a matching `dcl-proc <name>` entry-point
- raw numeric indicators (`*inNN` and `*in(NN)`) are blocked; use named indicators

Example usage:

```bash
python .agents/skills/codegen-rpgle/scripts/validate-rpgle-free.py QRPGLESRC/mynewprog.rpgle
```

Run full local regression checks (validator + generator render path):

```bash
python .agents/skills/codegen-rpgle/scripts/run-rpgle-regression-checks.py
```

## Optional local generator

Use `scripts/generate-rpgle-member.py` to scaffold a new member from the strict templates:

```bash
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type rpgle --name TPLDEMO --out QRPGLESRC/tpldemo.rpgle
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type sqlrpgle --name TPLSQL01 --out QRPGLESRC/tplsql01.sqlrpgle
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type rpgleinc --name TPLCONST --out qrpglesrc/tplconst.rpgleinc
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type srvpgm-module --name TPLUTIL --out QRPGLESRC/tplutil.rpgle
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type service-api --name TPLUTIL --out qrpglesrc/tplutilapi.rpgleinc --proc normalizeName
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type srvpgm-consumer --name TPLCALLER --out QRPGLESRC/tplcaller.rpgle --proc normalizeName
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type binder --name TPLUTIL --out QSRVSRC/tplutil.bnd
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type srvpgm-build --name TPLUTIL --out QCLLESRC/tplutil_build.clle --library MYLIB --bnddir TPLBNDDIR
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type srvpgm-bundle --name TPLUTIL --out .agents/skills/codegen-rpgle/samples/tplutil_bundle --proc normalizeName --library MYLIB --bnddir TPLBNDDIR
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type srvpgm-module --name TPLUTIL --out QRPGLESRC/tplutil.rpgle --proc normalizeName --strict
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type srvpgm-bundle --name TPLUTIL --out .agents/skills/codegen-rpgle/samples/tplutil_bundle --proc normalizeName --dry-run
python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py --type srvpgm-bundle --name TPLUTIL --out .agents/skills/codegen-rpgle/samples/tplutil_bundle --proc normalizeName --dry-run --json
```

Bundle mode (`srvpgm-bundle`) generates, in one command:

- service module (`*.rpgle`)
- service API include (`qrpglesrc/*.rpgleinc`)
- consumer program (`*.rpgle`)
- binder source (`*.bnd`)
- build recipe (`*_build.clle`)

Bundle mode now prints a preflight artifact plan before writes. If any planned artifact already exists, generation fails with a collision summary unless `--force` is supplied.

Supported types:

- `rpgle`
- `sqlrpgle`
- `rpgleinc`
- `srvpgm-module`
- `srvpgm-consumer`
- `service-api`
- `binder`
- `srvpgm-build`
- `srvpgm-bundle`

The generator enforces `**free` as the first non-empty line for free-format types and normalizes object names for program/module templates. Use `--proc` to keep service module export, service API prototype, consumer call, and binder export symbol aligned.

Optional generator parameters for environment-aware build scaffolding:

- `--library` (default: `*CURLIB`)
- `--bnddir` (default: `TPLBNDDIR`)
- `--strict` (default: off)
- `--dry-run` (default: off)
- `--json` (default: off)

When `--strict` is enabled, the generator fails if values would be auto-normalized (character stripping, uppercasing, or truncation). This is useful in CI to prevent accidental member/symbol drift.

Strict-mode procedure name rule:

- must start with a letter
- must use camelCase (`lowerCamelCase`)
- may contain only letters and digits
- maximum length: 128 characters

Strict-mode parameter name rule:

- must start with `p_`
- suffix must use lowerCamelCase (pattern: `p_[a-z][A-Za-z0-9]*`)
- may contain only letters, digits, and the single required underscore after `p`

Dry-run behavior:

- no files are written
- normalized values are printed (`name`, `proc`, `library`, `bnddir`)
- for `srvpgm-bundle`, the full artifact plan and collision status are printed
- exit status is non-zero when collisions would block generation without `--force`

JSON behavior:

- output is a single JSON object for easier CI parsing
- includes normalized values plus mode-specific fields (`output`, `outputDir`, `artifacts`, `plan`, `collisions`)
- compatible with `--dry-run` and normal generation

For `srvpgm-build` / `srvpgm-bundle`, `--library *LIBL` is intentionally rejected because qualified object creation commands in the generated CLLE require an explicit library qualifier (`*CURLIB` or a concrete library such as `MYLIB`).


@AGENTS.md
