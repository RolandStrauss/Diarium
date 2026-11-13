---
applyTo: .agents/skills/codegen-rpgle, .agents/skills/codegen-cblle, .agents/skills/codegen-clle, .agents/skills/codegen-sql, .agents/skills/codegen-uim
description: Authoritative 5250 DSPF/PRTF delegation rules. When to route screen-generation requests to codegen-dspf instead of handling in other skills.
---

# IBM i 5250 Screen Generation — DSPF/PRTF Routing

**Authoritative Routing Rule** — When any request includes IBM i 5250 screen concerns, delegate presentation-file generation to `codegen-dspf` skill. This skill owns the canonical contracts for display and printer file generation.

## Trigger Phrases (Hand Off to codegen-dspf)

Route to `codegen-dspf` when user request includes **any** of:

- **Display file concerns:**
  - `DSPF`, `PRTF`, `5250`, `5250 screen`, `display file`, `printer file`
  - `screen layout`, `screen field`, `screen coordinate`
  - `display format`, `record format`
  - `ALIAS(...)`, `DSPATR(...)`, display attribute
  - `<FIELD>A` (attribute field naming pattern)
  - `popup`, `window`, `push`, `pull`, `pull-down menu`

- **Presentation attribute concerns:**
  - `color`, `highlight`, `underline`, `blink`, `reverse`
  - `input capable`, `output only`, `hidden`, `program only` (usage indicators)
  - `position`, `coordinates`, `row/column`, `27x132`, `24x80`

- **Interactive screen logic:**
  - `function key`, `Enter key`, `attention key`
  - `subfile`, `SFL`, `SFLCTL`, `READC`, `interactive`
  - `screen processing`, `prompt`, `detail window`

## Keep in Other Skills

These remain in the originating skill and **do not** trigger DSPF routing:

- **Business logic** — calculations, data validation, transformations (keep in RPGLE/COBOL/CL/SQL)
- **File I/O** — reading/writing database tables (keep in RPGLE/COBOL/CL/SQL)
- **Integration** — calling other programs, service programs (keep in originating skill)
- **Error handling** — MONMSG/monitor/on-error blocks (keep in originating skill)
- **Variables** — declaring working storage, parameters, data structures (keep in originating skill)

## Formatting preservation

- Routing to `codegen-dspf` does not authorize whitespace cleanup in the
  originating language skill.
- Preserve existing indentation and spacing in both the screen source and the
  business-logic source unless the developer explicitly asks for formatting
  changes.

## Mixed Requests (DSPF + Business Logic)

When a user request includes **both** presentation concerns + business logic:

1. **Generate/refresh DSPF first** via `codegen-dspf`
   - Produces field model with ALIAS names, DSPATR guards, record formats
2. **Generate business logic second** in originating skill
   - Use DSPF field model for variable declarations and display/read loops
   - Map DSPF ALIAS names to RPGLE/COBOL/CL variable names

**Example:**
- **User request:** "Create a display file for a maintenance subfile with 2-digit options and a detail window. Then generate the RPGLE to populate and handle it."
- **Step 1 (codegen-dspf):** Generate `maintenance.dspf` with SFLCTL, option field, popup window record
- **Step 2 (codegen-rpgle):** Generate RPGLE that:
  - Declares variables matching DSPF ALIAS names
  - Calls EXFMT to display SFLCTL
  - Handles READC for subfile option processing
  - Shows/hides popup based on user action

## Skill-Specific Exceptions

### codegen-rpgle
- **Exception:** When documenting screen-field data structures or copybooks, keep copybook generation in codegen-rpgle
- **Reason:** RPGLEINC declaration-only members define DS templates for screen fields; no DSPF generation needed
- **Example:** `dcl-ds screenFields qualified template;` → stays in codegen-rpgle

### codegen-uim
- **Exception:** Menu navigation flow includes popup panels; keep routing in codegen-uim
- **Reason:** UIM `:pnlgrp`, `:panel`, `:menu` structure defines presentation routing; DSPF is separate from UIM
- **Rule:** If user asks for UIM + DSPF details, generate UIM in this skill, delegate DSPF details to codegen-dspf

### codegen-sql
- **Exception:** SQL procedures that generate XML/JSON response structures (no DSPF concern)
- **Reason:** API/web service response is not 5250 screen
- **Clear distinction:** 5250 screens only (route to DSPF); APIs/web services (stay in SQL)

## Canonical Contracts Owned by codegen-dspf

These DSPF/PRTF rules are defined **only** in codegen-dspf skill. Never redefine or contradict them in other skills:

- Field `ALIAS(...)` naming requirements and length constraints
- `DSPATR(...)` display attribute binding rules
- Attribute field (`<FIELDNAME>A`) paired-naming conventions
- Record format layout and field positioning
- `PRINT` keyword usage for PRTF
- Usage indicators (`H` = hidden, `P` = program-only, `O` = output, `B` = both input/output)

**If another skill needs to reference these contracts,** link to the codegen-dspf skill definition; do not duplicate.

## Delegation Procedure

### When Delegating

1. **Identify presentation concerns** in the user request
2. **Tell user:** "I'll generate the display file via the DSPF skill, then build the [RPGLE/COBOL/CL/SQL] logic to use it."
3. **Call `codegen-dspf`** to generate presentation layer
4. **Generate business logic** in current skill using DSPF output as reference
5. **Link them explicitly** in comments/documentation

### Example Message

> "Your request includes a 5250 display file with popup windows and subfile processing. I'll first generate the DSPF using `codegen-dspf`, then create the RPGLE subfile-handling logic that reads from and writes to the display file fields."

---

**Version:** 1.0
**Last Updated:** 2026-08-24
**Authoritative Skill:** codegen-dspf
**Referenced By:** codegen-rpgle, codegen-cblle, codegen-clle, codegen-sql, codegen-uim
