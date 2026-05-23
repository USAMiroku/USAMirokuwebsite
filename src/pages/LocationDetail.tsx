import { Link, useParams } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { useCenterActivities } from '../learning/hooks/useCenterActivities'
import { toLocation, useManagedCenters } from '../organization/centers'

export default function LocationDetail() {
  const { id } = useParams()
  const { t, language } = useTranslation()
  const { activeCenters } = useManagedCenters()
  const location = activeCenters.map(toLocation).find((l) => l.id === id)
  const { activities, isLoading } = useCenterActivities(id ?? '')

  usePageMeta({
    title: location ? `${location.name} | ${t.brand}` : `${t.notFound} | ${t.brand}`,
    description: location ? `${location.city}, ${location.province}` : t.notFound,
  })

  if (!location) {
    return <p className="px-6 py-32 text-slate-700">{t.notFound}</p>
  }

  const leadershipLabel =
    language === 'en' ? 'Leadership' : language === 'es' ? 'Liderazgo' : 'Liderança'
  const centerHeadLabel =
    language === 'en' ? 'Center Head' : language === 'es' ? 'Jefe del centro' : 'Chefe do centro'
  const assistantLabel =
    language === 'en' ? 'Assistant' : language === 'es' ? 'Asistente' : 'Assistente'
  const activitiesLabel =
    language === 'en' ? 'Center Activities' : language === 'es' ? 'Actividades del centro' : 'Atividades do centro'
  const loadingLabel = language === 'en' ? 'Loading...' : language === 'es' ? 'Cargando...' : 'Carregando...'
  const fallbackActivities =
    language === 'en'
      ? 'Find special services, study sessions, seminars, and other public activities connected to this center.'
      : language === 'es'
        ? 'Encuentre servicios especiales, sesiones de estudio, seminarios y otras actividades públicas vinculadas a este centro.'
        : 'Encontre cultos especiais, sessões de estudo, seminários e outras atividades públicas vinculadas a este centro.'
  const visitCards =
    language === 'en'
      ? [
          {
            title: 'Visit with Ease',
            eyebrow: 'Arrival',
            body: 'Contact the center before arriving if you would like guidance, directions, or an introduction to Johrei.',
          },
          {
            title: 'Quiet and Personal',
            eyebrow: 'Atmosphere',
            body: 'Most centers offer a calm, welcoming environment designed for reflection, prayer, and sincere conversation.',
          },
            {
              title: 'Follow Upcoming Activities',
              eyebrow: 'Next Step',
              body: 'Explore the public activities connected to this center for special services, study sessions, seminars, and community opportunities.',
            },
        ]
      : language === 'es'
        ? [
            {
              title: 'Visite con tranquilidad',
              eyebrow: 'Llegada',
              body: 'Contacte al centro antes de llegar si desea orientación, indicaciones o una introducción a Johrei.',
            },
            {
              title: 'Tranquilo y personal',
              eyebrow: 'Ambiente',
              body: 'La mayoría de los centros ofrece un ambiente sereno y acogedor, pensado para la reflexión, la oración y la conversación sincera.',
            },
            {
              title: 'Siga las próximas actividades',
              eyebrow: 'Próximo paso',
              body: 'Explore las actividades públicas vinculadas a este centro para servicios especiales, sesiones de estudio, seminarios y oportunidades comunitarias.',
            },
          ]
        : [
            {
              title: 'Visite com tranquilidade',
              eyebrow: 'Chegada',
              body: 'Entre em contato com o centro antes de chegar se desejar orientação, instruções ou uma introdução ao Johrei.',
            },
            {
              title: 'Tranquilo e pessoal',
              eyebrow: 'Ambiente',
              body: 'A maioria dos centros oferece um ambiente calmo e acolhedor, pensado para reflexão, oração e conversa sincera.',
            },
            {
              title: 'Acompanhe as próximas atividades',
              eyebrow: 'Próximo passo',
              body: 'Explore as atividades públicas ligadas a este centro para cultos especiais, sessões de estudo, seminários e oportunidades comunitárias.',
            },
          ]

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="relative overflow-hidden border-b border-[rgba(141,107,38,0.14)] px-6 pb-16 pt-36 md:pt-40">
        <div className="floating-orb left-[9%] top-24 h-28 w-28 bg-[rgba(173,123,34,0.16)]" />
        <div className="floating-orb right-[12%] top-36 h-24 w-24 bg-[rgba(255,255,255,0.26)]" />

        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-sage-600">
              {location.type === 'ComingSoon'
                ? t.locations.types.comingSoon
                : t.locations.types[location.type.toLowerCase() as 'center' | 'group']}
            </p>
            <h1 className="text-5xl font-serif leading-[0.95] md:text-7xl">{location.name}</h1>
            <p className="text-lg text-slate-600 md:text-xl">
              {location.city}, {location.province}
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/locations" variant="secondary">
                {t.actions.back}
              </ButtonLink>
              {location.mapUrl && (
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[rgba(141,107,38,0.28)] bg-white/55 px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-deep-slate transition-all hover:-translate-y-0.5 hover:bg-white"
                >
                  {t.locations.detail.directions}
                </a>
              )}
            </div>
          </div>

          <div className="paper-panel ornament-ring rounded-[32px] p-7 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sage-600">{t.locations.detail.contact}</p>
            {location.address && <p className="mt-4 text-base leading-7 text-slate-700">{location.address}</p>}
            {location.notes && <p className="mt-3 text-sm text-ink-warm/60">{location.notes}</p>}
            <div className="mt-5 space-y-2 text-sm text-slate-700">
              {location.phone && <p>{location.phone}</p>}
              {location.email && (
                <p>
                  <a className="text-sage-600 hover:text-sage-700" href={`mailto:${location.email}`}>
                    {location.email}
                  </a>
                </p>
              )}
            </div>
            <div className="mt-6">
              <ButtonLink to="/contact" variant="accent">
                {t.locations.detail.contactCta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card title={t.locations.detail.schedule} className="h-full">
            <p className="text-base leading-7 text-slate-700">
              {location.schedule ||
                (location.type === 'ComingSoon'
                  ? t.locations.types.comingSoon
                  : language === 'en'
                    ? 'Schedule shared upon request; contact us to plan your visit.'
                    : language === 'es'
                      ? 'Horario compartido bajo solicitud; contactenos para planificar su visita.'
                      : 'Agenda compartilhada sob solicitação; entre em contato para planejar sua visita.')}
            </p>
          </Card>

          <Card title={activitiesLabel} className="h-full">
            {isLoading ? (
              <p className="text-sm text-slate-500">{loadingLabel}</p>
            ) : activities.length > 0 ? (
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-2xl border border-[rgba(141,107,38,0.12)] bg-white/72 px-4 py-3"
                  >
                    <p className="font-semibold text-deep-slate">{activity.title}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink-warm/55">
                      {activity.type.replace('_', ' ')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base leading-7 text-slate-600">{fallbackActivities}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to={`/activities/centers/${location.id}`} variant="primary">
                {language === 'en' ? 'Open Center Activities' : language === 'es' ? 'Abrir actividades del centro' : 'Abrir atividades do centro'}
              </ButtonLink>
              <Link
                to="/activities"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[rgba(141,107,38,0.22)] px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-deep-slate transition-all hover:-translate-y-0.5 hover:bg-sage-mist"
              >
                Activities
              </Link>
            </div>
          </Card>
        </div>
      </Section>

      {(location.leadership?.head || location.leadership?.assistant) && (
        <Section className="section-wash border-y border-[rgba(141,107,38,0.12)]">
          <div className="mx-auto max-w-4xl">
            <Card title={leadershipLabel}>
              <div className="grid gap-4 md:grid-cols-2">
                {location.leadership.head && (
                  <div className="rounded-2xl border border-[rgba(141,107,38,0.12)] bg-white/72 px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-600">{centerHeadLabel}</p>
                    <p className="mt-2 text-lg font-serif text-deep-slate">{location.leadership.head}</p>
                  </div>
                )}
                {location.leadership.assistant && (
                  <div className="rounded-2xl border border-[rgba(141,107,38,0.12)] bg-white/72 px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-600">{assistantLabel}</p>
                    <p className="mt-2 text-lg font-serif text-deep-slate">{location.leadership.assistant}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </Section>
      )}

      <Section className="bg-sanctuary-100">
        <div className="grid gap-6 md:grid-cols-3">
          {visitCards.map((card) => (
            <Card key={card.title} title={card.title} eyebrow={card.eyebrow}>
              {card.body}
            </Card>
          ))}
        </div>
      </Section>
    </div>
  )
}
