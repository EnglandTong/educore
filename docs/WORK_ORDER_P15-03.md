# Work Order P15-03 - Evidence Freshness Audit

Program: `docs/M15_PROGRAM_2026-06-20.md`
Status: Pending Developer

## Work Order ID

`P15-03`

## Complexity

Standard

## Task

Create an evidence freshness audit that confirms required M15 evidence paths exist, current commands still pass, and stale or missing evidence is explicitly identified without rewriting history.

## Scope

- Audit the evidence files referenced by M15.
- Run strict acceptance to confirm current repository integrity.
- Document evidence freshness, timestamps, and any stale-but-accepted historical records.
- Update status and handoff files.

## Allowed Files

- `docs/EVIDENCE_FRESHNESS_AUDIT_M15.md`
- `docs/STATUS.md`
- `docs/NEXT_ACTIONS.md`
- `docs/PENDING.md`
- `docs/COMPLETED.md`
- `docs/LOOP_RUNS.jsonl`
- `docs/LOOP_LOG_Workbuddy.jsonl`
- `docs/LOOP_STATE_Workbuddy.md`
- `docs/WORK_ORDER_ACTIVE.md`
- `docs/Work_Order_Active.md`

## Not Allowed Files

- `agent-loop-check.ps1`
- `apps/**`
- `packages/**`
- `modules/**`
- `.env`
- `.env.*`
- `.git/**`
- `node_modules/**`
- Any path outside `D:\Development\EduCore`

## Acceptance Criteria

- `docs/EVIDENCE_FRESHNESS_AUDIT_M15.md` exists.
- Audit lists required evidence paths and marks each as `Present`, `Missing`, or `Historical`.
- Missing required evidence is either `None` or clearly marked as a risk requiring Controller/QA review.
- `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict` exits `0` and prints `Acceptance check passed`.
- `Select-String -LiteralPath .\docs\EVIDENCE_FRESHNESS_AUDIT_M15.md -Pattern "Present","Missing","Historical","Acceptance check passed"` returns matches.

## Design Notes

- This is an audit and documentation task only.
- Do not delete or rewrite old evidence.
- Treat older dated evidence as `Historical` when it remains relevant but is not the latest command run.

## Boundaries

- Stop if strict acceptance fails three consecutive times for the same unresolved reason.
- Stop if production credentials, live data, external services, dependency installation, or product changes are required.
- Do not modify acceptance script behavior.

## Verification Commands

- `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict`
- `Select-String -LiteralPath .\docs\EVIDENCE_FRESHNESS_AUDIT_M15.md -Pattern "Present","Missing","Historical","Acceptance check passed"`

## Expected Developer Handoff

Developer must return:

- Summary of audit result.
- Exact verification commands and results.
- Completion timestamp in Asia/Shanghai time.
- Evidence paths.
- Missing/stale evidence risks or `None`.
- Skipped checks and reasons, or `None`.

## Program Continuation

If all acceptance criteria pass and no stop rule is triggered, Developer may continue to `docs/WORK_ORDER_P15-04.md`.
