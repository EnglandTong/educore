# EduCore M82 重基线审计

状态：`Ready for Controller/QA Review`（Developer 产物，未独立验收）  
审计范围：M82-R1～R5 的当前证据；仅审计，不修改 `apps/`、`packages/`、`modules/`。  
审计目的：借鉴「学习培伴」的证据方法，区分真实运行能力、部分能力、契约/代码存在与占位行为，为 M83 Owner 决策提供事实输入。

## 1. 证据边界

主要新鲜证据：`docs/evidence/M82/EVIDENCE_INDEX.md`（2026-08-17）。其中 API 54 tests、算法 53 tests、验证 18 tests、Web build 的直接 tsc/vite 检查通过；Web Playwright 17/17 通过，但使用 mock envelope，不能证明真实 API、数据库或权限行为。

因此，本文中的“Implemented”只表示代码链和现有证据足以支持该级别，不表示已完成独立 QA 或生产可用。没有真实 API/浏览器/持久化证据的能力标为 `Partial`、`Contract Only` 或 `Placeholder`。

## 2. 能力真相矩阵

| 能力 | 当前判定 | 证据 | 结论与限制 |
|---|---|---|---|
| BKT 学习更新 | Implemented（代码/单测） | `packages/algorithms/src/bkt.ts:20-60`；`apps/api/src/services/learning.service.ts:173-220` | 答题服务调用 BKT 并持久化 SkillMastery；尚缺真实 DB 答题链证据。 |
| IRT 能力估计 | Implemented（代码/单测） | `packages/algorithms/src/irt.ts:20-68`；R1 root test | 算法存在并有测试；当前不能证明已成为主要运行时学习策略。 |
| SM-2/间隔复习 | Implemented（代码/单测） | `packages/algorithms/src/spacedRepetition.ts:17-43`；learning service `:188-205` | 错题复习调度已接入；真实持久化和跨重试一致性未独立验证。 |
| 掌握度单一来源 | Partial | `packages/constants/src/mastery.ts:1-39`；`apps/api/src/services/progress.service.ts:10-32`；`apps/web/src/utils/mastery.ts` | 常量有单一映射，但服务同时保存 BKT、score、level、streak 等字段；需 M83/M84 决定权威模型。 |
| 学生训练/诊断/复习/挑战 | Partial（API/代码） | `apps/api/src/modules/learning/learning.routes.ts:31-101`；`apps/web/src/pages/student/TrainingPage.tsx`、`DiagnosticPage.tsx` | 路由和页面存在；当前 R1 E2E 是 mock-backed，真实登录→作答→落库→报告未证实。 |
| 错题持久化与复习 | Partial（API/代码） | `apps/api/src/services/learning.service.ts:149-170,207-220`；`apps/api/src/modules/wrongAnswers/wrongAnswers.routes.ts:14-35` | 有 upsert 和用户 ID 过滤；真实 API/DB 访问矩阵及幂等证据缺失。 |
| 进度/掌握度读取 | Partial | `apps/api/src/modules/progress/progress.routes.ts:11-32`；`apps/api/src/services/progress.service.ts:18-32` | API 使用当前用户 ID；真实运行和跨用户拒绝证据未完成。 |
| 离线问题缓存 | Partial | `apps/web/src/db/questions-store.ts:14-67` | IndexedDB CRUD 存在；没有证明实际训练页面消费该缓存。 |
| 离线进度快照 | Partial / Orphan risk | `apps/web/src/db/progress-store.ts:13-56` | 存储函数存在；尚未证明有产品调用方或恢复语义。 |
| 离线提交队列 | Partial | `apps/web/src/db/sync-queue.ts:12-93` | 支持答题/结束会话、重试、online 触发；没有幂等键、服务端去重或真实断网恢复证据。 |
| 服务端 sync batch | Partial | `apps/api/src/modules/sync/sync.service.ts:9-57` | 可逐项处理并返回失败；没有 sync log/去重；状态接口明确为占位。 |
| Sync 状态 | Placeholder | `apps/api/src/modules/sync/sync.service.ts:59-64`；`docs/PLACEHOLDER_ENDPOINTS.md` | 固定返回 `{pendingOperations:0,lastSyncedAt:null}`，不能宣称已实现。 |
| 教师班级/学生详情 | Partial（代码） | `apps/api/src/modules/teacher/teacher.routes.ts:13-32`；Web teacher pages | 有路由与角色检查；学生是否属于教师班级的资源级授权、真实浏览器链未完成。 |
| 家长子女进度 | Partial（代码） | `apps/api/src/services/access.service.ts:14-25`；parent routes/pages | 有 GuardianLink/consent 检查；真实授权与越权拒绝尚无 M82 HTTP 证据。 |
| 学校教师管理 | Partial | `apps/api/src/modules/school/school.routes.ts:81-109` | 教师增删有 schoolId 过滤；学校班级接口仍为占位。 |
| 学校班级管理 | Placeholder | `apps/api/src/modules/school/school.routes.ts:111-116`；`docs/PLACEHOLDER_ENDPOINTS.md` | 永远返回空 classes。 |
| 志愿者 Q&A | Partial（代码） | `apps/api/src/modules/qa/qa.routes.ts:18-102`；volunteer routes | 有学生提问、志愿者回答、提问者评分流程；问题列表/详情的数据可见性和真实运行未证实。 |
| 家校/社区通信 | Partial | `apps/api/src/modules/community/community.routes.ts:39-91` | 有角色限制和服务调用；联系人授权、学生隐私与真实流程未完成验证。 |
| AI Tutor / provider fallback | Contract Only / Partial | `apps/api/src/modules/ai/*`；`apps/web/src/api/ai.ts` | provider 抽象和前端 API 存在；未以真实 provider 或离线规则链证明可用，不能宣称完整 AI 能力。 |
| PWA/本地数据基础设施 | Partial | `apps/web/src/db/index.ts`、`vite.config.ts`、R1 web build | 构建产物和 IndexedDB 基础存在；不能等价于离线完整可用。 |

