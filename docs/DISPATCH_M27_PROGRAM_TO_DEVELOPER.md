# Dispatch M27 Program to Developer

Date: 2026-07-01  
From: MRT-Controller-QA  
To: MRT-Developer  
Program: M27 - Teacher Assignment Overview Dashboard  
Milestone: `Docs/MILESTONE_M27_TEACHER_ASSIGNMENT_OVERVIEW_DASHBOARD_2026-07-01.md`

---

## 1. Authorization

MRT-Developer is authorized to execute the full M27 Program consisting of four ordered Work Orders:

| Order | ID | Complexity | Task |
|---|---|---|---|
| 1 | P27-01 | Lite | Verify existing teacher page infrastructure and API readiness |
| 2 | P27-02 | Standard | Create teacher assignment data fetcher and store |
| 3 | P27-03 | Standard | Create Teacher Assignment Overview page component |
| 4 | P27-04 | Lite | Register route, integrate page, and produce consolidated handoff |

## 2. Auto-Advance Rules

Developer may automatically proceed to the next Work Order provided ALL of the following are true:

- The previous Work Order has been completed with a handoff containing evidence.
- No item in `Docs/STOP_RULES.md` was triggered.
- No verification command failed for the previous Work Order.
- No scope conflict or unauthorized file modification was detected.
- No more than 3 consecutive failures occurred.

If any condition is violated, Developer must stop and return the current state to Controller/QA.

## 3. Evidence Requirements

Per Work Order:

- P27-01: Command outputs documenting existing teacher infrastructure, model fields, framework, and API patterns.
- P27-02: Created fetcher and store files with paths; build result.
- P27-03: Created overview page component with path; component structure description.
- P27-04: Route registration evidence; consolidated handoff at `Docs/HANDOFF_M27_PROGRAM_DEVELOPER.md`.

At the end of the Program:

- A consolidated handoff must be created at `Docs/HANDOFF_M27_PROGRAM_DEVELOPER.md`.
- `Docs/LOOP_RUNS.jsonl` must contain entries for P27-01 through P27-04.

## 4. Stop Conditions

Developer must stop immediately and mark work `Blocked` if:

- Any `Docs/STOP_RULES.md` condition is triggered.
- Existing teacher pages or API endpoints are non-functional and cannot be fixed within scope.
- The same verification command fails three consecutive times.
- Developer detects a scope conflict or needs an Owner-only decision.

## 5. What Developer Must NOT Do

- Do NOT modify any files under `apps/api/src/`, `packages/algorithms/`, or `modules/`.
- Do NOT mark any Work Order or the Program as `Accepted` or `Completed`.
- Do NOT modify `Docs/TARGET.md`, `Docs/STOP_RULES.md`, or `Docs/ACCEPTANCE.md`.
- Do NOT perform destructive git operations.
- Do NOT write outside `D:\Development\EduCore`.
- Do NOT install new dependencies unless they are already available locally.
- Do NOT create new shared/reusable UI components.

## 6. Expected Final Status

At Program completion, Developer must set status to one of:

- `Developer Complete`
- `Ready for Controller/QA Review`

Developer must NOT use: `Accepted`, `Accepted With Risk`, `Completed`.

## 7. Controller/QA Will Review

After receiving the consolidated handoff, Controller/QA will:

1. Verify the overview page file exists and uses existing patterns.
2. Verify no backend files were modified.
3. Verify no unauthorized files were changed.
4. Check acceptance criteria against evidence.
5. Record the decision in `Docs/QA_M27_ACCEPTANCE_YYYY-MM-DD.md`.

## 8. Program Files

- Milestone: `Docs/MILESTONE_M27_TEACHER_ASSIGNMENT_OVERVIEW_DASHBOARD_2026-07-01.md`
- Program: `Docs/M27_PROGRAM_2026-07-01.md`
- Work Orders:
  - `Docs/WORK_ORDER_P27-01.md`
  - `Docs/WORK_ORDER_P27-02.md`
  - `Docs/WORK_ORDER_P27-03.md`
  - `Docs/WORK_ORDER_P27-04.md`
- Dispatch: `Docs/DISPATCH_M27_PROGRAM_TO_DEVELOPER.md` (this file)

---

Controller/QA Signature: MRT-Controller-QA  
Dispatch Date: 2026-07-01  
Status: Dispatched / Active
