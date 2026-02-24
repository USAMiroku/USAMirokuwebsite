import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { resources } from '../data/resources'

export default function Resources() {
  const { t, language } = useTranslation()
  usePageMeta({
    title: `${t.resourcesPage.title} | ${t.brand}`,
    description: t.resourcesPage.intro,
  })
  const categories = Array.from(new Set(resources.map((r) => r.category)))

  return (
    <div className="space-y-12">
      <section className="rounded-[32px] bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Resources</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{t.resourcesPage.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{t.resourcesPage.intro}</p>
      </section>

      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">{t.resourcesPage.categories}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((res) => (
          <Card
            key={res.id}
            title={res.title[language] ?? res.title.en}
            eyebrow={res.category}
            cta={
              <Link to={`/resources/${res.id}`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                {t.actions.learnMore} →
              </Link>
            }
          >
            {res.summary[language] ?? res.summary.en}
          </Card>
        ))}
      </div>
    </div>
  )
}
