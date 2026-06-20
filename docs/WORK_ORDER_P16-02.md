# Work Order P16-02 - QA Runbook and Verification Checklist

Program: `docs/M16_PROGRAM_2026-06-20.md`
Status: Pending Developer

## Work Order ID

`P16-02`

## Complexity

Standard

## Task

Create a repeatable QA runbook for release-evidence readiness, including mandatory baseline commands and evidence capture expectations.

## Scope

- Create or update `docs/QA_RUNBOOK_M16.md`.
- Define required controller and developer checks for future prehandoff review.
- Include command list, pass criteria, and evidence-output expectations.
- Ensure references remain within existing repository and docs boundary.

## Allowed Files

- `docs/QA_RUNBOOK_M16.md`
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

- `docs/QA_RUNBOOK_M16.md` exists.
- Runbook includes baseline acceptance and smoke commands used by current milestone context.
- Runbook captures output expectations (`PASS` and timestamp requirements).
- `Select-String -LiteralPath .\docs\QA_RUNBOOK_M16.md -Pattern "Acceptance","E2E","Acceptance check passed","Severity","Next step"` returns matches.
- `docs/STATUS.md`, `docs/NEXT_ACTIONS.md`, and `docs/PENDING.md` are updated to reflect `P16-02` completion metadata.

## Design Notes

- Keep command list minimal and stable.
- Do not include production credential validation as required steps.

## Boundaries

- Stop if commands require production credentials, external paid services, or network dependency installation.
- Stop if a mandatory task requires product code changes.

## Verification Commands

- `Select-String -LiteralPath .\docs\QA_RUNBOOK_M16.md -Pattern "Acceptance","E2E","Acceptance check passed","Severity","Next step"`

## Expected Developer Handoff

- Runbook summary and rationale.
- Exact verification commands and results.
- Completion timestamp in Asia/Shanghai time.
- Evidence paths updated.
- Skipped checks and reasons, or `None`.
- Remaining risks or `None`.

