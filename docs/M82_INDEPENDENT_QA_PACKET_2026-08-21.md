# M82 Independent QA Packet — 2026-08-21

用途：交给独立 QA / Owner 作最终 M82 gate decision。本文不代替独立签字。

## Decision options

- `Accept`：MP1–MP8 全部有足够证据，允许进入 M83/M84 dispatch。
- `Accept-with-notes`：明确列出不影响 M84 的风险和 Owner 接受人；不得把未验收核心学习链当作已完成。
- `Reject`：保持 M84 冻结，创建修复/补证据 Work Order。

## MP evidence matrix

| Gate | Current evidence | Assessment | Independent QA action |
|---|---|---|---|
| MP1 | `docs/evidence/M82/QC-2026-08-21-*` | 自动检查通过；Web lint no-op、Web unit tests 为空；真实浏览器未完成 | Review command logs and decide sufficiency |
| MP2 | `docs/REBASELINE_AUDIT.md` | 已有能力真值矩阵和代码引用 | Confirm citations and labels |
| MP3 | `docs/evidence/M82/M82-AUTHORIZED-RUNTIME-EVIDENCE.md` | 仅部分 HTTP 学习链；训练结束、浏览器和其余链缺口 | Reject unless seven-chain coverage is accepted with explicit gaps |
| MP4 | `docs/evidence/M82/M82-R4-permission-tests.log` + QC review | 有 mock-backed/targeted evidence；完整真实跨账户矩阵不足 | Verify allow/deny/IDOR scope |
| MP5 | `docs/evidence/M82/M82-R5-PLACEHOLDER-CROSSCHECK.md` | 已交叉核对已知 placeholder；M84 sync status 缺口已实证 | Confirm no pseudo-success surface is claimed as complete |
| MP6 | `docs/REBASELINE_AUDIT.md` | P0/P1/P2 清单存在 | Confirm severity rationale |
| MP7 | `docs/M81A_REVERIFICATION_DECISION_INPUT.md` | Developer/Controller 输入，不是独立 QA 决定 | QA must write and sign Accept/Notes/Reject |
| MP8 | governance docs + `docs/M82_CONTROLLER_DISPOSITION_2026-08-21.md` | 大体指向 M82；当前 disposition 为 Reject/Return | Confirm no stale acceptance or M83 dispatch state |

## Known blockers requiring explicit decision

1. Training end returns `INTERNAL_ERROR` in authorized isolated runtime.
2. Browser login/learning acceptance is incomplete; first run exposed CORS behavior.
3. Offline replay and server-authoritative event idempotency are not proven.
4. Repository seed corpus contains invalid JSON control-character data.
5. `sync/status` was a placeholder at audit time; M84 now has a partial `AnswerEvent`-backed implementation, pending runtime acceptance.

## Boundary

M83 Owner option A and M84 authority decisions are recorded, but they do not override this
gate. No M84 source change is authorized by this packet. QA must record the decision in a
separate acceptance artifact before the Controller changes the active work order.
