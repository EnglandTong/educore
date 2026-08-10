# Current Stage Finish Line - Rebaseline and Safety Stabilization

Date: 2026-08-03
Owner: Owner for scope decisions; Controller/QA for acceptance
Proposed status: Not started - Owner approval required
This file is a review recommendation, not an active work order.

## Stage Goal

Create one truthful, safe and runnable EduCore baseline from which feature development can resume. The stage is not intended to deliver the complete volunteer, industry, mentorship or national talent ecosystem.

## Current Stage Can Be Considered Complete Only When

### A. Product And Governance Truth

1. Owner signs one canonical positioning, pilot audience, curriculum/age boundary and first-release capability set.
2. `TARGET.md`, `ACCEPTANCE.md`, `STATUS.md`, `NEXT_ACTIONS.md`, `PENDING.md`, `COMPLETED.md`, `EVALUATION.md`, `LOOP_CONFIG.md`, `STOP_RULES.md` and `LOOP_RUNS.jsonl` agree on the same active stage and latest accepted runtime baseline.
3. Every major capability is labeled `Implemented`, `Partial`, `Contract Only`, `Placeholder`, `Disabled` or `Future`.
4. M50-M80 remain historical contract acceptances and are not described as runtime ecosystem delivery.
5. M81A receives an explicit Controller/QA decision based on fresh evidence; Developer checkboxes alone are not acceptance.

### B. Clean Runtime And Deployment

6. One pinned pnpm 9.15.0 runner is used by local commands, Turbo children, CI and acceptance scripts.
7. A clean install can run typecheck, real lint, unit tests and builds without stale generated declarations or cached-only evidence.
8. All manifests and all seed JSON files parse and validate; the full module loader reports the expected module/question inventory.
9. API production output and Docker CMD agree; the API image starts and `/health` reports MongoDB/Redis state accurately.
10. Web container routes `/api/v1` to the API or uses an explicitly injected deployment URL; a browser reaches the real API through the deployed topology.
11. CI starts both images and performs health plus browser-to-API smoke, not only image existence checks.

### C. Identity, Authorization And Student Protection

12. Teacher, school-admin, volunteer and organization roles cannot be self-selected without an approval/invitation workflow.
13. One enforced permission service/middleware derives from the canonical matrix; route-local role checks are exceptions with written rationale.
14. Teacher access requires a pre-existing, school-scoped assignment; creating a conversation cannot create authorization.
15. School operations cannot silently transfer or demote an unrelated account.
16. Parent/guardian linking, consent granting, revocation and expiry use one canonical consent record and audited authorizer.
17. Volunteer Q&A is disabled or requires approved profile status, anonymized questions, moderation and student protection.
18. Negative integration tests prove cross-student, cross-parent, cross-teacher and cross-school access is rejected.

### D. Learning And Data Integrity

19. Served questions never include `answerKey`, solution or wrong-choice reasons before an answer is accepted.
20. Session start/answer/end/result behavior is idempotent and cannot complete or mutate state through a GET request.
21. Wrong-answer review, mastery and question statistics cannot be duplicated by retries or partial writes.
22. Diagnostic and progress reports use actual skill evidence or explicitly return `not enough evidence`; no decorative empty arrays masquerade as analysis.
23. Content updates are versioned and can update existing seeded records; invalid files fail a dedicated pre-start/CI validation gate.

### E. Browser, Offline And Privacy Safety

24. Refresh/session strategy is documented and implemented; logout revokes/invalidates the session where applicable.
25. Logout clears or partitions local IndexedDB, service-worker caches, Query caches and queued operations by user.
26. Authenticated responses are not cached globally by URL. Shared-device account switching has an automated privacy regression test.
27. Offline queue operations contain stable idempotency keys, explicit dead-letter visibility and user identity binding.
28. Public donation behavior is removed/disabled or replaced with a legally and technically valid payment lifecycle; no fake `completed` state or unsupported impact claims remain.
29. Student, guardian, volunteer and donor PII is minimized and never returned from a public identifier lookup.

### F. Verification And UX

30. `pnpm audit --prod` has zero critical/high findings, or each accepted exception has owner, expiry, exploitability analysis and compensating control.
31. Web lint is real and web unit tests cannot pass with zero tests.
32. API integration tests exercise real MongoDB/Redis behavior for auth, learning, parent, teacher and consent critical paths instead of replacing the services under test.
33. Playwright current suite exits 0 without wrapper timeout; the acceptance script derives the expected count or checks process exit and reporter summary without hardcoded stale totals.
34. At least one non-mocked browser journey covers register/sign-in -> diagnostic/training -> wrong-answer review -> progress -> teacher/parent read-only visibility.
35. `Docs/RUBRIC.md` is rescored from current visible behavior: total at least 20/25 and no category below 3.
36. Mobile 390px and desktop 1440px screenshots show no overlap, clipping or unreachable primary actions for the pilot role set.

## Acceptance Evidence Package

- Exact source commit and clean/dirty status.
- Dependency/runtime versions and canonical command runner.
- Full command outputs or immutable logs for typecheck, lint, unit, integration, build, Docker health and E2E.
- Content inventory with parse/validation totals and zero invalid files.
- Negative authorization/privacy test report.
- Current UX rubric and desktop/mobile screenshots.
- Known risks with owner, severity, mitigation and expiry.
- Controller/QA acceptance record. Developer may only mark `Ready for Controller/QA Review`.

## Not Required For Current Stage

1. Real payment collection or fundraising launch.
2. Direct volunteer/student messaging, mentor scheduling or physical visit management.
3. Volunteer organization/enterprise self-service portals.
4. Talent discovery, enterprise cultivation or automated matching.
5. Full school/major/career recommendation engine.
6. Production cloud deployment, real student data or external credentials.
7. Raspberry Pi capacity claims, local LLM distribution or full offline operation.
8. Nationwide rollout or impact claims.

## Must Not Continue Without Owner Decision

1. Changing the all-student mission, pilot population or education jurisdiction.
2. Enabling donation/payment, cloud AI, volunteer contact or enterprise contact.
3. Collecting sensitive student traits for talent scoring or opportunity allocation.
4. Production operations, real data migration, credentials or legal-policy commitments.
5. New architecture, subsystem, shared layer or technology replacement.
6. Lowering any security, privacy, test or evidence gate to preserve a historical PASS.

## Failure Examples

- Docker image builds but cannot start, yet deployment is marked PASS.
- E2E uses only API mocks and is described as real end-to-end evidence.
- A type/interface milestone is described as a delivered volunteer/industry capability.
- A teacher conversation creates the assignment that authorizes teacher access.
- Cached progress from one account appears after another account signs in on the same device.
- Donation request is stored as completed without a verified payment event.
- Web test/lint exits 0 because no test or linter ran.
