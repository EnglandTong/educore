# Work Order P30-02

## Work Order ID

P30-02

## Complexity

Standard

## Task

Add read-only `getTeacherAssignments(teacherId)` service function and `GET /assignments` route returning the teacher's assigned students with basic student profile fields.

## Scope

- Add `getTeacherAssignments` to `apps/api/src/services/teacher.service.ts`.
- Query `TeacherAssignment.find({ teacherId })`, join student `User` records.
- Return `{ assignments: Array<{ studentId, studentName, gradeLevel?, assignedAt }> }`.
- Register `app.get("/assignments", ...)` in `teacher.routes.ts` with `requireAuth` and teacher role assertion.
- Use existing `sendSuccess` response envelope.

## Allowed Files

- `apps/api/src/services/teacher.service.ts`
- `apps/api/src/modules/teacher/teacher.routes.ts`
- `Docs/LOOP_RUNS.jsonl` (append only)

## Not Allowed Files

- `apps/api/src/models/TeacherAssignment.ts` (no schema changes)
- `apps/web/` (P30-03)
- `packages/`, `modules/`

## Acceptance Criteria

- [ ] `getTeacherAssignments` exported from teacher.service.ts.
- [ ] Route `GET /assignments` registered under teacher prefix (`/api/v1/teacher/assignments`).
- [ ] Response uses success envelope with `{ assignments: [...] }`.
- [ ] Each item includes `studentId`, `studentName`, and `assignedAt` (ISO string from `createdAt`).
- [ ] Optional `gradeLevel` included when available on User.
- [ ] No schema or model file changes.

## Design Notes

- Mirror patterns from `getClassOverview` for TeacherAssignment + User lookup.
- Sort assignments by `studentName` ascending for stable UI.
- Empty list returns `{ assignments: [] }`, not error.
- Do not add POST/PUT/DELETE routes.

## Boundaries

- Read-only list only.
- No new middleware or shared layers.
- No database migration.

## Verification Commands

```powershell
Select-String -LiteralPath .\apps\api\src\services\teacher.service.ts -Pattern "getTeacherAssignments"
Select-String -LiteralPath .\apps\api\src\modules\teacher\teacher.routes.ts -Pattern '"/assignments"'
git diff --name-only -- apps/api/src/models/
```

## Expected Developer Handoff

- Service function summary and route path.
- Sample response shape.
- Status: `Developer Complete` before P30-03.
