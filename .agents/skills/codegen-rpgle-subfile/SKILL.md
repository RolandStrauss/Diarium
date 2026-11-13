---
name: codegen-rpgle-subfile
description: Generate IBM i RPGLE subfile processing code using a proven shell/handler scaffold (initialize, conditional subfile reload, EXFMT loop, READC option handling, detail-screen CRUD flow, optional popup selection flow, and optional IFS edit helpers). Use when user asks for subfile screen logic, detail-plus-subfile maintenance programs, SFL/SFLCTL patterns, or maintainable 5250 interactive loops.
version: 1.0.0
author: Roland Strauss
category: IBMi
tags:
   - ibmi
   - rpgle
   - 5250
   - subfile
---

## RPGLE Subfile Scaffold

Generate deterministic subfile processing code for IBM i RPGLE and SQLRPGLE.

## Strategic modernization guidance (authoritative)

**Canonical Reference:** See `.github/instructions/modernizing-ibmi-applications.instructions.md`.

Use that file when the request is about why a subfile flow should be modernized,
which user pain point should be addressed first, or how interactive maintenance
work fits into the overall IBM i modernization sequence.

- This skill owns subfile-specific RPG flow, helper clustering, SH/RH anatomy,
   and interactive-loop generation.
- The modernization instruction owns the broader interface-modernization and
   process-modernization strategy, including workflow-first thinking and
   iterative rollout.
- Prefer subfile changes that reduce user friction, improve maintainability, and
   separate UI flow from business logic rather than merely repainting old screen
   behavior.

## Ferraria standards authority and role semantics (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-ferraria-standards.instructions.md`.

Use that file as the cross-skill authority when subfile generation touches Legacy Solutions / Ferraria handler roles or layered-responsibility questions.

- `SH` owns interactive presentation flow.
- `SP` / `FM` remain the reusable business/data boundary behind the subfile loop.
- Preserve existing contracts when older names do not cleanly reflect modern SH/RH/CH/SP/FM roles.

## RPGLE anatomy (authoritative)

Apply this anatomy when generating subfile programs/modules.

- Programs: `ctl-opt main(main)` and a matching `dcl-proc main;` entry point.
- Modules/service-program members: `ctl-opt nomain`.

Declaration order:

1. `dcl-f`
2. `/include` (and `/copy` when used)
3. `dcl-pr`
4. `dcl-ds`
5. `dcl-s`
6. `dcl-enum`
7. `dcl-c`

Per-procedure required skeleton:

```rpgle
dcl-proc proc1;
   dcl-pi *n;
   end-pi;

   monitor;
      // business logic
   on-error;
      // error handling
   endmon;

on-exit;
end-proc proc1;
```

Comment rule:
- Keep RPG `//` comment lines at 100 columns or fewer.
- Wrap comments longer than 100 characters to the next `//` line.
- Keep generated text and value lines within 100 columns; put spill-over on the
  next source line at a safe boundary, preserving the resulting value. See
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

## Metadata header format (RPGLE subfile artifacts)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md` for unified IBM i comment and metadata-block rules.

All RPGLE subfile members should start with metadata block, then synopsis, then revision history (after `**free`):

```rpgle
**free
// <Metadata>
// Source Name .........: CUSTMAINT
// Created By ...........: Your Name
// Date Created .........: YYYY-MM-DD
// Source Description ..: Customer maintenance subfile processor.
// Jira ..................: LSPS-XXXX (or N/A)
// </Metadata>
//
// <Synopsis>
// Subfile-based customer CRUD operations. Main loop exfmts SFLCTL,
// loads rows via SQL, processes changed rows via READC SFL.
// Entry: initialize → loadSubfile → EXFMT loop.
// </Synopsis>
//
// <Revision History>
// Revisioner | Date | Jira No (if known) | Change |
// Your Name | YYYY-MM-DD | LSPS-XXXX | Initial scaffold |
// </Revision History>

ctl-opt main(main);
```

**Header rules:**
- Sections in order: Metadata → Synopsis → Revision History → control options / procedures
- All sections use `//` comment style with `<SectionName>` delimiters
- Date format: ISO 8601 (`YYYY-MM-DD`)
- Jira: Full ticket number (for example `LSPS-4295`) or `N/A`
- When modifying existing code, add entry to Revision History; preserve all existing entries
- Place metadata block after `**free`, before first `dcl-c`/`dcl-s`/`/INCLUDE`/`ctl-opt`

**Metadata contents (universal across all skills):**
- Source Name (actual member name)
- Created By (developer name)
- Date Created (ISO 8601: `YYYY-MM-DD`)
- Source Description (single-line summary)
- Jira (ticket or `N/A`)

## Native indentation and spacing (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md`.

- Preserve existing RPG indentation and spacing when editing an existing
   subfile member.
- Do not reindent or re-space unrelated code unless the developer explicitly
   asks for formatting changes.
- Preserve column-sensitive layout for any legacy fixed-form fragments and keep
   Shift-6 placement where those fragments exist.
- For new free-form members, use repo template and validator defaults, then keep
   local block depth and nearby spacing consistent within the edited procedure.

## Ownership and routing

This skill is the canonical owner for **Generate IBM i RPGLE subfile processing** requests.

