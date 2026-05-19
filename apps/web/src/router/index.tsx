import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { HydrationFallback } from '@/components/shared/HydrationFallback'
import { RouteFallback } from '@/components/shared/RouteFallback'
import { ParentLayout, SchoolAdminLayout, StudentLayout, TeacherLayout, VolunteerLayout } from '@/components/layout/RoleLayouts'
import { useAuthHydration } from '@/hooks/useAuthHydration'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { StudentDashboardPage } from '@/pages/student/StudentDashboardPage'
import { CheckInPage } from '@/pages/student/CheckInPage'
import { DiagnosticPage } from '@/pages/student/DiagnosticPage'
import { TrainingPage } from '@/pages/student/TrainingPage'
import { StudentProgressPage } from '@/pages/student/StudentProgressPage'
import { WrongAnswersPage } from '@/pages/student/WrongAnswersPage'
import { HeartSpacePage } from '@/pages/student/HeartSpacePage'
import { JournalPage } from '@/pages/student/JournalPage'
import { ProudWallPage } from '@/pages/student/ProudWallPage'
import { AITutorPage } from '@/pages/student/AITutorPage'
import { VolunteerDashboardPage } from '@/pages/volunteer/VolunteerDashboardPage'
import { QABoardPage } from '@/pages/volunteer/QABoardPage'
import { VolunteerProfilePage } from '@/pages/volunteer/VolunteerProfilePage'
import { SchoolManagementPage } from '@/pages/school/SchoolManagementPage'
import { SchoolStudentsPage } from '@/pages/school/SchoolStudentsPage'
import { SchoolTeachersPage } from '@/pages/school/SchoolTeachersPage'
import { DonationPage } from '@/pages/DonationPage'
import {
  LazyAnnouncementsPage,
  LazyConversationThreadPage,
  LazyConversationsPage,
  LazyParentChildProgressPage,
  LazyParentDashboardPage,
  LazyParentSubjectGuidePage,
  LazyTeacherClassPage,
  LazyTeacherDashboardPage,
  LazyTeacherLearningPathEditorPage,
  LazyTeacherLearningPathsPage,
  LazyTeacherStudentPage,
} from '@/router/lazyRoutes'
import { GuestOnly, RequireAuth, RequireRole } from '@/router/guards'
import { useAuthStore } from '@/stores/authStore'

function HomePage() {
  const hydrated = useAuthHydration()
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  if (!hydrated) return <HydrationFallback />
  if (!user || !accessToken) return <Navigate to="/auth/login" replace />
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />
  if (user.role === 'parent') return <Navigate to="/parent/dashboard" replace />
  if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
  if (user.role === 'volunteer') return <Navigate to="/volunteer/dashboard" replace />
  if (user.role === 'school-admin') return <Navigate to="/admin/school" replace />
  return <Navigate to="/auth/login" replace />
}

const LazyDesignSystemPage = lazy(() =>
  import('@/pages/auth/DesignSystemPage').then((m) => ({ default: m.DesignSystemPage })),
)

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/auth/design"
        element={
          <Suspense fallback={<RouteFallback />}>
            <LazyDesignSystemPage />
          </Suspense>
        }
      />

      <Route element={<GuestOnly />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<RequireRole role="student" />}>
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/checkin" element={<CheckInPage />} />
            <Route path="/student/diagnostic" element={<DiagnosticPage />} />
            <Route path="/student/training" element={<TrainingPage />} />
            <Route path="/student/progress" element={<StudentProgressPage />} />
            <Route path="/student/wrong-answers" element={<WrongAnswersPage />} />
            <Route path="/student/heart" element={<HeartSpacePage />} />
            <Route path="/student/heart/journal" element={<JournalPage />} />
            <Route path="/student/heart/proud-wall" element={<ProudWallPage />} />
            <Route path="/student/ai-tutor" element={<AITutorPage />} />
          </Route>
        </Route>

        <Route element={<RequireRole role="parent" />}>
          <Route element={<ParentLayout />}>
            <Route
              path="/parent/dashboard"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyParentDashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/parent/announcements"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyAnnouncementsPage variant="parent" />
                </Suspense>
              }
            />
            <Route
              path="/parent/messages"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyConversationsPage variant="parent" />
                </Suspense>
              }
            />
            <Route
              path="/parent/messages/:conversationId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyConversationThreadPage variant="parent" />
                </Suspense>
              }
            />
            <Route
              path="/parent/children/:childId/progress"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyParentChildProgressPage />
                </Suspense>
              }
            />
            <Route
              path="/parent/guides/:moduleId/:skillId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyParentSubjectGuidePage />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route element={<RequireRole role="teacher" />}>
          <Route element={<TeacherLayout />}>
            <Route
              path="/teacher/dashboard"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyTeacherDashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/teacher/class"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyTeacherClassPage />
                </Suspense>
              }
            />
            <Route
              path="/teacher/announcements"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyAnnouncementsPage variant="teacher" />
                </Suspense>
              }
            />
            <Route
              path="/teacher/conversations"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyConversationsPage variant="teacher" />
                </Suspense>
              }
            />
            <Route
              path="/teacher/conversations/:conversationId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyConversationThreadPage variant="teacher" />
                </Suspense>
              }
            />
            <Route
              path="/teacher/students/:studentId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyTeacherStudentPage />
                </Suspense>
              }
            />
            <Route
              path="/teacher/learning-paths"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyTeacherLearningPathsPage />
                </Suspense>
              }
            />
            <Route
              path="/teacher/learning-paths/:pathId"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <LazyTeacherLearningPathEditorPage />
                </Suspense>
              }
            />
          </Route>
        </Route>

        {/* Volunteer routes */}
        <Route element={<RequireRole role="volunteer" />}>
          <Route element={<VolunteerLayout />}>
            <Route path="/volunteer/dashboard" element={<VolunteerDashboardPage />} />
            <Route path="/volunteer/qa" element={<QABoardPage />} />
            <Route path="/volunteer/profile" element={<VolunteerProfilePage />} />
          </Route>
        </Route>

        {/* School-admin routes */}
        <Route element={<RequireRole role="school-admin" />}>
          <Route element={<SchoolAdminLayout />}>
            <Route path="/admin/school" element={<SchoolManagementPage />} />
            <Route path="/admin/school/students" element={<SchoolStudentsPage />} />
            <Route path="/admin/school/teachers" element={<SchoolTeachersPage />} />
          </Route>
        </Route>
      </Route>

      {/* Public donation page */}
      <Route path="/donation" element={<DonationPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
