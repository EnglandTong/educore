# Work Order — M61 Teacher Intervention Workflow

## Work Order ID

`M61`

## Milestone

`M61 — Teacher Intervention Workflow`

## Complexity

Standard

## Task

Close the teacher action loop. Let teachers plan review and follow-up from data. Suggestions have source, action, and follow-up record. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/intervention.ts` with `InterventionStatus`, `InterventionType`, and `TeacherIntervention`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m61_m65_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M61-R1` — `InterventionStatus` union (5 states) defined.
- `M61-R2` — `InterventionType` union (5 intervention kinds) defined.
- `M61-R3` — `TeacherIntervention` interface (source, action, follow-up record) defined.
- `M61-R4` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M61-R1` Create `packages/types/src/intervention.ts` with `InterventionStatus` (suggested, planned, in-progress, completed, cancelled).
- [x] `M61-R2` Add `InterventionType` (review-session, extra-practice, parent-contact, skill-retarget, group-activity).
- [x] `M61-R3` Add `TeacherIntervention` interface (id, teacherId, studentId, interventionType, status, source, action, followUpDate, followUpNote?, createdAt, updatedAt).
- [x] `M61-R4` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./intervention.js";` in `packages/types/src/m61_m65_exports.txt`.

## Allowed Files

- `packages/types/src/intervention.ts`
- `packages/types/src/m61_m65_exports.txt`
- `Docs/WORK_ORDER_M61.md`
- `Docs/QA_M61_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `intervention.ts` exists with the required types.
- `intervention.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `intervention.js` is recorded in `m61_m65_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `source` is a free `string` so any data-driven origin (dashboard metric, weak-area alert, manual note) can be recorded.
- `followUpNote` is optional; `followUpDate` is required to force a concrete follow-up commitment.

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