- Any request for SFL/SFLCTL lifecycle, ReadC option handling, detail option flow, popup subfile flow, or 5250 subfile interactive loop logic belongs here.
- `codegen-rpgle` must hand off those requests to this skill and must not duplicate subfile architecture guidance.
- When a request also needs screen DDS source (`DSPF`/`PRTF`), this skill
   owns subfile program flow only and must delegate screen-source generation to
   `codegen-dspf`.

For shared non-subfile language/platform constraints (for example free-format policy, SQL safety defaults, naming/indicator rules, and validator gates), inherit from:

- `codegen-rpgle` (`.agents/skills/codegen-rpgle/SKILL.md`)

For 5250 presentation-source contracts (`ALIAS`, `DSPATR`, display attribute
fields, displayable-field constraints), inherit from:

- `codegen-dspf` (`.agents/skills/codegen-dspf/SKILL.md`)

This skill codifies two proven subfile families:

- **Default maintenance shell:** `DODDRULSH` + `DODDRULRH` + `DODDRULDF` + `DDGMTRRUL`
- **Default maintenance shell:** `DODDRULSH` + `DODDRULRH` + `DODDRULDF` + `DDGMTRRUL`
- **Optional popup chooser/add-upsert flow:** legacy `WMS001D`-style popup subfile

When user says the program **maintains a file using a detail screen and a subfile**, use the `DODDRULSH` family as the default anatomy, not the popup chooser variant.
When user says the program **maintains a file using a detail screen and a subfile**, use the `DODDRULSH` family as the default anatomy, not the popup chooser variant.

## Proven maintenance anatomy (DODDRULSH pattern)
## Proven maintenance anatomy (DODDRULSH pattern)

Use this as the preferred shape for CRUD-style 5250 maintenance programs:

- `SH` member owns interactive flow, subfile reload cadence, F-key routing, cursor location, and screen rendering.
- `RH` member owns single-row CRUD work and helper side effects behind a request DS contract.
- One DSPF may contain both the list subfile and the detail screen.
- The shell may query list rows directly for subfile load, but single-row create/read/update/delete belongs in the handler.
- Detail maintenance is a small helper cluster, not one giant procedure: `showAddDialog`, `showChangeDialog`, `runDelete`, `loadDetailFromHandler`, `promptDetail`, `normalizeDetailInputs`.
- Optional IFS editing flows hang off the detail screen and are routed through the handler with an explicit helper action.

**Authoritative DSPF Anatomy:** See `codegen-dspf` skill section "DSPF Anatomy & Standard Scaffold" for the proven display-file structure that pairs with this RPGLE shell/handler anatomy. This section describes:
- Record layout (header, subfile detail/control, detail form, function keys, messages)
- Field naming and aliasing requirements
- Overlay and positioning conventions
- Validation checkpoints

Authoritative example in this repo:

- `qrpglesrc/doddrulsh.sqlrpgle` — interactive shell/controller
- `qrpglesrc/doddrulrh.sqlrpgle` — CRUD/request handler
- `qddssrc/doddruldf.dspf` — subfile + detail display file (exemplar of DSPF Anatomy section)
- `qsqlsrc/ddgmtrrul.sql` — maintained SQL table

## RPGLE Shell & Handler Anatomy (SH/RH Pattern) — Authoritative

**Reference Implementation:** `qrpglesrc/doddrulsh.sqlrpgle` (950 lines, SH) + `qrpglesrc/doddrulrh.sqlrpgle` (650 lines, RH).

This section describes the proven dual-program structure for subfile maintenance. Follow this pattern when generating new CRUD shells.

### Shell Program (SH) — Interactive Screen Handler

**Purpose:** Manage 5250 subfile UI, F-key routing, screen refresh, and CRUD delegation to handler.

**Structure (14 sections):**

1. **Metadata Block** (Markdown table)
   ```rpgle
   // <Metadata>
   // Source Name .........: DODDRULSH
   // Created By ...........: Developer Name
   // Date Created .........: YYYY-MM-DD
   // Source Description ..: Screen handler for [entity] maintenance.
   // Jira ..................: LSPS-XXXX
   // </Metadata>
   ```

2. **Synopsis** (Intent + features + design)
   ```rpgle
   // <Synopsis>
   // Displays [entity] list in subfile with options:
   // - F6 Add new record
   // - Option 2/5 Change/Display
   // - Option 4 Delete
   // Delegates CRUD to [entity]RH handler via request DS.
   // Manages display file subfile operations and screen refresh.
   // </Synopsis>
   ```

3. **Revision History** (Markdown table format)

4. **Preprocessor** (`/DEFINE`, `/INCLUDE` of shared control options)

5. **Control Options** (`ctl-opt main(SHELLNAME)`, `text`, `bnddir`)

6. **File Declaration** (Single display file with workstn, sfile, indds)
   ```rpgle
   dcl-f display workstn
         extdesc('[DSPF_NAME]')
         extfile(*extdesc)
         sfile([SFL_RECORD]: sflRrn)
         Infds(Infds)
         indds(DspInd)
         usropn;
   ```

7. **Copy Includes** (Business logic, Datadog metrics modules)

8. **Request Handler DS** (Contract for CRUD delegation)
   ```rpgle
   dcl-ds requestHandler likeds(requestHandler_t);
   ```

