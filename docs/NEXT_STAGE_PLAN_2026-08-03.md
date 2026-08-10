# Next Stage Plan - EduCore Upgrade, Repair And Landing

Date: 2026-08-03
Planner: MRT-Controller-QA Project Roadmap Reviewer
Status: Proposed program map - not dispatched
Dependency: Owner decisions in `PROJECT_ROADMAP_REVIEW_2026-08-03.md`

## 1. Proposed Program Objective

Turn EduCore from a broad prototype plus contract catalog into a truthful, safe, runnable and measurable learning product core. The program prioritizes students, learning integrity and governed school/family support before volunteer, industry and talent-expansion features.

## 2. Recommended Release Boundary

### In Scope For The First Landing Baseline

- One Owner-selected student age/curriculum cohort.
- Student account, diagnostic, practice, wrong-answer review and progress.
- Teacher read-only assigned-student insight.
- Parent read-only linked-child progress.
- School-scoped account/assignment administration.
- Safe weak-network continuity after identity isolation is proven.
- Rule-based explanations; AI only under a separately approved safety gate.
- Local/Docker pilot runtime with synthetic data.

### Non-Goals Until The Core Is Accepted

- Donation/payment.
- Direct volunteer or enterprise contact with students.
- Mentorship scheduling or real-world visit operations.
- Talent ranking, matching or enterprise cultivation.
- Full offline/local LLM hardware distribution.
- Production deployment or real student data.
- Nationwide/impact claims.

## 3. Program Sequence

| Phase | Candidate Program | Complexity | Dependency | Purpose | Auto-advance Rule |
|---:|---|---|---|---|---|
| R0 | Owner Rebaseline And Capability Truth | Standard, docs-only | None | Approve target, release boundary, safety defaults and capability labels | No auto-advance; Owner signoff required |
| R1 | Verification And Runtime Recovery | Deep | R0 | Make clean local/CI/Docker runtime true and deterministic | Advance only after fresh Controller/QA acceptance |
| R2 | Identity, RBAC, Consent And Privacy | Deep | R1 | Eliminate unauthorized role/tenant/student access and browser data leakage | Advance only after negative security evidence and QA acceptance |
| R3 | Learning Integrity And Content Reliability | Deep | R2 | Protect answers, validate all content and repair session/report correctness | Advance only after real DB learning journey passes |
| R4 | Real Integration, Offline And Operations | Deep | R3 | Replace mock-only confidence with real topology, idempotency and observable sync | Advance only after clean-device and container evidence |
| R5 | Pilot UX And Education Loop Closure | Deep | R4 | Close student -> teacher -> parent/school loop for the selected cohort | Advance only after current rubric and manual pilot smoke pass |
| R6 | Moderated Social Resource Pilot | Deep, Owner-gated | R5 + policy approval | Introduce reviewed industry content, then anonymized moderated Q&A | No direct contact; every slice requires Controller review |
| R7 | Pilot Readiness And Controlled Rollout | Deep, Owner-gated | R5 or R6 | Package deployment, support, privacy, rollback and measurement | Owner release decision required |

No phase in this plan is an active Work Order. Controller/QA must create bounded work orders after R0 approval.

## 4. Phase Detail

### R0 - Owner Rebaseline And Capability Truth

Goal: make requirements testable before more code is written.

Candidate bounded loops:

1. Approve mission, first cohort, curriculum/jurisdiction and pilot success measures.
2. Decide donation, AI, offline, volunteer and talent defaults.
3. Create capability truth matrix and rename the current stage.
4. Reconcile all governance files and archive superseded public claims without deleting history.

Acceptance:

- One signed decision record.
- One canonical target and first-release scope.
- No active status points to a missing QA/handoff path.
- Every deferred capability has an explicit re-entry gate.

### R1 - Verification And Runtime Recovery

Goal: ensure “build green” means the product can actually start.

Candidate bounded loops:

1. Pin one pnpm path and repair the strict acceptance script for the current suite.
2. Add all-module content parse/schema validation and fix invalid algebra content.
3. Align API TypeScript output, package entrypoint and Docker CMD; exclude tests from runtime output.
4. Connect web container to API and add compose health/browser smoke.
5. Replace no-op web lint and zero-test pass behavior.
6. Upgrade/override vulnerable dependencies and document any non-removable residual risk.

Acceptance:

- Clean install and uncached checks pass.
- API/web containers start; real `/health` and `/api/v1/modules` work through the browser origin.
- All module files validate with recorded totals.
- Production audit has zero high/critical findings or approved time-bounded exceptions.

### R2 - Identity, RBAC, Consent And Privacy

Goal: establish one reliable authority model before exposing any multi-role workflow.

Candidate bounded loops:

1. Remove privileged-role self-registration and define invitation/approval transitions.
2. Enforce canonical permissions and school/assignment scopes in middleware/services.
3. Separate communication from authorization; conversation creation cannot create assignments.
4. Consolidate guardian link and canonical consent records with grant/revoke/expiry audit.
5. Repair school teacher add/remove lifecycle without arbitrary role conversion.
6. Partition/clear browser stores and caches; revise token/session/logout handling.
7. Disable or contain volunteer Q&A until approved profile, anonymization and moderation exist.
8. Disable unsafe donation lookup/creation behavior.

Acceptance:

- Real database negative tests cover every cross-role/cross-tenant boundary.
- Shared-device test proves no cache or queue data crosses accounts.
- No privileged role can be obtained without an approved transition.
- Sensitive operations emit verifiable audit events.

### R3 - Learning Integrity And Content Reliability

Goal: make the central learning loop educationally trustworthy.

