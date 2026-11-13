## Structure diagram quality rules

Use these rules for analysis and program-structure diagrams.

### Required qualities

- **Completeness**: all required business paths represented.
- **Determinism**: no ambiguous branch resolution.
- **Termination**: all loops can terminate.
- **Traceability**: each node links to source evidence.
- **Behaviour preservation**: no unrequested behavioural change.

### Composition rules

1. Use only sequence, iteration, and selection.
1. Keep sibling nodes at the same abstraction level.
1. Avoid mixing unrelated concerns in one subtree.
1. Name nodes with domain language (verb-noun or event style).
1. Keep optional behaviour in explicit selection branches.
1. Surface structure clashes explicitly; do not hide with generic blocks.

### Control semantics rules

- Every selection has an explicit condition.
- Every iteration has init, progression, and termination.
- Every unmatched/other condition has defined behaviour.

### Review pass

- Can a reader execute the diagram mentally from start to finish?
- Is every branch condition observable and testable?
- Are loop bounds data-driven and documented?
- Is unmatched behaviour explicit?
- Can each node be traced to evidence?
