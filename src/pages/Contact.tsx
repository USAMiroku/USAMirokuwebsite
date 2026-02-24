import { useMemo, useState } from 'react'
import { ButtonLink } from '../components/ButtonLink'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { Section } from '../components/Section'
import { siteConfig } from '../config/siteConfig'

type ContactFormState = {
  name: string
  email: string
  locationId: string
  message: string
}

function buildMapsEmbed(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
}

function buildMapsLink(address: string) {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`
}

export default function Contact() {
  const { t, language } = useTranslation()

  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    locationId: '',
    message: '',
  })

  const locationLabel =
    language === 'es'
      ? 'Centro'
      : language === 'pt'
        ? 'Centro'
        : 'Center'

  const messageLabel =
    language === 'es'
      ? 'Mensaje'
      : language === 'pt'
        ? 'Mensagem'
        : 'Message'

  const submitLabel =
    language === 'es'
      ? 'Enviar mensaje'
      : language === 'pt'
        ? 'Enviar mensagem'
        : 'Send message'

  const mailtoRecipient = useMemo(() => {
    const center = siteConfig.centers.find((entry) => entry.id === form.locationId)
    return center?.email || siteConfig.hq.email
  }, [form.locationId])

  const mapEmbedSrc = buildMapsEmbed(siteConfig.hq.address)
  const mapLink = buildMapsLink(siteConfig.hq.address)

  usePageMeta({
    title: `${t.contact.title} | ${siteConfig.organizationName}`,
    description: t.contact.intro,
  })

  function updateField(field: keyof ContactFormState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const centerName = siteConfig.centers.find((entry) => entry.id === form.locationId)?.name ?? 'General Inquiry'
    const subject = encodeURIComponent(`Website Inquiry - ${centerName}`)
    const body = encodeURIComponent(
      [
        `Full Name: ${form.name.trim()}`,
        `Email: ${form.email.trim()}`,
        `Center: ${centerName}`,
        '',
        form.message.trim(),
      ].join('\n'),
    )

    window.location.href = `mailto:${mailtoRecipient}?subject=${subject}&body=${body}`
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Direct Resonance</span>
          <h1 className="text-6xl md:text-8xl font-serif text-deep-slate">{t.contact.title}</h1>
          <p className="text-xl md:text-3xl font-serif italic text-slate-500 max-w-2xl mx-auto">{t.contact.intro}</p>
        </div>
      </section>

      <Section py-24 className="bg-white">
        <div className="max-w-7xl mx-auto px-6 grid gap-16 lg:grid-cols-2">
          <div className="space-y-12">
            <h2 className="text-3xl font-serif text-deep-slate border-b border-slate-100 pb-6">{t.contact.title}</h2>
            <div className="grid gap-8">
              {[
                {
                  label: t.contact.options.general,
                  value: siteConfig.hq.email,
                  type: t.contact.options.general,
                  link: `mailto:${siteConfig.hq.email}`,
                },
                {
                  label: t.contact.options.visit,
                  value: siteConfig.hq.phone,
                  type: t.contact.options.visit,
                  link: `tel:${siteConfig.hq.phone}`,
                },
                {
                  label: t.contact.options.learn,
                  value: t.actions.learnMore,
                  type: t.contact.options.learn,
                  link: '/resources',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-sanctuary border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-sage-600/30 transition-all duration-500"
                >
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{item.type}</span>
                  <p className="text-xl font-serif mt-2 text-deep-slate">{item.value}</p>
                  <p className="text-sm text-slate-500 mt-2 font-serif italic">{item.label}</p>
                  <a
                    href={item.link}
                    className="inline-block mt-6 text-[10px] font-bold tracking-[0.2em] text-sage-600 uppercase border-b border-transparent hover:border-sage-600 transition-all"
                  >
                    {t.actions.contact}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-sanctuary-100/50 rounded-sanctuary-lg p-10 md:p-16 space-y-10">
            <div className="space-y-4">
              <h3 className="text-4xl font-serif text-deep-slate">{t.contact.title}</h3>
              <p className="text-slate-500 font-serif italic">{t.contact.intro}</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.donate.fields.name}</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-full px-6 h-12 outline-none focus:border-sage-600 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.donate.fields.email}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-full px-6 h-12 outline-none focus:border-sage-600 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{locationLabel}</label>
                <select
                  value={form.locationId}
                  onChange={(event) => updateField('locationId', event.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-full px-6 h-12 outline-none focus:border-sage-600 transition-colors"
                >
                  <option value="">{siteConfig.shortName} - HQ</option>
                  {siteConfig.centers.map((center) => (
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
                  className="w-full bg-white border border-slate-200 rounded-3xl p-6 min-h-[160px] outline-none focus:border-sage-600 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-deep-slate text-white rounded-full text-[10px] font-semibold tracking-[0.14em] uppercase hover:bg-sage-600 transition-all"
              >
                {submitLabel}
              </button>

              <p className="text-xs text-slate-500 leading-relaxed">
                Recipient: <span className="font-semibold text-deep-slate">{mailtoRecipient}</span>
              </p>
            </form>
          </div>
        </div>
      </Section>

      <Section className="pb-40">
        <div className="max-w-5xl mx-auto p-16 md:p-24 text-center border-t border-slate-100">
          <h2 className="text-4xl md:text-6xl font-serif text-deep-slate mb-8">{t.firstVisit.title}</h2>
          <ButtonLink to="/locations" variant="primary">
            {t.actions.findCenter}
          </ButtonLink>
        </div>
      </Section>

      <Section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-2xl font-serif text-deep-slate mb-6">{t.contact.options.visit}</h3>
          <div className="w-full h-[420px] rounded-sanctuary overflow-hidden">
            <iframe title="Headquarters map" src={mapEmbedSrc} className="w-full h-full border-0" loading="lazy" />
          </div>
          <a
            href={mapLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-[10px] font-bold tracking-[0.2em] uppercase text-sage-600 border-b border-transparent hover:border-sage-600 transition-all"
          >
            {t.locations.detail.directions}
          </a>
        </div>
      </Section>
    </div>
  )
}
