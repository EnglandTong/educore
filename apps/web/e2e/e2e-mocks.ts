import type { Page, Route } from '@playwright/test'

type Role = 'student' | 'parent' | 'teacher' | 'admin' | 'volunteer' | 'school-admin'

function nextMeta() {
  return {
    timestamp: new Date().toISOString(),
    requestId: `e2e-${Math.random().toString(36).slice(2, 10)}`,
  }
}

function roleFromEmail(email: string): Role {
  if (email.includes('parent')) return 'parent'
  if (email.includes('teacher')) return 'teacher'
  if (email.includes('admin')) return 'admin'
  if (email.includes('volunteer')) return 'volunteer'
  return 'student'
}

function okEnvelope(data: unknown) {
  return {
    success: true,
    data,
    meta: nextMeta(),
  }
}

function authSuccess(role: Role, body: Record<string, unknown>) {
  const name = typeof body.name === 'string' && body.name.trim() ? body.name : `${role} user`
  const email =
    typeof body.email === 'string' && body.email.trim()
      ? body.email
      : `${role}-${Date.now()}@example.com`

  return okEnvelope({
    user: {
      id: `${role}-seed-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      preferences: {
        language: 'en',
        theme: 'light',
      },
    },
    accessToken: `e2e-${role}-access`,
    refreshToken: `e2e-${role}-refresh`,
  })
}

function mockForPath(pathname: string, method: string, body: Record<string, unknown>) {
  if (pathname === '/api/v1/auth/register' && method === 'POST') {
    const role =
      body.role === 'parent' || body.role === 'teacher' || body.role === 'student'
        ? body.role
        : 'student'
    return authSuccess(role, body)
  }

  if (pathname === '/api/v1/auth/login' && method === 'POST') {
    const email = typeof body.email === 'string' ? body.email : ''
    return authSuccess(roleFromEmail(email), body)
  }

  if (pathname === '/api/v1/donation/list') {
    return okEnvelope({ donations: [] })
  }
  if (pathname === '/api/v1/donation/info') {
    return okEnvelope({
      info: {
        mission: 'Mock mission',
        missionDetail: 'Demonstration mode only',
        totalRaised: 0,
        totalDonors: 0,
        studentsHelped: 0,
        schoolsSupported: 0,
        fundsBreakdown: [],
      },
    })
  }
  if (pathname === '/api/v1/donation/impact') {
    return okEnvelope({
      impact: {
        totalRaised: 0,
        totalDonations: 0,
        totalDonors: 0,
        studentsHelped: 0,
        schoolsSupported: 0,
        avgDonation: 0,
        largestDonation: 0,
        recentStories: [],
      },
    })
  }
  if (pathname === '/api/v1/donation/donate') {
    return okEnvelope({
      donation: {
        id: `don-${Date.now()}`,
        donorName: typeof body.donorName === 'string' ? body.donorName : 'Demo Donor',
        amount: typeof body.amount === 'number' ? body.amount : 0,
        status: 'completed',
        createdAt: new Date().toISOString(),
      },
    })
  }

  if (pathname === '/api/v1/modules') {
    return okEnvelope({
      modules: [
        {
          id: 'english.grammar',
          name: 'English Grammar',
          version: '1.0.0',
          subject: 'language',
          category: 'core',
          description: 'Mock module for e2e',
          icon: 'book-open',
          color: '#6366f1',
          targetAge: { min: 6, max: 18 },
          skills: [],
          levels: [],
          questionTypes: [],
          diagnostic: { rounds: 3, questionsPerRound: 3, strategy: 'adaptive' },
          training: { sessionLength: 15, adaptiveWeights: { weak: 60, current: 25, review: 15 }, masteryThreshold: 85 },
        },
      ],
    })
  }

  if (pathname === '/api/v1/progress/overview') {
    return okEnvelope({
      studentId: 'student-1',
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      modules: [
        {
          moduleId: 'english.grammar',
          moduleName: 'English Grammar',
          overallScore: 0,
          overallLevel: 'developing',
          skillCount: 0,
          masteredCount: 0,
          lastActivityAt: new Date().toISOString(),
        },
      ],
    })
  }

  if (pathname.startsWith('/api/v1/progress/') && pathname.endsWith('/skills')) {
    return okEnvelope({ skills: [] })
  }
  if (pathname === '/api/v1/progress/history' || (pathname.startsWith('/api/v1/progress/') && pathname.endsWith('/timeline'))) {
    return okEnvelope({ timeline: [] })
  }

  if (pathname === '/api/v1/students/me/checkins' || pathname === '/api/v1/students/me/checkins/today') {
    return okEnvelope(
      pathname.endsWith('/today')
        ? { checkedIn: false, checkIn: null }
        : { checkIns: [], streak: 0, total: 0 },
    )
  }

  if (pathname === '/api/v1/learning/diagnostic/start' || pathname === '/api/v1/learning/training/start') {
    return okEnvelope({
      id: `${pathname.includes('diagnostic') ? 'diag' : 'train'}-session-1`,
      type: 'session',
      status: 'active',
    })
  }

  if (
    pathname === '/api/v1/learning/diagnostic/next' ||
    pathname === '/api/v1/learning/training/next' ||
    pathname === '/api/v1/learning/diagnostic/report' ||
    pathname === '/api/v1/learning/training/end'
  ) {
    if (pathname.endsWith('/next')) {
      return okEnvelope({ message: 'Session has no questions in mock mode.' })
    }
    return okEnvelope({
      sessionId: `${pathname.includes('diagnostic') ? 'diag' : 'train'}-session-1`,
      estimatedLevel: 'A1',
      strengths: [],
      weaknesses: [],
      encouragement: 'Gentle start for offline mode.',
      accuracy: 0,
      correctCount: 0,
      totalQuestions: 0,
      growthAreas: [],
    })
  }

  if (pathname === '/api/v1/heart/journal' && method === 'POST') {
    return okEnvelope({
      id: `journal-${Date.now()}`,
      mood: typeof body.mood === 'string' ? body.mood : 'calm',
      content: typeof body.content === 'string' ? body.content : '',
      isPrivate: body.isPrivate === true,
      createdAt: new Date().toISOString(),
    })
  }

  if (pathname === '/api/v1/heart/proud-moments' && method === 'POST') {
    return okEnvelope({
      id: `proud-${Date.now()}`,
      title: typeof body.title === 'string' ? body.title : 'A proud moment',
      description: typeof body.description === 'string' ? body.description : '',
      userId: 'student-1',
      userName: 'Test Student',
      reactions: [],
      createdAt: new Date().toISOString(),
    })
  }

  if (pathname === '/api/v1/heart/journal' || pathname === '/api/v1/heart/proud-moments' || pathname === '/api/v1/heart/mood/trend') {
    const key = pathname.includes('proud') ? 'moments' : pathname.includes('journal') ? 'journals' : 'trend'
    return okEnvelope({ [key]: [] })
  }

  if (pathname === '/api/v1/heart/mood' || pathname === '/api/v1/heart/present') {
    return okEnvelope({
      moodLog: { id: 'mood-1', date: new Date().toISOString(), mood: 'happy', createdAt: new Date().toISOString() },
    })
  }

  if (pathname === '/api/v1/parent/children') {
    return okEnvelope({ children: [] })
  }
  if (pathname.includes('/parent/children/')) {
    return okEnvelope({
      progress: { studentId: 'student-1', modules: [], totalXP: 0, currentStreak: 0, longestStreak: 0 },
      activity: { childId: 'child-1', recentSessions: [], recentMessages: [] },
    })
  }
  if (pathname.startsWith('/api/v1/parent/guides/')) {
    return okEnvelope({
      guide: {
        moduleId: 'english.grammar',
        skillId: 'tense-aspect',
        skillName: 'Tense',
        title: 'Guide',
        whatIsIt: 'Demo',
        howToHelp: [],
        commonMistakes: [],
        signsOfProgress: [],
        ifStruggling: [],
      },
    })
  }

  if (pathname === '/api/v1/community/announcements') {
    return okEnvelope({ announcements: [] })
  }
  if (pathname === '/api/v1/community/conversations') {
    return okEnvelope({ conversations: [] })
  }
  if (pathname.includes('/community/conversations/') && pathname.includes('/messages')) {
    return okEnvelope({ messages: [] })
  }

  if (pathname === '/api/v1/teacher/class/overview') {
    return okEnvelope({ overview: null })
  }
  if (pathname === '/api/v1/teacher/class/weak-areas') {
    return okEnvelope({ weakAreas: [] })
  }
  if (pathname.startsWith('/api/v1/teacher/students/') && pathname.endsWith('/summary')) {
    return okEnvelope({ summary: null })
  }

  if (pathname === '/api/v1/wrong-answers' || pathname === '/api/v1/wrong-answers/review-due') {
    return okEnvelope({ wrongAnswers: [] })
  }

  if (pathname === '/api/v1/ai/chat') {
    return okEnvelope({
      answer: 'A gentle mock answer for e2e.',
      source: 'mock',
    })
  }

  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    return okEnvelope({})
  }

  return okEnvelope({})
}

async function readBody(route: Route): Promise<Record<string, unknown>> {
  const postData = route.request().postData()
  if (!postData) return {}
  try {
    return JSON.parse(postData) as Record<string, unknown>
  } catch {
    return {}
  }
}

export async function installE2eApiMocks(page: Page): Promise<void> {
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request()
    const method = request.method().toUpperCase()
    const pathname = new URL(request.url()).pathname
    const body = await readBody(route)
    const payload = mockForPath(pathname, method, body)
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(payload),
    })
  })
}
