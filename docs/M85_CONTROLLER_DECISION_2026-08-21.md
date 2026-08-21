# M85 Controller Decision — 2026-08-21

## Selected collaboration loop

`教师登录 → 查看本人已分配学生 → 打开学生学习进度摘要`

## Boundaries

- Read-only; no class creation, assignment mutation, parent binding, school administration,
  volunteer Q&A, messaging, or community expansion.
- A teacher may view a student only when `TeacherAssignment.teacherId` matches the authenticated
  teacher and `studentId` matches the requested resource.
- Student mastery remains the M84 server-authoritative BKT read path; teacher views are derived
  read models and cannot write mastery.

## Existing implementation evidence

- Routes: `apps/api/src/modules/teacher/teacher.routes.ts`
- Resource check: `apps/api/src/services/teacher.service.ts:getStudentSummary`
- UI: `apps/web/src/pages/teacher/TeacherClassPage.tsx`, `TeacherStudentPage.tsx`
- API client: `apps/web/src/api/teacher.ts`

## Controller conclusion

M85 is a confirmation/audit slice, not a new collaboration feature implementation. Parent,
school and volunteer collaboration remain deferred to a future Owner decision.
