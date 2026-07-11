# Project Roadmap

## Forward Roadmap (M50-M80)

EduCore now plans from an adaptive learning MVP toward an equal learning and growth ecosystem platform. The next arc starts with a docs-only rebaseline before any volunteer, enterprise, mentorship, matching, production, or schema work is authorized.

| ID | Name | Use | Goal | Requirement |
|---|---|---|---|---|
| M50 | System Vision Rebaseline | Align final direction | Define EduCore as an equal learning and growth ecosystem platform | Update target, non-goals, service ecosystem, and acceptance principles |
| M51 | Role & Permission Model | Define actors | Model students, parents, schools, teachers, volunteers, organizations, enterprises, volunteer teachers, and volunteer schools | Each role has permissions, visible data, and forbidden actions |
| M52 | Student Protection & Consent | Protect students | Define parent/school consent, student-contact boundaries, and audit rules | No direct student contact without authorization and traceability |
| M53 | Fair Opportunity Principles | Prevent labeling | Define equal treatment and opportunity fairness | No negative labels by region, poverty, or school resources |
| M54 | Learning Content Taxonomy | Expand question exposure | Define question type, knowledge point, difficulty, and exam scenario taxonomy | Supports diverse and extensible practice |
| M55 | Adaptive Practice Expansion | Improve learning | Expand diagnostic, practice, wrong-answer, and spaced repetition paths | Algorithms and learning flow have automated tests |
| M56 | Exam Adaptation Training | Improve exam readiness | Add variant, integrated, and exam-style practice concepts | Students see broader question forms and solution patterns |
| M57 | Student Growth Portfolio | Track growth | Record ability, interest, weak areas, and progress | Reports are explainable and non-judgmental |
| M58 | Teacher Insight Bridge | Connect learning to teaching | Convert learning data into teacher-actionable insight | Teachers see class, student, weak-area, and next-action signals |
| M59 | Parent View MVP | Support parents | Give parents understandable progress and support direction | Warm, explainable, non-ranking information |
| M60 | School View MVP | Support schools | Show school-level learning support summaries | Necessary aggregate visibility only |
| M61 | Teacher Intervention Workflow | Close teacher action loop | Let teachers plan review and follow-up from data | Suggestions have source, action, and follow-up record |
| M62 | Home-School Communication Log | Track collaboration | Record parent, teacher, and school communication | Permissions, timestamps, and boundaries exist |
| M63 | Volunteer Registry | Onboard volunteers | Record volunteer identity, domain, and support type | Auditable, reviewable, enable/disable capable |
| M64 | Volunteer Organization Onboarding | Onboard organizations | Let organizations manage volunteers and service projects | Accountable owner, review process, service scope |
| M65 | Volunteer Enterprise Onboarding | Onboard enterprises | Let enterprises provide industry intro, practice opportunities, and cultivation programs | Approval, safety, and fairness boundaries |
| M66 | Volunteer Teacher / School Onboarding | Onboard volunteer educators | Let volunteer teachers and schools support learning | Content is reviewable and service is recorded |
| M67 | Safe Matching Engine | Match safely | Match resources by need, interest, and authorization state | No unauthorized match; reason is explainable |
| M68 | Mentorship Session MVP | Enable mentorship | Support mentor sharing, Q&A, and learning companionship | Scheduling, records, feedback, and reporting |
| M69 | Industry Exposure Library | Build industry awareness | Represent industries, roles, environments, and skill needs | Trusted, reviewed, updatable content |
| M70 | School & Major Guidance | Support choices | Help students understand schools, majors, and career paths | Real experience, not single-decision replacement |
| M71 | Real Work Environment Exposure | Show real work | Expose work modes, projects, and environments | Videos, interviews, visit records, or cases |
| M72 | Student Interest & Talent Signals | Discover potential | Record interest, effort, performance, and outcomes | Explainable, reviewable, non-discriminatory signals |
| M73 | Enterprise Talent Cultivation Path | Support talent cultivation | Let enterprises support students inside governance boundaries | Parent/school authorization and transparent records |
| M74 | Social Resource Governance | Govern resources | Manage quality, risk, and service records | Review, rating, complaint, and takedown mechanisms |
| M75 | Full Ecosystem E2E Journey | Verify full journey | Cover student, parent, teacher, school, volunteer, and enterprise paths | Automated and functional evidence for key journeys |
| M76 | Pilot Readiness Pack | Prepare pilot | Package school or regional pilot materials | Runbook, risks, acceptance criteria, data boundaries |
| M77 | Pilot Feedback Loop | Learn from pilot | Collect feedback and drive improvements | Issue list, priority, and next work orders |
| M78 | Long-Term Impact Dashboard | Measure impact | Track learning gains, opportunity coverage, and participation | Metrics include practice, adaptation, awareness, growth |
| M79 | Privacy, Audit & Compliance Hardening | Harden compliance | Strengthen data protection, audit, permissions, deletion, and export | Student data is auditable, limited, and accountable |
| M80 | National Talent Development Evidence Pack | Package final evidence | Prove contribution to education quality and talent development | Evidence covers learning, teacher, family/school, volunteer, industry, and talent paths |

