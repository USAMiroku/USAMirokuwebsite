import { Link, useParams } from 'react-router-dom'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { resources } from '../data/resources'

export default function ResourceDetail() {
  const { id } = useParams()
  const { t, language } = useTranslation()
  const resource = resources.find((r) => r.id === id)

  usePageMeta({
    title: resource ? `${resource.title[language]} | ${t.brand}` : `${t.notFound} | ${t.brand}`,
    description: resource ? resource.summary[language] : t.notFound,
  })

  if (!resource) {
    return <p className="text-slate-700">{t.notFound}</p>
  }

  return (
    <div className="space-y-12">
      <section className="rounded-[32px] bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">{resource.category}</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{resource.title[language]}</h1>
        <div className="mt-4">
          <Link to="/resources" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            {t.actions.back}
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-700 whitespace-pre-line">{resource.content[language]}</p>
      </section>
    </div>
  )
}
