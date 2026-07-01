# Dispatch - M24 Program To Developer

Date: 2026-07-01
From: MRT-Controller-QA
To: MRT-Developer
Program: `M24 - Post-M23 Evidence Chain Continuity`
Status: Authorized for sequential execution

## Authorization

Developer is authorized to execute the full M24 Program in order:

1. `P24-01`
2. `P24-02`
3. `P24-03`

Developer may continue from one work order to the next without intermediate Controller/QA review only when the previous work order has passing verification, written evidence, and no stop-rule trigger.

## Required Behavior

- Read the M24 milestone, program, dispatch, and all M24 work-order files before execution.
- Execute only the current work order's bounded scope.
- Record commands, results, changed files, manual checks, skipped checks, risks, and next state.
- Update status files only as specified by the active work order.
- Append loop evidence instead of deleting or rewriting historical evidence.
- At program end, return `Ready for Controller/QA Review`.

## Not Authorized

- Product code edits.
- UI/UX changes.
- Architecture, subsystem, shared-layer, deployment, dependency, or external-service changes.
- Changes outside `D:\Development\EduCore`.
- Modifying acceptance pass conditions.
- Marking any milestone as `Accepted`, `Accepted With Risk`, or `Completed`.

## Stop Conditions

Follow `docs/STOP_RULES.md`. Stop and mark `Blocked` if continuity or ledger work requires credentials, production access, destructive git operations, out-of-repo writes, architecture changes, or repeated unresolved verification failures.

## Expected Final Handoff

Developer must create or update:

- `docs/EVIDENCE_LEDGER_M24.md`
- `docs/HANDOFF_M24_PROGRAM_DEVELOPER.md`
- `docs/STATUS.md`
- `docs/NEXT_ACTIONS.md`
- `docs/PENDING.md`
- `docs/CURRENT_ROLE_INSTRUCTIONS.md`
- `docs/WORK_ORDER_ACTIVE.md`
- `docs/Work_Order_Active.md`
- `docs/LOOP_RUNS.jsonl`
- `docs/LOOP_LOG_Workbuddy.jsonl`

The final package must show that M23 is accepted and M24 is ready for Controller/QA review.
