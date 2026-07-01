# Work Order P27-02

## Work Order ID

P27-02

## Complexity

Standard

## Task

Create teacher assignment data fetcher and store. Based on the infrastructure findings from P27-01, create an API fetcher for teacher assignment data and a corresponding store (if using Pinia/Vuex) or state hook (if using React).

## Scope

- Create an API fetcher function that calls the existing teacher assignment endpoint(s).
- Create a store/hook that wraps the fetcher and exposes assignment data to components.
- Use existing patterns identified in P27-01 for API calls (base URL, auth headers, error handling).
- Use existing type patterns from the codebase.

## Allowed Files

- `apps/web/src/api/` (add teacher assignment fetcher file)
- `apps/web/src/stores/` (add teacher assignment store file)
- `apps/web/src/types/` (add types if needed, following existing patterns)

## Not Allowed Files

- `apps/api/src/` (no backend modifications)
- `packages/algorithms/`, `modules/`
- `Docs/TARGET.md`, `Docs/STOP_RULES.md`, `Docs/ACCEPTANCE.md`

## Acceptance Criteria

- [ ] API fetcher file exists in `apps/web/src/api/`.
- [ ] Store/hook file exists in `apps/web/src/stores/`.
- [ ] Code follows existing patterns from P27-01 findings.
- [ ] No backend files were modified.
- [ ] Code compiles without errors (verify with build command if possible).

## Design Notes

- Follow the exact patterns used by existing fetchers and stores in the codebase.
- If existing fetchers use axios, use axios. If they use fetch, use fetch.
- If existing stores use Pinia, use Pinia. If Vuex, use Vuex.
- Keep the fetcher minimal: GET request for teacher assignments list.
- The store should expose: `assignments` (data), `loading` (boolean), `error` (string | null), `fetchAssignments()` (action).

## Boundaries

- Do not create new API endpoints on the backend.
- Do not modify existing stores or fetchers.
- Do not install new dependencies.
- If the existing API pattern is unclear, document the ambiguity in the handoff and use the simplest reasonable approach.

## Verification Commands

```powershell
# Verify fetcher file exists
Test-Path -LiteralPath .\apps\web\src\api\teacherAssignment.ts
# or similar name based on existing patterns

# Verify store file exists
Test-Path -LiteralPath .\apps\web\src\stores\teacherAssignmentStore.ts
# or similar name based on existing patterns

# Verify no backend files were modified
git -C . diff --name-only -- apps/api/src/
# Expected: empty output (no changes)

# Attempt build if tooling available
# npm run build --workspace apps/web
# or: pnpm --filter web build
```

## Expected Developer Handoff

- Summary: Data fetcher and store created.
- Files created with paths.
- Build result (pass/fail/skipped).
- Any deviations from existing patterns.
- Risks: API endpoint may not return expected data format.
- Status: `Developer Complete`.
