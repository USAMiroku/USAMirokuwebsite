import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'
import { useTranslation } from '../../context/TranslationContext'
import { useManagedCenters } from '../../organization/centers'
import { expandUpcomingSessions, recurrenceLabel, type RecurrenceRule } from '../lib/sessionRecurrence'

type Activity = {
  id: string
  type: 'class' | 'study_session' | 'event' | 'self_study'
  title: string
  description: string | null
  center_id: string | null
  image_url?: string | null
  contact_name?: string | null
  contact_email?: string | null
  registration_required?: boolean | null
  registration_url?: string | null
}

type Session = {
  id: string
  start_time: string | null
  end_time: string | null
  meeting_url: string | null
  seats_total: number | null
  location: string | null
  recurrence_rule: RecurrenceRule | null
  recurrence_ordinal: number | null
  recurrence_weekday: number | null
  recurrence_until: string | null
}

type Material = {
  id: string
  session_id: string | null
  title: string
  description: string | null
  file_name: string
  mime_type: string | null
  download_url: string | null
}

function formatTypeLabel(type: string, language: 'en' | 'es' | 'pt') {
  if (language === 'es') {
    switch (type) {
      case 'event': return 'Servicio o evento especial'
      case 'study_session': return 'Sesión de estudio'
      case 'class': return 'Clase'
      case 'self_study': return 'Recurso para descargar'
    }
  }
  if (language === 'pt') {
    switch (type) {
      case 'event': return 'Culto ou evento especial'
      case 'study_session': return 'Sessão de estudo'
      case 'class': return 'Aula'
      case 'self_study': return 'Recurso para download'
    }
  }
  switch (type) {
    case 'event': return 'Special Service / Event'
    case 'study_session': return 'Study Session'
    case 'class': return 'Class'
    case 'self_study': return 'Download / Resource'
    default: return type.replaceAll('_', ' ')
  }
}

function formatDateTime(iso: string | null, language: 'en' | 'es' | 'pt') {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const locale = language === 'es' ? 'es-US' : language === 'pt' ? 'pt-BR' : 'en-US'
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d)
}

function formatTimeOnly(iso: string | null, language: 'en' | 'es' | 'pt') {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const locale = language === 'es' ? 'es-US' : language === 'pt' ? 'pt-BR' : 'en-US'
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(d)
}

function buildGoogleCalendarUrl(s: Session, title: string, description?: string | null): string | null {
  if (!s.start_time) return null
  const start = new Date(s.start_time)
  const end = s.end_time
    ? new Date(s.end_time)
    : new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
  })
  if (description) p.set('details', description)
  if (s.location) p.set('location', s.location)
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

