import { Link } from 'react-router-dom'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { resolveDonateHref, siteConfig } from '../config/siteConfig'
import { grantContent } from '../data/grantContent'

const sacredScenes = [
  {
    image: '/images/sacred-grounds/atami-sacred-grounds.jpg',
    heading: 'Atami Sacred Grounds',
    location: 'Atami-shi, Shizuoka-ken, Japan',
    body: 'Known as the Celestial Land, this site was chosen by Meishu-sama for its mountains, sea, and balanced climate.',
  },
  {
    image: '/images/sacred-grounds/guarapiranga-sacred-grounds.jpg',
    heading: 'Guarapiranga Sacred Grounds',
    location: 'Sao Paulo, Brazil',
    body: 'Inaugurated in 1995 on the banks of the Guarapiranga reservoir, this sacred ground harmonizes nature and spirituality.',
  },
  {
    image: '/images/sacred-grounds/saraburi-sacred-grounds.jpg',
    heading: 'Saraburi Sacred Grounds',
    location: 'Saraburi, Thailand',
    body: 'Dedicated in 1996, this sacred ground houses a Messianic temple, botanical gardens, and an agricultural school.',
  },
] as const

function HomeLink({
  to,
  children,
  tone = 'light',
  className = '',
}: {
  to: string
  children: React.ReactNode
  tone?: 'light' | 'dark' | 'gold'
  className?: string
}) {
  const tones = {
    light: 'border border-white/28 bg-white/12 text-white hover:bg-white/18',
    dark: 'border border-[rgba(15,23,42,0.08)] bg-[#213a36] text-white hover:bg-[#1b312e]',
    gold: 'border border-transparent bg-divine-gold text-white hover:bg-[#946615]',
  }

  return (
    <Link
      to={to}
      className={`inline-flex h-11 items-center justify-center rounded-full px-6 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${tones[tone]} ${className}`}
    >
      {children}
    </Link>
  )
}

