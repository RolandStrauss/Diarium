[CmdletBinding(SupportsShouldProcess)]
param()

$ErrorActionPreference = 'Stop'
$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..')).Path
$runner = Join-Path $PSScriptRoot 'Invoke-SprintOpsDaily.ps1'
$copilot = (Get-Command copilot -CommandType Application -ErrorAction Stop).Source
$powerShell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$identity = [Security.Principal.WindowsIdentity]::GetCurrent().Name
$taskName = 'SprintOps-' + (Split-Path -Leaf $repositoryRoot)

if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
    throw "Task '$taskName' already exists. Inspect it before removing or replacing it."
}

$action = New-ScheduledTaskAction -Execute $powerShell -WorkingDirectory $repositoryRoot `
    -Argument ('-NoLogo -NoProfile -NonInteractive -File "{0}" -RepositoryRoot "{1}" -CopilotPath "{2}"' -f
        $runner, $repositoryRoot, $copilot)
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday `
    -At '15:00'
$principal = New-ScheduledTaskPrincipal -UserId $identity -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 30) -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries

if ($PSCmdlet.ShouldProcess($taskName, "Register weekday 15:00 task for $identity")) {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger `
        -Principal $principal -Settings $settings `
        -Description 'Generate SprintOps daily reports at 15:00 local time, Monday-Friday.' |
        Out-Null
    $info = Get-ScheduledTaskInfo -TaskName $taskName
    Write-Output "Registered $taskName. Next run: $($info.NextRunTime)"
}
