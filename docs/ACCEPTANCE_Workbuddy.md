# Acceptance Contract — EduCore 光合啟途

## Must Pass

- [x] README 与项目定义一致
  Evidence required: automatic + functional
  Current evidence: 自动化通过。见 [Acceptance Evidence](/docs/ACCEPTANCE_EVIDENCE_2026-06-16.md)（2026-06-16T20:23:08+08:00）
- [x] 自适应算法模块有测试覆盖
  Evidence required: automatic + functional
  Current evidence: 自动化通过，`packages/algorithms` + `apps/api` 单测通过（自动化验收快照）
- [x] 学生端 UX 文案规范复核
  Evidence required: functional
  Current evidence: 手工复核通过。见 [docs/UX_REVIEW_NOTES.md](/docs/UX_REVIEW_NOTES.md)（2026-06-16T20:35:04+08:00）

## Evidence Required

Automatic:

- 项目定义 test/build 命令（`agent-loop-check.ps1`）

Functional:

- 学习者 smoke flow：register/signin -> diagnostic -> practice -> wrong answer/review notes -> revisit

## Failure Examples

- 题目难度不随掌握度变化
- 用户数据未本地化/未脱敏上云策略违反设计

## Known Exclusions

- Recover 区损坏的 null-byte 源码文件不作为验收依据
- node_modules 碎片文件不计入项目完整性

## Manual Confirmation Needed

- [ ] 人类确认生产/内网部署模式（SQLite vs Supabase vs local-cloud）
  Reason: 环境相关，Agent 不得擅自访问生产密钥

## Completion Log

- Developer revalidation: PASS
  Time: `2026-06-19T11:30:27+08:00`
  Evidence:
  - [docs/ACCEPTANCE_EVIDENCE_2026-06-16.md](/docs/ACCEPTANCE_EVIDENCE_2026-06-16.md)
  - [apps/web/e2e-report/index.html](/apps/web/e2e-report/index.html)
  - [apps/web/e2e/e2e-mocks.ts](/apps/web/e2e/e2e-mocks.ts)

- 自动化验收：`powershell -ExecutionPolicy Bypass -File .\agent-loop-check.ps1 -SkipInstall`（通过）
  时间：2026-06-16T20:23:08+08:00
- 手工 smoke flow：通过（注册/登录 -> 诊断 -> 练习 -> 错题复盘 -> revisit）
  时间：2026-06-16T20:35:04+08:00
  证据： [docs/UX_REVIEW_NOTES.md](/docs/UX_REVIEW_NOTES.md), [docs/ACCEPTANCE_EVIDENCE_2026-06-16.md](/docs/ACCEPTANCE_EVIDENCE_2026-06-16.md)
