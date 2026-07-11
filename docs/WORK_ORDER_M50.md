# WORK_ORDER_M50 - System Vision Rebaseline

Status: Draft / Ready for Controller Planning Review
Created: 2026-07-06
Source: Codex Plan Mode SPEC v0.3
Latest accepted baseline: M49 - Teacher Arc M40-M49 Final Regression

## Handoff Rule

This plan was generated from the EduCore SPEC v0.3 request. Any Agent must treat this work order as the only task source for M50. Each loop must perform exactly one bounded docs task, record evidence, update loop state, and hand off with commands, results, evidence paths, skipped checks, and risks.

Completion is judged only by `Docs/ACCEPTANCE.md` evidence gates, not by chat assertions.

## Milestone Goal

M50 rebaselines EduCore from an adaptive learning MVP toward an equal learning and growth ecosystem platform. It is a docs-only planning milestone. It must not implement volunteer, enterprise, mentorship, matching, production, schema, or runtime product features.

## Allowed Files

- `Docs/TARGET.md`
- `Docs/ACCEPTANCE.md`
- `Docs/STOP_RULES.md`
- `Docs/LOOP_CONFIG.md`
- `Docs/WORK_ORDER_M50.md`
- `Docs/PROJECT_ROADMAP.md`
- Existing loop/status docs if a future Controller dispatch explicitly requires status synchronization

## Not Allowed Files

- `apps/`
- `packages/`
- `modules/`
- database schema or migrations
- deployment files
- production credential files
- files outside `D:\Development\EduCore`

## Relative Goals

### M50-R1 - Update System Goal and Service Ecosystem

- [ ] Goal: write the equal learning and growth ecosystem target into `Docs/TARGET.md`.
- [ ] Files: `Docs/TARGET.md`
- [ ] Acceptance: User Goal, service ecosystem, Success Criteria, Non-Goals, evidence categories, failure examples, and M49 baseline are present.
- [ ] Dependency: M49 Accepted
- [ ] Reasoning level: Standard

### M50-R2 - Update Acceptance Gates

- [ ] Goal: add fairness, student protection, volunteer governance, and evidence requirements to `Docs/ACCEPTANCE.md`.
- [ ] Files: `Docs/ACCEPTANCE.md`
- [ ] Acceptance: Must Pass, Should Pass, Manual Confirmation, Known Exclusions, Current evidence placeholders, and failure/blocked policy are clear.
- [ ] Dependency: M50-R1
- [ ] Reasoning level: Standard

### M50-R3 - Update Stop Rules

- [ ] Goal: add hard stops for student protection, volunteer contact, enterprise contact, production data, secrets, architecture changes, and out-of-repo work.
- [ ] Files: `Docs/STOP_RULES.md`
- [ ] Acceptance: Hard Stops, Student Protection Stops, Volunteer / Enterprise Governance Stops, Budget Stops, and Project-Specific Stops are executable.
- [ ] Dependency: M50-R2
- [ ] Reasoning level: Standard

### M50-R4 - Publish M51-M80 Roadmap Entry

- [ ] Goal: record the long-term milestone roadmap from M51 through M80.
- [ ] Files: `Docs/WORK_ORDER_M50.md`, `Docs/PROJECT_ROADMAP.md`
- [ ] Acceptance: each milestone has use, goal, and requirement; roadmap does not authorize implementation beyond M50 docs-only scope.
- [ ] Dependency: M50-R3
- [ ] Reasoning level: Standard

## Roadmap Summary

