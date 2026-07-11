# Work Order — M56 Exam Adaptation Training

## Work Order ID

`M56`

## Milestone

`M56 — Exam Adaptation Training`

## Complexity

Standard

## Task

Add variant, integrated, and exam-style practice concepts so students see broader question forms and solution patterns. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/exam.ts` with `ExamQuestionType`, `SolutionStrategy`, `ExamVariant`, `ExamTrainingSession`, `SolutionPattern`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m54_m56_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M56-R1` — Exam question type and solution strategy unions defined.
- `M56-R2` — Exam variant shape (with difficulty shift) defined.
- `M56-R3` — Exam training session and solution pattern shapes defined.
- `M56-R4` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M56-R1` Create `packages/types/src/exam.ts` with `ExamQuestionType` (7 types) and `SolutionStrategy` (8 strategies).
- [x] `M56-R2` Add `ExamVariant` interface (baseQuestionId, variantId, variantType, modifications, difficultyShift -2..2).
- [x] `M56-R3` Add `ExamTrainingSession` and `SolutionPattern` interfaces.
- [x] `M56-R4` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./exam.js";` in `packages/types/src/m54_m56_exports.txt`.

## Allowed Files

- `packages/types/src/exam.ts`
- `packages/types/src/m54_m56_exports.txt`
- `Docs/WORK_ORDER_M56.md`
- `Docs/QA_M56_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `exam.ts` exists with the required types.
- `exam.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `exam.js` is recorded in `m54_m56_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- Match existing code style (no semicolons, multi-line union types).
- `difficultyShift` uses a literal union `-2 | -1 | 0 | 1 | 2` to constrain variant difficulty adjustments.

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
