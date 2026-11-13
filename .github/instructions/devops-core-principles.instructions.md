---
applyTo: '*'
description: Foundational DevOps guidance covering CALMS, DORA, and IBM i-specific Git-driven CI/CD, build automation, testing, deployment, IaC, monitoring, tool choices, and DevSecOps practices.
---

# DevOps Core Principles

@AGENTS.md

> This file defers to `AGENTS.md` as the canonical agent guidance. When guidance conflicts, follow `AGENTS.md` first.

## Purpose

Use this file when generating, reviewing, or advising on DevOps practices,
automation, pipelines, testing, deployment, monitoring, or delivery workflows.

This file combines general DevOps principles with IBM i-specific guidance from
IBM Redbooks so recommendations stay modern without ignoring how IBM i actually
builds, packages, secures, and promotes software.

## Core stance

- Treat Git as the system of record for delivery workflows.
- Treat DevOps as culture plus process plus tooling, not tooling alone.
- Treat IBM i as fully capable of participating in modern DevOps, while
    respecting its object model, library model, authority model, and deployment
    realities.
- Keep build and deployment as separate concerns.
- Promote the same tested artifact across environments; do not rebuild between
    DEV, TEST, STAGE, and PROD.
- Integrate security throughout the pipeline, not only at the end.
- Use metrics to improve the system, not to punish people.
- Prefer incremental adoption: version control first, then automated builds,
    then automated tests, pipelines, deployments, and monitoring.

## IBM i-specific realities

Always account for these IBM i delivery characteristics:

- Source may originate in source physical files, but modern DevOps workflows
    commonly export or maintain source in the IFS as stream files for Git.
- Builds create QSYS objects such as programs, service programs, files, and SQL
    objects rather than simple directory binaries.
- Delta builds matter. IBM i teams usually compile what changed plus what must
    be rebuilt because of dependencies.
- Dependency tracking is critical because file-level checks, level-check errors,
    and service-program signature dependencies can break downstream objects.
- Deployment often promotes only a subset of objects, not an entire rebuilt
    application image.
- Database changes may require data conversion, dependency re-creation,
    rollback planning, and authority reapplication.
- Authority, adopted authority, runtime profile choice, and library list design
    are first-class deployment concerns, not afterthoughts.

## The CALMS framework

CALMS remains the simplest durable model for DevOps guidance.

### Culture

- Foster collaborative, blameless, cross-functional ownership.
- Break down silos between development, operations, security, DBAs, and support.
- Use post-incident reviews to improve systems and workflows, not to assign
    blame.
- Bridge skills gaps by making IBM i workflows understandable to developers who
    know Git, CI/CD, YAML pipelines, and automated testing.
- Treat feedback loops as mandatory: code review, build results, test results,
    deployment status, monitoring, and user pain points should all feed back into
    delivery decisions.

**Guidance for Copilot:**

- Recommend workflows that improve collaboration and make changes observable.
- Prefer practices that reduce hero knowledge and preserve institutional
    knowledge in version control, pipelines, and runbooks.
- Emphasize that modernization and DevOps adoption are easier when teams make
    small, safe, visible changes.

### Automation

- Automate repeatable work across build, test, deploy, environment setup,
    security checks, and monitoring.
- Keep a clear distinction between:
    - trigger or orchestration tool
    - build engine
    - deployment mechanism
    - monitoring and feedback systems
- On IBM i, automation often means a remote CI system triggering work over SSH,
    a runner in PASE, or an Ansible playbook that orchestrates IBM i operations.
- Automation must return accurate status to the pipeline. Blind fire-and-forget
    webhooks are weaker than agents or orchestrators that capture output, job
    status, and failures.

**Guidance for Copilot:**

- Prefer dependency-aware build automation over ad hoc compile scripts.
- Suggest pipeline stages for build, test, scan, package, promote, verify, and
    rollback readiness.
- Recommend Infrastructure as Code and Pipeline as Code where they reduce manual
    environment drift.

### Lean

- Reduce batch size: smaller commits, smaller pull requests, smaller
    deployments.
- Prefer frequent, low-risk promotions over rare large releases.
- Build quality in early via automated tests, reviews, and security checks.
- On IBM i, prefer branch-specific or isolated build outputs when feasible so
    integration issues are surfaced before promotion.
- Start with one practical improvement rather than trying to implement an entire
    DevOps platform at once.

**Guidance for Copilot:**

- Recommend the smallest pipeline and tooling change that removes manual toil or
    risk.
- Favor incremental rollout plans, especially for legacy IBM i estates.

### Measurement

