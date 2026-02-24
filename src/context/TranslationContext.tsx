import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations, type Language, type TranslationContent } from '../data/translations'
import { siteConfig } from '../config/siteConfig'

type TranslationContextValue = {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationContent
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined)

const STORAGE_KEY = 'miroku-lang'

function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'es' || value === 'pt'
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en'
    const stored = localStorage.getItem(STORAGE_KEY)
    return isLanguage(stored) ? stored : 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const value = useMemo(
    () => {
      const selected = (translations[language] ?? translations.en) as TranslationContent
      return {
        language,
        setLanguage,
        t: {
          ...selected,
          brand: siteConfig.organizationName,
        },
      }
    },
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
