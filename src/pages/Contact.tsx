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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({})
  const [sendNotice, setSendNotice] = useState('')

  const locationLabel = language === 'en' ? 'Center' : 'Centro'
  const messageLabel = language === 'en' ? 'Message' : language === 'es' ? 'Mensaje' : 'Mensagem'
  const submitLabel = language === 'en' ? 'Send message' : language === 'es' ? 'Enviar mensaje' : 'Enviar mensagem'
  const pageLabel = language === 'en' ? 'National Office' : language === 'es' ? 'Oficina nacional' : 'Escritório nacional'
  const officeLabel = language === 'en' ? 'Office details' : language === 'es' ? 'Datos de oficina' : 'Dados do escritório'
  const recipientLabel = language === 'en' ? 'Messages go to' : language === 'es' ? 'Los mensajes se enviarán a' : 'As mensagens serão enviadas para'
  const emailHandoffNotice = language === 'en'
    ? 'Your email application will open with a prepared draft. The website does not send the message automatically—you must review it and press Send in your email application.'
    : language === 'es'
      ? 'Su aplicación de correo se abrirá con un borrador preparado. El sitio web no envía el mensaje automáticamente; debe revisarlo y pulsar Enviar en su aplicación de correo.'
      : 'Seu aplicativo de e-mail será aberto com um rascunho preparado. O site não envia a mensagem automaticamente — você deve revisá-la e pressionar Enviar no aplicativo de e-mail.'
  const emailOpenedNotice = language === 'en'
    ? 'The email draft was opened. Nothing was sent automatically; complete sending in your email application.'
    : language === 'es'
      ? 'Se abrió el borrador de correo. Nada se envió automáticamente; complete el envío en su aplicación de correo.'
      : 'O rascunho de e-mail foi aberto. Nada foi enviado automaticamente; conclua o envio no seu aplicativo de e-mail.'
  const requiredMessage = language === 'en' ? 'This field is required.' : language === 'es' ? 'Este campo es obligatorio.' : 'Este campo é obrigatório.'
  const emailMessage = language === 'en' ? 'Enter a valid email address.' : language === 'es' ? 'Ingrese un email válido.' : 'Digite um e-mail válido.'

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
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof ContactFormState, string>> = {}

    if (!form.name.trim()) nextErrors.name = requiredMessage
    if (!form.email.trim()) {
      nextErrors.email = requiredMessage
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = emailMessage
    }
    if (!form.message.trim()) nextErrors.message = requiredMessage

    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

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
    setFieldErrors({})
    setSendNotice(emailOpenedNotice)
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

            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.donate.fields.name}</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    aria-invalid={fieldErrors.name ? 'true' : undefined}
                    aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                    className="h-12 w-full rounded-lg border border-[rgba(15,23,42,0.12)] bg-white px-4 outline-none transition-colors focus:border-sage-600"
                    required
                  />
                  {fieldErrors.name ? <p id="contact-name-error" className="text-xs font-medium text-rose-800">{fieldErrors.name}</p> : null}
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.donate.fields.email}</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    aria-invalid={fieldErrors.email ? 'true' : undefined}
                    aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                    className="h-12 w-full rounded-lg border border-[rgba(15,23,42,0.12)] bg-white px-4 outline-none transition-colors focus:border-sage-600"
                    required
                  />
                  {fieldErrors.email ? <p id="contact-email-error" className="text-xs font-medium text-rose-800">{fieldErrors.email}</p> : null}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-location" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{locationLabel}</label>
                <select
                  id="contact-location"
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
                <label htmlFor="contact-message" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{messageLabel}</label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  aria-invalid={fieldErrors.message ? 'true' : undefined}
                  aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                  className="min-h-[180px] w-full rounded-lg border border-[rgba(15,23,42,0.12)] bg-white p-4 outline-none transition-colors focus:border-sage-600"
                  required
                />
                {fieldErrors.message ? <p id="contact-message-error" className="text-xs font-medium text-rose-800">{fieldErrors.message}</p> : null}
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
              <p className="text-xs leading-relaxed text-slate-500">{emailHandoffNotice}</p>
              {sendNotice ? (
                <p role="status" className="rounded-lg border border-sage-200 bg-sage-50 px-4 py-3 text-sm leading-relaxed text-deep-slate">
                  {sendNotice}
                </p>
              ) : null}
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
