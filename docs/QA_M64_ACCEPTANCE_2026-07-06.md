# QA Acceptance — M64 Volunteer Organization Onboarding

Date: 2026-07-06
Decision: Accepted
Reviewer: Controller/QA (autonomous, OVR-001)

## Acceptance Criteria Check

| AC | Description | Status | Evidence |
|---|---|---|---|
| M64-AC-1 | `OrgStatus` union (5 states) defined | PASS | `packages/types/src/volunteer-org.ts` — pending, approved, active, suspended, disabled |
| M64-AC-2 | `VolunteerOrganization` interface defined | PASS | `packages/types/src/volunteer-org.ts` — id, name, description, status, ownerId, contactEmail, contactPhone?, serviceScope[], volunteerIds[], reviewStatus, reviewedBy?, approvedAt?, createdAt, updatedAt |
| M64-AC-3 | `ServiceProject` interface defined | PASS | `packages/types/src/volunteer-org.ts` — id, organizationId, name, description, volunteerIds[], status (draft/active/completed/cancelled), startDate?, endDate?, createdAt |
| M64-AC-4 | `index.ts` NOT modified | PASS | `packages/types/src/index.ts` unchanged; export line recorded in `packages/types/src/m61_m65_exports.txt` |
| M64-AC-5 | typecheck passes | PASS | `pnpm --filter @educore/types run typecheck` — exit 0 |

## Verification Commands Executed

```
pnpm --filter @educore/types run typecheck → exit 0
```

## Known Risks

1. **No runtime org/project management yet**: Owner transfer, project lifecycle transitions, and volunteer-roster consistency checks are not implemented in this milestone; types define contracts only.
2. **`index.ts` export pending**: The `export * from "./volunteer-org.js";` line is staged in `m61_m65_exports.txt`; the parallel index.ts task must add it before consumers can import from `@educore/types`.
3. **Roster consistency not enforced in types**: `ServiceProject.volunteerIds` is not constrained to be a subset of the parent `VolunteerOrganization.volunteerIds`; downstream services must validate this invariant.
4. **`serviceScope` is a free `string[]`**: Open-ended scope strings may drift; downstream code should curate allowed scope values.

## Decision

**Accepted** — All Must Pass items have objective evidence. Volunteer organization onboarding types are defined, type-safe, and verified. The accountable-owner, review, and service-scope contract is expressible via the `VolunteerOrganization` and `ServiceProject` interfaces.
