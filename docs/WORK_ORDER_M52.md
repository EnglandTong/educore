# WORK_ORDER_M52 - Student Protection & Consent

Status: Dispatched
Created: 2026-07-06
Dependency: M51 Accepted

## Handoff Rule

This plan is the only task source for M52. Each loop performs one bounded task, records evidence, updates loop state, and hands off with commands, results, evidence paths, skipped checks, and risks. Completion is judged only by `Docs/ACCEPTANCE.md` evidence gates, not by chat assertions.

## Milestone Goal

Define parent/school consent, student-contact boundaries, and audit rules. No direct student contact without authorization and traceability.

## Allowed Files

- `packages/types/src/consent.ts` — new consent DTOs
- `packages/types/src/index.ts` — export consent types
- `apps/api/src/models/ConsentRecord.ts` — Mongoose model
- `apps/api/src/services/consent.service.ts` — consent service
- `Docs/` status files

## Not Allowed Files

- Files other milestones might be editing simultaneously
- Existing model/service files (do not modify — only create new files)
- Database schema or migrations beyond the new model
- Production credential files
- Files outside `D:\Development\EduCore`

## Relative Goals

### M52-R1 - Define Consent Types
- [x] Create `packages/types/src/consent.ts` with ConsentType, ConsentStatus, ConsentRecord, StudentContactRule
- [x] Add `export * from "./consent.js";` to `packages/types/src/index.ts` in alphabetical order
- [x] Dependency: M51 Accepted
- [x] Reasoning level: Standard

### M52-R2 - Implement Consent Mongoose Model
- [x] Create `apps/api/src/models/ConsentRecord.ts` following the GuardianLink.ts pattern
- [x] Use `import mongoose from "mongoose"; const { Schema, model, models } = mongoose;`
- [x] Include unique index on `{ studentId, consentType }`
- [x] Dependency: M52-R1
- [x] Reasoning level: Standard

### M52-R3 - Implement Consent Service
- [x] Create `apps/api/src/services/consent.service.ts`
- [x] Implement `hasConsent(studentId, consentType)`
- [x] Implement `grantConsent(studentId, consentType, grantedBy)`
- [x] Implement `revokeConsent(studentId, consentType, revokedBy)`
- [x] Implement `requireConsent(studentId, consentType)` — throws AppError if not granted
- [x] Implement `getStudentContactRules(studentId)`
- [x] AppError imported from `"../utils/errors.js"`
- [x] Dependency: M52-R2
- [x] Reasoning level: Standard

### M52-R4 - Verify Build and Types
- [x] Run `pnpm --filter @educore/types run build`
- [x] Run `pnpm run typecheck` — must pass (exit 0)
- [x] Dependency: M52-R3
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

Developer must not mark M52 Accepted or Completed.
