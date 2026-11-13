---
applyTo: .agents/skills/codegen-*
description: Authoritative enterprise-grade inline commenting standards for all IBM i source types. Establishes native comment formats, procedure headers, business rule explanation, error handling documentation, and performance decisions within source code. Distinct from comprehensive program documentation (see enterprise-grade-program-documentation.instructions.md).
---

# Enterprise-Grade Commenting Standards — Unified Authority

**SCOPE:** Inline comments within source code (NOT comprehensive program documentation)

**Canonical Reference** — All IBM i code generation skills use these standards for:
- Native comment format rules by language (RPGLE, COBOL, CL, SQL, DDS)
- Metadata headers and revision history
- Procedure headers (explaining procedure purpose and contract)
- Business rule explanation (WHY logic exists)
- Error handling documentation
- Performance decision documentation
- Preservation of existing source formatting

**Distinct from:**
- **Program-level documentation** (multi-section analysis covering business purpose, technical design, dependencies, modernization opportunities) — see `enterprise-grade-program-documentation.instructions.md` and `codegen-ibmi-program-documentation` skill
- **Markdown documentation** (project docs, architecture guides, user guides) — see `markdown.instructions.md`

**Version:** 2.0 (Unified)
**Last Updated:** 2026-08-29
**Status:** Canonical authority for inline comments

---

## Core Commenting Philosophy

### Principle 1: Comment WHY, Not WHAT

**Bad Example:**
```rpgle
// Increment counter
counter++;

// Check if active
if (status = 'A');
```

**Good Example:**
```rpgle
// Track processed records for progress reporting and final batch summary
counter++;

// Only process records marked as active; expired records are skipped per business rule
if (status = 'A');
```

**Rationale:** Code shows WHAT; comments explain WHY. The WHY includes:
- Business purpose or rule
- Design intent
- Why this choice over alternatives
- Assumptions or constraints

### Principle 2: Document Business Context

Every non-trivial section must explain its business purpose:
- Why validation exists
- Why calculations occur
- Why decisions are made
- What outcome is expected

**Example:**
```rpgle
// Business rule (LSPS-4295): Claims older than 30 days require manager approval.
// If old claims are processed without approval, they bypass compliance checks.
if (days_since_filing > 30);
  // Route to manager queue for sign-off
  chain claim_key to manager_queue;
endif;
```

### Principle 3: Document External Dependencies

Explain all interactions with:
- REST/SOAP APIs
- Services and service programs
- Databases and tables
- Files and member access
- Message queues and data areas
- IBM i objects (libraries, programs, commands)
- Stored procedures and triggers

**Example:**
```sql
-- Retrieves policy data from DB2 table POLMST and returns the latest active version.
-- Called by DDGMTRSH (shell handler) to populate screen display.
-- Depends on commitment control for customer/transaction synchronization.
SELECT
  pol_id,
  pol_status,
  eff_date
FROM POLMST
WHERE pol_id = :policyId
  AND pol_status = 'A'
ORDER BY eff_date DESC
FETCH FIRST 1 ROWS ONLY;
```

### Principle 4: Document Error Handling Strategy

Explain error handling logic, especially when it differs from "fail fast":

**Example:**
```rpgle
// Business requirement: Continue processing to prevent one invalid record
// from halting the entire batch. Invalid records are logged for manual review.
monitor;
  // Process this transaction
  chain customer_key to customer_master;
on-error *all;
  // Log error with context for manual investigation
  call 'DDERRLG' parm(error_msg customer_key transaction_id);
  // Continue to next transaction
  continue;
endmon;
```

### Principle 5: Document Performance Decisions

Explain non-obvious performance optimizations or caching:

**Example:**
```rpgle
// Performance: Cache policy rules in memory during batch processing to prevent
// repeated I/O calls. Each rule lookup requires a DB2 table read;
// caching provides ~5x speedup for 10,000+ record batches.
dcl-s policy_cache likeds(policy_rule_t) dim(1000);

// Populate cache on first invocation
if (cache_initialized = *off);
  exec sql select * into :policy_cache
    from POLRULES where status = 'A';
  cache_initialized = *on;
endif;

// Use cache for all rule lookups in this run
chain rule_key to policy_cache;
```

---

## Native Comment Format Rules (By Language)

Apply formatting rules in this precedence order:

