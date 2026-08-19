import { useEffect, useMemo, useState } from 'react'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'
import { useManagedCenters } from '../../organization/centers'
import { useTranslation } from '../../context/TranslationContext'
import { AnnualEventsCalendar } from '../components/AnnualEventsCalendar'

type Activity = {
  id: string
  type: 'class' | 'study_session' | 'event' | 'self_study'
  title: string
  description: string | null
  center_id: string | null
}

type Session = {
  id: string
  activity_id: string
  start_time: string | null
}

const TYPE_BADGE: Record<Activity['type'], string> = {
  event: 'border border-amber-200 bg-amber-50 text-amber-800',
  study_session: 'border border-[rgba(141,107,38,0.25)] bg-[rgba(248,244,235,0.8)] text-sage-600',
  class: 'border border-slate-200 bg-slate-50 text-slate-700',
  self_study: 'border border-[rgba(15,23,42,0.1)] bg-white text-slate-500',
}

function formatTypeLabel(type: Activity['type'], language: 'en' | 'es' | 'pt') {
  if (language === 'es') {
    switch (type) {
      case 'event':
        return 'Servicio o evento especial'
      case 'study_session':
        return 'Sesión de estudio'
      case 'class':
        return 'Clase'
      case 'self_study':
        return 'Recurso para descargar'
    }
  }

  if (language === 'pt') {
    switch (type) {
      case 'event':
        return 'Culto ou evento especial'
      case 'study_session':
        return 'Sessão de estudo'
      case 'class':
        return 'Aula'
      case 'self_study':
        return 'Recurso para download'
    }
  }

  switch (type) {
    case 'event':
      return 'Special Service / Event'
    case 'study_session':
      return 'Study Session'
    case 'class':
      return 'Class'
    case 'self_study':
      return 'Download / Resource'
  }
}

function formatDate(iso: string, language: 'en' | 'es' | 'pt') {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const locale = language === 'es' ? 'es-US' : language === 'pt' ? 'pt-BR' : 'en-US'
  return new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric', year: 'numeric' }).format(d)
}

function getNextSession(sessions: Session[], activityId: string) {
  const now = Date.now()
  return (
    sessions
      .filter((s) => s.activity_id === activityId && s.start_time && new Date(s.start_time).getTime() >= now)
      .sort((a, b) => new Date(a.start_time!).getTime() - new Date(b.start_time!).getTime())[0] ?? null
  )
}

function countUpcoming(sessions: Session[], activityId: string) {
  const now = Date.now()
  return sessions.filter(
    (s) => s.activity_id === activityId && s.start_time && new Date(s.start_time).getTime() >= now,
  ).length
}

function hasAnySessions(sessions: Session[], activityId: string) {
  return sessions.some((s) => s.activity_id === activityId)
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-[rgba(184,134,11,0.12)] bg-white p-8">
      <div className="flex gap-2">
        <div className="h-6 w-28 rounded-full bg-slate-100" />
        <div className="h-6 w-24 rounded-full bg-slate-100" />
      </div>
      <div className="mt-5 h-7 w-3/4 rounded-lg bg-slate-100" />
      <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
        <div className="h-3 w-4/6 rounded bg-slate-100" />
      </div>
      <div className="mt-6 flex gap-3">
        <div className="h-11 w-32 rounded-full bg-slate-100" />
        <div className="h-11 w-24 rounded-full bg-slate-100" />
      </div>
    </div>
  )
}

