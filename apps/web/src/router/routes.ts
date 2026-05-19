export const routes = {
  home: '/',
  authLogin: '/auth/login',
  authRegister: '/auth/register',
  authDesign: '/auth/design',
  studentDashboard: '/student/dashboard',
  studentDiagnostic: '/student/diagnostic',
  studentTraining: '/student/training',
  studentCheckIn: '/student/checkin',
  studentProgress: '/student/progress',
  studentWrongAnswers: '/student/wrong-answers',
  heartSpace: '/student/heart',
  heartJournal: '/student/heart/journal',
  heartProudWall: '/student/heart/proud-wall',
  aiTutor: '/student/ai-tutor',
  parentDashboard: '/parent/dashboard',
  parentMessages: '/parent/messages',
  parentAnnouncements: '/parent/announcements',
  teacherDashboard: '/teacher/dashboard',
  teacherClass: '/teacher/class',
  teacherAnnouncements: '/teacher/announcements',
  teacherConversations: '/teacher/conversations',
  teacherLearningPaths: '/teacher/learning-paths',
  volunteerDashboard: '/volunteer/dashboard',
  volunteerQa: '/volunteer/qa',
  volunteerProfile: '/volunteer/profile',
  schoolManage: '/admin/school',
  schoolStudents: '/admin/school/students',
  schoolTeachers: '/admin/school/teachers',
  donation: '/donation',
} as const

export function parentChildProgressPath(childId: string): string {
  return `/parent/children/${encodeURIComponent(childId)}/progress`
}

export function parentSubjectGuidePath(moduleId: string, skillId: string): string {
  return `/parent/guides/${encodeURIComponent(moduleId)}/${encodeURIComponent(skillId)}`
}

export function teacherStudentPath(studentId: string): string {
  return `/teacher/students/${encodeURIComponent(studentId)}`
}

export function teacherLearningPathEditorPath(pathId: string): string {
  return `/teacher/learning-paths/${encodeURIComponent(pathId)}`
}
