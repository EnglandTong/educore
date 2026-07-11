# Work Order — M74 Social Resource Governance

## Work Order ID

`M74`

## Milestone

`M74 — Social Resource Governance`

## Complexity

Standard

## Task

Define governance for social resources (volunteers, organizations, enterprises, content, programs, mentors): review lifecycle, complaint handling, and authorized takedown. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/governance.ts` with `ResourceReviewStatus`, `ResourceType`, `ResourceReview`, `ResourceComplaint`, and `ResourceTakedown`.
- Do NOT modify `packages/types/src/index.ts` (handled by the orchestrator). Instead record the required export line in `packages/types/src/m71_m75_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M74-R1` — `ResourceReviewStatus` union (5 states) defined.
- `M74-R2` — `ResourceType` union (6 resource kinds) defined.
- `M74-R3` — `ResourceReview` interface (reviewer, rating, comments) defined.
- `M74-R4` — `ResourceComplaint` interface (complainant, reason, investigation lifecycle, resolution) defined.
- `M74-R5` — `ResourceTakedown` interface (authorized-by, reversibility) defined.
- `M74-R6` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M74-R1` Create `packages/types/src/governance.ts` with `ResourceReviewStatus` (pending, approved, rejected, flagged, removed).
- [x] `M74-R2` Add `ResourceType` (volunteer, organization, enterprise, content, program, mentor).
- [x] `M74-R3` Add `ResourceReview` interface (id, resourceType, resourceId, reviewerId, status, rating?, comments?, reviewedAt).
- [x] `M74-R4` Add `ResourceComplaint` interface (id, resourceType, resourceId, complainantId, reason, description, status, resolvedBy?, resolvedAt?, resolution?, createdAt).
- [x] `M74-R5` Add `ResourceTakedown` interface (id, resourceType, resourceId, reason, authorizedBy, takedownAt, reversible).
- [x] `M74-R6` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./governance.js";` in `packages/types/src/m71_m75_exports.txt`.

## Allowed Files

- `packages/types/src/governance.ts`
- `packages/types/src/m71_m75_exports.txt`
- `Docs/WORK_ORDER_M74.md`
- `Docs/QA_M74_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `governance.ts` exists with the required types.
- `governance.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `governance.js` is recorded in `m71_m75_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `ResourceType` is shared across review, complaint, and takedown so a single governance pipeline can target any social resource kind. The `resourceId` is opaque (string) and must be resolved against the correct resource collection by `resourceType` at runtime.
- `ResourceReviewStatus` covers the full review lifecycle including `flagged` (suspicious but not yet rejected) and `removed` (post-removal terminal state).
- `ResourceComplaint.status` is a separate lifecycle (`pending` → `investigating` → `resolved` | `dismissed`) distinct from `ResourceReviewStatus`, because a complaint investigation is a different process from an editorial review.
- `ResourceTakedown.authorizedBy` is required so every removal is attributable; `reversible` declares whether the takedown can be undone, supporting both hard and soft removals.
- `rating` on `ResourceReview` is optional and unbounded (number) — services should validate the rating range (e.g., 1–5) at runtime.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This milestone defines governance *processes* (review, complaint, takedown); it does not define the resources themselves. Volunteer/organization/enterprise resources are defined in M62–M65.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the orchestrator index.ts task can proceed.
