# Milestone M35 — Teacher Student Detail Identity Display

Date: 2026-07-06
Status: Dispatched

## 目标 (Goal)

在 `TeacherStudentPage` 上展示来自 API summary 的学生姓名与关键学习指标，使教师从 assignments 列表点击进入后能立即识别当前学生。

## 要求 (Requirements)

- 解析嵌套 `summary.student.name`、`gradeLevel`、`masteryCount`、`activeSkills`
- 页面 h1 显示学生姓名（无数据时保留通用标题）
- 结构化展示 grade、mastery、active skills
- typecheck / build / e2e 通过
- 不得修改 schema 或新增 API

## 原因 (Reason)

M31 已添加学生详情链接，但详情页仍显示通用标题「A calm snapshot for one student」，教师无法确认是否打开了正确学生，导航链 UX 不完整。

## Work Orders

| ID | Task |
|---|---|
| P35-01 | Audit summary payload shape and page selectors |
| P35-02 | Implement identity parsing and UI update |
| P35-03 | Update e2e to assert student name in heading |
| P35-04 | Verification and handoff |
