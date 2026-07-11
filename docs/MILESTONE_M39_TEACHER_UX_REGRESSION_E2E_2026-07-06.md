# Milestone M39 — Teacher UX Regression E2E Suite

Date: 2026-07-06
Status: Accepted

## 目标 (Goal)

为 M35–M37 的 UX 改进建立自动化回归覆盖，确保 dashboard 指标、class roster、student identity 在 CI/e2e 中可验证。

## 要求 (Requirements)

- Playwright 测试：dashboard metrics、class roster、student name heading
- 全部 e2e 套件通过（含既有 13 项 + 新增 2 项 = 15 项）
- 不扩大产品 scope，仅测试与 mock 对齐
- typecheck / build / e2e 三重验证

## 原因 (Reason)

M35–M37 改进了多处 teacher UX，若无 dedicated e2e 断言，后续 refactor 可能 silently regress；集中在一个 milestone 验收可形成完整 teacher journey 回归基线。

## Work Orders

| ID | Task |
|---|---|
| P39-01 | Audit e2e gaps for M35–M37 |
| P39-02 | Add dashboard metrics + class roster tests |
| P39-03 | Align student detail e2e with M35 identity heading |
| P39-04 | Full suite run and handoff |
