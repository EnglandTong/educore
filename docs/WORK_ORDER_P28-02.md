# Work Order P28-02

## Work Order ID

P28-02

## Complexity

Lite

## Task

Replace the inline mastery-level `<span>` styling in `AssignmentOverviewPage` with the existing shared `Badge` component so all six `MasteryLevel` values render using established CSS variable mappings.

## Scope

- Import and use `Badge` from `@/components/ui/Badge`.
- Remove inline `style={{ backgroundColor: hsl(var(--color-${area.level})) }}` badge rendering in the weak areas table.
- Preserve table structure and data display.
- Do not modify the `Badge` component itself.

## Allowed Files

- `apps/web/src/pages/teacher/AssignmentOverviewPage.tsx`
- `Docs/LOOP_RUNS.jsonl` (append only)

## Not Allowed Files

- `apps/web/src/components/ui/Badge.tsx` (reuse only; do not modify)
- `apps/api/src/`, `packages/algorithms/`, `modules/`
- `apps/web/src/components/layout/Sidebar.tsx` (P28-03)
- `Docs/TARGET.md`, `Docs/STOP_RULES.md`, `Docs/ACCEPTANCE.md`

## Acceptance Criteria

- [ ] `AssignmentOverviewPage.tsx` imports `Badge` from `@/components/ui/Badge`.
- [ ] Weak-area mastery levels render via `<Badge level={area.level} />` or equivalent typed usage.
- [ ] Inline CSS-variable span styling for mastery levels is removed.
- [ ] No backend files were modified.
- [ ] Page still compiles (re-run typecheck if file changed).

## Design Notes

- M27 used inline styling: `backgroundColor: hsl(var(--color-${area.level}))`, which assumes CSS variables named after raw level strings.
- Existing pattern: `StudentProgressPage`, `StudentDashboardPage`, and `ParentChildProgressPage` use `Badge` with `parseMasteryLevel()` when input may be untyped.
- `WeakAreaItem.level` is already typed as `MasteryLevel` in `apps/web/src/api/teacher.ts`, so direct `Badge level={area.level}` is preferred.
- Follow import style used elsewhere: `import { Badge } from '@/components/ui/Badge'`.

## Boundaries

- Do not create a new badge component or shared helper.
- Do not modify `Badge.tsx`.
- Do not add filtering, sorting, or new page sections.
- Do not touch sidebar navigation (P28-03).

## Verification Commands

```powershell
# Verify Badge import and usage
Select-String -LiteralPath .\apps\web\src\pages\teacher\AssignmentOverviewPage.tsx -Pattern "Badge","area.level"

# Verify inline style badge removed
Select-String -LiteralPath .\apps\web\src\pages\teacher\AssignmentOverviewPage.tsx -Pattern "backgroundColor.*color-\$\{"

# Optional compile check after change
corepack pnpm --filter @educore/web run typecheck
```

## Expected Developer Handoff

- Summary of rendering change.
- Before/after description of weak-area level cell.
- Typecheck result after change.
- Status: `Developer Complete` before advancing to P28-03.
