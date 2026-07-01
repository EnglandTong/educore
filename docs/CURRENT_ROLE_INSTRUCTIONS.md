# CURRENT ROLE INSTRUCTIONS

Status: M29 Dispatched - Developer Executing Program
Last updated: 2026-07-01T17:00:00+08:00

## Active Role

Developer

## Current Assignment

Execute the full **M29 Program** sequentially. This is a multi-Work-Order Program, not a single ticket.

- Program: `M29 - Teacher Assignment Overview E2E Smoke Coverage`
- Dispatch: `Docs/DISPATCH_M29_PROGRAM_TO_DEVELOPER.md`
- Start with: `Docs/WORK_ORDER_P29-01.md`

## Work Order Sequence

| Order | ID | Complexity | Task |
|---|---|---|---|
| 1 | P29-01 | Lite | Audit teacher e2e mocks and page selectors |
| 2 | P29-02 | Standard | Add ClassOverview mock payload |
| 3 | P29-03 | Standard | Add Playwright assignments smoke test |
| 4 | P29-04 | Lite | Run e2e and consolidated handoff |

## Auto-Advance

Continue when prior Work Order verification passed, evidence recorded, no Stop Rule triggered, and changes stayed within Allowed Files.

Stop if e2e fixes require product page changes or Playwright installation beyond local availability.

## Final State

- Allowed: `Developer Complete`, `Ready for Controller/QA Review`
- Not allowed: `Accepted`, `Completed`, `Accepted With Risk`

## Reference Files

- Milestone: `Docs/MILESTONE_M29_TEACHER_ASSIGNMENT_OVERVIEW_E2E_SMOKE_COVERAGE_2026-07-01.md`
- Program: `Docs/M29_PROGRAM_2026-07-01.md`
- Dispatch: `Docs/DISPATCH_M29_PROGRAM_TO_DEVELOPER.md`
- Prior acceptance: `Docs/QA_M28_ACCEPTANCE_2026-07-01.md`
- Stop rules: `Docs/STOP_RULES.md`

## Developer Final State

- `In Progress` on `P29-01`
