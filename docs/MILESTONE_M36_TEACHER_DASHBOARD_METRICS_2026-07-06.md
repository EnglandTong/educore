# Milestone M36 — Teacher Dashboard Metrics Cards

Date: 2026-07-06
Status: Accepted

## 目标 (Goal)

在 Teacher Dashboard 的「Whole-class pulse」区域展示真实的班级概览指标，替代占位文案。

## 要求 (Requirements)

- 使用已有 `fetchClassOverview` 数据渲染 studentCount、averageScore、grade levels、weak areas 四格指标
- 保留 loading / error / empty 状态处理
- typecheck / build / e2e 通过
- 不新增 API 或 schema

## 原因 (Reason)

Dashboard 已成功拉取 overview 数据，但仅显示「We received a fresh bundle」占位文本，教师无法在首页获得有效班级快照，浪费已有 API 集成。

## Work Orders

| ID | Task |
|---|---|
| P36-01 | Audit dashboard overview rendering gap |
| P36-02 | Implement metrics grid from ClassOverview |
| P36-03 | E2E assert dashboard metrics (8 students, score 72) |
| P36-04 | Verification and handoff |
