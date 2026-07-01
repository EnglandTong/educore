# Work Order P28-03

## Work Order ID

P28-03

## Complexity

Lite

## Task

Add a teacher sidebar navigation link to the Assignment Overview page at `/teacher/assignments`, following the existing `teacherLinks` pattern in `Sidebar.tsx`.

## Scope

- Add one entry to `teacherLinks` in `apps/web/src/components/layout/Sidebar.tsx`.
- Use route path `/teacher/assignments` (already registered in M27).
- Choose an existing lucide-react icon consistent with nearby teacher links.
- Use a clear label such as `Assignments` or `Assignment overview`.

## Allowed Files

- `apps/web/src/components/layout/Sidebar.tsx`
- `Docs/LOOP_RUNS.jsonl` (append only)

## Not Allowed Files

- `apps/web/src/router/` (route already exists from M27)
- `apps/web/src/pages/teacher/AssignmentOverviewPage.tsx` (already handled in P28-02 unless a compile fix is required)
- `apps/api/src/`, `packages/algorithms/`, `modules/`
- `Docs/TARGET.md`, `Docs/STOP_RULES.md`, `Docs/ACCEPTANCE.md`

## Acceptance Criteria

- [ ] `teacherLinks` includes an entry with `to: '/teacher/assignments'`.
- [ ] Label and icon are consistent with existing teacher navigation style.
- [ ] No duplicate or conflicting route entries are introduced.
- [ ] No backend files were modified.

## Design Notes

- M27 registered the route but did not add sidebar discoverability.
- Existing teacher links: Home, Class insights, Bulletin, Conversations, Learning paths.
- Suggested placement: after `Class insights` or before `Learning paths`.
- Suggested icon: `BookMarked` or `LineChart` if not already used in teacher links; `BookMarked` is used in student nav but may still fit assignment overview context. Prefer an unused icon from existing imports or add one import from `lucide-react` if needed.

## Boundaries

- Do not modify router files.
- Do not add mobile-only or feature-flagged navigation.
- Do not change other role link arrays.

## Verification Commands

```powershell
# Verify sidebar link exists
Select-String -LiteralPath .\apps\web\src\components\layout\Sidebar.tsx -Pattern "/teacher/assignments"

# Verify route still registered
Select-String -LiteralPath .\apps\web\src\router\index.tsx -Pattern "/teacher/assignments"

# Confirm no backend changes
git -C . diff --name-only -- apps/api/src/ packages/ modules/
```

## Expected Developer Handoff

- Sidebar link label, icon, and placement rationale.
- Verification command outputs.
- Status: `Developer Complete` before advancing to P28-04.
