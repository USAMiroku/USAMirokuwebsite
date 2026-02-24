import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { testimonials } from '../data/testimonials'

export default function Testimonials() {
  const { t, language } = useTranslation()
  usePageMeta({
    title: `${t.testimonials.title} | ${t.brand}`,
    description: t.testimonials.intro,
  })
  return (
    <div className="space-y-12">
      <section className="rounded-[32px] bg-gradient-to-br from-rose-50 via-white to-violet-50 px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Testimonials</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{t.testimonials.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{t.testimonials.intro}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((test) => (
          <Card
            key={test.id}
            title={test.person}
            cta={
              <Link to={`/testimonials/${test.id}`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                {t.actions.learnMore} →
              </Link>
            }
          >
            {test.summary[language] ?? test.summary.en}
          </Card>
        ))}
      </div>
    </div>
  )
}
