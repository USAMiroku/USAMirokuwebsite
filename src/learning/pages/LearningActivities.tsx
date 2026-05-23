import { useEffect, useMemo, useState } from 'react'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'
import { useManagedCenters } from '../../organization/centers'
import { useTranslation } from '../../context/TranslationContext'

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

const TYPE_OPTIONS: Array<Activity['type']> = ['event', 'study_session', 'class', 'self_study']

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
  const [selectedCenterId, setSelectedCenterId] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const copy =
    language === 'es'
      ? {
          title: 'Actividades',
          eyebrow: 'Explorar',
          centerLabel: 'Centro o grupo',
          allCenters: 'Todos los centros',
          typeLabel: 'Tipo',
          allTypes: 'Todos los tipos',
          searchLabel: 'Buscar',
          searchPlaceholder: 'Busque por nombre, tema o detalle',
          clearFilters: 'Limpiar filtros',
          showing: 'Mostrando',
          of: 'de',
          results: 'actividades',
          emptyTitle: 'No se encontraron actividades con esos filtros.',
          emptyBody: 'Pruebe con otro centro, tipo o quite los filtros.',
          noEventsTitle: 'Aún no se han agregado actividades.',
          noEventsBody: 'Vuelva pronto para ver servicios especiales, seminarios y sesiones de estudio.',
          viewEvent: 'Ver actividad',
          center: 'Centro',
          upcomingSessions: 'sesiones próximas',
        }
      : language === 'pt'
        ? {
            title: 'Atividades',
            eyebrow: 'Explorar',
            centerLabel: 'Centro ou grupo',
            allCenters: 'Todos os centros',
            typeLabel: 'Tipo',
            allTypes: 'Todos os tipos',
            searchLabel: 'Buscar',
            searchPlaceholder: 'Busque por nome, tema ou detalhe',
            clearFilters: 'Limpar filtros',
            showing: 'Mostrando',
            of: 'de',
            results: 'atividades',
            emptyTitle: 'Nenhuma atividade foi encontrada com esses filtros.',
            emptyBody: 'Tente outro centro, tipo ou limpe os filtros.',
            noEventsTitle: 'Ainda não foram adicionadas atividades.',
            noEventsBody: 'Volte em breve para ver cultos especiais, seminários e sessões de estudo.',
            viewEvent: 'Ver atividade',
            center: 'Centro',
            upcomingSessions: 'sessões futuras',
          }
        : {
            title: 'Activities',
            eyebrow: 'Browse',
            centerLabel: 'Center or group',
            allCenters: 'All centers',
            typeLabel: 'Type',
            allTypes: 'All types',
            searchLabel: 'Search',
            searchPlaceholder: 'Search by name, topic, or detail',
            clearFilters: 'Clear filters',
            showing: 'Showing',
            of: 'of',
            results: 'activities',
            emptyTitle: 'No activities match these filters.',
            emptyBody: 'Try another center, type, or clear the filters.',
            noEventsTitle: 'No activities have been added yet.',
            noEventsBody: 'Check back soon for special services, seminars, and study sessions.',
            viewEvent: 'View Activity',
            center: 'Center',
            upcomingSessions: 'upcoming sessions',
          }

  usePageMeta({
    title: `${copy.title} | World Messianic Church of America`,
    description:
      'Find special services, seminars, study sessions, and community gatherings at World Messianic Church of America / Miroku Association USA.',
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
        .order('created_at', { ascending: false })
        .limit(50)

      // Graceful fallback if is_published column doesn't exist yet
      if (queryError) {
        const fallback = await supabase
          .from('learning_activities')
          .select('id,type,title,description,center_id')
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

  const filteredActivities = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filtered = activeActivities.filter((activity) => {
      const center = activity.center_id ? activeCenters.find((item) => item.id === activity.center_id) : null
      const matchesCenter = !selectedCenterId || activity.center_id === selectedCenterId
      const matchesType = !selectedType || activity.type === selectedType
      const haystack = `${activity.title} ${activity.description ?? ''} ${center?.name ?? ''}`.toLowerCase()
      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch)
      return matchesCenter && matchesType && matchesSearch
    })

    return filtered.sort((a, b) => {
      const nextA = getNextSession(sessions, a.id)
      const nextB = getNextSession(sessions, b.id)
      if (nextA && nextB) return new Date(nextA.start_time!).getTime() - new Date(nextB.start_time!).getTime()
      if (nextA) return -1
      if (nextB) return 1
      return 0
    })
  }, [activeActivities, activeCenters, sessions, searchTerm, selectedCenterId, selectedType])

  const hasFilters = selectedCenterId !== '' || selectedType !== '' || searchTerm.trim() !== ''

  function clearFilters() {
    setSelectedCenterId('')
    setSelectedType('')
    setSearchTerm('')
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative px-6 pt-14 pb-6 md:pt-20 md:pb-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">{copy.eyebrow}</span>
            <h1 className="text-5xl md:text-6xl font-serif text-deep-slate leading-tight">{copy.title}</h1>
          </div>

          {/* Filter bar */}
          <div className="rounded-2xl border border-[rgba(184,134,11,0.22)] bg-white px-6 py-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
            <div className="grid gap-4 md:grid-cols-4">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {copy.centerLabel}
                </span>
                <select
                  value={selectedCenterId}
                  onChange={(event) => setSelectedCenterId(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                >
                  <option value="">{copy.allCenters}</option>
                  {activeCenters.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {copy.typeLabel}
                </span>
                <select
                  value={selectedType}
                  onChange={(event) => setSelectedType(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                >
                  <option value="">{copy.allTypes}</option>
                  {TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {formatTypeLabel(type, language)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {copy.searchLabel}
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                />
              </label>

              <div className="flex flex-col justify-end gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  &nbsp;
                </span>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">
                    <span className="font-semibold text-deep-slate">{filteredActivities.length}</span>
                    {' '}{copy.of}{' '}
                    <span className="font-semibold text-deep-slate">{activeActivities.length}</span>
                    {' '}{copy.results}
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    disabled={!hasFilters}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-[rgba(184,134,11,0.22)] px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-deep-slate transition hover:bg-sanctuary-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {copy.clearFilters}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
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

          {!isLoading && !error && activeActivities.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-8 py-16 text-center">
              <p className="text-2xl font-serif text-deep-slate">{copy.noEventsTitle}</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">{copy.noEventsBody}</p>
            </div>
          ) : null}

          {!isLoading && !error && activeActivities.length > 0 && filteredActivities.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-8 py-16 text-center">
              <p className="text-2xl font-serif text-deep-slate">{copy.emptyTitle}</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">{copy.emptyBody}</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-[rgba(184,134,11,0.22)] bg-white px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-deep-slate transition hover:bg-sanctuary-50"
              >
                {copy.clearFilters}
              </button>
            </div>
          ) : null}

          {!isLoading && !error ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredActivities.map((activity) => {
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
