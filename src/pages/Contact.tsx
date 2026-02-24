import { ButtonLink } from '../components/ButtonLink'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { site } from '../data/site'
import { locations } from '../data/locations'
import { Section } from '../components/Section'

export default function Contact() {
  const { t } = useTranslation()
  const primaryLocation = locations[0]
  const mapEmbedSrc = primaryLocation?.address
    ? `https://www.google.com/maps?q=${encodeURIComponent(primaryLocation.address)}&output=embed`
    : undefined

  usePageMeta({
    title: `${t.contact.title} | ${t.brand}`,
    description: t.contact.intro,
  })

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      {/* Page Header */}
      <section className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">
            Direct Resonance
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-deep-slate">
            {t.contact.title}
          </h1>
          <p className="text-xl md:text-3xl font-serif italic text-slate-500 max-w-2xl mx-auto">
            {t.contact.intro}
          </p>
        </div>
      </section>

      {/* Contact Hub */}
      <Section py-24 className="bg-white">
        <div className="max-w-7xl mx-auto px-6 grid gap-16 lg:grid-cols-2">

          {/* Options Column */}
          <div className="space-y-12">
            <h2 className="text-3xl font-serif text-deep-slate border-b border-slate-100 pb-6">{t.contact.title}</h2>
            <div className="grid gap-8">
              {[
                { label: t.contact.options.general, value: site.email, type: t.contact.options.general, link: `mailto:${site.email}` },
                { label: t.contact.options.visit, value: site.phone, type: t.contact.options.visit, link: `tel:${site.phone}` },
                { label: t.contact.options.learn, value: t.actions.learnMore, type: t.contact.options.learn, link: '/resources' }
              ].map((item, i) => (
                <div key={i} className="group p-8 rounded-sanctuary border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-sage-600/30 transition-all duration-500">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{item.type}</span>
                  <p className="text-xl font-serif mt-2 text-deep-slate">{item.value}</p>
                  <p className="text-sm text-slate-500 mt-2 font-serif italic">{item.label}</p>
                  <a href={item.link} className="inline-block mt-6 text-[10px] font-bold tracking-[0.2em] text-sage-600 uppercase border-b border-transparent hover:border-sage-600 transition-all">
                    {t.actions.contact}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Form Column */}
          <div className="bg-sanctuary-100/50 rounded-sanctuary-lg p-10 md:p-16 space-y-10">
            <div className="space-y-4">
              <h3 className="text-4xl font-serif text-deep-slate">{t.contact.title}</h3>
              <p className="text-slate-500 font-serif italic">{t.contact.intro}</p>
            </div>

            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.donate.fields.name}</label>
                  <input type="text" className="w-full bg-white border border-slate-200 rounded-full px-6 h-12 outline-none focus:border-sage-600 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.donate.fields.email}</label>
                  <input type="email" className="w-full bg-white border border-slate-200 rounded-full px-6 h-12 outline-none focus:border-sage-600 transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.contact.title}</label>
                <textarea className="w-full bg-white border border-slate-200 rounded-3xl p-6 min-h-[160px] outline-none focus:border-sage-600 transition-colors" />
              </div>
              <button type="submit" className="w-full h-10 bg-deep-slate text-white rounded-full text-[10px] font-semibold tracking-[0.14em] uppercase hover:bg-sage-600 transition-all">
                {t.actions.contact}
              </button>
            </form>
          </div>
        </div>
      </Section>

      {/* Visit Invitation */}
      <Section className="pb-40">
        <div className="max-w-5xl mx-auto p-16 md:p-24 text-center border-t border-slate-100">
          <h2 className="text-4xl md:text-6xl font-serif text-deep-slate mb-8">{t.firstVisit.title}</h2>
          <ButtonLink to="/locations" variant="primary">
            {t.actions.findCenter}
          </ButtonLink>
        </div>
      </Section>

      {/* Map Section */}
      <Section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-2xl font-serif text-deep-slate mb-6">{t.contact.options.visit}</h3>
          <div className="w-full h-[420px] rounded-sanctuary overflow-hidden">
            {mapEmbedSrc ? (
              <iframe title="Location map" src={mapEmbedSrc} className="w-full h-full border-0" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-sanctuary-100 text-slate-500">
                {t.locations.empty}
              </div>
            )}
          </div>
          {primaryLocation?.mapUrl && (
            <a
              href={primaryLocation.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-[10px] font-bold tracking-[0.2em] uppercase text-sage-600 border-b border-transparent hover:border-sage-600 transition-all"
            >
              {t.locations.detail.directions}
            </a>
          )}
        </div>
      </Section>
    </div>
  )
}
