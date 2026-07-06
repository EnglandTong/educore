# Work Order P30-01

## Work Order ID

P30-01

## Complexity

Lite

## Task

Audit the `TeacherAssignment` model, existing teacher API routes/services, and frontend teacher API patterns to plan the read-only assignments list endpoint and UI integration.

## Scope

- Read `TeacherAssignment` model schema and usage in `teacher.service.ts`.
- Read `teacher.routes.ts` for route registration patterns.
- Read `apps/web/src/api/teacher.ts` and `AssignmentOverviewPage.tsx`.
- Document recommended API response shape and UI placement for P30-02/P30-03.

## Allowed Files

- Read-only: `apps/api/src/models/TeacherAssignment.ts`, `apps/api/src/services/teacher.service.ts`, `apps/api/src/modules/teacher/teacher.routes.ts`, `apps/web/src/api/teacher.ts`, `apps/web/src/pages/teacher/AssignmentOverviewPage.tsx`
- `Docs/LOOP_RUNS.jsonl` (append only)

## Not Allowed Files

- Any implementation file modifications (P30-02 onward)
- `packages/`, `modules/`
- Protected docs

## Acceptance Criteria

- [ ] Model fields documented (`teacherId`, `studentId`, timestamps).
- [ ] Existing routes documented (`/class/overview`, `/class/weak-areas`, `/students/:id/summary`).
- [ ] Recommended `GET /assignments` response shape documented.
- [ ] UI integration point on AssignmentOverviewPage identified.
- [ ] No unauthorized file modifications.

## Design Notes

- `TeacherAssignment` is teacher-student pairing only; no subject field on model.
- List item shape: `{ studentId, studentName, gradeLevel?, assignedAt }` joined from `User`.
- UI: add "Assigned Students" table/card section below stats cards, above grade distribution.
- Follow existing `sendSuccess` + `requireAuth` + `assertRole` patterns.

## Boundaries

- Read-only audit.
- Do not implement endpoint or UI yet.

## Verification Commands

```powershell
Get-Content -LiteralPath .\apps\api\src\models\TeacherAssignment.ts
Select-String -LiteralPath .\apps\api\src\modules\teacher\teacher.routes.ts -Pattern "class/overview","students"
Get-Content -LiteralPath .\apps\web\src\api\teacher.ts
```

## Expected Developer Handoff

- Audit summary and recommended API/UI plan.
- Status: `Developer Complete` before P30-02.
