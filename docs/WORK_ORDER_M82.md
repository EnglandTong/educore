# WORK_ORDER_M82 - Trusted Baseline & Full System Audit

Status: Dispatched (awaiting loop start)
Milestone: M82
Type: Deep (audit-only; no product code changes)
Created: 2026-08-16 by Controller
Dependency: None (this work order IS the prerequisite for M83 Owner decisions)
Program: `Docs/TARGET.md` (M82-M86 program)

## Objective

Produce verifiable current facts about the entire system without adding business features.
Output feeds M83 Owner rebaseline. Every claim must be backed by fresh run evidence or an
explicit citation, never by historical PASS results.

## Non-Goals

- No feature work, no refactoring, no dependency upgrades (record findings only)
- No modification of `apps/`, `packages/`, `modules/` source (build/test artifacts excluded)
- No M84+ architecture decisions (that is M83)

## Reasoning levels

R=recording facts (low risk) | V=running verification commands | A=analysis/judgment (needs Controller review)

## Tasks

- [ ] M82-R1 (V): Independent M81A re-verification. Fresh runs of:
  1. `pnpm -w run typecheck` (root, all workspaces)
  2. `pnpm -w run test` (root unit/API suites)
  3. `pnpm -w run lint`
  4. `pnpm --filter @educore/api test`
  5. `pnpm --filter @educore/web run build`
  6. `pnpm --filter @educore/web run test:e2e` (Playwright key journeys; note flakiness)
  7. Re-verify the constants declaration drift fix (`.tsbuildinfo`/`dist` vs source)
  Record raw exit codes + output tails to evidence files. Result feeds the M81A QA decision record
  (Accept / Accept-with-notes / Reject). Historical claims in `WORK_ORDER_M81A.md` §13 do not count.
- [ ] M82-R2 (R+A): Capability truth matrix for: learning algorithms (BKT/IRT/SM-2 usage),
  permission matrix, offline storage/sync, teacher class/student detail, parent view,
  school teacher management, volunteer Q&A, wrong-answer/progress persistence.
  Label each: Implemented / Partial / Contract Only / Placeholder / Disabled / Future.
  Evidence per row: fresh command, browser flow, or code citation.
- [ ] M82-R3 (V+A): Core runtime chain audit (login/refresh/logout; learn/answer/wrong-answer/
  progress; teacher class+student; parent view; school teacher mgmt; volunteer Q&A;
  offline queue+recovery). Browser-level evidence where runnable; else record "not runnable: why".
- [ ] M82-R4 (A): Security boundary audit: RBAC vs `constants/PERMISSION_MATRIX`, IDOR,
  student data visibility, QA/volunteer/school endpoints, CSRF/token, sensitive log fields,
  consistency/idempotency/concurrency. Seed from `PROJECT_ROADMAP_REVIEW_2026-08-03.md` §5/§6,
  verify or correct each seed finding with a code citation.
- [ ] M82-R5 (R): Placeholder inventory confirmation: cross-check `PLACEHOLDER_ENDPOINTS.md`
  against code; add any newly found 200-but-incomplete surfaces. No code changes - M86 will act.
- [ ] M82-R6 (R+A): Write deliverables: `Docs/REBASELINE_AUDIT.md` (with evidence index +
  P0/P1/P2 defect list + M81A QA decision record) and update `ACCEPTANCE.md` evidence.

## Execution order

R1 -> R2 -> R3 -> R4 -> R5 -> R6. One bounded task per loop; each loop updates `LOOP_STATE.md`.
R1 may be split into 2 loops (commands / analysis) if runtime is long.

## Verification

- Every R1 command has recorded exit code + timestamp + output tail under `Docs/` evidence files
- Truth matrix rows cite file:line or run evidence; zero "believed working" rows without evidence
- Defect list severity-assigned (P0 security/data-loss, P1 core loop, P2 rest)
- `REBASELINE_AUDIT.md` reviewed by Controller before M83 dispatch

## Stop Rules (inherited, see `STOP_RULES.md`)

Same failure signature twice without new evidence -> stop; secrets/destructive ops -> stop;
any pressure to mark unaudited capability as delivered -> stop.
