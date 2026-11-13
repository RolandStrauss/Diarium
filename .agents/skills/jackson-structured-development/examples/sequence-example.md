## Sequence example

### Evidence

**Source:** Business requirement: "Customer profile export always follows load-normalize-write order."

**Inputs:** Customer ID or search criteria

**Outputs:** Formatted export file

**Observable behaviour:** Three actions execute in fixed order; no branches.

### Jackson structure (sequence only)

```text
LoadProfile -> NormalizeFields -> WriteExport
```

Primitive: Sequence

### Semantics

- **Initialization:** Load starts immediately.
- **Progression:** Each step must complete before next begins.
- **Termination:** Export ends when WriteExport completes.
- **No branches:** Single path, no alternatives.
- **No loops:** No repetition; one occurrence of each step.

### Implementation pseudocode

```text
1. Initialize export context
2. load profile from source
3. normalize fields (trim, validate, transform)
4. write export to file
5. return success status
```

### Key teaching points

- Sequence is the simplest Jackson primitive.
- Useful when business process is deterministic and linear.
- Each step must be observable and separable.
