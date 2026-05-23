import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
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
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="relative overflow-hidden border-b border-[rgba(141,107,38,0.14)] px-6 pb-18 pt-36 md:pt-40">
        <div className="floating-orb left-[10%] top-24 h-28 w-28 bg-[rgba(141,110,99,0.14)]" />
        <div className="floating-orb right-[11%] top-30 h-24 w-24 bg-[rgba(255,255,255,0.28)]" />
        <div className="mx-auto max-w-5xl space-y-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-sage-600">Testimonials</p>
          <h1 className="text-5xl font-serif leading-[0.95] md:text-7xl">{t.testimonials.title}</h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">{t.testimonials.intro}</p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              title={testimonial.person}
              className="h-full"
              cta={
                <Link to={`/testimonials/${testimonial.id}`} className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-600">
                  {t.actions.learnMore}
                </Link>
              }
            >
              <p className="text-base leading-relaxed text-slate-600">{testimonial.summary[language] ?? testimonial.summary.en}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  )
}