## 3. 权限矩阵（审计基线）

| 角色 | 允许范围（设计/代码） | 必须拒绝 | 当前证据状态 |
|---|---|---|---|
| student | 自己的训练、诊断、错题、进度 | 他人数据、教师/管理员面板、未授权志愿者联系 | `packages/types/src/permissions.ts:54-70`；API 多数只做 `request.user.id` 过滤；真实 deny matrix 缺失 |
| parent | 已 consent 的 linked children 进度/指南、社区 | 未绑定子女、教师班级、直接修改学习内容 | `apps/api/src/services/access.service.ts:14-25`；真实跨儿童验证缺失 |
| teacher | 授权班级、授权学生详情、干预 | 非本班学生、直接改成绩、管理员面板 | `packages/types/src/permissions.ts:88-103`；teacher routes 主要是角色检查，资源归属需实测 |
| school-admin | 本校教师、学校级摘要/管理 | 其他学校、无上下文个人学生详情 | `apps/api/src/modules/school/school.routes.ts:81-116`；schoolId 过滤部分存在，班级仍占位 |
| volunteer | QA 问题、自己的 profile、已批准内容 | 学生个人数据、教师面板、未经审核发布 | `apps/api/src/modules/qa/qa.routes.ts:56-60`；`volunteer.routes.ts:45-52` 允许按任意 profile id 读取，需确认是否泄露敏感字段 |
| admin | 治理/学校/用户管理 | 无审计暴露学生敏感数据、绕过 consent | `packages/types/src/permissions.ts:105-120`；尚未形成真实 HTTP 审计证据 |

### 权限审计初步发现

1. `PERMISSION_MATRIX` 是声明式单一矩阵，但 `apps/api/src/middleware/auth.ts:21-47` 实际只验证 JWT 与角色；尚未证明所有路由都调用矩阵权限和资源归属检查。
2. 进度接口把 `request.user!.id` 传给服务，方向正确，但 M82 必须用两个账户/两个学生做真实 allow/deny 测试，不能由静态代码替代。
3. 志愿者 `GET /api/v1/volunteer/profile/:id` 在 `apps/api/src/modules/volunteer/volunteer.routes.ts:45-52` 按路径 ID 读取任意 profile；需在 M82-R4 确认返回字段是否仅为可公开资料，并验证非本人访问规则。
4. Q&A 的回答接口有 volunteer 角色检查，但问题详情接口没有在路由层显示问题所有权/脱敏规则；需检查 service 查询和真实访问结果。

