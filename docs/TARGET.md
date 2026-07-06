# TARGET - EduCore

Status: M30 Active Developer Assignment
Owner: MRT-Controller-QA
Last updated: 2026-07-01T19:00:00+08:00

## Current Milestone

`M30 - Teacher Assignments List API and UI Integration`

## Current Boundary

Read-only teacher assignments list API and UI integration:

- Add `GET /api/v1/teacher/assignments` in existing teacher module.
- Display assigned students on Assignment Overview page.
- Update e2e mock and verify build/e2e.

## In Scope

- `apps/api/src/services/teacher.service.ts`
- `apps/api/src/modules/teacher/teacher.routes.ts`
- `apps/web/src/api/teacher.ts`, hooks, AssignmentOverviewPage
- `apps/web/e2e/` in P30-04 only

## Out of Scope

- Schema/migration changes.
- Assignment create/edit/delete.
- New architecture or subsystems.
- Production deployment.

## Dispatch References

- `Docs/MILESTONE_M30_TEACHER_ASSIGNMENTS_LIST_API_AND_UI_INTEGRATION_2026-07-01.md`
- `Docs/M30_PROGRAM_2026-07-01.md`
- `Docs/DISPATCH_M30_PROGRAM_TO_DEVELOPER.md`
