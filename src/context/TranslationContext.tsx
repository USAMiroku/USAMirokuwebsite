import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations, type Language, type TranslationContent } from '../data/translations'

type TranslationContextValue = {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationContent
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined)

const STORAGE_KEY = 'miroku-lang'

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en'
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null
    return stored === 'en' || stored === 'fr' ? stored : 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language],
  )

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const ctx = useContext(TranslationContext)
  if (!ctx) {
    throw new Error('useTranslation must be used within TranslationProvider')
  }
  return ctx
}
