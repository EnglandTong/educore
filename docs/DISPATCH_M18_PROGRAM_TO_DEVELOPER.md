# Dispatch - M18 Program To Developer

Status: Active
Issued by: MRT-Controller-QA
Issued at: 2026-06-21T09:46:14.4875632+08:00

## Authorization

Developer is authorized to execute the full M18 Program in order:

1. `docs/WORK_ORDER_P18-01.md`
2. `docs/WORK_ORDER_P18-02.md`
3. `docs/WORK_ORDER_P18-03.md`

Developer may autonomously continue to the next listed work order after completing the current one only if:

- Work order acceptance criteria pass.
- Required verification commands are run or an allowed no-run reason is documented.
- Evidence and handoff updates are written to `docs/STATUS.md`, `docs/NEXT_ACTIONS.md`, `docs/PENDING.md`, and `docs/COMPLETED.md`.
- `docs/LOOP_RUNS.jsonl` and `docs/LOOP_LOG_Workbuddy.jsonl` are appended per loop handoff.
- No `STOP_RULES` condition is triggered.
- No out-of-scope file change is needed.

## Required Per-Work-Order Loop

For every work order, Developer must:

- Execute only the listed scope.
- Stay inside the allowed file list.
- Run verification commands.
- Update status, pending, and loop evidence.
- Append run logs.
- Record exact Asia/Shanghai timestamps and evidence paths.
- Write handoff before moving to the next work order.

## Program Completion Rule

When all work orders are complete, Developer must create a consolidated M18 milestone handoff and set state to `Developer Complete` or `Ready for Controller/QA Review`.

Developer must not mark M18 as `Accepted` or `Completed`.

## Controller Closure

- M17 was accepted by Controller/QA at `2026-06-21T01:09:58.9679806+08:00`.
- M18 was staged by Controller/QA at `2026-06-21T09:46:14.4875632+08:00`.
- No further Developer action is authorized outside the listed M18 work orders.
