# QA Acceptance — M71 Real Work Environment Exposure

Date: 2026-07-06
Decision: Accepted
Reviewer: Controller/QA (autonomous, OVR-001)

## Acceptance Criteria Check

| AC | Description | Status | Evidence |
|---|---|---|---|
| M71-AC-1 | `WorkExposureType` union (6 kinds) defined | PASS | `packages/types/src/work-exposure.ts` — video, interview, site-visit, case-study, project, job-shadow |
| M71-AC-2 | `WorkExposureStatus` union (5 states) defined | PASS | `packages/types/src/work-exposure.ts` — draft, pending-review, approved, published, archived |
| M71-AC-3 | `WorkEnvironmentContent` interface defined | PASS | `packages/types/src/work-exposure.ts` — id, title, exposureType, enterpriseId?, industry, description, contentUrl?, sourceAttribution, reviewStatus, reviewedBy?, targetGradeLevels?, durationMinutes?, createdAt, updatedAt |
| M71-AC-4 | `WorkExposureRecord` interface defined | PASS | `packages/types/src/work-exposure.ts` — id, studentId, contentId, viewedAt, reflectionNote?, consentVerified |
| M71-AC-5 | `index.ts` NOT modified | PASS | `packages/types/src/index.ts` unchanged; export line recorded in `packages/types/src/m71_m75_exports.txt` |
| M71-AC-6 | typecheck passes | PASS | `pnpm --filter @educore/types run typecheck` — exit 0 |

## Verification Commands Executed

```
pnpm --filter @educore/types run typecheck → exit 0
```

## Known Risks

1. **Review lifecycle not enforced in types**: `WorkExposureStatus` declares states but the type cannot enforce that `published` only follows `approved`; services must validate state transitions at runtime.
2. **`index.ts` export pending**: The `export * from "./work-exposure.js";` line is staged in `m71_m75_exports.txt`; the orchestrator index.ts task must add it before consumers can import from `@educore/types`.
3. **Consent gating is declarative**: `consentVerified` on `WorkExposureRecord` is a boolean flag; the actual consent capture flow is not implemented in this milestone.
4. **Source attribution is a required string but not structurally validated**: `sourceAttribution` must be non-empty by convention; services must enforce non-emptiness.

## Decision

**Accepted** — All Must Pass items have objective evidence. Real work environment exposure types are defined, type-safe, and verified. Source attribution (`sourceAttribution`), review lifecycle (`WorkExposureStatus`), and consent-gated viewing (`consentVerified`) are expressible via the `WorkEnvironmentContent` and `WorkExposureRecord` contracts.
