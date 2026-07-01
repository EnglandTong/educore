# M29 - Teacher Assignment Overview E2E Smoke Coverage

Milestone ID: M29  
Name: Teacher Assignment Overview E2E Smoke Coverage  
Date: 2026-07-01  
Owner: MRT-Controller-QA  
Status: Staged / Ready for Dispatch

---

## 1. Milestone Objective

Add bounded Playwright smoke coverage for the accepted M27/M28 Teacher Assignment Overview path: sidebar navigation to `/teacher/assignments`, API mock support for class overview data, and page content assertions.

This closes the M28 QA follow-up recommendation for teacher assignment overview navigation E2E verification without backend or product feature expansion.

## 2. Milestone Scope

- Audit existing teacher Playwright infrastructure and e2e API mocks.
- Enhance `e2e-mocks.ts` with a realistic `ClassOverview` payload for `/teacher/class/overview`.
- Add or extend a Playwright spec covering assignment overview navigation and page render.
- Run `test:e2e` for the new/extended test and produce consolidated Program handoff.

## 3. Non-Goals

- No backend changes, new API endpoints, or database schema modifications.
- No changes to `apps/api/src/`, `packages/algorithms/`, or `modules/`.
- No dedicated assignment-management API.
- No assignment create/edit/delete functionality.
- No new architecture, shared layers, or subsystems.
- No production deployment.
- No dependency installation beyond what is already available locally.
- No full teacher journey rewrite; extend existing patterns only.

## 4. Program

- Program file: `Docs/M29_PROGRAM_2026-07-01.md`
- Dispatch file: `Docs/DISPATCH_M29_PROGRAM_TO_DEVELOPER.md`

## 5. Work Orders

| Order | ID | Task | Complexity |
|---|---|---|---|
| 1 | P29-01 | Audit teacher e2e mocks and Assignment Overview page selectors | Lite |
| 2 | P29-02 | Add realistic ClassOverview mock payload in e2e-mocks.ts | Standard |
| 3 | P29-03 | Add Playwright smoke test for assignments navigation and page content | Standard |
| 4 | P29-04 | Run e2e, consolidated handoff, and governance sync | Lite |

## 6. Dependencies

- P29-01 has no predecessor.
- P29-02 depends on P29-01 audit findings.
- P29-03 depends on P29-02 mock payload.
- P29-04 depends on P29-01 through P29-03 completion.

## 7. Acceptance Criteria

- [ ] Teacher e2e infrastructure and mock gaps documented in P29-01 evidence.
- [ ] `e2e-mocks.ts` returns realistic overview data for `/api/v1/teacher/class/overview`.
- [ ] Playwright test navigates to `/teacher/assignments` and asserts page content.
- [ ] `corepack pnpm --filter @educore/web run test:e2e` passes including new test.
- [ ] No backend files modified.
- [ ] `Docs/HANDOFF_M29_PROGRAM_DEVELOPER.md` exists and references all Work Orders.
- [ ] No STOP_RULES triggered during Program execution.

## 8. Risks

- E2E may fail due to pre-existing flaky tests unrelated to M29 scope. Developer must stop if fixes require changes outside Allowed Files.
- Playwright/browser dependencies must already be available locally per STOP_RULES.

## 9. QA Review Entry Point

After Developer marks `Ready for Controller/QA Review`, Controller/QA will verify e2e test evidence, mock payload shape, scope compliance, and handoff completeness.
