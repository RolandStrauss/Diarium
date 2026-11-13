## JSP program structure template

### 1. Program context

- Program/module name:
- Entry point:
- Target language/runtime:
- Behaviour-preservation constraint:

### 2. Top-level Jackson-derived control

1. Initialize
1. Input
1. Process
1. Output
1. Finalize

### 3. Operation allocation

Repeat this block per operation:

- Operation:
- Owning Jackson component:
- Why it belongs there:
- Side effects:

### 4. Control mapping

Repeat this block per Jackson node:

- Jackson node:
- Program block/procedure:
- Primitive (S/I/SEL):
- Explicit condition/termination:

### 5. Detailed pseudo-structure

- `Initialize -> Input -> Process -> Output -> Finalize`
- `Process` contains:
  - selections (conditions listed):
  - iterations (init/progression/termination listed):

### 6. Error and fallback design

- Validation failures:
- No-data conditions:
- Runtime exception strategy:
- Unsupported-action path:

### 7. Traceability to source evidence

Repeat this block per program element:

- Program element:
- Evidence source:
- Notes:

### 8. Verification checklist

- [ ] Each Jackson element is represented once in program flow.
- [ ] Each loop has initialization, progression, and termination.
- [ ] Each branch has an explicit predicate.
- [ ] Operation placement matches owning component.
- [ ] Side effects are isolated and observable.
- [ ] Observable behaviour is preserved unless explicitly changed.
