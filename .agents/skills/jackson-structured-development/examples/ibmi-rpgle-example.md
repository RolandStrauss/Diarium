## IBM i RPGLE-oriented example

### Evidence

**Source:** DDGMTRRUL table maintenance API in RPGLE

**Inputs:** Action code (C/R/U/D), metric UID, metric name, table definition, load SQL, collector flag, record status

**Outputs:** Result status (success/no-data/failure) with message and rows affected

**Observable behaviour:** One of four CRUD operations executes; shared validation and result formatting.

### Jackson structure (sequence + selection)

```text
Initialize -> Input -> [Create | Read | Update | Delete] -> Output
```

Primitives: Sequence (main), Selection (process branch)

### Semantics

- **Initialize:** Set SQL context, initialize pointers.
- **Input:** Receive parameters; validate UID and action code.
- **Selection predicate:** Action parameter (C=Create, R=Read, U=Update, D=Delete).
  - **Branch Create:** Validate metric name; INSERT; fetch identity; set success or error.
  - **Branch Read:** Validate UID; SELECT; set success or no-data.
  - **Branch Update:** Validate all fields; UPDATE by UID; check row count; set success or error.
  - **Branch Delete:** Validate UID; DELETE; check row count; set success or error.
  - **Other:** Route to setFailure with "Invalid action" message.
- **Output:** Return via output parameters (action, UID, status, message, rows affected).

### Implementation pseudocode (RPGLE)

```rpgle
dcl-proc mdodMaint;
  dcl-pi *n;
    i_action char(1) const; // C/R/U/D
    i_uid int(10) const;
    i_metricName varchar(50) const;
    // ... other input params
    i_action char(1);
    o_uid int(10);
    // ... output params
  end-pi;

  initialize();  // Set SQLCA/SQLDA pointers

  Select;
    When (g_action = 'C'):
      runCreate();  // Delegates to action-specific procedure
    When (g_action = 'R'):
      runRead();
    When (g_action = 'U'):
      runUpdate();
    When (g_action = 'D'):
      runDelete();
    Other:
      setFailure(sqlstate : sqlcode : 'Invalid action');
  EndSl;

  // Return output parameters via %passed() guards
  return;
end-proc;
```

### JSP-to-RPGLE mapping

- **Initialize:** Dedicated `initialize()` procedure.
- **Input:** Procedure interface parameters + guards (e.g., `If %len(metricName) = 0`).
- **Selection:** `Select; When ...; Other; EndSl;`
- **Iteration:** `Dou`/`Dow` or `For` loop (optional for batch detail rows).
- **Output:** `setSuccess()` / `setNoData()` / `setFailure()` helper procedures; `%passed()` return guards.

### Key teaching points

- RPGLE procedures can mirror Jackson structures directly.
- Selection branches map to `When` clauses; branches to separate procedures for readability.
- Output contract (status, message, rows) unified in helper procedures.
- Explicit parameter guards (`%passed()`) ensure clean output semantics.
