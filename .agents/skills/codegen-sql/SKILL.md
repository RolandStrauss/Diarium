---
name: codegen-sql
description: Generate new IBM i SQL artifacts (SQL scripts, tables, views, procedures, triggers, indexes) using repository-aligned templates. Use when the user asks to create or scaffold SQL members such as .sql, .sqltabl, .sqlview, .sqlprc, .sqltrg, or .sqlidx.
version: 1.0.0
author: Roland Strauss
category: IBMi
tags:
  - ibmi
  - db2
  - sql
  - automation
---

## Purpose

Generate IBM i SQL source members quickly and consistently for `QSQLSRC` workflows.

## Strategic modernization guidance (authoritative)

**Canonical Reference:** See `.github/instructions/modernizing-ibmi-applications.instructions.md`.

Use that file when the request is about modernization strategy rather than just
DDL syntax.

- This skill owns SQL artifact generation rules, templates, and validator-ready
  output.
- The modernization instruction owns the broader move toward data-centric
  design, SQL-first database modernization, integration enablement, secure-by-
  design delivery, and iterative rollout.
- When modernizing DDS-era data structures, prefer incremental SQL DDL adoption
  with preserved contracts where compatibility matters.

## Ferraria standards authority and role semantics (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-ferraria-standards.instructions.md`.

Use that file as the cross-skill authority when SQL generation touches Legacy Solutions / Ferraria architecture, naming ambiguity, or handler-role questions.

- `FM` and `SP` remain the preferred reusable data-access and service boundaries.
- `CH` means **Content Handler** in Ferraria API flows.
- Do not import Orbit-only "no SQL in RH and SH" wording as a repo-wide Ferraria prohibition.
- Use `QT` as current MQT naming; preserve legacy `LD` names only when contractual.

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

- Apply "when/if applicable": SQL DDL artifacts may only use a subset.
- For SQL procedures, map to parameter interface → structured declarations → scalar variables/constants.
- If any example/template ordering in this file differs, the canonical instruction above wins.

## 5250 screen-generation routing (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-dspf-routing.instructions.md`.

- This skill does not generate `DSPF`/`PRTF` source members.
- When a request includes 5250 screen layout, field-level UI attributes,
  `ALIAS`, `DSPATR`, or display-file concerns, delegate that portion to
  `codegen-dspf`.
- Keep this skill focused on SQL artifacts (tables, views, procedures,
  triggers, indexes, and scripts).

## Companion `DODDRULSH.loadSubfile` reference

**Authoritative Reference:** See
`.github/instructions/ibmi-jsp-scaffold.instructions.md`, section
`Canonical Subfile List-Hydration Procedure (DODDRULSH.loadSubfile)`.

JSP applies directly only to SQL procedures, but subfile maintenance shells in
this repo commonly depend on SQL list queries shaped for that scaffold.

- Prefer deterministic list queries with explicit `ORDER BY`.
- Select the hidden key plus only the columns needed for visible row mapping.
- Keep list-hydration queries read-only; row mutation belongs in handler/service
  actions.
- If full IFS paths are stored, keep display-shortening in the shell rather than
  baking truncation into the SQL source.

## Jackson Structured Programming scaffold (required)

**Authoritative Reference:** See `.github/instructions/ibmi-jsp-scaffold.instructions.md` for the canonical JSP pattern, shared across all IBM i codegen skills.

**SQL-Specific Application:**
- Apply JSP to **procedures only** (CREATE PROCEDURE ... BEGIN ... END)
- **Tables, views, indexes, triggers:** JSP does not apply (declarative DDL, not procedural)
- For procedures: structure as Initialize (schema/options) → Input (parameters/validation) → Process (explicit branching on success/error) → Output (final result set)

**Quick Reference (SQL):**

1. **Initialise** — SET schema options, define error/success status
2. **Input** — validate parameters and required identifiers (single boundary check)
3. **Process** — explicit branching on success/no-data/error conditions
4. **Output** — emit result set/status deterministically

**De-Duplication:** One validation boundary per procedure; explicit mutually-exclusive branch outcomes; no duplicate business-rule checks.

