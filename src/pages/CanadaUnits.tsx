import { ButtonLink } from '../components/ButtonLink'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function CanadaUnits() {
  const { t } = useTranslation()

  usePageMeta({
    title: `${t.canada.units.title} | ${t.brand}`,
    description: t.canada.units.intro,
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="border-b border-[rgba(184,134,11,0.2)] bg-white px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-sage-600">{t.nav.canadaUnits}</p>
          <h1 className="text-4xl md:text-6xl font-serif">{t.canada.units.title}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">{t.canada.units.intro}</p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {t.canada.units.units.map((unit) => (
            <article key={unit.name} className="rounded-3xl border border-[rgba(184,134,11,0.2)] bg-white p-8">
              <h2 className="text-2xl font-serif">{unit.name}</h2>
              {unit.address && <p className="mt-3 text-sm text-slate-600">{unit.address}</p>}
              {unit.leaders && (
                <p className="mt-3 text-slate-600">
                  <span className="font-semibold text-deep-slate">{t.canada.units.labels.leaders}: </span>
                  {unit.leaders}
                </p>
              )}
              {unit.contact && (
                <p className="mt-2 text-slate-600">
                  <span className="font-semibold text-deep-slate">{t.canada.units.labels.contact}: </span>
                  {unit.contact}
                </p>
              )}
              <p className="mt-2 text-slate-600">
                <span className="font-semibold text-deep-slate">{t.canada.units.labels.phone}: </span>
                <a className="hover:text-sage-600" href={`tel:${unit.phone}`}>{unit.phone}</a>
              </p>
              <p className="mt-2 text-slate-600">
                <span className="font-semibold text-deep-slate">{t.canada.units.labels.email}: </span>
                <a className="hover:text-sage-600" href={`mailto:${unit.email}`}>{unit.email}</a>
              </p>
              {unit.note && <p className="mt-3 text-sm text-slate-500">{unit.note}</p>}
              <div className="mt-6">
                <ButtonLink to="/canada/contact" variant="secondary">{t.canada.units.cardCta}</ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  )
}
