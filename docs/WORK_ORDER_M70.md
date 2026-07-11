# Work Order — M70 School & Major Guidance

## Work Order ID

`M70`

## Milestone

`M70 — School & Major Guidance`

## Complexity

Standard

## Task

Provide school and major guidance. Curate school info, major info, career paths, admission requirements, and campus life with consent-based recommendations. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/guidance.ts` with `GuidanceType`, `SchoolMajorInfo`, and `GuidanceRecommendation`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m66_m70_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M70-R1` — `GuidanceType` union (5 guidance kinds) defined.
- `M70-R2` — `SchoolMajorInfo` interface (info, requirements, programs, outcomes, stories) defined.
- `M70-R3` — `GuidanceRecommendation` interface (student, items, basis, consent) defined.
- `M70-R4` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M70-R1` Create `packages/types/src/guidance.ts` with `GuidanceType` (school-info, major-info, career-path, admission-requirement, campus-life).
- [x] `M70-R2` Add `SchoolMajorInfo` interface (id, type, name, description, location?, website?, admissionRequirements?, programs?, careerOutcomes?, realExperienceStories?, tags[], createdAt, updatedAt).
- [x] `M70-R3` Add `GuidanceRecommendation` interface (id, studentId, recommendedItems[], basedOn[], consentGiven, createdAt).
- [x] `M70-R4` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./guidance.js";` in `packages/types/src/m66_m70_exports.txt`.

## Allowed Files

- `packages/types/src/guidance.ts`
- `packages/types/src/m66_m70_exports.txt`
- `Docs/WORK_ORDER_M70.md`
- `Docs/QA_M70_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `guidance.ts` exists with the required types.
- `guidance.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `guidance.js` is recorded in `m66_m70_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `GuidanceRecommendation.consentGiven` is a hard gate — services must not persist or surface a recommendation for a student where `consentGiven === false` (mirrors the consent pattern across M62/M65/M66/M67/M68).
- `recommendedItems` uses an inline anonymous object type with `priority` to keep the contract localized; downstream services may promote this to a named interface if joins are needed.
- `basedOn` is a string array of opaque basis descriptors (e.g., `"interest:stem"`, `"grade-level:G10"`) — the type intentionally does not constrain the vocabulary so the recommendation engine can evolve without a type change.
- `realExperienceStories?` is optional to allow factual school/major info without subjective stories; when present, services should display them with a clarity disclaimer.
- `SchoolMajorInfo` is distinct from M69 `IndustryRoleProfile`: guidance items describe institutional / academic pathways; role profiles describe career structure. The two may cross-link via `tags` downstream.

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
