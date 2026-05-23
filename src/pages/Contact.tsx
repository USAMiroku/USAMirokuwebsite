import { useMemo, useState } from 'react'
import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { Section } from '../components/Section'
import { siteConfig } from '../config/siteConfig'
import { useManagedCenters } from '../organization/centers'

type ContactFormState = {
  name: string
  email: string
  locationId: string
  message: string
}

function buildMapsEmbed(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
}

export default function Contact() {
  const { t, language } = useTranslation()
  const { activeCenters } = useManagedCenters()

  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    locationId: '',
    message: '',
  })

  const locationLabel = language === 'en' ? 'Center' : 'Centro'
  const messageLabel = language === 'en' ? 'Message' : language === 'es' ? 'Mensaje' : 'Mensagem'
  const submitLabel = language === 'en' ? 'Send message' : language === 'es' ? 'Enviar mensaje' : 'Enviar mensagem'
  const pageLabel = language === 'en' ? 'National Office' : language === 'es' ? 'Oficina nacional' : 'Escritório nacional'
  const officeLabel = language === 'en' ? 'Office details' : language === 'es' ? 'Datos de oficina' : 'Dados do escritório'
  const recipientLabel = language === 'en' ? 'Messages go to' : language === 'es' ? 'Los mensajes se enviarán a' : 'As mensagens serão enviadas para'

  const selectedCenter = useMemo(
    () => activeCenters.find((entry) => entry.id === form.locationId) ?? null,
    [activeCenters, form.locationId],
  )

  const mailtoRecipient = useMemo(() => {
    return selectedCenter?.email || siteConfig.hq.email
  }, [selectedCenter])

  const mapEmbedSrc = buildMapsEmbed(siteConfig.hq.address)
  usePageMeta({
    title: `${t.contact.title} | ${siteConfig.organizationName}`,
    description: t.contact.intro,
  })

  function updateField(field: keyof ContactFormState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const centerName = selectedCenter?.name ?? 'General Inquiry'
    const subject = encodeURIComponent(`Website Inquiry - ${centerName}`)
    const cc = encodeURIComponent(siteConfig.hq.email)
    const body = encodeURIComponent(
      [
        `Full Name: ${form.name.trim()}`,
        `Email: ${form.email.trim()}`,
        `Center: ${centerName}`,
        '',
        form.message.trim(),
      ].join('\n'),
    )

    window.location.href = `mailto:${mailtoRecipient}?cc=${cc}&subject=${subject}&body=${body}`
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="public-hero">
        <div className="public-hero-grid">
          <div className="public-hero-copy">
            <p className="public-eyebrow">{pageLabel}</p>
            <h1 className="public-title">{t.contact.title}</h1>
            <p className="public-body">{t.contact.intro}</p>
          </div>
          <div className="public-hero-note">
            <p className="public-eyebrow">{officeLabel}</p>
            <p className="mt-4">{siteConfig.hq.address}</p>
            <p className="mt-3">{siteConfig.hq.phone}</p>
            <p>{siteConfig.hq.email}</p>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Card title={t.contact.title}>
              <div className="grid gap-4">
                {[
                  {
                    label: t.contact.options.general,
                    value: siteConfig.hq.email,
                    caption: t.contact.options.general,
                    link: `mailto:${siteConfig.hq.email}`,
                    external: true,
                  },
                  {
                    label: t.contact.options.visit,
                    value: siteConfig.hq.phone,
                    caption: t.contact.options.visit,
                    link: `tel:${siteConfig.hq.phone}`,
                    external: true,
                  },
                  {
                    label: t.contact.options.learn,
                    value: t.actions.learnMore,
                    caption: t.contact.options.learn,
                    link: '/resources',
                    external: false,
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-white px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-600">{item.caption}</p>
                    <p className="mt-2 text-xl font-serif text-deep-slate">{item.value}</p>
                    {item.external ? (
                      <a href={item.link} className="mt-4 inline-block text-[10px] font-bold uppercase tracking-[0.18em] text-sage-600">
                        {t.actions.contact}
                      </a>
                    ) : (
                      <ButtonLink to={item.link} variant="ghost" className="mt-4 px-0">
                        {t.actions.contact}
                      </ButtonLink>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="border border-[rgba(15,23,42,0.08)] bg-white p-8 md:p-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif text-deep-slate">{t.contact.title}</h2>
              <p className="text-slate-600">{t.contact.intro}</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.donate.fields.name}</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className="h-12 w-full rounded-lg border border-[rgba(15,23,42,0.12)] bg-white px-4 outline-none transition-colors focus:border-sage-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.donate.fields.email}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className="h-12 w-full rounded-lg border border-[rgba(15,23,42,0.12)] bg-white px-4 outline-none transition-colors focus:border-sage-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{locationLabel}</label>
                <select
                  value={form.locationId}
                  onChange={(event) => updateField('locationId', event.target.value)}
                  className="h-12 w-full rounded-lg border border-[rgba(15,23,42,0.12)] bg-white px-4 outline-none transition-colors focus:border-sage-600"
                >
                  <option value="">{siteConfig.shortName} - HQ</option>
                  {activeCenters
                    .filter((center) => center.kind !== 'hq')
                    .map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{messageLabel}</label>
                <textarea
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  className="min-h-[180px] w-full rounded-lg border border-[rgba(15,23,42,0.12)] bg-white p-4 outline-none transition-colors focus:border-sage-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-deep-slate text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#14202a]"
              >
                {submitLabel}
              </button>

              <p className="text-xs text-slate-500 leading-relaxed">
                {recipientLabel}: <span className="font-semibold text-deep-slate">{mailtoRecipient}</span>
              </p>
            </form>
          </div>
        </div>
      </Section>

      <Section className="section-wash border-y border-[rgba(141,107,38,0.12)]">
        <div className="mx-auto max-w-6xl">
          <h3 className="mb-6 text-3xl font-serif text-deep-slate">{t.contact.options.visit}</h3>
          <div className="overflow-hidden rounded-xl border border-[rgba(15,23,42,0.08)] bg-white">
            <iframe title="Headquarters map" src={mapEmbedSrc} className="h-[420px] w-full border-0" loading="lazy" />
          </div>
        </div>
      </Section>

      <Section className="bg-sanctuary-100">
        <div className="public-band mx-auto max-w-4xl px-8 py-12 text-center md:px-12">
          <h2 className="text-4xl font-serif md:text-5xl">{t.firstVisit.title}</h2>
          <div className="mt-8">
            <ButtonLink to="/locations" variant="secondary" className="bg-white text-deep-slate hover:bg-[#f3ede2]">
              {t.actions.findCenter}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
