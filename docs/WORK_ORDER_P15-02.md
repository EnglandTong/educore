# Work Order P15-02 - Local Smoke-Flow Checklist

Program: `docs/M15_PROGRAM_2026-06-20.md`
Status: Pending Developer

## Work Order ID

`P15-02`

## Complexity

Standard

## Task

Create a local smoke-flow checklist that describes how to verify the accepted learner journey and supporting routes without production data, external services, or new product behavior.

## Scope

- Create a checklist for local review of the accepted learner flow.
- Reference existing e2e coverage and evidence locations.
- Run the web e2e command to confirm the checklist aligns with current automated coverage.
- Update status and handoff files.

## Allowed Files

- `docs/SMOKE_FLOW_CHECKLIST_M15.md`
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

- `docs/SMOKE_FLOW_CHECKLIST_M15.md` exists.
- Checklist covers register/signin, check-in, diagnostic, training answer/feedback/session summary, wrong-answer review, heart journal/proud wall, and supporting parent/teacher route smoke.
- Checklist explicitly states it is local-only and does not require production credentials or live data.
- `corepack pnpm --filter @educore/web run test:e2e --reporter=list` exits `0`.
- Evidence paths and timestamped handoff are recorded.

## Design Notes

- This is smoke-procedure documentation, not a UI or feature change.
- Use current accepted e2e test names as anchors.
- Do not require manual browser screenshots unless already available locally.

## Boundaries

- Stop if the checklist requires production credentials, live user data, external services, or product source changes.
- Stop if e2e fails three consecutive times for the same unresolved reason.
- Do not modify e2e tests or product code in this work order.

## Verification Commands

- `corepack pnpm --filter @educore/web run test:e2e --reporter=list`
- `Select-String -LiteralPath .\docs\SMOKE_FLOW_CHECKLIST_M15.md -Pattern "register/signin","training answer","wrong-answer","heart journal","parent","teacher","local-only"`

## Expected Developer Handoff

Developer must return:

- Summary of checklist created.
- Exact verification commands and results.
- Completion timestamp in Asia/Shanghai time.
- Evidence paths, including e2e report path if generated.
- Skipped checks and reasons, or `None`.
- Remaining risks or `None`.

## Program Continuation

If all acceptance criteria pass and no stop rule is triggered, Developer may continue to `docs/WORK_ORDER_P15-03.md`.
