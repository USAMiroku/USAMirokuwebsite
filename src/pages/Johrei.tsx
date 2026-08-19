import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { healthDisclosure } from '../data/grantContent'

export default function Johrei() {
  const { t, language } = useTranslation()

  usePageMeta({
    title: `${t.johrei.title} | ${t.brand}`,
    description: t.johrei.intro,
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="relative overflow-hidden border-b border-[rgba(141,107,38,0.14)] px-6 pb-18 pt-36 md:pt-40">
        <div className="floating-orb left-[9%] top-26 h-28 w-28 bg-[rgba(173,123,34,0.16)]" />
        <div className="floating-orb right-[10%] top-32 h-24 w-24 bg-[rgba(255,255,255,0.28)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-sage-600">{t.johrei.kicker}</p>
            <h1 className="max-w-5xl text-5xl font-serif leading-[0.95] md:text-7xl">{t.johrei.title}</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">{t.johrei.intro}</p>
          </div>
          <div className="paper-panel ornament-ring rounded-[32px] p-7 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sage-600">Essence</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Johrei is presented not merely as a technique, but as a way of participating in Divine Light, purification, and the restoration of harmony.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-[rgba(141,107,38,0.12)] bg-white/70 px-4 py-3">
                <p className="text-sm font-semibold text-deep-slate">{t.johrei.whatIs.title}</p>
              </div>
              <div className="rounded-2xl border border-[rgba(141,107,38,0.12)] bg-white/70 px-4 py-3">
                <p className="text-sm font-semibold text-deep-slate">{t.johrei.whatIs.experience.title}</p>
              </div>
              <div className="rounded-2xl border border-[rgba(141,107,38,0.12)] bg-white/70 px-4 py-3">
                <p className="text-sm font-semibold text-deep-slate">{t.johrei.whatIs.effect.title}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 pt-10">
        <p className="rounded-2xl border border-[rgba(141,107,38,0.2)] bg-white px-6 py-5 text-sm font-medium leading-7 text-deep-slate">{healthDisclosure[language]}</p>
      </div>

      <Section className="bg-white">
        <div className="mx-auto max-w-5xl rounded-[32px] paper-panel p-8 md:p-10">
          <h2 className="text-4xl font-serif md:text-5xl">{t.johrei.vision.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{t.johrei.vision.body}</p>
        </div>
      </Section>

      <Section className="section-wash border-y border-[rgba(141,107,38,0.12)]">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title={t.johrei.whatIs.title} className="h-full">
            <p className="text-base leading-relaxed text-slate-600">{t.johrei.whatIs.body}</p>
          </Card>
          <Card title={t.johrei.whatIs.experience.title} className="h-full">
            <p className="text-base leading-relaxed text-slate-600">{t.johrei.whatIs.experience.body}</p>
          </Card>
          <Card title={t.johrei.whatIs.effect.title} className="h-full">
            <p className="text-base leading-relaxed text-slate-600">{t.johrei.whatIs.effect.body}</p>
          </Card>
        </div>
        <div className="mt-6">
          <Card title={t.johrei.whatIs.goal.title}>
            <p className="text-base leading-relaxed text-slate-600">{t.johrei.whatIs.goal.body}</p>
          </Card>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-sage-600">{t.johrei.extra.title}</p>
            <h2 className="text-4xl font-serif md:text-5xl">{t.johrei.extra.title}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card title={t.johrei.extra.origin.title} className="h-full">
              <p className="text-base leading-relaxed text-slate-600">{t.johrei.extra.origin.body}</p>
            </Card>
            <Card title={t.johrei.extra.concept.title} className="h-full">
              <p className="text-base leading-relaxed text-slate-600">{t.johrei.extra.concept.body}</p>
            </Card>
            <Card title={t.johrei.extra.mission.title} className="h-full">
              <p className="text-lg font-serif italic leading-relaxed text-ink-warm">"{t.johrei.extra.mission.quote}"</p>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{t.johrei.extra.mission.author}</p>
            </Card>
            <Card title={t.johrei.extra.practice.title} className="h-full">
              <p className="text-base leading-relaxed text-slate-600">{t.johrei.extra.practice.body}</p>
            </Card>
          </div>
          <Card title={t.johrei.extra.benefits.title}>
            <ul className="space-y-3 text-base leading-relaxed text-slate-600">
              {t.johrei.extra.benefits.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-sage-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section className="bg-sanctuary-100">
        <div className="mx-auto max-w-4xl rounded-[32px] bg-[linear-gradient(140deg,#1f2933_0%,#203831_100%)] px-8 py-12 text-center text-white shadow-[0_34px_80px_-48px_rgba(31,41,51,0.85)] md:px-12">
          <h2 className="text-4xl font-serif md:text-5xl">{t.johrei.path.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/75">{t.johrei.path.body}</p>
          <div className="pt-8">
            <ButtonLink to="/locations" variant="accent">
              {t.actions.findCenter}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
