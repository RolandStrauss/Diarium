---
name: sprintops
description: Plan 10-working-day sprints, create user stories and task estimates, or update sprint progress and Confluence-ready reports from project evidence.
---

## SprintOps

Use this skill for sprint planning, story writing, task breakdown, daily status
updates, stand-up reports, and Confluence-ready sprint documentation.

## Workflow

1. Select the requested operation: plan, story/task breakdown, daily update, or
   sprint summary.
2. Read the current sprint artifacts under `docs/sprint-documentation/` before
   creating or updating files. Use the user's explicit instructions first,
   then current sprint documents, then conversation context. The project starts
   at Sprint 35 on 2026-11-09 only when no newer sprint information exists.
3. Use a 10-weekday sprint. Exclude Saturdays and Sundays; exclude holidays
   only when a project calendar or the user identifies them. Resolve dates and
   report timestamps in the user's local timezone. Ask for the timezone only
   when it changes the requested report date or schedule and is unavailable.
4. Use only confirmed status from user updates, sprint documents, or connected
   project trackers. A commit or code change alone does not prove a task is
   complete. Mark missing status as `Unknown`; never infer completion, defects,
   blockers, or actual hours.
5. Create or update only the requested sprint artifacts. Preserve existing
   reports and story history; update the current day's report and summary when
   running a daily update.
6. Validate date calculations, story/task totals, estimates, dependencies, and
   links before returning the artifacts and a concise change summary.

## Sprint planning

Create a Confluence-friendly `Sprint-Plan.md` and separate story files when
requested. Every story includes:

- Story ID and status
- `As a <role>, I want <goal>, so that <benefit>`
- Testable acceptance criteria in Given/When/Then form
- Actionable tasks, estimated effort, dependencies, blockers, and status
- Assumptions and risks, explicitly stating `None identified` when applicable

Break work into relevant analysis, design, development, unit testing, integration
testing, documentation, and deployment preparation. For IBM i work, include
applicable RPGLE/SQLRPGLE, SQL, DDS/UI, service program, binder, compilation,
and test-evidence tasks. Include only work that applies to the story.

Estimate each task in effort-days and hours. One effort-day is 8 hours; plan
0.8 effort-day (6.4 hours) of task capacity per person per working day to
account for meetings. A 10-day sprint therefore has 8 effort-days (64 hours)
of planned capacity per person. State this interpretation in assumptions,
separate effort from elapsed duration, and flag plans exceeding available
capacity.

Assign story points separately from hours using this scale:

| Points | Complexity |
|---:|---|
| 1 | Trivial |
| 2 | Small |
| 3 | Medium |
| 5 | Significant |
| 8 | Large |
| 13 | Very large |

Give a brief justification for each story-point estimate. Include dependencies
and blockers as explicit relationships; use `None` when there are none.

## Daily progress and stand-up

For a daily update, read the sprint plan, latest summary, and previous daily
report. Reconcile completed, remaining, and overdue tasks using confirmed
evidence, then update today's report, propose next-working-day activities, and
update `Sprint-Summary.md`.

The weekday cadence is Monday-Friday at 15:00 local time. A skill runs only when
invoked by a person or an external scheduler; it cannot wake itself or install
that schedule. When an invocation is identified as a scheduled weekend run,
skip the daily update and report that it was skipped.

For Windows automation, use the [external scheduler setup](SCHEDULER.md).
Registration is a separate, explicit action; creating the skill does not enable it.

Include this daily summary:

```markdown
## Daily Summary

Date:
Sprint:
Developer:

### Completed Today
- ...

### In Progress
- ...

### Blocked
- ...

### Planned For Tomorrow
- ...
```

Also include sprint health, risk, and productivity:

```markdown
### Sprint Health

Stories Completed:
Stories Remaining:
Tasks Completed:
Tasks Remaining:
Percent Complete:
Days Remaining:

### Risk Analysis

Risk: Low | Medium | High
Why:

### Productivity Metrics

Tasks Completed Per Day:
Story Completion Rate:
Outstanding Defects:
Estimated Sprint Completion %:
```

Calculate metrics from the current sprint's recorded data:

- `Percent Complete` is completed estimated effort divided by total estimated
  effort. If task estimates are missing, use task counts and label the result
  `unweighted`.
- `Tasks Completed Per Day` is cumulative completed tasks divided by elapsed
  sprint working days; show `Unknown` if either value is unavailable.
- `Story Completion Rate` is completed stories divided by total stories. A
  story is complete only when its acceptance criteria and tasks are confirmed
  complete.
- `Outstanding Defects` is the count of known open defects; show `Unknown`
  when no reliable defect source is available.
- `Estimated Sprint Completion %` is a projection from observed completion
  velocity and remaining working days. Show `Unknown` when there is insufficient
  progress data; do not present it as actual completion.
- `Days Remaining` counts remaining sprint weekdays, excluding today once the
  workday has started. State any calendar or holiday assumption.

Choose Low, Medium, or High risk based on documented blockers, overdue work,
capacity, and dependencies; explain the specific evidence. List overdue tasks
with their due dates. Use `Unknown` rather than a fabricated value.

## Artifact layout

Use the requested layout, creating missing directories as needed:

```text
docs/
└── sprint-documentation/
    └── Sprint-35/
        ├── Sprint-Plan.md
        ├── Sprint-Summary.md
        ├── Sprint-Burndown.md
        ├── Sprint-Risks.md
        ├── Sprint-Decisions.md
        ├── Sprint-Retrospective.md
        ├── Daily-Reports/
        │   └── YYYY-MM-DD.md
        └── User-Stories/
            └── STORY-001.md
```

Replace `Sprint-35` with the active sprint number, use `STORY-###` IDs, and
name daily reports with the report date. Generate the plan, summary, burndown,
risks, decisions, and retrospective files when creating a sprint's full
artifact set. Keep a retrospective factual and mark it pending until the sprint
ends or the user supplies retrospective outcomes.

Each story file uses this structure:

```markdown
## STORY-001

### Description
As a <role>, I want <goal>, so that <benefit>.

### Acceptance Criteria
- Given ..., when ..., then ....

### Tasks
- [ ] <action> — <effort-days> (<hours>); depends on: <task or None>

### Status
<status>
```

Make every generated file readable as standalone Confluence Markdown. Link
related artifacts with relative links. Do not claim that files were uploaded to
Confluence or that GitHub/Azure DevOps was updated unless a connected tool
performed that action successfully.