9. **Stand-Alone Variables** (Session state)
   ```rpgle
   dcl-s sflRrn                 int(10)         inz(0);  // Subfile RRN
   dcl-s mustRefresh            ind             inz(*on); // Reload trigger
   dcl-s [uid/key]              int(10)         inz(0);   // Selected row key
   dcl-s [metricName]           varchar(50)     inz('');  // Entity working vars
   dcl-s [businessUnit]         varchar(50)     inz('');  // ...
   dcl-s xStatus                ind             inz('0'); // Error flag
   dcl-s xFailed                ind             inz('0'); // Error detail
   dcl-s SflMsgSnd              ind             inz('0'); // Message pending
   dcl-s [APPNAM]               like(sh_appnam) inz(...); // Screen labels
   ```

10. **Constants** (`SUCCESS '1'`, `FAIL '0'`)

11. **Main Procedure (SHELLNAME)** — Jackson-style EXFMT loop
    ```rpgle
    dcl-proc [SHELLNAME];
      Monitor;
        If (Initialize() = FAILED) return; EndIf;
        Dow (not %shtdn);
          If (mustRefresh);
            loadSubfile();
            mustRefresh = *off;
          EndIf;
          renderHeaderFooter();
          exfmt SFLCTL;
          Select InfdsFkey;
            When-in %LIST(F03:F12) Leave;
            When-is(F05) mustRefresh = *on;
            When-is(F06) showAddDialog(); mustRefresh = *on;
            When-is(F21) commandLine();
            Other processSubfileOptions(); mustRefresh = *on;
          EndSl;
        EndDo;
      On-Error; ... EndMon;
      If (%open(display)) close display; EndIf;
    end-proc;
    ```
    - **Initialize()** — Screen validation, display open, label setup
    - **Refresh flag pattern** — Deferred subfile reload after CRUD
    - **EXFMT SFLCTL** — Subfile display + read
    - **F-key dispatch** — Exit, Refresh, Add, Command, or option processing

12. **Subfile Operations**
    - **loadSubfile()** — SQL cursor fetch into array, subfile write loop
      ```rpgle
      exec sql declare cList insensitive scroll cursor for select ... from [TABLE];
      exec sql open cList;
      exec sql get diagnostics :count = db2_number_rows;
      %ELEM(listArray) = count;
      exec sql fetch cList for :count rows into :listArray;
      exec sql close cList;
      sflRrn = 0;
      for idx = 1 to count;
        sflRrn = idx;
        // Map array row to subfile fields
        write [SFL_RECORD];
      endfor;
      ```
    - **processSubfileOptions()** — READC changed rows, dispatch by option (2/4/5)
      ```rpgle
      readc [SFL_RECORD];
      dow (not %eof(display));
        select %int(sfopt);
          when-is 2 showChangeDialog([uid]);
          when-is 4 runDelete([uid]);
          when-is 5 showChangeDialog([uid]);
        endsl;
        clear sfopt;
        update [SFL_RECORD];
        readc [SFL_RECORD];
      enddo;
      ```

13. **Detail Screen Helper Cluster** (6-8 procedures)
    - **showAddDialog()** — Seed defaults, promptDetail, call handler with action 'C'
    - **showChangeDialog(UID)** — Load via handler 'R', populate detail, promptDetail, handler 'U'
    - **runDelete(UID)** — Call handler with action 'D'
    - **loadDetailFromHandler()** — Handler 'R' action, map result to working vars
    - **promptDetail()** — EXFMT detail screen, F6 IFS edit, F7 confirm, F3/F12 cancel
    - **normalizeDetailInputs()** — Trim, uppercase, collect detail fields to handler DS

14. **Optional IFS Edit Support** (if action E is used)
    - **resolveDetailScriptPath()** — Map cursor field to IFS target
    - **ensureDetailScriptPathReady()** — Call handler action 'E' for file create/verify
    - **loadExtendedDetailFields()** — Populate IFS path display fields

### Handler Program (RH) — CRUD Request Processor

**Purpose:** Execute database CRUD operations on behalf of shell. Isolated, testable, stateless worker.

**Structure (Pointer-Based Contract Pattern):**

1-5. **Metadata, Synopsis, Revision, Preprocessor, Control Options** (same format as shell)

6. **Constants** (ACTION codes: `C`, `R`, `U`, `D`, `E`)

7. **Global Variables** (Shadow copies from request DS)
   ```rpgle
   dcl-s g_action              char(1)         inz('');
   dcl-s g_uid                 int(10)         inz(0);
   dcl-s g_metricName          varchar(50)     inz('');
   dcl-s g_sqlState            char(5)         inz(SQLSTATE_OK);
   dcl-s g_sqlCode             int(10)         inz(0);
   dcl-s g_message             varchar(256)    inz('');
   ```

8. **Request Handler DS** (Based on pointer for address-based call)
   ```rpgle
   dcl-ds requestHandler        likeds(requestHandler_t) based(ptrRequestHandler);
   dcl-s ptrRequestHandler      pointer inz(*null);
   ```