## Industry best-practice profile (IBM i SQL on Db2 for i)

Apply these defaults unless the user explicitly asks otherwise:

- Keep statements deterministic and compile-safe for `RUNSQLSTM` usage.
- Use `CREATE OR REPLACE` for idempotent object evolution when supported.
- Use `FOR SYSTEM NAME` for table definitions to keep 10-character object compatibility.
- Include explicit primary keys for new table scaffolds.
- Keep procedure templates `LANGUAGE SQL` with clear `BEGIN ... END` blocks.
- Keep trigger templates `FOR EACH ROW MODE DB2SQL` and side-effect minimal.
- Separate logical statements with `stop;` where multi-statement source is expected.
- Do not embed environment secrets, hosts, or credentials in generated source.

## Source Member Naming (IBM i Standard: 10-character Maximum)

**Authoritative Reference:** See `.github/instructions/ibmi-source-naming.instructions.md` for complete naming standards and rules.

### Naming enforcement (automatic)

- All `generate-sql-member.py` outputs enforce **maximum 10-character member names** via `normalize_name()` function
- Input names are automatically truncated to fit IBM i object-naming limits
- This is a **hard system limit**, not a preference

### Examples by artifact type

| Artifact | Example Input | Normalized Member | Notes |
|----------|---|---|---|
| Table | `"MetricRulesTable"` | `METRICRULE` | Member name; SQL `FOR SYSTEM NAME` can be longer |
| View | `"metric_rules_detail_v01"` | `METRIC_RUL` | Truncated; follows DDG naming convention |
| Procedure | `"UpdateMetricRules"` | `UPDATERULE` | Truncated; SQL object name matches member |
| Trigger | `"TableMetricTrigger"` | `TABLEMETRI` | Truncated; keeps recognizable prefix |
| Index | `"MetricRulesIndex"` | `METRICRUL` | Truncated; follows DDS/DDL conventions |

### Dual naming strategy for SQL

SQL objects support two names:
1. **Member Name** (10 chars, OS limit)
   ```sql
   CREATE TABLE METRIC_RUL ...
   ```
   Used by: compiled programs, CL commands, SAVF/restore tools

2. **SQL SYSTEM NAME** (optional, up to 128 chars, post-generation)
   ```sql
   CREATE TABLE METRIC_RUL FOR SYSTEM NAME "MetricRulesTable" ...
   ```
   Used by: SQL tools, documentation, optional long aliases

### Rationale

IBM i object names are limited to 10 characters by the operating system. This applies to:
- SQL table and view objects after compilation
- Procedure and trigger objects after compilation
- Index objects after compilation
- Physical source member names (before compilation)

## Hard rules (non-negotiable)

1. SQL members must terminate statements with `;`.
2. `sqltable` must include `CREATE TABLE`/`CREATE OR REPLACE TABLE` and `PRIMARY KEY`.
3. For any `CREATE TABLE` or `CREATE OR REPLACE TABLE`, see `.github/instructions/ibmi-audit-columns.instructions.md` for canonical audit column list. Include only **missing** audit columns (never duplicate existing ones).
4. `sqlview` must include `CREATE VIEW` and `SELECT`.
5. `sqlproc` must include `CREATE PROCEDURE`, `LANGUAGE SQL`, and `BEGIN ... END;`.
6. `sqltrigger` must include `CREATE TRIGGER`, `FOR EACH ROW`, and `MODE DB2SQL`.
7. `sqlindex` must include `CREATE INDEX ... ON ...`.
8. Do not include destructive statements by default (`DROP`, `TRUNCATE`, mass deletes).

## File header format (all SQL artifacts)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md` for unified IBM i comment and metadata-block rules.

**Complete header structure** (SQL uses `--` line comments):

