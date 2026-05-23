import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { resources } from '../data/resources'

export default function Resources() {
  const { t, language } = useTranslation()

  usePageMeta({
    title: `${t.resourcesPage.title} | ${t.brand}`,
    description: t.resourcesPage.intro,
  })

  const categories = Array.from(new Set(resources.map((resource) => resource.category)))

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="relative overflow-hidden border-b border-[rgba(141,107,38,0.14)] px-6 pb-18 pt-36 md:pt-40">
        <div className="floating-orb left-[10%] top-24 h-28 w-28 bg-[rgba(173,123,34,0.16)]" />
        <div className="floating-orb right-[11%] top-32 h-24 w-24 bg-[rgba(255,255,255,0.28)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-sage-600">Resources</p>
            <h1 className="text-5xl font-serif leading-[0.95] md:text-7xl">{t.resourcesPage.title}</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">{t.resourcesPage.intro}</p>
          </div>
          <div className="paper-panel ornament-ring rounded-[32px] p-7 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sage-600">{t.resourcesPage.categories}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-[rgba(141,107,38,0.12)] bg-white/72 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-warm/70"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              title={resource.title[language] ?? resource.title.en}
              eyebrow={resource.category}
              className="h-full"
              cta={
                <Link to={`/resources/${resource.id}`} className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-600">
                  {t.actions.learnMore}
                </Link>
              }
            >
              <p className="text-base leading-relaxed text-slate-600">{resource.summary[language] ?? resource.summary.en}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  )
}
