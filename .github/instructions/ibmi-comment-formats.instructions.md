---
applyTo: .agents/skills/codegen-*
description: Quick format reference for IBM i comments. For comprehensive commenting guidance (business rules, procedures, error handling, documentation), see enterprise-grade-commenting.instructions.md.
---

# IBM i Comment Formats — Quick Reference

**Format Reference Only** — This file documents comment syntax by language.

**For comprehensive commenting principles, procedures, metadata headers, business rules, and error handling documentation**, see:
→ `.github/instructions/enterprise-grade-commenting.instructions.md`

**All IBM i code generation skills** use these native comment formats and native formatting-preservation rules. Never mix formats; match the language of the source file.

## Native indentation and spacing preservation

Apply formatting in this precedence order:

1. **Existing source indentation and spacing** when editing an existing member
2. **Native fixed-form or free-form rules** of the source type
3. **Repository templates and validators** for new members
4. **Editor/workspace defaults** only when they do not conflict with the above

Rules:

- If the source already has indentation, preserve it. Do not reindent unless
  the developer explicitly asks for it.
- If the source already has spacing, preserve it. Do not re-space, realign, or
  normalize whitespace unless the developer explicitly asks for it.
- Do not perform whitespace-only churn while making a targeted source change.
- For fixed-format source (COBOL, DDS, DSPF, PRTF, and legacy fixed-form RPG),
  preserve column-sensitive positioning exactly.
- For free-form source (free-form RPGLE, CL, SQL, and UIM structured markup),
  match the local block depth and nearby spacing already used by the member.
- For new members, use the native language layout shown by repo templates and
  validator-compliant examples; do not invent decorative alignment.

## By Source Type

### RPGLE / SQLRPGLE / RPGLEINC
**Format:** `//` line comment (free-form only)
**Context:** Free-form RPG uses `//` exclusively

```rpgle
**free
// Single-line comment
// <Metadata>
// Source Name .........: MYPROGRAM
// </Metadata>
//
dcl-s variable varchar(100);
// Inline comment after declaration
```

**Rules:**
- `//` at start of line or after code
- Free-form RPG has no compiler column restriction; follow the repository
  100-column formatting rules below.
- Use for all comments: metadata, inline, explanations
- `//` in first column or indented to match block depth
- Preserve existing free-form indentation and operator/keyword spacing when
  editing; do not reflow unrelated code.

**Text and Value Line Width:**
- Keep generated RPGLE/SQLRPGLE/RPGLEINC lines containing text or values within 100
  columns, counting indentation and syntax.
- If text or a value would extend past column 100, put the spill-over on the next
  source line at a safe boundary.
- Split a long text literal with RPG-valid concatenation or continuation syntax;
  preserve the resulting value.
- This rule applies to new or changed source only; preserve unrelated existing
  formatting.

**Procedure Header Rule (RPGLE/SQLRPGLE only):**
- Add a short header comment block immediately above every `dcl-proc`
- Include procedure name and a concise synopsis of behavior
- Use native RPG comment style (`//`) only
- Keep each comment line to **100 columns or fewer**
- If a synopsis/comment exceeds 100 characters, wrap to the next `//` line
  at a word boundary

```rpgle
// <Procedure: buildResponse>
// Returns response text for the caller using the provided input value.
// </Procedure: buildResponse>
dcl-proc buildResponse;
```

---

### COBOL (CBLLE/SQLCBLLE/CPY)
**Format:** `*>` comment (or `*` in column 7 for legacy)
**Context:** COBOL fixed-format; column-sensitive

```cobol
      *> <Metadata>
      *> Source Name .........: MYPGM
      *> </Metadata>

       IDENTIFICATION DIVISION.
       PROGRAM-ID. MYPGM.
       *> Inline comment in procedure division
```

