# M83 Owner 决策简报：唯一第一条学习闭环

状态：`Owner Confirmed Option A and mastery authority; M82 QA gate pending`  
前置：M82 审计包 `docs/REBASELINE_AUDIT.md` 已进入 Controller/QA Review。  
本文件是决策输入，不是 Owner 签字，不授权 M84 开始实现。

## 1. 决策问题

Owner 需要只选择一条 EduCore 第一学习闭环，作为 M84 唯一实现目标。其他教师、家长、志愿者、学校、成长档案和社区能力在 M84 期间不得扩展。

## 2. 候选方案

| 方案 | 闭环 | 当前代码基础 | 主要风险 | M84 适配度 |
|---|---|---|---|---|
| A（建议审议） | 学生登录 → 训练/诊断 → 获取题目 → 作答 → 服务端判分 → 掌握度 → 错题/下一题 | `learning.routes.ts`、`learning.service.ts`、BKT/IRT/SM-2、Training/Diagnostic 页面 | 掌握度字段多源；答题重复提交和真实持久化未证实；答案暴露风险需先处理 | 高 |
| B | 学生诊断 → 个性化学习路径 → 节点训练 → 进度报告 | learning path 模块、IRT、教师路径编辑器 | 路径/训练/掌握度契约复杂；超出最小核心闭环 | 中 |
| C | 教师班级 → 指派学生 → 学生训练 → 教师查看进度 | teacher routes、TeacherAssignment、教师页面 | 资源授权/IDOR、班级关系和真实教师数据仍未完成验证 | 低（后续 M85） |
| D | 家长绑定孩子 → 查看进度 → 家长指导 | GuardianLink、parent routes、家长页面 | consent、数据可见性、家庭关系运行证据不足 | 低（后续 M85） |

## 3. 建议的最小第一闭环（待 Owner 确认）

建议审议方案 A 的收缩版本：

> 一个已登录学生，在一个已加载学习模块中开始一次训练，获取一题，提交一次答案；服务端基于真实答案写入一次答题事件和一次掌握度变化；客户端展示诚实的反馈/下一题状态；重复提交、网络失败和恢复不会重复计分。

这不是最终目标，只有在 Owner 确认方案 A 后才成为 M84 目标。

## 4. M84 必须锁定的 Owner 决策

1. 第一闭环用户：仅学生，还是包含教师/家长观察端。
2. 第一闭环内容：诊断、训练，还是错题复习；建议先选训练。
3. 掌握度权威：BKT、IRT、SM-2 如何分工；不得继续让 score、BKT、level 各自成为事实源。
4. 离线范围：只允许答题队列，还是包含题目缓存和进度快照。
5. 答案可见性：学生提交前不得获得标准答案；反馈何时展示解析。
6. 失败语义：网络失败、题目失效、重复提交、服务端拒绝时的用户可见状态。

## 5. 建议 Non-Goals（M84 不做）

- 不做教师班级协作、家长绑定、学校管理、志愿者问答和社区消息扩展。
- 不做支付、捐赠、商业化、人才/志愿者匹配和新 SaaS 能力。
- 不在 M84 替换技术栈、迁移数据库或重写所有算法。
- 不以单元测试、mock E2E 或构建成功代替真实学习链验收。

## 6. Owner 签字区

- Owner 选择：`方案 A - Confirmed`
- 第一学习闭环：`学生登录 → 训练/诊断 → 获取题目 → 作答 → 服务端判分 → 掌握度 → 错题/下一题`
- M84 Non-Goals：`Confirmed - Section 5`
- 掌握度权威关系：`Confirmed - BKT pKnown is the sole authority; score/level/trend/report are derived; IRT selects/estimates; SM-2 schedules review; offline affects server only after idempotent sync`
- 决策日期：`2026-08-20`
- Owner/Controller 记录：`Owner message: 方案 A`
