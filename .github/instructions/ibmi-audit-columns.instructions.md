---
applyTo: .agents/skills/codegen-sql, .agents/skills/codegen-cblle, .agents/skills/codegen-rpgle
description: Canonical audit columns (standard temporal table columns) for IBM i SQL table generation. Single source of truth for all DDL generation across codegen skills.
---

# IBM i SQL Audit Columns — Canonical Reference

**Authoritative Source** — All IBM i code generation skills that emit SQL DDL reference this file for audit column definitions. Never duplicate these definitions across skills.

## When to Apply

Add audit columns **only** when generating or modifying:
- SQL `CREATE TABLE` statements
- SQL `CREATE OR REPLACE TABLE` statements
- COBOL `CREATE TABLE` / `CREATE OR REPLACE TABLE` statements
- RPGLE embedded SQL `CREATE TABLE` / `CREATE OR REPLACE TABLE` statements

**Do NOT add audit columns to:**
- Views (`CREATE VIEW`)
- Indexes (`CREATE INDEX`)
- Procedures or triggers
- Existing tables (preserve existing structure; only add missing columns)

## Formatting preservation

- When inserting missing audit columns into an existing DDL statement, preserve
  the local indentation and spacing already used by the surrounding column list.
- Do not reindent, respacing-align, or reflow unrelated columns unless the
  developer explicitly asks for formatting changes.

## Canonical Audit Column List

Add **only missing columns** from this list. **Never duplicate** existing entries.

Place audit columns **after all business columns** but **before** any PRIMARY KEY or constraint definitions.

```sql
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

## Column Definitions

| SQL Name | Alias | Type | Purpose |
|----------|-------|------|---------|
| `RecordStatus` | `rcdsts` | `CHAR(1) NOT NULL DEFAULT 'A'` | Record active/inactive flag (A=active, D=deleted, etc.) |
| `beginning_time` | `begtim` | `TIMESTAMP(12) NOT NULL GENERATED ALWAYS AS ROW BEGIN` | Temporal: period start (system-maintained) |
| `ending_time` | `endtim` | `TIMESTAMP(12) NOT NULL GENERATED ALWAYS AS ROW END` | Temporal: period end (system-maintained) |
| `transaction_start` | `trxstr` | `TIMESTAMP(12) NOT NULL GENERATED ALWAYS AS TRANSACTION START ID` | Temporal: transaction start ID (system-maintained) |
| `period system_time` | — | `PERIOD SYSTEM_TIME (beginning_time, ending_time)` | Temporal: system-time period definition |
| `aud_user` | `audusr` | `VARCHAR(18) GENERATED ALWAYS AS (user)` | Audit: current user (system-maintained) |
| `aud_change` | `audchg` | `CHAR(1) GENERATED ALWAYS AS (data CHANGE OPERATION)` | Audit: operation type — I/U/D (system-maintained) |
| `aud_jobname` | `audjob` | `VARCHAR(28) GENERATED ALWAYS AS (qsys2.job_name)` | Audit: job name at time of change (system-maintained) |
| `aud_pgm` | `audpgm` | `VARCHAR(255) ALLOCATE(20) GENERATED ALWAYS AS (current client_programid)` | Audit: calling program ID (system-maintained) |

## Implementation Pattern

### SQL Example

```sql
CREATE OR REPLACE TABLE MYLIB.MYTABLE (
  -- Business columns
  ID DEC(10, 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
  NAME VARCHAR(100) NOT NULL,
  STATUS CHAR(1) NOT NULL DEFAULT 'A',

  -- Audit columns (added here)
  RecordStatus for rcdsts char(1) not null default 'A',
  beginning_time for begtim timestamp(12) not null generated ALWAYS as row begin,
  ending_time for endtim timestamp(12) not null generated ALWAYS as row end,
  transaction_start for trxstr timestamp(12) not null generated ALWAYS as transaction start ID,
  period system_time (beginning_time, ending_time),
  aud_user for audusr varchar(18) generated ALWAYS as (user),
  aud_change for audchg char(1) generated ALWAYS as (data CHANGE OPERATION),
  aud_jobname for audjob varchar(28) generated ALWAYS as (qsys2.job_name),
  aud_pgm for audpgm varchar(255) allocate (20) generated ALWAYS as (current client_programid),

  -- Constraints
  PRIMARY KEY (ID)
) FOR SYSTEM NAME MYTABLE;
```

### RPGLE Embedded SQL Example

```rpgle
exec sql
  CREATE OR REPLACE TABLE MYLIB.MYTABLE (
    ID DEC(10, 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
    NAME VARCHAR(100) NOT NULL,
    RecordStatus for rcdsts char(1) not null default 'A',
    beginning_time for begtim timestamp(12) not null generated ALWAYS as row begin,
    ending_time for endtim timestamp(12) not null generated ALWAYS as row end,
    transaction_start for trxstr timestamp(12) not null generated ALWAYS as transaction start ID,
    period system_time (beginning_time, ending_time),
    aud_user for audusr varchar(18) generated ALWAYS as (user),
    aud_change for audchg char(1) generated ALWAYS as (data CHANGE OPERATION),
    aud_jobname for audjob varchar(28) generated ALWAYS as (qsys2.job_name),
    aud_pgm for audpgm varchar(255) allocate (20) generated ALWAYS as (current client_programid),
    PRIMARY KEY (ID)
  ) FOR SYSTEM NAME MYTABLE;
```

## Rules for Adding Audit Columns

1. **Check existing columns first** — before adding, verify none of these columns already exist
2. **Never duplicate** — if a column exists, skip it; do not re-add
3. **Placement** — add audit columns after all business columns, before PRIMARY KEY or constraints
4. **Order** — maintain the canonical order shown above
5. **Exact syntax** — copy the exact `for` aliases, types, and `GENERATED ALWAYS AS` clauses; do not modify
6. **System-maintained** — these columns are read-only and auto-populated; never ask users to populate them

## When NOT to Add Audit Columns

- **Existing tables**: preserve existing structure; add only missing columns if business logic requires it
- **Views**: never add audit columns to CREATE VIEW statements
- **Indexes**: never add audit columns to CREATE INDEX statements
- **Temporary tables**: only for persistent application tables requiring audit trail
- **Staging/ETL tables**: business decision required; clarify with user

## Modifying Existing Tables

If a table already has some audit columns:

1. **List existing columns** — read the table definition
2. **Compare to canonical list** — identify which canonical columns are missing
3. **Add only missing ones** — insert missing columns in canonical order
4. **Preserve existing entries** — never alter or remove existing audit columns
5. **Maintain order** — keep audit columns grouped at the end of business columns

Example:
- Table has `RecordStatus` and `aud_user`
- Table is missing: `beginning_time`, `ending_time`, `transaction_start`, `period system_time`, `aud_change`, `aud_jobname`, `aud_pgm`
- **Add only the missing ones** in the order shown above

---

**Version:** 1.0
**Last Updated:** 2026-08-24
**Source Authority:** IBM i Temporal Tables + Audit Standards
**Skills Reference:** codegen-sql, codegen-cblle, codegen-rpgle
