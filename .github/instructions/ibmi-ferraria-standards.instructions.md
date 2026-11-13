---
applyTo: '.agents/skills/codegen-*'
description: Consolidated Legacy Solutions / Ferraria standards authority, handler-role semantics, naming clarifications, and contradiction-resolution rules for all IBM i code generation skills.
---

# IBM i Ferraria Standards Authority and Architecture Semantics

Use this file as the canonical cross-skill authority for Legacy Solutions / Ferraria
standards interpretation. It does not replace language-specific generation rules,
JSP flow rules, source naming limits, comment formats, or DSPF routing. It resolves
which source is authoritative when Ferraria conventions, handler roles, naming suffixes,
and governance notes appear to conflict.

## Standards authority order

When multiple Legacy Solutions / Ferraria documents overlap, use this order:

1. **Standards and Recipe**
   - Primary approved general standard.
   - Use for mandatory rules on naming, code review, multithreading, libraries,
     process flows, service/error contracts, update recipes, migration
     constraints, and general delivery governance.
2. **PDS - Coding Standards and Practices**
   - Reviewed supporting standard.
   - Use for clearer naming-detail and suffix/prefix interpretation where it adds
     precision without contradicting the primary standard.
3. **SOP - Code Review - v3**
   - Operational review and promotion checklist.
   - Use for Annexure A, review sign-off expectations, and promotion controls.
4. **MMI_Legacy_Solutions_Product_Model_New_Route_Tech_Document_Def_v2**
   - Product Model / New Route architecture authority only.
   - Use for gateway-to-request-handler selection, configuration-driven routing,
     and build-up-handler flow.
5. **OB Enquiries Technical Discussion Document V16**
   - Current implementation exemplar.
   - Use as evidence for SH/SP/CH separation and flow shape, not as a global
     enterprise standard.
6. **Draft DevOps guides, chats, team notes, cheat sheets, and duplicate search hits**
   - Supporting material only.
   - Never treat these as equal to approved or reviewed controlled standards.

## Cross-skill role semantics

Use these meanings consistently across all IBM i skills.

### SH — Screen Handler

- Owns interactive presentation, navigation, validation sequencing, locking,
  error display, and screen-flow coordination.
- Must **not** own core business logic.
- Default rule: should **not** directly fetch business data from files/tables.
- Must delegate reusable retrieval and processing to `SP` and `FM` layers.
- Narrow repo-proven exception for CRUD maintenance shells: `SH` may perform a
  list-only subfile hydration query for screen population when all of the
  following remain true:
  - `SH` does not absorb business rules,
  - single-row create/read/update/delete work stays in `RH` and/or `SP`/`FM`,
  - helper side effects (for example ensure/edit preparation) stay behind the
    routed handler/service boundary,
  - the query exists only to populate or refresh the visible list.
- Treat `qrpglesrc/doddrulsh.sqlrpgle` + `qrpglesrc/doddrulrh.sqlrpgle` as the
  canonical repo example of this maintenance-shell split.

### RH — Request Handler

- Means a routed executable request-handling **program** role.
- Treat RH as an RPG `*PGM` role, not as a service program.
- In Product Model / New Route, RH selection may be configuration-driven and may
  vary by request name, portfolio, status, or build-up path.
- Do **not** assume one request name always maps to one globally fixed RH.
- Do **not** promote Orbit-only restrictions such as "no SQL in RH and SH" to a
  repo-wide Ferraria rule. The retrieved Ferraria standards do not establish a blanket
  RH-wide SQL ban.

### CH — Content Handler

- In Ferraria, `CH` means **Content Handler**.
- Use CH for API/content adapter responsibilities: extract/deserialize input,
  invoke back-end service logic, populate/serialize output, or return errors.
- Do **not** reinterpret `CH` as Orbit's **Completion Handler**. That meaning is
  out-of-domain for these skills.

### SP — Service Program / Service Procedure layer

- Owns reusable business/service logic.
- Prefer small single-responsibility procedures.
- When using the standard service contract, exported services should expose
  `pr_input` and `pr_error`; include `pr_output` when the function requires it.
- Callers must inspect returned error structures and preserve success/failure
  semantics.

### FM — File Manager

- Owns direct data-access and CRUD boundaries behind services.
- Prefer SH/CH/RH/controller layers to reach database resources via SP/FM rather
  than embedding duplicated access logic.

### BR — Batch Run

- Owns orchestration for batch processing.
- BR calls the reusable services required for a batch run.

### ML — Multi-thread bridge

- Owns the bridge from multithread partitioning/control into batch execution.
- ML receives the broken-down parameters from the multithread controller and calls BR.

