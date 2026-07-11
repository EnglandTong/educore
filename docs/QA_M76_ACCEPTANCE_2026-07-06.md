# QA Acceptance — M76 Pilot Readiness Pack

Date: 2026-07-06
Decision: Accepted
Reviewer: Controller/QA (autonomous, OVR-001)

## Acceptance Criteria Check

| AC | Description | Status | Evidence |
|---|---|---|---|
| M76-AC-1 | `PilotStatus` union (6 states) defined | PASS | `packages/types/src/pilot.ts` — planning, ready, active, paused, completed, cancelled |
| M76-AC-2 | `PilotPack` interface defined | PASS | `packages/types/src/pilot.ts` — id, name, description, scope (school/regional), targetSchools, estimatedStudentCount, status, runbook, risks (risk/mitigation/severity), acceptanceCriteria, dataBoundaries, startDate?, endDate?, createdAt, updatedAt |
| M76-AC-3 | `index.ts` NOT modified | PASS | `packages/types/src/index.ts` unchanged; export line recorded in `packages/types/src/m76_m80_exports.txt` |
| M76-AC-4 | typecheck passes | PASS | `pnpm --filter @educore/types run typecheck` — exit 0 |

## Verification Commands Executed

```
pnpm --filter @educore/types run typecheck → exit 0
```

## Known Risks

1. **Lifecycle transitions not type-enforced**: `PilotStatus` allows any state, but the intended flow is planning → ready → active → (paused ↔ active) → completed | cancelled; pilot-launch tooling must enforce that `active` requires a prior `ready`.
2. **`index.ts` export pending**: The `export * from "./pilot.js";` line is staged in `m76_m80_exports.txt`; the orchestrator index.ts task must add it before consumers can import from `@educore/types`.
3. **Risk register is inline, not referenced**: `risks` is an inline array on the pack; there is no separate risk registry or runtime incident log linkage. Severity is a static readiness assessment.
4. **`dataBoundaries` is declarative**: The boundary strings are not machine-enforceable; downstream privacy tooling (M79) must translate them into retention/export/consent rules.
5. **`runbook` ordering not enforced**: `runbook` is a `string[]`; the type cannot enforce that steps are sequential or cross-referenced, so pilot-launch runners must validate step integrity.

## Decision

**Accepted** — All Must Pass items have objective evidence. Pilot readiness types are defined, type-safe, and verified. The pilot lifecycle (`PilotStatus`), readiness pack (`PilotPack` with scope, runbook, risk register, acceptance criteria, and data boundaries) are expressible via the pilot contract. This milestone provides the readiness layer that the M77 feedback loop, M78 impact dashboard, and M80 evidence pack build upon.