| Milestone | Use | Goal | Requirement |
|---|---|---|---|
| M50 - System Vision Rebaseline | Align final direction | Define EduCore as an equal learning and growth ecosystem platform | Update target, non-goals, service ecosystem, and acceptance principles |
| M51 - Role & Permission Model | Define actors | Model students, parents, schools, teachers, volunteers, organizations, enterprises, volunteer teachers, and volunteer schools | Each role has permissions, visible data, and forbidden actions |
| M52 - Student Protection & Consent | Protect students | Define parent/school consent, student-contact boundaries, and audit rules | No direct student contact without authorization and traceability |
| M53 - Fair Opportunity Principles | Prevent labeling | Define equal treatment and opportunity fairness | No negative labels by region, poverty, or school resources |
| M54 - Learning Content Taxonomy | Expand question exposure | Define question type, knowledge point, difficulty, and exam scenario taxonomy | Supports diverse and extensible practice |
| M55 - Adaptive Practice Expansion | Improve learning | Expand diagnostic, practice, wrong-answer, and spaced repetition paths | Algorithms and learning flow have automated tests |
| M56 - Exam Adaptation Training | Improve exam readiness | Add variant, integrated, and exam-style practice concepts | Students see broader question forms and solution patterns |
| M57 - Student Growth Portfolio | Track growth | Record ability, interest, weak areas, and progress | Reports are explainable and non-judgmental |
| M58 - Teacher Insight Bridge | Connect learning to teaching | Convert learning data into teacher-actionable insight | Teachers see class, student, weak-area, and next-action signals |
| M59 - Parent View MVP | Support parents | Give parents understandable progress and support direction | Warm, explainable, non-ranking information |
| M60 - School View MVP | Support schools | Show school-level learning support summaries | Necessary aggregate visibility only |
| M61 - Teacher Intervention Workflow | Close teacher action loop | Let teachers plan review and follow-up from data | Suggestions have source, action, and follow-up record |
| M62 - Home-School Communication Log | Track collaboration | Record parent, teacher, and school communication | Permissions, timestamps, and boundaries exist |
| M63 - Volunteer Registry | Onboard volunteers | Record volunteer identity, domain, and support type | Auditable, reviewable, enable/disable capable |
| M64 - Volunteer Organization Onboarding | Onboard organizations | Let organizations manage volunteers and service projects | Accountable owner, review process, service scope |
| M65 - Volunteer Enterprise Onboarding | Onboard enterprises | Let enterprises provide industry intro, practice opportunities, and cultivation programs | Approval, safety, and fairness boundaries |
| M66 - Volunteer Teacher / School Onboarding | Onboard volunteer educators | Let volunteer teachers and schools support learning | Content is reviewable and service is recorded |
| M67 - Safe Matching Engine | Match safely | Match resources by need, interest, and authorization state | No unauthorized match; reason is explainable |
| M68 - Mentorship Session MVP | Enable mentorship | Support mentor sharing, Q&A, and learning companionship | Scheduling, records, feedback, and reporting |
| M69 - Industry Exposure Library | Build industry awareness | Represent industries, roles, environments, and skill needs | Trusted, reviewed, updatable content |
| M70 - School & Major Guidance | Support choices | Help students understand schools, majors, and career paths | Real experience, not single-decision replacement |
| M71 - Real Work Environment Exposure | Show real work | Expose work modes, projects, and environments | Videos, interviews, visit records, or cases |
| M72 - Student Interest & Talent Signals | Discover potential | Record interest, effort, performance, and outcomes | Explainable, reviewable, non-discriminatory signals |
| M73 - Enterprise Talent Cultivation Path | Support talent cultivation | Let enterprises support students inside governance boundaries | Parent/school authorization and transparent records |
| M74 - Social Resource Governance | Govern resources | Manage quality, risk, and service records | Review, rating, complaint, and takedown mechanisms |
| M75 - Full Ecosystem E2E Journey | Verify full journey | Cover student, parent, teacher, school, volunteer, and enterprise paths | Automated and functional evidence for key journeys |
| M76 - Pilot Readiness Pack | Prepare pilot | Package school or regional pilot materials | Runbook, risks, acceptance criteria, data boundaries |
| M77 - Pilot Feedback Loop | Learn from pilot | Collect feedback and drive improvements | Issue list, priority, and next work orders |
| M78 - Long-Term Impact Dashboard | Measure impact | Track learning gains, opportunity coverage, and participation | Metrics include practice, adaptation, awareness, growth |
| M79 - Privacy, Audit & Compliance Hardening | Harden compliance | Strengthen data protection, audit, permissions, deletion, and export | Student data is auditable, limited, and accountable |
| M80 - National Talent Development Evidence Pack | Package final evidence | Prove contribution to education quality and talent development | Evidence covers learning, teacher, family/school, volunteer, industry, and talent paths |

## Verification Commands

- `Select-String -LiteralPath .\Docs\TARGET.md -Pattern "equal learning","Service Ecosystem","M49","Non-Goals","Failure Examples"`
- `Select-String -LiteralPath .\Docs\ACCEPTANCE.md -Pattern "Must Pass","Student protection","Fairness","M49","Known Exclusions"`
- `Select-String -LiteralPath .\Docs\STOP_RULES.md -Pattern "Hard Stops","Student Protection","Volunteer","Enterprise","max_consecutive_failures"`
- `Select-String -LiteralPath .\Docs\WORK_ORDER_M50.md -Pattern "M50-R1","M50-R2","M50-R3","M50-R4","M80"`
- `Select-String -LiteralPath .\Docs\PROJECT_ROADMAP.md -Pattern "M50","M80","National Talent Development"`

## Expected Developer Handoff

Developer handoff must include:

- Changed files
- Commands run
- Results
- Manual checks
- Skipped checks and reasons
- Known risks
- Final state: Developer Complete, Ready for Controller/QA Review, Blocked, or Failed / Needs Fix

Developer must not mark M50 Accepted or Completed.