Status: Active
Last updated: 2026-07-06T16:00:00+08:00

## Current Position

- Current milestone: `M49 - Teacher Arc M40-M49 Final Regression` (Accepted)
- Latest accepted milestone: `M49`
- Current mode: 10-round agent loop complete (M40–M49)
- Next action: Controller/QA plans M50

## Milestone Goals (M14–M49)

Each milestone has a single primary goal. Programs and Work Orders exist to achieve that goal in bounded, verifiable slices.

| ID | Name | Status | Primary Goal |
|---|---|---|---|
| M14 | MVP Readiness Hardening | Accepted | Improve local acceptance reproducibility, e2e depth, and deployment readiness documentation for the existing MVP without new architecture or production ops. |
| M15 | Release Candidate Evidence Pack | Accepted | Package release-candidate evidence (smoke checklist, freshness audit, evidence index) so Controller/QA can sign off operability traceability. |
| M16 | Release Evidence Operability | Accepted | Make release evidence operable for Controller/QA (runbooks, continuity tracker, deep link audit). |
| M17 | Acceptance Ledger Synchronization | Accepted | Synchronize acceptance ledger and governance state after M16 so the next program dispatch has clear boundaries and handoff traceability. |
| M18 | Controller Dispatch Readiness | Failed | Stage docs-only dispatch readiness after M17; failed because consolidated handoff was missing. |
| M19 | M18 Handoff Recovery | Accepted | Recover missing M18 consolidated handoff and rebaseline governance chain after M18 failure. |
| M20 | Next Dispatch Readiness | Failed | Stage next docs-only program after M19; failed because consolidated M20 handoff was missing. |
| M21 | M20 Handoff Recovery | Accepted | Recover missing M20 consolidated handoff and restore dispatch readiness. |
| M22 | Post-Recovery Evidence Ledger Stabilization | Accepted | Stabilize post-recovery evidence ledger (M19–M22) so future loops can identify latest accepted state and evidence paths. |
| M23 | Program Dispatch Readiness Alignment | Accepted | Align dispatch boundary, execution entry points, and evidence requirements before Developer resumes autonomous execution. |
| M24 | Post-M23 Evidence Chain Continuity | Accepted | Extend evidence ledger through M23 acceptance and keep governance chain coherent for next dispatch. |
| M25 | Post-M24 Governance Baseline Verification | Accepted | Verify governance baseline (status, ledgers, acceptance history) remains coherent after M24 before product re-engagement. |
| M26 | EduCore Product Baseline Re-engagement | Accepted | Read-only codebase audit and minimum product slice definition to transition from governance-only cycle back to product work. |
| M27 | Teacher Assignment Overview Dashboard | Accepted | First product deliverable: read-only Teacher Assignment Overview page using existing `/teacher/class/overview` aggregate API. |
| M28 | Teacher Assignment Build Verification and UX Hardening | Accepted | Close M27 risks: verify web build/typecheck, align mastery badges with `Badge` component, add sidebar link to `/teacher/assignments`. |
| M29 | Teacher Assignment Overview E2E Smoke Coverage | Accepted | Add Playwright smoke test for assignments navigation and page content; enhance e2e mock with realistic class overview data. |
| M30 | Teacher Assignments List API and UI Integration | Accepted | Add read-only `GET /api/v1/teacher/assignments` and display Assigned Students list on Assignment Overview page (no schema/CRUD). |
| M31 | Assigned Student Detail Navigation Links | Accepted | Link assigned student names to `/teacher/students/:id` from the assignments table. |
| M32 | Teacher Dashboard Assignments CTA | Accepted | Add dashboard CTA card linking teachers to Assignment Overview page. |
| M33 | Post-M30 Product Evidence Ledger | Accepted | Consolidate M27–M30 teacher dashboard evidence chain into traceable ledger. |
| M34 | Teacher Journey E2E Navigation Chain | Accepted | Full Playwright coverage: sidebar, dashboard CTA, assignments list, student detail navigation. |
| M35 | Teacher Student Detail Identity Display | Accepted | Show student name and learning metrics on detail page from API summary payload. |
| M36 | Teacher Dashboard Metrics Cards | Accepted | Replace dashboard placeholder with real ClassOverview stat cards. |
| M37 | Teacher Class Page Assignments Roster | Accepted | Fallback learner roster from assignments API when overview lacks student list. |
| M38 | Post-M34 Evidence Ledger Extension | Accepted | Extend evidence ledger to cover M27–M37 teacher arc (docs-only). |
| M39 | Teacher UX Regression E2E Suite | Accepted | Automated regression for M35–M37: dashboard metrics, class roster, student identity. |
| M40 | Student Summary Structured Detail | Accepted | Structured summary lines with progress modules; no [object Object] in detail list. |
| M41 | Backend Overview Students Array | Accepted | getClassOverview returns students roster array (no schema change). |
| M42 | Frontend Overview Students Integration | Accepted | ClassOverviewStudent type; class page prefers overview.students. |
| M43 | E2E Mock Students and Weak Areas | Accepted | E2E mocks align with overview.students and weakAreas data. |
| M44 | Shared TeacherStatCard Component | Accepted | DRY stat cards via TeacherStatCard/TeacherStatGrid. |
| M45 | TeacherStudentSummary API Types | Accepted | Typed fetchStudentSummary with TeacherStudentSummary interface. |
| M46 | Dashboard Weak Areas E2E | Accepted | Playwright asserts Fractions on dashboard shared stretches. |
| M47 | Class Student Progress E2E Chain | Accepted | E2E class→student navigation with Modules completed. |
| M48 | Evidence Ledger M40-M47 | Accepted | Docs-only ledger extension to M47. |
| M49 | Teacher Arc Final Regression | Accepted | Final verification: 17/17 e2e, typecheck, build. |

