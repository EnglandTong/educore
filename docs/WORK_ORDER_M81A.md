# WORK_ORDER_M81A — 验证基线与治理状态收敛

Status: Active
Last updated: 2026-07-23T20:00:00+08:00
Milestone: M81A (hotfix within M81 Architecture Debt Repayment)
Owner: Developer
Reasoning level: High (build-breaking + security)

## 目标

恢复 Must Pass 验证基线（typecheck/build/test 全绿），收敛治理状态文件至同一 Milestone 锚点，修复已确认的数据完整性 bug 与权限边界缺陷。

## Non-Goals

- 不新增功能
- 不重构 PERMISSION_MATRIX 中间件体系（留 M82）
- 不补全 e2e / integration 测试（留 M82+）
- 不处理 placeholder endpoint 501 改造（留 M82+）

## 任务清单

- [x] T1: 重建 @educore/constants dist（删 tsbuildinfo → tsc）— P0
- [x] T2: 统一根级验证命令（确保 corepack pnpm 9.15.0 贯穿 turbo 子进程）— P0
- [x] T3: Docs rebaseline — ACCEPTANCE/STATUS/NEXT_ACTIONS/PENDING/CMS/Work_Order_Active 对齐 M81A — P0
- [x] T4: 修复 school.routes.ts add-teacher 将 schoolId 误写入 teacherIds — P1
- [x] T5: 修复 school.routes.ts remove-teacher 未从 teacherIds 移除 + role 降级逻辑 — P1
- [x] T6: qa.routes.ts answer rating 增加 ownership 检查 — P1
- [x] T7: volunteer register 增加角色限制（仅 student/teacher/parent 可申请）— P1

## 验收门禁 (Must Pass)

1. `corepack pnpm --filter @educore/constants run build` → 成功，dist/mastery.d.ts 含 parseMasteryLevel + scoreToMasteryLevel
2. `corepack pnpm --filter @educore/web run typecheck` → PASS
3. `corepack pnpm --filter @educore/api run typecheck` → PASS
4. `corepack pnpm --filter @educore/web run build` → PASS
5. `corepack pnpm --filter @educore/api run test` → ALL PASS
6. `corepack pnpm --filter @educore/algorithms run test` → ALL PASS
7. `corepack pnpm --filter @educore/validation run test` → ALL PASS
8. Docs 六文件均指向 M81A 当前状态

## 依赖

- T2 依赖 T1（constants build 通过后才能验证 turbo typecheck）
- T3 无代码依赖，可并行
- T4-T7 独立于 T1-T2