9. **Entry Point** (Single procedure receiving pointer)
   ```rpgle
   dcl-proc [HANDLERNAME];
     dcl-pi *n;
       i_Address pointer const;
     end-pi;

     Monitor;
       ptrRequestHandler = i_Address;
       initialize();
       g_action = %upper(%trim(requestHandler.actionCode));
       // Copy request fields to globals
       g_uid = requestHandler.uid;
       g_metricName = requestHandler.metricName;
       // ...

       Select;
         When (g_action = ACTION_CREATE) runCreate();
         When (g_action = ACTION_READ) runRead();
         When (g_action = ACTION_UPDATE) runUpdate();
         When (g_action = ACTION_DELETE) runDelete();
         When (g_action = ACTION_IFS_ENSURE) runEnsureIfsScript();
         Other setFailure(...);
       EndSl;

       // Copy globals back to request DS (results)
       requestHandler.uid = g_uid;
       requestHandler.metricName = g_metricName;
       // ... (all entity fields + status fields)
     On-Error ... EndMon;
   end-proc;
   ```

10. **CRUD Action Procedures** (One per action code)
    | Proc | Action | Pattern |
    |------|--------|---------|
    | `runCreate()` | C | Validate → INSERT → identity_val_local() → setSuccess() |
    | `runRead()` | R | Validate UID → SELECT → setSuccess() or setNoData() |
    | `runUpdate()` | U | Validate UID + fields → UPDATE → setSuccess() or setNoData() |
    | `runDelete()` | D | Validate UID → DELETE → setSuccess() or setNoData() |
    | `runEnsureIfsScript()` | E | Check IFS path → mkdir/touch if needed → setSuccess(1) or setFailure() |

11. **Status Procedures** (Set result fields in globals)
    ```rpgle
    dcl-proc setSuccess;
      dcl-pi *n;
        i_rows int(10) const;
        sqlMessageText varchar(256) const;
      end-pi;
      g_sqlState = SQLSTATE_OK;
      g_sqlCode = 0;
      g_message = sqlMessageText;
    end-proc;

    dcl-proc setNoData;
      dcl-pi *n;
        sqlMessageText varchar(256) const;
      end-pi;
      g_sqlState = SQLSTATE_NO_DATA;
      g_sqlCode = 100;
      g_message = sqlMessageText;
    end-proc;

    dcl-proc setFailure;
      dcl-pi *n;
        i_state char(5) const;
        i_code int(10) const;
        sqlMessageText varchar(256) const;
      end-pi;
      g_sqlState = i_state;
      g_sqlCode = i_code;
      g_message = sqlMessageText;
    end-proc;
    ```

12. **Helper Utilities** (If action E is used)
    - `ifsPathExists()` — SQL via QSYS2.ifs_object_statistics() for directory
    - `ifsFileExists()` — SQL for file (STMF) check
    - `buildQshEnsureCmd()` — Build shell command: mkdir -p + touch
    - `getParentDirectory()` — Parse path to extract parent via %scanr('/')
    - `escapeForQshDoubleQuoted()` — Escape shell metacharacters
    - `escapeForCLLiteral()` — Escape CL apostrophes

### Shell ↔ Handler Communication

| Data | Direction | Mechanism |
|------|-----------|-----------|
| Action code + request fields | Shell → Handler | requestHandler DS (by address) |
| Result fields + status | Handler → Shell | Same DS (fields overwritten) |
| Subfile list | Shell only | SQL cursor + array + subfile write |
| Detail screen | Shell only | EXFMT + field mapping |

### Action Code Reference

| Code | Name | Shell Caller | Handler Action | SQL |
|------|------|--------------|-----------------|-----|
| C | Create | showAddDialog() | runCreate() | INSERT, IDENTITY_VAL_LOCAL() |
| R | Read | loadDetailFromHandler() | runRead() | SELECT single row WHERE [UID] |
| U | Update | showChangeDialog() | runUpdate() | UPDATE ... WHERE [UID] |
| D | Delete | runDelete() | runDelete() | DELETE FROM ... WHERE [UID] |
| E | Ensure IFS | promptDetail() F6 | runEnsureIfsScript() | mkdir -p + touch via qsh |

## Jackson-style structure diagram

Use this Jackson-style decomposition for detail-plus-subfile maintenance programs.

```text
DODDRULSH
DODDRULSH
sequence
├─ Initialize
├─ iterate until F03/F12 or %shtdn
│  ├─ select mustRefresh
│  │  └─ true → loadSubfile → mustRefresh = *off
│  ├─ renderHeaderFooter
│  ├─ EXFMT SFLCTL
│  └─ select InfdsFkey / option context
│     ├─ F03/F12 → exit loop
│     ├─ F05 → mark refresh
│     ├─ F06 → Add flow
│     │  ├─ seed defaults
│     │  ├─ promptDetail
│     │  └─ confirm? yes → normalizeDetailInputs → RH(C)
│     ├─ F21 → command line
│     └─ other → processSubfileOptions
│        └─ iterate READC subfile rows
│           ├─ option 2/5 → Change or Display flow
│           │  ├─ RH(R)
│           │  ├─ map detail fields
│           │  ├─ promptDetail
│           │  └─ confirm? yes → normalizeDetailInputs → RH(U)
│           ├─ option 3 → Copy only if explicit copy logic exists
│           └─ option 4 → RH(D)
└─ close display
```

## Source Member Naming (IBM i Standard: 10-character Maximum)

**Authoritative Reference:** See `.github/instructions/ibmi-source-naming.instructions.md` for complete naming standards and rules.

This skill inherits naming enforcement from `codegen-rpgle`. All subfile program members generated by this skill must comply with the 10-character maximum member-name standard for IBM i objects. The `generate-rpgle-member.py` script (shared with codegen-rpgle) automatically enforces this via `normalize_name()` function.

