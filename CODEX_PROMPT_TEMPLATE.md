# Codex SPEC / 开发计划 输入模板

> 用法：把下面内容贴进 Codex 的 Plan Mode（`/plan` 或 `Shift+Tab`），替换 `【】` 占位符。
> 目标：让 Codex 产出**结构统一**、**下游可立即复用**的规格书 + 开发计划 + 里程碑 + 相对目标。
> 下游载体：遵循 agent-loop-engineering 的 `Docs/` 协议，任何 AI 编码 Agent（Codex / Claude Code / CodeBuddy / WorkBuddy）都能接力施工。

---

## 1. Goal（目标）
【一句话说明要构建 / 修改什么系统或能力。例如：搭建一个支持多租户的 SaaS 任务管理后端。】

## 2. Context（上下文）
- 代码库位置：`【仓库路径 / 目录】`
- 相关文件 / 模块（可用 `@` 引用）：`【列出关键文件、目录、已有设计文档】`
- 参考示例 / 竞品 / 内部规范：`【贴链接或路径】`
- 现有约束来源：`【数据库 schema、已有接口、第三方依赖等】`

## 3. Constraints（约束）
- 技术栈：`【语言 / 框架 / 运行时，如 Go + Gin + PostgreSQL】`
- 架构规范：`【分层方式、模块边界、必须/禁止做的事】`
- 安全规则：`【鉴权方式、数据脱敏、密钥管理】`
- 性能 / 规模要求：`【QPS、延迟、数据量级】`
- 编码标准：`【lint、格式化、测试覆盖率、提交规范】`
- 环境边界（agent-loop-engineering）：`【哪些必须问人：密钥/生产数据/系统安装/破坏性 Git/技术栈替换/方向冲突】`

## 4. Done when（完成条件）
SPEC 合格需同时满足：
- [ ] 已定义清晰的**目录结构 + 模块边界**（`TARGET.md` 的 Non-Goals 也要写）
- [ ] 已列出**技术选型 + 依赖清单**
- [ ] 已定义**数据模型 / 接口契约**
- [ ] 已拆出**里程碑 + 相对目标**，写进 `WORK_ORDER.md`
- [ ] 已定义**验收门禁**（`ACCEPTANCE.md`：Must Pass / 证据类型 / 失败示例）
- [ ] 已记录**已知约束 + “不要做” + 停止规则**（`STOP_RULES.md`）

---

## 5. 输出契约（强制 Codex 遵守）
请严格按 agent-loop-engineering 的 `Docs/` 协议输出，确保多 Agent 可接力、结构统一。
**必须生成/更新以下文件**（放在仓库 `Docs/` 目录）：

1. `Docs/TARGET.md` — 稳定目标契约：User Goal / Success Criteria / Non-Goals / Acceptance Evidence 类别 / Failure Examples
2. `Docs/WORK_ORDER_【编号】.md` — **开发计划 + 里程碑 + 相对目标**（Developer 唯一任务来源）
   - 阶段划分、先后依赖
   - 每个里程碑 `M1/M2…`：目标 / 交付物 / 完成判定
   - 里程碑内相对目标 `Mx-Ry`：子目标 + 相对顺序 + 依赖 + 建议推理等级
   - 分步任务 checkbox：`目标 / 涉及文件 / 验收 / 依赖 / 推理等级`
3. `Docs/ACCEPTANCE.md` — 可执行验收契约：Must Pass（含 Evidence required 与 Current evidence 占位）/ Should Pass / Manual Confirmation / Known Exclusions
4. `Docs/STOP_RULES.md` — 停止规则：Hard Stops / Budget Stops（max_loops、max_consecutive_failures）/ Project-Specific Stops
5. `Docs/LOOP_CONFIG.md` — 循环策略：runner、max_loops、core_verification、verification_commands、allow_* 边界

**格式纪律**：
- 里程碑编号 `M1/M2/M3…`；相对目标 `Mx-Ry`
- 任务用 checkbox `- [ ]`，标注依赖（如 `依赖: M1-R2`）与推理等级
- 所有架构决策进入对应章节，不在大段文字里埋决策，便于下游 grep
- 决策冲突优先级：`TARGET.md` > `ACCEPTANCE.md` > `STATUS.md` > `PENDING.md` > `NEXT_ACTIONS.md`

**下游交接说明**（写进 `WORK_ORDER.md` 头部）：
- 本计划由 Codex Plan Mode 生成，任何 Agent 均以 `WORK_ORDER.md` 为唯一任务来源
- 每个 loop 只做一个有边界的 coding 任务，完成后更新 `Docs/LOOP_STATE.md` 与 `ACCEPTANCE.md` 证据
- 完成判定只认 `ACCEPTANCE.md` 证据门禁（自动验证 + 功能验证），非聊天断言
