# Work Order — M69 Industry Exposure Library

## Work Order ID

`M69`

## Milestone

`M69 — Industry Exposure Library`

## Complexity

Standard

## Task

Provide an industry exposure library. Curate articles, videos, interviews, case studies, virtual tours, and infographics with content review and role profiles. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/industry.ts` with `IndustryContentStatus`, `IndustryContentType`, `IndustryContent`, and `IndustryRoleProfile`.
- Do NOT modify `packages/types/src/index.ts` (handled by a parallel task). Instead record the required export line in `packages/types/src/m66_m70_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M69-R1` — `IndustryContentStatus` union (6 states) defined.
- `M69-R2` — `IndustryContentType` union (6 content kinds) defined.
- `M69-R3` — `IndustryContent` interface (title, content, review, attribution, tags) defined.
- `M69-R4` — `IndustryRoleProfile` interface (role, skills, career path, day-in-life) defined.
- `M69-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M69-R1` Create `packages/types/src/industry.ts` with `IndustryContentStatus` (draft, pending-review, approved, published, archived, rejected).
- [x] `M69-R2` Add `IndustryContentType` (article, video, interview, case-study, virtual-tour, infographic).
- [x] `M69-R3` Add `IndustryContent` interface (id, title, contentType, industry, description, contentUrl?, sourceAttribution, reviewStatus, reviewedBy?, tags[], targetGradeLevels?, publishedAt?, createdAt, updatedAt).
- [x] `M69-R4` Add `IndustryRoleProfile` interface (id, industry, roleName, description, requiredSkills[], careerPath[], dayInLife?).
- [x] `M69-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./industry.js";` in `packages/types/src/m66_m70_exports.txt`.

## Allowed Files

- `packages/types/src/industry.ts`
- `packages/types/src/m66_m70_exports.txt`
- `Docs/WORK_ORDER_M69.md`
- `Docs/QA_M69_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (parallel task owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `industry.ts` exists with the required types.
- `industry.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `industry.js` is recorded in `m66_m70_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `reviewStatus` lifecycle: `draft` → `pending-review` → `approved` → `published` → `archived`; `pending-review` → `rejected` is a terminal state that should route back to `draft` for revision. Services should enforce this state machine.
- `sourceAttribution` is required (non-optional) to enforce copyright / provenance — content without attribution must not be published.
- `targetGradeLevels?` is optional to allow school-wide content; when present, services should filter by student grade level.
- `IndustryRoleProfile` is a separate entity from `IndustryContent` — role profiles describe career structure (skills, path, day-in-life) while content items are the media assets. A role profile may link to multiple content items via `tags` or `industry` downstream.
- `publishedAt?` is set only when content transitions to `published`; it is the source of truth for publication time, distinct from `createdAt` / `updatedAt`.

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
