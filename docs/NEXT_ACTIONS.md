# NEXT ACTIONS

Status: M87 Ready for QA
Last updated: 2026-09-09T16:00:00+08:00  
Board: `docs/PROJECT_BOARD.md`

## Current Next Action (only one)

**Controller/QA:** Review and decide `docs/QA_M87_ACCEPTANCE_2026-09-09.md` using `docs/evidence/M87/` and Must Pass in `docs/ACCEPTANCE.md`.

Do **not** dispatch M88 or change product scope until that decision is recorded.

## After M87 Accept

1. Merge https://github.com/EnglandTong/educore/pull/4  
2. Create and dispatch `docs/WORK_ORDER_M88.md` (Runtime Truth)  
3. Update TARGET/STATUS/PENDING/CMS to M88 Active

## Latest Baselines

| Kind | Ref |
|---|---|
| Runtime accepted | M84 Accept-with-notes |
| Collaboration confirmed | M85 teacher read-only |
| Placeholder disposition | M86 Accepted-with-deferrals |
| Sim hardware gate | M87 Developer complete / QA pending |

## Verification Commands (M87)

```bash
pnpm --filter @educore/api test
pnpm --filter @educore/api typecheck
```

No live Ollama or physical Pi required.
