# M28 - Teacher Assignment Build Verification and UX Hardening

Milestone ID: M28  
Name: Teacher Assignment Build Verification and UX Hardening  
Date: 2026-07-01  
Owner: MRT-Controller-QA  
Status: Staged / Ready for Dispatch

---

## 1. Milestone Objective

Close the documented M27 acceptance risks by verifying the `apps/web` build compiles, aligning mastery-level display with the existing `Badge` component, and exposing the Assignment Overview page through the teacher sidebar navigation.

This is a bounded hardening milestone on top of the accepted M27 product deliverable. It does not introduce new backend endpoints or new product features.

## 2. Milestone Scope

- Run `typecheck` and `build` for `@educore/web` and record evidence.
- Fix only blocking TypeScript errors in M27-created or M28-touched frontend files if build fails.
- Replace inline mastery-level styling in `AssignmentOverviewPage` with the existing `Badge` component.
- Add a teacher sidebar navigation link to `/teacher/assignments`.
- Produce a consolidated Program handoff and update governance state files.

## 3. Non-Goals

- No new backend service, API endpoint, database schema changes, or `apps/api/src/` modifications.
- No dedicated `/teacher/assignments` API endpoint (deferred until a future milestone explicitly scopes assignment management).
- No editing or creating assignments.
- No new architecture, shared layers, or subsystems.
- No modifications to `packages/algorithms/` or `modules/`.
- No production deployment.
- No dependency installation beyond what is already available locally.

## 4. Program

- Program file: `Docs/M28_PROGRAM_2026-07-01.md`
- Dispatch file: `Docs/DISPATCH_M28_PROGRAM_TO_DEVELOPER.md`

## 5. Work Orders

| Order | ID | Task | Complexity |
|---|---|---|---|
| 1 | P28-01 | Verify `apps/web` typecheck and build; fix blocking M27-scope TS errors only | Standard |
| 2 | P28-02 | Replace inline mastery badges with existing `Badge` component | Lite |
| 3 | P28-03 | Add teacher sidebar navigation link to Assignment Overview | Lite |
| 4 | P28-04 | Consolidated handoff and governance state sync | Lite |

## 6. Dependencies

- P28-01 has no predecessor.
- P28-02 depends on P28-01 passing or documenting build baseline.
- P28-03 depends on P28-02 completion.
- P28-04 depends on P28-01 through P28-03 completion.

## 7. Acceptance Criteria

- [ ] `corepack pnpm --filter @educore/web run typecheck` passes, or blocking errors in M27 scope are fixed with evidence.
- [ ] `corepack pnpm --filter @educore/web run build` passes, or blocking errors in M27 scope are fixed with evidence.
- [ ] `AssignmentOverviewPage` uses the existing `Badge` component for mastery levels.
- [ ] Teacher sidebar includes a link to `/teacher/assignments`.
- [ ] No backend files modified.
- [ ] `Docs/HANDOFF_M28_PROGRAM_DEVELOPER.md` exists and references all Work Orders.
- [ ] No STOP_RULES triggered during Program execution.

## 8. Risks

- Build may fail due to pre-existing repo issues outside M27/M28 scope. Developer must stop if fixes require changes outside Allowed Files.
- Local `node_modules` may be missing. Developer must stop per STOP_RULES if dependency installation is required.

## 9. QA Review Entry Point

After Developer marks `Ready for Controller/QA Review`, Controller/QA will verify build evidence, Badge usage, sidebar link, scope compliance, and handoff completeness.
