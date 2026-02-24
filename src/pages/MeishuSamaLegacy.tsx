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
      <section className="border-b border-[rgba(184,134,11,0.2)] bg-white px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-5xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-sage-600">{t.nav.meishuSama}</p>
          <h1 className="text-4xl font-serif leading-tight md:text-6xl">{t.meishuSama.legacy.title}</h1>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-slate-600 md:text-2xl">{t.meishuSama.legacy.intro}</p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {t.meishuSama.legacy.milestones.map((milestone) => (
            <Card key={milestone.title} title={milestone.title} className="border-[rgba(184,134,11,0.2)] bg-white p-8">
              <p className="text-base leading-relaxed text-slate-600">{milestone.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-sanctuary-100 border-y border-[rgba(184,134,11,0.2)]">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-3xl font-serif md:text-5xl">{t.meishuSama.legacy.legacyTitle}</h2>
          <ul className="list-disc space-y-2 pl-5 text-lg leading-relaxed text-slate-600">
            {t.meishuSama.legacy.legacyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="pt-2">
            <ButtonLink to="/meishu-sama" variant="outline">{t.actions.back}</ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
