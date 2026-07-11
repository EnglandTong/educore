# TARGET - EduCore

Status: M50 Planning Baseline
Last updated: 2026-07-06
Latest accepted baseline: M49 - Teacher Arc M40-M49 Final Regression

## User Goal

EduCore is evolving from an adaptive learning MVP into an equal learning and growth ecosystem platform.

The system should give all students fairer access to practice, learning support, real-world awareness, school and major guidance, volunteer mentorship, and future development opportunities. EduCore must treat students equally, avoid negative labels based on region, poverty, or school resources, and support national talent development by raising the overall level of student capability, awareness, and adaptability.

## Service Ecosystem

EduCore serves and connects:

- Students
- Parents
- Students' schools
- School teachers and school administrators
- Volunteers
- Volunteer organizations
- Volunteer enterprises
- Volunteer teachers
- Volunteer schools

## Success Criteria

- [ ] Students can access diverse question types, practice modes, diagnostics, review flows, and growth feedback.
- [ ] Teachers can review class, assignment, student detail, weak-area, and progress signals without losing the accepted M27-M49 teacher baseline.
- [ ] Parents and schools can understand student progress in a warm, explainable, non-judgmental way.
- [ ] Volunteer resources can be planned through auditable, permissioned, and student-safe workflows before any direct student interaction is implemented.
- [ ] Industry exposure, school/major guidance, mentorship, and talent-development paths are represented in the roadmap with clear safety and governance gates.
- [ ] All future work is split into bounded Milestones / Programs / Work Orders with objective evidence, commands, timestamps, and handoffs.
- [ ] M49 verification baseline remains intact: typecheck PASS, build PASS, e2e 17/17 PASS.

## Non-Goals

- No production deployment signoff in M50.
- No production secrets, private keys, OAuth credentials, Supabase secrets, or cloud credentials.
- No real production data, real customer data, or unauthorized external resource access.
- No schema migration unless a later milestone explicitly authorizes it.
- No assignment CRUD unless a later milestone explicitly authorizes it.
- No volunteer, enterprise, mentor, matching, or student-contact feature implementation in M50.
- No new architecture, new subsystem, or shared layer without Owner approval.
- No work outside `D:\Development\EduCore`.
- No self-acceptance by Developer; Controller/QA owns final acceptance.

## Acceptance Evidence Categories

- Automatic verification: typecheck, build, test, e2e, lint where defined by the active work order.
- Functional verification: UI flow, API behavior, role-boundary scenario, mock journey, or documented manual scenario.
- Review/documentation evidence: updated `Docs/` contracts, work orders, handoffs, QA acceptance records, loop logs, and evidence ledgers.
- Safety evidence: student protection, consent, role permission, auditability, volunteer governance, and stop-rule coverage.
- Fairness evidence: no negative labeling by region, poverty, school resources, or background; warm and explainable student-facing copy.

## Failure Examples

- A milestone is marked done without objective evidence in `Docs/ACCEPTANCE.md`.
- A command times out, fails, or produces no success output but is recorded as PASS.
- Student-facing copy shames, ranks, labels, or discourages students.
- A plan allows volunteer, enterprise, mentor, or school contact with students without consent and audit boundaries.
- A plan expands architecture, schema, production deployment, or credentials beyond the active milestone.
- A Developer marks a milestone `Accepted` or `Completed` without Controller/QA signoff.
- Any change lowers or obscures the M49 baseline: typecheck PASS, build PASS, e2e 17/17 PASS.

## Roadmap Direction

M50 starts with a docs-only rebaseline. M51-M80 progressively cover role permissions, student protection, fairness, learning expansion, family/school collaboration, volunteer resource onboarding, mentorship, industry exposure, talent signals, pilot readiness, impact measurement, privacy, and final evidence packaging.
