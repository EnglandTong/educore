# Dispatch - M15 Program To Developer

Status: Active
Issued by: MRT-Controller-QA
Issued at: 2026-06-20T10:03:37+08:00

## Authorization

Developer is authorized to execute the full M15 Program in order:

1. `docs/WORK_ORDER_P15-01.md`
2. `docs/WORK_ORDER_P15-02.md`
3. `docs/WORK_ORDER_P15-03.md`
4. `docs/WORK_ORDER_P15-04.md`

Developer may autonomously continue to the next listed work order after completing the current one only if the work order acceptance criteria pass, evidence is recorded, status files are updated, no stop rule is triggered, and no out-of-scope file change is required.

## Required Per-Work-Order Loop

For every work order, Developer must:

- Execute only the listed scope.
- Stay inside the allowed files.
- Run the listed verification commands or document an allowed no-run reason.
- Update `docs/STATUS.md`, `docs/PENDING.md`, and `docs/COMPLETED.md`.
- Append `docs/LOOP_RUNS.jsonl` and `docs/LOOP_LOG_Workbuddy.jsonl` evidence.
- Record exact Asia/Shanghai timestamps and evidence paths.
- Write a handoff before moving to the next work order.

## Program Completion Rule

When all work orders are complete, Developer must create a consolidated M15 milestone handoff and set the state to `Developer Complete` or `Ready for Controller/QA Review`.

Developer must not mark M15 as `Accepted` or `Completed`. Only Controller/QA can sign acceptance.

## Stop And Return

Developer must stop and return to Controller/QA or Owner if any `docs/STOP_RULES.md` condition is triggered, if the work requires files outside the allowed list, or if the same verification command fails three consecutive times for the same unresolved reason.
