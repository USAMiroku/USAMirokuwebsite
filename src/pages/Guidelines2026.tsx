import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Guidelines2026() {
  const { t } = useTranslation()
  usePageMeta({
    title: `${t.guidelines.title} | ${t.brand}`,
    description: t.guidelines.motto,
  })
  return (
    <div className="space-y-12">
      <section className="rounded-[32px] bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Guidelines</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{t.guidelines.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{t.guidelines.motto}</p>
        <p className="mt-2 text-sm text-slate-500">{t.guidelines.placeholderEn}</p>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">{t.guidelines.titleFr}</h2>
        <p className="mt-3 text-lg text-slate-600">{t.guidelines.mottoFr}</p>
        <p className="mt-2 text-sm text-slate-500">{t.guidelines.placeholderFr}</p>
      </section>
    </div>
  )
}
