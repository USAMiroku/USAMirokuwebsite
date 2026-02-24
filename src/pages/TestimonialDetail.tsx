import { Link, useParams } from 'react-router-dom'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { testimonials } from '../data/testimonials'

export default function TestimonialDetail() {
  const { id } = useParams()
  const { t, language } = useTranslation()
  const testimonial = testimonials.find((item) => item.id === id)

  usePageMeta({
    title: testimonial ? `${testimonial.person} | ${t.brand}` : `${t.notFound} | ${t.brand}`,
    description: testimonial ? testimonial.summary[language] : t.notFound,
  })

  if (!testimonial) {
    return <p className="text-slate-700">{t.notFound}</p>
  }

  return (
    <div className="space-y-12">
      <section className="rounded-[32px] bg-gradient-to-br from-rose-50 via-white to-violet-50 px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">{testimonial.person}</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{testimonial.summary[language]}</h1>
        <div className="mt-4">
          <Link to="/testimonials" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            {t.actions.back}
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-700 whitespace-pre-line">{testimonial.detail[language]}</p>
        <a
          className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          href={testimonial.externalUrl}
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </section>
    </div>
  )
}