- Measure delivery speed, quality, and recovery ability.
- Use both event monitoring and trend monitoring.
- Define thresholds and actions before collecting large amounts of data.
- Keep dashboards simple, visible, and actionable.
- Anonymize or aggregate metric presentation where possible.

**Guidance for Copilot:**

- Recommend DORA metrics first, then only the minimum additional metrics needed.
- Avoid vanity metrics and any metric with no owner or follow-up action.

### Sharing

- Share build rules, pipeline definitions, manifests, environment conventions,
    and runbooks in version control.
- Encourage peer review, clear documentation, and cross-training.
- Keep repository-level delivery logic discoverable rather than hidden in one
    operator's home directory or local notes.
- Treat automated tests and pipeline definitions as living documentation.

**Guidance for Copilot:**

- Recommend repository-visible documentation for build rules, approvals,
    rollback steps, secrets handling, and environment promotion.
- Prefer common tools already understood by the wider organization instead of an
    isolated IBM i-only side stack unless there is a strong reason.

## Git-driven CI/CD model for IBM i

### Git is the system of record

- Every meaningful delivery action should anchor to a Git event: push, pull or
    merge request, merge to protected branch, tag, or release.
- Branch strategy must be explicit and enforced through repository permissions.
- Prefer pull or merge requests, code review, and protected integration and
    release branches.

### Continuous Integration on IBM i

- CI means every change is compiled and validated quickly.
- On IBM i this usually includes changed-source detection, dependency-aware
    compilation, tests, and optional static or security analysis.
- Because IBM i often requires delta builds, dependency management quality is a
    first-order concern.

### Continuous Delivery and deployment

- Continuous Delivery means every successful build produces a deployable
    artifact.
- Continuous Deployment is less common for IBM i production workloads because of
    regulation, separation-of-duty rules, and production complexity.
- Manual approval gates for production are acceptable as long as packaging,
    validation, and promotion preparation remain automated.

### Artifact immutability and promotion

- The artifact validated in CI must be the same artifact promoted onward.
- Common IBM i artifacts include compiled object packages, Save Files (SAVF), or
    installable packages plus a manifest.
- Never rebuild separately per environment. What passed test should go to
    production unchanged.

### Enterprise controls

- Enforce separation of duties using platform permissions and approval flows.
- Design secrets management, environment-specific configuration, and rollback
    into the pipeline from day one.
- Keep full traceability from artifact to pipeline run to commit to author and
    review history.

**Guidance for Copilot:**

- When describing IBM i pipelines, explicitly distinguish CI validation from CD
    promotion.
- Recommend immutable promotion, approval gates where required, and strong audit
    trails.

## Build automation on IBM i

- A build is not the same as a deploy.
- A build compiles changed source plus required dependencies into a build or
    staging library.
- Build automation should include pre-build and post-build actions, not only the
    compile command itself.
- Local developer builds are still valid automation if the build engine handles
    complex dependency logic reproducibly.

### Build-engine guidance

- Prefer a dependency-aware build engine.
- TOBi (The Object Builder for i) is a strong open-source option built on GNU
    Make for IBM i-native QSYS objects.
- TOBi supports dependency tracking, delta builds, versioned build rules, and a
    single-command build workflow.
- Change-management platforms with mature IBM i build intelligence are also
    valid.

### Trigger guidance

- Common triggers include pushes, pull or merge requests, merges, tags,
    schedules, and manual approvals.
- Automation starts the build; the build engine performs the build.
- Accurate success or failure feedback must return to the triggering system.

### CI platform guidance

- Remote CI using GitHub Actions, GitLab CI/CD, Jenkins, or Azure DevOps is a
    common pattern.
- GitLab commonly connects via:
    - SSH executor
    - shell executor in IBM i PASE
    - Ansible-driven orchestration
- GitHub Actions can act as control plane while IBM i performs actual native
    compiles.

**Guidance for Copilot:**

- Prefer pipeline designs that compile in isolated build targets and return full
    logs.
- Call out dependency resolution, level-check risk, and service-program
    signature dependencies where relevant.

## Automated testing

- One automated test is better than zero.
- Start with unit testing, then add integration, regression, performance,
    acceptance, and security testing where justified.
- Use fixtures to create controlled, repeatable starting states.
- Use code coverage as a visibility tool, not a vanity target.
- Treat tests as living documentation of expected behavior.
- False failures are dangerous; brittle tests erode trust in the pipeline.

### Testing culture

- Teams must budget time for writing and maintaining tests.
- The real comparison is not coding versus coding-plus-tests; it is
    coding-plus-test-maintenance versus coding-plus-regression-fixing.
