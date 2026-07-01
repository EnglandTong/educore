# Work Order P28-01

## Work Order ID

P28-01

## Complexity

Standard

## Task

Verify that `@educore/web` typecheck and production build succeed for the accepted M27 deliverable. If either command fails, fix only blocking TypeScript errors in M27-created or M28-allowed frontend files. Record full command evidence.

## Scope

- Run `corepack pnpm --filter @educore/web run typecheck`.
- Run `corepack pnpm --filter @educore/web run build`.
- Fix only blocking errors in files created or touched by M27 and listed in Allowed Files.
- Do not attempt repo-wide refactors or fixes outside scope.

## Allowed Files

- `apps/web/src/pages/teacher/AssignmentOverviewPage.tsx`
- `apps/web/src/hooks/useTeacherClassOverview.ts`
- `apps/web/src/api/teacher.ts`
- `apps/web/src/router/routes.ts`
- `apps/web/src/router/lazyRoutes.tsx`
- `apps/web/src/router/index.tsx`
- `Docs/LOOP_RUNS.jsonl` (append only)

## Not Allowed Files

- `apps/api/src/` (no backend modifications)
- `packages/algorithms/`, `modules/`
- Files outside M27/M28 frontend scope unless build failure is provably caused by an M27 file and cannot be fixed within Allowed Files
- `Docs/TARGET.md`, `Docs/STOP_RULES.md`, `Docs/ACCEPTANCE.md`
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- [ ] `corepack pnpm --filter @educore/web run typecheck` passes, or blocking M27-scope errors are fixed with evidence.
- [ ] `corepack pnpm --filter @educore/web run build` passes, or blocking M27-scope errors are fixed with evidence.
- [ ] Command outputs are captured in handoff evidence.
- [ ] No backend files were modified.
- [ ] If fixes were impossible within Allowed Files, work is marked `Blocked` with evidence instead of continuing.

## Design Notes

- M27 QA acceptance noted a build verification gap. This Work Order closes that gap.
- Use existing repo scripts from `apps/web/package.json`: `typecheck` runs `tsc --noEmit`; `build` runs `tsc --noEmit && vite build`.
- If `node_modules` is missing and dependency installation would be required, stop per STOP_RULES.
- Do not change product behavior in this Work Order unless required to fix a TypeScript error.

## Boundaries

- Do not modify `Badge`, `Sidebar`, or other UX files yet (P28-02 and P28-03 handle those).
- Do not create new endpoints or backend services.
- Stop if failures originate from unrelated legacy files and cannot be fixed within Allowed Files.

## Verification Commands

```powershell
# Confirm M27 files exist
Test-Path -LiteralPath .\apps\web\src\pages\teacher\AssignmentOverviewPage.tsx, .\apps\web\src\hooks\useTeacherClassOverview.ts, .\apps\web\src\api\teacher.ts

# Typecheck
corepack pnpm --filter @educore/web run typecheck

# Build
corepack pnpm --filter @educore/web run build

# Confirm no backend changes
git -C . diff --name-only -- apps/api/src/ packages/ modules/
```

## Expected Developer Handoff

- Summary of typecheck and build results.
- Full or excerpted command output showing pass/fail.
- List of files changed, if any, and why each change was required.
- Remaining risks if build passes only after minimal fixes.
- Status: `Developer Complete` before advancing to P28-02, or `Blocked` if stop conditions triggered.
