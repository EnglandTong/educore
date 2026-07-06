# Work Order P30-03

## Work Order ID

P30-03

## Complexity

Standard

## Task

Add frontend API fetcher and React Query hook for teacher assignments, and render an Assigned Students list section on `AssignmentOverviewPage` using the new endpoint.

## Scope

- Add `TeacherAssignmentItem` type and `fetchTeacherAssignments()` to `apps/web/src/api/teacher.ts`.
- Create `apps/web/src/hooks/useTeacherAssignments.ts` using React Query.
- Add Assigned Students table or card list to `AssignmentOverviewPage.tsx` showing student name, grade level, and assigned date.
- Handle loading, error, and empty states using existing UI components.
- Keep existing class overview stats and weak areas sections unchanged.

## Allowed Files

- `apps/web/src/api/teacher.ts`
- `apps/web/src/hooks/useTeacherAssignments.ts` (create)
- `apps/web/src/pages/teacher/AssignmentOverviewPage.tsx`
- `Docs/LOOP_RUNS.jsonl` (append only)

## Not Allowed Files

- `apps/api/src/` (backend complete in P30-02)
- `apps/web/e2e/` (P30-04)
- `packages/`, `modules/`
- Router files unless compile error requires none expected

## Acceptance Criteria

- [ ] `fetchTeacherAssignments` calls `GET /teacher/assignments`.
- [ ] `useTeacherAssignments` hook exists with appropriate queryKey.
- [ ] AssignmentOverviewPage renders assigned students from hook when data exists.
- [ ] Loading and empty states handled.
- [ ] Typecheck passes for changed files.
- [ ] Existing overview sections still render.

## Design Notes

- API call: `api.get<ApiSuccess<{ assignments: TeacherAssignmentItem[] }>>('/teacher/assignments')`.
- Place Assigned Students section after stat cards, before Grade Distribution.
- Use existing `Card` and table patterns from weak areas table.
- Link to student detail optional; use plain text if no existing route pattern in scope.
- Follow `useTeacherClassOverview` hook pattern.

## Boundaries

- Read-only list display only.
- No create/edit/delete UI.
- No new shared components file.

## Verification Commands

```powershell
Test-Path -LiteralPath .\apps\web\src\hooks\useTeacherAssignments.ts
Select-String -LiteralPath .\apps\web\src\api\teacher.ts -Pattern "fetchTeacherAssignments","TeacherAssignmentItem"
Select-String -LiteralPath .\apps\web\src\pages\teacher\AssignmentOverviewPage.tsx -Pattern "useTeacherAssignments"
corepack pnpm --filter @educore/web run typecheck
```

## Expected Developer Handoff

- Types, hook, and UI section summary.
- Typecheck result.
- Status: `Developer Complete` before P30-04.