## Teacher Dashboard Product Arc (M26–M49)

These milestones build on each other toward a usable teacher assignment overview experience:

```text
M26  Audit + define slice ──► M27  Overview page (aggregate API)
                                    │
M28  Build verify + UX hardening ◄──┘
M29  E2e smoke coverage
M30  Dedicated assignments list API + UI
M31  Student detail links from list
M32  Dashboard CTA to assignments
M33  Evidence ledger (M27–M30)
M34  Full e2e navigation chain
M35  Student detail identity
M36  Dashboard metrics cards
M37  Class roster from assignments
M38  Evidence ledger M27–M37
M39  UX regression e2e suite
M40  Structured student summary detail
M41  Backend overview students array
M42  Frontend overview students integration
M43  E2E mock students + weak areas
M44  Shared TeacherStatCard component
M45  TeacherStudentSummary API types
M46  Dashboard weak areas e2e
M47  Class→student progress e2e
M48  Evidence ledger M40–M47
M49  Final regression (17 e2e)
```

## Milestone Goal Details (Recent)

### M26 — Product Baseline Re-engagement

- Assess actual monorepo structure vs governance docs.
- Identify feature gaps and propose **Teacher Assignment Overview Dashboard** as minimum slice.

### M27 — Teacher Assignment Overview Dashboard

- Implement read-only overview page with stat cards, grade distribution, weak areas.
- Route `/teacher/assignments`; reuse existing class overview endpoint.

### M28 — Build Verification and UX Hardening

- Prove `@educore/web` typecheck and build pass.
- Fix TS prop errors; use shared `Badge`; add sidebar discoverability.

### M29 — E2E Smoke Coverage

- Mock realistic `ClassOverview` in e2e.
- Playwright: register → sidebar Assignments → assert heading and content.

### M30 — Assignments List API and UI Integration

- Backend: `GET /assignments` returning `{ assignments: [{ studentId, studentName, gradeLevel?, assignedAt }] }`.
- Frontend: hook + Assigned Students section on overview page.
- E2e mock update and verification.

### M31 — Student Detail Navigation Links

- Student names in assignments table link to `/teacher/students/:id`.
- E2E: click student name → detail page loads.

### M32 — Dashboard Assignments CTA

- "View assignments" card on Teacher Dashboard linking to overview page.

### M33 — Evidence Ledger

- Docs-only consolidation of M27–M30 product evidence.

### M34 — E2E Navigation Chain

- Full teacher journey e2e: sidebar, dashboard CTA, student link from assignments.

### M35 — Student Detail Identity Display

- **目标**: 详情页展示学生姓名与 grade/mastery/active skills 指标
- **要求**: 解析 summary.student；e2e 断言 Emily Chen heading
- **原因**: M31 链接可达但页面身份不可辨

### M36 — Dashboard Metrics Cards

- **目标**: Dashboard 展示真实班级四格指标
- **要求**: studentCount/averageScore/grade levels/weak areas
- **原因**: 占位文案浪费已有 API 集成

### M37 — Class Page Assignments Roster

- **目标**: Class Insights 通过 assignments API 回退展示 roster
- **要求**: 可点击学生链接；不修改 backend overview
- **原因**: overview 无 roster 导致 class 页面永远空

### M38 — Evidence Ledger Extension

- **目标**: 扩展证据账本至 M37
- **要求**: docs-only；EVIDENCE_LEDGER_M27_M37
- **原因**: M33 未覆盖 M31–M37 交付物

### M39 — UX Regression E2E

- **目标**: M35–M37 自动化回归基线
- **要求**: 15/15 e2e 通过
- **原因**: 防止 teacher UX refactor 静默回归

## Canonical Review Artifacts

- Latest QA: `Docs/QA_M49_ACCEPTANCE_2026-07-06.md`
- Batch plan: `Docs/M40_M49_BATCH_PLAN_2026-07-06.md`
- Evidence ledger: `Docs/EVIDENCE_LEDGER_M27_M47_2026-07-06.md`
- Teacher handoff chain: `Docs/HANDOFF_M27_PROGRAM_DEVELOPER.md` through M39

## Boundary Reminder

- Do not authorize work outside the active dispatched program Allowed Files.
- No schema changes, assignment CRUD, or new architecture in M30 unless explicitly dispatched in a future milestone.
- Preserve accepted M27–M29 evidence as baseline for M30 review.