1. **Existing source indentation and spacing** when editing an existing member
2. **Native fixed-form or free-form rules** of the source type
3. **Repository templates and validators** for new members
4. **Editor/workspace defaults** only when they do not conflict with the above

### Preservation Rules

- If source has indentation, preserve it. Do not reindent unless explicitly requested.
- If source has spacing, preserve it. Do not re-space, realign, or normalize unless explicitly requested.
- Do not perform whitespace-only churn while making targeted changes.
- For fixed-format source (COBOL, DDS, DSPF, PRTF, legacy fixed-form RPG), preserve column-sensitive positioning exactly.
- For free-form source (free-form RPGLE, CL, SQL, UIM), match local block depth and nearby spacing already used.
- For new members, use native language layout shown by repo templates; do not invent decorative alignment.

---

## Comment Format Reference by Language

### RPGLE / SQLRPGLE / RPGLEINC

**Format:** `//` line comment (free-form only)

```rpgle
**free
// Single-line comment at line start

dcl-s variable varchar(100);
// Inline comment after declaration (any indentation)

// Multi-line comment
// Spans multiple lines with each line prefixed by //
// Comments can explain complex logic or business rules

// Procedure Header (required for all dcl-proc):
// Returns response text for caller using provided input value.
// See Procedure Documentation section for full pattern.
```

**Rules:**
- `//` at start of line or after code
- No column restrictions (free-form only)
- Use for all comments: metadata, inline, explanations
- `//` at first column or indented to match block depth
- Procedure headers (see Procedure Documentation section below)

**Line Length:** Keep each comment line ≤100 columns; wrap at word boundaries for long explanations.

---

### COBOL (CBLLE / SQLCBLLE / CPY)

**Format:** `*>` (preferred for new generation) or `*` in column 7 (legacy)

```cobol
      *> <Metadata>
      *> Source Name .........: MYPGM
      *> </Metadata>

       IDENTIFICATION DIVISION.
       PROGRAM-ID. MYPGM.

      *> Inline comment in procedure division
      *> Another comment line (column 7 start)

       PROCEDURE DIVISION.
```

**Rules:**
- `*>` (preferred, ILE syntax) or `*` (legacy, column 7)
- Must start in **column 7** exactly (6 leading spaces before `*>` or `*`)
- Use `*>` for new generation to stay consistent with modern COBOL
- Preserve established Area A/Area B indentation when editing legacy members
- When adding comments to legacy fixed-form COBOL, follow the established comment style (if `*` is used, continue with `*`; if `*>` is used, continue with `*>`)

---

### CL (CLLE / CLP / CL)

**Format:** `/* ... */` block comment (preferred) or `*>` line comment

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
- `*>` line comments also valid (modern CL, one line only)
- CL comments are not column-sensitive
- For headers/metadata: prefer `/* ... */` format
- For inline notes: either `/* */` or `*>` acceptable
- Preserve existing command indentation and spacing in edited members

---

### SQL (SQL / SQLTABL / SQLVIEW / SQLPRC / SQLTRG / SQLINDEX)

**Format:** `--` line comment (SQL standard)

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
- Preserve existing clause indentation and local spacing in edited SQL members

---

### DDS (PF / LF / DSPF / PRTF)

**Format:** `A*` (fixed 80-column model)

```dds
A* <Metadata>
A* Source Name .........: DDGMTRRUL
A* Created By ...........: Your Name
A* Date Created .........: YYYY-MM-DD
A* Source Description ..: Metric rules master file
A* Jira ..................: LSPS-4295 (or N/A)
A* </Metadata>
A*
A* <Synopsis>
A* Customer/metric data storage with keyed access.
A* </Synopsis>
A*
A* <Revision History>
A* Revisioner | Date | Jira No | Change
A* Your Name | YYYY-MM-DD | LSPS-4295 | Initial scaffold
A* </Revision History>
A
A                                      UNIQUE
A          R DDRULREC
A            UIDDDGMTR     10P 0
A            MTRNAM        50A
A*
A* Field-level comment explaining business purpose
A            TABREQ         1A
```

**Rules:**
- `A` in column 1 (required for DDS spec lines)
- `*` in column 2 (creates comment line)
- Comment starts in column 3+
- Opening structured metadata block: Metadata → Synopsis → Revision History → first DDS spec/record lines
- DDS does not use free-form prose headers outside spec/comment lines; the opening `A*` block is the header mechanism
- Preserve existing comment style when editing legacy DDS
- Preserve existing fixed-column spacing and token placement exactly

