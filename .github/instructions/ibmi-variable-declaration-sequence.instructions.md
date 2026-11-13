---
description: Canonical variable declaration sequence for all IBM i artifacts
---

# Canonical Variable Declaration Sequence (authoritative)

**When creating variables (global or local within a procedure), follow this strictly ordered sequence:**

1. **Files** — `dcl-f` file declarations
2. **Includes** — `/INCLUDE` directives and copybook references
3. **Copy member include of declaratives** — `/COPY` statements for shared declarations
4. **Procedure Interface** — `dcl-pi` (within a procedure only)
5. **Data Structures** — `dcl-ds` definitions (qualified, template, regular, likeds-based)
6. **Stand Alone Variables** — `dcl-s` declarations (scalar, pointer, array types)
7. **Enumeration** — `dcl-enum` definitions (domain constants, named value sets)
8. **Constants** — `dcl-c` declarations (immutable compile-time values)

## Detailed Rules by Category

Scope clarification:

- This sequence governs **variable declarations** (for example `dcl-pr`, `dcl-ds`, `dcl-s`, `dcl-enum`, `dcl-c`) and include/copy declaration sources.
- Interface/prototype declarations that are not variables (for example RPG `dcl-pr`) are outside this sequence and should follow artifact-specific interface conventions.
- This sequence governs **declaration order only**; it does not authorize
  indentation, spacing, or alignment churn in existing source.

## Formatting preservation

- Preserve existing indentation and spacing when reordering is not required for
  the requested change.
- If declarations must be inserted into an existing member, match the local
  indentation and spacing already used by the surrounding declaration block.
- Do not reindent or re-space unrelated declarations unless the developer
  explicitly asks for formatting changes.

### Files and Includes (Position 1 — File Level)

- Place `/INCLUDE` and `/COPY` after `ctl-opt` and before any `dcl-*` declarations
- Never intermix file-level includes with procedure-level declarations
- Order by dependency: foundational copybooks first
- Example order: SQLCA → domain constants copybook → shared prototypes → shared data structures

### Copy Member Declaratives (Position 2 — File Level)

- Declarative copybooks go second, supporting file-level declarations
- Typically shared prototypes, domain constants, or template data structures
- Must come before any usage of the declarations they provide
- Keep separate from procedural includes

### Procedure Interface (Position 3 — Procedure Level Only)

- `dcl-pi` appears immediately after `dcl-proc`, defining the entry interface
- Parameters use `p_` prefix with lowerCamelCase naming
- Local to the procedure; does not affect file-level sequence
- Never intermix procedure interface declarations with other variable types

### Data Structures (Position 4 — File or Procedure Level)

- All `dcl-ds` declarations (qualified, template, regular, likeds-based)
- Group related structures by dependency (base definitions before derived)
- If using `likeds(...)`, place the template definition before any usage
- Never declare data structures inside a `dcl-pi` block
- Keep DS definitions contiguous and grouped

### Stand Alone Variables (Position 5 — File or Procedure Level)

- All `dcl-s` declarations (scalar types, pointers, arrays)
- Include initialization (`inz(...)`) to avoid undefined values
- Group by logical purpose and lifetime (module-level → procedure-level)
- Order from longest-lived to shortest-lived variables
- Keep all scalar declarations in one contiguous block

### Enumeration (Position 6 — File or Procedure Level)

- All `dcl-enum` and domain value sets
- Must appear before any declaration that directly depends on the enum type
- Prefer over magic values for multi-state logic
- Place after stand alone variables, before constants (canonical sequence)

Dependency exception (explicit):

- If a stand alone variable must be typed from an enum (`like(MyEnum)` or equivalent), place that enum immediately before the dependent declaration, then continue with the canonical order.
- This is the only allowed ordering exception and should be kept minimal/local.

### Constants (Position 7 — File or Procedure Level)

- All `dcl-c` declarations (immutable, compile-time values)
- Place last so they can reference earlier declarations without forward-reference issues
- Global constants used by all procedures; local constants scoped to a procedure
- Grouping: system constants first, then domain-specific constants, then calculated constants

## Practical Example (RPGLE Procedure)

