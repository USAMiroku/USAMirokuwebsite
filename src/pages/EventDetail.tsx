import { Link, useParams } from 'react-router-dom'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { events } from '../data/events'

export default function EventDetail() {
  const { id } = useParams()
  const { t, language } = useTranslation()
  const event = events.find((e) => e.id === id)

  usePageMeta({
    title: event ? `${event.title[language] ?? event.title.en} | ${t.brand}` : `${t.notFound} | ${t.brand}`,
    description: event ? (event.description[language] ?? event.description.en).slice(0, 160) : t.notFound,
  })

  if (!event) {
    return <p className="px-6 py-32 text-slate-700">{t.notFound}</p>
  }

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="border-b border-[rgba(141,107,38,0.14)] px-6 pb-14 pt-36 md:pt-40">
        <div className="mx-auto max-w-5xl space-y-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-sage-600">{event.date}</p>
          <h1 className="text-5xl font-serif leading-[0.95] md:text-6xl">{event.title[language] ?? event.title.en}</h1>
          {event.location && <p className="text-lg text-slate-600">{event.location}</p>}
          <Link
            to="/events"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[rgba(141,107,38,0.22)] bg-white/55 px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-deep-slate transition-all hover:-translate-y-0.5 hover:bg-white"
          >
            {t.actions.back}
          </Link>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-4xl">
          <Card title="Event Details">
            <p className="whitespace-pre-line text-base leading-8 text-slate-700">
              {event.description[language] ?? event.description.en}
            </p>
          </Card>
        </div>
      </Section>
    </div>
  )
}