---

### UIM (PNLGRP / MENU)

**Format:** Structured markup comments, typically `:comment.` blocks

```uim
:pnlgrp.
:comment.
  <Metadata>
  Source Name .........: TPLMENU
  Created By ...........: Your Name
  Date Created .........: YYYY-MM-DD
  Source Description ..: Sample UIM menu
  Jira ..................: LSPS-4295 (or N/A)
  </Metadata>
.
:comment.
  <Synopsis>
  Main menu for add/update/delete/inquire operations.
  </Synopsis>
.
:comment.
  <Revision History>
  Revisioner | Date | Jira No | Change
  Your Name | YYYY-MM-DD | LSPS-4295 | Initial scaffold
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
- Preferred pattern: opening `:comment.` blocks for Metadata → Synopsis → Revision History inside first `:pnlgrp.` block
- Preserve established local UIM style when editing existing members (`:comment.`, `:help`, `:var`, or equivalent structured markup)
- UIM does not use conventional line comments like RPG/CL/SQL; keep metadata inside valid UIM markup structures
- Preserve existing tag indentation and attribute spacing in edited UIM members

---

## Metadata Header Documentation

All new members must include a metadata header using language-native comment format.

### Standard Metadata Section Order

1. **Metadata block** (source name, creator, date, description, Jira)
2. **Synopsis** (purpose, behavior, key entry points, high-level workflow)
3. **Revision History** (change log in markdown table format)
4. **First executable code/definition**

### Metadata Header Template (Language-Neutral Pattern)

```
<Metadata>
Source Name & Type ...: [10-CHAR NAME].[FILETYPE]
Created By ...........: [Initials or Name]
Date Created .........: [YYYY-MM-DD]
Source Description ...: [One-sentence business purpose]
Jira .................: [Ticket No. or N/A]
</Metadata>

<Synopsis>
Purpose:
[1-2 sentences explaining the business or technical goal]

High-Level Flow:
1. [First step]
2. [Second step]
3. [Etc.]

Inputs:
[Description of input data/parameters]

Outputs:
[Description of output/results]

Dependencies:
[List of files, services, procedures, or objects used]

Error Strategy:
[How errors are handled: log & continue, fail immediately, etc.]
</Synopsis>

<Revision History>
| Revisioner | Date | Jira No | Modification |
|------------|------|---------|--------------|
| Initials | YYYY-MM-DD | Ticket# | Initial creation / brief change description |
| Initials | YYYY-MM-DD | Ticket# | Next change |
</Revision History>
```

### Examples by Language

#### RPGLE / SQLRPGLE
```rpgle
**free
// <Metadata>
// Source Name & Type ...: DODDGAKYC.sqlrpgle
// Created By ...........: R. Strauss
// Date Created .........: 2026-08-27
// Source Description ...: Datadog API key maintenance (CRUD) program
// Jira .................: LSPS-4295
// </Metadata>
//
// <Synopsis>
// Purpose:
// Provides Create/Read/Update/Delete operations for Datadog API keys
// stored in DB2 table DDGMTRKEY. Validates permissions before operations.
//
// High-Level Flow:
// 1. Receive request (add, update, delete, or inquire)
// 2. Validate user authorization against security matrix
// 3. Execute SQL operation on DDGMTRKEY
// 4. Log audit trail to DDGAUDIT
// 5. Return result or error message to caller
//
// Inputs:
// Operation type, API key data, user ID for audit trail
//
// Outputs:
// Success/failure status, API key data (for inquire), error description
//
// Dependencies:
// DB2 tables: DDGMTRKEY, DDGAUDIT
// Service program: DDSECURITY (authorization checks)
// Stored procedure: UPD_AUDIT_TRAIL
//
// Error Strategy:
// Log errors with full context; return descriptive message.
// Continue batch processing; do not cascade failures to caller.
// </Synopsis>
//
// <Revision History>
// | Revisioner | Date | Jira No | Modification |
// | R. Strauss | 01 Aug 2026 | LSPS-4295 | Initial API key CRUD framework |
// | R. Strauss | 16 Aug 2026 | LSPS-4295 | Rename to 10-char IBM i system name |
// </Revision History>

