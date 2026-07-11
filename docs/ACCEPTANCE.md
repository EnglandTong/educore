# ACCEPTANCE - EduCore

Status: M50 Planning Baseline
Owner: Controller/QA
Last updated: 2026-07-06
Latest accepted baseline: M49 - Teacher Arc M40-M49 Final Regression

## Must Pass

- [ ] Target contract is updated for the equal learning and growth ecosystem goal.
  - Evidence required: documentation
  - Current evidence: `Docs/TARGET.md` includes User Goal, service ecosystem, Success Criteria, Non-Goals, evidence categories, and failure examples.

- [ ] M50 work order exists and is bounded to docs-only rebaseline work.
  - Evidence required: documentation
  - Current evidence: `Docs/WORK_ORDER_M50.md` defines M50-R1 through M50-R4, dependencies, allowed files, forbidden work, and verification commands.

- [ ] Student protection and consent gates are explicit.
  - Evidence required: documentation + review
  - Current evidence: `Docs/TARGET.md`, `Docs/STOP_RULES.md`, and `Docs/WORK_ORDER_M50.md` define that student contact, volunteer interaction, enterprise involvement, mentorship, and matching require consent, auditability, and later explicit milestones.

- [ ] Fairness and non-labeling requirements are explicit.
  - Evidence required: documentation + review
  - Current evidence: target and acceptance rules prohibit negative labels based on region, poverty, school resources, or background.

- [ ] Volunteer and enterprise resource governance is explicit before implementation.
  - Evidence required: documentation + review
  - Current evidence: roadmap and stop rules require audit, approval, ownership, safe boundaries, and no direct implementation in M50.

- [ ] M49 accepted verification baseline is preserved.
  - Evidence required: documentation
  - Current evidence: M49 baseline recorded as typecheck PASS, build PASS, e2e 17/17 PASS; no M50 docs-only change may lower this baseline.

- [ ] Agent Loop evidence remains current and objective.
  - Evidence required: documentation
  - Current evidence: active work must update loop state/logs and record exact commands, results, evidence paths, and timestamps.

## Should Pass

- [ ] `Docs/PROJECT_ROADMAP.md` includes the M50-M80 roadmap with each milestone's use, goal, and requirements.
  - Evidence required: documentation
  - Current evidence: roadmap section exists and references M50 as the next planning baseline.

- [ ] Future product milestones are staged from safety and governance toward implementation.
  - Evidence required: documentation
  - Current evidence: M50-M53 cover vision, roles, consent, and fairness before feature expansion.

- [ ] Existing teacher arc evidence remains easy to locate.
  - Evidence required: documentation
  - Current evidence: references to `Docs/QA_M49_ACCEPTANCE_2026-07-06.md`, `Docs/M40_M49_BATCH_PLAN_2026-07-06.md`, and `Docs/EVIDENCE_LEDGER_M27_M47_2026-07-06.md`.

## Manual Confirmation Needed

- [ ] Owner approval is needed before any production deployment, real credential use, live student data access, or external service integration.
  - Reason: these exceed M50 planning scope and trigger stop rules.

- [ ] Owner / Controller approval is needed before implementing volunteer-student contact, enterprise talent programs, mentorship sessions, or matching engines.
  - Reason: these involve student protection, consent, audit, fairness, and organizational governance.

- [ ] Controller/QA approval is needed to mark any milestone `Accepted` or `Completed`.
  - Reason: Developer can only hand off as Developer Complete, Ready for Controller/QA Review, Blocked, or Failed / Needs Fix.

## Known Exclusions

- Production deployment and production operations.
- Production secrets, OAuth, Supabase secrets, private keys, and paid cloud credentials.
- Real customer data, real student records, and production data.
- Schema migration and assignment CRUD unless later authorized.
- Volunteer, mentor, enterprise, matching, and student-contact implementation in M50.
- New architecture, new subsystem, or shared layer without Owner approval.
- Work outside `D:\Development\EduCore`.

## Completion Gate

- Done: all Must Pass items have objective evidence, verification commands or documentation checks pass, no stop rule is triggered, and work remains inside `Docs/` scope for M50.
- Done with Risk: core docs are complete but a non-blocking evidence gap is explicitly recorded with owner and follow-up.
- Blocked: credentials, production data, student-contact authorization, architecture changes, project-boundary changes, repeated failures, or unresolved scope conflicts are required.
- Failed / Needs Fix: any Must Pass item lacks evidence, contradicts `Docs/TARGET.md`, or weakens M49 accepted baseline.
