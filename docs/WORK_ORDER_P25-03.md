# Work Order P25-03

## Work Order ID

P25-03

## Complexity

Standard

## Task

Governance documentation consistency pass. Ensure that all governance files use consistent terminology, milestone IDs, timestamps, and reference patterns. Update `Docs/CURRENT_ROLE_INSTRUCTIONS.md` and any other allowed files to reflect the verified M24 baseline.

## Scope

- Read `Docs/CURRENT_ROLE_INSTRUCTIONS.md` and verify it reflects the current state (no active program/work order, M24 accepted).
- Read `Docs/EVALUATION.md` and verify it is consistent with `Docs/COMPLETED.md` and `Docs/STATUS.md`.
- Verify consistent use of milestone names and IDs across all governance files.
- Verify timestamps are in ISO 8601 format with timezone offset (`+08:00`).
- Verify that file path references (e.g., `docs/...` vs `Docs/...`) are consistent within each file.
- If inconsistencies are found, correct them within Allowed Files.
- Append a consistency log documenting what was checked and any changes made.

## Allowed Files

- `Docs/CURRENT_ROLE_INSTRUCTIONS.md`
- `Docs/EVALUATION.md`
- `Docs/STATUS.md`
- `Docs/NEXT_ACTIONS.md`
- `Docs/PENDING.md`
- `Docs/COMPLETED.md`
- `Docs/CMS.md`
- `Docs/ROLE_ASSIGNMENT.md`
- `Docs/LOOP_CONFIG.md`

## Not Allowed Files

- All product implementation files.
- `Docs/TARGET.md`
- `Docs/STOP_RULES.md`
- `Docs/ACCEPTANCE.md`
- `Docs/RUBRIC.md`

## Acceptance Criteria

- [ ] `Docs/CURRENT_ROLE_INSTRUCTIONS.md` states no active program/work order and references M24 acceptance.
- [ ] `Docs/EVALUATION.md` lists M24 as accepted with correct timestamp and evidence references.
- [ ] All milestone IDs follow the pattern `M{number}` with consistent naming.
- [ ] All work order IDs follow the pattern `P{number}-{seq}` with consistent naming.
- [ ] All timestamps use ISO 8601 format with `+08:00` offset.
- [ ] No contradictory status claims exist across the governance file set.
- [ ] A consistency log is appended or referenced documenting the pass.

## Design Notes

- This Work Order follows the pattern of P23-02 (execution brief completion) and P24-02 (state synchronization).
- Focus on internal consistency, not content expansion.
- If a file has minor casing inconsistencies (e.g., `docs/` vs `Docs/`), standardize them if they are within the same file.

## Boundaries

- Do not modify `Docs/TARGET.md`, `Docs/STOP_RULES.md`, or `Docs/ACCEPTANCE.md`.
- Do not change the substantive meaning of any record; only fix formatting, consistency, and stale references.
- If a substantive contradiction is found that cannot be resolved within Allowed Files, document it in the handoff and mark for Controller/QA attention.

## Verification Commands

```powershell
# Verify CURRENT_ROLE_INSTRUCTIONS.md references M24 and no active program
Select-String -LiteralPath .\Docs\CURRENT_ROLE_INSTRUCTIONS.md -Pattern "M24","No active program","No active work order"

# Verify EVALUATION.md references M24 acceptance
Select-String -LiteralPath .\Docs\EVALUATION.md -Pattern "M24.*Accepted","2026-07-01"

# Verify consistent milestone naming across key files
Select-String -LiteralPath .\Docs\STATUS.md,.\Docs\EVALUATION.md,.\Docs\COMPLETED.md -Pattern "M22 - ","M23 - ","M24 - "

# Verify timestamp format consistency (ISO 8601 with +08:00)
Select-String -LiteralPath .\Docs\STATUS.md,.\Docs\EVALUATION.md,.\Docs\COMPLETED.md -Pattern "\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00"

# Verify no active program claims in ROLE_ASSIGNMENT or LOOP_CONFIG
Select-String -LiteralPath .\Docs\ROLE_ASSIGNMENT.md,.\Docs\LOOP_CONFIG.md -Pattern "No active program","No active work order"

# Verify CMS.md reflects M24 acceptance
Select-String -LiteralPath .\Docs\CMS.md -Pattern "M24","Accepted","No active program"
```

## Expected Developer Handoff

- Summary: Governance documentation consistency pass result.
- List of files checked and any corrections made.
- Consistency log documenting format standardization.
- Any substantive contradictions flagged for Controller/QA.
- Risks: None expected.
- Status: `Developer Complete`.
