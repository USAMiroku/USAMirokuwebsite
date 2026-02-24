import { useTranslation } from '../context/TranslationContext'

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useTranslation()

  return (
    <div className={`flex items-center gap-1 overflow-hidden rounded-full p-1 ring-1 ring-slate-900/5 ${className}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${language === 'en'
          ? 'bg-slate-900 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-50'
          }`}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${language === 'fr'
          ? 'bg-slate-900 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-50'
          }`}
        aria-pressed={language === 'fr'}
      >
        FR
      </button>
    </div>
  )
}
