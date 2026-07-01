# Work Order P29-02

## Work Order ID

P29-02

## Complexity

Standard

## Task

Enhance `apps/web/e2e/e2e-mocks.ts` so `/api/v1/teacher/class/overview` returns a realistic non-null `ClassOverview` payload suitable for Assignment Overview page smoke assertions.

## Scope

- Update the existing teacher class overview mock handler.
- Return payload matching frontend expectation: `{ overview: ClassOverview }` inside success envelope.
- Include at least: `teacherId`, `studentCount`, `averageScore`, `gradeGroups`, `topWeakAreas` with one weak area item using valid `MasteryLevel`.
- Keep changes minimal and localized to the mock handler.

## Allowed Files

- `apps/web/e2e/e2e-mocks.ts`
- `Docs/LOOP_RUNS.jsonl` (append only)

## Not Allowed Files

- `apps/api/src/`, `packages/`, `modules/`
- `apps/web/src/` product files
- Playwright spec files (P29-03)
- `Docs/TARGET.md`, `Docs/STOP_RULES.md`, `Docs/ACCEPTANCE.md`

## Acceptance Criteria

- [ ] Mock handler for `/api/v1/teacher/class/overview` returns non-null overview.
- [ ] Payload includes `studentCount`, `averageScore`, `gradeGroups`, and `topWeakAreas`.
- [ ] Weak area item includes `skillId`, `skillName`, `averageScore`, and valid `level` (e.g. `developing`).
- [ ] Mock shape aligns with `ClassOverview` in `apps/web/src/api/teacher.ts`.
- [ ] No backend files modified.

## Design Notes

- Current mock: `return okEnvelope({ overview: null })` — replace with realistic fixture.
- Use static test IDs/strings; no live data.
- Example weak area: `{ skillId: 'skill-1', skillName: 'Fractions', averageScore: 42, level: 'developing' }`.
- Example gradeGroups: `{ '3': 5, '4': 3 }`.
- Do not break other teacher mocks (`weak-areas`, `students/*/summary`).

## Boundaries

- Mock file only; no product changes.
- Do not add new mock infrastructure or shared test utilities file.
- Do not modify Playwright specs in this Work Order.

## Verification Commands

```powershell
Select-String -LiteralPath .\apps\web\e2e\e2e-mocks.ts -Pattern "teacher/class/overview","studentCount","topWeakAreas","gradeGroups"
git -C . diff --name-only -- apps/api/src/ packages/ modules/ apps/web/src/
```

## Expected Developer Handoff

- Mock payload summary and diff description.
- Confirmation shape matches `ClassOverview`.
- Status: `Developer Complete` before P29-03.
