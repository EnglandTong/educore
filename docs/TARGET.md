# TARGET - EduCore

Status: M81 Architecture Debt Repayment Active
Owner: MRT-Controller-QA
Last updated: 2026-07-21T00:15:00+08:00
Latest accepted baseline: M80 National Talent Development Evidence Pack (types/docs program)
Code baseline: M49 teacher arc — typecheck PASS, build PASS, e2e 17/17 PASS

## User Goal

After M50–M80 ecosystem/governance type definitions, EduCore enters an **Architecture Debt Repayment** phase: reduce code smells, unify shared logic, document unfinished endpoints, and improve maintainability without expanding product scope.

## Current Milestone Boundary (M81–M85 Short-term)

Authorized short-term refactor slices only:

1. Dead code cleanup + placeholder documentation
2. Unify mastery thresholds via existing `@educore/constants`
3. Extract shared `weakAreaLabel`
4. Converge TeacherClass roster to `overview.students`
5. Split e2e-mocks by domain; reduce silent-success for unmocked GET

## In Scope

- `apps/api`, `apps/web`, `packages/constants` (additive helpers only)
- `Docs/` governance, acceptance, handoffs, loop logs

## Out of Scope / Non-Goals

- No production deployment, secrets, or production data
- No schema migration
- No assignment CRUD (product decision deferred; document in TARGET Non-Goals remains)
- No new architecture subsystem; reuse existing `@educore/constants` only
- No volunteer/student contact features
- No work outside `D:\Development\EduCore`
- Developer must not self-accept

## Success Criteria

- [ ] Short-term audit items M81–M85 Accepted with command evidence
- [ ] M49 verification baseline preserved or improved (typecheck, build, e2e)
- [ ] Placeholder endpoints explicitly listed as incomplete
- [ ] Mastery scoring uses one source of thresholds
- [ ] Teacher weak-area labeling and class roster paths are de-duplicated / converged

## Failure Examples

- Marking placeholder endpoints as delivered
- Lowering e2e/typecheck/build baseline without recorded waiver
- Expanding into learning.service split or CRUD without a dedicated later milestone
- Self-acceptance by Developer
