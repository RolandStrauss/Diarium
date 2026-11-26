---
title: "Plan 014: Track workspace branches"
status: "Planning"
---

## Status

- Priority: P1
- Effort: M
- Risk: MED
- Depends on: plan 013
- Category: enhancement
- Status: TODO

## Why

Branches explain where workspace open time was spent. Branch names are sensitive metadata and must remain local.

## Product decisions

- Record branch names only for workspaces and Git repositories that expose branch information through VS Code.
- No shell Git command or repository-content read is required.
- Prefer the built-in Git extension API when enabled.
- Store branch time under workspace identity, not by branch text alone.
- Branch labels include a detached-HEAD label rather than a commit hash.
- Branch changes settle the prior branch interval and start the new branch interval.

## Scope

- Discover repository state through `vscode.extensions.getExtension('vscode.git')` APIs.
- Subscribe to repository state changes when supported.
- Reconcile branch state on activation and 60-second checkpoints.
- Mark missing or unavailable Git status as "Unknown", not "No branch".
- Merge branch totals by stable repository and workspace identity.
- Keep branch names, workspace names, and durations in the workspace-activity store.

## Test plan

- Branch switch settles the prior branch exactly once.
- Detached HEAD is labeled safely.
- Git extension unavailable does not stop workspace timing.
- Repository context can be associated with a single folder and multi-root workspace.
- Invalid or changing repository state is handled without an extension crash.

## Done criteria

- [ ] Branch totals are local and opt-in.
- [ ] Branch switches do not lose open time.
- [ ] Git-unavailable workspaces remain valid.
- [ ] Branch names are never included in network requests or telemetry.

## STOP conditions

- Access requires executing Git commands or reading `.git` internals directly.
- Branch information cannot be linked back to a workspace safely.
