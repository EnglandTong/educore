# Work Order — M67 Safe Matching Engine

## Work Order ID

`M67`

## Milestone

`M67 — Safe Matching Engine`

## Complexity

Standard

## Task

Provide a safe matching engine that pairs student needs with volunteer / program / mentor resources. Enforce consent, audit trail, and rule-based matching boundaries. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/matching.ts` with `MatchStatus`, `MatchResourceType`, `MatchNeedType`, `MatchRequest`, `MatchResult`, and `MatchingRule`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m66_m70_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M67-R1` — `MatchStatus` union (7 states) defined.
- `M67-R2` — `MatchResourceType` union (7 resource kinds) defined.
- `M67-R3` — `MatchNeedType` union (6 need kinds) defined.
- `M67-R4` — `MatchRequest` interface (student need, urgency, consent) defined.
- `M67-R5` — `MatchResult` interface (resource, score, reason, consent, audit trail) defined.
- `M67-R6` — `MatchingRule` interface (condition, priority, active) defined.
- `M67-R7` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M67-R1` Create `packages/types/src/matching.ts` with `MatchStatus` (pending, proposed, accepted, rejected, active, completed, cancelled).
- [x] `M67-R2` Add `MatchResourceType` (volunteer, volunteer-teacher, volunteer-school, volunteer-org, volunteer-enterprise, program, mentor).
- [x] `M67-R3` Add `MatchNeedType` (subject-help, career-guidance, industry-exposure, mentorship, resource, practice).
- [x] `M67-R4` Add `MatchRequest` interface (id, studentId, needType, description, preferredSubjects?, urgency, consentGiven, status, createdAt).
- [x] `M67-R5` Add `MatchResult` interface (id, matchRequestId, resourceType, resourceId, resourceName, matchScore, matchReason, status, consentRequired, auditTrail[], createdAt).
- [x] `M67-R6` Add `MatchingRule` interface (id, name, description, condition, priority, active).
- [x] `M67-R7` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./matching.js";` in `packages/types/src/m66_m70_exports.txt`.

## Allowed Files

- `packages/types/src/matching.ts`
- `packages/types/src/m66_m70_exports.txt`
- `Docs/WORK_ORDER_M67.md`
- `Docs/QA_M67_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `matching.ts` exists with the required types.
- `matching.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `matching.js` is recorded in `m66_m70_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `MatchRequest.consentGiven` is a hard gate — services must not produce any `MatchResult` for a request where `consentGiven === false`.
- `MatchResult.consentRequired` indicates the resource side requires additional consent (e.g., guardian consent for minors) before activation; downstream services should block `active` status until consent is verified.
- `MatchResult.auditTrail` is an append-only string array — every state transition should push a human-readable entry to satisfy the audit boundary.
- `MatchResult.matchScore` is a plain number; the type does not constrain range, but services should normalize to 0–100 and document the scale.
- `MatchingRule.priority` is a plain number; lower numbers mean higher priority (convention).
- `MatchResourceType` reuses the volunteer taxonomy (M63/M64/M65) plus `program` and `mentor` to cover enterprise programs and mentorship sessions (M68).

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the parallel index.ts task can proceed.
