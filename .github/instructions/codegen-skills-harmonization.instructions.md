# IBM i Codegen Skills Harmonization Analysis

**Date:** 2026-08-24
**Status:** Historical analysis; partially implemented and superseded in key areas

## Update — 2026-08-28

This document began as a gap analysis. Several high-priority recommendations
have since been implemented, so treat older "current state" statements below as
historical unless they are explicitly reconfirmed.

## Update — 2026-08-29

**Comprehensive Commenting Guidance Unified & Augmented:**
- New canonical file: `.github/instructions/enterprise-grade-commenting.instructions.md`
  - Consolidates all commenting principles, business rules, error handling, performance decisions
  - Adds procedure/function documentation patterns for all languages
  - Adds metadata header examples for RPGLE, COBOL, CL, SQL, DDS, UIM
  - Resolves duplicates and contradictions in scattered guidance
  - Clarifies ambiguities; fixes defects in existing guidance
  - Defines "Comment WHY not WHAT" principle across all skills
- `ibmi-comment-formats.instructions.md` refactored to concise format reference
  - Now points to comprehensive guide for business/documentation guidance
  - Preserves language-native format rules (this expertise stays here)

### Now implemented

- **Canonical Enterprise-Grade Commenting:** `.github/instructions/enterprise-grade-commenting.instructions.md`
- Canonical JSP guidance: `.github/instructions/ibmi-jsp-scaffold.instructions.md`
- Canonical audit columns: `.github/instructions/ibmi-audit-columns.instructions.md`
- Canonical 5250 routing: `.github/instructions/ibmi-dspf-routing.instructions.md`
- Canonical comment formats (format-only reference):
  `.github/instructions/ibmi-comment-formats.instructions.md`
- Canonical IBM i indentation and spacing preservation:
  `.github/instructions/ibmi-comment-formats.instructions.md`
- Canonical service program guidance:
  `.github/instructions/ibmi-service-programs.instructions.md`
- Canonical modernization strategy:
  `.github/instructions/modernizing-ibmi-applications.instructions.md`

### Current operating model

- Canonical instruction files own shared cross-skill standards.
- Individual codegen skills own artifact-specific syntax, templates, examples,
  and validator behavior.
- Existing-member indentation and spacing are preserved by default; formatting
  canon does not authorize whitespace-only churn.
- `.github/copilot-instructions.md` points to the modernization instruction for
  strategic IBM i modernization guidance.
- Active IBM i codegen skills now cross-reference the modernization instruction
  so strategy and artifact rules stay separated.

### Remaining value of this file

Use this file as:

- historical rationale for why canonical instruction files were introduced
- a backlog of harmonization ideas that may still be incomplete
- a reminder to verify old findings before acting on them

## Executive Summary

Analyzed 8 IBM i code generation skills:
- codegen-rpgle, codegen-rpgle-subfile
- codegen-clle, codegen-cblle
- codegen-dds, codegen-dspf
- codegen-sql, codegen-uim

**Findings:**
- Significant duplication of guidance (especially JSP, audit columns, core principles)
- Inconsistent metadata header formatting across source types
- Different terminology for the same concept (Hard rules, Non-negotiable rules, validation gates)
- Comment format rules properly differentiated by source type (good)
- Audit columns duplicated identically in 2+ locations
- 5250 routing guidance spread across multiple skills with slight variations

---

## 1. DUPLICATED CONTENT (High Priority for De-duplication)

### 1.1 Jackson Structured Programming (JSP) Scaffold

**Current State:**
- Appears in: codegen-rpgle, codegen-cblle, codegen-sql, codegen-uim
- Slight variations in wording but identical core concept
- Each skill describes: Initialize → Input → Process → Output

**Problem:**
- 4 separate implementations of the same pattern
- Minor wording differences create false distinctions
- When one needs updating, 3 others may be missed

**Recommendation:**
- Create ONE canonical JSP section in `.github/instructions/ibmi-jsp-scaffold.instructions.md`
- All skills reference it with skill-specific JSP application examples
- Keep skill-specific JSP clarifications (e.g., "for RPGLEINC, this is not applicable")

