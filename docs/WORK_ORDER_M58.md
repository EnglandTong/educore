# Work Order — M58 Teacher Insight Bridge

## Work Order ID

`M58`

## Milestone

`M58 — Teacher Insight Bridge`

## Complexity

Standard

## Task

Connect learning to teaching. Convert learning data into teacher-actionable insight. Teachers see class, student, weak-area, and next-action signals. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/insight.ts` with `InsightType`, `InsightPriority`, `TeacherInsight`, `ClassInsightSummary`.
- Do NOT modify `packages/types/src/index.ts` (orchestrator owns it). Record the required export line in `packages/types/src/m57_m60_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M58-R1` — `InsightType` union (5 types) and `InsightPriority` union defined.
- `M58-R2` — `TeacherInsight` interface (with suggestedAction, acknowledged) defined.
- `M58-R3` — `ClassInsightSummary` interface (weakAreas, progressSignals, topInsights) defined.
- `M58-R4` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M58-R1` Create `packages/types/src/insight.ts` with `InsightType` (weak-area, progress-signal, intervention-suggestion, class-trend, student-flag) and `InsightPriority` (high, medium, low).
- [x] `M58-R2` Add `TeacherInsight` interface (id, teacherId, insightType, priority, title, description, affectedStudentIds?, suggestedAction, dataReference?, createdAt, acknowledged).
- [x] `M58-R3` Add `ClassInsightSummary` interface (classId, teacherId, totalStudents, weakAreas, progressSignals, topInsights, generatedAt).
- [x] `M58-R4` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./insight.js";` in `packages/types/src/m57_m60_exports.txt`.

## Allowed Files

- `packages/types/src/insight.ts`
- `packages/types/src/m57_m60_exports.txt`
- `Docs/WORK_ORDER_M58.md`
- `Docs/QA_M58_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `insight.ts` exists with the required types.
- `insight.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `insight.js` is recorded in `m57_m60_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses ESM).
- Match existing code style (no semicolons, multi-line union types).
- `suggestedAction` is teacher-actionable (not prescriptive); downstream generators keep it constructive.
- `acknowledged` supports teacher workflow tracking without forcing dismissal.

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
