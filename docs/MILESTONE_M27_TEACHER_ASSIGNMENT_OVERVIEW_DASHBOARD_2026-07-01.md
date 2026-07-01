# M27 - Teacher Assignment Overview Dashboard

Milestone ID: M27  
Name: Teacher Assignment Overview Dashboard  
Date: 2026-07-01  
Owner: MRT-Controller-QA  
Status: Staged / Ready for Dispatch

---

## 1. Milestone Objective

Implement a read-only Teacher Assignment Overview Dashboard within the existing `apps/web/src/pages/teacher/` directory. This is the first product-facing milestone after the governance stabilization cycle (M22-M25) and the product baseline audit (M26).

The dashboard will display a list of teacher assignments with student names, subjects, and basic progress indicators, consuming data from the existing `TeacherAssignment` model via the existing API.

## 2. Milestone Scope

- Create a Teacher Assignment Overview page component in `apps/web/src/pages/teacher/`.
- Add a route for the overview page if not already present.
- Create a data fetcher/store for teacher assignment data if not already present.
- Display assignment data in a structured table or card layout.
- Use existing UI components and patterns from the codebase.

## 3. Non-Goals

- No editing or creating assignments.
- No advanced filtering, sorting, or search.
- No data export functionality.
- No real-time updates or websockets.
- No new backend service, database schema changes, or API endpoint creation.
- No new architecture, shared layers, or subsystems.
- No production deployment.
- No modifications to `packages/algorithms/`, `modules/`, or `apps/api/src/`.

## 4. Program

- Program file: `Docs/M27_PROGRAM_2026-07-01.md`
- Dispatch file: `Docs/DISPATCH_M27_PROGRAM_TO_DEVELOPER.md`

## 5. Work Orders

| Order | ID | Task | Complexity |
|---|---|---|---|
| 1 | P27-01 | Verify existing teacher page infrastructure and API readiness | Lite |
| 2 | P27-02 | Create teacher assignment data fetcher and store | Standard |
| 3 | P27-03 | Create Teacher Assignment Overview page component | Standard |
| 4 | P27-04 | Register route, integrate page, and produce consolidated handoff | Lite |

## 6. Dependencies

- P27-01 must complete before P27-02 (verify API before building fetcher).
- P27-02 must complete before P27-03 (need fetcher before building page).
- P27-03 must complete before P27-04 (need page before registering route).

## 7. Acceptance Criteria

- [ ] All four Work Orders have Developer handoff with evidence.
- [ ] Teacher Assignment Overview page renders without errors.
- [ ] Page displays assignment data from the existing API/model.
- [ ] Page uses existing UI patterns from the codebase.
- [ ] No new architecture, backend changes, or schema modifications.
- [ ] `Docs/HANDOFF_M27_PROGRAM_DEVELOPER.md` exists.
- [ ] No STOP_RULES triggered during execution.

## 8. Stop Conditions

- If existing teacher pages or API endpoints are non-functional and cannot be fixed within scope, mark `Blocked`.
- If `Docs/STOP_RULES.md` is triggered at any point, stop immediately.
- If verification commands fail three consecutive times, mark `Blocked`.

## 9. Expected Outcome

A functional, read-only Teacher Assignment Overview Dashboard page accessible via the existing app routing, demonstrating the project's ability to deliver bounded product increments.
