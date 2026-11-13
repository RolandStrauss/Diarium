## JSD analysis template

### 1. Scope and assumptions

- Request type (JSD/JSP/reverse-engineering/conversion):
- In-scope process:
- Out-of-scope process:
- Assumptions explicitly accepted:

### 2. Source evidence

- Source artifacts reviewed:
- Inputs identified from source:
- Outputs identified from source:
- Entity life-history evidence:
- Event ordering evidence:

### 3. Input structure(s)

For each input source:

- Top-level sequence:
- Iterations and loop bounds:
- Selections and branch conditions:
- Optional/unmatched segments:

### 4. Output structure(s)

For each output target:

- Top-level sequence:
- Iterations and loop bounds:
- Selections and branch conditions:
- Optional/unmatched segments:

### 5. Entity and event inventory

Repeat this block per entity/event:

- Entity/Event:
- Description:
- Cardinality:
- Ordering constraint:
- Evidence:

### 6. Correspondence map

Repeat this block per mapped pair:

- Input component:
- Output component:
- Relationship:
- Structure clash? (yes/no):
- Notes:

### 7. Structure clashes

- Clash summary:
- Why clash occurs:
- Resolution approach (preserve behaviour):
- Open risk after resolution:

### 8. Final Jackson structure (text form)

Use shorthand:

- Sequence: `A -> B -> C`
- Iteration: `{A}*`
- Selection: `[A | B | C]`

Proposed structure:

### 9. Open questions

- Missing rule or data point:
- Required SME clarification:
- Blocker severity:
