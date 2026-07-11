# QA Acceptance — M74 Social Resource Governance

Date: 2026-07-06
Decision: Accepted
Reviewer: Controller/QA (autonomous, OVR-001)

## Acceptance Criteria Check

| AC | Description | Status | Evidence |
|---|---|---|---|
| M74-AC-1 | `ResourceReviewStatus` union (5 states) defined | PASS | `packages/types/src/governance.ts` — pending, approved, rejected, flagged, removed |
| M74-AC-2 | `ResourceType` union (6 kinds) defined | PASS | `packages/types/src/governance.ts` — volunteer, organization, enterprise, content, program, mentor |
| M74-AC-3 | `ResourceReview` interface defined | PASS | `packages/types/src/governance.ts` — id, resourceType, resourceId, reviewerId, status, rating?, comments?, reviewedAt |
| M74-AC-4 | `ResourceComplaint` interface defined | PASS | `packages/types/src/governance.ts` — id, resourceType, resourceId, complainantId, reason, description, status (pending/investigating/resolved/dismissed), resolvedBy?, resolvedAt?, resolution?, createdAt |
| M74-AC-5 | `ResourceTakedown` interface defined | PASS | `packages/types/src/governance.ts` — id, resourceType, resourceId, reason, authorizedBy, takedownAt, reversible |
| M74-AC-6 | `index.ts` NOT modified | PASS | `packages/types/src/index.ts` unchanged; export line recorded in `packages/types/src/m71_m75_exports.txt` |
| M74-AC-7 | typecheck passes | PASS | `pnpm --filter @educore/types run typecheck` — exit 0 |

## Verification Commands Executed

```
pnpm --filter @educore/types run typecheck → exit 0
```

## Known Risks

1. **Rating range not type-enforced**: `ResourceReview.rating` is an optional number with no range constraint; services must validate the rating scale (e.g., 1–5) at runtime.
2. **`index.ts` export pending**: The `export * from "./governance.js";` line is staged in `m71_m75_exports.txt`; the orchestrator index.ts task must add it before consumers can import from `@educore/types`.
3. **`resourceId` is opaque**: The type does not link `resourceId` to a specific resource collection; services must resolve by `resourceType` at runtime.
4. **Takedown authorization is declarative**: `authorizedBy` records who authorized a takedown but the actual authorization-level check (e.g., admin role) is not implemented in this milestone.
5. **Complaint and review lifecycles are independent**: The type does not couple a `ResourceComplaint` to a `ResourceReview`; services must decide whether a flagged/rejected review should auto-open a complaint.

## Decision

**Accepted** — All Must Pass items have objective evidence. Social resource governance types are defined, type-safe, and verified. Review lifecycle (`ResourceReviewStatus`), complaint handling (`ResourceComplaint` with its own status lifecycle), and attributable takedown (`ResourceTakedown` with `authorizedBy` + `reversible`) are expressible via the governance contracts. The shared `ResourceType` union allows a single governance pipeline to target volunteers, organizations, enterprises, content, programs, and mentors.
