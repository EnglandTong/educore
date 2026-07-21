import { handledOk, notHandled, type MockResult } from './shared'

export function mockDonation(pathname: string, method: string, body: Record<string, unknown>): MockResult {
  if (pathname === '/api/v1/donation/list') {
    return handledOk({ donations: [] })
  }
  if (pathname === '/api/v1/donation/info') {
    return handledOk({
      info: {
        mission: 'Mock mission',
        missionDetail: 'Offline mode only',
        totalRaised: 0,
        totalDonors: 0,
        studentsHelped: 0,
        schoolsSupported: 0,
        fundsBreakdown: [],
      },
    })
  }
  if (pathname === '/api/v1/donation/impact') {
    return handledOk({
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
    return handledOk({
      donation: {
        id: `don-${Date.now()}`,
        donorName: typeof body.donorName === 'string' ? body.donorName : 'Demo Donor',
        amount: typeof body.amount === 'number' ? body.amount : 0,
        status: 'completed',
        createdAt: new Date().toISOString(),
      },
    })
  }
  void method
  return notHandled()
}