```rpgle
dcl-proc myProc;
  // 3. Procedure Interface (always first after dcl-proc)
  dcl-pi *n varchar(256);
    p_inputId    int(10) const;
    p_outputMsg  varchar(512);
  end-pi;

  // 4. Data Structures
  dcl-ds ErrorInfo_t qualified;
    code     char(7);
    message  varchar(512);
  end-ds;

  dcl-ds Result_t;
    status   ind;
    value    varchar(256);
  end-ds;

  // 5. Stand Alone Variables
  dcl-s errorCount      int(10) inz(0);
  dcl-s processStatus   ind inz(*off);
  dcl-s resultValue     varchar(256) inz(*Blank);
  dcl-s tempBuffer      varchar(1024) inz(*Blank);

  // 6. Enumeration
  dcl-enum ProcessState;
    IDLE value(0);
    RUNNING value(1);
    COMPLETE value(2);
    ERROR value(3);
  end-enum;

  // 7. Constants
  dcl-c MAX_RETRIES    const(3);
  dcl-c TIMEOUT_SECS   const(30);
  dcl-c SUCCESS_FLAG   const('Y');

  // ... procedure logic follows ...
on-exit;
end-proc;
```

## File-Level Example (RPGLE/SQLRPGLE)

```rpgle
**free
ctl-opt main(mainProc)
        datfmt(*iso)
        timfmt(*iso);

// 1. Files and Includes (INCLUDE must come after ctl-opt)
/INCLUDE 'qrpglesrc/sqlca.rpgleinc'
/INCLUDE 'qrpglesrc/shared_constants.rpgleinc'

// 2. Copy Member Declaratives
/COPY 'qrpglesrc/domain_types.rpgleinc'
/COPY 'qrpglesrc/api_prototypes.rpgleinc'

// 4. File-Level Data Structures (if any)
dcl-ds GlobalError_t qualified;
  code char(7);
  message varchar(512);
end-ds;

// 5. File-Level Stand Alone Variables (if any)
dcl-s globalCounter int(10) inz(0);
dcl-s globalStatus ind inz(*off);

// 6. Enumeration (if any)
dcl-enum GlobalState;
  INIT value(0);
  READY value(1);
  DONE value(2);
end-enum;

// 7. File-Level Constants
dcl-c APP_VERSION const('1.0.0');
dcl-c MAX_ROWS const(10000);
```

## Why This Sequence Matters

1. **Readability** — Variables are organized predictably; readers always know where to find declarations
2. **Dependency Resolution** — Each section depends only on sections before it
3. **Compilation Safety** — Prevents forward-reference errors (using a constant before declaring it)
4. **Consistency** — Uniform ordering across all procedures and files
5. **Maintainability** — New variables fit into the correct position without disrupting existing code
6. **Team Communication** — Everyone follows the same pattern; no debate about declaration order

## Anti-Patterns (Never Do This)

❌ **Interleaving** — Mixing constants with stand-alone variables, or spreading dcl-ds statements throughout

❌ **Forward References** — Using a constant in variable initialization before the constant is declared

❌ **Procedure-Level Includes** — Placing file-level includes inside a procedure

❌ **Late Data Structure Definitions** — Declaring a data structure after variables that use it

❌ **Scattered Initialization** — Initializing stand-alone variables in logic blocks instead of at declaration time

❌ **Incomplete Grouping** — Splitting related variables across different sections of the procedure

## Enforcement in Generated Code

When generating any IBM i source:

1. Verify declaration sequence: Files (`dcl-f`) → Includes (`/INCLUDE`) →
  Copies (`/COPY`) → PI → DS → Stand Alone Variables → Enumeration →
  Constants
2. Group by category; keep related items together
3. For large procedures (>50 lines of declarations), separate sections with blank lines and comments
4. If refactoring moves variables, preserve this sequence
5. For file-level declarations, maintain the same sequence at the file scope

## Language-Specific Application

### RPGLE/SQLRPGLE

- Apply to both file-level and procedure-level declarations
- File-level: follows `ctl-opt` directive
- Procedure-level: follows `dcl-proc` and `dcl-pi`

### COBOL/CBLLE/SQLCBLLE

- Apply to WORKING-STORAGE SECTION declarations
- Map sequence to COBOL structure: FILES → COPY sections → WORKING-STORAGE items (grouped by type)

### CL/CLLE/CLP

- Apply to `DCL` statements and parameter grouping
- Order: files → parameters → work variables → constants

### SQL

- Apply to stored procedure/trigger declarations
- Order: parameters → local variables → constants

### DDS (PF/LF/DSPF/PRTF)

- Apply to field/key declaration order within record formats
- Order: key fields → data fields → constant field attributes

### UIM (MENU/PNLGRP)

- Apply to variable and constant declarations within panels
- Order: parameters → work fields → constants → enumerations
