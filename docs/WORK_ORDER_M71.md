# Work Order — M71 Real Work Environment Exposure

## Work Order ID

`M71`

## Milestone

`M71 — Real Work Environment Exposure`

## Complexity

Standard

## Task

Expose students to authentic work environments via curated, reviewed content (videos, interviews, site visits, case studies, projects, job shadows). Source attribution, review lifecycle, and consent-gated viewing records. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/work-exposure.ts` with `WorkExposureType`, `WorkExposureStatus`, `WorkEnvironmentContent`, and `WorkExposureRecord`.
- Do NOT modify `packages/types/src/index.ts` (handled by the orchestrator). Instead record the required export line in `packages/types/src/m71_m75_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M71-R1` — `WorkExposureType` union (6 exposure kinds) defined.
- `M71-R2` — `WorkExposureStatus` union (5 lifecycle states) defined.
- `M71-R3` — `WorkEnvironmentContent` interface (attribution, review, target grades, duration) defined.
- `M71-R4` — `WorkExposureRecord` interface (student viewing record with consent) defined.
- `M71-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M71-R1` Create `packages/types/src/work-exposure.ts` with `WorkExposureType` (video, interview, site-visit, case-study, project, job-shadow).
- [x] `M71-R2` Add `WorkExposureStatus` (draft, pending-review, approved, published, archived).
- [x] `M71-R3` Add `WorkEnvironmentContent` interface (id, title, exposureType, enterpriseId?, industry, description, contentUrl?, sourceAttribution, reviewStatus, reviewedBy?, targetGradeLevels?, durationMinutes?, createdAt, updatedAt).
- [x] `M71-R4` Add `WorkExposureRecord` interface (id, studentId, contentId, viewedAt, reflectionNote?, consentVerified).
- [x] `M71-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./work-exposure.js";` in `packages/types/src/m71_m75_exports.txt`.

## Allowed Files

- `packages/types/src/work-exposure.ts`
- `packages/types/src/m71_m75_exports.txt`
- `Docs/WORK_ORDER_M71.md`
- `Docs/QA_M71_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `work-exposure.ts` exists with the required types.
- `work-exposure.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `work-exposure.js` is recorded in `m71_m75_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `sourceAttribution` is required so every piece of work-exposure content has a traceable origin; downstream services must not allow empty attribution.
- `reviewStatus` encodes the editorial lifecycle: content cannot be `published` without first being `approved`. Services should enforce the state transition order.
- `consentVerified` on `WorkExposureRecord` mirrors the consent pattern used across EduCore (e.g., M62 communication consent) — student viewing of enterprise content is consent-gated.
- `targetGradeLevels` and `durationMinutes` are optional metadata used for content suitability filtering; they are advisory and not enforced by the type.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This milestone is about exposure *content* and viewing *records*; enterprise cultivation *paths* are handled separately in M73.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the orchestrator index.ts task can proceed.
