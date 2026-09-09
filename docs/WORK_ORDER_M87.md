# WORK_ORDER_M87 - Governance Rebaseline + Hardware Simulation Gate

状态：`Dispatched`  
前置：M82-M86 final handoff accepted with notes/deferrals（`docs/HANDOFF_M82_M86_FINAL_2026-08-21.md`）  
类型：Docs + bounded API test harness（无真实硬件）

## Objective

1. 将治理文件从 M82-M86 收口状态同步到 M87。
2. 用**硬體路徑模擬測**替代真实树莓派 / 本机 Ollama 作为验收前置：在约束 profile 下验证
   ModelManager 降级链（Ollama → Ark stub → 规则引擎）。

## Relative goals

### M87-R1 — Governance sync（docs-only）

依赖：无  
推理等级：Standard

- [ ] 更新 `TARGET.md` / `ACCEPTANCE.md` / `STATUS.md` / `PENDING.md` / `NEXT_ACTIONS.md`
- [ ] 更新 `LOOP_STATE.md` / `LOOP_CONFIG.md` / `STOP_RULES.md` / `CMS.md` / `Work_Order_Active.md`
- [ ] 本工单成为唯一 Active Work Order

### M87-R2 — Simulation harness + tests

依赖：M87-R1  
推理等级：Deep

- [ ] `ModelManager` 支持注入 `ModelProvider[]`；默认单例行为不变
- [ ] `apps/api/tests/helpers/sim-ollama.ts`：ephemeral mock HTTP（成功 / 慢 / 宕机）
- [ ] `apps/api/tests/fixtures/edge-profiles.ts`：`pi-ok` / `pi-slow` / `pi-down` / `offline-core`
- [ ] `apps/api/tests/unit/model-manager-fallback.test.ts` 覆盖四 profile
- [ ] 测试**不**依赖 `localhost:11434` 或实体设备

### M87-R3 — Evidence + handoff

依赖：M87-R2  
推理等级：Standard

- [ ] `docs/evidence/M87/` 记录命令、exit code、profile 表
- [ ] 更新 `PLACEHOLDER_ENDPOINTS.md`：硬件路径 = Simulated-testable / Hardware paused
- [ ] Developer 标记 Ready for Controller/QA Review（不得自签 Accepted）

## Non-Goals

- 真实 Pi 部署、教室硬件交付声明
- CI 强制 Ark 真密钥
- 家长 / 学校 / 志愿者扩展；支付启用；M86 defer 项破坏性删除

## Verification commands

```bash
pnpm --filter @educore/api test
pnpm --filter @educore/api typecheck
```

## Ready for Controller/QA Review

Developer may only mark Ready for Review after M87-R1–R3 checkboxes have evidence links.
Controller/QA signs acceptance in `docs/QA_M87_ACCEPTANCE_*.md`.