ctl-opt main(main) option(*srcstmt:*nodebugio:*noshowcpy:*faststring);

// Declarations follow...
```

#### COBOL
```cobol
      *> <Metadata>
      *> Source Name & Type ...: DDGMTRKEY.sqlcblle
      *> Created By ...........: R. Strauss
      *> Date Created .........: 2026-08-27
      *> Source Description ...: Datadog API key maintenance (CRUD)
      *> Jira .................: LSPS-4295
      *> </Metadata>
      *>
      *> <Synopsis>
      *> Purpose:
      *> Provides CRUD operations for Datadog API keys stored in DB2.
      *>
      *> High-Level Flow:
      *> 1. Receive operation request and data
      *> 2. Validate authorization
      *> 3. Execute SQL operation
      *> 4. Log audit trail
      *> 5. Return result to caller
      *>
      *> Dependencies:
      *> DB2 tables: DDGMTRKEY, DDGAUDIT
      *> Service program: DDSECURITY
      *>
      *> Error Strategy:
      *> Log with context; return descriptive message.
      *> </Synopsis>
      *>
      *> <Revision History>
      *> | Revisioner | Date | Jira No | Modification |
      *> | R. Strauss | 01 Aug 2026 | LSPS-4295 | Initial scaffold |
      *> </Revision History>

       IDENTIFICATION DIVISION.
       PROGRAM-ID. DDGMTRKEY.

       ENVIRONMENT DIVISION.
       CONFIGURATION SECTION.

       DATA DIVISION.
       FILE SECTION.
       WORKING-STORAGE SECTION.

       PROCEDURE DIVISION.
```

#### SQL
```sql
-- <Metadata>
-- Source Name & Type ...: DDGMTRRUL.sqlprc
-- Created By ...........: R. Strauss
-- Date Created .........: 2026-08-27
-- Source Description ...: Procedure for metric rules API access
-- Jira .................: LSPS-4295
-- </Metadata>
--
-- <Synopsis>
-- Purpose:
-- Returns active metric rules for a given metric ID with optional filtering
-- by rule type and status.
--
-- High-Level Flow:
-- 1. Validate input parameters (metric_id not null)
-- 2. Query DDGMTRRUL table with provided criteria
-- 3. Return result set or error code
--
-- Dependencies:
-- DB2 tables: DDGMTRRUL, DDGMTRRUL_ARCHIVE
-- Calls: Called by DDGMTRSH (shell) and external integrations
--
-- Error Strategy:
-- Return sqlcode in output parameter; caller handles errors.
-- </Synopsis>
--
-- <Revision History>
-- | Revisioner | Date | Jira No | Modification |
-- | R. Strauss | 01 Aug 2026 | LSPS-4295 | Initial procedure |
-- </Revision History>

SET CURRENT SCHEMA = 'DEVGRPPRF';
stop;

CREATE OR REPLACE PROCEDURE DDGMTRRUL (
  IN p_metric_id       DECIMAL(10),
  IN p_rule_type       VARCHAR(20),
  OUT p_sqlcode        INTEGER
)
LANGUAGE SQL
...
```

#### CL
```cl
      /* <Metadata> */
      /* Source Name & Type ...: DDGCL01.clle */
      /* Created By ...........: R. Strauss */
      /* Date Created .........: 2026-08-27 */
      /* Source Description ...: Datadog configuration batch runner */
      /* Jira .................: LSPS-4295 */
      /* </Metadata> */
      /*  */
      /* <Synopsis> */
      /* Purpose: */
      /* Batch runner for Datadog configuration jobs. Submits to job queue, */
      /* logs results, and manages job dependencies. */
      /*  */
      /* High-Level Flow: */
      /* 1. Validate input file member names */
      /* 2. Submit jobs to DDGJOBQUE in dependency order */
      /* 3. Poll job status; retry on temporary failures */
      /* 4. Write completion summary to DDGRUNLOG */
      /*  */
      /* Dependencies: */
      /* Job queue: DDGJOBQUE */
      /* Log file: DDGRUNLOG */
      /* Service programs: DDJOBCTL, DDLOGGING */
      /*  */
      /* Error Strategy: */
      /* Log all job submissions and completions. If any job fails, */
      /* continue remaining jobs; report summary at end. */
      /* </Synopsis> */
      /*  */
      /* <Revision History> */
      /* | Revisioner | Date | Jira No | Modification | */
      /* | R. Strauss | 01 Aug 2026 | LSPS-4295 | Initial batch runner | */
      /* </Revision History> */

      PGM

      DCL VAR(&JOBNAME) TYPE(*CHAR) LEN(10)
      DCL VAR(&JOBUSER) TYPE(*CHAR) LEN(10)
      ...
