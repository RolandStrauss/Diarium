## Jackson Structured Development (JSD) notation

JSD models domain structure and event ordering before code decisions.

### Primitive constructs

- **Sequence**: ordered elements that occur in a fixed order.
- **Iteration**: one-or-more or zero-or-more repetition of a sub-structure.
- **Selection**: exactly one path from alternatives based on condition/event.

### Notation conventions

- Name structures with business terms, not technical terms.
- Keep one decomposition level per block before nesting deeper.
- Show condition labels on selections (for example: `if hasDiscount`, `if isRetry`).
- Show termination criteria for iterations (for example: `until end-of-file`).

### Suggested textual shorthand

- Sequence: `A -> B -> C`
- Iteration: `{A}` or `{A}*`
- Selection: `[A | B | C]`

### Objective

Create a domain-faithful structure that can be mapped to process logic with minimal reinterpretation.
