---
applyTo: .agents/skills/codegen-*
description: Canonical Jackson Structured Programming (JSP) scaffold for IBM i code generation. All codegen skills reference this as the authoritative JSP pattern.
---

# Jackson Structured Programming (JSP) Scaffold — IBM i Code Generation

**Canonical Reference** — All IBM i codegen skills (`codegen-rpgle`,
`codegen-rpgle-subfile`, `codegen-cblle`, `codegen-clle`, `codegen-dds`,
`codegen-dspf`, `codegen-sql`, and `codegen-uim`) use this JSP pattern.

## Core Pattern (Language-Agnostic)

Every program, procedure, and flow must follow this 4-stage lifecycle:

### 1. Initialise
- Declare state and defaults
- Set control options, constants, status variables
- Perform one-time setup only
- Executed exactly once at program/procedure start

### 2. Input
- Receive parameters or read input records
- Validate required fields and allowed values
- Single validation boundary (not repeated in process)

### 3. Process
- **Selection:** explicit business branching (If/Else, Select/When, etc.)
- **Iteration:** bounded loop processing for repeating items (DOFOR, PERFORM, cursor loops, etc.)
- Keep decisions mutually exclusive; avoid overlapping conditions
- Use only JSP primitives:
  - **Sequence** — linear steps
  - **Selection** — branching (if/else, select/when)
  - **Iteration** — repetition (loop, cursor, foreach)

### 4. Output
- Write/return results and status
- Terminate deterministically
- One clear completion path per operation

## De-duplication Rules

- **One canonical flow per procedure:** Initialize → Input → Process → Output
- **Call initialization exactly once** at start of owning flow
- **Never duplicate** initialization logic across branches
- **Never duplicate** validation logic across multiple input branches unless strictly required
- **Never emit** contradictory branch outcomes or ambiguous fallback paths
- **Keep one authoritative** mapping or decision point per business rule

When guidance conflicts: preserve existing contracts and choose smallest safe implementation (Lindy + Ponytail).

## Formatting preservation

- JSP defines flow structure, not whole-file whitespace normalization.
- Preserve existing indentation and spacing when applying the initialize →
  input → process → output structure to an existing member.
- Do not reindent or re-space unrelated code unless the developer explicitly
  asks for formatting changes.

## Unbounded Loop Rule

- **Never use truthy sentinel loops:** `Dow ('1' = '1');`, `while(true)`, `DOWHILE 1 = 1`
- **For unbounded/shutdown-safe loops, use canonical forms:**
  - RPGLE: `dow (not %shtdn ) ;` (lowercase dow, explicit %shtdn check)
  - CL: `DOWHILE ?SWITCH = '1'` or explicit exit condition
  - COBOL: `PERFORM UNTIL exit-flag = 1` with structured exit
  - SQL: `LOOP` with explicit `LEAVE` or cursor `NOT FOUND`

## Skill-Specific Application

### codegen-rpgle (RPGLE/SQLRPGLE)
- Apply JSP to **every dcl-proc** (entry procedure + internal procedures)
- For **RPGLEINC members**: JSP does not apply (declaration-only, no executable flow)
- Each procedure must have explicit `dcl-pi` interface and `on-exit;` section
- Each procedure must include a short header synopsis comment block immediately
  above `dcl-proc`.
- Keep RPGLE procedure-header comment lines to 100 columns or fewer; wrap long
  synopsis text to the next `//` line.
- Keep generated RPGLE text and value lines within 100 columns, continuing
  spill-over on the next source line per
  `.github/instructions/ibmi-comment-formats.instructions.md`.
- Program default: `ctl-opt main(main)` with matching `dcl-proc main;` entry.
- Module/service-program default: `ctl-opt nomain`.
- Declaration sequence for RPGLE generation:
  `dcl-f` → `/include` → `dcl-pr` → `dcl-ds` → `dcl-s` → `dcl-enum` → `dcl-c`.
- Procedure error/exit skeleton in every `dcl-proc`:
  `monitor; ... on-error; ... endmon; on-exit; end-proc;`.

### codegen-cblle (COBOL)
- Apply JSP to **every SECTION and PARAGRAPH**
- For **copybook (CPY) artifacts**: JSP does not apply (declaration-only, no executable flow)
- Initialize section/paragraph must be invoked first and only once

### codegen-clle (CL/CLLE)
- Apply JSP to **entire program flow** (PGM / ENDPGM)
- CL programs are single-flow; use explicit IF/ELSE/SELECT for branching
- Initialize via DCL and startup logic before main flow

### codegen-sql (SQL procedures/triggers)
- Apply JSP to **SQL procedures only** (LANGUAGE SQL, BEGIN...END)
- For **table/view/index/trigger DDL**: JSP does not apply (declarative DDL)
- SQL procedures: explicit parameter input validation, SELECT/cursor iteration, deterministic output/return
- Cursor loops are iteration; explicit FETCH/LEAVE for loop exit

### codegen-uim (Panel groups/menus)
- Apply JSP to **menu/panel routing logic**
- UIM structure: `:pnlgrp` → `:keyl` (initialize) → `:menu` / `:panel` (process) → `:help` (output/context)
- `:cond CHKOBJ(...)` guards represent selection branches
- `:menui` options represent iteration (repeated menu items)

## Canonical Subfile List-Hydration Procedure (`DODDRULSH.loadSubfile`)

Use this scaffold when the request involves IBM i interactive maintenance with a
subfile list that must be refreshed before `EXFMT SFLCTL`.

### Purpose and ownership

- `loadSubfile` belongs in the `SH` interactive shell.
- Its job is **presentation-only list hydration**: clear the subfile, fetch the
  visible list rows, map them into subfile fields, and turn display back on.
