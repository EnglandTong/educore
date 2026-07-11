# Work Order — M66 Volunteer Teacher / School Onboarding

## Work Order ID

`M66`

## Milestone

`M66 — Volunteer Teacher / School Onboarding`

## Complexity

Standard

## Task

Onboard volunteer teachers and volunteer schools. Provide subject teaching support and school partnership with approval, content review, and service log boundaries. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/volunteer-educator.ts` with `VolunteerEducatorStatus`, `VolunteerEducatorType`, `VolunteerEducator`, and `VolunteerEducatorServiceLog`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m66_m70_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M66-R1` — `VolunteerEducatorStatus` union (5 states) defined.
- `M66-R2` — `VolunteerEducatorType` union (2 educator kinds) defined.
- `M66-R3` — `VolunteerEducator` interface (identity, review, content review, service log) defined.
- `M66-R4` — `VolunteerEducatorServiceLog` interface (service record, consent, reviewable content) defined.
- `M66-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M66-R1` Create `packages/types/src/volunteer-educator.ts` with `VolunteerEducatorStatus` (pending, approved, active, suspended, disabled).
- [x] `M66-R2` Add `VolunteerEducatorType` (volunteer-teacher, volunteer-school).
- [x] `M66-R3` Add `VolunteerEducator` interface (id, userId, educatorType, status, schoolId?, subjects[], gradeLevels[], reviewStatus, reviewedBy?, contentReviewRequired, serviceLogEnabled, createdAt, updatedAt).
- [x] `M66-R4` Add `VolunteerEducatorServiceLog` interface (id, educatorId, serviceType, description, durationMinutes, date, studentIds?, consentVerified, reviewableContent).
- [x] `M66-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./volunteer-educator.js";` in `packages/types/src/m66_m70_exports.txt`.

## Allowed Files

- `packages/types/src/volunteer-educator.ts`
- `packages/types/src/m66_m70_exports.txt`
- `Docs/WORK_ORDER_M66.md`
- `Docs/QA_M66_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `volunteer-educator.ts` exists with the required types.
- `volunteer-educator.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `volunteer-educator.js` is recorded in `m66_m70_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `contentReviewRequired` encodes whether content produced by this educator must go through review before publishing — downstream services should treat `true` as a hard gate before any student-visible content.
- `serviceLogEnabled` controls whether service logs are collected for this educator; when `false`, services must not create `VolunteerEducatorServiceLog` records.
- `VolunteerEducatorServiceLog.consentVerified` mirrors the consent pattern (M62/M65) — every service log involving students requires verified consent.
- `reviewableContent` flags whether the service log content is subject to review (e.g., transcripts, recordings).
- This milestone is distinct from M64 (volunteer organizations) and M65 (volunteer enterprises): educators provide teaching/school partnership; organizations coordinate volunteer service; enterprises offer industry/career programs.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the parallel index.ts task can proceed.
