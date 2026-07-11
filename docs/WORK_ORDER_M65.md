# Work Order — M65 Volunteer Enterprise Onboarding

## Work Order ID

`M65`

## Milestone

`M65 — Volunteer Enterprise Onboarding`

## Complexity

Standard

## Task

Onboard enterprises. Let enterprises provide industry intro, practice opportunities, and cultivation programs. Approval, safety, and fairness boundaries. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/volunteer-enterprise.ts` with `EnterpriseStatus`, `EnterpriseProgramType`, `VolunteerEnterprise`, and `EnterpriseProgram`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m61_m65_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M65-R1` — `EnterpriseStatus` union (5 states) defined.
- `M65-R2` — `EnterpriseProgramType` union (6 program kinds) defined.
- `M65-R3` — `VolunteerEnterprise` interface (owner, approval, safety, fairness) defined.
- `M65-R4` — `EnterpriseProgram` interface (capacity, enrollment, consent, lifecycle) defined.
- `M65-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M65-R1` Create `packages/types/src/volunteer-enterprise.ts` with `EnterpriseStatus` (pending, approved, active, suspended, disabled).
- [x] `M65-R2` Add `EnterpriseProgramType` (industry-intro, internship, mentorship, cultivation, scholarship, site-visit).
- [x] `M65-R3` Add `VolunteerEnterprise` interface (id, name, industry, description, status, ownerId, contactEmail, contactPhone?, programTypes[], reviewStatus, reviewedBy?, approvedAt?, safetyCheckPassed, fairnessAgreementSigned, createdAt, updatedAt).
- [x] `M65-R4` Add `EnterpriseProgram` interface (id, enterpriseId, name, programType, description, capacity, enrolledStudentIds[], consentRequired, status, startDate?, endDate?, createdAt).
- [x] `M65-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./volunteer-enterprise.js";` in `packages/types/src/m61_m65_exports.txt`.

## Allowed Files

- `packages/types/src/volunteer-enterprise.ts`
- `packages/types/src/m61_m65_exports.txt`
- `Docs/WORK_ORDER_M65.md`
- `Docs/QA_M65_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `volunteer-enterprise.ts` exists with the required types.
- `volunteer-enterprise.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `volunteer-enterprise.js` is recorded in `m61_m65_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `safetyCheckPassed` and `fairnessAgreementSigned` are required booleans — they encode the safety and fairness boundaries explicitly so an enterprise cannot be active without both. Downstream code should treat `false` on either as a hard block.
- `programTypes` on the enterprise declares what it is approved to offer; each `EnterpriseProgram.programType` is single-valued and should be a member of the enterprise's declared set.
- `capacity` (number) plus `enrolledStudentIds[]` lets downstream code enforce enrollment limits; the type does not enforce `enrolledStudentIds.length <= capacity`, so services must validate.
- `consentRequired` mirrors the home-school communication consent pattern (M62) for student-facing program enrollment.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This milestone is distinct from M64 (volunteer organizations): enterprises offer industry/career programs; organizations coordinate volunteer service. The two contracts are intentionally separate.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the parallel index.ts task can proceed.
