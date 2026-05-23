import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function FirstVisit() {
  const { t, language } = useTranslation()

  const copy =
    language === 'es'
      ? {
          heroKicker: 'Una bienvenida adecuada',
          expect: 'Qué esperar',
          expectBody:
            'La primera visita debe sentirse serena, acogedora y sin presión. Puede llegar con preguntas, curiosidad o simplemente con deseo de tranquilidad.',
          etiquette: 'Etiqueta del santuario',
          centerTitle: 'Encuentre un centro cercano',
          centerBody:
            'Nuestras puertas están abiertas en todo Estados Unidos. Busque en el directorio para encontrar un centro o reunión regional.',
          centerCta: 'Ver todas las ubicaciones',
        }
      : language === 'pt'
        ? {
            heroKicker: 'Uma acolhida adequada',
            expect: 'O que esperar',
            expectBody:
              'A primeira visita deve ser calma, acolhedora e sem pressão. Você pode chegar com perguntas, curiosidade ou apenas buscando um momento de paz.',
            etiquette: 'Etiqueta no santuário',
            centerTitle: 'Encontre um centro próximo',
            centerBody:
              'Nossas portas estão abertas em todos os Estados Unidos. Procure no diretório um centro ou encontro regional.',
            centerCta: 'Ver todos os locais',
          }
        : {
            heroKicker: 'A Proper Welcome',
            expect: 'What to Expect',
            expectBody:
              'A first visit is meant to feel calm, welcoming, and unpressured. You can arrive with questions, curiosity, or simply a desire for a quiet moment.',
            etiquette: 'Sanctuary Etiquette',
            centerTitle: 'Find a Center Near You',
            centerBody:
              'Our doors are open across the United States. Search the directory to find a center or regional gathering.',
            centerCta: 'View All Locations',
          }

  usePageMeta({
    title: `${t.firstVisit.title} | ${t.brand}`,
    description: t.firstVisit.intro,
  })

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative overflow-hidden border-b border-[rgba(141,107,38,0.14)] px-6 pb-18 pt-36 md:pt-40">
        <div className="floating-orb left-[10%] top-24 h-28 w-28 bg-[rgba(173,123,34,0.16)]" />
        <div className="floating-orb right-[11%] top-34 h-24 w-24 bg-[rgba(255,255,255,0.28)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-sage-600">{copy.heroKicker}</span>
            <h1 className="text-5xl font-serif leading-[0.95] md:text-7xl">{t.firstVisit.title}</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">{t.firstVisit.intro}</p>
          </div>
          <div className="paper-panel ornament-ring rounded-[32px] p-7 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sage-600">{copy.expect}</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {copy.expectBody}
            </p>
            <div className="mt-6 grid gap-3">
              {t.firstVisit.steps.slice(0, 3).map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-[rgba(141,107,38,0.12)] bg-white/70 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-600">Step {index + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-deep-slate">{step.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <div className="space-y-10">
          <div className="space-y-4 text-center">
            <p className="text-[11px] uppercase tracking-[0.32em] text-sage-600">{t.firstVisit.kicker}</p>
            <h2 className="text-4xl font-serif md:text-5xl">{t.firstVisit.kicker}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {t.firstVisit.steps.map((step, i) => (
              <Card key={step.title} title={step.title} eyebrow={`0${i + 1}`} className="h-full">
                <p className="text-base leading-relaxed text-slate-600">{step.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className="section-wash border-y border-[rgba(141,107,38,0.12)]">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title={t.firstVisit.tips.title} className="h-full">
            <ul className="space-y-4">
              {t.firstVisit.tips.items.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-relaxed text-slate-600">
                  <span className="mt-1 text-sage-600">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <div className="rounded-[30px] bg-[linear-gradient(140deg,#1f2933_0%,#203831_100%)] p-8 text-white shadow-[0_28px_70px_-40px_rgba(31,41,51,0.8)] md:p-10">
            <h3 className="text-3xl font-serif">{copy.etiquette}</h3>
            <ul className="mt-6 space-y-4">
              {t.firstVisit.etiquette.items.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-relaxed text-white/78">
                  <span className="mt-1 text-[#d2b26a]">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-sanctuary-100">
        <div className="mx-auto max-w-4xl rounded-[32px] paper-panel p-10 text-center md:p-14">
          <h2 className="text-4xl font-serif text-deep-slate md:text-6xl">{copy.centerTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            {copy.centerBody}
          </p>
          <div className="mt-8">
            <ButtonLink to="/locations" variant="primary" className="px-10">
              {copy.centerCta}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
