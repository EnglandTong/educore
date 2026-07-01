# Dispatch - M20 Next Dispatch Readiness

Status: Active
Owner: MRT-Controller-QA
Created: 2026-06-22T00:54:50.6437776+08:00

## Authorization

Developer is authorized to execute the M20 program in order and may continue from one work order to the next only when the current work order passes verification and no stop rule is triggered.

## Program

- Milestone: `M20 - Next Dispatch Readiness`
- Program: `docs/M20_PROGRAM_2026-06-22.md`

## Ordered Work Orders

1. `P20-01` - M19 acceptance carry-forward and M20 boundary lock.
2. `P20-02` - M20 program and dispatch pack authoring.
3. `P20-03` - M20 role-state publication and queue coherence.

## Execution Rules

- Complete the work orders in order.
- Record exact Asia/Shanghai timestamps, verification commands, results, skipped checks, and evidence paths after each work order.
- Update `Docs/LOOP_RUNS.jsonl` and `Docs/LOOP_LOG_Workbuddy.jsonl` after each work order.
- Do not expand beyond the files listed in the individual work orders.
- Do not mark the milestone `Accepted` or `Completed`.
- Final Developer state must be `Developer Complete` or `Ready for Controller/QA Review`.

## Controller Exit Criteria

- A consolidated M20 developer handoff exists.
- The M20 state chain is coherent across the controller/developer docs.
- The program is ready for Controller/QA review.
