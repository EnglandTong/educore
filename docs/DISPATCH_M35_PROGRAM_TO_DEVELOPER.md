# Dispatch M35 Program to Developer

Date: 2026-07-06
Program: M35 - Teacher Student Detail Identity Display

## Milestone Goal | 目标 | 要求 | 原因

| Field | Content |
|---|---|
| **目标** | 学生详情页展示真实姓名与学习指标 |
| **要求** | 解析 summary.student；更新 h1 与指标卡片；e2e 断言姓名；无 schema/API 变更 |
| **原因** | M31 链接可达但页面身份不可辨，闭环 teacher→student 工作流 |

## Authorization

Execute P35-01 → P35-04 sequentially.

## Allowed Files

- `apps/web/src/pages/teacher/TeacherStudentPage.tsx`
- `apps/web/e2e/teacher-journey.spec.ts` (P35-03+)
- Governance docs (P35-04)

Dispatched: 2026-07-06T14:50:00+08:00
