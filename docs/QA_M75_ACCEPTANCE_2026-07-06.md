# QA Acceptance — M75 Full Ecosystem E2E Journey

Date: 2026-07-06
Decision: Accepted
Reviewer: Controller/QA (autonomous, OVR-001)

## Acceptance Criteria Check

| AC | Description | Status | Evidence |
|---|---|---|---|
| M75-AC-1 | `EcosystemJourneyRole` union (7 roles) defined | PASS | `packages/types/src/ecosystem.ts` — student, parent, teacher, school-admin, volunteer, volunteer-org, volunteer-enterprise |
| M75-AC-2 | `E2EJourneyStep` interface defined | PASS | `packages/types/src/ecosystem.ts` — stepId, role, action, expectedOutcome, verificationMethod (automated/manual/mixed), consentRequired, auditLogged |
| M75-AC-3 | `E2EJourney` interface defined | PASS | `packages/types/src/ecosystem.ts` — id, name, description, roles[], steps[], estimatedDuration, status (draft/ready/active/deprecated) |
| M75-AC-4 | `E2EJourneyResult` interface defined | PASS | `packages/types/src/ecosystem.ts` — journeyId, executedAt, stepsPassed, stepsFailed, stepsSkipped, evidence[], overallStatus (pass/fail/partial) |
| M75-AC-5 | `index.ts` NOT modified | PASS | `packages/types/src/index.ts` unchanged; export line recorded in `packages/types/src/m71_m75_exports.txt` |
| M75-AC-6 | typecheck passes | PASS | `pnpm --filter @educore/types run typecheck` — exit 0 |

## Verification Commands Executed

```
pnpm --filter @educore/types run typecheck → exit 0
```

## Known Risks

1. **Consent and audit are declarative**: `consentRequired` and `auditLogged` on `E2EJourneyStep` are boolean flags; the actual consent-capture blocking and audit-event emission are not implemented in this milestone. Journey runners must enforce both.
2. **`index.ts` export pending**: The `export * from "./ecosystem.js";` line is staged in `m71_m75_exports.txt`; the orchestrator index.ts task must add it before consumers can import from `@educore/types`.
3. **Step-count invariant not type-enforced**: `stepsPassed + stepsFailed + stepsSkipped` should equal `steps.length`, but the type cannot enforce this; runners must validate.
4. **`overallStatus` threshold not defined**: The mapping from per-step results to `pass` / `partial` / `fail` is runner-defined; the type only carries the rollup value.
5. **No concrete journeys defined**: This milestone defines the journey contract only; specific cross-role journey scenarios (e.g., a student enrolling in an enterprise cultivation path with parent + school consent) are downstream concerns.

## Decision

**Accepted** — All Must Pass items have objective evidence. Full ecosystem E2E journey types are defined, type-safe, and verified. The unified role vocabulary (`EcosystemJourneyRole` spanning core education + social-resource roles), consent-aware and audit-logged steps (`E2EJourneyStep`), journey lifecycle (`E2EJourney`), and executable result with per-step evidence (`E2EJourneyResult`) are expressible via the ecosystem contracts. This milestone completes the M71–M75 milestone batch and provides the integration layer tying work exposure (M71), talent signals (M72), cultivation paths (M73), and resource governance (M74) into cross-role E2E journeys.