**Rules:**
- `*>` comment (preferred, ILE syntax)
- Must start in **column 7** (exactly 6 leading spaces before `*>`)
- Also valid: `*` in column 7 (legacy style); preserve when editing existing code
- Use `*>` for new generation to stay consistent with modern COBOL
- Preserve established Area A / Area B indentation and existing PIC/value
  spacing when editing legacy members.

---

### CL (CLLE/CLP/CL)
**Format:** `/*  */` block comment or `*>` line comment
**Context:** CL uses both styles; block-comment preferred

```cl
      /* <Metadata> */
      /* Source Name .........: MYCL01 */
      /* Created By ...........: Your Name */
      /* </Metadata> */

      PGM

      /* Single-line block comment */
      DCL VAR(&VAR) TYPE(*CHAR) LEN(10)

      /* Multi-line block comment
         can span multiple lines
         and is easy to read */

      ENDPGM
```

**Rules:**
- `/* ... */` for block comments (can span multiple lines)
- `*>` line comments also valid (modern CL)
- CL comments are not column-sensitive
- For headers/metadata: use `/* ... */` format
- For inline notes: either `/* */` or `*>` acceptable
- Preserve existing command indentation and spacing in edited members; do not
  realign `DCL`, `MONMSG`, or command parameters unless explicitly requested.

---

### SQL (SQL/SQLTABL/SQLVIEW/SQLPRC/SQLTRG/SQLINDEX)
**Format:** `--` line comment (SQL standard)
**Context:** SQL uses `--` for line comments

```sql
-- <Metadata>
-- Source Name .........: DDGMTRRUL
-- Created By ...........: Your Name
-- Date Created .........: YYYY-MM-DD
-- </Metadata>
--
-- <Synopsis>
-- Procedure for metric rules API access.
-- </Synopsis>

SET CURRENT SCHEMA = 'DEVGRPPRF';
stop;

-- Single-line comment before statement
CREATE OR REPLACE PROCEDURE PROC_NAME (...)
  -- Inline comment in procedure
  LANGUAGE SQL
  BEGIN
    -- Comments inside SQL blocks
    SELECT * FROM TABLE;
  END;
stop;
```

**Rules:**
- `--` at any column position (SQL standard)
- Extends to end of line (no closing delimiter)
- Use for all SQL comments
- Valid inside SQL blocks and procedure bodies
- Preserve existing clause indentation and local spacing in edited SQL members;
  do not realign column lists or keyword blocks unless explicitly requested.

---

### DDS (PF/LF/DSPF/PRTF)
**Format:** `A*` comment (fixed 80-column model)
**Context:** DDS uses fixed format; column 1 = `A`, column 2 = `*`

```dds
A* <Metadata>
A* Source Name .........: DDGMTRRUL
A* Created By ...........: Your Name
A* Date Created .........: YYYY-MM-DD
A* Source Description ..: Metric rules master file.
A* Jira ..................: LSPS-XXXX (or N/A)
A* </Metadata>
A*
A* <Synopsis>
A* Customer/metric data storage with keyed access and repo-standard DDS comments.
A* </Synopsis>
A*
A* <Revision History>
A* Revisioner | Date | Jira No (if known) | Change |
A* Your Name | YYYY-MM-DD | LSPS-XXXX | Initial scaffold |
A* </Revision History>
A                                      UNIQUE
A          R DDRULREC
A            UIDDDGMTR     10P 0
A            MTRNAM        50A
A*
A* This is a comment explaining the field
A            TABREQ         1A
```

**Rules:**
- `A` in column 1 (required for DDS spec lines)
- `*` in column 2 (creates comment line)
- Comment starts in column 3+
- Use an opening structured metadata block when generating new DDS in this repo:
  Metadata → Synopsis → Revision History → first DDS spec/record lines
- DDS still does **not** use a free-form prose header outside spec/comment lines;
  the opening `A*` block is the header mechanism
- **Preserve existing comment style** when editing legacy DDS
- Preserve existing fixed-column spacing and token placement exactly; do not
  re-space record, field, keyword, or coordinate lines unless explicitly requested.

