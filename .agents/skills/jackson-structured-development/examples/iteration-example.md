## Iteration example

### Evidence

**Source:** Business requirement: "Process all transactions from a file until EOF."

**Inputs:** Transaction file with header row and N data rows

**Outputs:** Summary totals per transaction type

**Observable behaviour:** Header read once; transaction block repeats; summary written once.

### Jackson structure (sequence + iteration)

```text
ReadHeader -> {ReadTransaction -> ValidateTransaction -> AccumulateTotals}* -> WriteSummary
```

Primitives: Sequence (outer), Iteration (inner)

### Semantics

- **Initialization:** ReadHeader executes once before loop.
- **Iteration body:** ReadTransaction + ValidateTransaction + AccumulateTotals repeats.
- **Loop condition:** Continue while file has unread rows.
- **Termination:** Exit on EOF; proceed to WriteSummary.
- **Progression:** Each iteration advances file pointer.

### Implementation pseudocode

```text
1. read header row
2. initialize totals accumulator
3. loop:
   - read next transaction row
   - if EOF then exit loop
   - validate transaction (check required fields, format)
   - accumulate transaction amount to totals
4. write summary totals
5. return success
```

### Key teaching points

- Iteration wraps repeated work (the transaction block).
- Loop initialization happens before iteration; finalization after.
- Termination condition must be observable (EOF, record count, sentinel).
