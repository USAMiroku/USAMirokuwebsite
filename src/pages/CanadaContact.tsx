import { ButtonLink } from '../components/ButtonLink'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function CanadaContact() {
  const { t } = useTranslation()

  usePageMeta({
    title: `${t.canada.contact.title} | ${t.brand}`,
    description: t.canada.contact.intro,
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="border-b border-[rgba(184,134,11,0.2)] bg-white px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-sage-600">{t.nav.canadaContact}</p>
          <h1 className="text-4xl font-serif md:text-6xl">{t.canada.contact.title}</h1>
          <p className="text-lg leading-relaxed text-slate-600">{t.canada.contact.intro}</p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-3xl">
          <dl className="grid gap-8 text-base">
            <div className="rounded-2xl border border-[rgba(184,134,11,0.2)] p-6">
              <dt className="font-semibold text-deep-slate">{t.canada.contact.labels.email}</dt>
              <dd className="mt-2"><a className="text-slate-600 hover:text-sage-600" href="mailto:canada@johrei.ca">canada@johrei.ca</a></dd>
            </div>
            <div className="rounded-2xl border border-[rgba(184,134,11,0.2)] p-6">
              <dt className="font-semibold text-deep-slate">{t.canada.contact.labels.phone}</dt>
              <dd className="mt-2"><a className="text-slate-600 hover:text-sage-600" href="tel:+14169005638">+1 (416) 900-5638</a></dd>
            </div>
            <div className="rounded-2xl border border-[rgba(184,134,11,0.2)] p-6">
              <dt className="font-semibold text-deep-slate">{t.canada.contact.labels.prayer}</dt>
              <dd className="mt-2">
                <a
                  className="text-slate-600 hover:text-sage-600"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeOc3XUREoA-FLFrTLjsUOxFEBHOaBf5m1AzWbZXOazpmRFOw/viewform?usp=sf_link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.canada.contact.prayerText}
                </a>
              </dd>
            </div>
            <div className="rounded-2xl border border-[rgba(184,134,11,0.2)] p-6">
              <dt className="font-semibold text-deep-slate">{t.canada.contact.labels.donate}</dt>
              <dd className="mt-2">
                <a className="text-slate-600 hover:text-sage-600" href="https://www.johreicanada.org/give" target="_blank" rel="noreferrer">
                  {t.canada.contact.donateText}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink to="/canada/activities" variant="accent">{t.canada.contact.activitiesCta}</ButtonLink>
            <ButtonLink to="/canada/units" variant="outline">{t.nav.canadaUnits}</ButtonLink>
          </div>

          <p className="mt-8 text-sm text-slate-500">{t.canada.contact.note}</p>
        </div>
      </Section>
    </div>
  )
}
