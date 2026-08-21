# WORK_ORDER_M85 - Collaboration Scope Rebaseline

状态：`Accepted-with-notes — bounded read-only loop`  
前置：M84 `Accept-with-notes`  
类型：Discovery / bounded product decision

## Objective

在 M84 学生学习闭环稳定后，重新评估教师/家长协作能力；不得把现有 partial UI 或
placeholder 当作已交付能力。

## Controller tasks

- [x] M85-R1：复核教师班级/学生详情和家长绑定/进度现状，更新 capability truth matrix。
- [x] M85-R2：列出一个且仅一个候选协作闭环及 Non-Goals、权限边界和数据可见性。
- [x] M85-R3：确认现有只读闭环无需新增业务源码，保留为 bounded read-only slice。
- [x] M85-R4：不修改协作业务源码、不扩展学校/志愿者/社区能力。

## Current Controller decision

M85 以既有只读教师闭环完成确认/审计；不派发新的 Developer 实现。详见
`docs/M85_CONTROLLER_DECISION_2026-08-21.md`。
