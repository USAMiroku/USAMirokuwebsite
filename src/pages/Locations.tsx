import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { toLocation, useManagedCenters } from '../organization/centers'

export default function Locations() {
  const { t, language } = useTranslation()
  const { activeCenters, isLoading } = useManagedCenters()
  const locationCards = activeCenters.map((center) => ({
    center,
    location: toLocation(center),
  }))

  usePageMeta({
    title: `${t.locations.title} | ${t.brand}`,
    description: t.locations.intro,
  })

  const copy =
    language === 'es'
      ? {
          pageTitle: 'Centros y grupos en Estados Unidos',
          intro: 'Encuentre un centro cerca de usted para recibir Johrei, participar en la comunidad y explorar actividades locales.',
          visitCenter: 'Ver centro',
          viewSessions: 'Ver actividades',
          regionalCircle: 'Grupo regional',
          firstVisitKicker: 'Primera visita',
          firstVisitTitle: 'Qué esperar en su primera visita',
          communityTitle: 'Una red nacional con vida local',
          communityBody:
            'Cada centro conserva su propio ritmo y hospitalidad, pero todos comparten la misma misión de construir el Paraíso en la Tierra.',
          mapTitle: 'Encuentre una presencia cercana',
          mapBody: 'Explore por estado y abra la página de cada centro para horarios, contacto, liderazgo y actividades.',
          contactCenter: 'Contactar un centro',
          loadingCenters: 'Cargando centros',
          loadingBody: 'Obteniendo la información más reciente de centros y grupos.',
          noCenters: 'No hay centros disponibles',
          noCentersBody: 'La información de centros y grupos no está disponible temporalmente.',
          locationLabel: 'ubicación',
          locationsLabel: 'ubicaciones',
          visitTitle1: '1. Una bienvenida cálida',
          visitBody1: 'Será recibido por un voluntario o miembro. No hay código de vestimenta ni necesidad de saber algo con anticipación.',
          visitTitle2: '2. Una breve introducción',
          visitBody2: 'Si es su primera vez, alguien le explicará la historia básica de Meishu-sama, del centro y el propósito de Johrei.',
          visitTitle3: '3. Recibir Johrei',
          visitBody3: 'Se sentará cómodamente mientras un practicante ofrece Johrei en un ambiente tranquilo y sereno, normalmente durante 15 a 20 minutos.',
          visitTitle4: '4. Un momento de belleza',
          visitBody4: 'Después, muchos visitantes hacen una pausa, reflexionan, disfrutan de un té o aprecian la belleza del ambiente del centro.',
        }
      : language === 'pt'
        ? {
            pageTitle: 'Centros e grupos nos Estados Unidos',
            intro: 'Encontre um centro perto de você para receber Johrei, participar da comunidade e explorar atividades locais.',
            visitCenter: 'Ver centro',
            viewSessions: 'Ver atividades',
            regionalCircle: 'Grupo regional',
            firstVisitKicker: 'Primeira visita',
            firstVisitTitle: 'O que esperar na primeira visita',
            communityTitle: 'Uma rede nacional com vida local',
            communityBody:
              'Cada centro preserva seu próprio ritmo e hospitalidade, mas todos compartilham a mesma missão de construir o Paraíso Terrestre.',
            mapTitle: 'Encontre uma presença próxima',
            mapBody: 'Explore por estado e abra a página de cada centro para horários, contato, liderança e atividades.',
            contactCenter: 'Contatar um centro',
            loadingCenters: 'Carregando centros',
            loadingBody: 'Obtendo as informações mais recentes de centros e grupos.',
            noCenters: 'Nenhum centro disponível',
            noCentersBody: 'As informações de centros e grupos estão temporariamente indisponíveis.',
            locationLabel: 'local',
            locationsLabel: 'locais',
            visitTitle1: '1. Uma recepção acolhedora',
            visitBody1: 'Você será recebido por um voluntário ou membro. Não há código de vestimenta nem necessidade de saber algo com antecedência.',
            visitTitle2: '2. Uma breve introdução',
            visitBody2: 'Se for sua primeira vez, alguém explicará a história básica de Meishu-sama, do centro e o propósito do Johrei.',
            visitTitle3: '3. Receber Johrei',
            visitBody3: 'Você ficará confortavelmente sentado enquanto um praticante oferece Johrei em um ambiente silencioso e sereno, normalmente por 15 a 20 minutos.',
            visitTitle4: '4. Um momento de beleza',
            visitBody4: 'Depois, muitos visitantes fazem uma pausa, refletem, tomam chá ou apreciam a beleza do ambiente do centro.',
          }
        : {
            pageTitle: 'Centers and Groups Across the United States',
            intro: 'Find a nearby center to receive Johrei, connect with the community, and explore local activities.',
            visitCenter: 'Visit Center',
            viewSessions: 'View Activities',
            regionalCircle: 'Regional gathering circle',
            firstVisitKicker: 'First Visit',
            firstVisitTitle: 'What to Expect on Your First Visit',
            communityTitle: 'A national network with local character',
            communityBody:
              'Each center keeps its own rhythm and hospitality, while sharing the same mission of building Paradise on Earth.',
            mapTitle: 'Find a nearby presence',
            mapBody: 'Browse by state and open each center page for schedules, contact details, leadership, and activities.',
            contactCenter: 'Contact a Center',
            loadingCenters: 'Loading centers',
            loadingBody: 'Fetching the latest center and group information.',
            noCenters: 'No centers available',
            noCentersBody: 'Center and group information is temporarily unavailable.',
            locationLabel: 'location',
            locationsLabel: 'locations',
            visitTitle1: '1. A Warm Greeting',
            visitBody1: 'You will be welcomed by a volunteer or member. There is no dress code and no pressure to know anything in advance.',
            visitTitle2: '2. A Brief Introduction',
            visitBody2: 'If it is your first time, someone will explain the basic story of Meishu-sama, the center, and the purpose of Johrei.',
            visitTitle3: '3. Receiving Johrei',
            visitBody3: 'You will sit comfortably while a practitioner offers Johrei in a quiet and calm setting, usually for 15 to 20 minutes.',
            visitTitle4: '4. A Moment of Beauty',
            visitBody4: 'Afterward, many visitors pause, reflect, enjoy tea, or appreciate the beauty of the center environment.',
          }

  const regionSummary = locationCards.reduce((summary, { location }) => {
    const existing = summary.find((region) => region.name === location.province)
    if (existing) {
      existing.count += 1
    } else {
      summary.push({ name: location.province, count: 1 })
    }
    return summary
  }, [] as Array<{ name: string; count: number }>)

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="public-hero">
        <div className="public-hero-grid">
          <div className="public-hero-copy">
            <p className="public-eyebrow">{t.nav.locations}</p>
            <h1 className="public-title">{copy.pageTitle}</h1>
            <p className="public-body">{copy.intro}</p>
            <div className="public-actions">
              <ButtonLink to="/contact" variant="accent">
                {copy.contactCenter}
              </ButtonLink>
              <ButtonLink to="/activities" variant="outline">
                Activities
              </ButtonLink>
            </div>
          </div>

          <div className="public-hero-note">
            <p className="public-eyebrow">{copy.mapTitle}</p>
            <p className="mt-4">{copy.mapBody}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {regionSummary.map((region) => (
                <div key={region.name} className="rounded-lg border border-[rgba(15,23,42,0.08)] bg-white px-4 py-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{region.name}</p>
                  <p className="mt-2 text-2xl font-serif text-deep-slate">{region.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-6xl border border-[rgba(15,23,42,0.08)] bg-white p-8 md:p-10">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-sage-600">{copy.communityTitle}</p>
              <h2 className="mt-4 text-4xl font-serif md:text-5xl">{copy.communityTitle}</h2>
            </div>
            <p className="text-lg leading-relaxed text-slate-600">{copy.communityBody}</p>
          </div>
        </div>
      </Section>

      <Section className="bg-white" py="py-8 md:py-12">
        <div className="space-y-24">
          {isLoading ? (
            <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-white px-8 py-14 text-center">
              <p className="text-sm uppercase tracking-[0.22em] text-sage-600">{copy.loadingCenters}</p>
              <p className="mt-3 text-lg text-slate-600">{copy.loadingBody}</p>
            </div>
          ) : null}

          {!isLoading && locationCards.length === 0 ? (
            <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-white px-8 py-14 text-center">
              <p className="text-sm uppercase tracking-[0.22em] text-sage-600">{copy.noCenters}</p>
              <p className="mt-3 text-lg text-slate-600">{copy.noCentersBody}</p>
            </div>
          ) : null}

          {!isLoading && locationCards.length > 0 ? (
            <div className="space-y-10">
              <div>
                <h2 className="text-4xl font-serif md:text-5xl">{copy.mapTitle}</h2>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-ink-warm/50">
                  {locationCards.length} {locationCards.length === 1 ? copy.locationLabel : copy.locationsLabel}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {locationCards.map(({ location: loc }) => (
                  <Card
                    key={loc.id}
                    title={loc.name}
                    eyebrow={loc.city}
                    className="group h-full"
                    cta={
                      <div className="flex flex-wrap gap-3">
                        <ButtonLink to={`/locations/${loc.id}`} variant="primary">
                          {copy.visitCenter}
                        </ButtonLink>
                        <ButtonLink to={`/activities/centers/${loc.id}`} variant="ghost" className="text-slate-500 group-hover:text-sage-600">
                          {copy.viewSessions}
                        </ButtonLink>
                      </div>
                    }
                  >
                    <div className="space-y-5">
                      <p className="text-base font-serif italic leading-snug text-ink-warm/70">
                        {loc.address || copy.regionalCircle}
                      </p>
                      <div className="grid gap-2 text-sm text-slate-600">
                        {loc.phone && <p>{loc.phone}</p>}
                        {loc.email && <p>{loc.email}</p>}
                        {loc.schedule && <p>{loc.schedule}</p>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-sage-mist px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-sage-600">
                          {loc.type}
                        </span>
                        {loc.notes && (
                          <span className="rounded-full bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-ink-warm/55">
                            {loc.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Section>

      <Section className="section-wash border-y border-[rgba(141,107,38,0.12)]">
        <div className="mx-auto max-w-5xl space-y-8">
          <p className="text-[11px] uppercase tracking-[0.32em] text-sage-600">{copy.firstVisitKicker}</p>
          <h2 className="text-4xl font-serif md:text-5xl">{copy.firstVisitTitle}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Card title={copy.visitTitle1} className="h-full">
              {copy.visitBody1}
            </Card>
            <Card title={copy.visitTitle2} className="h-full">
              {copy.visitBody2}
            </Card>
            <Card title={copy.visitTitle3} className="h-full">
              {copy.visitBody3}
            </Card>
            <Card title={copy.visitTitle4} className="h-full">
              {copy.visitBody4}
            </Card>
          </div>
        </div>
      </Section>

      <Section className="bg-white" py="py-12 md:py-16">
        <div className="public-band mx-auto max-w-4xl px-8 py-12 text-center md:px-12">
          <h2 className="text-4xl font-serif md:text-5xl">{copy.contactCenter}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8">
            {copy.communityBody}
          </p>
          <div className="mt-8">
            <ButtonLink to="/contact" variant="secondary" className="bg-white text-deep-slate hover:bg-[#f3ede2]">
              {copy.contactCenter}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
