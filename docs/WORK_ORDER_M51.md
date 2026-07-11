# WORK_ORDER_M51 - Role & Permission Model

Status: Dispatched
Created: 2026-07-06
Dependency: M50 Accepted

## Milestone Goal

Define and implement the role & permission model for all 9 ecosystem roles. Each role has permissions, visible data, and forbidden actions.

## Allowed Files

- `packages/types/src/user.ts` — extend UserRole
- `packages/types/src/permissions.ts` — new permission matrix
- `packages/types/src/index.ts` — export
- `apps/api/src/middleware/auth.ts` — update AuthUser
- `apps/api/src/services/access.service.ts` — update role checks
- `apps/web/src/router/guards.tsx` — update role routing
- `apps/api/src/models/User.ts` — update role enum
- `Docs/` status files

## Relative Goals

### M51-R1 - Extend Role Types
- [ ] Add volunteer-teacher, volunteer-school, volunteer-org, volunteer-enterprise to UserRole
- [ ] Update AuthUser interface
- [ ] Update User model role enum

### M51-R2 - Create Permission Matrix
- [ ] Create packages/types/src/permissions.ts
- [ ] Define Permission, RolePermission, and PERMISSION_MATRIX
- [ ] Export from index.ts

### M51-R3 - Update Access Control
- [ ] Update access.service.ts with new role helpers
- [ ] Update guards.tsx with new role routing
- [ ] Verify typecheck passes

## Verification

- `corepack pnpm --filter @educore/types run typecheck` (or turbo typecheck)
- `corepack pnpm --filter @educore/web run typecheck`
- `corepack pnpm --filter @educore/api run typecheck`
