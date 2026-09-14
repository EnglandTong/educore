# System Audit — 2026-09-14

角色：PM + 全栈开发双视角（Owner 授权的只读审查）
状态：只读审查，**未签署**——本报告不构成任何里程碑的验收或 QA 决定，仅登记发现。
范围：全仓只读；发现以 Confirmed（file:line 证据）为准，未做推测性结论。

## 前置更正

后端 `apps/api/src/modules/sync/sync.service.ts` **存在**（提供 `/sync/batch` + `/sync/status`）。此前一轮曾误报"后端无 sync 服务"，在此更正。但前端 `sync-queue.ts` 重放时**并未走这套批量接口**，而是直接打 training 接口——这本身构成一个发现（见 P1）。

## PM 视角：系统级判断

核心判断：这个系统的质量风险不在功能缺失，而在「证据链与真实运行之间的缝隙」。功能真相板的标签体系很诚实，但有几个缝隙是标签体系没覆盖到的：

| 级别 | 问题 | 证据 | 影响 |
| --- | --- | --- | --- |
| P0 | refresh token 长期明文存 localStorage | `authStore.ts` 用 zustand persist（默认 localStorage）存 accessToken + refreshToken，refresh 有效期 7 天 | ① XSS 可窃取长效凭证；② 与 M89「共享设备隐私」目标直接冲突——偏远地区多孩子共用一台设备是真实场景，浏览器里 7 天有效 refresh token = 换账号不登出就换人。这应是 M89 的第一优先项（httpOnly cookie 或 sessionStorage + 缩短有效期） |
| P1 | 离线队列 4xx 毒丸重试 | `sync-queue.ts:79-83`：任何错误都 incrementRetry 重试到 5 次。400 校验错误（永久失败）会被重试 5 次浪费带宽；409 幂等冲突本该算成功却计为 failed | 弱网设备（目标用户）上最常见的就是这类慢失败。应区分 4xx（立即出队/标记死信）与 5xx/网络错误（重试），409 应归入 synced |
| P1 | 双离线存储漂移 | `TrainingPage.tsx` 同时写 sessions-store（addOfflineAnswer）和 sync-queue（enqueueOperation）两条路 | 两套数据无对账机制，重放成功后 sessions-store 里的 synced 标记与队列删除是两个事务，崩溃窗口内会漂移。这是 M91「非 mock 断网重放」最该打的靶子 |
| P1 | Web 端零单测 | 测试只有 API 侧（unit/integration/security）+ 4 个 Playwright e2e spec；web 无任何 `*.test.ts` | 离线队列、auth 拦截器这些最关键的前端逻辑全靠 e2e 兜底，而 PROJECT_BOARD 已承认「lint 曾为 echo、0-test 可假绿」——M88 的「真绿灯」必须包含前端单测，否则仍是假绿 |

## 全栈视角：技术隐患

| 级别 | 问题 | 证据 | 建议 |
| --- | --- | --- | --- |
| P2 | 测试 mock-by-path 脆性 | `learning.service.test.ts` 用 `vi.mock("../../src/models/...")` 相对路径 mock 全部 model 层 | model 重构（改路径/改方法签名）时测试静默失真而非报错。M90 硬化 DTO 时建议转向真 DB（mongodb-memory-server）做核心链路测试 |
| P2 | Docker 拓扑两处隐患 | `docker-compose.yml`：Mongo/Redis 端口映射到宿主机（生产部署时是暴露面）；web 构建期烘焙 VITE_API_URL，运行时改 API 地址需重建镜像 | 生产 profile 收端口；前端 nginx 反代 /api 走容器网络，消除构建期耦合 |
| P2 | 文档债拖累治理效率 | `docs/` 343 个 md，其中 80+ 是 M14–M49 的 DISPATCH/HANDOFF 历史包裹 | 不建议删（Non-Goal 明确禁止破坏性清理），但建议后续程序开票时把「归档压缩」作为低优先任务，否则每个新会话的上下文成本都在为历史买单 |
| P3 | JWT_SECRET 开发默认值 | `env.ts` 有 dev 默认值（server.ts 生产已拦截，设计正确） | 维持现状即可，仅提醒：start.bat 这类一键脚本若误设 NODE_ENV=production 之外的值，默认密钥仍会生效 |

## 总体评价

架构判断是对的（离线优先、优雅降级、BKT 权威、幂等 eventId），工程基本功扎实（zod 校验、字段白名单、幂等键、安全测试目录齐全）。真正的短板是「最后一公里」：前端凭证存储、离线重放的边角语义、前端测试真空——恰好全部落在 M89/M90/M91 的射程内，说明既定路线图本身是准的，不需要改方向，只需要把上述 P0/P1 具体写进对应工单的验收标准。

## 路线图落点建议

- **M88**：把「web 单测门禁」的验收标准写实——至少覆盖 sync-queue 与 auth client。
- **M89**：token 存储改造（httpOnly cookie 或 sessionStorage + 缩短有效期）提前纳入范围，作第一优先项。
- **M91**：双存储对账/单事务化作为「非 mock 断网重放」的核心验收。

## 下一步

待 M87 QA 签署后开 M88 工单时，将上述 P0/P1 落实进对应验收标准。本报告为只读审查产物，按「Register, don't sign」纪律：只登记执行事实，不做验收签署。
