# Work Order P20-03

## Work Order ID

`P20-03`

## Complexity

Standard

## Task

Publish the M20 role-state, queue, and loop-coherence documents so the next execution pass is unambiguous.

## Scope

Update the assignment, status, queue, and loop-trace documents so the M20 program is visible and ready for the Developer loop.

## Allowed Files

- `Docs/STATUS.md`
- `Docs/NEXT_ACTIONS.md`
- `Docs/PENDING.md`
- `Docs/COMPLETED.md`
- `Docs/CMS.md`
- `Docs/ROLE_ASSIGNMENT.md`
- `Docs/LOOP_CONFIG.md`
- `Docs/CURRENT_ROLE_INSTRUCTIONS.md`
- `Docs/WORK_ORDER_ACTIVE.md`
- `Docs/Work_Order_Active.md`
- `Docs/LOOP_STATE_Workbuddy.md`
- `Docs/LOOP_RUNS.jsonl`
- `Docs/LOOP_LOG_Workbuddy.jsonl`

## Not Allowed Files

- Product code, build artifacts, deployment files, or files outside `D:\Development\EduCore`

## Acceptance Criteria

- The active role and current work order point to the M20 program.
- The queue and status documents show the same M20 state.
- The loop logs contain the M20 publication record.
- The final developer-facing state is ready for the next review step, not Accepted or Completed.

## Design Notes

- Keep the queue single-sourced.
- Make the handoff readable without needing context from prior milestones.
- Preserve the accepted M19 record while re-pointing the active loop to M20.

## Boundaries

- Do not touch product code.
- Do not change acceptance contract text.
- Do not expand beyond the docs-only release boundary.

## Verification Commands

- `Select-String -LiteralPath .\Docs\STATUS.md,.\Docs\NEXT_ACTIONS.md,.\Docs\PENDING.md,.\Docs\COMPLETED.md,.\Docs\CMS.md,.\Docs\ROLE_ASSIGNMENT.md,.\Docs\LOOP_CONFIG.md,.\Docs\CURRENT_ROLE_INSTRUCTIONS.md,.\Docs\WORK_ORDER_ACTIVE.md,.\Docs\Work_Order_Active.md -Pattern "M20","P20-01","P20-02","P20-03","Ready for Controller/QA Review","Developer Complete","No active work order"`
- `Select-String -LiteralPath .\Docs\LOOP_STATE_Workbuddy.md,.\Docs\LOOP_RUNS.jsonl,.\Docs\LOOP_LOG_Workbuddy.jsonl -Pattern "M20","P20-01","P20-02","P20-03"`

## Expected Developer Handoff

- Role-state and queue documents align to the M20 program and the Developer can return the package for Controller/QA review.
