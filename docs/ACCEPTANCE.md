# ACCEPTANCE - M82-M84 Program Gate

Status: M85/M86 Active (bounded planning and disposition)
Last updated: 2026-08-16
Scope authority: `Docs/TARGET.md` > this file > `Docs/STATUS.md` > `Docs/PENDING.md` > `Docs/NEXT_ACTIONS.md`
History: per-milestone records live in `Docs/QA_M*_ACCEPTANCE_*.md`, `Docs/COMPLETED.md`, `Docs/LOOP_RUNS.jsonl`, and git history. M50-M80 gates were contract-level acceptances, not runtime capability acceptances.

## Current Milestone: M85/M86 - Collaboration decision and Placeholder Disposition

Work orders: `Docs/WORK_ORDER_M85.md`, `Docs/WORK_ORDER_M86.md`
M82 audit deliverables: `Accept-with-notes` (`docs/QA_M82_ACCEPTANCE_2026-08-21.md`).
M84: `Accept-with-notes` (`docs/QA_M84_ACCEPTANCE_2026-08-21.md`).

M85 implementation is not dispatched until Owner confirms one collaboration loop. M86 is
documentation-first and must not delete ambiguous assets without a separate target decision.

## M84 Current Evidence

- QC review: `docs/M84_QC_REVIEW_2026-08-21.md`
- Runtime evidence: `docs/evidence/M84-R1-EVIDENCE.md`
- Event idempotency model: `apps/api/src/models/AnswerEvent.ts`

## M82 Current Evidence Package

- Audit matrix and R6 handoff: `docs/REBASELINE_AUDIT.md`
- M81A decision input (not independent QA): `docs/M81A_REVERIFICATION_DECISION_INPUT.md`
- R1 automatic evidence: `docs/evidence/M82/EVIDENCE_INDEX.md`
- R3 runtime/API evidence: `docs/evidence/M82/M82-R3-EVIDENCE.md`
- R4 permission tests: `docs/evidence/M82/M82-R4-permission-tests.log`
- R5 placeholder cross-check: `docs/evidence/M82/M82-R5-PLACEHOLDER-CROSSCHECK.md`
- Authorized runtime evidence: `docs/evidence/M82/M82-AUTHORIZED-RUNTIME-EVIDENCE.md`
- Controller disposition: `docs/M82_CONTROLLER_DISPOSITION_2026-08-21.md`
- Independent QA packet: `docs/M82_INDEPENDENT_QA_PACKET_2026-08-21.md`
- QA decision: `docs/QA_M82_ACCEPTANCE_2026-08-21.md`
- M84 QA decision: `docs/QA_M84_ACCEPTANCE_2026-08-21.md`
- M86 QA disposition: `docs/QA_M86_DISPOSITION_2026-08-21.md`
- M85 QA decision: `docs/QA_M85_ACCEPTANCE_2026-08-21.md`

Current Developer disposition: `Ready for Controller/QA Review`; MP checkboxes remain unchecked until independent review confirms each criterion.

### Must Pass (all required for M82 acceptance)

- [ ] MP1: Fresh verification runs recorded (typecheck, root test, lint, API tests, web build,
      Playwright key journeys) with exit codes, timestamps, output tails - not historical claims
- [ ] MP2: `Docs/REBASELINE_AUDIT.md` exists with capability truth matrix; every row labeled
      Implemented / Partial / Contract Only / Placeholder / Disabled / Future with evidence citation
- [ ] MP3: Core runtime chain audit covers all 7 chains in WORK_ORDER_M82 R3, each with
      browser/API run evidence or an explicit "not runnable + why" record
- [ ] MP4: Security boundary audit (RBAC/PERMISSION_MATRIX, IDOR, student data visibility,
      CSRF/token, sensitive logs, consistency/idempotency) each finding has code citation
- [ ] MP5: Placeholder inventory cross-checked against code (`PLACEHOLDER_ENDPOINTS.md` confirmed
      or amended); no newly found pseudo-success surface left unmarked
- [ ] MP6: P0/P1/P2 defect list published with severity rationale
- [ ] MP7: M81A independent QA decision record written (Accept / Accept-with-notes / Reject)
      based solely on M82-R1 fresh evidence
- [ ] MP8: Governance files consistent (TARGET/ACCEPTANCE/STATUS/PENDING/NEXT_ACTIONS/CMS/
      Work_Order_Active/ACTIVE_PACKET/LOOP_STATE all point to M82; no stale M81A-active claims)

### Evidence classes per milestone (program-wide rule)

Every future milestone (M83-M86) must provide: automatic evidence (typecheck/test/lint/build),
run evidence (real API or browser flow), security evidence (allow+deny matrix), data evidence
(persistence/retry/error/consistency), documentation evidence (target/scope/Non-Goals/Work Order
consistency), and independent QA conclusion.

### Not Accepted if

- Only types or build pass; only screenshots or mocks pass; user flow never ran
- A placeholder endpoint still returns pseudo-success while being claimed as capability
- Core permission or student-data boundary unverified
- Developer self-accepted; TARGET and Work Order conflict
- Any Must Pass checkbox lacks an evidence link

## Prior Gate Disposition

- M81A (Verification Baseline & Governance Convergence): Developer-marked checkboxes `[x]` in
  `Docs/WORK_ORDER_M81A.md` §13 are NOT acceptance. Disposition pending M82-R1 independent
  re-verification. Reference: `Docs/PROJECT_ROADMAP_REVIEW_2026-08-03.md` verdict
  "M81A: QA Review, not Accepted".
- M81 (dead code cleanup, code portion): completed in M81A code fixes; contract-level only.
- M49: last accepted runtime baseline (teacher arc, e2e 17/17 at the time).
