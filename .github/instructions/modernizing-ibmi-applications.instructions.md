---
applyTo: '*'
description: Strategic modernization guidance for IBM i applications based on IBM Redbooks Modernizing IBM i Applications. Use for planning, design, implementation, and review work across architecture, code, data, interfaces, security, DevOps, testing, performance, integration, and change management.
---

# Modernizing IBM i Applications — Canonical Guidance

@AGENTS.md

> This file defers to `AGENTS.md` as the canonical agent guidance. When guidance conflicts, follow `AGENTS.md` first.

## Purpose

Use this file when planning, generating, reviewing, or modernizing IBM i
applications. It turns the IBM Redbooks publication *Modernizing IBM i
Applications* into repository-ready rules.

This file is strategic and cross-cutting. It defines how to think about
modernization, how to sequence work, and what good modernization looks like.
It does **not** replace narrower artifact standards already defined elsewhere in
the repository.

## Scope and precedence

- Use this file for modernization strategy, delivery sequencing, architecture,
  data, integration, security, DevOps, testing, performance, and adoption.
- Use artifact-specific instruction files as the source of truth for syntax,
  naming, templates, source-member conventions, and language-specific codegen.
- If this file appears to overlap with another repository instruction, resolve
  the overlap like this:
  - Strategy and modernization intent: this file wins.
  - Artifact-specific structure and syntax: the specialized instruction file
    wins.
  - Safety, security, and explicit user requirements: higher-priority guidance
    wins.

## Modernization means more than UI refresh

Treat modernization as a continuous improvement discipline across the full IBM i
application stack, not as a one-time cosmetic project.

Modernization may include:

- program-code modernization
- database modernization
- interface modernization
- integration enablement
- cloud or mobile access
- DevOps and source-control adoption
- automated testing
- security-by-design
- performance analysis and optimization
- team enablement and workflow change

Do **not** reduce modernization to “make the screen look newer.”

## Start with the problem, not the technology

Before proposing a modernization step, identify the specific business or
delivery problem being solved.

Prefer explicit problem statements such as:

- users need mobile access to inventory or approvals
- developers cannot change code safely because tests are missing
- integrations are hard because business logic is trapped behind 5250 flows
- analytics are slow because DDS-era structures limit modern Db2 for i usage
- staffing risk is high because code style and tooling discourage new talent

Avoid vague goals such as:

- modernize everything
- move to microservices because it is modern
- replace all green screens immediately
- adopt new tools without a business outcome

If multiple problem types exist, separate them. User-experience problems,
technical-debt problems, integration problems, and security problems often need
different solutions and different success measures.

## Preferred modernization sequence

Modernization should be iterative.

### 1. Assess before changing

At minimum, understand:

- which applications and programs are still actively used
- which business processes depend on them
- which interfaces, files, APIs, queues, jobs, and schedules they touch
- where data enters, transforms, and exits
- which users experience the most friction
- which risks are operational, security, performance, or staffing related

Do not modernize blind. Dead code, unused flows, and accidental complexity are
cheap wins if discovered early.

### 2. Think big, start small, scale fast

Prefer a small, visible modernization slice that proves value quickly.

Good first slices include:

- one high-friction user workflow
- one reusable business capability exposed through an API or service boundary
- one legacy DDS file modernized to SQL DDL with improved constraints
- one risky change area protected by automated regression tests
- one manual deployment path replaced by repeatable automation

Avoid big-bang rewrites unless the user explicitly requires them and the risk is
acceptable.

### 3. Measure outcomes

Modernization work must tie back to measurable improvement, such as:

- faster delivery lead time
- fewer deployment failures
- reduced training time
- lower defect rate
- better response time or query performance
- easier integration with partner or web systems
- stronger security posture and auditability

## Technical defaults for modern IBM i work

### Architecture

- Prefer modular, well-bounded designs over large monolith edits.
- Separate business logic from presentation logic.
- Expose stable interfaces for reusable business capabilities.
- Prefer service-oriented seams, modules, service programs, APIs, and clear
  contracts before considering distributed microservices.
- Use microservices only when they reduce coupling and operational burden
  overall; do not adopt them just for optics.
- Favor hybrid evolution over “replace everything.” Existing IBM i logic can
  remain valuable while new capabilities are added around it.

### Program code

- Prefer modern free-format RPG and other modern language forms where available.
- Prefer ILE modularity, reusable procedures, clear contracts, and reduced
  duplication.
- Modernize code to improve readability, maintainability, onboarding, and safe
  change velocity.
- Modernization is not a blanket reindentation or respacing exercise; preserve
  established indentation and spacing unless the user explicitly asks for a
  formatting change.
- Use standard control structures and explicit error handling instead of legacy
  patterns when modernizing code.
- Refactor toward testable units instead of embedding all behavior in one large
  program flow.

### Data-centric development and database re-engineering

- Treat Db2 for i as an active design surface, not just passive storage.
- Prefer SQL DDL for new tables and for database modernization when safe.
- Move simple integrity rules to the database layer when appropriate so direct
  updates cannot bypass them.
- Prefer SQL-native constructs such as constraints, generated columns, views,
  procedures, and modern indexing where they simplify logic and improve reuse.
- Consider temporal support, journaling, commitment control, and row or column
  access controls when they solve real audit, integrity, or security needs.
- Modernize database design to improve reporting, analytics, integration, and
  program simplicity.

### Interfaces and user experience

- Modernize interfaces around workflow improvement, not just visual restyling.
- Preserve efficient interaction patterns when they still serve trained users
  well, but remove unnecessary memorization, cryptic codes, and screen churn.
