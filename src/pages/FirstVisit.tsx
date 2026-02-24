import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { ButtonLink } from '../components/ButtonLink'

export default function FirstVisit() {
  const { t } = useTranslation()
  usePageMeta({
    title: `${t.firstVisit.title} | ${t.brand}`,
    description: t.firstVisit.intro,
  })

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      {/* Intro Header */}
      <section className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">
            A Proper Welcome
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-deep-slate leading-tight">
            {t.firstVisit.title}
          </h1>
          <p className="text-xl md:text-3xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            {t.firstVisit.intro}
          </p>
        </div>
      </section>

      {/* Step by Step Guide */}
      <Section py-32 className="bg-white">
        <div className="max-w-5xl mx-auto px-6 grid gap-20">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-4xl font-serif text-deep-slate">{t.firstVisit.kicker}</h2>
            <div className="h-1 w-20 bg-sage-600 mx-auto" />
          </div>

          <div className="grid gap-16 md:grid-cols-3">
            {t.firstVisit.steps.map((step, i) => (
              <div key={i} className="space-y-8 group">
                <div className="w-16 h-16 rounded-full bg-sanctuary-100 flex items-center justify-center text-2xl font-serif text-sage-600 group-hover:bg-sage-600 group-hover:text-white transition-all duration-500">
                  {i + 1}
                </div>
                <h3 className="text-2xl font-serif text-deep-slate tracking-tight">{step.title}</h3>
                <p className="text-slate-500 font-serif italic text-lg leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Practical Tips & Etiquette */}
      <Section py-32 className="bg-sanctuary-50">
        <div className="max-w-7xl mx-auto px-6 grid gap-12 lg:grid-cols-2">

          {/* Tips */}
          <div className="bg-white p-12 md:p-16 rounded-sanctuary-lg shadow-sm space-y-12">
            <h3 className="text-3xl font-serif text-deep-slate">{t.firstVisit.tips.title}</h3>
            <ul className="space-y-6">
              {t.firstVisit.tips.items.map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="text-sage-600 mt-1">✓</span>
                  <p className="text-slate-600 text-lg leading-relaxed font-serif italic">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Etiquette */}
          <div className="bg-deep-slate text-white p-12 md:p-16 rounded-sanctuary-lg space-y-12 relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sage-600/5 to-transparent pointer-events-none" />
            <h3 className="text-3xl font-serif relative">Sanctuary Etiquette</h3>
            <ul className="space-y-6 relative">
              {t.firstVisit.etiquette.items.map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="text-sage-300 mt-1">✦</span>
                  <p className="text-slate-300 text-lg leading-relaxed font-serif italic">{item}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </Section>

      {/* Location CTA */}
      <section className="py-40 text-center px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-6xl font-serif text-deep-slate">Find a Center Near You</h2>
          <p className="text-xl text-slate-500 font-serif italic">
            Our doors are open across the United States. Search our directory to find a center or regional gathering.
          </p>
          <ButtonLink to="/locations" variant="primary" className="h-16 px-16">
            View All Locations
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
