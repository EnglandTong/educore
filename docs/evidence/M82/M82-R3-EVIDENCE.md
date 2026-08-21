# M82-R3 运行链证据

日期：2026-08-20  
环境：本地工作区，Fastify `inject` 集成测试；未连接生产服务、真实学生数据或真实第三方 AI。

命令：

```text
corepack pnpm --filter @educore/api test -- tests/integration/sprint4-journeys.test.ts tests/security/role-isolation.test.ts tests/security/profile-update.test.ts tests/security/token-expiry.test.ts
```

结果：exit 0；4 个 test files、15 tests passed；耗时约 22.33s。原始输出：`M82-R3-api-targeted.log`。

| 链路 | 当前证据 | 判定 |
|---|---|---|
| 登录/会话/过期 | `tests/security/token-expiry.test.ts`，2 tests | API 注入级通过；不等于真实浏览器 session 流。 |
| 角色隔离 | `tests/security/role-isolation.test.ts`，3 tests | 已有 API deny 证据；覆盖面仍小于完整角色矩阵。 |
| 资料访问/修改 | `tests/security/profile-update.test.ts`，5 tests | API 级通过；未覆盖全部资源 IDOR。 |
| 学生学习主链 | `tests/integration/sprint4-journeys.test.ts`，5 tests | 集成测试通过；不能替代浏览器和真实部署证据。 |
| 教师/家长/学校/志愿者 | 本轮无对应真实链证据 | 未验证，不得标记 Implemented。 |
| 离线队列与恢复 | 本轮无浏览器断网证据 | 未验证；客户端 queue 代码只能标为 Partial。 |

限制：第一次尝试的 `--runInBand` 不是 Vitest 支持参数，exit 1；改用文件过滤命令后通过。当前没有 3000/5173 listener，因此尚未做真实启动服务的浏览器链；R1 Web E2E 使用 mocks，仅证明 UI wiring。本证据不证明 M82 Accepted，也不证明 M84 的幂等、断点恢复或掌握度权威模型已完成。

## R4 权限测试补充（2026-08-20）

命令：

```text
corepack pnpm --filter @educore/api test -- tests/unit/access.service.test.ts tests/security/role-isolation.test.ts
```

结果：exit 0；2 个 test files、11 tests passed；原始输出：`M82-R4-permission-tests.log`。

覆盖内容：`assertRole`、GuardianLink consent/缺失拒绝、teacher/admin 角色检查，以及 student 对 teacher/school-admin endpoint 的拒绝。限制：GuardianLink 使用 mock，role isolation 的 teacher allow 使用 mock service；这不是跨账户真实 Mongo 资源矩阵，不能替代 R4 的 IDOR 运行验证。
