# Project Roadmap Review - EduCore Rebaseline

Date: 2026-08-03
Reviewer: MRT-Controller-QA Project Roadmap Reviewer
Review type: whole-system, read-only, evidence-based rebaseline
Source baseline: `main` at `6a4c555a8cf967755ffeb9363d9afb3a9039a53e`
Decision scope: product readiness and roadmap truth; this is not a QA acceptance record for M81A

## 1. Executive Summary

- Project original target: an adaptive learning platform for rural education, with offline-first operation, local AI and family/teacher support.
- Current stated target: an equal learning and growth platform for all students, connecting students, parents, schools, teachers and governed social volunteer resources without poverty or regional labels.
- Current overall status: **Failed / Needs Rebaseline for product landing**. The repository contains substantial prototype assets, but it is not a deployable MVP and is far from the full ecosystem target.
- Most important completed work: monorepo foundation, tested adaptive algorithm package, broad API/page skeleton, a visible student/parent/teacher experience, teacher dashboard arc, and extensive governance records.
- Biggest remaining gap: milestone status does not distinguish type contracts, mocked demonstrations, real runtime features and safe production behavior. M50-M80 were accepted mostly as type/document contracts, not as delivered ecosystem capabilities.
- Recommended next mode: **Owner-approved Rebaseline and Safety Stabilization**, followed by bounded implementation programs. Stop creating new ecosystem contracts until runtime, authorization, student safety and deployment truth are repaired.
- Is current stage closeable now: **No**.
- Owner decision required: **Yes**. Product audience, pilot boundary, donation, AI for minors, offline promise and volunteer/enterprise contact must be decided before dispatch.

Blunt conclusion: EduCore is a technically promising prototype with real code and useful learning assets. It is not currently safe to expose to students, parents, schools, volunteers or donors. Green typecheck/build output has hidden real startup, deployment, authorization, privacy and test-credibility failures.

## 2. Review Scope And Method

Reviewed:

- Governing files: `TARGET.md`, `ACCEPTANCE.md`, `STATUS.md`, `NEXT_ACTIONS.md`, `PENDING.md`, `COMPLETED.md`, `EVALUATION.md`, `LOOP_CONFIG.md`, `STOP_RULES.md`, `LOOP_RUNS.jsonl` and current M81/M81A material.
- Vision files: `EduCore 系统目标与达成要求 初稿 v0.2.md`, `README.md`, `PROJECT_INTRO.md`, `ARCHITECTURE.md`, `PROJECT_ROADMAP.md`.
- Product implementation: API routes/services/models, web pages/router/PWA/offline stores, shared packages and all six content modules.
- Evidence: current build/test/lint/E2E output, Playwright failure context, content parsing, dependency audit, Docker/CI definitions and selected M50-M80 QA records.

Not performed:

- No production system, credentials or real student data were accessed.
- No product code or existing governance state was changed.
- A live Docker stack and real MongoDB/Redis journey were not accepted because the checked-in API image command targets a nonexistent file and content loading already fails on invalid JSON.
- No formal legal/compliance certification or penetration test was performed. Security findings below are manual source-path findings plus package-audit evidence.

## 3. Target And Boundary Drift

### 3.1 Intended Product Target

The strongest current target is the v0.2 vision:

- Serve all students equally and avoid regional, poverty or school-resource labels (`EduCore 系统目标与达成要求 初稿 v0.2.md:5`).
- Improve learning, exam adaptation, teacher observation and family/school collaboration.
- Connect volunteers, organizations, enterprises, volunteer teachers and volunteer schools under auditable student-protection boundaries (`EduCore 系统目标与达成要求 初稿 v0.2.md:17-49`).
- Treat talent discovery and industry exposure as governed future capabilities, not unrestricted student access.

### 3.2 Current Governance Target

`TARGET.md` no longer represents that product target. It narrows the active goal to M81-M85 architecture debt repayment and names M80 as the latest accepted baseline (`TARGET.md:3-11`). That is a legitimate short maintenance boundary, but it is not a complete product contract for the requested upgrade and landing effort.

### 3.3 Contradictory Public Narrative