## Standards and Recipe operational rules

Apply these rules when the user asks for Ferraria-aligned generation, refactoring,
or standards interpretation.

### Core coding defaults

- Prefer fully free-format IBM i source where the artifact type supports it.
- Keep logic simple, explicit, and DRY; avoid clever code that obscures intent.
- Use clear self-explanatory names.
- Preserve established indentation and spacing in existing source; do not treat
  modernization or standards alignment as permission for whitespace-only churn.
- Document code where needed:
  - add short purpose comments above procedures/subroutines,
  - mark changes at the beginning of the program when following the existing
    maintenance convention,
  - use comments to clarify non-obvious logic, not to narrate obvious syntax.
- Reuse existing services before writing new duplicate logic.
- Do not hardcode libraries, SQL values, or environment-specific settings unless
  an existing contract requires it.
- New work should use ISO date handling conventions where the artifact supports
  date-format configuration.

### Repository and discovery aids

- `DAREP` is an approved discovery aid for locating services and where they are
  declared or used in the Legacy Solutions environment.
- Confluence technical documents are useful supporting references for local
  implementation context, but controlled standards still outrank wiki guidance
  when they conflict.

### Separation-of-concerns enforcement

- Business logic does not belong in screen handlers.
- Screen handlers should not explicitly fetch business data; use reusable
  service and file-manager layers.
- Exception: for detail-plus-subfile maintenance shells, a list-only subfile
  load query in `SH` is acceptable when it is presentation-only and single-row
  CRUD/helper behavior remains in `RH`/`SP`/`FM`.
- File/database access belongs behind `SP`/`FM` boundaries.
- Refactor overloaded modules into smaller single-responsibility units instead
  of adding mixed responsibilities to one object.

### Detail-plus-subfile maintenance default

When generating or interpreting a file-maintenance program that uses a subfile
plus detail screen, prefer this repo-proven shape unless a stronger controlled
standard requires otherwise:

1. `SH` owns the interactive loop, refresh cadence, cursor/F-key routing, header
   and message rendering, and detail-screen orchestration.
2. `SH` may bulk-load visible list rows for the subfile.
3. `RH` owns single-row create/read/update/delete actions and helper side
   effects behind a request/response contract.
4. One DSPF may contain both the list subfile and the detail screen.
5. Popup chooser subfiles are optional extensions, not the default anatomy.

This default resolves the common ambiguity between "SH must not fetch data" and
the repo's proven maintenance-shell implementation: list hydration may live in
`SH`, but business logic and row-level state change do not.

### Initialization and cleanup

- Programs and procedures should initialize working state up front.
- Close files/cursors, deallocate pointers, and release owned resources on all
  normal exits.
- Prefer `on-exit` in RPG procedures when it gives a smaller, safer cleanup path.
- Release policy locks only if the current flow acquired the lock.

### Service contracts and return semantics

- Exported service programs must expose `pr_input` and `pr_error`; include
  `pr_output` only when the function requires returned business data.
- Exported procedures should use the standard success contract:
  - `1` = successful
  - `0` = failed
- After calling a service, inspect the returned error structure rather than
  assuming success.
- Keep success/failure meaning consistent across callers and callees.

### Error handling rules

- Use `*PSSR` for unexpected errors only.
- When writing `*PSSR`/GENPSSR diagnostics, include process identity and data
  identity so downstream investigation can locate the failing business context.
- Use `MONITOR`/`ON-ERROR` for expected runtime exceptions that need controlled
  handling.
- SQL work must capture SQL diagnostics; use `GET DIAGNOSTICS` and inspect the
  SQL status fields needed by the flow.
- Keep job logs clean:
  - do not leave `DEBUG` in header/control options,
  - avoid noisy non-actionable logging,
  - clear erroneous messages when resolving defects.

## Canonical process-flow defaults

Treat these as default Ferraria flow shapes unless an authoritative product-model
or functional-spec source requires a different order.

### Interactive update flow

1. Housekeeping / initialize state.
2. Pre-authorization check when required.
3. Get business key (for example policy number).
4. Validate input.
5. If an effective-date movement is being updated, call the canonical movement-
   date validation service before update processing.
6. Lock the policy/business object when the flow requires it.
7. Run processing: rules, values/quotes, debt/suspense/payment checks,
   affordability, collection-date logic, and other business preconditions.
8. If value authorization requires a second authorization step, call the
   security model before update completion.
9. Perform the required updates and downstream gateway/service calls.
10. Release lock on success, cancel, F3/backout, or error if this flow acquired it.