**Example:**
- Input: `"CustomerDetailSubfile"`
- Normalized: `CUSTOMERDE` (10 chars max)
- Applied to: program name, module name, entry procedure name contract

For details and rationale, see the naming reference file above.

## Companion DSPF contract (required for generated subfile flows)

Subfile logic generated by this skill assumes a companion DSPF that is produced
or validated by `codegen-dspf`.

Required DSPF assumptions:

- Program-addressable fields include `ALIAS(...)`.
- Displayable fields include `DSPATR(&<FIELDNAME>A)`.
- Matching `<FIELDNAME>A` fields exist as `1A P` in the same record format.
- Displayable field names obey DSPF constraints (for example 1..9 chars).

If these assumptions are not met, regenerate/fix the DSPF with `codegen-dspf`
before finalizing RPG subfile logic.

## Core subfile architecture

1. **Interactive shell (`SH`)**
    - Main procedure owns `EXFMT` loop, refresh flag, screen header/footer writes, and F-key routing.
    - Uses `loadSubfile` for list refresh and `processSubfileOptions` (or legacy `processSubfile`) for changed-row dispatch.

2. **Primary maintenance subfile**
    - One list subfile record + control pair (for example `SFLRUL` + `SFLCTL`, or generic `SFL` + `SFLCTL`).
    - Loaded by one routine via SQL cursor + array bulk fetch.
    - Processed by `READC`, not `READ`.

3. **Detail maintenance helper cluster**
    - Preferred helper split: `showAddDialog`, `showChangeDialog`, `runDelete`, `loadDetailFromHandler`, `promptDetail`, `normalizeDetailInputs`.
    - If a user explicitly wants one wrapper such as `detailRecord`, that wrapper should delegate to these phases instead of collapsing all logic into one opaque block.

4. **Request handler (`RH`)**
    - Separate CRUD worker behind a request DS (`actionCode`, key, data fields, status/result fields).
    - Handles `C`, `R`, `U`, `D`, and optional helper actions such as `E` for IFS-file preparation.

5. **Optional IFS edit helper**
    - Detail screen may support cursor-aware F6 editing of STMF-backed SQL/table-definition files.
    - Shell resolves the target path from the cursor field; handler ensures existence/creation policy.

6. **Optional popup subfile**
    - Generate only when user explicitly needs a chooser subfile in addition to the main maintenance subfile.
    - Popup selection flow is an extension, not the default anatomy for CRUD shell programs.

## Inputs required

Collect these values first. If unknown, ask or use defaults.

- Program and collaborator names:
  - `PROGRAM_NAME` (default `MYPGM`)
   - `HANDLER_PROGRAM` (default `<PROGRAM_NAME>RH` when SH/RH split is used)
  - `DSPF_FILE` (default `MYDSPF`)
   - `TABLE_NAME` (required for maintenance programs)
   - `REQUEST_DS` (default `requestHandler`)
- Subfile formats:
  - `SFL_RECORD` (default `SFL`)
  - `SFL_CONTROL` (default `SFLCTL`)
  - `RRN_FIELD` (default `SflRRN`)
- Detail-screen formats:
   - `DETAIL_RECORD` (default `DETAIL`)
   - `DETAIL_FKEY_RECORD` (default `DTL_FKEY`)
   - `HEADER_RECORD` (default `SH_HDR`)
   - `LIST_FKEY_RECORD` (default `SFT_FKEY`)
- Optional popup subfile formats:
  - `POPUP_SFL_RECORD` (default `SFLW`)
  - `POPUP_SFL_CONTROL` (default `SFLWCTL`)
  - `POPUP_RRN_FIELD` (default `sflwrrn`)
- Indicator and key model:
  - `DISPLAY_IND_DS` (default `DspInd`)
  - `SFLDSPCTL_IND` (default `SflDspCtl`)
  - `SFLDSP_IND` (default `SflDsp`)
   - `INITIAL_REFRESH_FLAG` (default `mustRefresh`)
  - `FKEY_SOURCE` (default `InfdsFkey`)
  - `EXIT_KEYS` (default `F03,F12`)
- Option and message model:
   - `OPTION_FIELD` (default `SFOPT`)
   - `UID_FIELD` (default selected hidden key field, for example `SFUID`)
  - `MESSAGE_FLAG` (default `SflMsgSnt`)
  - `MESSAGE_RECORD` (default `MSGCTL`)
   - `VALID_OPTIONS` (default `2,4,5`; add `3` only when copy semantics are real)
   - `ADD_KEY` (default `F06`)
   - `REFRESH_KEY` (default `F05`)
   - `COMMAND_KEY` (default `F21`)
   - `DETAIL_CONFIRM_KEY` (default `F07`)
- SQL sources:
   - `LOAD_QUERY` (required list query)
  - `DETAIL_QUERY` (optional)
   - `UPSERT_OR_UPDATE_SQL` (required unless routed fully through handler)
- Handler action codes:
   - `CREATE_ACTION` (default `C`)
   - `READ_ACTION` (default `R`)
   - `UPDATE_ACTION` (default `U`)
   - `DELETE_ACTION` (default `D`)
   - `HELPER_ACTIONS` (optional, for example `E=ensure path`)
