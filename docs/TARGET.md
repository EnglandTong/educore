# TARGET - EduCore

Status: M82 Program Active (Pre-Refactor Audit & Rebaseline)
Owner: Owner (product decisions) / Controller-QA (acceptance)
Last updated: 2026-08-16
Latest accepted runtime baseline: M49 teacher arc (typecheck PASS, build PASS, e2e 17/17 at the time)
Latest contract-only acceptances: M50-M80 (type/document contracts, NOT runtime capability)
M81A status: Under Independent Re-Verification (M82-R1); Developer checkboxes are NOT acceptance

## Program Goal

Convert EduCore from a broad prototype + contract catalog into a truthful, safe, runnable
learning product core. Phase order (each gated by independent QA acceptance):

- M82 - Trusted Baseline & Full System Audit: produce verifiable current facts. No new features.
- M83 - Owner Product & Architecture Rebaseline: Owner decides target, Non-Goals, first loop.
- M84 - Core Learning Loop Refactor: one end-to-end chain only.
- M85 - Teacher/Parent Collaboration Loop: after M84 is accepted.
- M86 - Placeholder Disposition: productize / permanent-501 / delete / defer, per item.

## Hard Sequencing Rules

1. No large-scale code refactoring before M83 Owner rebaseline is signed.
2. No expansion of volunteer/enterprise/matching/talent features before M84 is independently QA-accepted.
3. M82 audit work (read-only verification + Docs outputs) may proceed immediately.
4. Only one bounded work order is active at a time.

## Current Milestone Boundary (M82)

Docs-only outputs plus read-only verification runs. Deliverables:

- `Docs/REBASELINE_AUDIT.md` (capability truth matrix + runtime chain audit + security boundary audit)
- Current run-evidence index (fresh typecheck/test/lint/build/API/browser evidence)
- P0/P1/P2 defect list (initial seed: `Docs/PROJECT_ROADMAP_REVIEW_2026-08-03.md` §8)
- M81A Independent QA decision record
- Placeholder marking confirmed (`Docs/PLACEHOLDER_ENDPOINTS.md` stays authoritative until M86)

## Superseded Plans

- The "M81-M85 short-term refactor slices" in the previous TARGET (dead code cleanup, mastery
  threshold unification, weakAreaLabel extraction, roster convergence, e2e-mocks split) are
  superseded by this program: dead-code/placeholder items fold into M82 audit + M86 disposition;
  mastery/roster convergence folds into M84.
- Legacy references "PERMISSION_MATRIX extraction deferred to M82" re-scope to the post-M83
  identity/RBAC program; "placeholder 501 conversion deferred to M82+" re-scopes to M86.
- `NEXT_STAGE_PLAN_2026-08-03.md` (R0-R7) is the reference map this program instantiates:
  M82 ~ R0/R1 evidence, M83 ~ R0 decisions, M84-M86 ~ bounded R2/R3 slices.

## In Scope

- `apps/api`, `apps/web`, `packages/*`, `modules/*` - READ-ONLY during M82 (verification runs only)
- `Docs/` governance, audit, acceptance, handoffs, loop logs

## Out of Scope / Non-Goals (until Owner signs M83)

- No production deployment, secrets, credentials, real student data
- No schema migration, tech-stack replacement, new subsystem/shared layer
- No new ecosystem contracts (volunteer/enterprise/matching/talent types or pages)
- No donation/payment activation; no direct student-volunteer/enterprise contact
- No treating green typecheck/build as runtime capability
- No self-acceptance: Developer may only mark `Ready for Controller/QA Review`

## Success Criteria

- [ ] M82 audit accepted: every major capability labeled Implemented / Partial / Contract Only /
      Placeholder / Disabled / Future, backed by fresh run evidence
- [ ] M81A receives explicit Controller/QA decision from independent evidence
- [ ] M83 Owner decision record signed (target user, first loop, Non-Goals, deferred features)
- [ ] M84 core learning loop has unit + API/integration + browser evidence, one mastery authority,
      honest failure semantics, idempotent offline queue
- [ ] No endpoint returns pseudo-success for incomplete capability (M86 dispositions all items)

## Failure Examples

- Marking a placeholder or contract-only milestone as delivered capability
- Accepting on type/build green alone; mock-only or screenshot-only evidence
- Starting M84 refactoring before M83 signoff
- Developer self-acceptance; stale evidence overriding fresh failures