```

---

## Procedure and Function Documentation

Every procedure, function, or significant routine must have a **short header comment block** immediately above its declaration.

### RPGLE Procedure Header Pattern

**Rule:** Add documentation comment immediately above every `dcl-proc`.

```rpgle
// Validates policy information before processing.
// Returns 1 if valid, 0 if validation fails.
// Side effect: Logs validation errors to DDGAUDIT table.
// Called by: main procedure, external APIs
// Dependencies: DB2 table POLMST, service program DDSECURITY
dcl-proc validatePolicy;
  dcl-pi *n int(1);
    policyId varchar(20) const;
    customerId varchar(20) const;
  end-pi;

  // Implementation...
end-proc validatePolicy;
```

**Header Components (include all that apply):**
1. **One-line synopsis** (what does this do?)
2. **Parameters** (input/output, what they mean)
3. **Return value** (what does it return? what do values mean?)
4. **Side effects** (what external state changes?)
5. **Called by** (who uses this?)
6. **Dependencies** (files, services, procedures used)
7. **Exceptions** (what errors can occur?)

### COBOL Paragraph/Section Header Pattern

```cobol
      *> Validates policy information before processing.
      *> Calls DDSECURITY to check user permissions.
      *> Returns policy-status: '0' = valid, '1' = invalid.
      *> Side effect: Logs to DDGAUDIT file.

       VALIDATE-POLICY SECTION.
           ...
       END VALIDATE-POLICY.
```

### SQL Procedure Header Pattern

```sql
-- Validates policy information before processing.
--
-- Parameters:
-- IN p_policy_id: Policy record identifier
-- IN p_customer_id: Customer record identifier
-- OUT p_result: 1 if valid, 0 if validation fails
--
-- Side Effects:
-- Writes validation failures to DDGAUDIT table
--
-- Called By:
-- DDGMTRSH (shell handler), external API integrations
--
-- Dependencies:
-- DB2 tables: POLMST, POLRULES, DDGAUDIT
-- Stored procedure: UPD_AUDIT_TRAIL
--
-- Exceptions:
-- Returns sqlcode in p_result; caller handles errors.

CREATE OR REPLACE PROCEDURE VALIDATE_POLICY (
  IN p_policy_id VARCHAR(20),
  IN p_customer_id VARCHAR(20),
  OUT p_result INTEGER
)
LANGUAGE SQL
BEGIN
  ...
END;
```

### CL Command/Procedure Header Pattern

```cl
      /* Validates policy information before processing. */
      /* Calls DDSECURITY to check user permissions. */
      /* Returns: 0 = valid, 1 = invalid. */
      /* Side effect: Logs to DDGAUDIT file. */

      PGM PARM(&POLICYID &CUSTOMERID &RESULT)

      DCL VAR(&POLICYID) TYPE(*CHAR) LEN(20)
      ...
```

---

## Field/Variable Documentation

Document complex or business-significant data declarations:

**RPGLE:**
```rpgle
dcl-s processedCount int(5);
  // Tracks number of records processed successfully in this batch run
  // Used for progress reporting to user and summary statistics

dcl-s policyCache likeds(policyRuleT) dim(1000);
  // In-memory cache of active policy rules (limited to 1,000 entries)
  // Initialized on first use; improves performance ~5x for large batches
  // Cache expires at end of run; reloaded on next invocation
```

**COBOL:**
```cobol
       01 WS-PROCESSED-COUNT    PIC 9(5) VALUE 0.
      *> Tracks successfully processed records; supports progress reporting
      *> and summary statistics

       01 WS-POLICY-CACHE       PIC X(1000) VALUE SPACES.
      *> In-memory cache of active policy rules (1,000-byte limit)
      *> Initialized on first use; improves batch processing speed ~5x
      *> Cache expires at run end; reloaded on next invocation
