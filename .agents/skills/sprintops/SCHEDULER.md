## SprintOps Windows scheduler

These scripts generate daily reports through Copilot CLI using Windows Task
Scheduler. Generating these files does not install or enable a scheduled task.

### Prerequisites

- Windows PowerShell 5.1 and Windows Task Scheduler.
- Copilot CLI available as `copilot`, authenticated with `copilot login`.
- A Copilot subscription with available usage credits.
- A logged-in Windows session, an awake machine, and network access at 15:00.
- Local policy must permit these PowerShell scripts; the task does not bypass
  execution policy or request administrator privileges.

The trigger uses the Windows local timezone, currently South Africa Standard
Time (UTC+02:00). It follows future Windows timezone changes.

### Preview and install

Run these commands from the repository root. Preview registration first:

```powershell
& '.\.agents\skills\sprintops\scripts\Register-SprintOpsTask.ps1' -WhatIf
```

Register the task when ready:

```powershell
& '.\.agents\skills\sprintops\scripts\Register-SprintOpsTask.ps1'
```

The task is named `SprintOps-IBMi_DynaTrace_Integration`. It runs Monday-Friday
at 15:00 under the registering user, without storing a password. It skips
missed triggers instead of catching up later, ignores overlapping scheduled
runs, and stops a run after 30 minutes. The runner also skips weekends.
Re-register after moving the repository or Copilot executable; the installed
task retains their absolute paths. Existing tasks are never silently replaced.

### Run, inspect, and remove

Manually generate today's report; this uses Copilot credits:

```powershell
& '.\.agents\skills\sprintops\scripts\Invoke-SprintOpsDaily.ps1'
```

Inspect the registered task:

```powershell
Get-ScheduledTaskInfo -TaskName 'SprintOps-IBMi_DynaTrace_Integration'
```

Remove it without deleting generated reports:

```powershell
Unregister-ScheduledTask -TaskName 'SprintOps-IBMi_DynaTrace_Integration'
```

### Output and safeguards

The runner supplies the skill and existing sprint Markdown to Copilot. It exposes
only read tools, disables built-in remote integrations and session export, and
validates the returned JSON before writing. Only today's dated daily report and
the summary in a single `Sprint-<number>` directory are accepted. It creates
missing output directories and leaves story files and application code alone.
Symbolic links and junctions in report output paths are rejected.
Review generated text: path validation does not validate the model's conclusions.
It uses the configured Copilot model and does not publish to Confluence or trackers.

Copilot errors are written under `%LOCALAPPDATA%\SprintOps\Logs`; a nonzero CLI
exit code, invalid JSON, or unexpected output path fails the run. Task Scheduler
records failures in `LastTaskResult`. When the model reports no active sprint,
the runner changes no files. The daily report and summary are written separately;
a disk failure can leave only one updated, so rerun after resolving the error.

Run the local checks without contacting Copilot or registering a task:

```powershell
& '.\.agents\skills\sprintops\scripts\Test-SprintOpsScheduler.ps1'
```
