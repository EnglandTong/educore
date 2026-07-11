# Work Order — M77 Pilot Feedback Loop

## Work Order ID

`M77`

## Milestone

`M77 — Pilot Feedback Loop`

## Complexity

Standard

## Task

Collect pilot feedback and drive it into prioritized improvements. Define the feedback item contract (type, priority, status, linkage to work orders) and a summary contract that aggregates feedback into priority/status counts, top issues, and proposed next work orders. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/feedback.ts` with `FeedbackType`, `FeedbackPriority`, `FeedbackStatus`, `PilotFeedback`, and `FeedbackSummary`.
- Do NOT modify `packages/types/src/index.ts` (handled by the orchestrator). Instead record the required export line in `packages/types/src/m76_m80_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M77-R1` — `FeedbackType` union (bug, feature-request, usability, content, performance, safety, other) defined.
- `M77-R2` — `FeedbackPriority` union (critical, high, medium, low) and `FeedbackStatus` union (new, triaged, in-progress, resolved, wontfix) defined.
- `M77-R3` — `PilotFeedback` interface (submitter, type, priority, status, linkage to work order) defined.
- `M77-R4` — `FeedbackSummary` interface (counts by priority/status, top issues, next work orders) defined.
- `M77-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M77-R1` Create `packages/types/src/feedback.ts` with `FeedbackType` (bug, feature-request, usability, content, performance, safety, other).
- [x] `M77-R2` Add `FeedbackPriority` (critical, high, medium, low) and `FeedbackStatus` (new, triaged, in-progress, resolved, wontfix).
- [x] `M77-R3` Add `PilotFeedback` interface (id, pilotId, submitterId, submitterRole, feedbackType, priority, status, title, description, affectedArea?, suggestedAction?, linkedWorkOrderId?, createdAt, resolvedAt?).
- [x] `M77-R4` Add `FeedbackSummary` interface (pilotId, totalFeedback, byPriority, byStatus, topIssues, nextWorkOrders, generatedAt).
- [x] `M77-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./feedback.js";` in `packages/types/src/m76_m80_exports.txt`.

## Allowed Files

- `packages/types/src/feedback.ts`
- `packages/types/src/m76_m80_exports.txt`
- `Docs/WORK_ORDER_M77.md`
- `Docs/QA_M77_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `feedback.ts` exists with the required types.
- `feedback.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `feedback.js` is recorded in `m76_m80_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `PilotFeedback.linkedWorkOrderId?` is the closure link: once feedback is triaged and a Work Order is created, this field ties the feedback to the downstream fix. It is optional because new feedback is not yet linked.
- `FeedbackSummary.byPriority` and `byStatus` use `Record<FeedbackPriority, number>` / `Record<FeedbackStatus, number>` so the summary is a complete map; generators must emit zero counts for unused buckets, not omit them.
- `topIssues` is a curated short list (not all feedback) — the most impactful items by priority; size is generator-defined.
- `nextWorkOrders` are proposed work orders derived from the feedback backlog; they carry their own `priority` so the controller can rank them against other demand.
- `FeedbackStatus` lifecycle: new → triaged → in-progress → resolved | wontfix. The type does not enforce transitions; triage tooling must.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This milestone defines the feedback loop *contract*; it does not implement the feedback intake UI, triage workflow, or work-order auto-creation. Concrete feedback tooling is a downstream concern.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the orchestrator index.ts task can proceed.
