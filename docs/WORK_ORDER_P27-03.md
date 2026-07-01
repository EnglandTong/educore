# Work Order P27-03

## Work Order ID

P27-03

## Complexity

Standard

## Task

Create the Teacher Assignment Overview page component. Build a read-only page that displays teacher assignments in a table or card layout, consuming data from the store created in P27-02.

## Scope

- Create the overview page component in `apps/web/src/pages/teacher/`.
- Display teacher assignments with columns/cards for: student name, subject, teacher name, status/progress.
- Use existing UI components and patterns from the codebase.
- Handle loading and empty states.
- Keep the component minimal and read-only.

## Allowed Files

- `apps/web/src/pages/teacher/` (add overview page component)
- `apps/web/src/components/` (reuse existing components only, do not modify)

## Not Allowed Files

- `apps/api/src/` (no backend modifications)
- `packages/algorithms/`, `modules/`
- `apps/web/src/router/` (route registration is P27-04)
- `Docs/TARGET.md`, `Docs/STOP_RULES.md`, `Docs/ACCEPTANCE.md`

## Acceptance Criteria

- [ ] Overview page component file exists in `apps/web/src/pages/teacher/`.
- [ ] Component imports and uses the store from P27-02.
- [ ] Component displays assignment data in a structured layout.
- [ ] Component handles loading and empty states.
- [ ] Component uses existing UI patterns from the codebase.
- [ ] No backend files were modified.

## Design Notes

- Follow the exact component patterns used by existing pages in the codebase.
- If existing pages use Vue SFC (.vue), use Vue SFC. If React (.tsx), use React.
- Use existing table/card components if available. Do not create new shared components.
- Keep the template simple: header, table/cards, loading spinner, empty state message.
- The page should call `fetchAssignments()` on mount (onMounted/useEffect).

## Boundaries

- Do not modify existing components.
- Do not create new shared/reusable components.
- Do not add editing, filtering, or search functionality.
- Do not modify the router (P27-04 handles routing).

## Verification Commands

```powershell
# Verify page file exists
Get-ChildItem -LiteralPath .\apps\web\src\pages\teacher -File | Select-Object Name

# Verify page imports store
Select-String -LiteralPath .\apps\web\src\pages\teacher\* -Pattern "teacherAssignment" -ErrorAction SilentlyContinue

# Verify no backend files were modified
git -C . diff --name-only -- apps/api/src/
# Expected: empty output

# Verify no router files were modified (P27-04 handles routing)
git -C . diff --name-only -- apps/web/src/router/
# Expected: empty output
```

## Expected Developer Handoff

- Summary: Overview page component created.
- Files created with paths.
- Component structure description.
- Build result (pass/fail/skipped).
- Risks: Component rendering depends on API data format.
- Status: `Developer Complete`.
