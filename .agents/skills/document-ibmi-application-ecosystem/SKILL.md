---
name: document-ibmi-application-ecosystem
description: Comprehensive documentation of entire IBM i business processes and application ecosystems. Document all components (programs, files, service programs, APIs, batch jobs, etc.), dependencies, business processes, data flows, and modernization context. Enables business stakeholders, developers, architects, and support teams to understand system-wide context. Use the three-phase discovery → process analysis → architecture & modernization approach for enterprise-grade documentation.
version: 1.0.0
author: Roland Strauss
category: IBMi
tags:
   - ibmi
   - documentation
   - architecture
   - modernization
license: MIT
metadata:
  applicable_for:
    - IBM i applications
    - Legacy modernization initiatives
    - Multi-program systems
    - Business process documentation
  canonical_authority: ibmi-ecosystem-documentation.instructions.md
  phase_approach: true
---

# Document IBM i Application Ecosystem

Generate comprehensive, system-level documentation for entire IBM i business processes and application ecosystems.

**Use this skill when:**
- Documenting a complete IBM i application or business process (not just individual programs)
- Planning modernization of a legacy system
- Onboarding new team members to a complex system
- Creating architecture documentation for stakeholders
- Analyzing dependencies and risks across a system
- Supporting business continuity and disaster recovery planning
- Preparing for Cloud migration or modernization

**Do not use this skill for:**
- Documenting individual programs in isolation (use `codegen-ibmi-program-documentation` instead)
- Code generation or refactoring
- Single-file edits or small code changes

---

## Core Workflow: Three-Phase Approach

This skill implements a proven three-phase discovery-analysis-modernization approach that produces documentation suitable for business stakeholders, developers, architects, and modernization teams.

### Phase 1: Discovery (2-4 hours)

Identify all system components and map the landscape.

**Deliverables:**

1. **System Boundary Definition**
   - Business process name and purpose
   - Entry points (interactive, batch, API, scheduled)
   - User roles and responsibilities
   - External system dependencies
   - Success/failure criteria

2. **Component Inventory**
   - All RPGLE/COBOL/CL programs
   - All display files (DSPF) and report files (PRTF)
   - All service programs and modules
   - All database objects (physical files, logical files, SQL tables, views)
   - All APIs and external interfaces
   - All batch jobs and scheduler entries
   - All data areas, message queues, data queues
   - Library structure and binding directories

3. **High-Level Architecture Diagram**
   - Major components and their relationships
   - Data flow (input → processing → output)
   - Integration points with external systems
   - User interfaces and batch job triggers

**Technique:**

- Use `graphify` to analyze codebase structure and dependencies
- Run searches for job definitions, scheduler entries, data areas
- Read key entry-point programs to identify call chains
- Review database schema (DSPF member field definitions, SQL table definitions)
- Read batch job control language to understand process flows
- Document what you find, not what you infer

---

### Phase 2: Business Process Analysis (4-8 hours)

Analyze how the system works and document the business logic.

**Deliverables:**

1. **End-to-End Process Flow**
   - For each major business process: step-by-step flow
   - For each step: program invoked, files accessed, business rules applied, outputs generated
   - Decision points and error handling
   - Exception paths and recovery procedures

2. **Program Dependency Map**
   - Call graph showing who calls whom
   - Service program exports and procedure signatures
   - File I/O patterns (read/create/update/delete)
   - External system interfaces

3. **Database Analysis**
   - For each file/table: purpose, key fields, relationships, record count estimate
   - Entity relationship diagram
   - Data flow between components
   - Temporary tables and work files

4. **Business Rules Catalogue**
   - All identifiable business rules (validation, approval, calculation, eligibility, thresholds, status transitions)
   - For each rule: description, source object(s), business impact, risk of change
   - Organized by category: validation, approval, calculation, status transitions, security

5. **Batch Processing Analysis**
   - All scheduled jobs: schedule, entry point, library list, restart procedure
   - For each job: step-by-step process, error handling, recovery logic
   - Failure scenarios and recovery procedures
   - Job dependencies and sequencing

6. **Interface Catalogue**
   - All external interfaces: APIs, message queues, file drops, web services
   - For each: protocol, format, synchronous/asynchronous, failure impact, authentication
   - Data transformation and mapping rules

**Technique:**

- Walk through each program from entry point to exit, tracing the logic
- Read all service program procedure signatures and implementation
- Extract business rules from validation logic, calculations, approval workflows
- Trace data flow from input source through processing to output
- Document observed behavior, not assumed behavior
- Mark any inferred information as [INFERRED] with confidence level
- Identify all files/tables accessed and their business meaning
- Read batch job control language to understand scheduled workflows

---

### Phase 3: Architecture & Modernization (4-8 hours)

Document technical architecture, risks, technical debt, and modernization opportunities.

**Deliverables:**

1. **Technical Architecture Document**
   - Architectural style (monolithic, modular, layered, service-oriented, batch-oriented, event-driven, hybrid)
   - Layer separation (presentation, processing, data access, integration, batch)
   - Component dependencies and coupling patterns
   - Technology stack (RPGLE, COBOL, CL, SQL, etc.)
   - Performance characteristics

