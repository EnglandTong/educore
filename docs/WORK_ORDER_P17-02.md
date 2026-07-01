# Work Order P17-02 - M17 Program And Role-State Refresh

Program: `docs/M17_PROGRAM_2026-06-20.md`
Status: Pending Developer

## Work Order ID

`P17-02`

## Complexity

Standard

## Task

Create the M17 program and refresh controller/developer state files so the next active program is explicit and ready for the Developer loop.

## Scope

- Create `docs/MILESTONE_M17_ACCEPTANCE_LEDGER_SYNCHRONIZATION_2026-06-20.md`.
- Create `docs/M17_PROGRAM_2026-06-20.md`.
- Create `docs/DISPATCH_M17_PROGRAM_TO_DEVELOPER.md`.
- Create `docs/WORK_ORDER_P17-01.md`, `docs/WORK_ORDER_P17-02.md`, and `docs/WORK_ORDER_P17-03.md`.
- Update `docs/TARGET.md`, `docs/CMS.md`, `docs/ROLE_ASSIGNMENT.md`, `docs/LOOP_CONFIG.md`, `docs/STATUS.md`, `docs/NEXT_ACTIONS.md`, `docs/PENDING.md`, `docs/COMPLETED.md`, `docs/CURRENT_ROLE_INSTRUCTIONS.md`, `docs/WORK_ORDER_ACTIVE.md`, and `docs/Work_Order_Active.md` to point at M17.

## Allowed Files

- `docs/TARGET.md`
- `docs/CMS.md`
- `docs/ROLE_ASSIGNMENT.md`
- `docs/LOOP_CONFIG.md`
- `docs/STATUS.md`
- `docs/NEXT_ACTIONS.md`
- `docs/PENDING.md`
- `docs/COMPLETED.md`
- `docs/CURRENT_ROLE_INSTRUCTIONS.md`
- `docs/WORK_ORDER_ACTIVE.md`
- `docs/Work_Order_Active.md`
- `docs/MILESTONE_M17_ACCEPTANCE_LEDGER_SYNCHRONIZATION_2026-06-20.md`
- `docs/M17_PROGRAM_2026-06-20.md`
- `docs/DISPATCH_M17_PROGRAM_TO_DEVELOPER.md`
- `docs/WORK_ORDER_P17-01.md`
- `docs/WORK_ORDER_P17-02.md`
- `docs/WORK_ORDER_P17-03.md`
- `docs/EVALUATION.md`
- `docs/LOOP_RUNS.jsonl`
- `docs/LOOP_LOG_Workbuddy.jsonl`

## Not Allowed Files

- `docs/ACCEPTANCE.md`
- `apps/**`
- `packages/**`
- `modules/**`
- `.env`
- `.env.*`
- `.git/**`
- `node_modules/**`
- Any path outside `D:\Development\EduCore`

## Acceptance Criteria

- The M17 milestone, program, dispatch, and work-order files exist.
- Current role, active program, and next-action files point at M17.
- `docs/TARGET.md` and controller state files reflect the M17 boundary.
- `Select-String -LiteralPath .\docs\TARGET.md,.\docs\CMS.md,.\docs\ROLE_ASSIGNMENT.md,.\docs\LOOP_CONFIG.md,.\docs\STATUS.md,.\docs\NEXT_ACTIONS.md,.\docs\PENDING.md -Pattern "M17","P17-01","P17-02","P17-03","Developer"` returns matches.

## Design Notes

- Keep the program docs narrow: acceptance ledger synchronization, role-state refresh, and handoff readiness only.
- Do not introduce any product, architecture, or deployment work.

## Boundaries

- Stop if any work requires product code changes or out-of-repo writes.
- Stop if the current milestone boundary in `docs/TARGET.md` must expand beyond docs and state synchronization.

## Verification Commands

- `Select-String -LiteralPath .\docs\TARGET.md,.\docs\CMS.md,.\docs\ROLE_ASSIGNMENT.md,.\docs\LOOP_CONFIG.md,.\docs\STATUS.md,.\docs\NEXT_ACTIONS.md,.\docs\PENDING.md -Pattern "M17","P17-01","P17-02","P17-03","Developer"`

## Expected Developer Handoff

- Summary of the M17 program and state refresh.
- Exact verification command and result.
- Completion timestamp in Asia/Shanghai time.
- Evidence paths updated.
- Skipped checks and reasons, or `None`.
- Remaining risks or `None`.
