# Work Order — M57 Student Growth Portfolio

## Work Order ID

`M57`

## Milestone

`M57 — Student Growth Portfolio`

## Complexity

Standard

## Task

Track student growth. Record ability, interest, weak areas, and progress. Reports must be explainable and non-judgmental. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/growth.ts` with `GrowthMetric`, `GrowthRecord`, `StudentGrowthPortfolio`, `GrowthReport`.
- Do NOT modify `packages/types/src/index.ts` (orchestrator owns it). Record the required export line in `packages/types/src/m57_m60_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M57-R1` — `GrowthMetric` union (5 metrics) defined.
- `M57-R2` — `GrowthRecord` interface (with trend) defined.
- `M57-R3` — `StudentGrowthPortfolio` interface (strengths, growthAreas, interests, progressSummary, metrics) defined.
- `M57-R4` — `GrowthReport` interface (portfolio + narrative) defined.
- `M57-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M57-R1` Create `packages/types/src/growth.ts` with `GrowthMetric` (skill-mastery, practice-consistency, improvement-rate, engagement, confidence).
- [x] `M57-R2` Add `GrowthRecord` interface (id, studentId, metric, value, trend, recordedAt, context?).
- [x] `M57-R3` Add `StudentGrowthPortfolio` interface (strengths, growthAreas, interests, progressSummary, metrics, lastUpdated).
- [x] `M57-R4` Add `GrowthReport` interface (portfolio, narrative, generatedAt).
- [x] `M57-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./growth.js";` in `packages/types/src/m57_m60_exports.txt`.

## Allowed Files

- `packages/types/src/growth.ts`
- `packages/types/src/m57_m60_exports.txt`
- `Docs/WORK_ORDER_M57.md`
- `Docs/QA_M57_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `growth.ts` exists with the required types.
- `growth.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `growth.js` is recorded in `m57_m60_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses ESM).
- Match existing code style (no semicolons, multi-line union types).
- `narrative` is a free-form explainable, non-judgmental string; downstream generators must keep tone supportive.
- `growthAreas` replaces judgmental "weakness" labeling with growth-oriented framing.

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