- Authority model:
  - `ACCESS_LEVEL_EXPR` (example `AccessLevelDS.AccessLevel`)
  - `VIEW_THRESHOLD` (example `2`)
  - `MAINT_THRESHOLD` (example `1`)

## Output contract

When invoked, output these artifacts in this order.

1. `Main shell procedure skeleton`
2. `initialize procedure`
3. `renderHeaderFooter procedure`
4. `loadSubfile procedure`
5. `processSubfileOptions` / `processSubfile procedure`
6. `showAddDialog procedure`
7. `showChangeDialog procedure`
8. `runDelete procedure`
9. `loadDetailFromHandler procedure`
10. `promptDetail procedure`
11. `normalizeDetailInputs procedure`
12. `Handler request DS contract`
13. `selectPopupSubfile procedure` (only if popup formats provided)
14. `Integration checklist`

Keep names and format identifiers parameterized from Inputs required.
For legacy members with contractual naming, aliases such as `Initialise`/`LoadSubfile`/`ProcessSubfile`/`DetailRecord`/`SelectPopupSubfile` are acceptable.
If the user wants a compact wrapper named `detailRecord`, generate it as an orchestrator over the helper cluster above rather than as the only detail procedure.

## Main procedure scaffold

Generate this structure with exact control flow semantics.

```rpgle
// Main interactive loop
if (initialize() = *off);
   return;
endif;

dow (not %shtdn);
   if (mustRefresh);
      loadSubfile();
      mustRefresh = *off;
   endif;

   renderHeaderFooter();
   exfmt SFLCTL;

   select InfdsFkey;
      when-in %list(F03:F12);
         leave;
      when-is (F05);
         mustRefresh = *on;
      when-is (F06);
         showAddDialog();
         mustRefresh = *on;
      when-is (F21);
         commandLine();
      other;
         processSubfileOptions();
         mustRefresh = *on;
   endsl;
enddo;
```

Rules:
- Prefer a refresh-flag (`mustRefresh`) for CRUD maintenance shells so reload happens before the next `EXFMT`, not blindly on every pass.
- If a legacy member intentionally reloads every pass, keep that single strategy consistently and do not add a second refresh model.
- Keep command-line key path isolated from option processing.
- `renderHeaderFooter` owns `SH_HDR`, list F-key record, and deterministic `MSGCTL` rendering.

## initialize procedure scaffold

Purpose:
- Validate workstation prerequisites.
- Validate user authorization.
- Resolve pointer/state inputs.
- Open display file once.
- Seed panel labels, option text, and initial refresh state.

Required sequence:
1. Screen-size validation if project mandates a minimum DS mode.
2. Access/authorization lookup.
3. Workflow/context key extraction.
4. Open display when not already open.
5. Seed `mustRefresh = *on` (or equivalent initial list-load state).
6. Return `*on` for success, `*off` for blocked state.

Rule:
- The displayed option legend must match the implemented dispatch. Do not display `3=Copy` unless the member contains real copy/create-from-source behavior.

## loadSubfile procedure scaffold

**Authoritative Reference:** See
`.github/instructions/ibmi-jsp-scaffold.instructions.md`, section
`Canonical Subfile List-Hydration Procedure (DODDRULSH.loadSubfile)`.

Generate `loadSubfile` as the shell-owned, presentation-only list-hydration
routine used by `DODDRULSH`-style maintenance flows.

Rules:
- Clear the subfile by turning `SFLDSP` and `SFLDSPCTL` off, then `write
  SFLCTL`, then turn `SFLDSPCTL` back on.
- Use `GET DIAGNOSTICS ... DB2_NUMBER_ROWS` to size bulk fetch.
- Cap to subfile max rows / array capacity.
- Always reset RRN before repopulation; `sflRrn = idx` is preferred when the
  list loop already tracks the row number.
- Set display indicator only when at least one row is loaded.
- If the table stores full IFS paths, strip or shorten them for display only;
  keep persistence values intact in handler/detail normalization logic.
- Keep list loading read-only and deterministic. No CRUD, no commits, no helper
  side effects belong here.

## processSubfile / processSubfileOptions procedure scaffold

Generate changed-row processing with option dispatch.

```rpgle
readc SFL;

dow (not %eof(display));
   select %int(SFOPT);
      when-is 2;
         showChangeDialog(SFUID);
      when-is 3;
         // generate only when copy semantics exist
         showCopyDialog(SFUID);
      when-is 4;
         runDelete(SFUID);
      when-is 5;
         showChangeDialog(SFUID); // protected display mode
      other;
         snd-msg 'Only implemented options are valid.';
   endsl;

   clear SFOPT;
   update SFL;
   readc SFL;
enddo;
```

Rules:
- Use `READC`, never `READ`, for option-processing rows.
- Clear option field after each processed row.
- Update the row to persist visual and option reset.
- Keep authority validation near privileged option handling.
- Keep option text and dispatch logic in sync; never advertise an option that routes somewhere else.
- Option `5=Display` may reuse change-detail loading, but confirm/write behavior must be disabled unless update mode is explicit.
- Choose one return contract and keep it consistent: either
  - indicator-returning procedure (`dcl-pi *n ind; ... return *on/*off;`) or
  - non-returning procedure (`dcl-pi *n; ... return;`).

## Detail maintenance helper cluster (preferred)