```

**SQL:**
```sql
-- Performance cache: Stores active policy rules retrieved from POLRULES
-- Initialized on first use during batch processing
-- Provides ~5x speedup for large batches (>10,000 records)
-- Cache expires at procedure exit; fresh data on next invocation
CREATE OR REPLACE VARIABLE policy_cache_array ARRAY[1000] OF VARCHAR(500);
```

---

## IBM i Specific Guidance

For RPGLE, SQLRPGLE, CL, COBOL, DDS, and DB2 objects:

### File and Commitment Control Documentation

```rpgle
dcl-f polmst keyed;
  // Master file for policy records opened for random/sequential access
  // Under commitment control to ensure consistency between
  // policy master and transaction ledger (must be read-only for reports)
```

### Library and Binding Directory Dependencies

```rpgle
// Bound service programs:
//   DDSECURITY (auth checks), DDERRLG (error logging), DDSESSION (session mgmt)
// Library dependencies:
//   DEVPRF (development library), DBPRF (database library)
// Data areas:
//   DDGCONFIG (config data area, shared across batch processes)
```

### Message Queue and Data Area Usage

```cl
/* Reads configuration from data area DDGCONFIG (DDGLIB) */
/* Writes job status to message queue DDGRESULT (monitored by dashboard) */
```

### SQL and Commitment Control Strategy

```sql
-- Batch vs Interactive Behavior:
-- For batch: commit after every 1000 rows to balance performance/recovery
-- For interactive: commit after each transaction (user-initiated updates)
--
-- Commitment control ensures customer and transaction records
-- remain synchronized per business requirement (claims age + customer status)
```

---

## Business Rule Documentation (Critical)

Every business rule must be documented with:
- Rule number or reference (Jira, business requirement doc)
- Plain-English description
- Why the rule exists
- Consequence of violation

**Example:**
```rpgle
// Business Rule (LSPS-4295, Business Requirements v2.1):
// Claims older than 30 days require manager approval before processing.
// Reason: Compliance regulation requires secondary review for aged claims.
// Consequence of violation: Claims processed without approval violate
// regulatory requirements and expose company to audit penalties.
if (days_since_filing > 30);
  // Route to manager queue for sign-off before processing
  chain claim_key to manager_queue;
  insert_audit_log('PENDING_MANAGER_REVIEW', claim_key, user_id);
endif;
```

---

## Refactoring and Documentation Constraints

### DO NOT

- Change program behavior
- Change variable names or API signatures
- Change SQL logic or queries
- Change business rules
- Reformat unrelated code
- Reindent or re-space existing source unless explicitly requested

### DO

- Improve comments and documentation
- Add business context and explanations
- Document error handling and dependencies
- Clarify complex logic
- Document performance decisions
- Flag areas where intent could not be determined

---

## Common Defects to Fix

### Defect 1: Silent Intent Loss

**Before:**
```rpgle
if (status = 'A');
  result = calculate_premium();
endif;
```

**After:**
```rpgle
// Only calculate premium for active policies (status='A').
// Expired/cancelled policies are excluded per business rule.
if (status = 'A');
  result = calculate_premium();
endif;
```

### Defect 2: Unexplained External Dependency

**Before:**
```rpgle
chain customer_key to customer_master;
```

**After:**
```rpgle
// Retrieve customer master record to access credit limit and
// current balance for authorization check. Fails gracefully if
// customer record is deleted (returns EOF).
chain customer_key to customer_master;
```

### Defect 3: Missing Error Context

**Before:**
```rpgle
on-error;
  return -1;
endmon;
```

**After:**
```rpgle
on-error;
  // Log error details for manual investigation; continue processing
  // to prevent one failed transaction from halting the entire batch.
  // Error is not fatal; batch completes with partial results reported.
  call 'DDERRLG' parm(error_msg transaction_id customer_id);
  return -1;
endmon;
```

### Defect 4: Ambiguous Performance Decision

**Before:**
```rpgle
policyCache = *off;
```

**After:**
```rpgle
policyCache = *off;
// Cache is invalidated at end of each run to prevent stale data
// from being used by next invocation. Fresh cache improves both
// accuracy and performance compared to real-time lookups.
```

---

## Clarity and Ambiguity Resolution

### When Intent is Unclear

Mark inferred comments with: `[INFERRED PURPOSE]`

**Example:**
```rpgle
// [INFERRED PURPOSE] Excludes records with deletion date set
// (indicates soft delete rather than physical removal).
// Program name and table structure suggest this is a retention
// report for deleted claims; verify intent with business analyst.
if (deletion_date = *blanks);
  add record to result set;
