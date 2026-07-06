# M30 - Teacher Assignments List API and UI Integration

Milestone ID: M30  
Name: Teacher Assignments List API and UI Integration  
Date: 2026-07-01  
Owner: MRT-Controller-QA  
Status: Staged / Ready for Dispatch

---

## 1. Milestone Objective

Add a read-only dedicated `GET /api/v1/teacher/assignments` endpoint that returns the teacher's assigned students, and integrate an Assigned Students list section into the existing Assignment Overview page.

## 1a. Why This Milestone

| Predecessor | What it delivered | Gap M30 closes |
|---|---|---|
| M27 | Overview page using aggregate `/class/overview` | No per-student assignment list |
| M28 | Build verify, Badge, sidebar link | — |
| M29 | E2e smoke for navigation + overview content | — |
| **M30** | **Dedicated list API + UI** | **Shows each assigned student** |

## 2. Milestone Scope

- Audit existing `TeacherAssignment` model and teacher API patterns.
- Add `getTeacherAssignments` service and `GET /assignments` route in the existing teacher module.
- Add frontend fetcher, hook, and UI list section on `AssignmentOverviewPage`.
- Update e2e mock for the new endpoint; verify typecheck/build and extend smoke test if feasible.
- Produce consolidated Program handoff.

## 3. Non-Goals

- No assignment create, edit, delete, or reassignment.
- No database schema or migration changes.
- No new architecture, shared layers, or subsystems.
- No modifications to `packages/algorithms/` or `modules/`.
- No production deployment.
- No changes outside listed Allowed Files per Work Order.

## 4. Program

- Program file: `Docs/M30_PROGRAM_2026-07-01.md`
- Dispatch file: `Docs/DISPATCH_M30_PROGRAM_TO_DEVELOPER.md`

## 5. Work Orders

| Order | ID | Task | Complexity |
|---|---|---|---|
| 1 | P30-01 | Audit TeacherAssignment model, teacher routes, and frontend API patterns | Lite |
| 2 | P30-02 | Add read-only GET `/assignments` backend endpoint | Standard |
| 3 | P30-03 | Add frontend fetcher, hook, and Assigned Students list UI | Standard |
| 4 | P30-04 | E2e mock update, verification, and consolidated handoff | Lite |

## 6. Dependencies

- P30-01 → P30-02 → P30-03 → P30-04 sequential.

## 7. Acceptance Criteria

- [ ] `GET /api/v1/teacher/assignments` returns assigned students for authenticated teacher.
- [ ] Assignment Overview page displays assigned students list from new endpoint.
- [ ] Typecheck and build pass for `@educore/web` and `@educore/api` if applicable.
- [ ] E2e mock covers new endpoint; assignments smoke test still passes.
- [ ] `Docs/HANDOFF_M30_PROGRAM_DEVELOPER.md` references all Work Orders.
- [ ] No schema changes; no STOP_RULES triggered.

## 8. Risks

- Backend changes require careful scope limiting to teacher module only.
- E2e may need mock update when frontend calls new endpoint.

## 9. QA Review Entry Point

Controller/QA verifies endpoint shape, UI integration, scope compliance, and handoff evidence.
