# PROJECT_BOARD — EduCore 功能 / 目标 / 状态 / 进度 / 下一步

Last updated: 2026-09-09  
Authority: `TARGET.md` > `ACCEPTANCE.md` > this board > `STATUS.md` > `PENDING.md` > `NEXT_ACTIONS.md`  
Standing rule: **禁止**以真实树莓派 / 本机 Ollama 作为 CI/QA 前置；模拟绿灯 ≠ 教室硬件交付。

---

## 1. 一句话现状

EduCore 是弱网优先的学习产品原型。学生主链（M84）与教师只读（M85）已 Accept-with-notes；占位处置（M86）已 Accept-with-deferrals；**M87 硬件→模拟测门禁 Developer 已交付、待 Controller/QA 签署**。下一程序为 **Pilot Core（M88–M92）**，尚未开票。

---

## 2. 目标（Goals）

### 2.1 产品长期目标

让偏远 / 弱网学生能持续学习；有条件时再用 AI；不把未完成能力写成已交付。

### 2.2 当前程序目标 — Pilot Core（模拟测优先）

把系统收成**可诚实演示的试试点核**：学生可学、教师可看、弱网/AI 降级可测、身份边界可证——全程用模拟约束代替真实硬件。

### 2.3 Non-Goals（当前）

- 真实 Raspberry Pi / 边缘站部署与捐赠套件宣称
- 志愿者直连学生、企业/人才匹配、支付/捐赠启用
- 学校 classes 完整 CRUD；破坏性删除 M86 defer 的 orphan stores
- 技术栈替换、生产部署、真实学生数据

---

## 3. 功能真相板（Capability）

标签：`Implemented*` = 有运行证据仍可能有 notes；`Partial`；`Contract Only`；`Placeholder`；`Simulated-testable`；`Deferred`；`Non-Goal`。

| 功能 | 状态 | 进度 | 证据 / 备注 | 下一步归属 |
|---|---|---|---|---|
| 学生登录 / refresh / logout | Partial→趋稳 | M84 真实链已证 | M84 QA | M89 共享设备清理 |
| 训练 → 选题 → 作答 → 服务端判分 | Implemented* | M84 Accept-with-notes | `QA_M84` | M90 硬化 DTO/幂等 |
| BKT `pKnown` 掌握度权威 | Implemented* | M83 锁定 + M84 DB 断言 | M83 brief / M84 | 保持；派生分不得反客为主 |
| IRT 选题 / SM-2 复习调度 | Partial | 算法+接入 | algorithms + learning service | M90 运行证据 |
| 错题 / 下一题 | Implemented* | M84 | M84 | M90 |
| 离线答题队列 + 重放 | Partial* | M84 浏览器重放通过；IndexedDB 直接观测有 notes | M84 notes | **M91** |
| Sync status | Partial — M84 | 已非假空成功 | PLACEHOLDER | M91 可观测性 |
| AI：Ollama → Ark → 规则引擎 | Simulated-testable | M87 四 profile 单测绿 | `evidence/M87` | **M91** 扩 profile；硬件仍 paused |
| 教师只读已分配学生进度 | Implemented* | M85 Accepted-with-notes | M85 | M89 deny 矩阵补全 |
| 家长 linked-child 只读 | Partial / Deferred | 代码在；未进当前程序 | REBASELINE | Owner 确认后才进 M92+ |
| 学校 classes | Placeholder | 固定空列表 | PLACEHOLDER | Deferred |
| TeacherAssignment 扩展写 | Deferred | 只读+部分 upsert | M86 | Deferred |
| 志愿者看板 / Q&A | Thin shell / Non-Goal | 无数据 fetch | PLACEHOLDER | Non-Goal |
| 捐赠 / 支付 | Non-Goal / 须禁用 | 不得伪 completed | finish-line | M89 确认禁用 |
| 内容模块（grammar/math/…） | Partial | 多模块种子；曾修非法 JSON | modules/ | M88 全量校验门禁 |
| Web lint / 单测门禁 | Weak | lint 曾为 echo；0-test 可假绿 | HANDOFF_2026-08-17 | **M88** |
| Docker / compose 真实拓扑烟测 | Partial | 有 docker/；缺强制 CI 烟测 | docker/ | **M88** |
| 真实树莓派离线基站 | Hardware paused | 非交付物 | README | 独立 Owner 程序；不阻塞试点 |

\*Accept-with-notes：可用但有观测/范围限制，不得宣传为生产就绪。

---

## 4. 里程碑进度（Progress）

| 里程碑 | 目标（一句话） | 状态 | 进度 |
|---|---|---|---|
| M50–M80 | 契约/文档里程碑（≠ 运行能力） | Closed（历史） | 100% 契约级 |
| M82 | 全系统审计与能力真相 | Accept-with-notes | Done |
| M83 | Owner 选定第一学习闭环 + BKT 权威 | Confirmed | Done |
| M84 | 学生端到端学习主链 | Accept-with-notes | Done |
| M85 | 教师只读协作确认 | Accepted-with-notes | Done |
| M86 | Placeholder 逐项处置 | Accepted-with-deferrals | Done |
| **M87** | 治理重基线 + 硬件→模拟测门禁 | **Ready for QA** | Developer 100%；QA 0% |
| M88 | Runtime Truth：干净启动与真绿灯 | Planned | 0%（待 M87 签署） |
| M89 | Identity & Privacy：注册/授权/换号不泄漏 | Planned | 0% |
| M90 | Learning Integrity：DTO/幂等/报告/内容矩阵 | Planned | 0% |
| M91 | Weak-Net Sim：扩展模拟约束 + 非 mock 断网重放 | Planned | 0% |
| M92 | Minimum Pilot Loop：学生+教师演示与就绪清单 | Planned | 0% |

```text
M82 ── M83 ── M84 ── M85 ── M86 ── M87(QA) ── M88 ── M89 ── M90 ── M91 ── M92 ── Owner试点裁决
[======== closed ========]  [now]   [==== Pilot Core planned ====]
```

---

## 5. 下一步（Next）

### 5.1 立即（唯一）

1. **Controller/QA** 审阅并签署 `docs/QA_M87_ACCEPTANCE_2026-09-09.md`（对照 `docs/evidence/M87/`）。
2. 签署后合并 PR：https://github.com/EnglandTong/educore/pull/4  
3. **在此之前不得开 M88 功能工单。**

### 5.2 M87 通过后的下一工单

- 派发 `WORK_ORDER_M88` — Runtime Truth（pnpm 钉死、compose 烟测、全种子校验、真实 web lint / 禁零测假绿）。

### 5.3 明确不做（直到 Owner 新目标）

家长扩展、学校 classes、志愿者、支付、真实 Pi、删除 orphan IndexedDB。

---

## 6. 关键指针

| 文件 | 用途 |
|---|---|
| `docs/TARGET.md` | 稳定目标与 Non-Goals |
| `docs/ACCEPTANCE.md` | 当前门禁 Must Pass |
| `docs/STATUS.md` | 压缩状态 |
| `docs/PENDING.md` | 进行中 / 等待 |
| `docs/NEXT_ACTIONS.md` | 唯一下一步 |
| `docs/WORK_ORDER_M87.md` | 当前工单 |
| `docs/PLACEHOLDER_ENDPOINTS.md` | 占位与硬件模拟标签 |
| `docs/HANDOFF_M82_M86_FINAL_2026-08-21.md` | 上轮程序收口 |
| `docs/HANDOFF_M87_PROGRAM_DEVELOPER.md` | M87 Developer 回交 |
| `docs/QA_M87_ACCEPTANCE_2026-09-09.md` | M87 待签 QA 包 |
