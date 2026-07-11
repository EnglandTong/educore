# Work Order — M80 National Talent Development Evidence Pack

## Work Order ID

`M80`

## Milestone

`M80 — National Talent Development Evidence Pack`

## Complexity

Standard

## Task

Package the final evidence proving EduCore's contribution to education quality and national talent development. Define the evidence item contract (category, type, strength, source, verification) and the top-level evidence pack contract (period, evidence list, category coverage map, contribution summaries, approval). Evidence spans learning, teacher, family/school, volunteer, industry, talent, equity, privacy, and safety. Deliver shared types in `packages/types`.

## Scope

- Add `packages/types/src/evidence-pack.ts` with `EvidenceCategory`, `EvidenceStrength`, `EvidenceItem`, and `TalentDevelopmentEvidencePack`.
- Do NOT modify `packages/types/src/index.ts` (handled by the orchestrator). Instead record the required export line in `packages/types/src/m76_m80_exports.txt`.
- Create this Work Order and the QA acceptance doc.

## Relative Targets

- `M80-R1` — `EvidenceCategory` union (learning, teacher, family-school, volunteer, industry, talent, equity, privacy, safety) defined.
- `M80-R2` — `EvidenceStrength` union (supporting, strong, definitive) defined.
- `M80-R3` — `EvidenceItem` interface (category, type, strength, source, verification) defined.
- `M80-R4` — `TalentDevelopmentEvidencePack` interface (period, evidence, category coverage, contribution summaries, approval) defined.
- `M80-R5` — `typecheck` passes for `@educore/types`.

## Tasks

- [x] `M80-R1` Create `packages/types/src/evidence-pack.ts` with `EvidenceCategory` (learning, teacher, family-school, volunteer, industry, talent, equity, privacy, safety).
- [x] `M80-R2` Add `EvidenceStrength` (supporting, strong, definitive).
- [x] `M80-R3` Add `EvidenceItem` interface (id, category, title, description, evidenceType, strength, source, timestamp, verified, verifiedBy?).
- [x] `M80-R4` Add `TalentDevelopmentEvidencePack` interface (id, period, evidence, categoryCoverage, summary, contributionToEducation, contributionToTalent, generatedAt, approvedBy?, approvedAt?).
- [x] `M80-R5` Run `pnpm --filter @educore/types run typecheck` (must exit 0).
- [x] Record export line `export * from "./evidence-pack.js";` in `packages/types/src/m76_m80_exports.txt`.

## Allowed Files

- `packages/types/src/evidence-pack.ts`
- `packages/types/src/m76_m80_exports.txt`
- `Docs/WORK_ORDER_M80.md`
- `Docs/QA_M80_ACCEPTANCE_2026-07-06.md`

## Not Allowed Files

- `packages/types/src/index.ts` (orchestrator owns it)
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `evidence-pack.ts` exists with the required types.
- `evidence-pack.ts` compiles cleanly under `strict` + `isolatedModules`.
- `pnpm --filter @educore/types run typecheck` exits 0.
- Export line for `evidence-pack.js` is recorded in `m76_m80_exports.txt`.

## Design Notes

- Use `.js` extension in re-export paths (project uses `moduleResolution: "bundler"` + ESM).
- `EvidenceCategory` covers the full EduCore contribution surface: learning (student outcomes), teacher (M27–M49 teacher arc), family-school (parent view + school view), volunteer (M-ecosystem + volunteer registries), industry (M71 work exposure + industry), talent (M72 talent signals + M73 cultivation), equity (M78 equity metrics), privacy (M79 hardening), safety (safety feedback from M77). This is the rollup category set for the final evidence pack.
- `EvidenceStrength` escalates: supporting (indicates contribution) → strong (correlated contribution) → definitive (causal, verified contribution). The pack should aim for at least one `definitive` item per covered category.
- `EvidenceItem.evidenceType` ties each item to its proof artifact: `automated-test` (CI/E2E), `manual-test` (QA run), `documentation` (design/ops docs), `metric` (M78 dashboard values), `audit-log` (M79 audit records), `user-feedback` (M77 pilot feedback). This makes every evidence claim traceable to a concrete source type.
- `EvidenceItem.verified` + `verifiedBy?` are the attestation: an unverified item is a claim, a verified item is backed evidence. The pack generator should reject packs where critical-category items are unverified.
- `TalentDevelopmentEvidencePack.categoryCoverage` is `Record<EvidenceCategory, boolean>` — a complete map so reviewers can see at a glance which categories are covered and which are gaps. Generators must emit all nine keys, not omit uncovered ones.
- `contributionToEducation` and `contributionToTalent` are separate narrative fields: the former addresses education-quality outcomes, the latter addresses national talent-pipeline outcomes. Both are required so the pack cannot claim one without the other.
- `approvedBy?` / `approvedAt?` are optional because a pack is generated first, then reviewed and approved; until approval the pack is a draft. Downstream publishing tooling must check both are present before release.

## Boundaries

- Types-only milestone; no runtime logic, no backend/frontend wiring.
- Do not touch `index.ts`.
- This milestone defines the evidence pack *contract*; it does not implement evidence collection, verification workflows, or pack approval/release. Concrete evidence tooling is a downstream concern.
- This is the final milestone (M80) of the M76–M80 batch; it depends conceptually on M76 (pilot scope), M77 (user-feedback evidence source), M78 (metric evidence source), and M79 (audit-log evidence source) but requires no code-level dependency — all four are independent type files.

## Verification Commands

- `pnpm --filter @educore/types run typecheck`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- known risks;
- whether the orchestrator index.ts task can proceed.
