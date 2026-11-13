$ErrorActionPreference = 'Stop'
$runner = Join-Path $PSScriptRoot 'Invoke-SprintOpsDaily.ps1'
$temporaryRoot = Join-Path ([IO.Path]::GetTempPath()) ('SprintOps-Test-' + [guid]::NewGuid())
$originalLocalAppData = $env:LOCALAPPDATA
$global:SprintOpsTestDate = [datetime]'2026-11-09T15:00:00'
$global:SprintOpsTestExitCode = 0
$global:SprintOpsTestCalls = 0

function global:Get-Date {
    $global:SprintOpsTestDate
}

function global:Test-SprintOpsCopilot {
    $global:SprintOpsTestCalls++
    Set-Variable -Name LASTEXITCODE -Value $global:SprintOpsTestExitCode -Scope 1
    $global:SprintOpsTestResponse
}

function Assert-Fails {
    param([string]$Expected)
    $failed = $false
    try {
        & $runner -RepositoryRoot $temporaryRoot -CopilotPath Test-SprintOpsCopilot | Out-Null
    }
    catch {
        if ($_.Exception.Message -notlike "*$Expected*") { throw }
        $failed = $true
    }
    if (-not $failed) { throw "Expected failure containing: $Expected" }
}

try {
    $skillDirectory = Join-Path $temporaryRoot '.agents\skills\sprintops'
    New-Item -ItemType Directory -Path $skillDirectory -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot '..\SKILL.md') -Destination $skillDirectory
    $env:LOCALAPPDATA = Join-Path $temporaryRoot 'LocalAppData'
    $files = @(
        @{ path = 'Sprint-35\Daily-Reports\2026-11-09.md'; content = 'Daily evidence: Unknown' },
        @{ path = 'Sprint-35\Sprint-Summary.md'; content = 'Summary evidence: Unknown' }
    )
    $global:SprintOpsTestResponse = ConvertTo-Json -InputObject @{ files = $files } -Depth 4
    & $runner -RepositoryRoot $temporaryRoot -CopilotPath Test-SprintOpsCopilot | Out-Null
    $report = Join-Path $temporaryRoot 'docs\sprint-documentation\Sprint-35\Daily-Reports\2026-11-09.md'
    if ((Get-Content -LiteralPath $report -Raw).Trim() -ne $files[0].content) {
        throw 'Weekday report content did not match.'
    }
    $summary = Join-Path $temporaryRoot 'docs\sprint-documentation\Sprint-35\Sprint-Summary.md'
    if ((Get-Content -LiteralPath $summary -Raw).Trim() -ne $files[1].content) {
        throw 'Sprint summary content did not match.'
    }

    foreach ($day in @('2026-11-14', '2026-11-15')) {
        $global:SprintOpsTestDate = [datetime]$day
        $before = $global:SprintOpsTestCalls
        & $runner -RepositoryRoot $temporaryRoot -CopilotPath Test-SprintOpsCopilot | Out-Null
        if ($before -ne $global:SprintOpsTestCalls) { throw 'Weekend invoked Copilot.' }
    }
    $global:SprintOpsTestDate = [datetime]'2026-11-09T15:00:00'
    $global:SprintOpsTestResponse = '{"files":[]}'
    & $runner -RepositoryRoot $temporaryRoot -CopilotPath Test-SprintOpsCopilot | Out-Null

    $global:SprintOpsTestResponse = 'not JSON'
    Assert-Fails 'Invalid JSON'
    $global:SprintOpsTestResponse = '{"files":{}}'
    Assert-Fails 'files array'
    $files[0].content = 'Invalid responses must not write this content.'
    $files[1].path = '..\outside.md'
    $global:SprintOpsTestResponse = ConvertTo-Json -InputObject @{ files = $files } -Depth 4
    Assert-Fails 'Unexpected report path'
    $files[1].path = 'Sprint-36\Sprint-Summary.md'
    $global:SprintOpsTestResponse = ConvertTo-Json -InputObject @{ files = $files } -Depth 4
    Assert-Fails 'same sprint'
    $files[1].path = $files[0].path
    $global:SprintOpsTestResponse = ConvertTo-Json -InputObject @{ files = $files } -Depth 4
    Assert-Fails 'Duplicate report path'
    $junction = Join-Path $temporaryRoot 'docs\sprint-documentation\Sprint-99'
    New-Item -ItemType Junction -Path $junction -Target $env:LOCALAPPDATA | Out-Null
    try {
        $files[0].path = 'Sprint-99\Daily-Reports\2026-11-09.md'
        $files[1].path = 'Sprint-99\Sprint-Summary.md'
        $global:SprintOpsTestResponse = ConvertTo-Json -InputObject @{ files = $files } -Depth 4
        Assert-Fails 'symbolic link or junction'
    }
    finally {
        [IO.Directory]::Delete($junction)
    }
    $global:SprintOpsTestExitCode = 7
    Assert-Fails 'exit code 7'
    if ((Get-Content -LiteralPath $report -Raw).Trim() -ne 'Daily evidence: Unknown') {
        throw 'A rejected response changed the existing report.'
    }
    Write-Output 'SprintOps scheduler checks passed (mock CLI; no task registered).'
}
finally {
    $env:LOCALAPPDATA = $originalLocalAppData
    Remove-Item -LiteralPath $temporaryRoot -Recurse -Force
    Remove-Item Function:\Get-Date, Function:\Test-SprintOpsCopilot
    Remove-Variable -Name SprintOpsTestDate, SprintOpsTestExitCode, SprintOpsTestCalls, SprintOpsTestResponse `
        -Scope Global
}