Candidate bounded loops:

1. Define public question DTOs that omit answers/solutions before submission.
2. Validate module IDs, levels, question types and content version/provenance.
3. Repair session uniqueness, idempotency, end/result semantics and transaction boundaries.
4. Remove duplicate wrong-answer writes and unsafe manual mastery shortcuts.
5. Generate diagnostic/progress explanations from skill evidence rather than placeholders.
6. Expand validation beyond English grammar and set per-module quality gates.
7. Define the pilot content matrix: subject, level, skill, type, minimum count and editorial owner.

Acceptance:

- A learner cannot retrieve an answer before accepted submission.
- Retry and duplicate-request tests do not double-count attempts or mastery.
- All content modules parse, validate and meet the approved pilot matrix.
- Reports trace each claim to attempts/skills and state insufficient evidence honestly.

### R4 - Real Integration, Offline And Operations

Goal: replace mock-only assurance with real system behavior.

Candidate bounded loops:

1. Add MongoDB/Redis integration tests for auth, learning, consent, teacher and parent journeys.
2. Keep mocked browser tests for UI speed, but add a smaller non-mocked browser suite.
3. Add idempotency keys, dead-letter visibility and account binding to offline sync.
4. Prove logout/account switching/cache eviction on a clean browser profile.
5. Add structured metrics, error reporting, backups, restore drill and operational runbook.
6. Add low-bandwidth performance budgets and optimize large initial chunks.

Acceptance:

- Non-mocked browser journey passes against started containers.
- Offline/online replay is idempotent and observable.
- Restore drill and rollback steps are executed against synthetic data.
- Performance budgets pass on the selected pilot device/network profile.

### R5 - Pilot UX And Education Loop Closure

Goal: deliver one coherent, understandable learning/support loop for the chosen cohort.

Candidate bounded loops:

1. Student onboarding, diagnostic, daily practice, review and progress comprehension.
2. Teacher assigned-student insight with explainable next actions, not rankings.
3. Parent linked-child progress with consent-aware support guidance.
4. School account/assignment oversight using minimum necessary aggregate data.
5. Language, age tone, accessibility and mobile/desktop refinement.
6. Pilot support, feedback and issue-triage workflow.

Acceptance:

- `RUBRIC.md` total >=20/25 and no category below 3 using current evidence.
- Selected student/teacher/parent/school manual journeys pass with synthetic data.
- No visible placeholder, demo credential, unsupported impact claim or dead route remains in the pilot surface.
- Pilot success metrics are measurable without sensitive ranking or discriminatory labels.

### R6 - Moderated Social Resource Pilot

Goal: test social-resource value without opening direct student contact.

Entry gates:

- R5 accepted.
- Owner approves safeguarding, moderation, consent, complaint, takedown and audit policy.
- Named accountable organization and human moderators exist.

Recommended order:

1. Reviewed industry/content library with provenance and expiration.
2. School/major/career information as reference, not automated decision replacement.
3. Anonymized, asynchronous, moderated volunteer Q&A.
4. Only after separate approval: supervised sessions with guardian/school authorization.

Talent ranking or enterprise discovery is not part of R6.

### R7 - Pilot Readiness And Controlled Rollout

Goal: decide whether a small pilot can operate safely.

Required pack:

- Deployment and rollback runbook.
- Data classification, retention, export/deletion and incident process.
- Support ownership and service-level expectations.
- Synthetic-to-pilot data transition plan.
- Training for teachers/admins/moderators.
- Baseline/target metrics and fairness review.
- Independent Controller/QA signoff and Owner release decision.

## 5. Recommended Requirement Structure

For each future capability, requirements should contain:

1. User and problem.
2. Allowed and forbidden actors.
3. Data owner, sensitivity, retention and audit rule.
4. Consent and supervision preconditions.
5. Happy path plus abuse/negative paths.
6. Functional acceptance and observable evidence.
7. UX rubric category where applicable.
8. Rollback/disable mechanism.
9. Non-goals and future extensions.

Avoid requirements such as “support volunteer ecosystem” or “improve AI” without a specific actor, action, boundary and evidence gate.

## 6. Success Measures For Landing

Do not use route/page/type counts as success metrics. Recommended first-pilot measures:

- Learning journey completion and retry-safe data accuracy.
- Content coverage by approved skill/type matrix.
- Student comprehension of feedback and next action.
- Teacher/parent ability to explain the same progress evidence consistently.
- Zero unauthorized cross-account/role access in security regression.
- Zero high/critical dependency findings or approved exceptions.
- E2E/runtime gate reliability across repeated clean runs.
- Incident, sync failure and support issue visibility.

Long-term impact measures such as learning gain, opportunity breadth and industry awareness require a real pilot design and cannot be inferred from current hardcoded dashboards or type contracts.

## 7. Controller Dispatch Rule After Approval

After R0 Owner approval, Controller/QA should dispatch one phase at a time. Each phase may contain ordered Lite/Standard/Deep work orders, but:

- Only one work order is active at a time.
- Each work order changes the smallest complete behavior.
- Developer may auto-advance inside the approved phase only when all commands pass and no Stop Rule is triggered.
- Deep security, data model, auth, consent, deployment and student-contact changes require Controller review before the next phase.
- Developer may finish as `Ready for Controller/QA Review`; only Controller/QA may mark `Accepted`.
- A historical PASS cannot override fresh failing evidence.

## 8. Immediate Recommendation

Do not resume M81/M82 ordinary refactoring yet. First obtain Owner decisions for R0, then create a bounded R1 runtime-recovery program. Runtime truth and student safety have higher priority than additional architecture cleanup or ecosystem expansion.