### Interactive enquiry flow

1. Housekeeping / initialize state.
2. Pre-authorization if required.
3. Get business key.
4. Validate input.
5. Lock only if applicable.
6. Run read/quote/debt/commission processing.
7. Release lock before screen display if this flow acquired it.
8. Generate letters/communications only when the enquiry flow requires it.

### Batch update flow

1. Housekeeping / initialize state.
2. Read input.
3. Validate input.
4. If an effective-date movement is being updated, call the canonical movement-
   date validation service before update processing.
5. Run processing and gateway quote mode before updates.
6. Perform required updates.
7. Trigger communication when applicable.
8. Continue to next input record / iteration.

### Gateway quote-before-update rule

- Gateways that support quote mode should be called in quote mode before updates
  are performed so errors surface before data is changed.
- The reinsurance gateway is the documented exception to the general quote-mode
  expectation.

## Update-recipe and multithread rules

### Policy/gateway update recipe defaults

- For policy update flows, gateways must be called in the documented sequence;
  the gateway decides whether it has work to do.
- Errors must be handled up through the financial-gateway step as part of the
  in-process update flow.
- Follow-on gateways after the financial-gateway step may preserve success and
  surface handling outside the immediate process when that is the established
  contract of the existing flow.
- When a user requests exact update ordering, prefer the authoritative recipe or
  existing generated exemplar over inventing a new sequence.

### Multithreading defaults

- Standard multi-thread support files are:
  - `SYSMCHDRPF` — header
  - `SYSMCDETPF` — detail
  - `SYSMCSEAPF` — thread control
- Use the `MULTITHREAD` process-rule area for rule-driven thread execution.
- Standard rule concepts include `PROCID`, `CATEGORY`, `MAXTHREADS`, and refresh-
  table control.
- `ML` bridges broken-down thread parameters into `BR` execution.
- `BR` acts as the controller that calls the services required for the batch run.
- MQT filters used for thread/batch selection must not span unrelated domain
  files.

## Library-placement defaults

Preserve existing library contracts. When creating new aligned artifacts, use
the documented business-domain placement below unless a stronger local authority
already assigns the object elsewhere:

- `BBLIB` — insurance master CRUD and closely related policy/client/claims work.
- `PCLIB` — product-model-specific services, rules, definitions, and rate logic.
- `INLIB` — financial-specific and general shared services.
- `COMCAL` — commission logic.

## Naming and suffix clarifications

This file supplements, but does not replace,
`.github/instructions/ibmi-source-naming.instructions.md`.

### Canonical suffix and meaning notes

- `PF` = Physical File
- `LF` = Logical File
- `SH` = Screen Handler
- `RH` = Request Handler
- `CH` = Content Handler
- `PI` = Procedure Interface
- `PR` = Prototype
- `CB` = Copybook / copy member
- `BD` = Binding Directory
- `SP` = Service Program / reusable service layer
- `MD` = Module
- `UT` = Unit Tester
- `FM` = File Manager / data-access layer
- `BR` = Batch Run
- `ML` = Multi-thread bridge
- `DF` = Display File
- `RF` = Printer File / spooled output in one controlled source
- `PG` = Panel Group
- `MN` = Menu
- `Vn` = View family suffix
- `In` = Index family suffix
- `QT` = canonical MQT suffix for new work
- `LD` = legacy/transitional MQT suffix only

### Canonical prefix notes

- `PM` = Product Model
- `PDS` = MOM PDS
- `POD` = PODS
- `PCOM` = Commission domain
- `MET` = Metropolitan generic/shared programs
- `HS` = Home Services
- `VG` = VG domain
- `OB` = OB domain
- `DO` = DevOps domain
- Preserve existing prefix contracts before normalizing toward any prefix standard.
- The separate source-naming instruction remains authoritative for length limits,
  filename shape, and cross-repo naming mechanics.

### Service and procedure naming clarifications

- For new services, put the service name first in exported procedure names, then
  the action in camel case, for example `metclntsp_getClientDetails()`.
- Keep exported procedure names explicit about business intent; do not shorten
  them into opaque abbreviations just to save characters in comments or docs.
- Where a domain-specific naming pattern already exists, preserve the contract
  unless the user explicitly asks for a naming migration.

### Domain-specific naming note for OB

- Retrieved standards describe an OB pattern of product + process + function +
  program type.
- Treat this as a domain-specific convention, not a universal mandatory pattern
  for all generated IBM i artifacts in the repo.

### Display-file naming note

- Display-file field names should start with `D_` when following the controlled
  display-field standard.
