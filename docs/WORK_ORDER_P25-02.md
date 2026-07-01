# Work Order P25-02

## Work Order ID

P25-02

## Complexity

Standard

## Task

Evidence chain cross-validation (M22 -> M23 -> M24). Verify that evidence ledgers, QA acceptance records, and handoff documents form a continuous, internally consistent chain across the three most recent accepted milestones.

## Scope

- Read `Docs/EVIDENCE_LEDGER_M22.md` and `Docs/EVIDENCE_LEDGER_M24.md`.
- Read `Docs/QA_M22_ACCEPTANCE_2026-06-29.md`, `Docs/QA_M23_ACCEPTANCE_2026-07-01.md`, `Docs/QA_M24_ACCEPTANCE_2026-07-01.md`.
- Read `Docs/HANDOFF_M22_PROGRAM_DEVELOPER.md`, `Docs/HANDOFF_M23_PROGRAM_DEVELOPER.md`, `Docs/HANDOFF_M24_PROGRAM_DEVELOPER.md`.
- Cross-check that each milestone's ledger references the previous milestone's acceptance and handoff.
- Verify that M24 ledger references M23 acceptance (`QA_M23_ACCEPTANCE_2026-07-01.md`) and M23 handoff (`HANDOFF_M23_PROGRAM_DEVELOPER.md`).
- Verify that M23 acceptance references M22 acceptance and M22 ledger.
- Verify that work order IDs are consistent across program files, handoffs, and QA records (P22-*, P23-*, P24-*).

## Allowed Files

- `Docs/EVIDENCE_LEDGER_M22.md`
- `Docs/EVIDENCE_LEDGER_M24.md`
- `Docs/QA_M22_ACCEPTANCE_2026-06-29.md`
- `Docs/QA_M23_ACCEPTANCE_2026-07-01.md`
- `Docs/QA_M24_ACCEPTANCE_2026-07-01.md`
- `Docs/HANDOFF_M22_PROGRAM_DEVELOPER.md`
- `Docs/HANDOFF_M23_PROGRAM_DEVELOPER.md`
- `Docs/HANDOFF_M24_PROGRAM_DEVELOPER.md`
- `Docs/M22_PROGRAM_2026-06-29.md` (read-only reference)
- `Docs/M23_PROGRAM_2026-06-30.md` (read-only reference)
- `Docs/M24_PROGRAM_2026-07-01.md` (read-only reference)

## Not Allowed Files

- All product implementation files.
- `Docs/TARGET.md`
- `Docs/STOP_RULES.md`
- `Docs/ACCEPTANCE.md`

## Acceptance Criteria

- [ ] M24 evidence ledger references M23 QA acceptance and M23 handoff.
- [ ] M23 QA acceptance references M22 QA acceptance and M22 handoff/ledger.
- [ ] All P24 work orders (P24-01, P24-02, P24-03) are listed in M24 handoff and QA acceptance.
- [ ] All P23 work orders (P23-01, P23-02, P23-03) are listed in M23 handoff and QA acceptance.
- [ ] All P22 work orders (P22-01, P22-02, P22-03) are listed in M22 handoff and QA acceptance.
- [ ] No orphaned work order IDs exist (claimed in one file but missing in another).
- [ ] LOOP_RUNS.jsonl contains entries for all accepted work orders.

## Design Notes

- This Work Order is modeled after P24-01 (evidence ledger) but adds cross-milestone validation.
- If inconsistencies are found, Developer may append corrections to the current evidence ledger or status files within the Allowed Files list, and must document each change in the handoff.
- Use `Select-String` for automated cross-reference checks where possible.

## Boundaries

- Do not modify `Docs/TARGET.md`, `Docs/STOP_RULES.md`, or `Docs/ACCEPTANCE.md`.
- Do not create new architecture or product work.
- If a required evidence file is missing and cannot be reconstructed from accepted history, mark `Blocked`.

## Verification Commands

```powershell
# Verify M24 ledger references M23
Select-String -LiteralPath .\Docs\EVIDENCE_LEDGER_M24.md -Pattern "M23","QA_M23_ACCEPTANCE_2026-07-01","HANDOFF_M23_PROGRAM_DEVELOPER"

# Verify M24 ledger contains P24 work orders
Select-String -LiteralPath .\Docs\EVIDENCE_LEDGER_M24.md -Pattern "P24-01","P24-02","P24-03"

# Verify M22 ledger contains P22 work orders
Select-String -LiteralPath .\Docs\EVIDENCE_LEDGER_M22.md -Pattern "P22-01","P22-02","P22-03"

# Verify M24 handoff contains all P24 work orders
Select-String -LiteralPath .\Docs\HANDOFF_M24_PROGRAM_DEVELOPER.md -Pattern "P24-01","P24-02","P24-03"

# Verify M23 handoff contains all P23 work orders
Select-String -LiteralPath .\Docs\HANDOFF_M23_PROGRAM_DEVELOPER.md -Pattern "P23-01","P23-02","P23-03"

# Verify M22 handoff contains all P22 work orders
Select-String -LiteralPath .\Docs\HANDOFF_M22_PROGRAM_DEVELOPER.md -Pattern "P22-01","P22-02","P22-03"

# Verify LOOP_RUNS.jsonl contains M24 entries
Get-Content -LiteralPath .\Docs\LOOP_RUNS.jsonl -Tail 10

# Cross-check QA acceptance records reference correct milestones
Select-String -LiteralPath .\Docs\QA_M24_ACCEPTANCE_2026-07-01.md -Pattern "M24","P24-01","P24-02","P24-03","Accepted"
Select-String -LiteralPath .\Docs\QA_M23_ACCEPTANCE_2026-07-01.md -Pattern "M23","P23-01","P23-02","P23-03","Accepted"
Select-String -LiteralPath .\Docs\QA_M22_ACCEPTANCE_2026-06-29.md -Pattern "M22","P22-01","P22-02","P22-03","Accepted"
```

## Expected Developer Handoff

- Summary: Evidence chain cross-validation result.
- Cross-reference matrix showing M22 -> M23 -> M24 linkage.
- Any inconsistencies found and corrected.
- Risks: None expected unless files are missing.
- Status: `Developer Complete`.
