# Dispatch - M16 Program To Developer

Status: Active
Issued by: MRT-Controller-QA
Issued at: 2026-06-20T10:52:00+08:00

## Authorization

Developer is authorized to execute the full M16 Program in order:

1. `docs/WORK_ORDER_P16-01.md`
2. `docs/WORK_ORDER_P16-02.md`
3. `docs/WORK_ORDER_P16-03.md`
4. `docs/WORK_ORDER_P16-04.md`

Developer may autonomously continue to the next listed work order after completing the current one only if:

- Work order acceptance criteria pass.
- Required verification commands are run or allowed no-run reason is documented.
- Evidence and handoff updates are written to `docs/STATUS.md`, `docs/NEXT_ACTIONS.md`, `docs/PENDING.md`, and `docs/COMPLETED.md`.
- `docs/LOOP_RUNS.jsonl` and `docs/LOOP_LOG_Workbuddy.jsonl` are appended per loop handoff.
- No STOP RULES condition is triggered.
- No out-of-scope file change is needed.

## Required Per-Work-Order Loop

For every work order, Developer must:

- Execute only listed scope.
- Stay inside allowed file list.
- Run verification commands.
- Update status, pending, and pending loop evidence.
- Append run logs.
- Record exact Asia/Shanghai timestamps and evidence paths.
- Write handoff before moving to next work order.

## Program Completion Rule

When all work orders are complete, Developer must create a consolidated M16 milestone handoff and set state to `Developer Complete` or `Ready for Controller/QA Review`.

Developer must not mark M16 as `Accepted` or `Completed`.

## Stop And Return

Developer must stop and return to Controller/QA or Owner if:

- Any `docs/STOP_RULES.md` condition is triggered.
- A non-docs production or architecture change is required.
- Three unresolved consecutive command failures occur.
- Evidence history would need to be rewritten instead of appended.

