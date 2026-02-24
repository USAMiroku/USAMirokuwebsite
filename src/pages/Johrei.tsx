import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Johrei() {
  const { t } = useTranslation()

  usePageMeta({
    title: `${t.johrei.title} | ${t.brand}`,
    description: t.johrei.intro,
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="border-b border-[rgba(184,134,11,0.2)] bg-white px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-5xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-sage-600">{t.johrei.kicker}</p>
          <h1 className="text-4xl font-serif leading-tight md:text-6xl">{t.johrei.title}</h1>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-slate-600 md:text-2xl">{t.johrei.intro}</p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-5xl space-y-8">
          <h2 className="text-3xl font-serif md:text-5xl">{t.johrei.vision.title}</h2>
          <p className="text-lg leading-relaxed text-slate-600">{t.johrei.vision.body}</p>
        </div>
      </Section>

      <Section className="bg-sanctuary-100 border-y border-[rgba(184,134,11,0.2)]">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title={t.johrei.whatIs.title} className="border-[rgba(184,134,11,0.2)] p-8">
            <p className="text-base leading-relaxed text-slate-600">{t.johrei.whatIs.body}</p>
          </Card>
          <Card title={t.johrei.whatIs.experience.title} className="border-[rgba(184,134,11,0.2)] p-8">
            <p className="text-base leading-relaxed text-slate-600">{t.johrei.whatIs.experience.body}</p>
          </Card>
          <Card title={t.johrei.whatIs.effect.title} className="border-[rgba(184,134,11,0.2)] p-8">
            <p className="text-base leading-relaxed text-slate-600">{t.johrei.whatIs.effect.body}</p>
          </Card>
        </div>
        <div className="mt-6">
          <Card title={t.johrei.whatIs.goal.title} className="border-[rgba(184,134,11,0.2)] p-8">
            <p className="text-base leading-relaxed text-slate-600">{t.johrei.whatIs.goal.body}</p>
          </Card>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="mx-auto max-w-5xl space-y-8">
          <h2 className="text-3xl font-serif md:text-5xl">{t.johrei.extra.title}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card title={t.johrei.extra.origin.title} className="border-[rgba(184,134,11,0.2)] p-8">
              <p className="text-base leading-relaxed text-slate-600">{t.johrei.extra.origin.body}</p>
            </Card>
            <Card title={t.johrei.extra.concept.title} className="border-[rgba(184,134,11,0.2)] p-8">
              <p className="text-base leading-relaxed text-slate-600">{t.johrei.extra.concept.body}</p>
            </Card>
            <Card title={t.johrei.extra.mission.title} className="border-[rgba(184,134,11,0.2)] p-8">
              <p className="text-base leading-relaxed text-slate-600">"{t.johrei.extra.mission.quote}"</p>
              <p className="mt-3 text-sm tracking-wide text-slate-500">- {t.johrei.extra.mission.author}</p>
            </Card>
            <Card title={t.johrei.extra.practice.title} className="border-[rgba(184,134,11,0.2)] p-8">
              <p className="text-base leading-relaxed text-slate-600">{t.johrei.extra.practice.body}</p>
            </Card>
          </div>
          <Card title={t.johrei.extra.benefits.title} className="border-[rgba(184,134,11,0.2)] p-8">
            <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600">
              {t.johrei.extra.benefits.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section className="bg-white text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-3xl font-serif md:text-5xl">{t.johrei.path.title}</h2>
          <p className="text-lg leading-relaxed text-slate-600">{t.johrei.path.body}</p>
          <div className="pt-2">
            <ButtonLink to="/locations" variant="accent">{t.actions.findCenter}</ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