Purpose:
- Keep detail flow explicit and testable for add/change/delete/display contexts.

Required behavior:
1. `showAddDialog`
   - Clear working variables and request DS.
   - Seed defaults (for example `CollectorRequired='Y'`, `RecordStatus='A'`, mode flag for add).
   - Call `promptDetail`.
   - On confirm, normalize inputs and call handler with create action.
2. `showChangeDialog(selectedUid)`
   - Save selected UID.
   - Call `loadDetailFromHandler` using read action.
   - Map handler values into detail fields.
   - Call `promptDetail`.
   - On confirm, normalize inputs and call handler with update action.
3. `runDelete(selectedUid)`
   - Route delete through handler with explicit delete action.
   - If domain requires soft delete instead of hard delete, implement that in the handler and label it correctly.
4. `loadDetailFromHandler`
   - Use request DS + read action to hydrate one row.
   - Copy returned values into both working variables and detail-screen fields.
5. `normalizeDetailInputs`
   - Trim, upper/lowercase, and map display-only path fields back into persisted values.
6. Optional `showCopyDialog(selectedUid)`
   - Generate only when option `3=Copy` is real.
   - Read source row, seed add-like detail values, then persist through create/copy semantics rather than update.

Wrapper rule:
- A single `detailRecord()` wrapper is allowed only as an orchestrator over the helper cluster above.

## promptDetail procedure scaffold

Generate a dedicated detail-screen prompt loop.

```rpgle
dow (not %shtdn);
   write SD_FKEY;
   exfmt EXTRULEDTL;

   select InfdsFkey;
      when-in %list(F03:F12);
         return *off;
      when-is (F06);
         // optional cursor-aware STMF edit flow
         iter;
      when-is (F07);
         return *on;
      when-is (F21);
         commandLine();
      when-is (ENTER);
         // validate / redisplay only unless Enter is explicitly the commit key
      other;
   endsl;
enddo;
```

Rules:
- Pick one canonical confirm path. If `F07` confirms, `Enter` must not silently commit.
- If display and change share the same detail record, use a mode flag or protected fields to prevent accidental update on display.

## Handler request/response contract

Preferred SH/RH contract for maintenance programs:

```rpgle
dcl-ds requestHandler_t qualified template;
  actionCode        char(1);
  uid               int(10);
  metricName        varchar(50);
  businessUnit      varchar(50);
  collectorRequired char(1);
  createMissing     char(1);
  tableDefinition   varchar(100);
  tableLoadSql      varchar(100);
  recordStatus      char(1);
end-ds;
```

Rules:

- `SH` sets the action code and sends the DS address to `RH`.
- `RH` copies DS values into locals, performs exactly one action branch, and copies results/status back to the DS.
- List-load SQL may stay in `SH`; single-row CRUD and external side effects belong in `RH`.

## Optional IFS edit helper scaffold

Generate this only when the maintained row stores STMF names or paths that users must edit from the detail screen.

Pattern:

1. Resolve the target path from cursor field name (`RTNCSRLOC`).
2. If no field qualifies, display a clear message and redisplay detail.
3. Route existence/create policy through handler helper action (for example `E=ensure path`).
4. On success, launch `EDTF STMF(...)`.
5. Keep display-friendly short names separate from persisted full paths.

## selectPopupSubfile procedure scaffold

Generate this only when popup formats are part of the input or the user explicitly asks for a chooser/add-upsert popup.

Pattern:
1. Clear popup subfile (`SFLWCTL`) using display indicators.
2. Cursor query for selectable candidates.
3. Bulk fetch into array.
4. Populate popup subfile rows and enable display when non-empty.
5. `EXFMT SFLWCTL`, respect cancel keys.
6. `READC SFLW` for selected row.
7. Apply `MERGE` or idempotent upsert to relation table.

## SQL and data integrity rules

- Prefer idempotent `MERGE` for add-link operations.
- For remove from relationship screens, choose hard delete vs soft delete explicitly and label the option text/handler behavior accordingly.
- When detail fetch may miss, handle `sqlcode = 100` with user-facing message.
- Use explicit key predicates from selected subfile fields.
- If SH strips path prefixes for display, restore or preserve persisted values before create/update.

## Error and message rules

- Wrap each procedure in `monitor/on-error`.
- Emit `snd-msg *escape 'Internal Error in: ' + %proc();` on unhandled exceptions.
- Use a message flag so `MSGCTL` rendering is deterministic and can be cleared after `EXFMT`.
- Keep header/F-key/message writes in one helper (`renderHeaderFooter`) so main-loop rendering stays deterministic.

## Canonical lifecycle and contradiction resolution

Use these rules to eliminate ambiguity and duplicate control paths.

