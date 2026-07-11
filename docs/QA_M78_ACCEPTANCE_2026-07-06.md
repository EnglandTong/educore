# QA Acceptance — M78 Long-Term Impact Dashboard

Date: 2026-07-06
Decision: Accepted
Reviewer: Controller/QA (autonomous, OVR-001)

## Acceptance Criteria Check

| AC | Description | Status | Evidence |
|---|---|---|---|
| M78-AC-1 | `ImpactMetricCategory` union (6 categories) defined | PASS | `packages/types/src/impact.ts` — learning-gains, opportunity-coverage, participation, engagement, equity, talent-development |
| M78-AC-2 | `ImpactMetric` interface defined | PASS | `packages/types/src/impact.ts` — id, category, name, description, value, unit, target?, trend (improving/stable/declining), demographicBreakdown?, recordedAt |
| M78-AC-3 | `ImpactDashboard` interface defined | PASS | `packages/types/src/impact.ts` — id, period, metrics, summary, highlights, areasOfConcern, generatedAt |
| M78-AC-4 | `EquityMetric` interface defined | PASS | `packages/types/src/impact.ts` — id, metricName, overallValue, groupValues (group/value/gap), gapThreshold, measuredAt |
| M78-AC-5 | `index.ts` NOT modified | PASS | `packages/types/src/index.ts` unchanged; export line recorded in `packages/types/src/m76_m80_exports.txt` |
| M78-AC-6 | typecheck passes | PASS | `pnpm --filter @educore/types run typecheck` — exit 0 |

## Verification Commands Executed

```
pnpm --filter @educore/types run typecheck → exit 0
```

## Known Risks

1. **`trend` is directional, not quantitative**: `trend` ("improving" | "stable" | "declining") carries no delta value; generators compute the direction and consumers render arrows, but the magnitude of change is not in the type.
2. **`index.ts` export pending**: The `export * from "./impact.js";` line is staged in `m76_m80_exports.txt`; the orchestrator index.ts task must add it before consumers can import from `@educore/types`.
3. **`EquityMetric.gap` semantics are generator-defined**: `gap` is a number whose sign and comparison against `gapThreshold` are not type-enforced; generators must document whether positive `gap` means the group is ahead or behind, and alerting tooling must apply `|gap|` vs `gapThreshold`.
4. **`categoryCoverage` is on the evidence pack (M80), not the dashboard**: The dashboard carries `metrics[]` but does not assert which `ImpactMetricCategory` values are present; a dashboard could omit a category without a type error. Dashboard generators should validate coverage.
5. **`demographicBreakdown` is optional**: When absent, the equity lens is lost for that metric; cross-metric equity analysis relies on `EquityMetric`, which is a separate collection, not embedded in each `ImpactMetric`.

## Decision

**Accepted** — All Must Pass items have objective evidence. Long-term impact dashboard types are defined, type-safe, and verified. The impact metric (`ImpactMetric` with category, value, target, trend, and demographic breakdown), the dashboard rollup (`ImpactDashboard` with highlights and areas of concern), and the equity lens (`EquityMetric` with group gaps and threshold) are expressible via the impact contracts. This milestone provides the longitudinal measurement layer that feeds the M80 evidence pack's `metric` evidence type and ties together learning gains, opportunity coverage, participation, engagement, equity, and talent development.