export default function LearningActivities() {
  const { activeCenters } = useManagedCenters()
  const { language } = useTranslation()
  const [activities, setActivities] = useState<Activity[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const copy =
    language === 'es'
      ? {
          title: 'Calendario de Eventos',
          eyebrow: 'Eventos de Miroku Association USA',
          metaDescription: 'Calendario anual, servicios, clases, seminarios y eventos comunitarios de Miroku Association USA en Estados Unidos.',
          noEventsTitle: 'Aún no se han agregado eventos dinámicos.',
          noEventsBody: 'Vuelva pronto para ver servicios especiales, seminarios y sesiones de estudio.',
          viewEvent: 'Ver evento',
          center: 'Centro',
          upcomingSessions: 'sesiones próximas',
          specialServices: 'Ceremonias Especiales',
          specialServicesBody: 'Acceda a formularios imprimibles para las ceremonias de oración.',
          specialServicesAction: 'Abrir formularios',
        }
      : language === 'pt'
        ? {
            title: 'Calendário de Eventos',
            eyebrow: 'Eventos da Miroku Association USA',
            metaDescription: 'Calendário anual, cultos, aulas, seminários e eventos comunitários da Miroku Association USA nos Estados Unidos.',
            noEventsTitle: 'Ainda não foram adicionados eventos dinâmicos.',
            noEventsBody: 'Volte em breve para ver cultos especiais, seminários e sessões de estudo.',
            viewEvent: 'Ver evento',
            center: 'Centro',
            upcomingSessions: 'sessões futuras',
            specialServices: 'Cultos Especiais',
            specialServicesBody: 'Acesse formulários imprimíveis para os cultos de oração.',
            specialServicesAction: 'Abrir formulários',
          }
        : {
            title: 'Events Calendar',
            eyebrow: 'Miroku Association USA Events',
            metaDescription: 'Annual calendar, services, classes, seminars, and community events from Miroku Association USA across the United States.',
            noEventsTitle: 'No additional live events have been added yet.',
            noEventsBody: 'Check back soon for special services, seminars, and study sessions.',
            viewEvent: 'View Event',
            center: 'Center',
            upcomingSessions: 'upcoming sessions',
            specialServices: 'Special Services',
            specialServicesBody: 'Access printable prayer forms for special services.',
            specialServicesAction: 'Open forms',
          }

  usePageMeta({
    title: `${copy.title} | Miroku Association USA`,
    description: copy.metaDescription,
  })

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError('Learning app is not configured. Add Supabase env vars to enable activities.')
        setIsLoading(false)
        return
      }

      let { data, error: queryError } = await supabase
        .from('learning_activities')
        .select('id,type,title,description,center_id')
        .eq('is_published', true)
        .eq('show_on_main_events', true)
        .order('created_at', { ascending: false })
        .limit(50)

      // Graceful fallback if is_published column doesn't exist yet
      if (queryError) {
        const fallback = await supabase
          .from('learning_activities')
          .select('id,type,title,description,center_id')
          .eq('show_on_main_events', true)
          .order('created_at', { ascending: false })
          .limit(50)
        data = fallback.data
        queryError = fallback.error
      }

      if (queryError) {
        setError(queryError.message)
        setIsLoading(false)
        return
      }

      const loadedActivities = (data ?? []) as Activity[]
      setActivities(loadedActivities)

      if (loadedActivities.length > 0) {
        const ids = loadedActivities.map((a) => a.id)
        // Fetch all sessions (past + future) so we can detect expired activities
        const { data: sessionData, error: sessionError } = await supabase
          .from('learning_sessions')
          .select('id,activity_id,start_time')
          .in('activity_id', ids)
          .order('start_time', { ascending: true })
          .limit(500)

        if (!sessionError) {
          setSessions((sessionData ?? []) as Session[])
        }
      }

      setIsLoading(false)
    }

    void load()
  }, [])

  // Activities that have sessions but all in the past are hidden automatically
  const activeActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (!hasAnySessions(sessions, activity.id)) return true // no sessions = evergreen (downloads, etc.)
      return countUpcoming(sessions, activity.id) > 0
    })
  }, [activities, sessions])

  const sortedActivities = useMemo(() => {
    return [...activeActivities].sort((a, b) => {
      const nextA = getNextSession(sessions, a.id)
      const nextB = getNextSession(sessions, b.id)
      if (nextA && nextB) return new Date(nextA.start_time!).getTime() - new Date(nextB.start_time!).getTime()
      if (nextA) return -1
      if (nextB) return 1
      return 0
    })
  }, [activeActivities, sessions])

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative px-6 pt-14 pb-10 md:pt-20 md:pb-12">
        <div className="mx-auto max-w-6xl">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">{copy.eyebrow}</span>
          <h1 className="mt-3 text-5xl font-serif text-deep-slate leading-tight md:text-6xl">{copy.title}</h1>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          <AnnualEventsCalendar language={language} />
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
          ) : null}

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : null}

          {!isLoading && !error && sortedActivities.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-8 py-16 text-center">
              <p className="text-2xl font-serif text-deep-slate">{copy.noEventsTitle}</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">{copy.noEventsBody}</p>
            </div>
          ) : null}

          {!isLoading && !error ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${TYPE_BADGE.event}`}>
                    {formatTypeLabel('event', language)}
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-serif text-deep-slate">{copy.specialServices}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{copy.specialServicesBody}</p>
                <div className="mt-auto pt-4">
                  <div className="mt-4 flex gap-3">
                    <ButtonLink to="/special-services" variant="primary">
                      {copy.specialServicesAction}
                    </ButtonLink>
                  </div>
                </div>
              </div>
              {sortedActivities.map((activity) => {
                const center = activity.center_id
                  ? activeCenters.find((c) => c.id === activity.center_id)
                  : null
                const nextSession = getNextSession(sessions, activity.id)
                const upcomingCount = countUpcoming(sessions, activity.id)
                const nextDate = nextSession?.start_time
                  ? formatDate(nextSession.start_time, language)
                  : null

                return (
                  <div
                    key={activity.id}
                    className="flex flex-col rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${TYPE_BADGE[activity.type]}`}
                      >
                        {formatTypeLabel(activity.type, language)}
                      </span>
                      {nextDate ? (
                        <span className="inline-flex items-center rounded-full border border-[rgba(15,23,42,0.08)] bg-sanctuary-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {nextDate}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="mt-4 text-2xl font-serif text-deep-slate">{activity.title}</h2>
                    {center ? (
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {copy.center}: {center.name}
                      </p>
                    ) : null}
                    {activity.description ? (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                        {activity.description}
                      </p>
                    ) : null}

                    <div className="mt-auto">
                      {upcomingCount > 0 ? (
                        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-600">
                          {upcomingCount} {copy.upcomingSessions}
                        </p>
                      ) : null}
                      <div className="mt-4 flex gap-3">
                        <ButtonLink to={`/activities/${activity.id}`} variant="primary">
                          {copy.viewEvent}
                        </ButtonLink>
                        {center ? (
                          <ButtonLink to={`/activities/centers/${activity.center_id}`} variant="ghost">
                            {copy.center}
                          </ButtonLink>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      </Section>
    </div>
  )
}
