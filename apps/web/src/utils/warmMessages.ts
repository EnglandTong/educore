import i18n from '@/i18n'

export function getWarmLoginRedirectMessage(): string {
  return i18n.t('auth.signInAgain')
}

export function pickWarmLoadingMessage(): string {
  const messages = [
    i18n.t('warm.loading1'),
    i18n.t('warm.loading2'),
  ]
  const i = Math.floor(Math.random() * messages.length)
  return messages[i] ?? messages[0]!
}

const heartMessages = [
  'warm.heartWelcome',
  'warm.heartJournalSaved',
  'warm.heartProudAdded',
  'warm.heartMoodTracked',
  'warm.heartOfflineSaved',
]

export function pickWarmHeartMessage(): string {
  const keys = heartMessages
  const i = Math.floor(Math.random() * keys.length)
  const key = keys[i]
  return key ? i18n.t(key) : ''
}

export function pickWarmHeartMessageByAction(action: 'journal' | 'proud' | 'mood' | 'offline'): string {
  const map: Record<string, string> = {
    journal: 'warm.heartJournalSaved',
    proud: 'warm.heartProudAdded',
    mood: 'warm.heartMoodTracked',
    offline: 'warm.heartOfflineSaved',
  }
  const key = map[action] ?? heartMessages[0]!
  return i18n.t(key)
}