- Start with low-hanging fruit when a large IBM i system has little or no
    automated coverage.

### IBM i testing tools

- RPGUnit is a practical starting point for RPG unit testing.
- The IBM i Testing VS Code extension and companion CLI can compile, run,
    visualize, and automate RPG and COBOL tests, including code coverage, in local
    workflows or CI/CD pipelines.
- Commercial platforms are valid when broader workflow coverage, green-screen
    automation, API testing, or governance are required.

**Guidance for Copilot:**

- Recommend test stages after build and before promotion.
- Prefer fast unit tests as the base, targeted integration tests next, and a
    smaller set of end-to-end tests for critical flows.

## Deployment automation on IBM i

- Build and deploy must remain separate steps.
- Prefer building into a dedicated build library, ideally isolated per branch or
    promotion unit.
- Deployment should promote compiled objects from the tested package into target
    environments.
- Deployment must provide feedback to the pipeline and support rollback.

### Deployment design rules

- Package artifacts consistently, commonly with SAVF plus a manifest.
- Keep deployment atomic: if one object of many fails, the deployment process
    must be able to roll back the already-applied objects.
- Plan data conversion explicitly for database changes.
- Reapply or verify runtime attributes and object authorities during promotion.
- Support multi-target deployments when multiple production machines exist.
- Prefer `*PUBLIC *EXCLUDE` style least-privilege defaults where compatible with
    application needs.

### Build-versus-deploy reminder

- Never treat a successful compile in a target library as a deployment strategy.
- Promotion, rollback, authority, and data migration need their own controlled
    logic.

**Guidance for Copilot:**

- When proposing deployment automation, include packaging, manifest, rollback,
    authority, and data-conversion concerns.
- Do not suggest direct production compiles as the default modern pattern.

## Infrastructure as Code and Pipeline as Code

- IaC is infrastructure managed through version-controlled code instead of
    manual setup.
- On IBM i, IaC can include libraries, directory structures, user profiles,
    groups, subsystem settings, network configuration, schemas, SQL objects, and
    test-environment setup.
- Pipeline as Code applies the same principle to CI/CD workflow definitions,
    usually in YAML.

### IBM i IaC building blocks

- CL programs for provisioning or teardown
- SQL DDL scripts for schema and database setup
- IFS-based Bash, Python, or QShell scripts
- REXX where appropriate
- Ansible playbooks and roles for orchestration

### Ansible guidance

- Ansible is a strong IBM i orchestration option, especially when the wider
    organization already uses it.
- IBM's `ibm.power_ibmi` collection provides IBM i-specific modules, roles, and
    sample playbooks for command execution, configuration, work management,
    deployment, and related tasks.
- Prefer Ansible when the pipeline must coordinate multiple systems,
    environments, or deployment steps without running a persistent agent on IBM i.

### Risks and controls

- IaC and PaC often run with elevated authority and therefore require strong code
    review, auditing, secrets discipline, and change control.
- Poorly reviewed scripts can become a privileged attack path.

**Guidance for Copilot:**

- Recommend reviewed, version-controlled IaC and PaC over undocumented manual
    environment setup.
- Warn about secrets, privilege, and auditability whenever privileged automation
    is introduced.

## Monitoring and feedback

Use both event monitoring and trend monitoring.

### Event monitoring

- Detect build failures, test failures, deployment failures, message waits,
    pipeline stalls, and operational incidents in real time.
- Every monitored event should have a defined action and owner.

### Trend monitoring

- Track deployment frequency, lead time, failure rates, code coverage, queueing,
    backlog pressure, and other team-relevant indicators over time.
- Define goals, thresholds, and expected actions with the team.
- Tune thresholds after learning the actual baseline.

### Monitoring caveats

- Avoid alert fatigue.
- Avoid vanity metrics.
- Avoid collecting data nobody uses.
- Avoid comparing developers unfairly using simplistic output metrics such as
    lines of code or raw ticket counts.

**Guidance for Copilot:**

- Recommend a small, actionable dashboard before a large one.
- Pair each alert or metric with an action, threshold, and owner.

## DORA metrics for IBM i

Use the DORA metrics as the default DevOps performance baseline.

### 1. Deployment Frequency

- Measure how often production deployments occur.
- Redbooks benchmark guidance: high performers deploy multiple times per day;
    low performers may deploy monthly or even less often.
- Smaller, more frequent deployments usually reduce risk.

### 2. Lead Time for Changes

- Measure the time from commit to production.
- Redbooks benchmark guidance: high performers measure this in less than one
    day; low performers can take months.
- On IBM i, long lead time often signals manual gates, fragile builds, missing
    tests, or dependency-management pain.