2. **Security Analysis**
   - Access control model (roles, permissions, object authorities)
   - Sensitive data identification (PII, confidential, internal)
   - Audit trail requirements and implementation
   - Compliance and regulatory considerations
   - Security risks and mitigation strategies

3. **Technical Debt Assessment**
   - Identify duplication, hard-coding, tight coupling, obsolete technology
   - Rate each debt item: severity (HIGH/MEDIUM/LOW) and effort to fix
   - Quantify impact: technical risk, maintenance burden, performance, security

4. **Modernization Assessment**
   - Identify opportunities: modularization, API extraction, testing, Git migration, DevOps enablement
   - For each opportunity: business value, technical value, effort, risk
   - Migration paths that preserve business behavior
   - CI/CD readiness, Cloud migration readiness

5. **Operational Support Guide**
   - Daily monitoring checklist
   - Common failures and recovery procedures
   - Escalation contacts and procedures
   - Job scheduling and restart procedures
   - Alert thresholds and response actions

6. **Risks & Assumptions**
   - Operational risks (failures, availability, data loss)
   - Knowledge risks (undocumented processes, key person dependencies)
   - Dependency risks (external systems, database, network)
   - Security risks (access controls, data protection)
   - Modernization risks (breaking changes, data migration, integration)

7. **Knowledge Transfer Guide**
   - What to learn first (business process, critical programs, files, business rules)
   - 4-week on-boarding path for new team members
   - SME contact list and expertise areas

**Technique:**

- Analyze coupling patterns: tight coupling vs. service-oriented
- Trace error handling and failure recovery paths
- Identify hard-coded values (library names, paths, constants) suitable for externalization
- Look for code duplication suitable for consolidation
- Review performance: any N+1 query patterns, inefficient algorithms?
- Check for audit trail and compliance controls
- Identify technical debt (obsolete technology, weak error handling, poor testing)
- Map modernization opportunities that DON'T change business behavior
- Document risks (operational, security, knowledge, dependency, modernization)

---

## How to Use This Skill

### Invocation Patterns

**Comprehensive System Documentation:**
```
Analyze and document the entire DtaDog for IBM i application ecosystem.
Use the three-phase approach: Phase 1 (Discovery), Phase 2 (Business Process), Phase 3 (Architecture & Modernization).
Produce complete documentation suitable for business stakeholders, developers, architects, and modernization teams.
```

**Phase-Specific Work:**
```
Phase 1 only: Discover and map all components of the Route Non-Payments application.
Generate: System boundaries, component inventory, high-level architecture diagram.
```

```
Phase 2 only: Analyze the Claims Processing business process flow.
Generate: End-to-end flow, program dependency map, database analysis, business rules, batch job flows.
```

```
Phase 3 only: Assess technical debt and modernization opportunities for Policy Administration.
Generate: Technical architecture, security analysis, tech debt assessment, modernization roadmap, operational guide.
```

### Output Format

Generate Markdown documents organized into sections:

1. **Executive Summary** — 1-2 page overview of the system, business value, key risks
2. **Business Process Document** — End-to-end flows, business rules, interfaces
3. **System Architecture Document** — Components, layers, dependencies, diagrams
4. **Application Inventory** — Component table with all programs, files, jobs, etc.
5. **Program Dependency Map** — Call graph and component relationships
6. **Database Analysis** — File/table inventory, entity relationships, read/write patterns
7. **Business Rules Catalogue** — All extracted business rules with impact analysis
8. **Batch Processing Analysis** — All scheduled jobs, flows, error handling
9. **Interface Catalogue** — All external interfaces with protocol/format/failure analysis
10. **Operations Guide** — Daily monitoring, common failures, escalation procedures
11. **Security Analysis** — Access controls, sensitive data, audit trail, compliance
12. **Technical Debt Assessment** — All identified debt with severity/effort ratings
13. **Modernization Assessment** — Opportunities with business/technical value analysis
14. **Risks & Assumptions** — Operational, knowledge, dependency, security, modernization risks
15. **Knowledge Transfer Guide** — On-boarding path, critical components, SME contacts
16. **Mermaid Diagrams** — Architecture, flows, dependencies, entities

### Quality Standards

All documentation must:

- **Be specific** — Reference actual program names, file names, business rule IDs
- **Be verifiable** — Base conclusions on observable evidence (code, logs, tests)
- **Be honest about uncertainty** — Mark inferred information as [INFERRED] with confidence level
- **Never fabricate** — If behavior unknown, ask SME; don't guess
- **Be self-contained** — Reader shouldn't need access to source code to understand
- **Use consistent notation** — Consistent naming, formatting, diagram style
- **Include diagrams** — Use Mermaid for all architecture and flow diagrams

### When to Ask for SME Input

Stop and ask for subject matter expert clarification when you encounter:

