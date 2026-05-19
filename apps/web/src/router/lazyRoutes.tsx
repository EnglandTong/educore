import { lazy } from 'react'

export const LazyParentDashboardPage = lazy(() =>
  import('@/pages/parent/ParentDashboardPage').then((m) => ({ default: m.ParentDashboardPage })),
)
export const LazyParentChildProgressPage = lazy(() =>
  import('@/pages/parent/ParentChildProgressPage').then((m) => ({ default: m.ParentChildProgressPage })),
)
export const LazyParentSubjectGuidePage = lazy(() =>
  import('@/pages/parent/ParentSubjectGuidePage').then((m) => ({ default: m.ParentSubjectGuidePage })),
)
export const LazyAnnouncementsPage = lazy(() =>
  import('@/pages/community/AnnouncementsPage').then((m) => ({ default: m.AnnouncementsPage })),
)
export const LazyConversationsPage = lazy(() =>
  import('@/pages/community/ConversationsPage').then((m) => ({ default: m.ConversationsPage })),
)
export const LazyConversationThreadPage = lazy(() =>
  import('@/pages/community/ConversationThreadPage').then((m) => ({ default: m.ConversationThreadPage })),
)
export const LazyTeacherDashboardPage = lazy(() =>
  import('@/pages/teacher/TeacherDashboardPage').then((m) => ({ default: m.TeacherDashboardPage })),
)
export const LazyTeacherClassPage = lazy(() =>
  import('@/pages/teacher/TeacherClassPage').then((m) => ({ default: m.TeacherClassPage })),
)
export const LazyTeacherStudentPage = lazy(() =>
  import('@/pages/teacher/TeacherStudentPage').then((m) => ({ default: m.TeacherStudentPage })),
)
export const LazyTeacherLearningPathsPage = lazy(() =>
  import('@/pages/teacher/LearningPathsPage').then((m) => ({ default: m.LearningPathsPage })),
)
export const LazyTeacherLearningPathEditorPage = lazy(() =>
  import('@/pages/teacher/LearningPathEditorPage').then((m) => ({ default: m.LearningPathEditorPage })),
)
