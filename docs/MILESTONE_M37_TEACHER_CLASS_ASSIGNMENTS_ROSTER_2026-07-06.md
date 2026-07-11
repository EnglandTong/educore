# Milestone M37 — Teacher Class Page Assignments Roster

Date: 2026-07-06
Status: Accepted

## 目标 (Goal)

在 Class Insights 页面展示可点击的学生名册，当 class overview 不含 roster 数组时，回退使用 assignments API。

## 要求 (Requirements)

- `TeacherClassPage` 在 overview roster 为空时使用 `fetchTeacherAssignments` 构建 learner 列表
- 学生姓名链接至 `/teacher/students/:id`
- E2E 断言 Emily Chen / Alex Rivera 出现在 class 页面
- 不修改 backend overview 响应结构

## 原因 (Reason)

Class overview API 仅返回聚合指标不含学生列表，导致 Class Insights 页面 roster 永远为空；M30 assignments API 已有学生数据，应作为 roster 回退源完成 discoverability。

## Work Orders

| ID | Task |
|---|---|
| P37-01 | Audit rosterFromOverview gap vs assignments API |
| P37-02 | Implement assignments fallback roster |
| P37-03 | E2E class page roster test |
| P37-04 | Verification and handoff |
