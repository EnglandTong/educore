# Work Order P15-01 - Acceptance Evidence Index

Program: `docs/M15_PROGRAM_2026-06-20.md`
Status: Pending Developer

## Work Order ID

`P15-01`

## Complexity

Standard

## Task

Create a release-candidate evidence index that maps each `docs/ACCEPTANCE.md` Must Pass item to current evidence paths, verification commands, and latest known timestamps.

## Scope

- Review `docs/ACCEPTANCE.md`, M14 acceptance evidence, and current loop state.
- Create or update a dedicated M15 evidence index.
- Update status and handoff files with exact commands, timestamps, and evidence paths.

## Allowed Files

- `docs/EVIDENCE_INDEX_M15.md`
- `docs/STATUS.md`
- `docs/NEXT_ACTIONS.md`
- `docs/PENDING.md`
- `docs/COMPLETED.md`
- `docs/LOOP_RUNS.jsonl`
- `docs/LOOP_LOG_Workbuddy.jsonl`
- `docs/LOOP_STATE_Workbuddy.md`
- `docs/WORK_ORDER_ACTIVE.md`
- `docs/Work_Order_Active.md`

## Not Allowed Files

- `agent-loop-check.ps1`
- `apps/**`
- `packages/**`
- `modules/**`
- `.env`
- `.env.*`
- `.git/**`
- `node_modules/**`
- Any path outside `D:\Development\EduCore`

## Acceptance Criteria

- `docs/EVIDENCE_INDEX_M15.md` exists.
- Every Must Pass item in `docs/ACCEPTANCE.md` is mapped to at least one current evidence path and one verification command or documented evidence source.
- Evidence paths are relative repository paths and point to existing files where applicable.
- No acceptance pass condition is lowered or rewritten.
- `Select-String -LiteralPath .\docs\EVIDENCE_INDEX_M15.md -Pattern "Repository integrity","Adaptive learning algorithms","Core learner smoke flow","Student UX copy","Agent Loop evidence"` returns matches.

## Design Notes

- This is documentation and traceability work only.
- Prefer concise tables or checklists.
- Do not delete or rewrite historical evidence; append current references.

## Boundaries

- Stop if evidence cannot be mapped without changing `docs/ACCEPTANCE.md` pass conditions.
- Stop if product code changes, production credentials, or external services are required.
- Stop if any evidence path would require writing outside the repository.

## Verification Commands

- `Select-String -LiteralPath .\docs\EVIDENCE_INDEX_M15.md -Pattern "Repository integrity","Adaptive learning algorithms","Core learner smoke flow","Student UX copy","Agent Loop evidence"`

## Expected Developer Handoff

Developer must return:

- Summary of evidence index created.
- Exact verification commands and results.
- Completion timestamp in Asia/Shanghai time.
- Evidence paths updated.
- Skipped checks and reasons, or `None`.
- Remaining risks or `None`.

## Program Continuation

If all acceptance criteria pass and no stop rule is triggered, Developer may continue to `docs/WORK_ORDER_P15-02.md`.
