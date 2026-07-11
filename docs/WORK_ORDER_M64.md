# Work Order — M64 Volunteer Organization Onboarding

## Work Order ID

`M64`

## Milestone

`M64 — Volunteer Organization Onboarding`

## Complexity

Standard

## Task

Onboard organizations. Let organizations manage volunteers and service projects. Accountable owner, review process, service scope. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/volunteer-org.ts` with `OrgStatus`, `VolunteerOrganization`, and `ServiceProject`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m61_m65_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M64-R1` — `OrgStatus` union (5 states) defined.
- `M64-R2` — `VolunteerOrganization` interface (owner, review, scope, volunteers) defined.
- `M64-R3` — `ServiceProject` interface (org-scoped project with volunteers and lifecycle) defined.
- `M64-R4` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M64-R1` Create `packages/types/src/volunteer-org.ts` with `OrgStatus` (pending, approved, active, suspended, disabled).
- [x] `M64-R2` Add `VolunteerOrganization` interface (id, name, description, status, ownerId, contactEmail, contactPhone?, serviceScope[], volunteerIds[], reviewStatus, reviewedBy?, approvedAt?, createdAt, updatedAt).
- [x] `M64-R3` Add `ServiceProject` interface (id, organizationId, name, description, volunteerIds[], status, startDate?, endDate?, createdAt).
- [x] `M64-R4` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./volunteer-org.js";` in `packages/types/src/m61_m65_exports.txt`.

## Allowed Files

- `packages/types/src/volunteer-org.ts`
- `packages/types/src/m61_m65_exports.txt`
- `Docs/WORK_ORDER_M64.md`
- `Docs/QA_M64_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `volunteer-org.ts` exists with the required types.
- `volunteer-org.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `volunteer-org.js` is recorded in `m61_m65_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `ownerId` makes a single account accountable for the organization — required, not optional, so there is always a responsible party.
- `serviceScope` is a free-form `string[]` so organizations can declare scope (subjects, grades, regions) without a closed enum constraint at the type layer.
- `ServiceProject` carries its own `status` lifecycle separate from the organization so a project can be completed while the org remains active.
- `volunteerIds` on both interfaces enables org-level rostering and project-level assignment; downstream code must keep the project subset consistent with the org roster.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- References `VolunteerRecord` from M63 conceptually (via shared `volunteerIds` string IDs) but does not import it — IDs are plain strings to keep the type modules decoupled.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the parallel index.ts task can proceed.
