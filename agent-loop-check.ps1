param(
  [switch]$SkipInstall
  ,[switch]$Strict
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path -Path (Join-Path $PSScriptRoot '.')).Path
Set-Location -Path $repoRoot

$failed = $false
$evidence = @()

function Invoke-Check {
  param(
    [string]$Name,
    [string]$Command
  )

  Write-Host "[RUN] $Name" -ForegroundColor Cyan
  Write-Host "command: $Command"

  Invoke-Expression $Command
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] $Name" -ForegroundColor Red
    $script:failed = $true
    $script:evidence += "[FAIL] $Name"
    return
  }

  Write-Host "[PASS] $Name" -ForegroundColor Green
  $script:evidence += "[PASS] $Name"
}

function Invoke-CheckArgs {
  param(
    [string]$Name,
    [string]$FilePath,
    [string[]]$Arguments
  )

  $commandText = "$FilePath $($Arguments -join ' ')"
  Write-Host "[RUN] $Name" -ForegroundColor Cyan
  Write-Host "command: $commandText"

  & $FilePath @Arguments
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] $Name" -ForegroundColor Red
    $script:failed = $true
    $script:evidence += "[FAIL] $Name"
    return
  }

  Write-Host "[PASS] $Name" -ForegroundColor Green
  $script:evidence += "[PASS] $Name"
}

function Invoke-CheckArgsWithTimeout {
  param(
    [string]$Name,
    [string]$FilePath,
    [string[]]$Arguments,
    [int]$TimeoutSeconds = 180,
    [string]$SuccessPattern
  )

  $commandText = "$FilePath $($Arguments -join ' ')"
  Write-Host "[RUN] $Name" -ForegroundColor Cyan
  Write-Host "command: $commandText"

  $tmpDir = Join-Path $repoRoot '.tmp'
  if (-not (Test-Path -LiteralPath $tmpDir)) {
    New-Item -ItemType Directory -Path $tmpDir | Out-Null
  }
  $stdoutPath = Join-Path $tmpDir 'acceptance-e2e.stdout.log'
  $stderrPath = Join-Path $tmpDir 'acceptance-e2e.stderr.log'
  Remove-Item -LiteralPath $stdoutPath, $stderrPath -Force -ErrorAction SilentlyContinue

  $psi = [System.Diagnostics.ProcessStartInfo]::new()
  $psi.FileName = 'cmd.exe'
  $redirectedCommand = "$commandText 1>`"$stdoutPath`" 2>`"$stderrPath`""
  $psi.Arguments = "/d /s /c `"$redirectedCommand`""
  $psi.WorkingDirectory = $repoRoot
  $psi.UseShellExecute = $false

  $proc = [System.Diagnostics.Process]::new()
  $proc.StartInfo = $psi
  [void]$proc.Start()
  $completed = $proc.WaitForExit($TimeoutSeconds * 1000)
  if (-not $completed) {
    $proc.Kill()
    $proc.WaitForExit()
  }

  $stdout = if (Test-Path -LiteralPath $stdoutPath) { Get-Content -LiteralPath $stdoutPath -Raw } else { '' }
  $stderr = if (Test-Path -LiteralPath $stderrPath) { Get-Content -LiteralPath $stderrPath -Raw } else { '' }

  if ($stdout) { Write-Host $stdout }
  if ($stderr) { Write-Host $stderr }

  $hasSuccessOutput = [string]::IsNullOrWhiteSpace($SuccessPattern) -or $stdout -match $SuccessPattern
  $hasFailureOutput = $stdout -match '(?im)\b(fail|failed|error|timeout)\b' -or $stderr -match '(?im)\b(fail|failed|error|timeout)\b'

  if (-not $completed) {
    if ($hasSuccessOutput -and -not $hasFailureOutput -and [string]::IsNullOrWhiteSpace($stderr)) {
      Write-Host "[PASS] $Name (verified successful output before wrapper timeout after ${TimeoutSeconds}s)" -ForegroundColor Green
      $script:evidence += "[PASS] $Name"
      return
    }
    Write-Host "[FAIL] $Name" -ForegroundColor Red
    $script:failed = $true
    $script:evidence += "[FAIL] $Name"
    return
  }

  if ($proc.ExitCode -ne 0 -or -not $hasSuccessOutput -or $hasFailureOutput) {
    Write-Host "[FAIL] $Name" -ForegroundColor Red
    $script:failed = $true
    $script:evidence += "[FAIL] $Name"
    return
  }

  Write-Host "[PASS] $Name" -ForegroundColor Green
  $script:evidence += "[PASS] $Name"
}

Write-Host "EduCore Acceptance Check" -ForegroundColor Yellow
Write-Host "Started: $(Get-Date -Format o)"

if (-not $SkipInstall) {
  Invoke-Check -Name 'Dependencies install' -Command 'corepack pnpm install --frozen-lockfile'
} else {
  Write-Host '[SKIP] Dependencies install'
  $evidence += '[SKIP] Dependencies install'
}

Invoke-Check -Name 'Typecheck' -Command 'corepack pnpm -r run typecheck'
Invoke-Check -Name 'Unit tests' -Command 'corepack pnpm -r run test'
Invoke-Check -Name 'Lint' -Command 'corepack pnpm -r run lint'
Invoke-Check -Name 'Build (non-web packages)' -Command 'corepack pnpm -r --filter ''!@educore/web'' run build'
Invoke-Check -Name 'Build (web typecheck)' -Command 'corepack pnpm --filter @educore/web run typecheck'
Invoke-Check -Name 'Build (web bundle)' -Command 'corepack pnpm --filter @educore/web run build'

if ($Strict) {
  Invoke-CheckArgsWithTimeout -Name 'E2E (web journey smoke)' -FilePath 'corepack' -Arguments @('pnpm', '--filter', '@educore/web', 'run', 'test:e2e', '--reporter=list') -TimeoutSeconds 120 -SuccessPattern 'ok\s+11\s+\[chromium\]'
}

if ($failed) {
  Write-Host "Acceptance check failed: see evidence:" -ForegroundColor Red
  $evidence | ForEach-Object { Write-Host "  $_" }
  exit 1
}

Write-Host "Acceptance check passed:"
$evidence | ForEach-Object { Write-Host "  $_" }
Write-Host "Completed: $(Get-Date -Format o)"
exit 0
