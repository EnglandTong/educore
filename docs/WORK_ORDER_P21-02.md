# Work Order P21-02

## Work Order ID

`P21-02`

## Complexity

Standard

## Task

Publish M21 recovery state and return the M20 package for Controller/QA review.

## Scope

Developer may update current status, next action, pending, and role instruction files to show that the M20 handoff recovery is complete and the package is ready for Controller/QA review.

## Allowed Files

- `Docs/STATUS.md`
- `Docs/NEXT_ACTIONS.md`
- `Docs/PENDING.md`
- `Docs/CURRENT_ROLE_INSTRUCTIONS.md`
- `Docs/WORK_ORDER_ACTIVE.md`
- `Docs/Work_Order_Active.md`
- `Docs/LOOP_RUNS.jsonl`
- `Docs/LOOP_LOG_Workbuddy.jsonl`
- `Docs/LOOP_STATE_Workbuddy.md`

## Not Allowed Files

- Product source files outside `Docs/`
- `Docs/ACCEPTANCE.md`
- `Docs/STOP_RULES.md`
- `Docs/TARGET.md`
- `Docs/QA_M20_ACCEPTANCE_2026-06-22.md`
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- Status files identify M21 as the active recovery program.
- Status files identify `P21-01` and `P21-02` as the ordered recovery work.
- Final state is `Ready for Controller/QA Review`, not `Accepted` or `Completed`.
- `Docs/WORK_ORDER_ACTIVE.md` and `Docs/Work_Order_Active.md` show no active work order after completion.
- Loop logs include a `P21-02` review-handoff entry.

## Design Notes

- Keep M20 as `Failed` until Controller/QA re-reviews.
- Do not erase the original failure reason.
- Make the next action unambiguous for Controller/QA.

## Boundaries

- Docs-only state publication.
- No code changes.
- No new milestone beyond M21.
- Stop if the state files conflict with the M20 failure record or M21 dispatch.

## Verification Commands

- `Select-String -LiteralPath .\Docs\STATUS.md,.\Docs\NEXT_ACTIONS.md,.\Docs\PENDING.md,.\Docs\CURRENT_ROLE_INSTRUCTIONS.md -Pattern "M21","M20 Handoff Recovery","P21-01","P21-02","Ready for Controller/QA Review"`
- `Select-String -LiteralPath .\Docs\WORK_ORDER_ACTIVE.md,.\Docs\Work_Order_Active.md -Pattern "No active work order"`
- `Select-String -LiteralPath .\Docs\LOOP_RUNS.jsonl,.\Docs\LOOP_LOG_Workbuddy.jsonl -Pattern "P21-02","Ready for Controller/QA Review"`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- manual checks;
- skipped checks;
- known risks;
- final state `Ready for Controller/QA Review`.

