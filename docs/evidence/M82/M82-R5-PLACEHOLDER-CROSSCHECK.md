# M82-R5 占位交叉核对证据

日期：2026-08-20  
方法：`rg` 扫描 API/Web/模块/Docs 的 placeholder、incomplete、固定空成功响应和 IndexedDB 消费者，再逐项阅读登记表中的代码位置。

结果：登记表中的 6 类 surface 均在代码中得到确认；未发现新的明确固定成功伪功能 API。

已确认：

- `/api/v1/school/classes` 固定返回空 `classes`：`apps/api/src/modules/school/school.routes.ts:111-116`。
- `/api/v1/sync/status` 固定返回空同步状态：`apps/api/src/modules/sync/sync.service.ts:59-64`。
- `progress-store.ts`、`questions-store.ts` 只有定义，无业务消费者引用。
- TeacherAssignment 仍是部分能力，不是完整教师 CRUD。
- VolunteerDashboardPage 只渲染导航卡片，无数据请求。

扫描规则排除了普通 HTML input placeholder 文本，避免把 UI 提示文案误判为产品占位能力。

结论：`PLACEHOLDER_ENDPOINTS.md` 当前登记准确；M82 不修复、不转化这些 surface。后续由 M86 逐项决定 productize / permanent-501 / delete / defer。
