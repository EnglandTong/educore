# WORK_ORDER_M86 - Placeholder Disposition

状态：`Accepted-with-deferrals — 2026-08-21`  
前置：M84 `Accept-with-notes`  
类型：Cleanup / documentation-first

## Objective

对 EduCore 未完成的 placeholder/orphan capability 做逐项处置：`productize`、永久
`501`、`delete` 或 `defer`，不得用空成功响应伪装完成。

## Initial disposition matrix

| Surface | Evidence | M86 disposition | Action |
|---|---|---|---|
| School classes | `docs/PLACEHOLDER_ENDPOINTS.md` | `defer` | 保留文档标记，等待 M85/Owner 学校范围授权 |
| TeacherAssignment | audit matrix | `defer` | 不扩展教师协作，等待 M85 |
| Volunteer dashboard | audit matrix | `defer` | 不进入本轮协作范围 |
| `progress-store` | no app consumer | `defer` | 先保留，避免误删潜在离线契约 |
| `questions-store` | no app consumer | `defer` | 先保留，避免误删题目缓存契约 |
| Sync status | former placeholder | `productize` | 已由 M84 `AnswerEvent/SyncEvent` 部分实现，保留后续观察项 |
| Invalid math seed JSON | `modules/math-algebra/seeds/B1.json` | `productize` | 已修复为可解析数据并通过 module-loader parse |

## Acceptance

- [x] 每一项有 Owner/Controller 可追踪处置和代码/文档证据。详见 `docs/QA_M86_DISPOSITION_2026-08-21.md`。
- [x] 没有未标记的 pseudo-success surface。
- [x] 删除动作若未来必要，必须单独确认精确目标和可恢复性；本轮未执行删除。
