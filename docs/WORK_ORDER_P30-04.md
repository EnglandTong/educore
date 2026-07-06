# Work Order P30-04

## Work Order ID

P30-04

## Complexity

Lite

## Task

Update e2e mock for `/teacher/assignments`, run typecheck/build and e2e verification, create consolidated M30 handoff, and sync governance state.

## Scope

- Add mock handler for `/api/v1/teacher/assignments` in `e2e-mocks.ts` with sample assignments array.
- Optionally extend assignments smoke test to assert assigned student name from mock.
- Run `typecheck`, `build` (web), and `test:e2e`.
- Create `Docs/HANDOFF_M30_PROGRAM_DEVELOPER.md` and update governance files.

## Allowed Files

- `apps/web/e2e/e2e-mocks.ts`
- `apps/web/e2e/teacher-journey.spec.ts`
- `Docs/HANDOFF_M30_PROGRAM_DEVELOPER.md` (create)
- `Docs/LOOP_RUNS.jsonl`, `Docs/LOOP_LOG_Workbuddy.jsonl` (append)
- `Docs/STATUS.md`, `Docs/NEXT_ACTIONS.md`, `Docs/PENDING.md`, `Docs/CURRENT_ROLE_INSTRUCTIONS.md`, `Docs/Work_Order_Active.md`

## Not Allowed Files

- Backend or product source changes (must be complete before P30-04)
- Protected docs

## Acceptance Criteria

- [ ] E2e mock returns assignments array for new endpoint.
- [ ] Typecheck and build pass.
- [ ] E2e suite passes including assignments smoke test.
- [ ] Handoff references P30-01 through P30-04.
- [ ] Final status `Ready for Controller/QA Review` only.

## Design Notes

- Mock example: `{ assignments: [{ studentId: 'student-1', studentName: 'Emily Chen', gradeLevel: '4', assignedAt: '2026-01-01T00:00:00.000Z' }] }`.
- Extend existing M29 test to assert student name if mock aligned.

## Boundaries

- No backend changes in this Work Order.
- Do not self-accept.

## Verification Commands

```powershell
Select-String -LiteralPath .\apps\web\e2e\e2e-mocks.ts -Pattern "teacher/assignments"
corepack pnpm --filter @educore/web run typecheck
corepack pnpm --filter @educore/web run build
corepack pnpm --filter @educore/web run test:e2e --reporter=list
Test-Path -LiteralPath .\Docs\HANDOFF_M30_PROGRAM_DEVELOPER.md
```

## Expected Developer Handoff

- Verification outputs and consolidated Program summary.
- Final status: `Ready for Controller/QA Review`.
