import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { resolveDonateHref } from '../config/siteConfig'

const sacredScenesEn = [
  {
    image: '/images/sacred-grounds/atami-sacred-grounds.jpg',
    heading: 'Atami Sacred Grounds',
    location: 'Atami-shi, Shizuoka-ken, Japan.',
    description:
      "Known as the 'Celestial Land,' this site was chosen by Meishu-Sama for its mountains, sea, and balmy climate. It covers over 176,000 square meters and features spectacular views of the coastline.",
  },
  {
    image: '/images/sacred-grounds/guarapiranga-sacred-grounds.jpg',
    heading: 'Guarapiranga Sacred Grounds',
    location: 'São Paulo, Brazil.',
    description:
      "Inaugurated in 1995 on the banks of the Guarapiranga Reservoir, this 327,500-square-meter complex is a 'prototype of paradise' harmonizing nature and spirituality.",
  },
  {
    image: '/images/sacred-grounds/saraburi-sacred-grounds.jpg',
    heading: 'Saraburi Sacred Grounds',
    location: 'Saraburi, Thailand.',
    description:
      'Dedicated in 1996, this 160-hectare site was the second sacred ground built outside of Japan. It houses a Messianic Temple, botanical gardens, and an Agricultural School for Nature Farming.',
  },
]

