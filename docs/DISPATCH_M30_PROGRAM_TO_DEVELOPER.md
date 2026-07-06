# Dispatch M30 Program to Developer

Date: 2026-07-01  
From: MRT-Controller-QA  
To: MRT-Developer  
Program: M30 - Teacher Assignments List API and UI Integration  
Milestone: `Docs/MILESTONE_M30_TEACHER_ASSIGNMENTS_LIST_API_AND_UI_INTEGRATION_2026-07-01.md`

---

## 1. Authorization

MRT-Developer is authorized to execute the full M30 Program:

## 1a. Milestone Goal

| Field | Value |
|---|---|
| Milestone | M30 - Teacher Assignments List API and UI Integration |
| Primary goal | Read-only assignments list API + Assigned Students UI on overview page |
| Closes | M27/M28/M29 deferred follow-up for dedicated `/teacher/assignments` data |
| Out of scope | Assignment CRUD, schema/migration, new architecture |

| Order | ID | Complexity | Task |
|---|---|---|---|
| 1 | P30-01 | Lite | Audit TeacherAssignment model, teacher routes, frontend patterns |
| 2 | P30-02 | Standard | Add read-only GET `/assignments` backend endpoint |
| 3 | P30-03 | Standard | Add frontend fetcher, hook, Assigned Students list UI |
| 4 | P30-04 | Lite | E2e mock update, verification, consolidated handoff |

## 2. Auto-Advance Rules

Proceed when prior Work Order verified, evidence recorded, no Stop Rule, no scope violation, fewer than 3 consecutive failures.

Stop if schema migration needed, unauthorized files touched, or STOP_RULES triggered.

## 3. Evidence Requirements

- P30-01: Audit of model fields, route patterns, frontend API conventions.
- P30-02: Service function + route; sample response shape.
- P30-03: API types, hook, UI section with list rendering.
- P30-04: typecheck/build/e2e output; `HANDOFF_M30_PROGRAM_DEVELOPER.md`.

## 4. Stop Conditions

- Schema/migration required.
- Changes outside Allowed Files.
- STOP_RULES triggered.
- Three consecutive verification failures.

## 5. Final Status Rules

Only `Developer Complete` or `Ready for Controller/QA Review`. Never `Accepted`/`Completed`.

## 6. Program Completion

Create handoff, update governance, append loop evidence, set `Ready for Controller/QA Review`, await QA.

## 7. Reference Files

- Prior acceptance: `Docs/QA_M29_ACCEPTANCE_2026-07-01.md`
- Model: `apps/api/src/models/TeacherAssignment.ts`
- Existing overview: `apps/web/src/pages/teacher/AssignmentOverviewPage.tsx`

## 8. Dispatch Signature

- Dispatched: `2026-07-01T19:00:00+08:00`
- Developer authorized for sequential M30 execution
