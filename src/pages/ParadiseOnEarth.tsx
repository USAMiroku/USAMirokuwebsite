import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function ParadiseOnEarth() {
  const { t } = useTranslation()
  usePageMeta({
    title: `${t.paradise.title} | ${t.brand}`,
    description: t.paradise.intro,
  })
  return (
    <div className="space-y-12">
      <section className="rounded-[32px] bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Our vision</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{t.paradise.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{t.paradise.intro}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {t.paradise.points.map((point: string) => (
          <div key={point} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">{point}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
