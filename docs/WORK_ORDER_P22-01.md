# Work Order P22-01

## Work Order ID

`P22-01`

## Complexity

Standard

## Task

Create the post-recovery evidence ledger for M22.

## Scope

Developer may create a concise evidence ledger that maps the accepted M19 recovery, failed M20 review, accepted M21 recovery, and current M22 stabilization program.

## Allowed Files

- `Docs/EVIDENCE_LEDGER_M22.md`
- `Docs/LOOP_RUNS.jsonl`
- `Docs/LOOP_LOG_Workbuddy.jsonl`
- `Docs/LOOP_STATE_Workbuddy.md`

## Not Allowed Files

- Product source files outside `Docs/`
- `Docs/ACCEPTANCE.md`
- `Docs/STOP_RULES.md`
- Any file outside `D:\Development\EduCore`

## Acceptance Criteria

- `Docs/EVIDENCE_LEDGER_M22.md` exists.
- The ledger references `M19`, `M20`, `M21`, and `M22`.
- The ledger references `docs/QA_M21_ACCEPTANCE_2026-06-28.md` and `docs/HANDOFF_M20_PROGRAM_DEVELOPER.md`.
- The ledger identifies M20 as historically `Failed` and M21 as `Accepted`.
- Loop logs include a `P22-01` Developer completion entry.

## Design Notes

- Preserve failed and accepted records as historical truth.
- Use existing evidence paths only.
- Do not invent verification results.

## Boundaries

- Docs-only ledger work.
- No product code changes.
- No acceptance-condition changes.
- Stop if the evidence chain cannot be reconstructed from existing files.

## Verification Commands

- `Test-Path -LiteralPath .\Docs\EVIDENCE_LEDGER_M22.md`
- `Select-String -LiteralPath .\Docs\EVIDENCE_LEDGER_M22.md -Pattern "M19","M20","M21","M22","QA_M21_ACCEPTANCE_2026-06-28","HANDOFF_M20_PROGRAM_DEVELOPER","Failed","Accepted"`
- `Select-String -LiteralPath .\Docs\LOOP_RUNS.jsonl,.\Docs\LOOP_LOG_Workbuddy.jsonl -Pattern "P22-01","EVIDENCE_LEDGER_M22"`

## Expected Developer Handoff

Developer must report:

- changed files;
- verification commands and results;
- manual checks;
- skipped checks;
- known risks;
- whether `P22-02` can start.

