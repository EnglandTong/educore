# QA Acceptance — M51 Role & Permission Model

Date: 2026-07-06
Decision: Accepted
Reviewer: Controller/QA (autonomous, OVR-001)

## Acceptance Criteria Check

| AC | Description | Status | Evidence |
|---|---|---|---|
| M51-AC-1 | UserRole extended to 10 roles | PASS | `packages/types/src/user.ts` — added volunteer-teacher, volunteer-school, volunteer-org, volunteer-enterprise |
| M51-AC-2 | Permission matrix created | PASS | `packages/types/src/permissions.ts` — PERMISSION_MATRIX with permissions, visibleData, forbiddenActions for all 10 roles |
| M51-AC-3 | Permission helpers exported | PASS | `hasPermission()`, `getRolePermissions()`, `getForbiddenActions()` exported from `@educore/types` |
| M51-AC-4 | Backend AuthUser updated | PASS | `apps/api/src/middleware/auth.ts` — AuthUser.role includes all 10 roles |
| M51-AC-5 | User model enum updated | PASS | `apps/api/src/models/User.ts` — role enum includes all 10 roles |
| M51-AC-6 | Frontend guards updated | PASS | `apps/web/src/router/guards.tsx` — GuestOnly handles all volunteer roles and school-admin/admin routing |
| M51-AC-7 | UserProfileDTO uses UserRole | PASS | `apps/api/src/services/auth.service.ts` — role field uses `UserRole` type from `@educore/types` |
| M51-AC-8 | typecheck passes | PASS | `pnpm run typecheck` — 9/9 packages PASS |
| M51-AC-9 | build passes | PASS | `pnpm --filter @educore/web run build` — PASS |

## Verification Commands Executed

```
pnpm run typecheck → 9/9 successful (exit 0)
pnpm --filter @educore/web run build → built in 5.92s (exit 0)
```

## Known Risks

1. **No e2e tests for new roles**: Existing e2e tests cover student/parent/teacher journeys only. New volunteer roles have no e2e coverage yet.
2. **RegisterInput still limited**: Registration only allows student/parent/teacher roles. Volunteer roles need admin-approved onboarding (by design, per M63-M66 roadmap).
3. **No runtime permission checks**: Permission matrix is defined but not yet enforced at runtime in API routes. M52-M53 will add consent and fairness enforcement.

## Decision

**Accepted** — All Must Pass items have objective evidence. Role & permission model is defined, type-safe, and verified. Ready for M52.
