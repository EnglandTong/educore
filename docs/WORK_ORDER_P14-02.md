# Work Order P14-02 - Student Training Loop E2E Verification Depth

Program: `docs/M14_PROGRAM_2026-06-20.md`
Status: Pending Developer

## Work Order ID

`P14-02`

## Complexity

Standard

## Task

Improve verification depth for the existing student training loop so answer submission, feedback, wrong-answer/review-note behavior, and session completion evidence are explicit in local e2e coverage or documented as an existing verified path.

## Scope

- Review current Playwright student journey coverage.
- Extend only existing e2e tests or e2e fixtures/mocks as needed.
- Verify the existing learner flow without creating new product features.
- Update evidence and loop status files with commands, results, timestamps, and paths.

## Allowed Files

- `apps/web/e2e/**`
- `docs/STATUS.md`
- `docs/NEXT_ACTIONS.md`
- `docs/PENDING.md`
- `docs/COMPLETED.md`
- `docs/LOOP_LOG_Workbuddy.jsonl`
- `docs/LOOP_STATE_Workbuddy.md`
- `docs/ACCEPTANCE_EVIDENCE_2026-06-16.md`
- `docs/WORK_ORDER_P14-02.md`
- `docs/WORK_ORDER_ACTIVE.md`
- `docs/Work_Order_Active.md`

## Not Allowed Files

- `apps/web/src/**`
- `packages/**`
- `modules/**`
- `.git/**`
- `node_modules/**`
- Any path outside `D:\Development\EduCore`

## Acceptance Criteria

- E2E evidence explicitly covers or asserts the existing student path for training answer submission and visible feedback.
- E2E evidence explicitly covers or asserts the existing wrong-answer/review-note behavior where currently available.
- E2E evidence explicitly covers or asserts a session completion, summary, or equivalent end-state in the existing journey.
- `corepack pnpm --filter @educore/web run test:e2e --reporter=list` exits `0`.
- `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict` exits `0` and prints `Acceptance check passed`.
- Evidence paths and timestamped handoff are recorded.

## Design Notes

- This work order is verification depth, not product redesign.
- Prefer strengthening existing tests and fixtures rather than adding new test infrastructure.
- If a product bug requires changes under `apps/web/src/**`, stop and return with failing evidence instead of expanding scope.
- UI/UX claims must refer to `docs/RUBRIC.md` and objective e2e observations.

## Boundaries

- Stop if production credentials, external service access, dependency installation, product source changes, or architecture changes are required.
- Stop if three consecutive e2e or strict acceptance runs fail for the same unresolved reason.
- Do not reduce, skip, or delete existing e2e coverage to make the command pass.

## Verification Commands

- `corepack pnpm --filter @educore/web run test:e2e --reporter=list`
- `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict`

## Expected Developer Handoff

Developer must return:

- Summary of e2e coverage reviewed or changed.
- Exact verification commands and results.
- Completion timestamp in Asia/Shanghai time.
- Evidence paths, including e2e report path if generated.
- Statement confirming no product source code was changed.
- Remaining risks or `None`.

## Program Continuation

If all acceptance criteria pass and no stop rule is triggered, Developer may continue to `docs/WORK_ORDER_P14-03.md` after updating required evidence and handoff files.