- This is the repo-approved exception to the general "SH should not fetch
  business data" rule: **list-only hydration may stay in `SH`** for a
  `DODDRULSH`-style maintenance shell.
- `loadSubfile` must **not** own single-row create/read/update/delete behavior,
  commit decisions, or helper side effects. Those stay in `RH` and/or `SP` /
  `FM`.

### Canonical anatomy

1. **Reset presentation state**
   - Turn subfile display off.
   - Turn subfile-control display off.
   - Write the control record once to clear prior rows.
   - Turn control display back on so the next `EXFMT` has a valid shell.
2. **Declare ordered list cursor**
   - Use a deterministic `SELECT` with an explicit `ORDER BY`.
   - Select the hidden business key first, then the columns needed for visible
     subfile fields.
3. **Open cursor with SQL diagnostics**
   - Open the cursor.
   - If open fails, capture `GET DIAGNOSTICS CONDITION 1` details and surface a
     useful message.
4. **Get row count before bulk fetch**
   - Use `GET DIAGNOSTICS :count = DB2_NUMBER_ROWS`.
   - Cap the count to the subfile/array maximum.
5. **Bulk fetch into an array/DS**
   - Size the row array to the count when the language shape allows it.
   - `FETCH ... FOR :count ROWS INTO :rowArray;`
   - Close the cursor as soon as the fetch completes.
6. **Rebuild subfile rows from array data**
   - Clear/reset the RRN before repopulation.
   - Loop from `1` to `count`.
   - Map each array element to subfile fields.
   - Apply display-only shortening or prefix stripping here when needed.
   - Write the subfile record.
7. **Enable display only when rows exist**
   - Turn `SFLDSP` on only when at least one row was written.
   - Leave refresh cadence to the caller (`mustRefresh` in the main loop).

### Canonical scaffold

```rpgle
dcl-proc loadSubfile;
  dcl-pi *n ind;
  end-pi;

  dcl-ds rowArray dim(*auto : 200) qualified;
    listUid int(10) inz(0);
    // additional visible-list fields here
  end-ds;

  dcl-s count int(10) inz(0);
  dcl-s idx int(10) inz(0);

  monitor;
    DspInd.SflDsp = *off;
    DspInd.SflDspCtl = *off;
    write SFLCTL;
    DspInd.SflDspCtl = *on;

    exec sql
      declare cList insensitive scroll cursor for
        select ...
          from ...
         order by ... desc;

    exec sql open cList;
    if (sqlcode < 0);
      exec sql
        get diagnostics condition 1
          :db2MessageId = db2_message_id,
          :db2MessageText = message_text;
      snd-msg *escape 'Open cursor error in ' + %trim(%proc()) + '. ' +
        db2MessageId + ' : ' + %trim(db2MessageText);
    endif;

    exec sql get diagnostics :count = db2_number_rows;
    if (count > 200);
      count = 200;
    endif;

    %elem(rowArray) = count;

    if (count > 0);
      exec sql
        fetch cList for :count rows
          into :rowArray;
    endif;

    exec sql close cList;

    sflRrn = 0;
    for idx = 1 to count;
      sflRrn = idx;
      // map rowArray(idx) -> SFL fields
      // display-only path shortening belongs here
      write SFLRUL;
    endfor;

    if (sflRrn > 0);
      DspInd.SflDsp = *on;
    endif;
  on-error;
    return *off;
  endmon;

  return *on;
on-exit;
end-proc loadSubfile;
```

### Contradiction-resolution rules

- **List-only SQL in `SH` is allowed** for subfile hydration; row-level CRUD is
  not.
- Use **one refresh model only**. Preferred shape: caller sets `mustRefresh`,
  then `loadSubfile` runs before the next `EXFMT`.
- Keep **display-only transformations** in `loadSubfile` and **persistence
  transformations** in detail normalization or handler logic.
- Keep the list query **read-only and deterministic**. No mutations, no side
  effects, no hidden commit behavior.
- Keep displayed option legends aligned with the downstream
  `processSubfileOptions` implementation; do not advertise copy/change/delete
  options that the shell does not actually support.

## Example: RPGLE Entry Procedure

```rpgle
dcl-proc mainProc;
  dcl-pi *n extpgm('MAINPROC');
    p_inValue varchar(256) const options(*nopass : *omit);
  end-pi;

  // ===== INITIALISE =====
  dcl-s response varchar(512) inz('');
  dcl-s status packed(5) inz(0);
  dcl-s hasError ind inz(*off);

  // ===== INPUT =====
  If (not %passed(p_inValue));
    hasError = *on;
    response = 'Parameter required';
  Else;
    // ===== PROCESS =====
    Select;
      When (p_inValue = 'CLEAR');
        response = 'Cleared';
      When (p_inValue = 'REFRESH');
        response = 'Refreshed';
      Other;
        response = 'Unknown: ' + %trim(p_inValue);
    EndSl;
  EndIf;

  // ===== OUTPUT =====
  If (hasError);
    snd-msg *escape response;
  Else;
    *inlr = *on;
  EndIf;

  return;
on-exit;
end-proc;
```

## Cross-Skill Consistency

- All skills use this same JSP structure
- Skills apply JSP to their scope (rpgle: procedures; cobol: sections; sql: procedures; uim: routing)
- Declaration-only artifacts (RPGLEINC, CPY, DDL tables) are exempt from JSP
- Skill-specific files reference this canonical guide with `See JSP scaffold for [scope]`

---

**Version:** 1.0
**Last Updated:** 2026-08-24
**Next Review:** When a skill contradicts this pattern, audit the contradiction and update here.