### 3. Change Failure Rate

- Measure the percentage of deployments that cause production failure.
- Redbooks benchmark guidance: high performers stay below 5%.
- This metric improves through smaller releases, better tests, better rollback,
    and safer promotion logic.

### 4. Mean Time to Recovery

- Measure the time to recover from a production failure.
- Redbooks benchmark guidance: high performers recover in less than one hour.
- On IBM i, MTTR depends on rollback design, artifact traceability, data
    recovery, and how quickly a safe patch can be promoted.

### Metric-use rules

- Start with one useful measure in each DORA dimension if data collection is
    immature.
- Present trends monthly or quarterly rather than drowning teams in noise.
- Use metrics for improvement, not blame.

## DevSecOps on IBM i

Security must be embedded across the delivery lifecycle.

### Security layers to consider

- OS level: object authority, user profiles, group profiles, authentication, and
    authorization.
- Application level: who can read, add, change, delete, or otherwise operate on
    business data.
- Network level: ports, VPN, firewalls, and security of exposed services.

### Pipeline security practices

- Never hardcode secrets in source or configuration.
- Rotate secrets regularly.
- Use peer review and automated scanning to detect secret leaks and insecure
    patterns.
- Run SAST early in pull or merge request and build stages.
- Run DAST against running test or staging environments where appropriate.
- Generate or consume an SBOM for dependency visibility and incident response.
- Run vulnerability scanning for known issues in dependencies, operating
    environments, and services.
- Use penetration testing periodically or before major releases.

### Security stance

- Shift security left, but do not remove human judgment.
- Automated findings should create useful signal, not noise.
- Security controls belong throughout the pipeline, not only in a final release
    review.

**Guidance for Copilot:**

- When suggesting pipelines, include secrets handling, scanning, approvals, and
    auditability.
- When reviewing code or workflows, look for hardcoded secrets, unsafe input
    handling, weak authentication and authorization design, and missing rollback or
    approval controls.

## Tool guidance for IBM i DevOps

Prefer tools already used successfully across the broader organization, provided
they support IBM i well enough.

### Strong open-source building blocks

- Git for version control
- VS Code plus Code for IBM i for modern developer workflow enablement
- TOBi for dependency-aware native builds
- Jenkins with IBM i Pipeline Steps for IBM i-aware orchestration
- GitHub Actions, GitLab CI/CD, or Azure DevOps as control planes
- Ansible with `ibm.power_ibmi` for orchestration and deployment tasks
- IBM i Testing and RPGUnit for automated test execution and coverage

### Jenkins-specific note

The Jenkins IBM i Pipeline Steps plugin provides IBM i-aware steps such as:

- `onIBMi`
- `ibmiCommand`
- `ibmiShellExec`
- `ibmiRunSQL`
- `ibmiGetIFS` and `ibmiPutIFS`
- `ibmiGetSAVF` and `ibmiPutSAVF`
- `ibmiGetSPLF`
- `ibmiWaitJob`

Use these when Jenkins must run commands, SQL, IFS transfers, save-file
transfers, or spooled-file retrieval against IBM i.

### Commercial-platform note

Commercial IBM i DevOps platforms are valid when stronger governance, impact
analysis, release orchestration, rollback intelligence, auditing, or native
dependency management are required.

## Instruction rules for Copilot

When giving DevOps guidance:

- distinguish build from deploy
- treat Git as source of truth
- prefer immutable artifacts and no rebuild between environments
- account for IBM i dependency management, level checks, signatures, and object
    authority
- recommend incremental adoption rather than big-bang process change
- prefer version-controlled build rules, manifests, IaC, and pipelines
- include rollback, approval, and secrets handling in production-facing advice
- use DORA first for metrics and keep dashboards actionable
- prefer organization-standard tools unless IBM i-specific needs require a
    specialized option

## Sources

Primary source used for this instruction:

- IBM Redbooks: [Modernizing IBM i Applications — DevOps](https://www.redbooks.ibm.com/docs/MD260020/MD260020-15.html#devops)

Supporting references consulted from links cited in that chapter:

- Jenkins: [IBM i Pipeline Steps](https://plugins.jenkins.io/ibmi-steps/)
- IBM: [The Object Builder for i (TOBi)](https://github.com/IBM/ibmi-tobi)
- IBM: [Ansible Content for IBM Power Systems - IBM i](https://github.com/IBM/ansible-for-i)
- IBM: [IBM i Testing for VS Code](https://github.com/IBM/vscode-ibmi-testing)
- RPGUnit: [Tutorial](https://rpgunit.sourceforge.net/tutorial.html)
