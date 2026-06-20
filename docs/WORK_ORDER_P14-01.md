# Work Order P14-01 - Acceptance Script And Evidence Asset Hardening

Program: `docs/M14_PROGRAM_2026-06-20.md`
Status: Active

## Work Order ID

`P14-01`

## Complexity

Standard

## Task

Harden the existing acceptance script and evidence assets so the current signed local acceptance path is reproducible and clearly documented without relying on ambiguous timeout behavior.

## Scope

- Review the existing strict acceptance flow.
- Document the e2e timeout/output validation behavior in a dedicated evidence note.
- Ensure generated temporary e2e capture files are either ignored by evidence policy or explicitly documented as transient.
- Keep the strict command behavior aligned with `docs/ACCEPTANCE.md`.
- Update loop status files with Developer handoff evidence.

## Allowed Files

- `agent-loop-check.ps1`
- `docs/ACCEPTANCE.md`
- `docs/ACCEPTANCE_EVIDENCE_2026-06-16.md`
- `docs/STATUS.md`
- `docs/NEXT_ACTIONS.md`
- `docs/PENDING.md`
- `docs/COMPLETED.md`
- `docs/LOOP_LOG_Workbuddy.jsonl`
- `docs/LOOP_STATE_Workbuddy.md`
- `docs/WORK_ORDER_P14-01.md`
- `docs/WORK_ORDER_ACTIVE.md`
- `docs/Work_Order_Active.md`

## Not Allowed Files

- `apps/**`
- `packages/**`
- `modules/**`
- `.git/**`
- `node_modules/**`
- Any path outside `D:\Development\EduCore`

## Acceptance Criteria

- `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict` exits `0`.
- Output includes `Acceptance check passed`.
- If e2e exits by timeout wrapper, PASS is allowed only when captured output proves the 11th Chromium e2e test completed and stderr/failure markers are absent.
- Documentation explains where transient e2e capture logs live and whether they are evidence or disposable.
- `docs/STATUS.md`, `docs/PENDING.md`, and `docs/COMPLETED.md` are updated with Developer handoff status.
- No product code is changed.

## Design Notes

- This is hardening of the existing acceptance loop, not a new test subsystem.
- Prefer small edits and explicit evidence language.
- Do not lower `docs/ACCEPTANCE.md` pass conditions.
- Do not delete historical evidence; append corrections or superseding notes.

## Boundaries

- Stop if production credentials, external service access, dependency installation, or architecture changes are required.
- Stop if three consecutive strict command runs fail for the same unresolved reason.
- Stop if the work requires modifying files outside the allowed list.

## Verification Commands

- `powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall -Strict`
- `Select-String -LiteralPath .\docs\STATUS.md,.\docs\PENDING.md,.\docs\COMPLETED.md -Pattern "P14-01"`

## Expected Developer Handoff

Developer must return:

- Summary of changes.
- Exact verification commands and results.
- Completion timestamp in Asia/Shanghai time.
- Evidence paths updated.
- Statement confirming no product code was changed.
- Any remaining risk or `None`.

## Program Continuation

If all acceptance criteria pass and no stop rule is triggered, Developer may continue to `docs/WORK_ORDER_P14-02.md` after updating required evidence and handoff files.
