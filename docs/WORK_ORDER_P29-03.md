# Work Order P29-03

## Work Order ID

P29-03

## Complexity

Standard

## Task

Add a Playwright smoke test covering teacher navigation to `/teacher/assignments` and visible Assignment Overview content using mocked API data from P29-02.

## Scope

- Extend `apps/web/e2e/teacher-journey.spec.ts` OR create `apps/web/e2e/teacher-assignments.spec.ts` if separation is cleaner.
- Reuse `installE2eApiMocks(page)` pattern from existing teacher e2e.
- Test flow: authenticate as teacher (register or login pattern from existing spec) → navigate to assignments (sidebar link or direct goto) → assert page heading and at least one stat card or table section from mocked overview data.
- Keep test minimal and deterministic.

## Allowed Files

- `apps/web/e2e/teacher-journey.spec.ts`
- `apps/web/e2e/teacher-assignments.spec.ts` (create only if preferred over extending journey spec)
- `Docs/LOOP_RUNS.jsonl` (append only)

## Not Allowed Files

- `apps/web/e2e/e2e-mocks.ts` (already handled in P29-02 unless critical one-line fix required — if so, document and stay minimal)
- `apps/web/src/` product files
- `apps/api/src/`, `packages/`, `modules/`
- `Docs/TARGET.md`, `Docs/STOP_RULES.md`, `Docs/ACCEPTANCE.md`

## Acceptance Criteria

- [ ] Playwright spec includes test for `/teacher/assignments`.
- [ ] Test uses `installE2eApiMocks`.
- [ ] Test asserts visible `Assignment Overview` heading (or equivalent h1).
- [ ] Test asserts content derived from mocked overview (e.g. stat label `Assigned Students` or weak area skill name from mock).
- [ ] Spec file path documented in handoff.
- [ ] No backend or product source files modified.

## Design Notes

- Prefer extending `teacher-journey.spec.ts` to keep teacher coverage consolidated unless file becomes unwieldy.
- Sidebar nav: click link with text `Assignments` after teacher login.
- Alternative: `page.goto('/teacher/assignments')` after auth if sidebar click is flaky on mobile layout — document choice.
- Use Playwright `getByRole('heading', { name: /assignment overview/i })` and `getByText(/assigned students/i)` patterns.
- If mock includes skill name `Fractions`, assert `Fractions` appears in weak areas table.

## Boundaries

- Smoke test only; no exhaustive UI coverage.
- Do not add data-testid to product pages — use roles and text.
- Do not rewrite unrelated e2e tests.

## Verification Commands

```powershell
Select-String -LiteralPath .\apps\web\e2e\ -Pattern "/teacher/assignments","Assignment Overview","installE2eApiMocks"
git -C . diff --name-only -- apps/api/src/ packages/ modules/ apps/web/src/
```

## Expected Developer Handoff

- Spec file path and test step summary.
- Assertions list.
- Status: `Developer Complete` before P29-04 (full e2e run in P29-04).