`README.md` and `PROJECT_INTRO.md` still describe a rural-only charity/experiment direction, complete offline operation, Raspberry Pi/local LLM deployment, WeChat reports and phases at 100%. `ARCHITECTURE.md` additionally claims HttpOnly cookies, field-level encryption, tamper-proof audit logs, AES-encrypted offline data and 30-50 concurrent students. Those claims are not supported by the current runtime.

Required correction: select one canonical product proposition and classify every claim as `Implemented`, `Partially Implemented`, `Contract Only`, `Planned` or `Removed`. Public-facing claims must not exceed current evidence.

## 4. Project Overview

| Area / Subsystem | Purpose | Current Status | Main Evidence | Risk |
|---|---|---|---|---|
| Governance | Agent-loop planning, handoff and QA history | Extensive but drifted | M14-M80 records, `STATUS.md`, `LOOP_RUNS.jsonl` | High: incompatible current-state files and missing M81A handoff/QA record |
| Shared types/contracts | Common role, fairness, consent, ecosystem vocabulary | Strong contract inventory | `packages/types/src`, M50-M80 QA records | High: accepted contracts are repeatedly presented as delivered capabilities |
| Adaptive algorithms | BKT, IRT, scoring, selection and spaced repetition utilities | Real and tested library | 53 algorithm tests pass | Medium: runtime usage and outcome calibration are not proven end to end |
| Content validation | Validate manifests and seed structure | Narrow | 18 validation tests pass | High: validation only covers English grammar; invalid algebra JSON is in the repo |
| Student learning | Diagnostic, training, review, challenge, progress and wrong answers | Partial prototype | API services/routes and student pages | Critical: answer keys are served before submission; startup content failure; reports contain placeholders |
| Student emotional support | Check-in, journal, proud wall and supportive copy | Partial prototype | student pages and mock E2E | High: current evidence is mocked; AI safeguarding is insufficient for minors |
| Parent experience | Link child, view progress/guides and communicate | Partial and weakly governed | parent pages/routes | High: parent can grant consent on its own link; canonical consent service is not integrated |
| Teacher experience | Dashboard, roster, assignments, student detail and communication | Broad prototype | M26-M49, teacher pages/routes | Critical: teacher self-registration plus conversation-created assignment enables unauthorized access paths |
| School administration | School overview, students and teachers | Partial | school routes/pages | High: adding a teacher rewrites any existing account's role/school; removal demotes to student; classes are empty placeholder |
| Volunteer Q&A | Volunteer profile, board, answering and rating | Thin unsafe prototype | volunteer/QA routes/pages | Critical: no approval-to-role workflow, no anonymization/moderation, raw student/volunteer identifiers exposed |
| Industry/mentorship/enterprise | Career awareness, real-work exposure and talent cultivation | Contract only | M63-M75 type definitions | Critical if marketed as available; no runtime governance or journeys exist |
| AI tutor | Local/cloud/rule fallback and tutoring endpoints | Experimental | AI provider and prompt modules | Critical for minors: incomplete filtering/consent; provider admin route is unreachable because student hook also applies |
| Offline/PWA | Weak-network continuity and local sync | Shell/partial | Workbox, IndexedDB and sync queue | Critical privacy risk: authenticated progress cache is URL-only and local stores are not user-scoped or cleared at logout |
| Donation | Public fundraising and impact display | Unsafe demo | donation API/page | Critical: API marks an unauthenticated request `completed` without payment proof and exposes donation details by ID |
| Deployment | Dockerized API/web/Mongo/Redis | Broken | Dockerfiles, compose and CI | Critical: API image starts nonexistent `dist/server.js`; web API proxy is commented out |
| Observability/operations | Health, logs, runbooks and release checks | Minimal | `/health`, Pino and CI definitions | High: no metrics/tracing/backup/restore/incident evidence; CI builds images but never starts them |

Repository scale is nontrivial: about 429 application/package/module files, 321 TypeScript/TSX files, 99 API route registrations, 23 Mongo models and 33 web pages. Size is not the problem; evidence quality and boundary enforcement are.

## 5. Fresh Verification Snapshot

Executed on 2026-08-03, Asia/Shanghai:

| Command / Check | Result | Interpretation |
|---|---|---|
| `pnpm.cmd run typecheck` | PASS, 9/9 Turbo tasks | Source typing passes through the direct pnpm 9.15.0 runner |
| `corepack pnpm run typecheck` | FAIL in Turbo child runner | The official/current runner path is not deterministic; child process reported pnpm 11.10.0 against `packageManager: pnpm@9.15.0` |
| `pnpm.cmd run test` | PASS, 12/12 tasks | API 54, algorithms 53, validation 18; web has zero unit tests and passes because `passWithNoTests` is enabled; types/constants only echo “No tests yet” |
| `pnpm.cmd --filter @educore/web run build` | PASS | 2,818 modules; main JS 509.50 kB and Recharts 421.47 kB before gzip |
| `pnpm.cmd --filter @educore/api run build` | PASS | TypeScript emits under `dist/src`, including tests |
| `pnpm.cmd run lint` | Exit 0 | Not a valid web lint gate: web script only prints `lint configured in a later sprint` |
| `pnpm.cmd --filter @educore/web run test:e2e --reporter=list` | FAIL / outer timeout | 16 tests passed, donation route timed out at `page.goto`, 1 failed; process did not exit before 300 seconds |
| Direct `loadModules()` against built API | FAIL | `math-algebra/seeds/B1.json` has a bad control character at line 507; real startup cannot finish loading content |
| `corepack pnpm audit --prod` | FAIL | 32 vulnerabilities: 14 high, 15 moderate, 3 low; includes Fastify routing/static, Axios, Vite, React Router and Mongoose paths |
| Local static login/register preview | Rendered | Desktop login and 390px registration do not overlap, but demo credentials are prefilled and role/product language is inconsistent |

Current UX rubric reassessment:

| `RUBRIC.md` Category | Score | Current Evidence |
|---|---:|---|
| Warm Non-Judgmental Copy | 4/5 | Visible login/register and student copy are generally supportive |
| Core Learning Flow Usability | 2/5 | Mock journey exists, but current E2E fails and real API startup/content path is broken |
| Review And Recovery Experience | 2/5 | UI exists; evidence is mocked and answer-key exposure invalidates learning integrity |
| Emotional Safety Features | 3/5 | Heart/journal/proud-wall surfaces exist; real backend and safeguarding evidence is incomplete |
| Technical UX Reliability | 1/5 | Stale strict checker, failing/hanging E2E, no web lint/unit tests and broken production routing |
| **Total** | **12/25 - FAIL** | Threshold is 20/25 with no category below 3 |

The historical 20/25 score from 2026-06-19 was based on 11 mocked E2E tests and is not current acceptance evidence for the 17-test suite.

## 6. Milestone Inventory

| Milestone Range | Planned Goal | Actual Delivery | QA Status | Risk | Remaining Gap |
|---|---|---|---|---|---|
| M1-M13 | Early adaptive MVP | Base monorepo, student flows, content and algorithms | Unknown / Missing Evidence in this review | Medium | Reconstruct only if needed; do not infer release status |
| M14-M25 | Readiness, evidence and governance continuity | Mostly scripts, ledgers, runbooks and recovery records | Accepted/Failed history exists | High | Governance volume exceeded product evidence; state files later drifted |
| M26-M49 | Teacher assignment and insight arc | Real teacher UI/API slices plus mocked E2E | Accepted With Risk for rebaseline purposes | High | Mock-heavy evidence; authorization model is unsafe; current 17-test suite is red |
| M50-M53 | Vision, roles, consent and fairness | Types/docs contracts | Accepted as contract milestones | High | Runtime role/consent/fairness enforcement absent |
| M54-M60 | Content, practice, exam, growth and role views | Mostly TypeScript interfaces | Accepted as contract milestones | Critical if treated as features | M55 says no algorithm runtime; M56 says no exam engine; view engines are not delivered by these milestones |
| M61-M65 | Intervention, communication and volunteer entities | Mostly TypeScript interfaces | Accepted as contract milestones | Critical if treated as features | Consent/access workflows and organization/enterprise runtime absent |
| M66-M70 | Volunteer education, matching and industry guidance | Mostly TypeScript interfaces | Accepted as contract milestones | Critical if treated as features | No safe matching, review workflow, content library or guidance runtime |
| M71-M75 | Work exposure, talent signals and ecosystem E2E | Mostly TypeScript interfaces | Accepted as contract milestones | Critical if treated as features | M75 explicitly has no concrete journeys and declarative consent/audit only |
| M76-M80 | Pilot, impact, privacy and national evidence | Mostly TypeScript interfaces/evidence-pack contract | Accepted as contract milestones | Critical | No pilot, feedback data, impact metrics, audit runtime, retention sweep or real evidence pack generator |
| M81 | Architecture debt repayment | Milestone record dispatched | QA Review | Medium | Work was interrupted by M81A and broader rebaseline |
| M81A | Verification/governance hotfix | Code changes applied; checkboxes self-marked | QA Review, not Accepted | Critical | No consolidated handoff/QA acceptance; current runner/E2E/runtime evidence contradicts “verification green” |