```sql
-- <Metadata>
-- Source Name .........: DDGMTRRUL.SQLPRC
-- Created By ...........: Your Name
-- Date Created .........: YYYY-MM-DD
-- Source Description ..: Procedure for metric rules API access.
-- Jira ..................: LSPS-XXXX (or N/A)
-- </Metadata>
--
-- <Synopsis>
-- Executes CRUD operations on DDGMTRRUL table.
-- Entry point: PROC_RtrvMetricRules (select); exported via service program.
-- </Synopsis>
--
-- <Revision History>
-- Revisioner | Date | Jira No (if known) | Change |
-- Your Name | YYYY-MM-DD | LSPS-XXXX | Initial scaffold |
-- </Revision History>

SET CURRENT SCHEMA = 'DEVGRPPRF';
stop;
```

**Header rules:**
- Sections in order: Metadata → Synopsis → Revision History → `SET CURRENT SCHEMA` or first SQL statement
- All sections use `--` comment style with `<SectionName>` delimiters
- Date format: ISO 8601 (`YYYY-MM-DD`)
- Jira: Full ticket number (e.g., `LSPS-4295`) or `N/A`
- When modifying existing code, add entry to Revision History; preserve all existing entries
- Place complete header before `SET CURRENT SCHEMA` or first SQL statement

**Metadata contents (universal across all skills):**
- Source Name (actual member name, optionally with artifact type suffix)
- Created By (developer name)
- Date Created (ISO 8601: `YYYY-MM-DD`)
- Source Description (single-line summary)
- Jira (ticket or `N/A`)

## Native indentation and spacing (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md`.

- Preserve existing SQL indentation and spacing when editing an existing member.
- Do not reindent or re-space unrelated clauses, column lists, or aligned DDL
  blocks unless the developer explicitly asks for formatting changes.
- For new members, use the native SQL layout from repo templates and validator
  examples; keep formatting simple and non-decorative.

## Workflow

### 1) Determine target artifact

Classify user request as one of:

- `sql` (generic SQL member)
- `sqltable` (table DDL)
- `sqlview` (view DDL)
- `sqlproc` (procedure DDL)
- `sqltrigger` (trigger DDL)
- `sqlindex` (index DDL)

If unclear, ask which one they want.

### 2) Generate from strict template

Use one of the templates in this skill folder:

- `templates/SQL.template.sql`
- `templates/SQLTABLE.template.sqltabl`
- `templates/SQLVIEW.template.sqlview`
- `templates/SQLPROC.template.sqlprc`
- `templates/SQLTRIGGER.template.sqltrg`
- `templates/SQLINDEX.template.sqlidx`

### 3) Enforce SQL gate

Before returning output, verify:

- statements end with `;`
- at least one `stop;` delimiter exists
- type-specific required SQL constructs are present
- each required standard/audit table column appears exactly once for `sqltable`

If any check fails, regenerate before responding.

## Templates

### Template: sql (generic)

```sql
SET CURRENT SCHEMA = 'MMDEVOPS';
stop;

VALUES CURRENT TIMESTAMP;
stop;
```

### Template: sqltable

```sql
CREATE OR REPLACE TABLE MY_TABLE
FOR SYSTEM NAME MYTABLE (
  ID DEC(10, 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
  CODE CHAR(20) NOT NULL DEFAULT ' ',
  -- Standard Columns
  RecordStatus for rcdsts char(1) not null default 'A',
  beginning_time for begtim timestamp(12) not null generated ALWAYS as row begin,
  ending_time for endtim timestamp(12) not null generated ALWAYS as row end,
  transaction_start for trxstr timestamp(12) not null generated ALWAYS as transaction start ID,
  period system_time (beginning_time, ending_time),
  -- Audit Columns
  aud_user for audusr varchar(18) generated ALWAYS as (user),
  aud_change for audchg char(1) generated ALWAYS as (data CHANGE OPERATION),
  aud_jobname for audjob varchar(28) generated ALWAYS as (qsys2.job_name),
  aud_pgm for audpgm varchar(255) allocate (20) generated ALWAYS as (current client_programid),
  CONSTRAINT MYTABLE_PK PRIMARY KEY (ID)
)
RCDFMT MYTABLE;
stop;
```

### Template: sqlview