endif;
```

### When Intent Cannot Be Determined

Flag for subject matter expert review:

```rpgle
// [SME REVIEW NEEDED] This calculation adjusts premium by 15% in cases
// where claim_type = 'X'. No business requirement document found.
// Verify: Is this correct? Is calculation still required? Recommend
// creating Jira ticket to document business rule.
if (claim_type = 'X');
  premium = premium * 1.15;
endif;
```

---

## Documentation Deliverables Checklist

After commenting a program or module:

- [ ] Metadata header complete (Source Name, Created By, Date, Description, Jira)
- [ ] Synopsis section explains business purpose and high-level flow
- [ ] Revision history populated (first entry + any modifications)
- [ ] Every procedure/function has short header comment
- [ ] Business rules documented with reason and consequence
- [ ] External dependencies documented (files, services, procedures)
- [ ] Error handling strategy explained
- [ ] Complex logic explained (WHY, not WHAT)
- [ ] Performance decisions explained with rationale
- [ ] Field/variable comments added for non-obvious data declarations
- [ ] Ambiguities flagged with [INFERRED PURPOSE] or [SME REVIEW NEEDED]
- [ ] No redundant comments (those that merely restate code)
- [ ] Existing formatting preserved (no whitespace-only churn)

---

## Summary Table

| Aspect | Standard | Example |
|--------|----------|---------|
| Comment Why | Business context, intent, rules | "Business rule: claims >30 days require approval" |
| Comment WHAT | Not needed (code shows WHAT) | Avoid: "Increment counter" |
| Header format | Language-native comment syntax | RPGLE: `//`, SQL: `--`, COBOL: `*>`, CL: `/* */` |
| Metadata | Source name, creator, date, description, Jira | See examples above |
| Procedure header | Purpose, parameters, return, side effects | See Procedure Documentation section |
| Business rules | Rule reference, reason, consequence | See Business Rule Documentation section |
| Dependencies | List files, services, procedures used | "Calls: DDSECURITY, DDERRLG; tables: POLMST, DDGAUDIT" |
| Error handling | Explain why error is handled this way | "Continue processing; log for manual review" |
| Performance | Explain non-obvious optimizations | "Cache improves performance ~5x for batch processing" |
| Line length | ≤100 columns per line (RPGLE, COBOL) | Wrap long comments at word boundaries |
| Preservation | Keep existing indentation, spacing | No reindent/re-space unless explicitly requested |

---

## Skill-Specific Application

This canonical guide applies to ALL IBM i codegen skills:

- **codegen-rpgle** → Apply RPGLE comment format, procedure headers, metadata
- **codegen-cblle** → Apply COBOL comment format, copybook documentation
- **codegen-clle** → Apply CL comment format, command documentation
- **codegen-sql** → Apply SQL comment format, procedure/trigger documentation
- **codegen-dds** → Apply DDS comment format, record/field documentation
- **codegen-dspf** → Apply DDS comment format for screen/printer files
- **codegen-uim** → Apply UIM structured markup for metadata

Each skill owns artifact-specific examples; this guide owns the unified principles.

---

---

## Related Authority Files & Skills

**Comprehensive Program Documentation** (Distinct from inline comments):
- See: `enterprise-grade-program-documentation.instructions.md` — Multi-section program analysis (business purpose, technical design, dependencies, modernization opportunities)
- Use skill: `codegen-ibmi-program-documentation` — Generates complete program documentation from source code analysis

**Markdown Documentation Standards** (For project docs, READMEs, architecture guides):
- See: `markdown.instructions.md` — Markdown formatting and structure standards

**Architecture & Modernization Context**:
- See: `ibmi-ferraria-standards.instructions.md` — Handler role semantics and Ferraria architecture
- See: `modernizing-ibmi-applications.instructions.md` — Strategy for IBM i application modernization

**Code Generation Skills** (Apply this commenting standard):
- `codegen-rpgle`, `codegen-cblle`, `codegen-clle`, `codegen-sql`, `codegen-dds`, `codegen-dspf`, `codegen-uim`

---

**Version:** 2.0
**Last Updated:** 2026-08-29
**Canonical Authority:** YES — Unified authority for inline comments within all IBM i source types. Does NOT cover comprehensive program documentation (see enterprise-grade-program-documentation.instructions.md for that).
