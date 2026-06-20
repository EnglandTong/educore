# LOOP CONFIG

Status: Active
Last updated: 2026-06-20T10:03:37+08:00

## Loop Rules

- One active Controller-dispatched program or work order at a time.
- For M15, Developer may execute the ordered P15 work orders under `docs/DISPATCH_M15_PROGRAM_TO_DEVELOPER.md`.
- Lite tasks may be closed by Developer with evidence.
- Standard and Deep tasks require Developer handoff and Controller/QA review.
- Stop immediately if `docs/STOP_RULES.md` is triggered.

## Verification Baseline

- `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict`
- `corepack pnpm --filter @educore/web run test:e2e --reporter=list`

## Evidence Files

- `docs/STATUS.md`
- `docs/NEXT_ACTIONS.md`
- `docs/PENDING.md`
- `docs/COMPLETED.md`
- `docs/LOOP_LOG_Workbuddy.jsonl`
