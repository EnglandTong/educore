import { handledOk, notHandled, type MockResult } from './shared'

/** Parent + community mocks used across family journeys. */
export function mockFamily(pathname: string, _method: string, _body: Record<string, unknown>): MockResult {
  if (pathname === '/api/v1/parent/children') {
    return handledOk({ children: [] })
  }
  if (pathname.includes('/parent/children/')) {
    return handledOk({
      progress: { studentId: 'student-1', modules: [], totalXP: 0, currentStreak: 0, longestStreak: 0 },
      activity: { childId: 'child-1', recentSessions: [], recentMessages: [] },
    })
  }
  if (pathname.startsWith('/api/v1/parent/guides/')) {
    return handledOk({
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
    return handledOk({ announcements: [] })
  }
  if (pathname === '/api/v1/community/conversations') {
    return handledOk({ conversations: [] })
  }
  if (pathname.includes('/community/conversations/') && pathname.includes('/messages')) {
    return handledOk({ messages: [] })
  }

  return notHandled()
}
