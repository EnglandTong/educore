# Post-M30 Teacher Product Evidence Ledger

Date: 2026-07-01
Scope: M27 through M30 teacher assignment dashboard arc
Status: Active

---

## Chain Summary

| Milestone | Goal | Accepted | Key Evidence |
|---|---|---|---|
| M27 | Assignment Overview page (aggregate API) | 2026-06-30 | HANDOFF_M27, AssignmentOverviewPage |
| M28 | Build verify + UX hardening | 2026-07-01 | typecheck/build, Badge, sidebar link |
| M29 | E2E smoke coverage | 2026-07-01 | QA_M29, 12/12 e2e |
| M30 | Assignments list API + UI | 2026-07-01 | QA_M30, GET /assignments |

## Product Artifacts

- Route: `/teacher/assignments` — AssignmentOverviewPage
- API: `GET /api/v1/teacher/class/overview`, `GET /api/v1/teacher/assignments`
- Hooks: `useTeacherClassOverview`, `useTeacherAssignments`
- E2E: teacher-journey assignments + student link + dashboard CTA tests

## Verification Baseline

```powershell
corepack pnpm --filter @educore/web run typecheck
corepack pnpm --filter @educore/web run build
corepack pnpm --filter @educore/web run test:e2e
```

Latest: 13/13 passed (2026-07-01)

## Open Follow-ups (post-M34)

- TeacherStudentPage could surface `student.name` from summary payload
- Assignment CRUD remains out of scope per TARGET.md
