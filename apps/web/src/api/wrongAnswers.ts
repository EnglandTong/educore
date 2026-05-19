import type { ApiResponse, ApiSuccess, Choice, Question, WrongAnswerRecord } from '@educore/types'

import { api } from './client'

const REVIEW_STATUSES: WrongAnswerRecord['reviewStatus'][] = ['pending', 'reviewing', 'mastered']

function parseReviewStatus(v: unknown): WrongAnswerRecord['reviewStatus'] {
  return REVIEW_STATUSES.includes(v as WrongAnswerRecord['reviewStatus'])
    ? (v as WrongAnswerRecord['reviewStatus'])
    : 'pending'
}

const QUESTION_TYPES: Question['questionType'][] = [
  'multiple-choice',
  'gap-filling',
  'transformation',
  'matching',
  'cloze',
  'true-false',
  'error-correction',
  'open',
]

function parseQuestionType(v: unknown): Question['questionType'] {
  return QUESTION_TYPES.includes(v as Question['questionType'])
    ? (v as Question['questionType'])
    : 'open'
}

function normalizeChoice(raw: unknown): Choice | null {
  if (!raw || typeof raw !== 'object') return null
  const c = raw as Record<string, unknown>
  const key = typeof c.key === 'string' ? c.key : ''
  const text = typeof c.text === 'string' ? c.text : ''
  if (!key || !text) return null
  return { key, text }
}

function normalizeQuestion(raw: unknown, fallbackId: string): Question | null {
  if (!raw || typeof raw !== 'object') return null
  const q = raw as Record<string, unknown>
  const id = typeof q.id === 'string' ? q.id : fallbackId
  if (!id) return null
  const choicesRaw = q.choices
  const choicesParsed = Array.isArray(choicesRaw)
    ? choicesRaw.map(normalizeChoice).filter((c): c is Choice => c !== null)
    : []
  const answerKeyRaw = q.answerKey
  const answerKey =
    typeof answerKeyRaw === 'string'
      ? answerKeyRaw
      : Array.isArray(answerKeyRaw) && answerKeyRaw.every((x) => typeof x === 'string')
        ? (answerKeyRaw as string[])
        : ''

  return {
    id,
    moduleId: typeof q.moduleId === 'string' ? q.moduleId : '',
    skill: typeof q.skill === 'string' ? q.skill : 'Practice',
    subSkill: typeof q.subSkill === 'string' ? q.subSkill : undefined,
    level: typeof q.level === 'string' ? q.level : '1',
    questionType: parseQuestionType(q.questionType),
    difficulty: typeof q.difficulty === 'number' ? q.difficulty : 1,
    prompt: typeof q.prompt === 'string' ? q.prompt : '',
    choices: choicesParsed.length > 0 ? choicesParsed : undefined,
    answerKey,
    explanation: typeof q.explanation === 'string' ? q.explanation : '',
    explanationSteps: Array.isArray(q.explanationSteps)
      ? q.explanationSteps.filter((s): s is string => typeof s === 'string')
      : undefined,
    hints: Array.isArray(q.hints) ? q.hints.filter((s): s is string => typeof s === 'string') : undefined,
    wrongChoiceReasons:
      q.wrongChoiceReasons && typeof q.wrongChoiceReasons === 'object' && !Array.isArray(q.wrongChoiceReasons)
        ? (q.wrongChoiceReasons as Record<string, string>)
        : undefined,
    tags: Array.isArray(q.tags) ? q.tags.filter((s): s is string => typeof s === 'string') : undefined,
    estimatedTimeSec: typeof q.estimatedTimeSec === 'number' ? q.estimatedTimeSec : undefined,
  }
}

export function normalizeWrongAnswerRecord(raw: unknown): WrongAnswerRecord | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const id = typeof r.id === 'string' ? r.id : ''
  const questionId = typeof r.questionId === 'string' ? r.questionId : ''
  if (!id || !questionId) return null
  const question = normalizeQuestion(r.question, questionId)
  if (!question) return null

  return {
    id,
    studentId: typeof r.studentId === 'string' ? r.studentId : '',
    questionId,
    question,
    studentAnswer: typeof r.studentAnswer === 'string' ? r.studentAnswer : '',
    correctAnswer: typeof r.correctAnswer === 'string' ? r.correctAnswer : '',
    explanation: typeof r.explanation === 'string' ? r.explanation : '',
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : new Date(0).toISOString(),
    reviewStatus: parseReviewStatus(r.reviewStatus),
    nextReviewAt: typeof r.nextReviewAt === 'string' ? r.nextReviewAt : undefined,
    reviewCount: typeof r.reviewCount === 'number' ? r.reviewCount : 0,
  }
}

function parseWrongAnswerListEnvelope(data: unknown): WrongAnswerRecord[] {
  if (!data || typeof data !== 'object') return []
  const d = data as { wrongAnswers?: unknown }
  if (!Array.isArray(d.wrongAnswers)) return []
  return d.wrongAnswers.map(normalizeWrongAnswerRecord).filter((x): x is WrongAnswerRecord => x !== null)
}

export async function fetchWrongAnswers(): Promise<WrongAnswerRecord[]> {
  const res = await api.get<ApiSuccess<unknown>>('/wrong-answers')
  if (!res.data.success) return []
  return parseWrongAnswerListEnvelope(res.data.data)
}

export async function fetchWrongAnswersReviewDue(): Promise<WrongAnswerRecord[]> {
  const res = await api.get<ApiSuccess<unknown>>('/wrong-answers/review-due')
  if (!res.data.success) return []
  return parseWrongAnswerListEnvelope(res.data.data)
}

export async function markWrongAnswerReviewed(id: string): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>(`/wrong-answers/${encodeURIComponent(id)}/reviewed`)
  if (!res.data.success) throw new Error('Could not update review status')
}

export async function markWrongAnswerMastered(id: string): Promise<void> {
  const res = await api.post<ApiResponse<unknown>>(`/wrong-answers/${encodeURIComponent(id)}/mastered`)
  if (!res.data.success) throw new Error('Could not mark as mastered')
}
