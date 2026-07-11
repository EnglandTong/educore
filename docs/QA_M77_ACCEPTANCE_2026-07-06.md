# QA Acceptance — M77 Pilot Feedback Loop

Date: 2026-07-06
Decision: Accepted
Reviewer: Controller/QA (autonomous, OVR-001)

## Acceptance Criteria Check

| AC | Description | Status | Evidence |
|---|---|---|---|
| M77-AC-1 | `FeedbackType` union (7 types) defined | PASS | `packages/types/src/feedback.ts` — bug, feature-request, usability, content, performance, safety, other |
| M77-AC-2 | `FeedbackPriority` and `FeedbackStatus` unions defined | PASS | `packages/types/src/feedback.ts` — priority: critical/high/medium/low; status: new/triaged/in-progress/resolved/wontfix |
| M77-AC-3 | `PilotFeedback` interface defined | PASS | `packages/types/src/feedback.ts` — id, pilotId, submitterId, submitterRole, feedbackType, priority, status, title, description, affectedArea?, suggestedAction?, linkedWorkOrderId?, createdAt, resolvedAt? |
| M77-AC-4 | `FeedbackSummary` interface defined | PASS | `packages/types/src/feedback.ts` — pilotId, totalFeedback, byPriority (Record), byStatus (Record), topIssues[], nextWorkOrders[], generatedAt |
| M77-AC-5 | `index.ts` NOT modified | PASS | `packages/types/src/index.ts` unchanged; export line recorded in `packages/types/src/m76_m80_exports.txt` |
| M77-AC-6 | typecheck passes | PASS | `pnpm --filter @educore/types run typecheck` — exit 0 |

## Verification Commands Executed

```
pnpm --filter @educore/types run typecheck → exit 0
```

## Known Risks

1. **Status transitions not type-enforced**: `FeedbackStatus` allows any state, but the intended flow is new → triaged → in-progress → resolved | wontfix; triage tooling must enforce valid transitions.
2. **`index.ts` export pending**: The `export * from "./feedback.js";` line is staged in `m76_m80_exports.txt`; the orchestrator index.ts task must add it before consumers can import from `@educore/types`.
3. **`byPriority` / `byStatus` completeness is generator-enforced**: `Record<FeedbackPriority, number>` and `Record<FeedbackStatus, number>` require all keys; generators must emit zero counts for unused buckets, not omit them.
4. **`topIssues` curation is generator-defined**: The size and selection criteria for `topIssues` are not encoded in the type; generators must define and document their ranking logic.
5. **`linkedWorkOrderId` is a soft link**: The field references a Work Order ID but the type cannot verify the Work Order exists or that its status reflects the feedback resolution; downstream tooling must validate.

## Decision

**Accepted** — All Must Pass items have objective evidence. Pilot feedback loop types are defined, type-safe, and verified. The feedback item (`PilotFeedback` with type, priority, status, and work-order linkage) and the aggregated summary (`FeedbackSummary` with priority/status counts, top issues, and proposed next work orders) are expressible via the feedback contracts. This milestone closes the pilot feedback loop from intake to prioritized improvement demand, feeding both the M78 impact dashboard (user-feedback evidence source) and the M80 evidence pack.
