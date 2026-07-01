# Work Order P29-04

## Work Order ID

P29-04

## Complexity

Lite

## Task

Run Playwright e2e suite (or targeted teacher spec), create consolidated M29 handoff, and update governance state files.

## Scope

- Run `corepack pnpm --filter @educore/web run test:e2e --reporter=list`.
- If full suite fails on pre-existing unrelated tests, run targeted spec with evidence and document scope in handoff (do not fix unrelated tests outside Allowed Files).
- Create `Docs/HANDOFF_M29_PROGRAM_DEVELOPER.md`.
- Update governance files and append loop evidence.
- Set final status to `Ready for Controller/QA Review`.

## Allowed Files

- `Docs/HANDOFF_M29_PROGRAM_DEVELOPER.md` (create)
- `Docs/LOOP_RUNS.jsonl` (append)
- `Docs/LOOP_LOG_Workbuddy.jsonl` (append)
- `Docs/STATUS.md`, `Docs/NEXT_ACTIONS.md`, `Docs/PENDING.md`, `Docs/CURRENT_ROLE_INSTRUCTIONS.md`, `Docs/Work_Order_Active.md`

## Not Allowed Files

- Product or e2e source files (must be complete before P29-04)
- `Docs/TARGET.md`, `Docs/STOP_RULES.md`, `Docs/ACCEPTANCE.md`, `Docs/RUBRIC.md`
- `apps/api/src/`, `packages/`, `modules/`

## Acceptance Criteria

- [ ] E2e command run with recorded output.
- [ ] New assignments smoke test passes.
- [ ] `Docs/HANDOFF_M29_PROGRAM_DEVELOPER.md` exists referencing P29-01 through P29-04.
- [ ] Governance files updated.
- [ ] `Docs/LOOP_RUNS.jsonl` contains P29-01 through P29-04 entries.
- [ ] Final status is `Ready for Controller/QA Review` only.

## Design Notes

- Follow `Docs/HANDOFF_M28_PROGRAM_DEVELOPER.md` structure.
- Include full or excerpted e2e reporter output showing new test pass count.
- Note if full suite was run vs targeted spec.

## Boundaries

- No product or e2e code changes in this Work Order.
- Do not self-accept.
- Stop as Blocked if e2e cannot run due to missing Playwright browsers and installation would violate STOP_RULES.

## Verification Commands

```powershell
Test-Path -LiteralPath .\Docs\HANDOFF_M29_PROGRAM_DEVELOPER.md
Select-String -LiteralPath .\Docs\HANDOFF_M29_PROGRAM_DEVELOPER.md -Pattern "P29-01","P29-02","P29-03","P29-04","Ready for Controller/QA Review"
Select-String -LiteralPath .\Docs\LOOP_RUNS.jsonl -Pattern "P29-01","P29-02","P29-03","P29-04"
corepack pnpm --filter @educore/web run test:e2e --reporter=list
```

## Expected Developer Handoff

- Consolidated Program summary with e2e evidence.
- Per-Work Order evidence table.
- Known risks and deferred items.
- Final status: `Ready for Controller/QA Review`.
