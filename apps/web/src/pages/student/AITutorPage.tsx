import { Bot, Send, WifiOff } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { aiChat } from '@/api/ai'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function AITutorPage() {
  const { t } = useTranslation()
  const { isLowBandwidth } = useNetworkStatus()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: t('aiTutor.welcomeMessage') }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const truncatedMessages = isLowBandwidth ? messages.slice(-20) : messages

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || loading) return
    const question = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setLoading(true)

    try {
      const result = await aiChat(question)
      setMessages((prev) => [...prev, { role: 'assistant', content: result.answer }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t('aiTutor.errorMessage') }
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary)/0.1)]">
          <Bot className="h-5 w-5 text-[hsl(var(--color-primary))]" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-[hsl(var(--color-text))]">{t('aiTutor.title')}</h1>
          <p className="text-xs text-[hsl(var(--color-text-tertiary))]">{t('aiTutor.subtitle')}</p>
        </div>
      </div>

      {/* Low bandwidth notice */}
      {isLowBandwidth && (
        <div className="flex items-center gap-2 rounded-[var(--radius-lg)] border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>{t('aiTutor.lowBandwidthHint')}</span>
        </div>
      )}

      {/* Messages */}
      <div className="mt-2 flex-1 space-y-4 overflow-y-auto rounded-[var(--radius-xl)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] p-4">
        {truncatedMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-[var(--radius-lg)] px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-[hsl(var(--color-primary))] text-white'
                  : 'bg-[hsl(var(--color-bg))] text-[hsl(var(--color-text))]'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-[var(--radius-lg)] bg-[hsl(var(--color-bg))] px-4 py-3">
              <div className="flex gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-[hsl(var(--color-text-tertiary))]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-[hsl(var(--color-text-tertiary))] [animation-delay:0.1s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-[hsl(var(--color-text-tertiary))] [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('aiTutor.placeholder')}
          rows={1}
          className="flex-1 resize-none rounded-[var(--radius-lg)] border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface))] px-4 py-3 text-sm text-[hsl(var(--color-text))] placeholder:text-[hsl(var(--color-text-tertiary))] focus:border-[hsl(var(--color-primary))] focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="flex items-center gap-2 rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary))] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
