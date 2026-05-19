import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/Button'

const LANGUAGES = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
] as const

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const next = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(next)
  }

  const currentLabel = LANGUAGES.find((l) => l.code === i18n.language)?.label ?? 'EN'

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="min-h-[36px] gap-1.5 px-2 text-xs font-semibold"
      aria-label="Switch language"
      onClick={toggleLanguage}
    >
      <Languages className="h-3.5 w-3.5" aria-hidden />
      <span>{currentLabel}</span>
    </Button>
  )
}
