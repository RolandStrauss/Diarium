---
applyTo: .agents/skills/codegen-rpgle, .agents/skills/codegen-cblle, .agents/skills/codegen-clle
description: Canonical service program and module patterns for IBM i. Covers module/service program architecture, binding, export strategies, and backward compatibility across all code generation skills.
---

# IBM i Service Programs & Modules — Canonical Architecture

**Authoritative Reference** — When generating reusable APIs, shared business logic, or module-based components, apply this canonical architecture pattern. Applicable to RPGLE, COBOL, and CL skills.

## Architecture Philosophy

- **Prefer module + service program** for reusable logic
- **Use program entry points only** for orchestration or single-use functionality
- **Keep public APIs explicit** and versioned
- **Keep implementation private** and testable
- **Never rely on `EXPORT(*ALL)`** for production service programs
- **Version signatures** for breaking API changes (backward compatibility strategy)
- **Preserve existing indentation and spacing** when editing existing service
  artifacts unless the developer explicitly asks for formatting changes

## Core Pattern

### 1. Split of Responsibilities

| Artifact | Purpose | Binding |
|----------|---------|---------|
| **Module (.rpgle, .cblle, .clle)** | Reusable logic (procedures/functions) with `ctl-opt nomain` | Compiled to object, not directly callable |
| **Service Program (.srvpgm)** | Bound collection of exported modules; versioned API surface | Callable from programs/modules via binding directory |
| **Prototype Include (.rpgleinc, .cpy)** | Public API contract; procedure prototypes only | Shared with all consumers |
| **Binder Source (.bnd)** | Export strategy and signature versioning | Controls which procedures are public and backward compat |
| **Consumer Program** | Uses service program via binding directory + prototype include | Links at compile time |

### 2. Control Options by Artifact Type

#### Module (RPGLE)
```rpgle
**free
ctl-opt nomain
        option(*srcstmt: *nodebugio)
        datfmt(*iso)
        timfmt(*iso)
        dftactgrp(*no)
        actgrp(*caller);

dcl-proc publicProc export;
  dcl-pi *n varchar(256);
    p_input varchar(256) const;
  end-pi;
  ...
on-exit;
end-proc;

dcl-proc privateHelper;
  dcl-pi *n ...;
  end-pi;
  ...
on-exit;
end-proc;
```

