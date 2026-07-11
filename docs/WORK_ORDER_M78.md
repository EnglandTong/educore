# Work Order — M78 Long-Term Impact Dashboard

## Work Order ID

`M78`

## Milestone

`M78 — Long-Term Impact Dashboard`

## Complexity

Standard

## Task

Track long-term learning gains, opportunity coverage, participation, engagement, equity, and talent-development metrics. Define the impact metric contract (category, value, target, trend, demographic breakdown), the dashboard contract (period, metrics, highlights, areas of concern), and a dedicated equity metric contract that surfaces group gaps against a threshold. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/impact.ts` with `ImpactMetricCategory`, `ImpactMetric`, `ImpactDashboard`, and `EquityMetric`.
- Do NOT modify `packages/types/src/index.ts` (handled by the orchestrator). Instead record the required export line in `packages/types/src/m76_m80_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M78-R1` — `ImpactMetricCategory` union (learning-gains, opportunity-coverage, participation, engagement, equity, talent-development) defined.
- `M78-R2` — `ImpactMetric` interface (category, value, unit, target?, trend, demographic breakdown) defined.
- `M78-R3` — `ImpactDashboard` interface (period, metrics, summary, highlights, areas of concern) defined.
- `M78-R4` — `EquityMetric` interface (overall value, group values with gaps, gap threshold) defined.
- `M78-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M78-R1` Create `packages/types/src/impact.ts` with `ImpactMetricCategory` (learning-gains, opportunity-coverage, participation, engagement, equity, talent-development).
- [x] `M78-R2` Add `ImpactMetric` interface (id, category, name, description, value, unit, target?, trend, demographicBreakdown?, recordedAt).
- [x] `M78-R3` Add `ImpactDashboard` interface (id, period, metrics, summary, highlights, areasOfConcern, generatedAt).
- [x] `M78-R4` Add `EquityMetric` interface (id, metricName, overallValue, groupValues with gap, gapThreshold, measuredAt).
- [x] `M78-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./impact.js";` in `packages/types/src/m76_m80_exports.txt`.

## Allowed Files

- `packages/types/src/impact.ts`
- `packages/types/src/m76_m80_exports.txt`
- `Docs/WORK_ORDER_M78.md`
- `Docs/QA_M78_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `impact.ts` exists with the required types.
- `impact.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `impact.js` is recorded in `m76_m80_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `ImpactMetricCategory` spans the full impact surface: learning gains (M40+ student outcomes), opportunity coverage (M71 work exposure / M73 cultivation), participation (M74 governance / volunteer engagement), engagement (M27–M37 teacher arc), equity (fairness + equity metric), and talent development (M72 talent signals + M73 cultivation).
- `ImpactMetric.trend` ("improving" | "stable" | "declining") is a directional signal relative to the prior period; it is not a delta value — generators compute the direction and consumers render the arrow.
- `ImpactMetric.target?` is optional because not every metric has a numeric goal (some are descriptive); when present, dashboards should render value vs. target.
- `ImpactMetric.demographicBreakdown?` is the equity lens: when present, it lets the dashboard split a metric by group so gaps are visible per-metric, complementing the cross-metric `EquityMetric`.
- `EquityMetric.gap` is per-group and signed/unsigned by generator convention; `gapThreshold` is the maximum acceptable gap — groups whose `|gap|` exceeds it are flagged. The type does not enforce sign or threshold comparison; generators and alerting tooling must.
- `ImpactDashboard.areasOfConcern` is the human-readable rollup of metrics that are declining, below target, or breaching equity thresholds.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This milestone defines the impact dashboard *contract*; it does not implement metric collection, dashboard rendering, or equity-gap alerting. Concrete dashboards are downstream concerns.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the orchestrator index.ts task can proceed.
