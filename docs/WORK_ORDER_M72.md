# Work Order — M72 Student Interest & Talent Signals

## Work Order ID

`M72`

## Milestone

`M72 — Student Interest & Talent Signals`

## Complexity

Standard

## Task

Capture multi-source student interest and talent signals (practice, diagnostic, self-report, teacher/parent observation, project, competition) in a non-discriminatory, reviewable way. Aggregate into a talent profile. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/talent.ts` with `SignalSource`, `SignalType`, `TalentSignal`, and `TalentProfile`.
- Do NOT modify `packages/types/src/index.ts` (handled by the orchestrator). Instead record the required export line in `packages/types/src/m71_m75_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M72-R1` — `SignalSource` union (7 sources) defined.
- `M72-R2` — `SignalType` union (5 signal kinds) defined.
- `M72-R3` — `TalentSignal` interface (strength, evidence, non-discriminatory, reviewable) defined.
- `M72-R4` — `TalentProfile` interface (aggregated signals, top interests, aptitude areas) defined.
- `M72-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M72-R1` Create `packages/types/src/talent.ts` with `SignalSource` (practice, diagnostic, self-report, teacher-observation, parent-observation, project, competition).
- [x] `M72-R2` Add `SignalType` (interest, effort, performance, outcome, aptitude).
- [x] `M72-R3` Add `TalentSignal` interface (id, studentId, signalType, source, domain, description, strength, evidence?, recordedAt, nonDiscriminatory, reviewable).
- [x] `M72-R4` Add `TalentProfile` interface (studentId, signals[], topInterests[], aptitudeAreas[], lastUpdated).
- [x] `M72-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./talent.js";` in `packages/types/src/m71_m75_exports.txt`.

## Allowed Files

- `packages/types/src/talent.ts`
- `packages/types/src/m71_m75_exports.txt`
- `Docs/WORK_ORDER_M72.md`
- `Docs/QA_M72_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `talent.ts` exists with the required types.
- `talent.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `talent.js` is recorded in `m71_m75_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `nonDiscriminatory` is a required boolean that encodes the fairness boundary: a signal must be explicitly assessed as non-discriminatory before it can influence a talent profile. Downstream code should treat `false` as a hard block on inclusion in `TalentProfile`.
- `reviewable` is a required boolean ensuring every signal is auditable; signals that cannot be reviewed must not be persisted.
- `strength` uses an ordinal progression (emerging → developing → strong → exceptional) but the type does not enforce ordering; services that compare strengths must map to an ordinal themselves.
- `source` deliberately spans observation (teacher/parent), self-report, and objective (practice, diagnostic, project, competition) channels so that no single source dominates a talent profile.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This milestone captures *signals* and *profiles*; it does not define how signals influence learning paths or cultivation enrollment — those are downstream concerns.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the orchestrator index.ts task can proceed.
