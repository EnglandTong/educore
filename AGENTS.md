# AGENTS.md

> 给 agent 看的 README。Codex / Claude Code / CodeBuddy / WorkBuddy 自动加载到上下文。

## 规划纪律（强制）
- 任何多步骤或架构级任务，**必须先进入 Plan Mode（`/plan`）产出规格书，再执行**。禁止跳过规划直接写代码。
- Plan Mode 产出**必须写入仓库 `Docs/` 目录**，并严格遵循 agent-loop-engineering 协议：
  - `Docs/TARGET.md` — 稳定目标（含 Non-Goals）
  - `Docs/WORK_ORDER_【编号】.md` — 开发计划 / 里程碑 `Mx` / 相对目标 `Mx-Ry` / 分步任务
  - `Docs/ACCEPTANCE.md` — 验收门禁（Must Pass + 证据）
  - `Docs/STOP_RULES.md` — 停止规则
  - `Docs/LOOP_CONFIG.md` — 循环预算
- 编号规则：里程碑 `M1/M2…`，相对目标 `Mx-Ry`，任务用 `- [ ]` 并标注依赖与推理等级。

## 下游交接（多 Agent 接力）
- Developer 以 `WORK_ORDER.md` 为唯一任务来源；`TARGET.md` 守方向，`ACCEPTANCE.md` 守验收。
- 每 loop 只做一个有边界任务；结束更新 `Docs/LOOP_STATE.md` 与 `ACCEPTANCE.md` 证据。
- 完成判定只认 `ACCEPTANCE.md` 证据（自动验证 + 功能验证），非聊天断言。
- 决策冲突优先级：`TARGET.md` > `ACCEPTANCE.md` > `STATUS.md` > `PENDING.md` > `NEXT_ACTIONS.md`。

## 停止规则（硬门禁）
- 密钥 / 生产数据 / 系统安装 / 破坏性 Git / 技术栈替换 / 方向冲突 → 必须停止问人。
- 预算（max_loops / max_consecutive_failures）耗尽 → 标 `Blocked` 并写 `Docs/HANDOFF.md`。

## 上下文纪律（省 token）
- 持久性规则写在这里与 `Docs/`，不要反复写进 prompt（避免上下文膨胀）。
- 每 loop 只读当前所需的最小 `Docs/` 状态，不加载整段聊天历史。

## 完成定义
- 每个 checkbox 对应一个可验证交付物（测试通过 / 行为变更 / bug 不复现）。
- 变更后跑 lint / 测试 / 类型检查闭环再交付。