---

### 1.2 Audit Columns (Standard/Temporal Table Columns)

**Current State:**
- Appears identically in: codegen-cblle (sec 4.2), codegen-sql (hard rule #3), codegen-rpgle (line 256+)
- Same list of 9 columns with same formatting:
  ```
  RecordStatus for rcdsts char(1) not null default 'A'
  beginning_time for begtim timestamp(12) not null generated ALWAYS as row begin
  ending_time for endtim timestamp(12) not null generated ALWAYS as row end
  transaction_start for trxstr timestamp(12) not null generated ALWAYS as transaction start ID
  period system_time (beginning_time, ending_time)
  aud_user for audusr varchar(18) generated ALWAYS as (user)
  aud_change for audchg char(1) generated ALWAYS as (data CHANGE OPERATION)
  aud_jobname for audjob varchar(28) generated ALWAYS as (qsys2.job_name)
  aud_pgm for audpgm varchar(255) allocate (20) generated ALWAYS as (current client_programid)
  ```

**Problem:**
- If a column definition changes, must update 3+ places
- Risk of partial updates creating inconsistency
- Duplicated guidance increases maintenance burden

**Recommendation:**
- Create ONE canonical audit column reference: `.github/instructions/ibmi-audit-columns.instructions.md`
- Skills reference it with link: `See audit columns guide for CREATE TABLE patterns`
- Keep only the rule ("add only missing ones, never duplicate") in skill files

---

### 1.3 Core Principles (Caveman, Lindy, Ponytail)

**Current State:**
- Appears in: codegen-rpgle, codegen-clle, codegen-cblle, codegen-sql, codegen-uim
- Same 3 principles with skill-specific examples
- Good: examples are skill-specific
- Bad: principle definitions are repeated

**Problem:**
- Same principle definitions across all skills (wasteful)
- Skill examples are good but nested with redundant definitions

**Recommendation:**
- Core principles already documented in global `copilot-instructions.md`
- Skills should reference global definitions
- Keep only skill-specific application examples in each skill

---

### 1.4 5250 Screen-Generation Routing

**Current State:**
- Appears in: codegen-clle, codegen-cblle, codegen-rpgle, codegen-sql, codegen-uim
- Each has slight variations in wording
- Core message: "Don't generate DSPF here, use codegen-dspf"

**Problem:**
- Duplicated with variations instead of single authoritative statement
- Inconsistent emphasis (some detailed, some brief)
- codegen-dspf has the authoritative spec, but other skills repeat it

**Recommendation:**
- Consolidate into ONE canonical routing spec
- Create: `.github/instructions/ibmi-dspf-routing.instructions.md`
- Skills reference it: "For 5250 screen concerns, see DSPF routing guide"
- Preserve any skill-specific exceptions in each skill (e.g., codegen-rpgle exception for logic over presentation)

---

## 2. INCONSISTENT TERMINOLOGY & NAMING

### 2.1 Validation Gates/Hard Rules

**Current State:**
- codegen-clle: "Hard rules (non-negotiable)" — 6 rules
- codegen-cblle: "Non-negotiable rules" — ~8 rules
- codegen-dds: "Hard rules (non-negotiable)" — 5 rules
- codegen-dspf: "Canonical DDS rules" + "Field alias policy" + "Display-attribute contract"
- codegen-sql: "Hard rules (non-negotiable)" — 8 rules
- codegen-rpgle: "Hard rules (non-negotiable)" — 14 hard rules + "Quality gate" checklist
- codegen-uim: "Hard rules (non-negotiable)" — 5 rules

**Problem:**
- Same concept called different things ("Hard rules", "Non-negotiable rules", "Canonical rules")
- Inconsistent structure (some use numbered lists, some structured sections)
- No consistent grouping of validation stages

**Recommendation:**
- Standardize naming: Use "Hard Rules" + "Quality Gate Checklist" across ALL skills
- Hard Rules = enforce-before-returning requirements (non-negotiable)
- Quality Gate Checklist = before-delivery validation steps

---

### 2.2 Metadata Section Naming

**Current State:**
- codegen-rpgle: `## Metadata header format (RPGLE/SQLRPGLE/RPGLEINC)`
- codegen-cblle: `## File header format (all artifacts)`
- codegen-sql: `## Metadata header format (SQL)`

**Problem:**
- Inconsistent naming ("Metadata header format" vs "File header format")
- Makes cross-skill navigation harder
- Inconsistent placement in document

**Recommendation:**
- Standardize to: `## Metadata Header Format`
- Place immediately before template section
- Include code example for the specific source type

---

## 3. MISSING OR INCOMPLETE HEADER EXAMPLES

### 3.1 Skills Without Full Header Examples

- **codegen-clle**: Has metadata/revision history guidance but no code example showing full CL comment format
- **codegen-dds**: No header section (DDS is not typically headed, but should clarify this)
- **codegen-dspf**: No header section (same as DDS — clarify intention)
- **codegen-uim**: No header section (UIM is structured differently, should clarify)

**Problem:**
- Developers must infer correct comment format from general guidance
- Risk of inconsistent or incorrect headers

**Recommendation:**
- Add complete header examples for ALL skills with comments:
  - codegen-clle: Show full CL comment format (6 leading spaces + `/*` or `*>` style)
  - codegen-dds/dspf: Document that DDS files typically have NO header (only `A` spec lines), explain why
  - codegen-uim: Document UIM structure doesn't use traditional headers, note where metadata belongs (if at all)

---

## 4. COMMENT FORMAT ALIGNMENT

### Current State (Good)

Each skill correctly uses language-native comment format:

| Skill | Source Type | Comment Format | Context |
|-------|-------------|-----------------|---------|
| codegen-rpgle | RPGLE/SQLRPGLE | `//` | Free-form only |
| codegen-cblle | COBOL | `*>` | Column 7 (6 leading spaces) |
| codegen-clle | CL | `/*` `*/` or `*>` | CL native format |
| codegen-sql | SQL | `--` | SQL standard |
| codegen-dds | DDS | `A*` or `*` | Fixed 80-column model |
| codegen-dspf | DDS | `A*` or `*` | Fixed 80-column model |
| codegen-uim | UIM | XML-style comments | `.im` directives |

**Recommendation:**
- Status: CORRECT — Do not change
- Document this explicitly in a unified reference guide
- Add to `.github/instructions/ibmi-comment-formats.instructions.md`

---

## 5. METADATA SECTION STRUCTURE HARMONIZATION

### Proposed Standard Structure (for all languages)

1. **Metadata block** (first, before any code)
   - Source Name
   - Created By
   - Date Created
   - Source Description
   - Jira (ticket or N/A)

2. **Synopsis** (explains purpose and usage)

3. **Revision History** (markdown table format)

4. **Executable code / Declarations** (language-specific)

### Language-Specific Comment Formats

**RPGLE/SQLRPGLE/RPGLEINC:**
```rpgle
**free
// <Metadata>
// Source Name .........: MYPROGRAM
// Created By ...........: Your Name
// Date Created .........: YYYY-MM-DD
// Source Description ..: Single-line summary.
// Jira ..................: LSPS-XXXX (or N/A)
// </Metadata>
//
// <Synopsis>
// Details here.
// </Synopsis>
//
// <Revision History>
// Revisioner | Date | Jira No | Change |
// </Revision History>
```

**COBOL (CBLLE/SQLCBLLE):**
```cobol
      *> <Metadata>
      *> Source Name .........: MYPGM
      *> Created By ...........: Your Name
      *> Date Created .........: YYYY-MM-DD
      *> Source Description ..: Single-line summary.
      *> Jira ..................: LSPS-XXXX (or N/A)
      *> </Metadata>
      *>
      *> <Synopsis>
      *> Details here.
      *> </Synopsis>
      *>
      *> <Revision History>
      *> Revisioner | Date | Jira No | Change |
      *> </Revision History>

       IDENTIFICATION DIVISION.
```

**SQL (SQLTABL, SQLPRC, SQLTRG, SQLVIEW, SQLINDEX):**
```sql
-- <Metadata>
-- Source Name .........: DDGMTRRUL
-- Created By ...........: Your Name
-- Date Created .........: YYYY-MM-DD
-- Source Description ..: Single-line summary.
-- Jira ..................: LSPS-XXXX (or N/A)
-- </Metadata>
--
-- <Synopsis>
-- Details here.
-- </Synopsis>
--
-- <Revision History>
-- Revisioner | Date | Jira No | Change |
-- </Revision History>

SET CURRENT SCHEMA = 'DEVGRPPRF';
stop;
```

**CL (CLLE/CLP/CL):**
```cl
      /* <Metadata> */
      /* Source Name .........: MYCL01 */
      /* Created By ...........: Your Name */
      /* Date Created .........: YYYY-MM-DD */
      /* Source Description ..: Single-line summary. */
      /* Jira ..................: LSPS-XXXX (or N/A) */
      /* </Metadata> */
      /*  */
      /* <Synopsis> */
      /* Details here. */
      /* </Synopsis> */
      /*  */
      /* <Revision History> */
      /* Revisioner | Date | Jira No | Change */
      /* </Revision History> */

      PGM
```

**DDS (PF/LF/DSPF/PRTF):**
- No metadata header (source starts with spec lines)
- **Why**: DDS fixed 80-column format doesn't accommodate typical headers
- **Alternative**: Use first `A*` comment lines to describe purpose
- Example:
  ```dds
  A*
  A* FILE: DDGMTRRUL
  A* PURPOSE: Metric Rules Master File
  A* CREATED: YYYY-MM-DD
  A*
       A                                      UNIQUE
  ```

**UIM (PNLGRP/MENU):**
- No traditional metadata header
- UIM structure is XML-like (`:pnlgrp.`, `:menu`, etc.)
- **Where to document**: First panel's `:help` section or as `:var` / `:cond` block at top
- Example:
  ```uim
  :pnlgrp.
  :keyl name='fkeys'.
    :keyi key='F1' help='menu/help'.
    :keyi key='F3' help='menu/exit'.
  :ekeyl.

  :panel name='main' keyl='fkeys'.
  ```

---

## 6. CONTRADICTIONS FOUND

### 6.1 Revision History Placement

**codegen-rpgle:**
- Says: "Place revision history after file-level comments but before first executable code/definition"
- Implies: Can go between metadata and first dcl-c / dcl-s

**codegen-cblle:**
- Says: "Sections in order: Metadata → Synopsis → Revision History → IDENTIFICATION DIVISION"
- Clear: Revision History goes after Synopsis, before IDENTIFICATION DIVISION

**codegen-sql:**
- Says: "Place after metadata and synopsis but before first SQL statement"
- Clear: Consistent with COBOL

**Resolution:**
- All should follow this order: Metadata → Synopsis → Revision History → Executable
- Apply universally across all skills
- Currently codegen-rpgle is slightly ambiguous; clarify it

---

### 6.2 Audit Column Placement in DDL

**codegen-sql:**
- Says: "at the end of the business-column list"
- Implies: Business columns first, then audit columns

**codegen-cblle:**
- Shows example but doesn't specify placement explicitly

**codegen-rpgle:**
- Says: "below exactly once"
- Doesn't specify where in the column list

**Recommendation:**
- Standardize: "Audit columns always come AFTER business columns, before any PRIMARY KEY or constraints"
- Document with example showing correct placement

---

## 7. CLARIFICATIONS NEEDED

### 7.1 DDS Special Case (No Headers)

**Current State:**
- codegen-dds, codegen-dspf have no header format section
- Might be unclear to new developers why

**Recommendation:**
- Add explicit section: "Why DDS has no metadata headers"
- Explain: "DDS uses fixed 80-column format; traditional headers don't fit"
- Recommend: "Use first `A*` comment lines to document"

---

### 7.2 JSP Application Scope

**Current State:**
- codegen-rpgle: JSP applies to all procedures
- codegen-cblle: JSP applies with copybook exception
- codegen-sql: JSP applies to procedures but clarifies cursor/iteration
- codegen-uim: JSP applies to panel flows

**Problem:**
- Unclear which parts of a file follow JSP (full file? procedures? statements?)
- Scope varies by artifact type

**Recommendation:**
- Clarify in JSP section for each skill:
  - **RPGLE**: "Apply to EVERY dcl-proc; entry proc + internal procedures"
  - **COBOL**: "Apply to EVERY section/paragraph"
  - **SQL**: "Apply to procedures; SELECT + cursors use iteration"
  - **CL**: "Apply to entire program flow"
  - **UIM**: "Apply to menu/panel routing logic"

---

### 7.3 Service Program / Module-Specific Rules

**Current State:**
- codegen-rpgle has extensive service-program section (not duplicated elsewhere)
- Other skills don't document service-program/module patterns

**Problem:**
- COBOL/CL may also create service programs/modules
- No equivalent guidance in those skills

**Recommendation:**
- Add generic service-program guidance to instruction file
- Each skill (rpgle, cblle, clle) references it with language-specific examples
- Reference file: `.github/instructions/ibmi-service-programs.instructions.md`

---

## IMPLEMENTATION ROADMAP

### Phase 1: Create Canonical Reference Files (New Instructions)
1. `.github/instructions/ibmi-jsx-scaffold.instructions.md` — JSP pattern
2. `.github/instructions/ibmi-audit-columns.instructions.md` — Audit column definitions
3. `.github/instructions/ibmi-dspf-routing.instructions.md` — 5250/DSPF delegation
4. `.github/instructions/ibmi-comment-formats.instructions.md` — Language comment styles
5. `.github/instructions/ibmi-service-programs.instructions.md` — Service program patterns

### Phase 2: Normalize Skill Files
1. Replace duplicated JSP sections with reference + skill-specific clarification
2. Replace duplicated audit column lists with reference
3. Replace duplicated 5250 routing with reference + skill-specific exceptions
4. Standardize "Hard Rules" + "Quality Gate Checklist" terminology
5. Add missing metadata header examples (CL, clarify DDS/UIM)
6. Standardize metadata section placement and naming

### Phase 3: Validation & Testing
1. Run all existing codegen validators to ensure no regression
2. Regenerate samples with updated skills
3. Verify headers match new standards across all samples

---

## DETAILED RECOMMENDATIONS BY SKILL

| Skill | Action | Priority |
|-------|--------|----------|
| codegen-rpgle | Add explicit metadata example for RPGLEINC; clarify revision history placement | High |
| codegen-cblle | Add DDS header clarification; align with new audit column reference | High |
| codegen-clle | Add CL comment format example; add hard rules section structure | Medium |
| codegen-dds | Add "No Headers" clarification; add DDS comment style documentation | Medium |
| codegen-dspf | Add "No Headers" clarification; clarify scope boundary w/ codegen-dds | Medium |
| codegen-sql | Audit columns already good; consider brief reference link | Low |
| codegen-uim | Add "UIM structure" clarification section | Low |
| codegen-rpgle-subfile | Verify alignment with parent codegen-rpgle | Low |

---

## SUCCESS CRITERIA

- [ ] All 8 skills reference canonical JSP guidance
- [ ] Audit columns defined in ONE place; all skills reference it
- [ ] 5250 routing guidance consolidated; all skills reference it
- [ ] Consistent "Hard Rules" + "Quality Gate" structure across all skills
- [ ] All metadata headers have concrete code examples
- [ ] DDS/UIM header approaches are explicitly documented
- [ ] All comment format rules consolidated
- [ ] No duplicate definitions of the same concept across skills
- [ ] All existing codegen samples validate without error
- [ ] New sample generations follow updated standards