M50-M80 acceptance records are useful contract acceptance records. They are not proof that EduCore implements an equal-learning ecosystem. For example, M56 records “No runtime exam-engine,” M62 “No runtime consent enforcement,” M69 “No runtime content review workflow,” M75 “No concrete journeys,” M79 “retention enforcement is downstream,” and M80 “no code-level dependency” on the supposed evidence sources.

## 7. Most Important Completed Work

### Core Completed

| Area | Completed Work | Why It Matters | Evidence | Status |
|---|---|---|---|---|
| Algorithms | BKT/IRT/scoring/question selection/spaced repetition utilities | Gives the learning product a real technical foundation | 53 passing tests | Core completed with runtime-integration risk |
| English grammar content | 600 questions across 8 question types and six levels | Closest module to the stated diverse-practice goal | seed inventory + validation tests | Core completed with editorial/pilot risk |
| Student surfaces | Dashboard, check-in, diagnostic, training, progress, wrong answers and emotional-support pages | Establishes the central learner journey | `apps/web/src/pages/student` | Partial core delivery |
| Teacher surfaces | Dashboard, class, assignment, student and learning-path views | Provides a useful teaching prototype | M26-M49 and source | Completed with authorization risk |
| Parent surfaces | Child link, progress, guides, announcements and messages | Supports a family collaboration prototype | parent routes/pages | Partial delivery with consent risk |

### Supporting Completed

| Area | Completed Work | Purpose | Evidence | Status |
|---|---|---|---|---|
| Monorepo architecture | Web/API/shared packages/content modules | Clear ownership and reusable contracts | workspace structure | Good foundation |
| CI/Docker definitions | Type/build/test/lint jobs and image builds | Repeatable automation intent | `.github/workflows/ci.yml`, Dockerfiles | Present but insufficient |
| Governance | Work orders, handoffs, acceptance records and loop rules | Enables multi-agent traceability | `Docs/` | Valuable but needs consolidation |
| Shared vocabulary | 10 roles and ecosystem/privacy/fairness types | Creates a design language for future work | `packages/types/src` | Contract-only support |

## 8. Verified Defects And Risks

### P0 - Current Stage Must Finish

1. **API production image cannot start.** `docker/Dockerfile:52` runs `apps/api/dist/server.js`, while fresh build emits `apps/api/dist/src/server.js`; the expected file does not exist.
2. **Content loading fails.** `math-algebra/seeds/B1.json` is invalid JSON and `moduleLoader.ts:119` parses every seed without per-file containment. Direct `loadModules()` fails.
3. **Web container is not connected to API.** The client defaults to `/api/v1`, but Nginx `/api/` proxy is commented out (`apps/web/nginx.conf:29-30`). Compose therefore serves SPA HTML for API paths unless a separate build-time URL is injected.
4. **Teacher authorization chain is unsafe.** Public registration allows `teacher`; `createConversation` then upserts `TeacherAssignment` (`community.service.ts:164,184,211,247,274`) without prior school/assignment validation.
5. **Assessment answers are disclosed before submission.** `ServedQuestion` includes `answerKey` and explanatory data (`question.service.ts:29-51`), and learning/challenge endpoints return it.
6. **Authenticated PWA caches are not identity-scoped.** `questions-cache` and `progress-cache` are URL-based (`vite.config.ts:46-57`), allowing stale/shared-device cross-account exposure and caching answer keys.
7. **Donation behavior is materially false and leaks data.** Public POST immediately creates `status: completed` without payment proof (`donation.service.ts:28`); impact counts are hardcoded; public GET by ID returns the raw donation document, including email/private message.
8. **Dependency baseline is red.** Production audit reports 14 high and 15 moderate vulnerabilities. High paths include `@fastify/static`, `find-my-way`, `fast-uri`, Axios, Vite, React Router, PostCSS, `form-data` and `brace-expansion`.

