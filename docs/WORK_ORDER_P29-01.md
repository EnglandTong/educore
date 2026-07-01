# Work Order P29-01

## Work Order ID

P29-01

## Complexity

Lite

## Task

Audit existing teacher Playwright infrastructure, e2e API mock handlers for `/teacher/class/overview`, and Assignment Overview page UI selectors/text suitable for smoke test assertions.

## Scope

- Read `apps/web/e2e/teacher-journey.spec.ts` and `apps/web/e2e/e2e-mocks.ts`.
- Read `apps/web/src/pages/teacher/AssignmentOverviewPage.tsx` and `apps/web/src/components/layout/Sidebar.tsx`.
- Document current mock behavior, navigation paths, and recommended selectors for P29-03.
- Do not modify any files except appending loop evidence.

## Allowed Files

- `apps/web/e2e/` (read-only)
- `apps/web/src/pages/teacher/AssignmentOverviewPage.tsx` (read-only)
- `apps/web/src/components/layout/Sidebar.tsx` (read-only)
- `apps/web/src/api/teacher.ts` (read-only, for ClassOverview shape)
- `Docs/LOOP_RUNS.jsonl` (append only)

## Not Allowed Files

- `apps/api/src/`, `packages/`, `modules/`
- Any product or e2e file modifications (P29-02/P29-03)
- `Docs/TARGET.md`, `Docs/STOP_RULES.md`, `Docs/ACCEPTANCE.md`

## Acceptance Criteria

- [ ] Existing teacher e2e spec and mock files are documented.
- [ ] Current `/teacher/class/overview` mock behavior is documented (currently returns `overview: null`).
- [ ] Assignment Overview page headings, empty state text, and stat card labels are documented for test assertions.
- [ ] Sidebar `Assignments` link label and path documented.
- [ ] Recommended mock payload fields for P29-02 are listed.
- [ ] No files modified except LOOP_RUNS append.

## Design Notes

- M28 added sidebar link: `{ to: '/teacher/assignments', label: 'Assignments' }`.
- AssignmentOverviewPage h1: `Assignment Overview`.
- Stat cards: Assigned Students, Average Score, Grade Levels, Weak Areas.
- Empty state title: `No assignments found`.
- `ClassOverview` shape in `teacher.ts`: `{ teacherId, studentCount, averageScore, gradeGroups, topWeakAreas }`.
- Existing teacher journey test does not cover `/teacher/assignments`.

## Boundaries

- Read-only audit only.
- Do not run e2e yet (P29-04 runs full suite).
- Do not change mocks or specs.

## Verification Commands

```powershell
Test-Path -LiteralPath .\apps\web\e2e\teacher-journey.spec.ts, .\apps\web\e2e\e2e-mocks.ts
Select-String -LiteralPath .\apps\web\e2e\e2e-mocks.ts -Pattern "teacher/class/overview"
Select-String -LiteralPath .\apps\web\src\pages\teacher\AssignmentOverviewPage.tsx -Pattern "Assignment Overview","No assignments found","Assigned Students"
Select-String -LiteralPath .\apps\web\src\components\layout\Sidebar.tsx -Pattern "Assignments","/teacher/assignments"
Get-Content -LiteralPath .\apps\web\src\api\teacher.ts | Select-String -Pattern "ClassOverview","WeakAreaItem"
```

## Expected Developer Handoff

- Audit summary with mock gap and selector recommendations.
- Proposed mock payload outline for P29-02.
- Status: `Developer Complete` before P29-02.
