# Milestone M81 — Dead Code Cleanup and Placeholder Documentation

Date: 2026-07-21
Status: Dispatched
Phase: Architecture Debt Repayment (Short-term)

## 目标 (Goal)

清理无引用死代码 `authSprintStubMessage`，并将 school classes / sync status 等假完成端点文档化为未交付能力，避免 QA 误判。

## 要求 (Requirements)

- 删除或隔离 `apps/api/src/modules/auth/auth.service.ts` 中无引用 stub
- 新增 `Docs/PLACEHOLDER_ENDPOINTS.md` 列出未完成端点、返回行为、后续里程碑建议
- school/classes 与 sync status 代码注释指向该文档
- 不改业务行为（placeholder 仍返回空/零，但明确标注）
- typecheck / build / e2e 基线保持

## 原因 (Reason)

审计发现 stub 与 placeholder 易被当作已交付；短期债务偿还优先消除误判信号。

## Work Orders

| ID | Task |
|---|---|
| P81-01 | Remove authSprintStubMessage dead code |
| P81-02 | Document placeholder endpoints |
| P81-03 | Annotate school/sync handlers |
| P81-04 | Verify + handoff |
