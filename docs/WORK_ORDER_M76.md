# Work Order — M76 Pilot Readiness Pack

## Work Order ID

`M76`

## Milestone

`M76 — Pilot Readiness Pack`

## Complexity

Standard

## Task

Package school or regional pilot materials into a single readiness contract: a runbook, risk register, acceptance criteria, and data boundaries. Each pilot pack carries its lifecycle status and scope so downstream pilot-launch tooling can validate readiness before activation. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/pilot.ts` with `PilotStatus` and `PilotPack`.
- Do NOT modify `packages/types/src/index.ts` (handled by the orchestrator). Instead record the required export line in `packages/types/src/m76_m80_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M76-R1` — `PilotStatus` union (planning, ready, active, paused, completed, cancelled) defined.
- `M76-R2` — `PilotPack` interface (scope, targets, runbook, risks, acceptance, boundaries, lifecycle) defined.
- `M76-R3` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M76-R1` Create `packages/types/src/pilot.ts` with `PilotStatus` (planning, ready, active, paused, completed, cancelled).
- [x] `M76-R2` Add `PilotPack` interface (id, name, description, scope, targetSchools, estimatedStudentCount, status, runbook, risks, acceptanceCriteria, dataBoundaries, startDate?, endDate?, createdAt, updatedAt).
- [x] `M76-R3` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./pilot.js";` in `packages/types/src/m76_m80_exports.txt`.

## Allowed Files

- `packages/types/src/pilot.ts`
- `packages/types/src/m76_m80_exports.txt`
- `Docs/WORK_ORDER_M76.md`
- `Docs/QA_M76_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `pilot.ts` exists with the required types.
- `pilot.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `pilot.js` is recorded in `m76_m80_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `scope` ("school" | "regional") distinguishes a single-school pilot from a multi-school regional rollout; downstream tooling uses it to scale validation and reporting.
- `runbook` is an ordered `string[]` of steps; the type does not enforce ordering or step references, so pilot-launch tooling must validate step integrity.
- `risks` carries inline severity ("low" | "medium" | "high") plus a mitigation string; this is the readiness risk register, not the runtime incident log.
- `acceptanceCriteria` and `dataBoundaries` are both `string[]` — the former defines what "done" means for the pilot, the latter defines what data may be collected/shared and is the link into M79 privacy hardening.
- `status` lifecycle: planning → ready → active → (paused ↔ active) → completed | cancelled. Tooling must prevent skipping `ready` before `active`.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This milestone defines the pilot readiness *contract*; it does not implement the pilot-launch runner, risk-mitigation workflows, or data-boundary enforcement. Concrete pilots are downstream concerns.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the orchestrator index.ts task can proceed.
