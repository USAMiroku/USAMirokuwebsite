import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { ButtonLink } from '../components/ButtonLink'

export default function Events() {
  const { t } = useTranslation()
  usePageMeta({
    title: `${t.events.title} | ${t.brand}`,
    description: 'Upcoming events, monthly appreciation services, and community gatherings at World Messianic Church of Canada.',
  })

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      {/* Editorial Header */}
      <section className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">
            Sacred Gatherings
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-deep-slate leading-tight">
            {t.events.title}
          </h1>
          <p className="text-xl md:text-3xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Join our community for sessions of light, appreciation services, and gatherings of gratitude.
          </p>
        </div>
      </section>

      {/* Events List */}
      <Section py-32 className="bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="p-16 md:p-24 rounded-sanctuary-lg border border-slate-100 bg-sanctuary-50/50 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif text-deep-slate italic">A Time for Connection</h2>
              <div className="h-1 w-20 bg-sage-600 mx-auto" />
            </div>
            <p className="text-xl text-slate-600 font-serif italic leading-relaxed">
              {t.events.empty}
            </p>
            <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
              We hold regular monthly appreciation services and weekly Johrei sessions across Canada. Contact your local center to receive the full schedule.
            </p>
            <div className="pt-8">
              <ButtonLink to="/locations" variant="primary">
                Find Your Local Center
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
