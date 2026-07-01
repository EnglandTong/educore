# QA Runbook M16

Status: P16-02 Developer Complete
Owner: MRT-Developer
Updated: 2026-06-20T23:21:17+08:00

## Purpose

Provide a stable, local-only QA runbook for the M16 release-evidence program.

## Required Checks

1. `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict`
2. `corepack pnpm --filter @educore/web run test:e2e --reporter=list`
3. `Select-String -LiteralPath .\docs\EVIDENCE_CONTINUITY_TRACKER_M16.md -Pattern "Repository integrity","Adaptive learning algorithms","Core learner smoke flow","Student UX copy","Agent Loop evidence"`

## Pass Expectations

- `Acceptance` checks exit `0`.
- `E2E` checks report all tests passing.
- `Acceptance check passed` appears in strict acceptance output.
- Evidence outputs remain local-only and traceable in `docs/` files.

## Severity And Next Step

- Severity: `Low`
- Next step: If the strict acceptance command or e2e command fails three consecutive times for the same unresolved reason, stop and return to Controller/QA.

