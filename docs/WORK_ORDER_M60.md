# Work Order — M60 School View MVP

## Work Order ID

`M60`

## Milestone

`M60 — School View MVP`

## Complexity

Standard

## Task

Support schools. Show school-level learning support summaries. Necessary aggregate visibility only. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/school-view.ts` with `SchoolDashboardData`, `SchoolClassSummary`.
- Do NOT modify `packages/types/src/index.ts` (orchestrator owns it). Record the required export line in `packages/types/src/m57_m60_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M60-R1` — `SchoolDashboardData` interface (gradeLevelSummaries with averageProgress, topStrengths, needsSupportAreas) defined.
- `M60-R2` — `SchoolClassSummary` interface (classProgress, notableAchievements) defined.
- `M60-R3` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M60-R1` Create `packages/types/src/school-view.ts` with `SchoolDashboardData` (schoolId, schoolName, totalStudents, totalTeachers, gradeLevelSummaries[]).
- [x] `M60-R2` Add `SchoolClassSummary` (classId, teacherName, studentCount, classProgress, notableAchievements).
- [x] `M60-R3` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./school-view.js";` in `packages/types/src/m57_m60_exports.txt`.

## Allowed Files

- `packages/types/src/school-view.ts`
- `packages/types/src/m57_m60_exports.txt`
- `Docs/WORK_ORDER_M60.md`
- `Docs/QA_M60_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `school-view.ts` exists with the required types.
- `school-view.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `school-view.js` is recorded in `m57_m60_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses ESM).
- Match existing code style (no semicolons, multi-line union types).
- School view exposes only necessary aggregates; no individual student PII at this layer.
- `averageProgress` and `classProgress` are descriptive strings (not numeric rankings) to avoid league-table effects.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.

## Verification Commands

- `pnpm --filter @educore/types run build`
- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the orchestrator index.ts task can proceed.