**Rules:**
- `ctl-opt nomain` (module, not standalone program)
- `actgrp(*caller)` (reuse caller's activation group)
- `dftactgrp(*no)` (explicit group management)
- Only mark public procedures with `export`
- Private procedures omit `export`
- Canonical declaration order:
  `dcl-f` → `/include` → `dcl-pr` → `dcl-ds` → `dcl-s` → `dcl-enum` → `dcl-c`
- Procedure skeleton must include:
  `dcl-pi` + `monitor/on-error/endmon` + `on-exit` before `end-proc`
- Keep RPG `//` comment lines at 100 columns or fewer; wrap long comments.
- Keep generated RPGLE text and value lines within 100 columns, continuing
  spill-over on the next source line per
  `.github/instructions/ibmi-comment-formats.instructions.md`.

#### Module (COBOL)
```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. MYUTIL COMMON.
      *> COMMON keyword makes this reusable module
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       ...
       PROCEDURE DIVISION.
           CALL publicProc.
           STOP RUN.

       SECTION publicProc.
           ...
```

**Rules:**
- `PROGRAM-ID ... COMMON` (module/reusable)
- Omit `STOP RUN` or use only for error exits
- Private paragraphs don't need special marking (COBOL linkage convention)

#### Module (CL)
```cl
      PGM PARM(&ACTION &VALUE)
      DCL VAR(&ACTION) TYPE(*CHAR) LEN(10)
      DCL VAR(&VALUE) TYPE(*CHAR) LEN(256)

      IF COND(&ACTION = 'INITIALIZE') THEN(DO)
         CALL IASQ_INIT
         RETURN
      ENDDO
      ...
      ENDPGM
```

**Rules:**
- CL program must have `PARM` clause for module reusability
- Keep logic modular; prefer CLLE with explicit parameter passing
- Use CALL to invoke helper commands/programs

---

### 3. Service Program Creation

**File: QSRVSRC/MYSERVICE.bnd (Binder Source)**
```text
STRPGMEXP  PGMLVL(*CURRENT)  SIGNATURE('MY_SVC_V1R0M0')
  EXPORT SYMBOL('publicProc')
  EXPORT SYMBOL('getStatus')
ENDPGMEXP

STRPGMEXP  PGMLVL(*PRV)  SIGNATURE('MY_SVC_V0R9M0')
  EXPORT SYMBOL('publicProc')
ENDPGMEXP
```

**Rules:**
- `STRPGMEXP` / `ENDPGMEXP` block per signature level
- `PGMLVL(*CURRENT)` for latest version
- `PGMLVL(*PRV)` for previous version (backward compat)
- `SIGNATURE('...')` — unique identifier for API version
- `EXPORT SYMBOL('...')` — list only public procedures
- Never export private/internal procedures

**Create Service Program Command:**
```cl
CRTSRVPGM SRVPGM(MYLIB/MYSERVICE)
          MODULE(MYLIB/MYSERVICE)
          EXPORT(*SRCFILE)
          SRCFILE(MYLIB/QSRVSRC)
          SRCMBR(MYSERVICE)
          ACTGRP(*CALLER)
```

---

### 4. Public API Contract (Prototype Include)

**File: qrpglesrc/myservice_api.rpgleinc**
```rpgle
**free
// =========================================================================
// Service Program Public API — MYSERVICE
// =========================================================================

dcl-pr publicProc varchar(256);
  p_input varchar(256) const;
end-pr;

dcl-pr getStatus int(10);
  p_requestId int(10) const;
end-pr;
```

**Rules:**
- `RPGLEINC` / `CPY` members contain prototypes **only** (no executable code)
- One prototype per exported procedure
- Parameter names and types must match service program exports exactly
- Keep in shared `qrpglesrc` folder (or `QCBLLEREF` for COBOL)
- Version the include if API changes: `myservice_api_v1.rpgleinc`, `myservice_api_v2.rpgleinc`

---

### 5. Consumer Pattern

**File: QRPGLESRC/MYAPP.rpgle**
```rpgle
**free
ctl-opt main(main)
        option(*srcstmt: *nodebugio)
        datfmt(*iso)
        timfmt(*iso)
        dftactgrp(*no)
        actgrp(*caller);

/INCLUDE 'qrpglesrc/myservice_api.rpgleinc'

dcl-proc main;
  dcl-pi *n extpgm('MYAPP');
  end-pi;

  dcl-s result varchar(256);

  result = publicProc('input-value');
  ...
on-exit;
end-proc main;
```

**Rules:**
- `/INCLUDE` the public API prototypes
- Call exported procedures by name (typed, explicit)
- Avoid dynamic call names
- Use `BNDDIR` (binding directory) to centralize service program location

**Compile with Binding Directory:**
```cl
CRTPGM PGM(MYLIB/MYAPP)
       MODULE(MYLIB/MYAPP)
       BNDDIR(MYLIB/MYSERVBND)
```

---

## Activation Group Strategy

### Default: `actgrp(*caller)`
- Service program reuses caller's activation group
- Lower memory footprint
- No independent cleanup
- **Use for:** utility/helper libraries; data access; formatting

### Explicit Named Group: `actgrp('MYSERVICE')`
- Service program runs in dedicated activation group
- Caller + service program isolation
- Group persists for duration of job
- **Use for:** stateful services; long-lived connections; resource-intensive modules

### No `*new`: Never force activation group per call
- High overhead
- Use only if strict isolation required per call
- Rarely needed in production

**Recommended:** `actgrp(*caller)` for most reusable service programs.

---

## Backward Compatibility Policy

### Additive Changes (Compatible)
**No new signature level needed:**
- Add new exported procedure → new module, re-bind service program with new export
- Add optional parameter to existing procedure → use `options(*nopass : *omit)`
- Keep existing signatures/prototypes stable

**Bind command:**
```cl
CRTSRVPGM SRVPGM(MYLIB/MYSERVICE)
          MODULE(MYLIB/MYSERVICE)
          ... (same as before)
```

### Breaking Changes (Incompatible)
**New signature level required:**
- Remove exported procedure
- Change parameter type/order of existing procedure
- Change return type

**Binder source with two signature levels:**
```text
STRPGMEXP  PGMLVL(*CURRENT)  SIGNATURE('MY_SVC_V2R0M0')
  EXPORT SYMBOL('publicProc')
  EXPORT SYMBOL('newProc')
ENDPGMEXP

STRPGMEXP  PGMLVL(*PRV)  SIGNATURE('MY_SVC_V1R0M0')
  EXPORT SYMBOL('publicProc')
ENDPGMEXP
```

**Consumer compiles with version-aware binding:**
- Old code uses `BNDDIR(MYLIB/V1BND)` → binds to V1R0M0 signature
- New code uses `BNDDIR(MYLIB/V2BND)` → binds to V2R0M0 signature
- Both run in same job without conflict

---

## Build Script Template (CLLE)

**File: QCLLESRC/MYSERVICE_BUILD.clle**
```clle
PGM

/* Compile module */
CRTRPGMOD MODULE(DEVGRP/MYSERVICE)
          SRCFILE(DEVGRP/QRPGLESRC)
          SRCMBR(MYSERVICE)

/* Create service program with versioned signature */
CRTSRVPGM SRVPGM(DEVGRP/MYSERVICE)
          MODULE(DEVGRP/MYSERVICE)
          EXPORT(*SRCFILE)
          SRCFILE(DEVGRP/QSRVSRC)
          SRCMBR(MYSERVICE)
          ACTGRP(*CALLER)
          TEXT('My Service Library V1.0.0')

/* Add to binding directory for consumers */
ADDBNDDIRE BNDDIR(DEVGRP/MYSERVBND)
           OBJ((*LIBL/MYSERVICE *SRVPGM))

/* Compile consumer program */
CRTRPGMOD MODULE(DEVGRP/MYAPP)
          SRCFILE(DEVGRP/QRPGLESRC)
          SRCMBR(MYAPP)

CRTPGM PGM(DEVGRP/MYAPP)
       MODULE(DEVGRP/MYAPP)
       BNDDIR(DEVGRP/MYSERVBND)
       ACTGRP(MYAPP)

ENDPGM
```

---

## Folder Structure

```
qrpglesrc/
  myservice.rpgle          (module, nomain)
  myapp.rpgle              (program, uses myservice)

qrpglesrc/
  myservice_api.rpgleinc   (public API prototypes)

qsrvsrc/
  myservice.bnd            (binder source, export strategy)

qcllesrc/
  myservice_build.clle     (build script)

obj/ (after compile)
  myservice.module
  myservice.srvpgm
  myapp.pgm
```

---

## Skill-Specific Guidance

### codegen-rpgle
- Authoritative for RPGLE service program architecture
- Generate modules with `ctl-opt nomain`, explicit `export` on procedures
- Generate binder source with versioned signatures
- Generate prototype includes in `qrpglesrc/*.rpgleinc`

### codegen-cblle
- Follow same split architecture (module + service program)
- COBOL: `IDENTIFICATION DIVISION ... COMMON` for modules
- Compile with equivalent versioning strategy
- Prototype/copybook includes in `QCBLLEREF`

### codegen-clle
- CL programs can be compiled as modules with `CRTSRVPGM`
- Use explicit `PARM` for parameter contracts
- Binding strategy same as RPGLE (versioned signatures)
- Less common for large service libraries; use for orchestration/commands

---

**Version:** 1.0
**Last Updated:** 2026-08-24
**Referenced By:** codegen-rpgle, codegen-cblle, codegen-clle
