# Dispatch - M19 Program To Developer

Status: Active
Issued by: MRT-Controller-QA
Issued at: 2026-06-21T18:20:35.9014804+08:00

## Authorization

Developer is authorized to execute the full M19 Program in order:

1. `docs/WORK_ORDER_P19-01.md`
2. `docs/WORK_ORDER_P19-02.md`

Developer may autonomously continue to the next listed work order after completing the current one only if:

- Work order acceptance criteria pass.
- Required verification commands are run or an allowed no-run reason is documented.
- Evidence and handoff updates are written to the approved docs files for that work order.
- `docs/LOOP_RUNS.jsonl` and `docs/LOOP_LOG_Workbuddy.jsonl` are appended per loop handoff.
- No `STOP_RULES` condition is triggered.
- No out-of-scope file change is needed.

## Required Per-Work-Order Loop

For every work order, Developer must:

- Execute only the listed scope.
- Stay inside the allowed file list.
- Run verification commands.
- Update status, pending, and loop evidence as required by the work order.
- Append run logs.
- Record exact Asia/Shanghai timestamps and evidence paths.
- Write handoff before moving to the next work order.

## Program Completion Rule

When all work orders are complete, Developer must leave the program in `Ready for Controller/QA Review` or `Developer Complete`.

Developer must not mark M19 as `Accepted` or `Completed`.

## Controller Closure

- M18 was reviewed and failed because the consolidated M18 handoff was missing.
- M19 exists to recover that handoff and restore state-chain coherence.
- No further Developer action is authorized outside the listed M19 work orders.
