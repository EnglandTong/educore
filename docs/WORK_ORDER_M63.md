# Work Order — M63 Volunteer Registry

## Work Order ID

`M63`

## Milestone

`M63 — Volunteer Registry`

## Complexity

Standard

## Task

Onboard volunteers. Record volunteer identity, domain, and support type. Auditable, reviewable, enable/disable capable. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/volunteer-registry.ts` with `VolunteerStatus`, `VolunteerSupportType`, `VolunteerDomain`, and `VolunteerRecord`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m61_m65_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M63-R1` — `VolunteerStatus` union (5 states) defined.
- `M63-R2` — `VolunteerSupportType` union (6 support kinds) defined.
- `M63-R3` — `VolunteerDomain` union (8 domains) defined.
- `M63-R4` — `VolunteerRecord` interface (review, background check, enable/disable) defined.
- `M63-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M63-R1` Create `packages/types/src/volunteer-registry.ts` with `VolunteerStatus` (pending, approved, active, suspended, disabled).
- [x] `M63-R2` Add `VolunteerSupportType` (qa, content, mentorship, teaching, industry-intro, resource-provision).
- [x] `M63-R3` Add `VolunteerDomain` (math, science, english, chinese, arts, technology, career-guidance, general).
- [x] `M63-R4` Add `VolunteerRecord` interface (id, userId, status, supportTypes[], domain, organizationId?, reviewStatus, reviewedBy?, reviewedAt?, backgroundCheckStatus?, enabled, createdAt, updatedAt).
- [x] `M63-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./volunteer-registry.js";` in `packages/types/src/m61_m65_exports.txt`.

## Allowed Files

- `packages/types/src/volunteer-registry.ts`
- `packages/types/src/m61_m65_exports.txt`
- `Docs/WORK_ORDER_M63.md`
- `Docs/QA_M63_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `volunteer-registry.ts` exists with the required types.
- `volunteer-registry.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `volunteer-registry.js` is recorded in `m61_m65_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `status` and `enabled` are intentionally separate: `status` is the lifecycle/review state, `enabled` is the runtime kill-switch. A disabled record stays auditable while being inactive.
- `reviewStatus` and `backgroundCheckStatus` are independent tracks so a volunteer can pass review yet still be pending a background check.
- `supportTypes` is an array (a volunteer may offer multiple support kinds) while `domain` is single-valued to keep primary expertise explicit.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This file (`volunteer-registry.ts`) is distinct from the existing `apps/api/src/models/VolunteerProfile.ts` Mongoose model; the shared type here is the platform contract.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the parallel index.ts task can proceed.