```sql
CREATE OR REPLACE VIEW MY_VIEW AS
  SELECT ID, CODE
    FROM MY_TABLE;
stop;
```

### Template: sqlproc

```sql
CREATE OR REPLACE PROCEDURE MY_PROC (IN P_ID DEC(10, 0))
LANGUAGE SQL
BEGIN
  VALUES P_ID;
END;
stop;
```

### Template: sqltrigger

```sql
CREATE OR REPLACE TRIGGER MY_TRIGGER
AFTER UPDATE ON MY_TABLE
REFERENCING NEW AS N OLD AS O
FOR EACH ROW MODE DB2SQL
BEGIN ATOMIC
  SET N.UPDATED_AT = CURRENT TIMESTAMP;
END;
stop;
```

### Template: sqlindex

```sql
CREATE INDEX MY_INDEX
ON MY_TABLE (CODE ASC);
stop;
```

## Output policy

When generating source for users:

- Return exactly one completed member unless asked for multiple.
- Use requested names for object and member names.
- Create new source folders and files with lower-case names and lower-case extensions for generated artifact paths; the generator normalizes the output file name to lower-case when writing, while keeping IBM i source-library/object names unchanged where the toolchain requires them.
- Use the canonical `filename.type` source-member pattern; do not insert `.pgm.` into file names.
- If an existing member uses `filename.pgm.type`, rename it to `filename.type` before editing or regenerating it.
- Keep output concise and compile-ready as a scaffold.
- Keep table/view/procedure/trigger/index intent explicit.

## Optional local validator

Use `scripts/validate-sql-source.py` to enforce SQL rules:

```bash
python .agents/skills/codegen-sql/scripts/validate-sql-source.py --type sql QSQLSRC/tplsql01.sql
python .agents/skills/codegen-sql/scripts/validate-sql-source.py --type sqltable QSQLSRC/tplaccmst.sqltabl
python .agents/skills/codegen-sql/scripts/validate-sql-source.py --type sqlview QSQLSRC/tplaccv01.sqlview
python .agents/skills/codegen-sql/scripts/validate-sql-source.py --type sqlproc QSQLSRC/tplupdacc.sqlprc
python .agents/skills/codegen-sql/scripts/validate-sql-source.py --type sqltrigger QSQLSRC/tplacctrg.sqltrg
python .agents/skills/codegen-sql/scripts/validate-sql-source.py --type sqlindex QSQLSRC/tplaccidx.sqlidx
```

## Optional local generator

Use `scripts/generate-sql-member.py` to scaffold members from strict templates:

```bash
python .agents/skills/codegen-sql/scripts/generate-sql-member.py --type sql --name TPLSQL01 --out QSQLSRC/tplsql01.sql
python .agents/skills/codegen-sql/scripts/generate-sql-member.py --type sqltable --name TPLACCMST --out QSQLSRC/tplaccmst.sqltabl
python .agents/skills/codegen-sql/scripts/generate-sql-member.py --type sqlview --name TPLACCV01 --table TPLACCMST --out QSQLSRC/tplaccv01.sqlview
python .agents/skills/codegen-sql/scripts/generate-sql-member.py --type sqlproc --name TPLUPDACC --table TPLACCMST --out QSQLSRC/tplupdacc.sqlprc
python .agents/skills/codegen-sql/scripts/generate-sql-member.py --type sqltrigger --name TPLACCTRG --table TPLACCMST --out QSQLSRC/tplacctrg.sqltrg
python .agents/skills/codegen-sql/scripts/generate-sql-member.py --type sqlindex --name TPLACCIDX --table TPLACCMST --out QSQLSRC/tplaccidx.sqlidx
```

Supported types:

- `sql`
- `sqltable`
- `sqlview`
- `sqlproc`
- `sqltrigger`
- `sqlindex`

## Validation checklist

- [ ] statements terminate with `;`
- [ ] at least one `stop;` delimiter is present
- [ ] type-specific DDL exists for selected member type
- [ ] table scaffolds include `FOR SYSTEM NAME`
- [ ] no destructive default statements are included


@AGENTS.md
