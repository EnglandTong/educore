# Work Order P18-02

## Work Order ID

`P18-02`

## Complexity

`Standard`

## Task

Author the M18 program pack, dispatch file, and ordered work orders.

## Scope

- Create the M18 program file.
- Create the M18 dispatch file.
- Create the ordered work order files for P18-01 through P18-03.

## Allowed Files

- `Docs/M18_PROGRAM_2026-06-21.md`
- `Docs/DISPATCH_M18_PROGRAM_TO_DEVELOPER.md`
- `Docs/WORK_ORDER_P18-01.md`
- `Docs/WORK_ORDER_P18-02.md`
- `Docs/WORK_ORDER_P18-03.md`
- `Docs/STATUS.md`
- `Docs/NEXT_ACTIONS.md`
- `Docs/PENDING.md`
- `Docs/COMPLETED.md`
- `Docs/LOOP_STATE_Workbuddy.md`
- `Docs/LOOP_RUNS.jsonl`
- `Docs/LOOP_LOG_Workbuddy.jsonl`

## Not Allowed Files

- Product code, tests, or runtime files.
- Files outside `D:\Development\EduCore`.
- Any acceptance history rewrite or destructive change.

## Acceptance Criteria

- The program file defines goal, scope, non-goals, work-order order, dependencies, auto-advance rules, stop rules, and final Developer state.
- The dispatch file authorizes only the listed M18 work orders.
- Each work order has all required fields from `Docs/WORK_ORDER_TEMPLATE.md`.
- No stop rule is triggered.

## Design Notes

- Use the minimal next bounded loop.
- Keep the work orders sequential and dependency-safe.

## Boundaries

- No architecture change.
- No product change.
- No out-of-repo writes.

## Verification Commands

- `Select-String -LiteralPath .\docs\M18_PROGRAM_2026-06-21.md,.\docs\DISPATCH_M18_PROGRAM_TO_DEVELOPER.md -Pattern "P18-01","P18-02","P18-03","Developer Complete","Ready for Controller/QA Review"`
- `Select-String -LiteralPath .\docs\WORK_ORDER_P18-01.md,.\docs\WORK_ORDER_P18-02.md,.\docs\WORK_ORDER_P18-03.md -Pattern "Work Order ID","Complexity","Acceptance Criteria","Verification Commands","Expected Developer Handoff"`

## Expected Developer Handoff

- Changed files.
- Verification command results.
- Program and dispatch evidence.
- Remaining risks, if any.
- Loop state and run log updates.
