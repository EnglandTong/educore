# QA Acceptance — M70 School & Major Guidance

Date: 2026-07-06
Decision: Accepted
Reviewer: Controller/QA (autonomous, OVR-001)

## Acceptance Criteria Check

| AC | Description | Status | Evidence |
|---|---|---|---|
| M70-AC-1 | `GuidanceType` union (5 guidance kinds) defined | PASS | `packages/types/src/guidance.ts` — school-info, major-info, career-path, admission-requirement, campus-life |
| M70-AC-2 | `SchoolMajorInfo` interface defined | PASS | `packages/types/src/guidance.ts` — id, type, name, description, location?, website?, admissionRequirements?, programs?, careerOutcomes?, realExperienceStories?, tags[], createdAt, updatedAt |
| M70-AC-3 | `GuidanceRecommendation` interface defined | PASS | `packages/types/src/guidance.ts` — id, studentId, recommendedItems[], basedOn[], consentGiven, createdAt |
| M70-AC-4 | `index.ts` NOT modified | PASS | `packages/types/src/index.ts` unchanged; export line recorded in `packages/types/src/m66_m70_exports.txt` |
| M70-AC-5 | typecheck passes | PASS | `pnpm --filter @educore/types run typecheck` — exit 0 |

## Verification Commands Executed

```
pnpm --filter @educore/types run typecheck → exit 0
```

## Known Risks

1. **No runtime consent enforcement yet**: `GuidanceRecommendation.consentGiven` is a declarative flag; services must not persist or surface recommendations for students without consent.
2. **`index.ts` export pending**: The `export * from "./guidance.js";` line is staged in `m66_m70_exports.txt`; the parallel index.ts task must add it before consumers can import from `@educore/types`.
3. **`basedOn` vocabulary not constrained**: The basis descriptors are opaque strings; services must document and validate the vocabulary.
4. **`recommendedItems` inline type**: The inline anonymous object type is localized; downstream services may promote it to a named interface if joins are needed.
5. **`realExperienceStories` disclaimer not enforced in types**: Services must display subjective stories with a clarity disclaimer; the type does not encode this requirement.

## Decision

**Accepted** — All Must Pass items have objective evidence. School & major guidance types are defined, type-safe, and verified. The consent (`consentGiven`), basis transparency (`basedOn`), and priority (`recommendedItems[].priority`) boundaries are expressible via the `SchoolMajorInfo` and `GuidanceRecommendation` contracts. This completes the M66–M70 milestone batch.
