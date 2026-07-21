import { handledOk, notHandled, type MockResult } from './shared'

export function mockTeacher(pathname: string, _method: string, _body: Record<string, unknown>): MockResult {
  if (pathname === '/api/v1/teacher/class/overview') {
    return handledOk({
      overview: {
        teacherId: 'teacher-e2e',
        studentCount: 8,
        averageScore: 72,
        gradeGroups: { '3': 5, '4': 3 },
        topWeakAreas: [
          {
            skillId: 'skill-1',
            skillName: 'Fractions',
            averageScore: 42,
            level: 'developing',
          },
        ],
        students: [
          { id: 'student-e2e-1', name: 'Emily Chen', gradeLevel: '3' },
          { id: 'student-e2e-2', name: 'Alex Rivera', gradeLevel: '4' },
        ],
      },
    })
  }
  if (pathname === '/api/v1/teacher/class/weak-areas') {
    return handledOk({
      weakAreas: [
        {
          skillId: 'skill-1',
          skillName: 'Fractions',
          averageScore: 42,
          level: 'developing',
        },
      ],
    })
  }
  if (pathname === '/api/v1/teacher/assignments') {
    return handledOk({
      assignments: [
        {
          studentId: 'student-e2e-1',
          studentName: 'Emily Chen',
          gradeLevel: '3',
          assignedAt: '2026-06-01T00:00:00.000Z',
        },
        {
          studentId: 'student-e2e-2',
          studentName: 'Alex Rivera',
          gradeLevel: '4',
          assignedAt: '2026-06-15T00:00:00.000Z',
        },
      ],
    })
  }
  if (pathname.startsWith('/api/v1/teacher/students/') && pathname.endsWith('/summary')) {
    return handledOk({
      summary: {
        teacherId: 'teacher-e2e',
        student: {
          id: 'student-e2e-1',
          name: 'Emily Chen',
          gradeLevel: '3',
        },
        progress: { completedModules: 2, totalModules: 5 },
        masteryCount: 12,
        activeSkills: 8,
      },
    })
  }
  return notHandled()
}