- Undocumented business rules (what's the policy on denials? claim timeouts? escalations?)
- Unclear process steps (what happens if external system is unavailable? is there a fallback?)
- Performance decisions (why this algorithm? why file I/O instead of SQL?)
- Data retention policies (how long are claims kept? archived how?)
- Access controls (who can approve? how is role checked?)
- External dependencies (which external systems are critical? SLAs?)
- Historical context (why built this way? what are the known limitations?)

Frame questions concisely: Why it matters → What's unknown → Impact if unanswered.

---

## Example: Claims Processing System

### Phase 1: Discovery

**System Boundary:**
- Business process: Claim entry, validation, approval, payment
- Entry points: Interactive (menu + DSPF), batch (nightly), REST API (future)
- Users: Claims entry clerks, claims adjuster, manager, operations
- External: Policy system (ODBC), payment system (MQ), notification (SMTP)

**Components:**
- Programs: DDGMENU, MAIN001, CLMBATCH01, CLMREPROCESS
- Service Programs: VALIDATE, PROCESS, UPDATE, CALC, NOTIFY
- Files: CLMHEADER (PF), CLMDETAIL (PF), CLAIMS_V1 (SQL)
- DSPFs: CLMSCREEN, CLMLIST, CLMDETAIL
- Batch jobs: CLMBATCH01 (daily 02:00), RPTWEEKLY (weekly)
- APIs: policy verification (ODBC), payment submission (REST), notifications (SMTP)

### Phase 2: Business Process Analysis

**End-to-End Flow:**
1. User selects "Enter Claim" from menu → MAIN001 displayed
2. User enters claim details → MAIN001 calls VALIDATE
3. VALIDATE checks policy, dates, amounts → pass/fail returned
4. If pass → MAIN001 calls PROCESS for calculation
5. PROCESS applies deductibles, coverage limits, calculates payable amount
6. MAIN001 calls UPDATE to write claim to CLMHEADER, CLMDETAIL, CLAIMS_V1
7. UPDATE posts message to payment queue
8. User sees confirmation screen with claim number

**Business Rules:**
- BR001: Claim must be within 30 days of occurrence
- BR002: Deductible applied; calculated at coverage-type level
- BR003: Coverage limits enforced per policy
- BR004: Manager approval required for claims >$5K

### Phase 3: Architecture & Modernization

**Architecture:**
- Monolithic + batch + interactive
- Layers: Presentation (DSPF), Processing (service programs), Data (files + SQL), Integration (ODBC + MQ + SMTP)
- Coupling: MAIN001 tightly coupled to VALIDATE/PROCESS/UPDATE; service programs loosely coupled

**Technical Debt:**
- Hard-coded library names (PRODLIB) in CL — extracted to .env would support per-dev libs
- No unit tests on PROCESS — refactoring risky
- Duplicate validation logic in MAIN001 and CLMBATCH01 — extract to VALIDATE service program

**Modernization:**
- REST API wrapper for web/mobile UI — enables modern interfaces without changing business logic
- SQL reporting views — faster reports; BI-ready
- Unit test suite — enables refactoring; CI/CD-ready
- Git migration — enables version control; automation-ready

**Risks:**
- External policy system unavailable → claims entry blocked → fallback needed
- Database unavailable → all claims processing stopped → recovery procedure needed
- Adjuster access compromised → fraudulent approvals possible → audit controls needed

---

## Integration with Other Skills & Instructions

This skill works with:

- **`codegen-ibmi-program-documentation`** — For individual program deep-dives after ecosystem is understood
- **`ibmi-ecosystem-documentation.instructions.md`** — Authoritative standards for this work
- **`modernizing-ibmi-applications.instructions.md`** — For modernization strategy
- **`improve`** — For identifying improvement opportunities
- **`acquire-codebase-knowledge`** — For initial codebase onboarding
- **`graphify`** — For analyzing component dependencies

---

## What This Skill Does NOT Do

- **Does not generate code** — Documentation only
- **Does not modify source** — Read-only analysis
- **Does not propose breaking changes** — Modernization preserves business behavior
- **Does not document individual programs in detail** — Use `codegen-ibmi-program-documentation` for that
- **Does not make architectural decisions** — Documents current state and options; human decides
- **Does not replace SME knowledge** — Captures SME knowledge in structured form

---

## Success Metrics

Documentation is complete when:

- ✅ All components identified and listed
- ✅ End-to-end business process clearly documented
- ✅ All program dependencies mapped
- ✅ All business rules extracted and catalogued
- ✅ All batch jobs and schedules documented
- ✅ All external interfaces identified and described
- ✅ All business-critical data flows understood
- ✅ Architecture and technical debt assessed
- ✅ Modernization opportunities identified with business value
- ✅ Operational runbook created for support teams
- ✅ Knowledge transfer guide enables new team onboarding
- ✅ All diagrams generated in Mermaid format
- ✅ SME questions compiled for follow-up

Documentation is ready for review when it can be read by:
- **Business analyst** and understood without source code
- **New developer** and onboarded within 4 weeks
- **Architect** and used for modernization planning
- **Support analyst** and can troubleshoot common failures
