# Work Order — M59 Parent View MVP

## Work Order ID

`M59`

## Milestone

`M59 — Parent View MVP`

## Complexity

Standard

## Task

Support parents. Give parents understandable progress and support direction. Warm, explainable, non-ranking information. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/parent-view.ts` with `ParentDashboardData`, `ParentProgressReport`.
- Do NOT modify `packages/types/src/index.ts` (orchestrator owns it). Record the required export line in `packages/types/src/m57_m60_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M59-R1` — `ParentDashboardData` interface (children array with progressSummary, strengths, supportSuggestions) defined.
- `M59-R2` — `ParentProgressReport` interface (subjectProgress with status, encouragementNote) defined.
- `M59-R3` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M59-R1` Create `packages/types/src/parent-view.ts` with `ParentDashboardData` (parentId, children[] with childId, childName, gradeLevel?, progressSummary, strengths, supportSuggestions, lastActiveDate?).
- [x] `M59-R2` Add `ParentProgressReport` (childId, childName, overallProgress, subjectProgress[], encouragementNote, generatedAt).
- [x] `M59-R3` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./parent-view.js";` in `packages/types/src/m57_m60_exports.txt`.

## Allowed Files

- `packages/types/src/parent-view.ts`
- `packages/types/src/m57_m60_exports.txt`
- `Docs/WORK_ORDER_M59.md`
- `Docs/QA_M59_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `parent-view.ts` exists with the required types.
- `parent-view.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `parent-view.js` is recorded in `m57_m60_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses ESM).
- Match existing code style (no semicolons, multi-line union types).
- `status` uses supportive framing: "on-track", "needs-support", "excelling" — no ranking or comparative labels.
- `encouragementNote` keeps tone warm and non-judgmental.

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