function HomeAction({
  href,
  children,
  tone = 'gold',
  className = '',
}: {
  href: string
  children: React.ReactNode
  tone?: 'light' | 'dark' | 'gold'
  className?: string
}) {
  const tones = {
    light: 'border border-white/28 bg-white/12 text-white hover:bg-white/18',
    dark: 'border border-[rgba(15,23,42,0.08)] bg-[#213a36] text-white hover:bg-[#1b312e]',
    gold: 'border border-transparent bg-divine-gold text-white hover:bg-[#946615]',
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex h-11 items-center justify-center rounded-full px-6 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${tones[tone]} ${className}`}
    >
      {children}
    </a>
  )
}

export default function Home() {
  const { t, language } = useTranslation()
  const donateHref = resolveDonateHref()
  const isInternalDonate = donateHref.startsWith('/')
  const grantCopy = grantContent[language]

  usePageMeta({
    title: t.brand,
    description: t.home.heroIntro,
  })

  const supportCopy =
    language === 'es'
      ? {
          heroPath: 'Elija su camino: reciba Johrei, haga contacto o apoye la misión.',
          heroContact: 'Contactarnos',
          faqCta: 'Abrir FAQ',
          faqBody: 'Respuestas claras y rápidas sobre el Johrei, las sesiones y su primera visita.',
          newHereKicker: 'Nuevo aquí',
          sacredKicker: 'Inspiración y tranquilidad',
          sacredTitle: 'Atami, Guarapiranga y Saraburi',
          sacredBody: 'Tres Tierras Sagradas donde la belleza natural, la arquitectura sagrada y un espíritu de oración y gratitud se unen.',
          visitContactTitle: 'Visitar, contactar, apoyar',
          supportKicker: 'Visitar, contactar, apoyar',
          supportActions: {
            locations: 'Ubicaciones',
            donate: 'Donar',
            contact: 'Contactarnos',
          },
        }
      : language === 'pt'
        ? {
            heroPath: 'Escolha seu caminho: receba Johrei, entre em contato ou apoie a missão.',
            heroContact: 'Contato',
            faqCta: 'Abrir FAQ',
            faqBody: 'Respostas rápidas e claras sobre Johrei, sessões e sua primeira visita.',
            newHereKicker: 'Novo por aqui',
            sacredKicker: 'Inspiração e tranquilidade',
            sacredTitle: 'Atami, Guarapiranga e Saraburi',
            sacredBody: 'Três Terras Sagradas onde beleza natural, arquitetura sagrada e espírito de oração e gratidão se unem.',
            visitContactTitle: 'Visitar, contatar, apoiar',
            supportKicker: 'Visitar, contatar, apoiar',
            supportActions: {
              locations: 'Locais',
              donate: 'Doar',
              contact: 'Contato',
            },
          }
        : {
            heroPath: 'Choose your path: receive Johrei, contact the association, or support the mission.',
            heroContact: 'Contact Us',
            faqCta: 'Open FAQ',
            faqBody: 'Get quick, clear answers about Johrei, sessions, and your first visit.',
            newHereKicker: 'New Here',
            sacredKicker: 'Inspiration and Tranquility',
            sacredTitle: 'Atami, Guarapiranga, and Saraburi',
            sacredBody: 'Three Sacred Grounds where natural beauty, sacred architecture, and a spirit of prayer and gratitude come together.',
            visitContactTitle: 'Visit, Contact, Support',
            supportKicker: 'Visit, Contact, Support',
            supportActions: {
              locations: 'Locations',
              donate: 'Donate',
              contact: 'Contact Us',
            },
          }

  return (
    <div className="min-h-screen bg-[#f8f4eb] text-deep-slate">
      <section className="border-b border-[rgba(15,23,42,0.06)]">
        <div
          className="home-hero-illuminated relative isolate min-h-screen overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(132deg,transparent_0%,transparent_48%,rgba(255,236,177,0.16)_60%,rgba(255,255,255,0.24)_72%,transparent_88%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_72%_42%,rgba(255,242,206,0.24)_0%,rgba(255,225,160,0.14)_30%,transparent_62%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,250,238,0.08)_0%,transparent_42%,rgba(18,26,27,0.18)_100%)]" />

          <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl gap-8 px-6 pb-10 pt-32 md:px-10 lg:grid-cols-[1.2fr_0.68fr] lg:px-12 lg:pb-12 lg:pt-28">
            <div className="flex min-h-[32rem] flex-col justify-end">
              <div className="max-w-3xl">
                <p className="mt-4 text-[13px] uppercase tracking-[0.34em] text-white/72">{t.home.heroTitle}</p>
                <h1 className="mt-2 max-w-2xl leading-tight text-white">
                  <span className="block text-4xl font-bold sm:text-5xl lg:text-[3.25rem]">{siteConfig.shortName}</span>
                  <span className="mt-2 block text-2xl font-semibold sm:text-3xl lg:text-[2.25rem]">World Messianic Church of America</span>
                </h1>
                <p className="mt-7 max-w-2xl text-xl leading-9 text-white/86">{t.home.heroIntro}</p>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/60">{supportCopy.heroPath}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <HomeLink to="/locations" tone="gold">
                    {t.actions.findCenter}
                  </HomeLink>
                  <HomeLink to="/first-visit" tone="light">
                    {t.actions.firstVisit}
                  </HomeLink>
                  <HomeLink to="/contact" tone="light">
                    {supportCopy.heroContact}
                  </HomeLink>
                </div>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {t.home.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[20px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08))] px-5 py-4 text-white backdrop-blur-sm"
                  >
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/56">{stat.label}</p>
                    <p className="mt-2 text-2xl leading-tight">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/14 bg-[linear-gradient(180deg,rgba(166,150,130,0.62),rgba(60,67,66,0.34))] p-5 text-white backdrop-blur-md lg:mt-6">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/68">{t.home.visitTitle}</p>
              <div className="mt-4 space-y-3">
                {t.home.visitSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))] px-5 py-5"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/7 text-sm text-white/82">
                        {index + 1}
                      </div>
                      <div>
                        <h2 className="text-[2rem] leading-none text-white">{step.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-white/72">{step.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(15,23,42,0.05)] bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[30px] border border-[rgba(15,23,42,0.06)] bg-[#fffdfa] p-8 md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600">{grantCopy.whoTitle}</p>
            <h2 className="mt-4 text-4xl leading-tight text-[#314343] md:text-5xl">Miroku Association USA</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">{grantCopy.who}</p>
            <p className="mt-4 text-base leading-8 text-slate-500">{grantCopy.welcome}</p>
          </article>
          <article className="rounded-[30px] bg-[#294341] p-8 text-white md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/65">{grantCopy.missionTitle}</p>
            <p className="mt-5 text-xl leading-9 text-white/82">{grantCopy.mission}</p>
            <div className="mt-8"><HomeLink to="/community-programs" tone="gold">{grantCopy.programsNav}</HomeLink></div>
          </article>
        </div>
      </section>

      <section className="border-b border-[rgba(15,23,42,0.05)] bg-[#f8f4eb] px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.15fr_0.68fr_0.52fr]">
          <article className="rounded-[30px] bg-[linear-gradient(135deg,#8ea086_0%,#a6af97_55%,#c8ccb2_100%)] px-7 py-7 text-white shadow-[0_34px_80px_-52px_rgba(49,67,67,0.45)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/72">{t.nav.guidelines}</p>
            <h2 className="mt-4 max-w-md text-[3.4rem] leading-[0.94]">
              “Helping others dedicate themselves to the construction of Paradise on Earth, through our practices of faith, is the path to our salvation.”
            </h2>
            <p className="mt-8 max-w-lg text-base leading-8 text-white/76">{t.home.guideline.body}</p>
            <div className="mt-8">
              <HomeLink to="/guidelines-2026" tone="light" className="border-white/25 bg-white text-deep-slate hover:bg-[#f2ede4]">
                {t.home.guideline.button}
              </HomeLink>
            </div>
          </article>

          <article className="rounded-[30px] border border-[rgba(15,23,42,0.05)] bg-[#fffdfa] px-7 py-7 shadow-[0_30px_72px_-54px_rgba(60,52,39,0.24)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600/80">{t.home.johreiKicker}</p>
            <h2 className="mt-4 text-[3rem] leading-none text-[#314343]">{t.home.whatIsJohrei.title}</h2>
            <p className="mt-5 text-lg leading-9 text-slate-500">{t.home.whatIsJohrei.body}</p>
            <div className="mt-7">
              <HomeLink to="/johrei" tone="gold">
                {t.home.johreiCta}
              </HomeLink>
            </div>
          </article>

          <article className="rounded-[30px] border border-[rgba(15,23,42,0.05)] bg-[#fffdfa] px-6 py-7 shadow-[0_30px_72px_-54px_rgba(60,52,39,0.24)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600/80">{t.home.faqTitle}</p>
            <p className="mt-4 text-[2rem] leading-tight text-[#314343]">{supportCopy.faqBody}</p>
            <div className="mt-7 flex flex-col gap-3">
              <HomeLink to="/faq" tone="light" className="border-[rgba(15,23,42,0.12)] bg-white text-deep-slate hover:bg-[#f4ecdf]">
                {supportCopy.faqCta}
              </HomeLink>
              <HomeLink to="/contact" tone="dark">
                {supportCopy.supportActions.contact}
              </HomeLink>
            </div>
          </article>
        </div>
      </section>

      <section className="border-b border-[rgba(15,23,42,0.05)] bg-[#f8f4eb] px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600/80">{supportCopy.newHereKicker}</p>
            <h2 className="mt-4 text-5xl leading-none text-[#314343] md:text-6xl">{t.home.newcomers.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-slate-500">{t.home.newcomers.body}</p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {t.home.newcomers.cards.map((card, index) => (
              <article
                key={card.title}
                className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white px-7 py-7 shadow-[0_26px_60px_-44px_rgba(60,52,39,0.3)]"
              >
                <div className="absolute right-6 top-4 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(222,194,145,0.24),rgba(255,255,255,0))]" />
                <p className="relative text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">0{index + 1}</p>
                <h3 className="relative mt-5 text-[2.1rem] leading-none text-[#314343]">{card.title}</h3>
                <p className="relative mt-4 text-base leading-8 text-slate-500">{card.body}</p>
                <Link
                  to={card.to}
                  className="relative mt-8 inline-flex text-[10px] font-semibold uppercase tracking-[0.24em] text-sage-600 transition-colors hover:text-sage-700"
                >
                  {card.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(15,23,42,0.05)] bg-white px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600/80">{t.home.vision.kicker}</p>
            <h2 className="mt-4 text-5xl leading-none text-[#314343] md:text-6xl">{t.home.vision.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-slate-500">{t.home.vision.body}</p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {t.home.vision.cards.map((card, index) => (
              <article
                key={card.title}
                className="rounded-[28px] border border-[rgba(15,23,42,0.04)] bg-[#fffdfa] px-7 py-7 shadow-[0_28px_70px_-50px_rgba(60,52,39,0.28)]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">0{index + 1}</p>
                <h3 className="mt-5 text-[2rem] leading-none text-[#314343]">{card.title}</h3>
                <p className="mt-4 text-lg leading-9 text-slate-500">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(15,23,42,0.05)] bg-[#f8f4eb] px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600/80">{supportCopy.sacredKicker}</p>
            <h2 className="mt-4 text-4xl leading-none text-[#314343] md:text-5xl">{supportCopy.sacredTitle}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-500">
              {supportCopy.sacredBody}
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-[1.08fr_0.68fr]">
            <article className="overflow-hidden rounded-[28px] border border-[rgba(15,23,42,0.05)] bg-white shadow-[0_28px_70px_-50px_rgba(60,52,39,0.28)]">
              <img
                src={sacredScenes[0].image}
                alt={sacredScenes[0].heading}
                className="h-[25rem] w-full object-cover object-center"
                loading="lazy"
              />
              <div className="space-y-3 px-6 py-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-sage-600/80">{sacredScenes[0].location}</p>
                <h3 className="text-[2.1rem] leading-none text-[#314343]">{sacredScenes[0].heading}</h3>
                <p className="text-base leading-8 text-slate-500">{sacredScenes[0].body}</p>
              </div>
            </article>

            <div className="grid gap-4">
              {sacredScenes.slice(1).map((scene) => (
                <article
                  key={scene.heading}
                  className="overflow-hidden rounded-[24px] border border-[rgba(15,23,42,0.05)] bg-white shadow-[0_28px_70px_-50px_rgba(60,52,39,0.24)]"
                >
                  <img src={scene.image} alt={scene.heading} className="h-40 w-full object-cover object-center" loading="lazy" />
                  <div className="space-y-2 px-5 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sage-600/80">{scene.location}</p>
                    <h3 className="text-[1.7rem] leading-none text-[#314343]">{scene.heading}</h3>
                    <p className="text-sm leading-7 text-slate-500">{scene.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(15,23,42,0.05)] bg-white px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-[rgba(15,23,42,0.05)] bg-[#fffdfa] p-6 shadow-[0_28px_70px_-50px_rgba(60,52,39,0.24)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600/80">{t.home.faqTitle}</p>
            <div className="mt-5 space-y-3">
              {t.home.faqs.map((faq) => (
                <div key={faq.q} className="rounded-[18px] border border-[rgba(15,23,42,0.06)] bg-white px-4 py-4">
                  <h3 className="text-lg leading-7 text-[#314343]">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[28px] border border-[rgba(15,23,42,0.05)] bg-[#fffdfa] p-6 shadow-[0_28px_70px_-50px_rgba(60,52,39,0.24)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600/80">{t.home.contactTitle}</p>
              <h3 className="mt-4 text-[2.1rem] leading-none text-[#314343]">{supportCopy.visitContactTitle}</h3>
              <p className="mt-4 text-base leading-8 text-slate-500">{t.home.contactBody}</p>
              <div className="mt-5 space-y-1 text-sm leading-7 text-slate-500">
                <p>{siteConfig.hq.address}</p>
                <p>{siteConfig.hq.email}</p>
                <p>{siteConfig.hq.phone}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <HomeLink to="/contact" tone="dark">
                  {supportCopy.supportActions.contact}
                </HomeLink>
                <HomeLink to="/locations" tone="light" className="border-[rgba(15,23,42,0.12)] bg-white text-deep-slate hover:bg-[#f4ecdf]">
                  {supportCopy.supportActions.locations}
                </HomeLink>
              </div>
            </article>

            <article className="rounded-[28px] border border-[rgba(15,23,42,0.05)] bg-[#fffdfa] p-6 shadow-[0_28px_70px_-50px_rgba(60,52,39,0.24)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600/80">{t.home.ready.title}</p>
              <p className="mt-4 text-base leading-8 text-slate-500">{t.home.ready.body}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {isInternalDonate ? (
                  <HomeLink to={donateHref} tone="gold">
                    {supportCopy.supportActions.donate}
                  </HomeLink>
                ) : (
                  <HomeAction href={donateHref} tone="gold">
                    {supportCopy.supportActions.donate}
                  </HomeAction>
                )}
                <HomeLink to="/first-visit" tone="light" className="border-[rgba(15,23,42,0.12)] bg-white text-deep-slate hover:bg-[#f4ecdf]">
                  {t.actions.firstVisit}
                </HomeLink>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-[rgba(15,23,42,0.05)] bg-[#f8f4eb] px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[30px] bg-[linear-gradient(135deg,#8fa08d_0%,#97a78f_48%,#8b9984_100%)] px-6 py-6 text-white shadow-[0_34px_80px_-52px_rgba(49,67,67,0.45)] md:px-8">
          <div className="grid gap-4 lg:grid-cols-[1.28fr_0.55fr_0.55fr_0.46fr]">
            <div className="rounded-[24px] border border-white/14 bg-white/5 px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/72">{supportCopy.supportKicker}</p>
              <h2 className="mt-4 max-w-sm text-[2.4rem] leading-none">{t.home.ready.title}</h2>
              <p className="mt-4 max-w-md text-base leading-8 text-white/76">{t.home.ready.body}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <HomeLink to="/locations" tone="light" className="border-white/22 bg-white text-deep-slate hover:bg-[#f1ede5]">
                  {supportCopy.supportActions.locations}
                </HomeLink>
                {isInternalDonate ? (
                  <HomeLink to={donateHref} tone="gold">
                    {supportCopy.supportActions.donate}
                  </HomeLink>
                ) : (
                  <HomeAction href={donateHref} tone="gold">
                    {supportCopy.supportActions.donate}
                  </HomeAction>
                )}
                <HomeLink to="/contact" tone="light">
                  {supportCopy.supportActions.contact}
                </HomeLink>
              </div>
            </div>

            <article className="rounded-[24px] border border-white/14 bg-white/5 px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/62">{t.home.centers.title}</p>
              <h3 className="mt-3 text-[1.8rem] leading-none">{t.home.centers.link}</h3>
              <p className="mt-4 text-sm leading-7 text-white/72">{t.home.centers.body}</p>
            </article>

            <article className="rounded-[24px] border border-white/14 bg-white/5 px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/62">{t.home.resources.title}</p>
              <h3 className="mt-3 text-[1.8rem] leading-none">{t.home.resources.link}</h3>
              <p className="mt-4 text-sm leading-7 text-white/72">{t.home.resources.body}</p>
            </article>

            <article className="rounded-[24px] border border-white/14 bg-white/5 px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/62">{t.home.guideline.title}</p>
              <h3 className="mt-3 text-[1.8rem] leading-none">{t.home.guideline.button}</h3>
              <p className="mt-4 text-sm leading-7 text-white/72">{t.home.guideline.body}</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