## 4. 核心运行链证据状态

| 运行链 | 当前结论 | 证据/缺口 |
|---|---|---|
| 登录/刷新/退出 | 未完成验证 | R1 只有自动测试；需真实 API/browser session 证据。 |
| 学习/答题/错题/进度 | Partial，代码链存在 | learning routes + service 有完整调用方向；缺真实 DB/API 链。 |
| 教师班级+学生详情 | Partial | 页面和 API 存在；缺班级归属与真实浏览器链。 |
| 家长视图 | Partial | GuardianLink consent 服务存在；缺绑定/越权运行证据。 |
| 学校教师管理 | Partial | teacher CRUD 有实现；classes 明确 placeholder。 |
| 志愿者 Q&A | Partial | routes/services 存在；缺隐私和真实交互证据。 |
| 离线队列+恢复 | Partial / 未证实 | IndexedDB queue 有实现；缺断网浏览器、重放、服务端幂等证据。 |

## 5. 占位与缺陷清单（M82 初版）

### P0

当前没有仅凭代码证据可确认的 P0；真实权限运行审计尚未完成，不能据此宣称无 P0。

### P1

- P1-01：离线提交没有可见的客户端幂等键或服务端去重路径；重复重放可能重复计分。证据：`apps/web/src/db/sync-queue.ts:4-23,64-76`、`apps/api/src/modules/sync/sync.service.ts:32-52`。
- P1-02：学习主链、掌握度和错题虽有代码实现，但未有真实 API/DB/浏览器证据，当前不能作为已验收核心能力。
- P1-03：教师/家长/学生资源访问的角色检查与资源级授权分层不一致，潜在 IDOR 风险需真实矩阵验证。证据：`apps/api/src/middleware/auth.ts:39-47`、`apps/api/src/services/access.service.ts:14-29`。

### P2

- P2-01：`GET /api/v1/school/classes` 是固定空成功响应。
- P2-02：`getSyncStatus` 是固定空成功响应。
- P2-03：progress/questions IndexedDB stores 目前未找到明确产品消费证据，属于 orphan/incomplete 风险。
- P2-04：Web lint 是占位 echo，Web unit tests 当前没有有效测试文件；R1 证据已记录。
- P2-05：AI provider/fallback 只具备代码/契约证据，真实 provider 与离线规则链未验证。

## 5A. M82-R4 权限/数据边界代码审计增量

- P1-04（需真实 HTTP 确认）：`apps/api/src/modules/qa/qa.service.ts:7-15` 的问题列表按状态查询，没有按学生、同意范围或匿名化策略过滤；`qa.routes.ts:18-23` 对所有已登录角色开放。若返回 `studentId` 或个人内容，将形成学生数据可见性风险。
- P1-05（需真实 HTTP 确认）：`apps/api/src/modules/qa/qa.routes.ts:46-53` 的问题详情没有路由层角色/所有权限制，service `qa.service.ts:30-35` 直接 populate answers；需要验证学生、志愿者、家长看到的字段是否符合 `PERMISSION_MATRIX`。
- P1-06（需真实 HTTP 确认）：`apps/api/src/modules/volunteer/volunteer.routes.ts:45-52` 接受任意 profile ID，而 service `volunteer.service.ts:26-29` 直接返回完整 profile；需要验证是否存在任意志愿者资料枚举或敏感字段泄露。
- P1-07（需真实 HTTP 确认）：教师详情路由仅在 `teacher.routes.ts:19-23` 做角色检查，资源归属委托 `teacher.service.ts`；必须用非本班学生 ID 做 IDOR deny 测试，当前不能仅凭路由判定安全。
- P2-06：`school.routes.ts:54-69` 添加教师直接按 email 查找并提升为 teacher，注释明确 invite flow 尚未实现；这属于流程不完整，不应作为成熟邀请能力宣称。

本轮未修改上述代码；这些是 M82 审计发现，修复属于 M84/M85 或 Owner/Controller 另行派发的工单。

## 6. M81A 重新判定输入

