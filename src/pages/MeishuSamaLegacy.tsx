import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function MeishuSamaLegacy() {
  const { t } = useTranslation()

  usePageMeta({
    title: `${t.meishuSama.legacy.title} | ${t.brand}`,
    description: t.meishuSama.legacy.intro,
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="relative overflow-hidden border-b border-[rgba(141,107,38,0.14)] px-6 pb-18 pt-36 md:pt-40">
        <div className="floating-orb left-[10%] top-24 h-28 w-28 bg-[rgba(173,123,34,0.16)]" />
        <div className="floating-orb right-[11%] top-30 h-24 w-24 bg-[rgba(255,255,255,0.28)]" />
        <div className="mx-auto max-w-5xl space-y-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-sage-600">{t.nav.meishuSama}</p>
          <h1 className="text-5xl font-serif leading-[0.95] md:text-7xl">{t.meishuSama.legacy.title}</h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">{t.meishuSama.legacy.intro}</p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {t.meishuSama.legacy.milestones.map((milestone, index) => (
            <Card key={milestone.title} title={milestone.title} eyebrow={`0${index + 1}`} className="h-full">
              <p className="text-base leading-relaxed text-slate-600">{milestone.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="section-wash border-y border-[rgba(141,107,38,0.12)]">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-sage-600">Legacy</p>
            <h2 className="text-4xl font-serif md:text-5xl">{t.meishuSama.legacy.legacyTitle}</h2>
          </div>
          <Card>
            <ul className="space-y-4 text-base leading-relaxed text-slate-600">
              {t.meishuSama.legacy.legacyPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-1 text-sage-600">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>
          <div className="pt-2">
            <ButtonLink to="/meishu-sama" variant="outline">
              {t.actions.back}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
