# Work Order — M75 Full Ecosystem E2E Journey

## Work Order ID

`M75`

## Milestone

`M75 — Full Ecosystem E2E Journey`

## Complexity

Standard

## Task

Define full-ecosystem end-to-end journey contracts spanning all roles (student, parent, teacher, school-admin, volunteer, volunteer-org, volunteer-enterprise). Each journey is a sequence of consent-aware, audit-logged steps with an executable result record. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/ecosystem.ts` with `EcosystemJourneyRole`, `E2EJourneyStep`, `E2EJourney`, and `E2EJourneyResult`.
- Do NOT modify `packages/types/src/index.ts` (handled by the orchestrator). Instead record the required export line in `packages/types/src/m71_m75_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M75-R1` — `EcosystemJourneyRole` union (7 roles) defined.
- `M75-R2` — `E2EJourneyStep` interface (action, outcome, verification method, consent, audit) defined.
- `M75-R3` — `E2EJourney` interface (roles, steps, lifecycle) defined.
- `M75-R4` — `E2EJourneyResult` interface (pass/fail/skip counts, per-step evidence, overall status) defined.
- `M75-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M75-R1` Create `packages/types/src/ecosystem.ts` with `EcosystemJourneyRole` (student, parent, teacher, school-admin, volunteer, volunteer-org, volunteer-enterprise).
- [x] `M75-R2` Add `E2EJourneyStep` interface (stepId, role, action, expectedOutcome, verificationMethod, consentRequired, auditLogged).
- [x] `M75-R3` Add `E2EJourney` interface (id, name, description, roles[], steps[], estimatedDuration, status).
- [x] `M75-R4` Add `E2EJourneyResult` interface (journeyId, executedAt, stepsPassed, stepsFailed, stepsSkipped, evidence[], overallStatus).
- [x] `M75-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./ecosystem.js";` in `packages/types/src/m71_m75_exports.txt`.

## Allowed Files

- `packages/types/src/ecosystem.ts`
- `packages/types/src/m71_m75_exports.txt`
- `Docs/WORK_ORDER_M75.md`
- `Docs/QA_M75_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `ecosystem.ts` exists with the required types.
- `ecosystem.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `ecosystem.js` is recorded in `m71_m75_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `EcosystemJourneyRole` unifies the role vocabulary across the full EduCore ecosystem: core education roles (student, parent, teacher, school-admin) plus social-resource roles (volunteer, volunteer-org, volunteer-enterprise). This is the integration layer that ties M71–M74 (and earlier volunteer/enterprise milestones) into a single cross-role journey.
- `E2EJourneyStep.consentRequired` and `E2EJourneyStep.auditLogged` are required booleans so every step explicitly declares its consent and audit posture. Downstream runners must block on `consentRequired` steps until consent is captured, and must emit an audit event for `auditLogged` steps.
- `verificationMethod` (`automated` | `manual` | `mixed`) tells the journey runner how to evaluate the step's `expectedOutcome`.
- `E2EJourneyResult.evidence` is a per-step array with `passed` and optional `notes`; `stepsPassed + stepsFailed + stepsSkipped` should equal `steps.length`, but the type does not enforce this invariant — runners must validate.
- `overallStatus` (`pass` | `fail` | `partial`) is the rollup: `pass` requires all non-skipped steps to pass; `partial` allows some failures; `fail` is terminal failure. Runners define the exact threshold mapping.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This milestone defines the journey *contract*; it does not implement the journey runner or any specific journey scenario. Concrete journeys are downstream concerns.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the orchestrator index.ts task can proceed.