**Alternative:** Some legacy DDS uses `*` in column 6, 7, or 1 without `A`. Preserve existing style.

---

### UIM (PNLGRP/MENU)
**Format:** structured markup comments, typically `:comment.` blocks
**Context:** UIM uses structured markup; do not force traditional line-comment syntax

```uim
:pnlgrp.
:comment.
  <Metadata>
  Source Name .........: TPLMENU
  Created By ...........: Your Name
  Date Created .........: YYYY-MM-DD
  Source Description ..: Sample UIM menu.
  Jira ..................: LSPS-XXXX (or N/A)
  </Metadata>
.
:comment.
  <Synopsis>
  Main menu for add/update/delete/inquire operations.
  </Synopsis>
.
:comment.
  <Revision History>
  Revisioner | Date | Jira No (if known) | Change |
  Your Name | YYYY-MM-DD | LSPS-XXXX | Initial scaffold |
  </Revision History>
.
:keyl name='fkeys'.
  :keyi key='F1' help='menu/help'.
:ekeyl.

:panel name='main' keyl='fkeys'.
  :help name='menu/main'.Help for main menu.:ehelp.
:epanel.

:epnlgrp.
```

**Rules:**
- Preferred new-generation pattern in this repo: opening `:comment.` blocks for
  Metadata → Synopsis → Revision History inside the first `:pnlgrp.` block
- Preserve established local UIM style when editing existing members (`:comment.`,
  `:help`, `:var`, or equivalent structured markup)
- UIM does **not** use conventional line comments like RPG/CL/SQL; keep metadata
  inside valid UIM markup structures
- `:help`-based metadata is still acceptable for legacy members when that is the
  established local convention
- Preserve existing tag indentation and attribute spacing in edited UIM members;
  do not reflow attributes solely for appearance.

---

## Standard Header Placement (All Languages)

Metadata headers use language-native comment format and appear in this order:

1. **Metadata block** (source name, creator, date, description, Jira)
2. **Synopsis** (purpose, behavior, key entry points)
3. **Revision History** (change log in markdown table format)
4. **First executable code/definition**

Each skill file shows the exact header template with comment format. See skill-specific documentation for complete examples.

---

## Editing Existing Code

**Preserve existing comment format:**
- If file uses `//` comments, continue with `//` for new additions
- If file uses `/* */` comments, continue with `/* */` for new additions
- Do not reformat entire file's comments unless user explicitly asks for modernization
- Do not reindent or re-space an existing member unless the developer explicitly
  asks for formatting changes
- Mix formats only when unavoidable (e.g., preserving legacy + adding modern)

**Example:** A fixed-form COBOL file using `*` comments should keep `*` comments in new edits; do not convert to `*>` unless the user requests full modernization.

---

## Summary Table

| Language | Source Type | Comment Format | Column Rules | Context |
|----------|-------------|------------------|--------------|---------|
| RPGLE | `.rpgle`, `.sqlrpgle`, `.rpgleinc` | `//` | Free-form, any column | Free-format only |
| COBOL | `.cblle`, `.sqlcblle`, `.cpy` | `*>` or `*` | Col 7 (fixed format) | ILE/fixed format |
| CL | `.clle`, `.clp`, `.cl` | `/* */` or `*>` | Not column-sensitive | Flexible |
| SQL | `.sql`, `.sqltabl`, `.sqlview`, `.sqlprc`, `.sqltrg`, `.sqlidx` | `--` | Any column | SQL standard |
| DDS | `.pf`, `.lf`, `.dspf`, `.prtf` | `A*` | Col 1-2 (fixed format) | Opening structured metadata block in DDS comments |
| UIM | `.pnlgrp`, `.menu` | `:comment.` / structured markup | Structured markup | Opening metadata inside first `:pnlgrp.` |

---

**Version:** 1.0
**Last Updated:** 2026-08-24
**Usage:** Reference in skill files instead of repeating comment format rules
