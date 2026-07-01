# Work Order P18-03

## Work Order ID

`P18-03`

## Complexity

`Lite`

## Task

Refresh the active role-state documents so the Developer can execute M18 without ambiguity.

## Scope

- Update the active role and queue documents to point to M18.
- Update the current-status and next-action files for the new program.
- Refresh the loop evidence files and active-work pointers.

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
- `Docs/LOOP_RUNS.jsonl`
- `Docs/LOOP_LOG_Workbuddy.jsonl`

## Not Allowed Files

- Product code, tests, or runtime files.
- Files outside `D:\Development\EduCore`.
- Any acceptance history rewrite or destructive change.

## Acceptance Criteria

- The state files point to M18 as the active program.
- The next action clearly instructs Developer to start P18-01.
- The queue and active-work pointers are coherent.
- No stop rule is triggered.

## Design Notes

- Preserve M17 acceptance history.
- Update only the active loop state and planning references.

## Boundaries

- No code changes.
- No architecture changes.
- No out-of-repo writes.

## Verification Commands

- `Select-String -LiteralPath .\docs\STATUS.md,.\docs\NEXT_ACTIONS.md,.\docs\PENDING.md,.\docs\COMPLETED.md -Pattern "M18","P18-01","P18-02","P18-03","Developer"`
- `Select-String -LiteralPath .\docs\CMS.md,.\docs\ROLE_ASSIGNMENT.md,.\docs\LOOP_CONFIG.md,.\docs\CURRENT_ROLE_INSTRUCTIONS.md -Pattern "M18","Developer","Active","Continue"`

## Expected Developer Handoff

- Changed files.
- Verification command results.
- Active-program evidence paths.
- Remaining risks, if any.
