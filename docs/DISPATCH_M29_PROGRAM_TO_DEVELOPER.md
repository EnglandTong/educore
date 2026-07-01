# Dispatch M29 Program to Developer

Date: 2026-07-01  
From: MRT-Controller-QA  
To: MRT-Developer  
Program: M29 - Teacher Assignment Overview E2E Smoke Coverage  
Milestone: `Docs/MILESTONE_M29_TEACHER_ASSIGNMENT_OVERVIEW_E2E_SMOKE_COVERAGE_2026-07-01.md`

---

## 1. Authorization

MRT-Developer is authorized to execute the full M29 Program consisting of four ordered Work Orders:

| Order | ID | Complexity | Task |
|---|---|---|---|
| 1 | P29-01 | Lite | Audit teacher e2e mocks and Assignment Overview page selectors |
| 2 | P29-02 | Standard | Add realistic ClassOverview mock payload in e2e-mocks.ts |
| 3 | P29-03 | Standard | Add Playwright smoke test for assignments navigation and page content |
| 4 | P29-04 | Lite | Run e2e, consolidated handoff, and governance sync |

## 2. Auto-Advance Rules

Developer may automatically proceed to the next Work Order when ALL are true:

- Previous Work Order completed with evidence handoff.
- No `Docs/STOP_RULES.md` item triggered.
- No verification command failed without documented fix.
- No unauthorized file modification.
- Fewer than 3 consecutive failures of the same verification command.

Otherwise stop and return to Controller/QA.

## 3. Evidence Requirements

- P29-01: Documented audit of `teacher-journey.spec.ts`, `e2e-mocks.ts` teacher handlers, and AssignmentOverviewPage selectors.
- P29-02: Mock payload diff and shape alignment with `ClassOverview` interface.
- P29-03: New or extended spec file path; test steps and assertions described.
- P29-04: `test:e2e` command output; `Docs/HANDOFF_M29_PROGRAM_DEVELOPER.md`; updated governance files.

Program completion requires `Docs/LOOP_RUNS.jsonl` entries for P29-01 through P29-04.

## 4. Stop Conditions

Stop immediately and mark `Blocked` if:

- Playwright/browser setup requires system-level installation not already available.
- E2E failures require product page changes in `apps/web/src/` (out of scope — report blocker instead).
- Backend changes would be required.
- Any STOP_RULES item triggers.
- Three consecutive e2e failures for the same unresolved reason.

## 5. Final Status Rules

Developer may mark only:

- `Developer Complete`, or
- `Ready for Controller/QA Review`

Developer must NOT mark `Accepted`, `Completed`, or `Accepted With Risk`.

## 6. Program Completion

1. Create `Docs/HANDOFF_M29_PROGRAM_DEVELOPER.md`.
2. Update governance state files.
3. Append loop evidence.
4. Set final status to `Ready for Controller/QA Review`.
5. Stop and await Controller/QA review.

## 7. Reference Files

- Milestone: `Docs/MILESTONE_M29_TEACHER_ASSIGNMENT_OVERVIEW_E2E_SMOKE_COVERAGE_2026-07-01.md`
- Program: `Docs/M29_PROGRAM_2026-07-01.md`
- Prior acceptance: `Docs/QA_M28_ACCEPTANCE_2026-07-01.md`
- Prior handoff: `Docs/HANDOFF_M28_PROGRAM_DEVELOPER.md`
- ClassOverview type: `apps/web/src/api/teacher.ts`
- Existing teacher e2e: `apps/web/e2e/teacher-journey.spec.ts`

## 8. Dispatch Signature

- Dispatched by: MRT-Controller-QA
- Dispatched at: 2026-07-01T17:00:00+08:00
- Developer role: authorized for full M29 Program sequential execution