### P1 - Current Stage Should Finish

1. Canonical `PERMISSION_MATRIX` calls itself the single source of truth (`permissions.ts:52-54`) but is not used by API code.
2. School add-teacher mutates any existing account to teacher and transfers its school; remove-teacher demotes to student (`school.routes.ts:68,94`).
3. Parent link consent and canonical `ConsentRecord` are separate systems; consent service exists but has no consumers.
4. QA questions expose student IDs to every authenticated user; answering checks exact role only and does not require an approved active volunteer profile.
5. AI provider health route requires both student and admin because a plugin-level student hook applies before route-level admin guard (`ai.routes.ts:13,66`). Minor safety filtering and consent are not adequate.
6. Access and refresh tokens are persisted in browser storage; logout only clears the auth store, not user IndexedDB, caches or server refresh state.
7. Strict acceptance script still expects `ok 11 [chromium]` and has a 120-second wrapper while the suite contains 17 tests and currently exceeds five minutes (`agent-loop-check.ps1:144`).
8. Web lint is a no-op; web unit tests can pass with zero files; types/constants test scripts are placeholders.
9. API build emits tests into the production `dist` tree because `rootDir` is `.` and `tests/**/*.ts` is included.
10. CI builds Docker images but never starts them, probes them or runs a real browser-to-API journey.

### P2 - Next Stage Candidate

1. Improve session idempotency, concurrency and transaction boundaries across learning session, mastery, wrong-answer and statistics writes.
2. Validate and version all module content, update existing seeded records rather than `$setOnInsert` only, and add editorial provenance.
3. Replace placeholder diagnostic/summary fields with explainable outputs tied to actual skills.
4. Define a pilot curriculum and age band. Current AI prompts target ages 6-12 while the new goal says all students.
5. Reduce initial bundle cost for weak-network users and establish performance budgets.
6. Add backup/restore, audit, retention, deletion/export, incident response and observability evidence before any pilot.

## 9. Possible Scope Creep / Should Stop Expanding

| Item | Why It Must Stop Now | Recommendation |
|---|---|---|
| New M82+ refactors without rebaseline | Current product and evidence contracts are already inconsistent | Freeze ordinary dispatch until Owner approves the new finish line |
| More ecosystem type definitions | M50-M80 already produced contracts without runtime | No new contract milestone unless it is paired with executable behavior and evidence |
| Direct volunteer/student or enterprise/student contact | Minor-safety, consent, audit and moderation controls are absent | Keep disabled and out of active routes |
| Talent discovery and enterprise cultivation | High discrimination, privacy and child-protection risk | Future version only after policy, appeal, transparency and legal review |
| Donation/payment | Current behavior fabricates completion and impact | Remove or clearly mark as non-transactional demo until legal/payment design exists |
| Full offline/local LLM claims | Current PWA is partial and privacy-unsafe; no hardware evidence | Reclassify as research backlog until a clean-device offline acceptance pack exists |
| Additional dashboards | More UI will not repair data authority or real workflows | Prioritize end-to-end correctness over surface area |

## 10. Current Stage Finish Line

The current stage should be renamed **Rebaseline and Safety Stabilization**. It can be considered complete only when the checkable gates in `CURRENT_STAGE_FINISH_LINE_2026-08-03.md` pass.

At minimum:

1. One Owner-approved target and pilot boundary replaces contradictory rural-only/all-student/charity/ecosystem narratives.
2. Clean local and Docker runtime starts and serves web-to-API traffic with all content modules validated.
3. Centralized authorization, safe role onboarding, student consent and tenant boundaries are enforced by real integration tests.
4. No answer keys, cross-account caches, fake transactions or raw student/donor data leaks remain.
5. Current lint/unit/integration/E2E/security gates are real, fresh and deterministic.
6. Documentation distinguishes contract acceptance from runtime feature acceptance.

