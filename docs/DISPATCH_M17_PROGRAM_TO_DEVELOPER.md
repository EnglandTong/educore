# Dispatch - M17 Program To Developer

Status: Closed
Issued by: MRT-Controller-QA
Issued at: 2026-06-20T23:57:01.4936738+08:00

## Authorization

Developer is authorized to execute the full M17 Program in order:

1. `docs/WORK_ORDER_P17-01.md`
2. `docs/WORK_ORDER_P17-02.md`
3. `docs/WORK_ORDER_P17-03.md`

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

When all work orders are complete, Developer must create a consolidated M17 milestone handoff and set state to `Developer Complete` or `Ready for Controller/QA Review`.

Developer must not mark M17 as `Accepted` or `Completed`.

## Controller Closure

- M17 was accepted by Controller/QA at `2026-06-21T01:09:58.9679806+08:00`.
- QA record: `docs/QA_M17_ACCEPTANCE_2026-06-21.md`
- No further Developer action is authorized under this dispatch.
