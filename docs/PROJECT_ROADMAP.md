# Project Roadmap

Status: Active
Last updated: 2026-07-01T19:15:00+08:00

## Current Position

- Current milestone: `M30 - Teacher Assignments List API and UI Integration` (Dispatched)
- Latest accepted milestone: `M29 - Teacher Assignment Overview E2E Smoke Coverage`
- Current mode: Developer executing M30 Program
- Active work order: `P30-01`
- Next action after M30: Controller/QA acceptance review, then plan M31

## Milestone Goals (M14–M30)

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
| M30 | Teacher Assignments List API and UI Integration | Dispatched | Add read-only `GET /api/v1/teacher/assignments` and display Assigned Students list on Assignment Overview page (no schema/CRUD). |

## Teacher Dashboard Product Arc (M26–M30)

These milestones build on each other toward a usable teacher assignment overview experience:

```text
M26  Audit + define slice ──► M27  Overview page (aggregate API)
                                    │
M28  Build verify + UX hardening ◄──┘
M29  E2e smoke coverage
M30  Dedicated assignments list API + UI
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

## Canonical Review Artifacts

- Latest QA: `Docs/QA_M29_ACCEPTANCE_2026-07-01.md`
- Active dispatch: `Docs/DISPATCH_M30_PROGRAM_TO_DEVELOPER.md`
- Teacher handoff chain: `Docs/HANDOFF_M27_PROGRAM_DEVELOPER.md` through M29

## Boundary Reminder

- Do not authorize work outside the active dispatched program Allowed Files.
- No schema changes, assignment CRUD, or new architecture in M30 unless explicitly dispatched in a future milestone.
- Preserve accepted M27–M29 evidence as baseline for M30 review.
