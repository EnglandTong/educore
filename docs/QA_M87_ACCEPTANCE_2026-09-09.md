# QA_M87 — Hardware Simulation Gate — 2026-09-09

角色：Developer 已交付；本文件为 Ready-for-Review 证据包（Controller/QA 最终签署前不得视为 Accepted）

## Developer disposition

`Ready for Controller/QA Review`

## Evidence against Must Pass

| MP | Status | Evidence |
|---|---|---|
| MP1 Governance → M87 | Met (docs) | `TARGET.md`, `STATUS.md`, `PENDING.md`, `NEXT_ACTIONS.md`, `CMS.md`, `Work_Order_Active.md`, `LOOP_*`, `STOP_RULES.md` |
| MP2 Four profiles automated | Met | `apps/api/tests/unit/model-manager-fallback.test.ts`; `docs/evidence/M87/api-test.txt` (60/60) |
| MP3 pi-down / offline-core → rule | Met | same suite; `providerId=rule`, non-empty text |
| MP4 pi-slow no hang | Met | suite asserts elapsed < 2500ms with 3000ms sim delay |
| MP5 Hardware paused wording | Met | `TARGET.md`, `PLACEHOLDER_ENDPOINTS.md`, `EVIDENCE_INDEX.md` |
| MP6 No deferred destructive deletes | Met | no orphan-store deletion; payment/volunteer untouched |

## Automatic verification

- `pnpm --filter @educore/api test` → exit 0, 60 passed
- `pnpm --filter @educore/api typecheck` → exit 0

## Notes for Controller/QA

- `EnglandTong/learning-companion` was not readable from this environment (404); methodology follows EduCore’s existing「学习培伴」evidence honesty + mock-edge pattern.
- Package builds required `tsc -b --force` in a clean workspace before API tests resolved workspace packages (environment note, not product defect).

## Controller/QA decision

_Pending independent sign-off:_ Accept / Accept-with-notes / Reject
