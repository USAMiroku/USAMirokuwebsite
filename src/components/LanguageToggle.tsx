import { useTranslation } from '../context/TranslationContext'

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useTranslation()

  const options = [
    { id: 'en', label: 'EN' },
    { id: 'es', label: 'ES' },
    { id: 'pt', label: 'PT' },
  ] as const

  return (
    <div className={`flex items-center gap-1 overflow-hidden rounded-full p-1 ring-1 ring-slate-900/5 ${className}`}>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => setLanguage(option.id)}
          className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
            language === option.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
          aria-pressed={language === option.id}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
