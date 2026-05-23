import { Link, useParams } from 'react-router-dom'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { resources } from '../data/resources'

export default function ResourceDetail() {
  const { id } = useParams()
  const { t, language } = useTranslation()
  const resource = resources.find((item) => item.id === id)

  usePageMeta({
    title: resource ? `${resource.title[language] ?? resource.title.en} | ${t.brand}` : `${t.notFound} | ${t.brand}`,
    description: resource ? resource.summary[language] ?? resource.summary.en : t.notFound,
  })

  if (!resource) {
    return <p className="px-6 py-32 text-slate-700">{t.notFound}</p>
  }

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="border-b border-[rgba(141,107,38,0.14)] px-6 pb-14 pt-36 md:pt-40">
        <div className="mx-auto max-w-5xl space-y-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-sage-600">{resource.category}</p>
          <h1 className="text-5xl font-serif leading-[0.95] md:text-6xl">{resource.title[language] ?? resource.title.en}</h1>
          <Link
            to="/resources"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[rgba(141,107,38,0.22)] bg-white/55 px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-deep-slate transition-all hover:-translate-y-0.5 hover:bg-white"
          >
            {t.actions.back}
          </Link>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-4xl">
          <Card title="Reading">
            <p className="whitespace-pre-line text-base leading-8 text-slate-700">{resource.content[language] ?? resource.content.en}</p>
          </Card>
        </div>
      </Section>
    </div>
  )
}
