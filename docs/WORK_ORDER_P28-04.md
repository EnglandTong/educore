# Work Order P28-04

## Work Order ID

P28-04

## Complexity

Lite

## Task

Create the consolidated M28 Program Developer handoff and update governance state files so Controller/QA can review the full Program as one package.

## Scope

- Create `Docs/HANDOFF_M28_PROGRAM_DEVELOPER.md` referencing P28-01 through P28-03.
- Update `Docs/STATUS.md`, `Docs/NEXT_ACTIONS.md`, `Docs/PENDING.md`, `Docs/CURRENT_ROLE_INSTRUCTIONS.md`, and `Docs/Work_Order_Active.md`.
- Append loop evidence to `Docs/LOOP_RUNS.jsonl` and `Docs/LOOP_LOG_Workbuddy.jsonl`.
- Set final Program status to `Ready for Controller/QA Review`.

## Allowed Files

- `Docs/HANDOFF_M28_PROGRAM_DEVELOPER.md` (create)
- `Docs/LOOP_RUNS.jsonl` (append)
- `Docs/LOOP_LOG_Workbuddy.jsonl` (append)
- `Docs/STATUS.md`
- `Docs/NEXT_ACTIONS.md`
- `Docs/PENDING.md`
- `Docs/CURRENT_ROLE_INSTRUCTIONS.md`
- `Docs/Work_Order_Active.md`

## Not Allowed Files

- Product source files (all product changes must be complete before P28-04)
- `Docs/TARGET.md`, `Docs/STOP_RULES.md`, `Docs/ACCEPTANCE.md`, `Docs/RUBRIC.md`
- `apps/api/src/`, `packages/`, `modules/`

## Acceptance Criteria

- [ ] `Docs/HANDOFF_M28_PROGRAM_DEVELOPER.md` exists.
- [ ] Handoff references P28-01, P28-02, and P28-03 with evidence summaries.
- [ ] Handoff status is `Ready for Controller/QA Review`.
- [ ] Governance files reflect M28 Program completion and await QA review.
- [ ] `Docs/LOOP_RUNS.jsonl` contains entries for P28-01 through P28-04.
- [ ] Developer did NOT mark Program as `Accepted` or `Completed`.

## Design Notes

- Follow structure of `Docs/HANDOFF_M27_PROGRAM_DEVELOPER.md`.
- Include build command outputs from P28-01, Badge change summary from P28-02, and sidebar link summary from P28-03.
- Note any deferred items, especially the dedicated assignments API endpoint.

## Boundaries

- Do not modify product code in this Work Order.
- Do not self-accept the milestone.
- Do not delete or rewrite prior evidence; append only.

## Verification Commands

```powershell
# Handoff exists
Test-Path -LiteralPath .\Docs\HANDOFF_M28_PROGRAM_DEVELOPER.md

# Handoff references all work orders
Select-String -LiteralPath .\Docs\HANDOFF_M28_PROGRAM_DEVELOPER.md -Pattern "P28-01","P28-02","P28-03","P28-04"

# Handoff status
Select-String -LiteralPath .\Docs\HANDOFF_M28_PROGRAM_DEVELOPER.md -Pattern "Ready for Controller/QA Review"

# Loop runs coverage
Select-String -LiteralPath .\Docs\LOOP_RUNS.jsonl -Pattern "P28-01","P28-02","P28-03","P28-04"

# Status file consistency
Select-String -LiteralPath .\Docs\STATUS.md,.\Docs\NEXT_ACTIONS.md,.\Docs\PENDING.md,.\Docs\CURRENT_ROLE_INSTRUCTIONS.md -Pattern "M28","P28-01","Ready for Controller/QA Review"
```

## Expected Developer Handoff

- Consolidated Program summary.
- Per-Work Order evidence table.
- Known risks and deferred follow-ups.
- Final status: `Ready for Controller/QA Review`.
