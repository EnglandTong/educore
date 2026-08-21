# WORK_ORDER_M83 - Owner Product & Architecture Rebaseline

状态：`Owner architecture decisions confirmed; pending M82 Controller/QA gate`（不是技术失败）  
前置：M82 Controller/QA Review；`docs/M83_OWNER_DECISION_BRIEF.md`   
类型：Governance / Planning  
范围：只确认 M84 的第一条学习闭环，不实现业务代码。

## 目标

把 EduCore 从 M82 的审计事实推进到一个由 Owner 明确签字的单一第一学习闭环、Non-Goals、掌握度权威关系和 M84 验收边界。

## Owner 必须决定

- 目标用户和唯一第一闭环：见 `M83_OWNER_DECISION_BRIEF.md` 候选 A-D；只能选一个。
- 第一闭环是否只面向学生，是否允许教师/家长观察端。
- BKT、IRT、SM-2 的职责分工和唯一掌握度事实源。
- 离线队列边界、重复提交语义、失败状态和答案展示时机。
- M84 的明确 Non-Goals。

## 交付物

- [x] M83-R1：Owner 已选择方案 A；闭环记录于 `M83_OWNER_DECISION_BRIEF.md`。
- [x] M83-R2：Owner 已确认 M84 Non-Goals 使用决策简报 Section 5。
- [x] M83-R3：`Docs/WORK_ORDER_M84.md` 已按方案 A 和掌握度权威关系生成。
- [ ] M83-R4：Controller/QA 确认 M84 可派发；未确认前不得改业务源码。

## 暂不允许

- 不实现 M84 代码、数据库迁移、算法重构或权限中间件重写。
- 不启动教师/家长协作（M85）。
- 不清理/删除占位能力（M86）。
- 不把 M82 的 mock E2E、单元测试或契约记录当作 M83/M84 运行验收。

## 停止条件

- Owner 未明确选择唯一闭环；（已解除）
- 目标或 Non-Goals 与 M82 审计事实冲突；
- 需要技术栈替换、数据库迁移、生产数据或凭证；
- M82 未完成 Controller/QA 复核。

## 当前唯一下一步

Owner 已选择方案 A，并确认掌握度权威关系与 M84 Non-Goals。当前唯一下一步：Controller/QA 完成 M82 复核并决定是否派发 M84。
