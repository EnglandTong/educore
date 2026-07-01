# Work Order P27-04

## Work Order ID

P27-04

## Complexity

Lite

## Task

Register the overview page route, verify integration, and produce the consolidated M27 Program handoff.

## Scope

- Add a route for the Teacher Assignment Overview page in the existing router configuration.
- Verify the page is accessible via the route (if dev server can be started; otherwise verify route registration).
- Create `Docs/HANDOFF_M27_PROGRAM_DEVELOPER.md` with consolidated evidence from all four Work Orders.
- Append entries to `Docs/LOOP_RUNS.jsonl`.
- Update `Docs/CURRENT_ROLE_INSTRUCTIONS.md` to reflect M27 status.

## Allowed Files

- `apps/web/src/router/` (add route)
- `Docs/HANDOFF_M27_PROGRAM_DEVELOPER.md` (create)
- `Docs/LOOP_RUNS.jsonl` (append)
- `Docs/CURRENT_ROLE_INSTRUCTIONS.md` (update status)
- `Docs/STATUS.md` (update status)
- `Docs/NEXT_ACTIONS.md` (update status)
- `Docs/PENDING.md` (update status)

## Not Allowed Files

- `apps/api/src/` (no backend modifications)
- `packages/algorithms/`, `modules/`
- `Docs/TARGET.md`, `Docs/STOP_RULES.md`, `Docs/ACCEPTANCE.md`

## Acceptance Criteria

- [ ] Route for overview page is registered in the router.
- [ ] `Docs/HANDOFF_M27_PROGRAM_DEVELOPER.md` exists and references all P27 Work Orders.
- [ ] Handoff includes per-Work Order evidence summary.
- [ ] `Docs/LOOP_RUNS.jsonl` contains entries for P27-01 through P27-04.
- [ ] `Docs/CURRENT_ROLE_INSTRUCTIONS.md` reflects M27 `Ready for Controller/QA Review`.
- [ ] Handoff status is `Ready for Controller/QA Review` (not `Accepted` or `Completed`).

## Design Notes

- Follow the exact route registration pattern used by existing routes.
- If existing routes use lazy loading, use lazy loading.
- The consolidated handoff should follow the same format as previous handoffs (M25, M26).

## Boundaries

- Do not modify any component files (P27-03 is complete).
- Do not create new pages or components.
- Do not claim the milestone is `Accepted` or `Completed`.

## Verification Commands

```powershell
# Verify route is registered
Select-String -LiteralPath .\apps\web\src\router\* -Pattern "AssignmentOverview","teacher.*overview" -ErrorAction SilentlyContinue

# Verify handoff exists
Test-Path -LiteralPath .\Docs\HANDOFF_M27_PROGRAM_DEVELOPER.md

# Verify handoff references all work orders
Select-String -LiteralPath .\Docs\HANDOFF_M27_PROGRAM_DEVELOPER.md -Pattern "P27-01","P27-02","P27-03","P27-04"

# Verify handoff status
Select-String -LiteralPath .\Docs\HANDOFF_M27_PROGRAM_DEVELOPER.md -Pattern "Ready for Controller/QA Review"

# Verify LOOP_RUNS.jsonl has M27 entries
Select-String -LiteralPath .\Docs\LOOP_RUNS.jsonl -Pattern "M27","P27"

# Verify no backend files were modified across entire program
git -C . diff --name-only -- apps/api/src/ packages/ modules/
# Expected: empty output
```

## Expected Developer Handoff

- Summary: Route registered, consolidated handoff published.
- Files created/modified across all four Work Orders.
- Complete evidence chain.
- Final status: `Ready for Controller/QA Review`.
