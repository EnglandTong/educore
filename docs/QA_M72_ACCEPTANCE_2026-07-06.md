# QA Acceptance — M72 Student Interest & Talent Signals

Date: 2026-07-06
Decision: Accepted
Reviewer: Controller/QA (autonomous, OVR-001)

## Acceptance Criteria Check

| AC | Description | Status | Evidence |
|---|---|---|---|
| M72-AC-1 | `SignalSource` union (7 sources) defined | PASS | `packages/types/src/talent.ts` — practice, diagnostic, self-report, teacher-observation, parent-observation, project, competition |
| M72-AC-2 | `SignalType` union (5 kinds) defined | PASS | `packages/types/src/talent.ts` — interest, effort, performance, outcome, aptitude |
| M72-AC-3 | `TalentSignal` interface defined | PASS | `packages/types/src/talent.ts` — id, studentId, signalType, source, domain, description, strength, evidence?, recordedAt, nonDiscriminatory, reviewable |
| M72-AC-4 | `TalentProfile` interface defined | PASS | `packages/types/src/talent.ts` — studentId, signals[], topInterests[], aptitudeAreas[], lastUpdated |
| M72-AC-5 | `index.ts` NOT modified | PASS | `packages/types/src/index.ts` unchanged; export line recorded in `packages/types/src/m71_m75_exports.txt` |
| M72-AC-6 | typecheck passes | PASS | `pnpm --filter @educore/types run typecheck` — exit 0 |

## Verification Commands Executed

```
pnpm --filter @educore/types run typecheck → exit 0
```

## Known Risks

1. **Non-discrimination is declarative**: `nonDiscriminatory` is a boolean flag; the actual fairness assessment process is not implemented in this milestone. Services must enforce that `false` blocks inclusion in a `TalentProfile`.
2. **`index.ts` export pending**: The `export * from "./talent.js";` line is staged in `m71_m75_exports.txt`; the orchestrator index.ts task must add it before consumers can import from `@educore/types`.
3. **Strength ordering not type-enforced**: `strength` is a string union; ordinal comparison must be implemented by services.
4. **Signal deduplication not modeled**: Multiple signals for the same domain/student are allowed by the type; services must define deduplication and aggregation rules when building `TalentProfile`.

## Decision

**Accepted** — All Must Pass items have objective evidence. Student interest and talent signal types are defined, type-safe, and verified. Multi-source capture (`SignalSource`), fairness (`nonDiscriminatory`), auditability (`reviewable`), and aggregation (`TalentProfile`) are expressible via the `TalentSignal` and `TalentProfile` contracts.