- **Loop shape (authoritative):** for unbounded interactive loops, use `dow (not %shtdn ) ;`.
- **ReadC semantics:** changed-row loop terminates by EOF; exit keys may short-circuit, but do not implement a second independent termination model for the same loop.
- **Shell/handler split:** `SH` owns UI, list loading, and cursor/F-key logic; `RH` owns single-row CRUD and helper side effects.
- **Rebuild cadence:** use one refresh strategy only. Preferred pattern is `mustRefresh` before `EXFMT`; never rebuild again inside per-row `READC` handling.
- **Delete semantics:** do not assume soft delete or hard delete by default; make the chosen behavior explicit in both handler logic and user-facing option text.
- **Authority model:** apply both entry-level and option-level checks, each in one canonical location.
- **Option parity:** displayed option legend and implemented dispatch must match exactly.
- **Confirm parity:** if `F07` confirms, `Enter` is validate/redisplay only unless explicitly implemented as commit.
- **Popup status:** popup subfile is optional extension; do not force it into detail-plus-subfile maintenance programs.
- **Path split:** display-shortened STMF names may differ from persisted full paths, but normalization logic must make that conversion explicit.
- **Procedure naming:** prefer camelCase canonical names (`initialize`, `loadSubfile`, `processSubfile`, `detailRecord`, `selectPopupSubfile`); preserve legacy names only when contractual.
- **Row caps:** cap visible/fetch volumes explicitly (for example subfile max rows and array upper bounds).

## Canonical symbol map defaults

- Main subfile formats: `SFL`, `SFLCTL`
- Detail records: `EXTRULEDTL`, `SD_FKEY` (example maintenance shell names)
- Popup subfile formats: `SFLW`, `SFLWCTL`
- RRN counters: `SflRRN`, `sflwrrn`
- Option field: `SFOPT`
- Key source: `InfdsFkey`
- Display indicators: `DspInd.SflDspCtl`, `DspInd.SflDsp`
- Message state: `SflMsgSnt` + `MSGCTL`

## Integration checklist

Return this checklist after generation.

- `sfile(...)` declarations match generated format names.
- RRN fields declared and cleared before each load.
- `EXFMT` targets control record, not subfile record.
- Main loop uses one refresh strategy (`mustRefresh` preferred) and does not reload inside `READC` handling.
- `READC` loop clears option and updates row.
- Option legend matches implemented dispatch.
- Detail confirm key is explicit; Enter is not an undocumented commit path.
- SQL cursor open/fetch/close order is correct.
- Row cap respects subfile maximum.
- Exit key handling is consistent across main/detail/popup loops.
- SH/RH request DS contract is explicit when using shell/handler split.
- Error monitoring exists in all generated procedures.
- Unbounded interactive loops use `dow (not %shtdn ) ;`.

## Example invocation prompt

Use this to drive the skill.

```text
Generate SQLRPGLE detail-plus-subfile maintenance logic using rpgle-subfile-scaffold.
PROGRAM_NAME=DODDRULSH
HANDLER_PROGRAM=DODDRULRH
DSPF_FILE=DODDRULDF
PROGRAM_NAME=DODDRULSH
HANDLER_PROGRAM=DODDRULRH
DSPF_FILE=DODDRULDF
TABLE_NAME=DDGMTRRUL
REQUEST_DS=requestHandler
SFL_RECORD=SFLRUL
SFL_CONTROL=SFLCTL
RRN_FIELD=SflRRN
DETAIL_RECORD=EXTRULEDTL
DETAIL_FKEY_RECORD=SD_FKEY
HEADER_RECORD=SH_HDR
LIST_FKEY_RECORD=SFT_FKEY
DISPLAY_IND_DS=DspInd
SFLDSPCTL_IND=SflDspCtl
SFLDSP_IND=SflDsp
INITIAL_REFRESH_FLAG=mustRefresh
FKEY_SOURCE=InfdsFkey
OPTION_FIELD=SFOPT
UID_FIELD=SFUID
VALID_OPTIONS=2,4,5
ADD_KEY=F06
REFRESH_KEY=F05
COMMAND_KEY=F21
DETAIL_CONFIRM_KEY=F07
LOAD_QUERY=SELECT UIDDDGMTR, MTRNAM, BUSUNI, TABREQ, TABDFN, LODSQL, RCDSTS FROM DDGMTRRUL ORDER BY UIDDDGMTR DESC
DETAIL_QUERY=SELECT ... FROM ... WHERE key=:sf_key
CREATE_ACTION=C
READ_ACTION=R
UPDATE_ACTION=U
DELETE_ACTION=D
HELPER_ACTIONS=E
UPSERT_OR_UPDATE_SQL=UPDATE DDGMTRRUL SET ... WHERE UIDDDGMTR=:uid
ACCESS_LEVEL_EXPR=AccessLevelDS.AccessLevel
VIEW_THRESHOLD=2
MAINT_THRESHOLD=1
```

## Notes for generators

- Keep procedure boundaries explicit: `initialize`, `renderHeaderFooter`, `loadSubfile`, `processSubfileOptions`, `showAddDialog`, `showChangeDialog`, `runDelete`, `loadDetailFromHandler`, `promptDetail`, `normalizeDetailInputs`, and `selectPopupSubfile` when requested.
- Keep variable names stable unless inputs explicitly override.
- Preserve 5250 interactive semantics over abstraction.
- Prefer shortest working diff when integrating into an existing program.
- Add a header comment block immediately above every `dcl-proc` with the
   procedure name and a short synopsis.
- Keep RPGLE comment lines to 100 columns or fewer; if synopsis text is longer,
   wrap to the next `//` line.
- Keep generated text and value lines within 100 columns; continue any spill-over
   on the next source line without changing the resulting value. See
   `.github/instructions/ibmi-comment-formats.instructions.md`.
- If using the SH/RH split, generate the request DS and action-code contract once and reuse it consistently across add/read/update/delete/helper flows.
