# Work Order — M73 Enterprise Talent Cultivation Path

## Work Order ID

`M73`

## Milestone

`M73 — Enterprise Talent Cultivation Path`

## Complexity

Standard

## Task

Define enterprise-led talent cultivation paths with staged milestones, capacity, enrollment, dual authorization (parent + school), and transparent records. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/cultivation.ts` with `CultivationStatus`, `CultivationPath`, and `CultivationEnrollment`.
- Do NOT modify `packages/types/src/index.ts` (handled by the orchestrator). Instead record the required export line in `packages/types/src/m71_m75_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M73-R1` — `CultivationStatus` union (6 lifecycle states) defined.
- `M73-R2` — `CultivationPath` interface (stages, capacity, authorization flags, transparent records) defined.
- `M73-R3` — `CultivationEnrollment` interface (dual consent, current stage, progress notes) defined.
- `M73-R4` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M73-R1` Create `packages/types/src/cultivation.ts` with `CultivationStatus` (draft, open, enrolled, in-progress, completed, cancelled).
- [x] `M73-R2` Add `CultivationPath` interface (id, enterpriseId, name, description, stages[], capacity, enrolledStudentIds[], status, parentAuthorizationRequired, schoolAuthorizationRequired, transparentRecords, createdAt, updatedAt).
- [x] `M73-R3` Add `CultivationEnrollment` interface (id, pathId, studentId, parentConsentVerified, schoolConsentVerified, enrolledAt, currentStage, progressNotes[], status).
- [x] `M73-R4` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./cultivation.js";` in `packages/types/src/m71_m75_exports.txt`.

## Allowed Files

- `packages/types/src/cultivation.ts`
- `packages/types/src/m71_m75_exports.txt`
- `Docs/WORK_ORDER_M73.md`
- `Docs/QA_M73_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `cultivation.ts` exists with the required types.
- `cultivation.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `cultivation.js` is recorded in `m71_m75_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `parentAuthorizationRequired` and `schoolAuthorizationRequired` are required booleans on the path so enterprises declare upfront which authorizations are mandatory. `CultivationEnrollment` then carries `parentConsentVerified` and `schoolConsentVerified` so each enrollment records the captured consent state.
- `transparentRecords` is a required boolean encoding the transparency boundary: a cultivation path must declare whether progress records are visible to the student/parent/school. Downstream code should reject opaque-by-default paths unless explicitly justified.
- `stages` is an inline array of `{ name, description, duration, milestones[] }`; `currentStage` on the enrollment is a zero-based index. The type does not enforce `0 <= currentStage < stages.length`; services must validate bounds.
- `capacity` plus `enrolledStudentIds[]` mirrors the M65 `EnterpriseProgram` pattern; services must enforce `enrolledStudentIds.length <= capacity` at runtime.
- `CultivationStatus` is shared by both `CultivationPath` and `CultivationEnrollment`. On the path it reflects program availability; on the enrollment it reflects an individual student's progress.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This milestone defines cultivation *paths* and *enrollments*; it is distinct from M65 (enterprise onboarding) and M71 (work exposure content). M65 onboards the enterprise; M73 defines a multi-stage cultivation program offered by an onboarded enterprise.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the orchestrator index.ts task can proceed.