- Do not force-rename existing display fields solely to satisfy this note unless
  the task is a deliberate naming-standard migration.

### MQT naming resolution

- Use `QT` as the canonical suffix for new MQT-related naming.
- Treat `LD` as legacy/transitional only.
- Preserve existing contractual legacy names unless the user explicitly requests
  renaming or migration work.

### Printer suffix ambiguity

- Retrieved controlled sources conflict on `RF` versus `SO` for printer/spooled
  output suffixes.
- Do **not** invent a new canonical repo-wide printer suffix from that conflict.
- Preserve the suffix already in the local artifact, template, or explicit user request.
- If the user asks to standardize printer suffixes, flag the unresolved authority gap.

### Legacy-name caution

- Do not infer architecture responsibility solely from historical suffixes.
- Older objects may use legacy naming that no longer reflects the current SH/RH/SP/CH/FM model.
- Preserve external contracts first; infer behavior from the actual role, surrounding flow,
  and the authoritative documents above.

## Governance and review rules

- No movement to governed downstream environments should be assumed without the
  required technical review, code review, and approval evidence defined by the
  approved standards and SOP.
- Nothing moves to pre-live (`TEST1`) without both technical and code review.
- Program changes should not be handed to testing before code review is complete.
- Attach Annexure A to the Jira/project when moving work to `TEST1` where that
  promotion control applies.
- All work units must relate to a Jira.
- All code reviews must be completed and signed off before moving to `QA1`.
- Migration defaults from the retrieved standard:
  - objects move to `MITTE`/`MTTE2` from `MOBJLIB`,
  - objects move to `MOMDRP` from `QA2`,
  - BAU promotion targets from `QA2` may include `MOMSYS`, `MOMDRP`, `MITTE`,
    `MTTE2`, or another explicitly approved downstream target.
- Data changes must be delivered by script and DCR; do not treat table/file
  copies as an acceptable standard data-change path.
- Review expectations include cleanup, error handling, documented changes,
  reuse of existing services, avoidance of repeated code, correct return-code
  semantics, clean job logs, correct library placement, appropriate comments,
  and no avoidable hardcoding.
- Treat chat/email guidance such as "use METCON" or "avoid SELECT *" as useful
  working practice, but not as equal authority unless promoted into a controlled standard.

## Skill-authoring implications

Apply these rules when writing or updating IBM i skill guidance:

1. **Do not duplicate this architecture glossary** across skills unless a skill needs
   a short role-specific summary.
2. **Reference this file** when a skill discusses handler roles, layered architecture,
   naming ambiguity, or Ferraria/PDS authority.
3. **Keep business logic out of presentation guidance**:
   - `codegen-dspf` and `codegen-uim` own presentation artifacts.
   - `codegen-rpgle-subfile` owns subfile flow.
   - Business/data rules belong in RPGLE/COBOL/CL/SQL/service layers.
4. **Preserve existing contracts and behavior** when standards are ambiguous.
5. **Use smallest safe interpretation** when multiple sources overlap.

## Contradiction-resolution defaults

When sources disagree or remain incomplete, use these defaults:

1. Preserve existing public contracts, signatures, file layouts, and behavior.
2. Prefer the smallest safe change over structural rewrites.
3. Keep presentation concerns separate from service/data concerns.
4. Do not import Orbit-specific naming or handler rules into Ferraria guidance.
5. Do not elevate draft DevOps language/style notes above approved/reviewed standards.
6. If a controlled standard defines a flow, service contract, library target, or
   review gate, prefer that explicit rule over local habit.
7. If no authoritative decision exists, document the ambiguity in the skill instead of
   silently inventing a new standard.

## Related canonical instruction files

Use these with this authority file:

- `.github/instructions/ibmi-source-naming.instructions.md`
- `.github/instructions/ibmi-comment-formats.instructions.md`
- `.github/instructions/ibmi-jsp-scaffold.instructions.md`
- `.github/instructions/ibmi-dspf-routing.instructions.md`
- `.github/instructions/ibmi-service-programs.instructions.md`
- `.github/instructions/ibmi-variable-declaration-sequence.instructions.md`
- `.github/instructions/ibmi-audit-columns.instructions.md`

## Short rule of thumb

When in doubt:

- approved standard beats draft note,
- behavior beats suffix guess,
- SH presents,
- CH adapts,
- SP/FM do reusable work,
- BR/ML orchestrate batch,
- RH is a routed program role,
- services return `1` success / `0` failure,
- review before `TEST1`/`QA1`,
- `QT` is current,
- `LD` is legacy,
- `RF/SO` stays unresolved unless a controlled standard settles it.