## 11. Recommended Next Actions

| Order | Action | Owner | Output | Acceptance Evidence |
|---:|---|---|---|---|
| 1 | Approve target, pilot cohort, safety posture and explicitly deferred features | Owner | Rebaseline decision record | Signed decisions with rationale |
| 2 | Replace current status with a capability truth matrix and freeze unsafe claims/routes | Controller/QA after approval | Canonical `TARGET`, `STATUS`, `ACCEPTANCE`, stop rules | Cross-file consistency checks |
| 3 | Dispatch runtime/build recovery program | Controller -> Developer | Valid content, correct image entrypoint, working web/API container, deterministic pnpm | Clean build plus started-container probes |
| 4 | Dispatch identity/RBAC/consent/privacy program | Controller -> Developer | Enforced permission middleware, approved onboarding, identity-scoped local data | Negative authorization and cross-account tests |
| 5 | Dispatch learning-integrity/content program | Controller -> Developer | Redacted served questions, valid content, accurate reports and transactional session behavior | Real DB integration and learner-flow tests |
| 6 | Dispatch real evidence and UX program | Controller -> Developer | Non-mocked critical journeys, web lint/unit tests, current rubric | E2E exits 0, UX >=20/25, evidence paths current |
| 7 | Consider a closed pilot only after all prior gates | Owner + Controller/QA | Pilot readiness pack | Deployment, rollback, privacy, support and manual smoke evidence |

## 12. Developer Communication

- Continue: preserve useful algorithms, content, role pages and teacher/parent workflows while fixing the authority and runtime underneath them.
- Correct: runtime startup, dependency baseline, authorization, consent, data isolation, learning integrity and evidence credibility before feature expansion.
- Stop: new ecosystem contracts, dashboards, direct student contact, donation completion and unsupported public claims.
- Do not touch without Owner approval: production data, cloud credentials, payment providers, real student/volunteer onboarding, talent matching, new architecture or technology replacement.
- Evidence required: clean runner identity, real Mongo/Redis integration, started Docker containers, real browser-to-API journey, negative security probes, fresh UX score and current artifact paths.
- Stop and report Blocked: any need for credentials/real data/legal policy/production operation; architecture conflict; repeated verification failure; inability to define a safe minor-data boundary.

## 13. Owner Decisions Needed

| Decision | Options | Recommended Default | Reason |
|---|---|---|---|
| Canonical positioning | Rural-only charity experiment / all-student equal learning platform | All-student platform with an explicitly bounded pilot cohort | Matches v0.2 and avoids stigmatizing labels while controlling delivery scope |
| First release scope | Full ecosystem / learning + teacher-parent-school core | Core learning and closed education loop | Current volunteer/enterprise runtime is unsafe and mostly absent |
| Donation | Keep active / demo-only / remove from active product | Remove from active product until real payment/legal design | Current endpoint fabricates completed donations and exposes PII |
| AI for minors | Cloud/local tutor active / rule-only / disabled | Rule-only or disabled until consent and safety gates pass | Current filtering and data governance are inadequate |
| Offline promise | Full offline / weak-network continuity / future research | Weak-network continuity only | Current offline path is incomplete and not identity-safe |
| Volunteer interaction | Direct contact / moderated Q&A / content-only pilot | Reviewed content first, then moderated anonymized Q&A | Lowest-risk way to validate social-resource value |
| Talent/enterprise matching | Near-term / future gated | Future gated | Requires fairness, legal, consent, appeal and misuse controls |
| Pilot age/curriculum | All students / one bounded cohort | One Owner-selected cohort and curriculum | “All students” is a mission, not a testable first release scope |

## 14. Overall Decision

**Project viability: Continue after rebaseline.**

**Release readiness: Failed.**

**M81A: QA Review, not Accepted.** Its local source fixes may be useful, but the present evidence does not satisfy current runtime, E2E or governance truth.

The correct next move is not another ordinary milestone. It is an Owner-approved rebaseline that converts EduCore from a broad prototype and contract catalog into a smaller, safe, runnable and measurable product core.
