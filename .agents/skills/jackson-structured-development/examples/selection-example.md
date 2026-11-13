## Selection example

### Evidence

**Source:** Business requirement: "Fulfillment logic depends on chosen shipping method."

**Inputs:** Order record with shipping method (Standard/Express/Pickup)

**Outputs:** Shipment confirmation

**Observable behaviour:** Exactly one fulfillment path is taken; decision based on method field.

### Jackson structure (sequence + selection)

```text
ReadOrder -> [ShipStandard | ShipExpress | ShipPickup] -> RecordConfirmation
```

Primitives: Sequence (outer), Selection (inner)

### Semantics

- **Selection predicate:** Shipping method from order record.
- **Branch ShipStandard:** Condition: method = 'Standard'
- **Branch ShipExpress:** Condition: method = 'Express'
- **Branch ShipPickup:** Condition: method = 'Pickup'
- **Other/default:** If method unrecognized, route to error handler.
- **Mutually exclusive:** Only one branch executes.

### Implementation pseudocode

```text
1. read order
2. extract shipping method
3. select based on method:
   - if Standard: arrange carrier pickup from warehouse
   - if Express: expedite via premium carrier
   - if Pickup: schedule customer pickup at storefront
   - otherwise: reject order with invalid-method error
4. record confirmation with chosen method
5. return success or error
```

### Key teaching points

- Selection requires an explicit, testable condition.
- Each branch must be a valid alternative for the same business outcome.
- Unmatched conditions must be handled (no silent fallthrough).
