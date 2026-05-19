import { ArrowLeft, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchQuestions, createAnswer, type QuestionItem } from '@/api/volunteer'
import { routes } from '@/router/routes'

export function QABoardPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('open')
  const [answerText, setAnswerText] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadQuestions()
  }, [filter])

  async function loadQuestions() {
    setLoading(true)
    try {
      const data = await fetchQuestions(filter)
      setQuestions(data)
    } catch {
      // handled
    } finally {
      setLoading(false)
    }
  }

  async function handleAnswer(questionId: string) {
    const content = answerText[questionId]
    if (!content?.trim()) return
    setSubmitting((prev) => ({ ...prev, [questionId]: true }))
    try {
      await createAnswer(questionId, content)
      setAnswerText((prev) => ({ ...prev, [questionId]: '' }))
      await loadQuestions()
    } catch {
      // handled
    } finally {
      setSubmitting((prev) => ({ ...prev, [questionId]: false }))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(routes.volunteerDashboard)}
          className="rounded-[var(--radius-lg)] p-2 text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-border)/0.3)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-text))]">Q&A Board</h1>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">Help students with their questions</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['open', 'answered', ''].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-[var(--radius-lg)] px-4 py-2 text-sm font-medium transition-all ${
              filter === f
                ? 'bg-[hsl(var(--color-primary))] text-white'
                : 'bg-[hsl(var(--color-surface))] text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-border)/0.3)]'
            }`}
          >
            {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[hsl(var(--color-primary))] border-t-transparent" />
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[hsl(var(--color-border))] p-12 text-center">
          <p className="text-sm text-[hsl(var(--color-text-tertiary))]">No questions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q._id} className="rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-6">
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  q.status === 'open'
                    ? 'bg-green-100 text-green-700'
                    : q.status === 'answered'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {q.status}
                </span>
                {q.moduleId && (
                  <span className="text-xs text-[hsl(var(--color-text-tertiary))]">{q.moduleId}</span>
                )}
                <span className="text-xs text-[hsl(var(--color-text-tertiary))]">
                  {new Date(q.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-[hsl(var(--color-text))]">{q.content}</p>

              {/* Answers */}
              {(q as unknown as { answers: Array<{ _id: string; content: string; createdAt: string }> }).answers && (
                <div className="mt-4 space-y-3 border-t border-[hsl(var(--color-border))] pt-4">
                  {(q as unknown as { answers: Array<{ _id: string; content: string; createdAt: string }> }).answers.map((a) => (
                    <div key={a._id} className="rounded-[var(--radius-lg)] bg-[hsl(var(--color-bg))] p-3">
                      <p className="text-sm text-[hsl(var(--color-text-secondary))]">{a.content}</p>
                      <p className="mt-1 text-[10px] text-[hsl(var(--color-text-tertiary))]">
                        {new Date(a.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Answer form */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={answerText[q._id] ?? ''}
                  onChange={(e) => setAnswerText((prev) => ({ ...prev, [q._id]: e.target.value }))}
                  placeholder="Write your answer..."
                  className="flex-1 rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg))] px-4 py-2 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-tertiary))] focus:border-[hsl(var(--color-primary))] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAnswer(q._id)}
                  disabled={submitting[q._id] || !answerText[q._id]?.trim()}
                  className="flex items-center gap-2 rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary))] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
