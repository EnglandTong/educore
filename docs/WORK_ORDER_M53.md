# WORK_ORDER_M53 - Fair Opportunity Principles

Status: Dispatched
Created: 2026-07-06
Dependency: M52 Accepted

## Handoff Rule

This plan is the only task source for M53. Each loop performs one bounded task, records evidence, updates loop state, and hands off with commands, results, evidence paths, skipped checks, and risks. Completion is judged only by `Docs/ACCEPTANCE.md` evidence gates, not by chat assertions.

## Milestone Goal

Define equal treatment and opportunity fairness. No negative labels by region, poverty, or school resources.

## Allowed Files

- `packages/types/src/fairness.ts` — new fairness DTOs and rules
- `packages/types/src/index.ts` — export fairness types
- `Docs/` status files

## Not Allowed Files

- Files other milestones might be editing simultaneously
- Existing type files (do not modify — only create new files and update index.ts)
- Database schema or migrations
- Production credential files
- Files outside `D:\Development\EduCore`

## Relative Goals

### M53-R1 - Define Fairness Types and Rules
- [x] Create `packages/types/src/fairness.ts` with FairnessCategory, FairnessRule, FairnessCheckResult, FAIRNESS_RULES, checkFairness()
- [x] Include all 6 fairness rules (FR-001 through FR-006) with "block" enforcement
- [x] Implement checkFairness() with basic labeling pattern detection
- [x] Dependency: M52 Accepted
- [x] Reasoning level: Standard

### M53-R2 - Export Fairness Types
- [x] Add `export * from "./fairness.js";` to `packages/types/src/index.ts` in alphabetical order
- [x] Dependency: M53-R1
- [x] Reasoning level: Standard

### M53-R3 - Verify Build and Types
- [x] Run `pnpm --filter @educore/types run build`
- [x] Run `pnpm run typecheck` — must pass (exit 0)
- [x] Dependency: M53-R2
- [x] Reasoning level: Standard

## Verification

- `pnpm --filter @educore/types run build` → exit 0
- `pnpm run typecheck` → exit 0

## Expected Developer Handoff

Developer handoff must include:

- Changed files
- Commands run
- Results
- Manual checks
- Skipped checks and reasons
- Known risks
- Final state: Developer Complete, Ready for Controller/QA Review, Blocked, or Failed / Needs Fix

Developer must not mark M53 Accepted or Completed.