建议 Controller/QA 基于 M82-R1 与本审计初版将 M81A 判为：`Accept-with-notes` 或 `Reject`，不能判为无条件 `Accepted`。

理由：自动验证多数通过，但 Web lint 无实际检查、Web E2E 使用 mock、核心运行链与权限边界未完成真实验证，且治理文件曾存在 M81A/M82 状态漂移风险。

## 7. M83 Owner 决策前必须补齐的证据

1. 真实 API allow/deny 权限矩阵：student、parent、teacher、school-admin、volunteer 至少各一正一负用例，并覆盖跨学生/跨班级/跨学校 IDOR。
2. 真实学习链：登录 → 训练/答题 → 掌握度 → 错题 → 进度读取 → 重复提交结果。
3. 真实离线链：断网入队 → 恢复联网 → 重放 → 失败重试 → 重复重放不重复计分。
4. 对 `PERMISSION_MATRIX` 声明与实际路由的差异做逐项核对。
5. 由 Owner 决定 M83 的唯一第一学习闭环，特别是 BKT、IRT、SM-2 的权威关系。

## 8. M82-R5 占位交叉核对结果

核对范围：`docs/PLACEHOLDER_ENDPOINTS.md` 与 API/Web 代码、IndexedDB 消费者引用、固定成功响应标记。

| 已登记 surface | 代码核对结果 | 当前结论 |
|---|---|---|
| `GET /api/v1/school/classes` | `apps/api/src/modules/school/school.routes.ts:111-116` 明确返回空 classes | 记录准确，保留 `Placeholder` |
| `getSyncStatus` / `/api/v1/sync/status` | `apps/api/src/modules/sync/sync.service.ts:59-64` 固定返回空状态 | 记录准确，保留 `Placeholder` |
| `progress-store.ts` | 全仓只找到其定义，无调用方 | 记录准确，保留 `Orphan / incomplete` |
| `questions-store.ts` | 全仓只找到其定义，无调用方 | 记录准确，保留 `Orphan / incomplete` |
| TeacherAssignment | `teacher.service.ts` 只读 assignment；写入路径不构成完整教师 CRUD | 记录准确，保留 `Partial` |
| VolunteerDashboardPage | 页面只渲染导航卡片，没有数据请求 | 记录准确，保留 `Thin shell` |

本轮扫描未发现第二个具有明确“固定成功响应但业务未完成”特征的新 API surface。以下项目虽未标为 Placeholder，但应保留在能力矩阵的 Partial/Contract Only：AI provider/fallback、真实离线恢复、Q&A 隐私边界、教师/家长真实资源授权。没有把普通输入框 `placeholder` 文本误报为产品占位能力。

## 9. M82-R6 汇总与交接判定

交付类别：`Governance` + `Artifact`，不是运行功能发布。

已具备的 M82 证据：

- R1：新鲜 typecheck、root test、lint、API test、Web build、Playwright 记录，见 `docs/evidence/M82/EVIDENCE_INDEX.md`；Web lint 是 no-op，Web E2E 是 mock-backed，限制已保留。
- R2：能力真相矩阵和权限矩阵，见本文第 2～3 节。
- R3：API 集成/安全目标测试 4 files / 15 tests passed，见 `docs/evidence/M82/M82-R3-EVIDENCE.md`。
- R4：access/role 测试 2 files / 11 tests passed，代码边界与未验证 IDOR 风险已记录，见本文第 5A 节。
- R5：6 类已登记占位 surface 与代码一致，未发现新固定成功伪功能，见 `docs/evidence/M82/M82-R5-PLACEHOLDER-CROSSCHECK.md`。

仍未满足的 M82/发布级证据：真实启动服务的浏览器链、跨账户 Mongo 资源权限矩阵、Q&A/志愿者资料数据可见性、离线断网重放幂等、独立 QA 结论。因此本交付只能进入 `Ready for Controller/QA Review`，不能标记 `Accepted` 或 `Release Ready`。

唯一下一步：Controller/QA 使用本文和原始证据完成 M82 复核；若 M82 通过，Owner 再在 M83 决定唯一第一学习闭环及 BKT/IRT/SM-2 的权威关系。
