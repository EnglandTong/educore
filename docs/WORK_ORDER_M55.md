# Work Order — M55 Adaptive Practice Expansion

## Work Order ID

`M55`

## Milestone

`M55 — Adaptive Practice Expansion`

## Complexity

Standard

## Task

Expand diagnostic, practice, wrong-answer, and spaced repetition paths with shared types so algorithms and learning flows can be built on a type-safe foundation.

## Scope

- Add `packages/types/src/adaptive.ts` with `PracticeMode`, `AdaptiveSessionConfig`, `WrongAnswerReview`, `DiagnosticReportExtended`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m54_m56_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M55-R1` — Practice modes and session config defined.
- `M55-R2` — Wrong-answer review tracking shape defined.
- `M55-R3` — Extended diagnostic report shape defined.
- `M55-R4` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M55-R1` Create `packages/types/src/adaptive.ts` with `PracticeMode` (6 modes) and `AdaptiveSessionConfig` (incl. spaced repetition block).
- [x] `M55-R2` Add `WrongAnswerReview` interface (wrongAttempts, lastWrongAt, nextReviewAt, reviewCount, mastered).
- [x] `M55-R3` Add `DiagnosticReportExtended` interface (skillScores with mastery, recommendedNextSteps with priority, overallScore, generatedAt).
- [x] `M55-R4` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./adaptive.js";` in `packages/types/src/m54_m56_exports.txt`.

## Allowed Files

- `packages/types/src/adaptive.ts`
- `packages/types/src/m54_m56_exports.txt`
- `Docs/WORK_ORDER_M55.md`
- `Docs/QA_M55_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `adaptive.ts` exists with the required types.
- `adaptive.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `adaptive.js` is recorded in `m54_m56_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- Match existing code style (no semicolons).
- `DiagnosticReportExtended` extends the diagnostic concept with a 4-level mastery scale and prioritized next steps.

## Boundaries

- Types-only milestone; no runtime algorithm logic or test scaffolding in this milestone.
- Do not touch `index.ts`.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether M56 can start.
