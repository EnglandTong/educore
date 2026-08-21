# WORK_ORDER_M84 - Core Learning Loop Reliability

状态：`Accepted-with-notes — 2026-08-21`  
前置：M82 Controller/QA Review；M83 Owner 已选择方案 A。  
类型：Runtime / Mixed  
范围：只实现一条学生学习闭环，不扩展教师、家长、学校或志愿者协作。

## Owner-confirmed target

> 学生登录 → 训练/诊断 → 获取题目 → 作答 → 服务端判分 → 掌握度 → 错题/下一题。

M84 的实现切片必须保持一个学生、一个学习模块、一次训练会话和真实持久化链路可追踪。

## Architecture detail gate（需 Owner/Controller 确认）

- [x] 掌握度权威：BKT 的 `pKnown` 是唯一事实源；`score`/`level`/趋势/报告为派生读模型；SM-2 只负责复习时间表；IRT 只负责能力估计与题目选择。
- [x] 离线边界：离线答题通过幂等事件队列；客户端掌握度不得覆盖服务端；只有同步成功后才影响服务端掌握度。
- [x] 答案可见性：提交前不返回标准答案；服务端判分后才返回反馈/解析。
- [x] 失败语义：网络失败保留待同步；重复事件返回幂等结果；题目失效返回可理解的不可用状态，不伪造成功。

## Acceptance gates

- [ ] M84-R1：真实学生训练链可运行并持久化 session、answer event、mastery、wrong answer。
- [ ] M84-R2：掌握度只有一个权威来源，所有读模型从该来源派生。
- [ ] M84-R3：重复提交同一 answer event 不重复计分、不重复写错题。
- [ ] M84-R4：网络失败 → IndexedDB 入队 → 恢复联网 → 重放 → 成功删除；失败重试有上限和可见状态。
- [ ] M84-R5：真实 API + 浏览器证据覆盖成功、拒绝、错误、重试和持久化恢复。
- [ ] M84-R6：安全 allow/deny、数据一致性、独立 QA 全部通过后才 Accepted。

## Non-Goals

- 不做教师班级、家长绑定、学校管理、志愿者 Q&A 或社区协作（M85）。
- 不处理占位接口和 orphan stores 的最终去留（M86）。
- 不替换技术栈、不迁移数据库、不重写全部算法。
- 不使用 mock E2E、单元测试或构建成功替代真实学习链验收。

## Stop rules

- Owner/Controller 未确认 architecture detail gate；
- 需要数据库迁移、技术栈替换、生产数据、凭证或外部 provider；
- 同一失败签名连续两次无新证据；
- 发现教师/家长/商业化等越界需求。

## Next action

M84 acceptance is recorded in `docs/QA_M84_ACCEPTANCE_2026-08-21.md`; the IndexedDB
observation note remains a follow-up risk. M85/M86 are separate scopes.

## Pre-dispatch implementation deltas from M82 evidence

These are bounded implementation targets to be confirmed at dispatch; they are not completed
acceptance claims:

- [ ] M84-R1a：修复并验证训练结束路径的真实 API 错误；保留可理解的失败语义。
- [x] M84-R1b：为 answer event 定义服务端接收的稳定 `eventId`，建立学生/事件唯一约束，重复 replay 返回同一幂等结果而非普通失败。证据：`docs/evidence/M84-R1-EVIDENCE.md`。
- [ ] M84-R1c：服务端以 BKT `pKnown` 更新为唯一权威写路径；`score`、`level`、趋势和报告从权威状态派生，客户端不得提交这些字段。
- [ ] M84-R1d：离线队列把 `eventId` 原样传入同步 API；断网、恢复、重放、成功删除、失败重试上限和可见状态均有真实证据。当前已证明断网/恢复/重放，IndexedDB 删除和重试上限仍待补证。
- [ ] M84-R1e：修复真实 Web→API 本地 CORS/运行配置，并用系统浏览器完成登录到作答的成功与失败路径。
- [ ] M84-R1f：修复或隔离题库 seed 的非法 JSON 数据质量问题；不得用 mock 或伪造成功掩盖题目不可用。

Dispatch remains gated by M82 Controller/QA disposition and the existing Owner-confirmed
Non-Goals.