- Prefer interfaces that reduce training burden, lower error rates, and expose
  context at the point of work.
- Design interfaces so the same business capability can serve 5250, web, mobile,
  partner, and internal tooling use cases where justified.

### Integration, web, cloud, and mobile

- Assume modern IBM i applications need to participate in a connected ecosystem.
- Prefer explicit APIs, web services, and documented data exchanges over screen
  scraping or tightly coupled point-to-point shortcuts.
- Support hybrid designs that extend IBM i capabilities without forcing full
  platform displacement.
- Enable remote, mobile, or cloud-facing access only with appropriate security,
  observability, and operational controls.

### Open source and polyglot development

- Use the right tool for the job while preserving proven IBM i business logic.
- Open source can complement IBM i modernization for integration, web, data
  transformation, automation, and developer experience.
- Do not add a dependency just because it is popular. Reuse platform and
  standard capabilities first.

### Globalization and encoding

- Treat CCSID and character-encoding behavior as first-class modernization
  concerns.
- Never assume EBCDIC, ASCII, or Unicode boundaries will “just work.”
- Validate encoding explicitly for file I/O, APIs, SQL, IFS, logs, and external
  integrations.
- Include globalization checks in test plans whenever modernization changes data
  movement or user-facing content.

## Security is part of modernization, not a follow-up phase

Modernization must produce applications that are more secure, more auditable,
and easier to remediate.

Always apply secure-by-design thinking:

- perform threat and privacy assessments early
- include security testing in delivery pipelines and release readiness
- complete a final release review for key security requirements
- protect data in transit and at rest where applicable
- use strong authentication and authorization for APIs and remote access
- prefer fine-grained access control and audit trails for sensitive operations
- reduce hidden legacy assumptions that expose data or bypass controls

Do not expose new integration points, mobile access, or cloud access without
explicit security controls. New doors attract new visitors; some wear black hats.

## DevOps, testing, and delivery expectations

Modernization is as much about process and culture as it is about code.

### Source control and delivery

- Prefer Git-based, traceable workflows.
- Prefer small, reviewable changes over large infrequent drops.
- Automate builds, validation, packaging, and deployment steps where practical.
- Make rollback and recovery part of the design, not an afterthought.

### Testing

- Add automated tests as modernization expands change frequency or refactors
  risky logic.
- Protect critical business rules with regression coverage before invasive
  refactors where practical.
- Prefer repeatable validation over manual confidence.
- Use integration and end-to-end checks for workflows that span IBM i programs,
  database objects, services, and external systems.

### Observability and performance

- Baseline before optimizing.
- Use systematic analysis for SQL and Db2 for i performance work.
- Modernize access paths, indexing strategy, and query design based on evidence,
  not folklore.
- Add enough monitoring, logging, and diagnostic signals to support rapid issue
  detection and recovery.

## People, process, and culture matter

Do not frame modernization as technology only.

Successful IBM i modernization requires all three:

- technology change
- process change
- culture and skill development

When planning modernization:

- communicate the problem being solved and why it matters
- identify skills gaps early
- train teams on modern tooling, languages, testing, and workflows
- involve affected users and stakeholders early
- use phased adoption to reduce fear and resistance
- treat modernization as an ongoing capability, not a one-time project

## Decision guide

| If the main pain is... | Prefer starting with... | Avoid assuming... |
|---|---|---|
| confusing screens and high training cost | interface and workflow modernization | that UI work alone fixes technical debt |
| slow change velocity and brittle releases | code modularization, tests, Git, CI/CD | that a new frontend solves delivery problems |
| poor analytics or hard-to-enforce data rules | SQL DDL modernization and data-centric design | that more RPG validation alone is enough |
| hard partner or web integration | APIs, services, documented contracts | that manual exports or screen scraping will scale |
| security exposure or compliance gaps | secure-by-design reviews, access controls, audit trails | that security can wait until the end |
| remote work, mobile use, or hybrid access needs | secure web and mobile enablement | that cloud means abandoning IBM i |

## Anti-patterns to avoid

- modernization for modernization’s sake
- big-bang rewrites without evidence or rollback strategy
- treating green-screen replacement as the entire modernization plan
- combining unrelated UX, database, architecture, and staffing goals into one
  unbounded initiative
- keeping all integrity rules only in application code when the database should
  enforce them
- adopting trendy architecture or tooling without a measured benefit
- exposing IBM i capabilities externally without authentication,
  authorization, audit, and testing
- ignoring encoding, CCSID, or globalization concerns during integration work
- assuming process and culture can stay unchanged while delivery speed improves

## Interaction with other repository instructions

This file complements, but does not replace:

- IBM i naming, comment, variable-declaration, and service-program standards
- codegen skill instructions for RPGLE, SQL, CLLE, DDS, DSPF, COBOL, and UIM
- DevOps guidance in `devops-core-principles.instructions.md`
- repository-wide safety, brevity, and canonical precedence defined by
  `AGENTS.md` and `.github/copilot-instructions.md`

When generating specific source artifacts, use this file to choose the direction
of modernization and the specialized instructions to shape the output.

## Sources

Primary sources used for this instruction:

- IBM Redbooks: [Modernizing IBM i Applications](https://www.redbooks.ibm.com/docs/MD260020/MD260020.html)
- IBM: [Security and Privacy by Design](https://www.ibm.com/support/pages/ibm-security-and-privacy-design)

Source publication dates observed during creation:

- *Modernizing IBM i Applications*: published 2026-07-10, updated 2026-08-11
- *IBM Security and Privacy by Design*: consulted for the three-step secure-by-design process