function downloadICS(s: Session, title: string, description?: string | null) {
  if (!s.start_time) return
  const start = new Date(s.start_time)
  const end = s.end_time
    ? new Date(s.end_time)
    : new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description.replace(/\n/g, '\\n')}` : '',
    s.location ? `LOCATION:${s.location}` : '',
    `UID:${s.id}@worldmessianic.org`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function LearningActivityDetail() {
  const { activityId } = useParams<{ activityId: string }>()
  const { language } = useTranslation()
  const { activeCenters } = useManagedCenters()

  const [activity, setActivity] = useState<Activity | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pageLoadedAt] = useState(() => Date.now())

  const copy =
    language === 'es'
      ? {
          metaTitle: 'Calendario de Eventos | Detalle',
          metaDescription: 'Horario, materiales y detalles públicos de la actividad.',
          notConfigured:
            'La aplicación de aprendizaje no está configurada. Agregue las variables de entorno de Supabase.',
          offering: 'Actividad',
          loading: 'Cargando...',
          backToActivities: 'Volver al calendario de eventos',
          noSessions: 'Las fechas se anunciarán pronto.',
          noSessionsBody:
            'Vuelva pronto o contacte al centro para conocer las próximas fechas.',
          session: 'Sesión',
          scheduleTba: 'Horario por anunciar',
          location: 'Ubicación',
          seats: 'Cupos disponibles',
          addToGoogle: 'Agregar a Google Calendar',
          downloadIcs: 'Descargar .ics',
          joinOnline: 'Unirse en línea',
          center: 'Centro organizador',
          visitCenter: 'Ver página del centro',
          contact: 'Contacto',
          registrationRequired: 'Se requiere inscripción',
          registerNow: 'Inscribirse ahora',
          contactForInfo: 'Contactar para más información',
          eventDownloads: 'Descargas',
          sessionDownloads: 'Materiales de la sesión',
          download: 'Descargar',
          viewLocations: 'Ver ubicaciones',
        }
      : language === 'pt'
        ? {
            metaTitle: 'Calendário de Eventos | Detalhes',
            metaDescription: 'Horários, materiais e detalhes públicos da atividade.',
            notConfigured:
              'O aplicativo de aprendizado não está configurado. Adicione as variáveis de ambiente do Supabase.',
            offering: 'Atividade',
            loading: 'Carregando...',
            backToActivities: 'Voltar ao calendário de eventos',
            noSessions: 'As datas serão anunciadas em breve.',
            noSessionsBody: 'Volte em breve ou entre em contato com o centro para saber as próximas datas.',
            session: 'Sessão',
            scheduleTba: 'Horário a ser anunciado',
            location: 'Local',
            seats: 'Vagas disponíveis',
            addToGoogle: 'Adicionar ao Google Agenda',
            downloadIcs: 'Baixar .ics',
            joinOnline: 'Participar online',
            center: 'Centro organizador',
            visitCenter: 'Ver página do centro',
            contact: 'Contato',
            registrationRequired: 'Inscrição obrigatória',
            registerNow: 'Inscrever-se agora',
            contactForInfo: 'Entrar em contato para mais informações',
            eventDownloads: 'Downloads',
            sessionDownloads: 'Materiais da sessão',
            download: 'Baixar',
            viewLocations: 'Ver locais',
          }
        : {
            metaTitle: 'Events Calendar | Detail',
            metaDescription: 'Schedule, downloads, and public activity details.',
            notConfigured: 'Learning app is not configured. Add Supabase env vars to enable activities.',
            offering: 'Activity',
            loading: 'Loading...',
            backToActivities: 'Back to Events Calendar',
            noSessions: 'Dates will be announced soon.',
            noSessionsBody: 'Check back soon or contact the center for upcoming dates.',
            session: 'Session',
            scheduleTba: 'Schedule to be announced',
            location: 'Location',
            seats: 'Seats available',
            addToGoogle: 'Add to Google Calendar',
            downloadIcs: 'Download .ics',
            joinOnline: 'Join Online',
            center: 'Hosting center',
            visitCenter: 'Visit center page',
            contact: 'Contact',
            registrationRequired: 'Registration required',
            registerNow: 'Register Now',
            contactForInfo: 'Contact for more information',
            eventDownloads: 'Downloads',
            sessionDownloads: 'Session materials',
            download: 'Download',
            viewLocations: 'View Locations',
          }

  const typeLabel = useMemo(() => {
    if (!activity) return null
    return formatTypeLabel(activity.type, language)
  }, [activity, language])

  const hostingCenter = useMemo(() => {
    if (!activity?.center_id) return null
    return activeCenters.find((c) => c.id === activity.center_id) ?? null
  }, [activity, activeCenters])

  usePageMeta({
    title: activity ? `${activity.title} | ${copy.metaTitle}` : copy.metaTitle,
    description: activity?.description ?? copy.metaDescription,
  })

  useEffect(() => {
    async function load() {
      if (!activityId) return

      if (!supabase) {
        setError(copy.notConfigured)
        setIsLoading(false)
        return
      }

      // Try to fetch with all new columns; fall back gracefully if migration hasn't run
      let activityData: Partial<Activity> | null = null
      const fullFields =
        'id,type,title,description,center_id,image_url,contact_name,contact_email,registration_required,registration_url'
      const baseFields = 'id,type,title,description,center_id'

      const { data: full, error: fullErr } = await supabase
        .from('learning_activities')
        .select(fullFields)
        .eq('id', activityId)
        .maybeSingle()

      if (fullErr) {
        const { data: base, error: baseErr } = await supabase
          .from('learning_activities')
          .select(baseFields)
          .eq('id', activityId)
          .maybeSingle()
        if (baseErr) {
          setError(baseErr.message)
          setIsLoading(false)
          return
        }
        activityData = base as Partial<Activity> | null
      } else {
        activityData = full as Partial<Activity> | null
      }

      setActivity(activityData as Activity | null)

      const { data: sessionData, error: sessionsError } = await supabase
        .from('learning_sessions')
        .select('id,start_time,end_time,meeting_url,seats_total,location,recurrence_rule,recurrence_ordinal,recurrence_weekday,recurrence_until')
        .eq('activity_id', activityId)
        .order('start_time', { ascending: true })
        .limit(50)

      if (sessionsError) {
        setError(sessionsError.message)
        setIsLoading(false)
        return
      }

      setSessions((sessionData ?? []) as Session[])

      try {
        const response = await fetch(
          `/api/public/event-materials?activityId=${encodeURIComponent(activityId)}`,
        )
        const payload = await response.json()
        if (response.ok) {
          setMaterials((payload.materials ?? []) as Material[])
        }
      } catch {
        // Materials are optional — don't block the page on a fetch failure
      }

      setIsLoading(false)
    }

    void load().catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : 'Could not load activity details.')
      setIsLoading(false)
    })
  }, [activityId, copy.notConfigured])

  const upcomingSessions = useMemo(() => {
    return expandUpcomingSessions(sessions, new Date(pageLoadedAt), 12)
  }, [pageLoadedAt, sessions])

  const eventMaterials = materials.filter((m) => m.session_id === null)

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative px-6 pt-14 pb-8 md:pt-20 md:pb-10">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/activities"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-sage-600 transition-colors mb-6"
          >
            ← {copy.backToActivities}
          </Link>
          <span className="block text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase mb-3">
            {typeLabel ?? copy.offering}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-deep-slate leading-tight">
            {activity?.title ?? copy.loading}
          </h1>
          {hostingCenter ? (
            <p className="mt-3 text-base text-slate-500 font-medium">{hostingCenter.name}</p>
          ) : null}
        </div>
      </section>

      {/* ─── Banner image ─────────────────────────────────────────────────── */}
      {activity?.image_url ? (
        <div className="px-6 pb-4">
          <div className="mx-auto max-w-4xl">
            <img
              src={activity.image_url}
              alt={activity.title}
              className="w-full rounded-3xl object-cover max-h-80 shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
            />
          </div>
        </div>
      ) : null}

      <Section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
          ) : null}

          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-5 w-2/3 rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-5/6 rounded bg-slate-100" />
              <div className="h-4 w-4/6 rounded bg-slate-100" />
            </div>
          ) : null}

          {/* ─── Description ─────────────────────────────────────────────── */}
          {!isLoading && activity?.description ? (
            <div className="prose prose-slate max-w-none">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage-600 mb-4 not-prose">
                About this activity
              </p>
              <p className="text-base leading-8 text-slate-700 whitespace-pre-line">{activity.description}</p>
            </div>
          ) : null}

          {/* ─── Sessions / Schedule ──────────────────────────────────────── */}
          {!isLoading ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage-600 mb-4">
                {language === 'es' ? 'Calendario' : language === 'pt' ? 'Agenda' : 'Schedule'}
              </p>

              {upcomingSessions.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-6 py-8 text-center">
                  <p className="font-serif text-xl text-deep-slate">{copy.noSessions}</p>
                  <p className="mt-2 text-sm text-slate-500">{copy.noSessionsBody}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((s) => {
                    const googleUrl = buildGoogleCalendarUrl(s, activity?.title ?? '', activity?.description)
                    const endTime = formatTimeOnly(s.end_time, language)
                    return (
                      <div
                        key={s.id}
                        className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-6 md:p-8 shadow-[0_8px_32px_rgba(15,23,42,0.06)]"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                          <div className="space-y-2">
                            <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-sage-600">
                              {recurrenceLabel(s) ?? copy.session}
                            </p>
                            <p className="text-xl md:text-2xl font-serif text-deep-slate">
                              {formatDateTime(s.start_time, language) ?? copy.scheduleTba}
                              {endTime ? ` – ${endTime}` : ''}
                            </p>
                            {s.location ? (
                              <p className="flex items-center gap-1.5 text-sm text-slate-600">
                                <span>📍</span>
                                {s.location}
                              </p>
                            ) : null}
                            {s.seats_total !== null ? (
                              <p className="text-sm text-slate-500">
                                {copy.seats}: {s.seats_total}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex flex-col gap-2 shrink-0">
                            {s.meeting_url ? (
                              <a
                                href={s.meeting_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-[10px] font-semibold tracking-[0.14em] uppercase text-white transition hover:bg-blue-700"
                              >
                                {copy.joinOnline}
                              </a>
                            ) : null}
                            {googleUrl ? (
                              <a
                                href={googleUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-10 items-center justify-center rounded-full border border-[rgba(184,134,11,0.3)] bg-sanctuary-50 px-5 text-[10px] font-semibold tracking-[0.12em] uppercase text-deep-slate transition hover:bg-sanctuary-100"
                              >
                                {copy.addToGoogle}
                              </a>
                            ) : null}
                            {s.start_time ? (
                              <button
                                type="button"
                                onClick={() => downloadICS(s, activity?.title ?? '', activity?.description)}
                                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-5 text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-600 transition hover:bg-slate-50"
                              >
                                {copy.downloadIcs}
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {/* Session-specific materials */}
                        {materials.filter((m) => m.session_id === s.id.split(':')[0]).length > 0 ? (
                          <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                              {copy.sessionDownloads}
                            </p>
                            {materials
                              .filter((m) => m.session_id === s.id.split(':')[0])
                              .map((m) => (
                                <a
                                  key={m.id}
                                  href={m.download_url ?? '#'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3 transition hover:bg-sanctuary-50"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-deep-slate">{m.title}</p>
                                    {m.description ? (
                                      <p className="mt-0.5 text-xs text-slate-500">{m.description}</p>
                                    ) : null}
                                  </div>
                                  <span className="text-xs font-semibold text-sage-700">{copy.download}</span>
                                </a>
                              ))}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : null}

          {/* ─── Center block ─────────────────────────────────────────────── */}
          {!isLoading && hostingCenter ? (
            <div className="rounded-3xl border border-[rgba(184,134,11,0.18)] bg-[rgba(248,244,235,0.7)] p-6 md:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage-600 mb-3">
                {copy.center}
              </p>
              <p className="text-xl font-serif text-deep-slate">{hostingCenter.name}</p>
              {hostingCenter.city ? (
                <p className="mt-1 text-sm text-slate-500">
                  {hostingCenter.city}
                  {hostingCenter.state ? `, ${hostingCenter.state}` : ''}
                </p>
              ) : null}
              {hostingCenter.address ? (
                <p className="mt-1 text-sm text-slate-500">{hostingCenter.address}</p>
              ) : null}
              <div className="mt-5">
                <ButtonLink to={`/activities/centers/${hostingCenter.id}`} variant="outline">
                  {copy.visitCenter}
                </ButtonLink>
              </div>
            </div>
          ) : null}

          {/* ─── Contact / Registration block ─────────────────────────────── */}
          {!isLoading && activity ? (
            <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-6 md:p-8 shadow-[0_8px_32px_rgba(15,23,42,0.06)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage-600 mb-3">
                {copy.contact}
              </p>

              {activity.registration_required ? (
                <>
                  <p className="text-xl font-serif text-deep-slate">{copy.registrationRequired}</p>
                  {activity.contact_name || activity.contact_email ? (
                    <div className="mt-3 text-sm text-slate-600">
                      {activity.contact_name ? <p>{activity.contact_name}</p> : null}
                      {activity.contact_email ? (
                        <a
                          href={`mailto:${activity.contact_email}`}
                          className="text-sage-600 hover:underline"
                        >
                          {activity.contact_email}
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {activity.registration_url ? (
                      <a
                        href={activity.registration_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 items-center justify-center rounded-full bg-deep-slate px-6 text-[10px] font-semibold tracking-[0.18em] uppercase text-white transition hover:bg-[#14202a]"
                      >
                        {copy.registerNow}
                      </a>
                    ) : (
                      <ButtonLink to="/contact" variant="primary">
                        {copy.registerNow}
                      </ButtonLink>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {activity.contact_name || activity.contact_email ? (
                    <div className="text-sm text-slate-600 space-y-1">
                      {activity.contact_name ? (
                        <p className="font-medium text-deep-slate">{activity.contact_name}</p>
                      ) : null}
                      {activity.contact_email ? (
                        <a
                          href={`mailto:${activity.contact_email}`}
                          className="text-sage-600 hover:underline"
                        >
                          {activity.contact_email}
                        </a>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      {language === 'es'
                        ? 'Contacte al centro para más información.'
                        : language === 'pt'
                          ? 'Entre em contato com o centro para mais informações.'
                          : 'Contact the center for more information.'}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {hostingCenter ? (
                      <ButtonLink to={`/activities/centers/${hostingCenter.id}`} variant="primary">
                        {copy.visitCenter}
                      </ButtonLink>
                    ) : null}
                    <ButtonLink to="/contact" variant="outline">
                      {copy.contactForInfo}
                    </ButtonLink>
                  </div>
                </>
              )}
            </div>
          ) : null}

          {/* ─── Activity-level downloads ─────────────────────────────────── */}
          {!isLoading && eventMaterials.length > 0 ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sage-600 mb-4">
                {copy.eventDownloads}
              </p>
              <div className="space-y-3">
                {eventMaterials.map((m) => (
                  <a
                    key={m.id}
                    href={m.download_url ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-sanctuary-50"
                  >
                    <div>
                      <p className="font-semibold text-deep-slate">{m.title}</p>
                      {m.description ? (
                        <p className="mt-1 text-sm text-slate-500">{m.description}</p>
                      ) : null}
                    </div>
                    <span className="text-sm font-semibold text-sage-700">{copy.download}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="pt-4 pb-2">
            <Link
              to="/activities"
              className="text-sm text-slate-500 hover:text-sage-600 transition-colors underline"
            >
              ← {copy.backToActivities}
            </Link>
          </div>
        </div>
      </Section>
    </div>
  )
}