export default function Home() {
  const { t, language } = useTranslation()
  const donateHref = resolveDonateHref()
  const isInternalDonate = donateHref.startsWith('/')
  const sacredScenes = sacredScenesEn

  const guidelineCopy =
    language === 'es'
      ? {
          title: 'Directrices 2026',
          motto:
            'Ayudar a otros a dedicarse a la construccion del Paraiso en la Tierra, a traves de las practicas de fe, es el camino de nuestra salvacion.',
        }
      : language === 'pt'
        ? {
            title: 'Diretrizes 2026',
            motto:
              'Ajudar outras pessoas a se dedicarem a construcao do Paraiso Terrestre, por meio das praticas de fe, e o caminho para nossa salvacao.',
          }
        : {
            title: t.guidelines.title,
            motto: t.guidelines.motto,
          }

  usePageMeta({
    title: `${t.home.heroTitle} | ${t.brand}`,
    description: t.home.heroIntro,
  })

  const copy =
    language === 'es'
      ? {
          pillarsTag: 'Los tres pilares',
          galleryTag: 'Inspiracion y serenidad',
          galleryTitle: 'Atami, Guarapiranga y Saraburi',
          galleryBody:
            'Tres Suelos Sagrados donde la belleza natural, la arquitectura sagrada y el espiritu de gratitud se unen.',
          faqBody:
            'Encuentre respuestas claras sobre Johrei, las sesiones y que esperar en su primera visita.',
          faqCta: 'Ver FAQ',
          actionsTitle: 'Visitar, Contactar, Apoyar',
          actionsBody:
            'Elija su camino: recibir Johrei, contactar la asociacion o apoyar la mision.',
        }
      : language === 'pt'
        ? {
            pillarsTag: 'Os tres pilares',
            galleryTag: 'Inspiracao e serenidade',
            galleryTitle: 'Atami, Guarapiranga e Saraburi',
            galleryBody:
              'Tres Solos Sagrados onde beleza natural, arquitetura sagrada e espirito de gratidao se unem.',
            faqBody:
              'Encontre respostas claras sobre Johrei, sessoes e o que esperar na primeira visita.',
            faqCta: 'Ver FAQ',
            actionsTitle: 'Visitar, Contatar, Apoiar',
            actionsBody:
              'Escolha seu caminho: receber Johrei, entrar em contato com a associacao ou apoiar a missao.',
          }
      : {
          pillarsTag: 'The Three Pillars',
          galleryTag: 'Inspiration and tranquility',
          galleryTitle: 'Atami, Guarapiranga, and Saraburi',
          galleryBody:
            'Three Sacred Grounds where natural beauty, sacred architecture, and a spirit of prayer and gratitude come together.',
          faqBody:
            'Get quick, clear answers about Johrei, sessions, and what to expect on your first visit.',
          faqCta: 'Open FAQ',
          actionsTitle: 'Visit, Contact, Support',
          actionsBody:
            'Choose your path: receive Johrei, contact the association, or support the mission.',
        }

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="relative isolate overflow-hidden border-b border-[rgba(184,134,11,0.2)] px-6 pt-32 pb-24 text-center">
        <div className="sacred-hero-image absolute inset-0 -z-30" />
        <video
          className="hero-video pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-video-poster-v2.jpg"
          aria-hidden="true"
        >
          <source src="/videos/hero-mountains-v2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/38 via-black/20 to-black/42" />

        <div className="mx-auto max-w-5xl space-y-7 text-white">
          <h1 className="text-4xl font-serif leading-tight [text-shadow:0_3px_20px_rgba(0,0,0,0.55)] md:text-6xl lg:text-7xl">
            <span className="block">{t.home.heroTitle}</span>
            <span className="mt-2 block text-3xl md:text-5xl lg:text-6xl">{t.home.heroSubtitle}</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-100 [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] md:text-2xl">
            {t.home.heroIntro}
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <ButtonLink to="/johrei" variant="accent">{t.nav.aboutJohrei}</ButtonLink>
            <ButtonLink to="/contact" variant="outline" className="border-white/70 text-white hover:bg-white/18 hover:text-white">
              {t.nav.contact}
            </ButtonLink>
            <ButtonLink to="/locations" variant="primary" className="bg-white/92 text-divine-gold hover:bg-white hover:text-[#9e730a]">
              {t.nav.locations}
            </ButtonLink>
          </div>
          <p className="pt-2 text-xs text-white/80">
            <a
              href="https://www.vecteezy.com/free-videos/mountains"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-white/60 underline-offset-2 hover:text-white"
            >
              Mountains Stock Videos by Vecteezy
            </a>
          </p>
        </div>
      </section>

      <Section className="bg-white border-y border-[rgba(184,134,11,0.2)]">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[rgba(184,134,11,0.25)] bg-sanctuary-100 p-8 text-center md:p-10">
          <h2 className="text-3xl font-serif md:text-5xl">{t.home.faqTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{copy.faqBody}</p>
          <div className="mt-6">
            <ButtonLink to="/faq" variant="accent">{copy.faqCta}</ButtonLink>
          </div>
        </div>
      </Section>

      <Section className="bg-sanctuary-100">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[rgba(184,134,11,0.25)] bg-white p-8 text-center shadow-sanctuary md:p-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-sage-600">{guidelineCopy.title}</p>
          <blockquote className="mt-4 text-lg font-serif leading-relaxed text-slate-700 md:text-2xl">
            {guidelineCopy.motto}
          </blockquote>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="mx-auto max-w-4xl space-y-5 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-sage-600">{t.home.johreiKicker}</p>
          <h2 className="text-4xl font-serif md:text-5xl">{t.home.whatIsJohrei.title}</h2>
          <p className="text-lg leading-relaxed text-slate-600">{t.home.whatIsJohrei.body}</p>
        </div>
      </Section>

      <Section className="bg-sanctuary-100">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-sage-600">{copy.pillarsTag}</p>
          <h2 className="mt-2 text-4xl font-serif md:text-5xl">{t.home.vision.title}</h2>
          <p className="mx-auto mt-3 max-w-3xl text-lg text-slate-600">{t.home.vision.body}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {t.home.vision.cards.map((card) => (
            <Card key={card.title} title={card.title} className="h-full bg-white p-8">
              <p className="text-base leading-relaxed text-slate-600">{card.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-y border-[rgba(184,134,11,0.2)] bg-white">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-sage-600">{copy.galleryTag}</p>
          <h2 className="mt-2 text-4xl font-serif md:text-5xl">{copy.galleryTitle}</h2>
          <p className="mx-auto mt-3 max-w-3xl text-lg text-slate-600">{copy.galleryBody}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {sacredScenes.map((scene) => (
            <article key={scene.heading} className="overflow-hidden rounded-3xl border border-[rgba(184,134,11,0.25)] bg-white shadow-sanctuary">
              <img
                src={scene.image}
                alt={scene.heading}
                className="h-52 w-full object-cover object-center"
                loading="lazy"
              />
              <div className="space-y-3 p-6">
                <h3 className="text-2xl font-serif">{scene.heading}</h3>
                <p className="text-sm font-semibold text-slate-700">{scene.location}</p>
                <p className="text-sm leading-relaxed text-slate-600">{scene.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-sanctuary-100">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h2 className="text-3xl font-serif md:text-5xl">{copy.actionsTitle}</h2>
          <p className="text-lg text-slate-600">{copy.actionsBody}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink to="/locations" variant="secondary">{t.nav.locations}</ButtonLink>
            {isInternalDonate ? (
              <ButtonLink to={donateHref} variant="accent">{t.actions.donate}</ButtonLink>
            ) : (
              <a
                href={donateHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full bg-deep-slate px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-sage-600"
              >
                {t.actions.donate}
              </a>
            )}
            <ButtonLink to="/contact" variant="outline">{t.actions.contact}</ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
