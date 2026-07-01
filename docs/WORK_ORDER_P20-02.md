# Work Order P20-02

## Work Order ID

`P20-02`

## Complexity

Standard

## Task

Author the M20 program pack, dispatch pack, and ordered work orders for the next bounded docs-only milestone.

## Scope

Create the program-definition files and ordered work-order files so the next controller-dispatched loop is explicit and bounded.

## Allowed Files

- `Docs/M20_PROGRAM_2026-06-22.md`
- `Docs/DISPATCH_M20_PROGRAM_TO_DEVELOPER.md`
- `Docs/WORK_ORDER_P20-01.md`
- `Docs/WORK_ORDER_P20-02.md`
- `Docs/WORK_ORDER_P20-03.md`
- `Docs/LOOP_RUNS.jsonl`
- `Docs/LOOP_LOG_Workbuddy.jsonl`

## Not Allowed Files

- Product code, build artifacts, deployment files, or files outside `D:\Development\EduCore`

## Acceptance Criteria

- The M20 program file exists and includes scope, non-goals, sequence, dependencies, auto-advance rules, and stop rules.
- The dispatch file authorizes Developer to execute the M20 program in order.
- All three M20 work orders exist and contain the required template fields.
- The program remains inside the docs-only boundary.

## Design Notes

- Keep the wording explicit and bounded.
- Reuse the same governance pattern used by prior milestone programs.
- Avoid introducing any new subsystem or product surface.

## Boundaries

- Do not touch product code.
- Do not change acceptance criteria in `Docs/ACCEPTANCE.md`.
- Do not expand beyond the docs-only planning boundary.

## Verification Commands

- `Select-String -LiteralPath .\Docs\M20_PROGRAM_2026-06-22.md,.\Docs\DISPATCH_M20_PROGRAM_TO_DEVELOPER.md,.\Docs\WORK_ORDER_P20-01.md,.\Docs\WORK_ORDER_P20-02.md,.\Docs\WORK_ORDER_P20-03.md -Pattern "P20-01","P20-02","P20-03","Work Order ID","Complexity","Acceptance Criteria","Verification Commands","Expected Developer Handoff"`

## Expected Developer Handoff

- M20 program pack and ordered work orders are complete and ready for Controller/QA review.

## Developer Handoff - P20-02

- Completed: `2026-06-22T20:53:58.6761461+08:00`
- Status: `Developer Complete`
- Changed files:
  - `Docs/M20_PROGRAM_2026-06-22.md`
  - `Docs/WORK_ORDER_P20-02.md`
  - `Docs/LOOP_RUNS.jsonl`
  - `Docs/LOOP_LOG_Workbuddy.jsonl`
- Verification:
  - `Select-String -LiteralPath .\Docs\M20_PROGRAM_2026-06-22.md,.\Docs\DISPATCH_M20_PROGRAM_TO_DEVELOPER.md,.\Docs\WORK_ORDER_P20-01.md,.\Docs\WORK_ORDER_P20-02.md,.\Docs\WORK_ORDER_P20-03.md -Pattern "P20-01","P20-02","P20-03","Work Order ID","Complexity","Acceptance Criteria","Verification Commands","Expected Developer Handoff"` -> `PASS`
- Manual checks:
  - Confirmed the program pack remains inside the docs-only boundary.
  - Confirmed the ordered work orders still contain the required template fields.
  - Confirmed no product code or out-of-repo files were changed.
- Skipped checks: `None`
- Risks: `None`
