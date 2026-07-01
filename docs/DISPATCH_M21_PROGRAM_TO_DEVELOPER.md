# Dispatch - M21 Program To Developer

Date: 2026-06-27
From: MRT-Controller-QA
To: MRT-Developer
Program: `M21 - M20 Handoff Recovery`
Status: Authorized for sequential execution

## Authorization

Developer is authorized to execute the full M21 Program in order:

1. `P21-01`
2. `P21-02`

Developer may continue from one work order to the next without intermediate Controller/QA review only when the previous work order has passing verification, written evidence, and no stop-rule trigger.

## Required Behavior

- Read the M21 milestone, program, dispatch, and work-order files before implementation.
- Execute only the current work order's bounded scope.
- Record commands, results, changed files, manual checks, skipped checks, risks, and next state.
- Update status files only as specified by the work order.
- Append loop evidence instead of deleting or rewriting historical evidence.
- At program end, return `Ready for Controller/QA Review`.

## Not Authorized

- Product code edits.
- Architecture, subsystem, shared-layer, deployment, or external-service changes.
- Changes outside `D:\Development\EduCore`.
- Modifying acceptance pass conditions.
- Marking any milestone as `Accepted`, `Accepted With Risk`, or `Completed`.

## Stop Conditions

Follow `docs/STOP_RULES.md`. Stop and mark `Blocked` if recovery requires credentials, production access, destructive git operations, out-of-repo writes, architecture changes, or repeated unresolved verification failures.

## Expected Final Handoff

Developer must create or update:

- `docs/HANDOFF_M20_PROGRAM_DEVELOPER.md`
- `docs/STATUS.md`
- `docs/NEXT_ACTIONS.md`
- `docs/PENDING.md`
- `docs/CURRENT_ROLE_INSTRUCTIONS.md`
- `docs/LOOP_RUNS.jsonl`
- `docs/LOOP_LOG_Workbuddy.jsonl`

The final package must point Controller/QA to the M20 failure record and the recovered M20 consolidated handoff.

