---
name: checkup
description: checkup
disable-model-invocation: true
---
name: checkup
description: Performs a workspace diagnostic checkup on configurations, dependencies, and environment log files.

@AGENTS.md
# Workspace Diagnostic Checkup Engine

## Goal
Act as an autonomous systems engineer. Analyze the workspace configuration, directory structures, and active error logs to output a prioritized system health assessment and corrective patch guidelines.

## Inputs

## Workflow
1. **Discovery & Triage**: Scan the repository structure to identify core architectural manifests based on the specified `scope` (e.g., `package.json`, `Dockerfiles`, pipeline YAMLs, or custom ecosystem scripts).
2. **Log Evaluation**: If a `logPath` is provided, ingest the file's final 100-150 lines. Parse stack traces, environment flag mismatches, and failed build hooks.
3. **Context Validation**: Evaluate if project-level instructions are bloated, out-of-date, or missing critical architectural boundary guidelines.
4. **Synthesis**: Correlate log failures with manifest files to pinpoint the exact broken lines or missing dependencies.

## Output Format
Generate your diagnosis strictly utilizing the following structure:

### 🩺 Workspace Diagnostic Report [Scope: {scope}]

#### 🚨 Critical Failures (Blockers)
* *List any immediate runtime or compiler-breaking configurations, missing parameters, or explicit log exceptions found.*

#### ⚠️ Environmental Drift & Warnings
* *Highlight non-breaking irregularities, outdated runtime configurations, or missing health check entries.*

#### 🛠️ Prescribed Resolution Plan
1. **Step 1**: Immediate remediation command or file patch.
2. **Step 2**: Verification check to confirm the system state is healed.

## Edge Cases

## Validation
