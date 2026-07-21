import { handledOk, notHandled, type MockResult } from './shared'

export function mockStudent(pathname: string, method: string, body: Record<string, unknown>): MockResult {
  if (pathname === '/api/v1/modules') {
    return handledOk({
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
    return handledOk({
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
    return handledOk({ skills: [] })
  }
  if (pathname === '/api/v1/progress/history' || (pathname.startsWith('/api/v1/progress/') && pathname.endsWith('/timeline'))) {
    return handledOk({ timeline: [] })
  }

  if (pathname === '/api/v1/students/me/checkins' || pathname === '/api/v1/students/me/checkins/today') {
    return handledOk(
      pathname.endsWith('/today')
        ? { checkedIn: false, checkIn: null }
        : { checkIns: [], streak: 0, total: 0 },
    )
  }

  if (pathname === '/api/v1/learning/diagnostic/start' || pathname === '/api/v1/learning/training/start') {
    return handledOk({
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
    if (pathname === '/api/v1/learning/training/next') {
      return handledOk({
        questionId: 'train-q-1',
        answered: false,
        question: {
          id: 'train-q-1',
          moduleId: 'english.grammar',
          skill: 'Grammar',
          subSkill: 'Present simple',
          level: 'A1',
          questionType: 'multiple-choice',
          difficulty: 1,
          prompt: 'Choose the sentence that fits: She ____ books every day.',
          choices: [
            { key: 'A', text: 'read' },
            { key: 'B', text: 'reads' },
            { key: 'C', text: 'reading' },
          ],
          answerKey: 'B',
          explanation: 'Use reads with she in the present simple.',
          hints: ['Look at the subject first.'],
        },
      })
    }
    if (pathname.endsWith('/next')) {
      return handledOk({ message: 'Session has no questions in mock mode.' })
    }
    if (pathname === '/api/v1/learning/training/end') {
      return handledOk({
        sessionId: 'train-session-1',
        accuracy: 0.5,
        totalQuestions: 2,
        correctCount: 1,
        timeSpent: 45,
        skillBreakdown: [{ skill: 'Grammar', correct: 1, total: 2 }],
        strengths: ['Showing up steadily'],
        growthAreas: ['Present simple'],
        encouragement: 'You practiced with patience today.',
      })
    }
    return handledOk({
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

  if (pathname === '/api/v1/learning/training/answer' && method === 'POST') {
    return handledOk({
      isCorrect: body.answer === 'B',
      feedback: body.answer === 'B' ? 'Nice noticing - that one fits.' : 'Good try - this is a gentle review moment.',
      explanation: 'Use reads with she in the present simple.',
      nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
    })
  }

  if (pathname === '/api/v1/heart/journal' && method === 'POST') {
    return handledOk({
      id: `journal-${Date.now()}`,
      mood: typeof body.mood === 'string' ? body.mood : 'calm',
      content: typeof body.content === 'string' ? body.content : '',
      isPrivate: body.isPrivate === true,
      createdAt: new Date().toISOString(),
    })
  }

  if (pathname === '/api/v1/heart/proud-moments' && method === 'POST') {
    return handledOk({
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
    return handledOk({ [key]: [] })
  }

  if (pathname === '/api/v1/heart/mood' || pathname === '/api/v1/heart/present') {
    return handledOk({
      moodLog: { id: 'mood-1', date: new Date().toISOString(), mood: 'happy', createdAt: new Date().toISOString() },
    })
  }

  if (pathname === '/api/v1/wrong-answers' || pathname === '/api/v1/wrong-answers/review-due') {
    return handledOk({
      wrongAnswers: [
        {
          id: 'wrong-1',
          studentId: 'student-1',
          questionId: 'train-q-1',
          question: {
            id: 'train-q-1',
            moduleId: 'english.grammar',
            skill: 'Grammar',
            subSkill: 'Present simple',
            level: 'A1',
            questionType: 'multiple-choice',
            difficulty: 1,
            prompt: 'Choose the sentence that fits: She ____ books every day.',
            choices: [
              { key: 'A', text: 'read' },
              { key: 'B', text: 'reads' },
              { key: 'C', text: 'reading' },
            ],
            answerKey: 'B',
            explanation: 'Use reads with she in the present simple.',
          },
          studentAnswer: 'A',
          correctAnswer: 'B',
          explanation: 'Use reads with she in the present simple.',
          createdAt: new Date().toISOString(),
          reviewStatus: 'pending',
          nextReviewAt: new Date().toISOString(),
          reviewCount: 0,
        },
      ],
    })
  }

  if (pathname === '/api/v1/ai/chat') {
    return handledOk({
      answer: 'A gentle mock answer for e2e.',
      source: 'mock',
    })
  }

  return notHandled()
}
