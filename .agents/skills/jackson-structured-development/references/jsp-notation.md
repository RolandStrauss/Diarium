## Jackson Structured Programming (JSP) notation

JSP derives a program structure from a Jackson-style data/process model.

### Program structuring primitives

- **Sequence** maps to straight-line execution blocks.
- **Iteration** maps to bounded loops with explicit exit conditions.
- **Selection** maps to branching (`if/else`, `case`, `select/when`).

### Program design rules

- Main procedure should mirror top-level structure order.
- Nested structure should map to nested procedures/blocks where helpful.
- Keep one clear input-process-output lifecycle.
- Prefer explicit guards over implicit fall-through logic.

### Validation checklist

- Every selected branch has a known predicate.
- Every loop has initialization, progress, and termination.
- Error/fallback branches are explicit when business-critical.
- The control structure can be traced back to the domain structure.
