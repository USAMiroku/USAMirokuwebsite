import { useEffect, useMemo, useState } from 'react'
import { ButtonLink } from '../components/ButtonLink'
import { Section } from '../components/Section'
import { siteConfig } from '../config/siteConfig'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { supabase } from '../learning/lib/supabaseClient'
import { useManagedCenters } from '../organization/centers'

type EventType = 'event' | 'study_session' | 'class' | 'self_study'

type PublicEvent = {
  id: string
  type: EventType
  title: string
  description: string | null
  center_id: string | null
  show_on_main_events?: boolean | null
}

type EventSession = {
  id: string
  activity_id: string
  start_time: string | null
  end_time: string | null
  location: string | null
  seats_total: number | null
}

const TYPE_OPTIONS: EventType[] = ['event', 'study_session', 'class', 'self_study']

function formatTypeLabel(type: EventType, language: 'en' | 'es' | 'pt') {
  if (language === 'es') {
    return {
      event: 'Evento especial',
      study_session: 'Sesion de estudio',
      class: 'Clase',
      self_study: 'Descarga',
    }[type]
  }

  if (language === 'pt') {
    return {
      event: 'Evento especial',
      study_session: 'Sessao de estudo',
      class: 'Aula',
      self_study: 'Download',
    }[type]
  }

  return {
    event: 'Special event',
    study_session: 'Study session',
    class: 'Class',
    self_study: 'Download',
  }[type]
}

function formatDate(iso: string | null, language: 'en' | 'es' | 'pt') {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null

  const locale = language === 'es' ? 'es-US' : language === 'pt' ? 'pt-BR' : 'en-US'
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function getFirstSession(eventId: string, sessions: EventSession[]) {
  return sessions.find((session) => session.activity_id === eventId) ?? null
}

export default function Events() {
  const { t, language } = useTranslation()
  const { activeCenters } = useManagedCenters()
  const [events, setEvents] = useState<PublicEvent[]>([])
  const [sessions, setSessions] = useState<EventSession[]>([])
  const [selectedCenterId, setSelectedCenterId] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const copy =
    language === 'es'
      ? {
          eyebrow: 'Eventos',
          title: 'Servicios, estudio y encuentros publicos.',
          intro: 'Explore eventos publicados por la sede, centros y grupos. Algunos eventos aparecen aqui; otros se muestran solo en la pagina del centro o grupo correspondiente.',
          locationLabel: 'Ubicacion',
          allLocations: 'Todas las ubicaciones',
          typeLabel: 'Tipo',
          allTypes: 'Todos los tipos',
          clearFilters: 'Limpiar filtros',
          viewDetails: 'Ver detalles y contacto',
          learnMore: 'Mas informacion',
          when: 'Cuando',
          where: 'Donde',
          center: 'Centro o grupo',
          contactTitle: 'Inscripcion con orientacion',
          contactBody: 'Contacte al centro o grupo directamente para recibir orientacion sobre este evento.',
          noDate: 'Fecha por anunciar',
          noLocation: 'Ubicacion por anunciar',
          noEvents: 'No hay eventos publicados para estos filtros.',
          loading: 'Cargando eventos',
          notConfigured: 'Los eventos aun no estan configurados. Agregue las variables de Supabase para activar el calendario.',
        }
      : language === 'pt'
        ? {
            eyebrow: 'Eventos',
            title: 'Cultos, estudo e encontros publicos.',
            intro: 'Explore eventos publicados pela sede, centros e grupos. Alguns eventos aparecem aqui; outros aparecem somente na pagina do centro ou grupo correspondente.',
            locationLabel: 'Local',
            allLocations: 'Todos os locais',
            typeLabel: 'Tipo',
            allTypes: 'Todos os tipos',
            clearFilters: 'Limpar filtros',
            viewDetails: 'Ver detalhes e contato',
            learnMore: 'Saiba mais',
            when: 'Quando',
            where: 'Onde',
            center: 'Centro ou grupo',
            contactTitle: 'Inscricao com orientacao',
            contactBody: 'Entre em contato diretamente com o centro ou grupo para receber orientacao sobre este evento.',
            noDate: 'Data a ser anunciada',
            noLocation: 'Local a ser anunciado',
            noEvents: 'Nenhum evento publicado para estes filtros.',
            loading: 'Carregando eventos',
            notConfigured: 'Os eventos ainda nao estao configurados. Adicione as variaveis do Supabase para ativar o calendario.',
          }
        : {
            eyebrow: 'Events',
            title: 'Services, study, and public gatherings.',
            intro: 'Explore events published by headquarters, centers, and groups. Some events appear here; others are shown only on their center or group page.',
            locationLabel: 'Location',
            allLocations: 'All locations',
            typeLabel: 'Type',
            allTypes: 'All event types',
            clearFilters: 'Clear filters',
            viewDetails: 'View details & contact',
            learnMore: 'Learn more',
            when: 'When',
            where: 'Where',
            center: 'Center or group',
            contactTitle: 'Contact-assisted enrollment',
            contactBody: 'Contact the center or group directly to receive guidance for this event.',
            noDate: 'Date to be announced',
            noLocation: 'Location to be announced',
            noEvents: 'No published events match these filters.',
            loading: 'Loading events',
            notConfigured: 'Events are not configured yet. Add Supabase environment variables to enable the calendar.',
          }

  usePageMeta({
    title: `${t.events.title} | ${siteConfig.organizationName}`,
    description:
      'Upcoming events, monthly appreciation services, study sessions, and center gatherings at Miroku Association USA / World Messianic Church of America.',
  })

  useEffect(() => {
    async function loadEvents() {
      if (!supabase) {
        setError(copy.notConfigured)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      const { data: eventData, error: eventError } = await supabase
        .from('learning_activities')
        .select('id,type,title,description,center_id,show_on_main_events')
        .eq('show_on_main_events', true)
        .order('created_at', { ascending: false })
        .limit(100)

      let publicEvents = (eventData ?? []) as PublicEvent[]

      if (eventError && eventError.message.includes('show_on_main_events')) {
        const { data: fallbackEventData, error: fallbackEventError } = await supabase
          .from('learning_activities')
          .select('id,type,title,description,center_id')
          .order('created_at', { ascending: false })
          .limit(100)

        if (fallbackEventError) {
          setError(fallbackEventError.message)
          setIsLoading(false)
          return
        }

        publicEvents = ((fallbackEventData ?? []) as PublicEvent[]).map((event) => ({
          ...event,
          show_on_main_events: true,
        }))
      } else if (eventError) {
        setError(eventError.message)
        setIsLoading(false)
        return
      }

      setEvents(publicEvents)

      const eventIds = publicEvents.map((event) => event.id)
      if (eventIds.length === 0) {
        setSessions([])
        setIsLoading(false)
        return
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from('learning_sessions')
        .select('id,activity_id,start_time,end_time,location,seats_total')
        .in('activity_id', eventIds)
        .order('start_time', { ascending: true })

      if (sessionError) {
        setError(sessionError.message)
        setIsLoading(false)
        return
      }

      setSessions((sessionData ?? []) as EventSession[])
      setIsLoading(false)
    }

    void loadEvents()
  }, [copy.notConfigured])

  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCenter = !selectedCenterId || event.center_id === selectedCenterId
      const matchesType = !selectedType || event.type === selectedType
      return matchesCenter && matchesType
    })
  }, [events, selectedCenterId, selectedType])

  const selectedEvent = selectedEventId ? events.find((event) => event.id === selectedEventId) ?? null : null
  const selectedSession = selectedEvent ? getFirstSession(selectedEvent.id, sessions) : null
  const selectedCenter = selectedEvent?.center_id ? activeCenters.find((center) => center.id === selectedEvent.center_id) : null
  const hasFilters = selectedCenterId !== '' || selectedType !== ''

  function clearFilters() {
    setSelectedCenterId('')
    setSelectedType('')
  }

  return (
    <div className="relative min-h-screen bg-white text-deep-slate">
      <section className="public-hero">
        <div className="public-hero-grid">
          <div className="public-hero-copy">
            <p className="public-eyebrow">{copy.eyebrow}</p>
            <h1 className="public-title">{copy.title}</h1>
            <p className="public-body">{copy.intro}</p>
          </div>

          <div className="public-hero-note">
            <p className="public-eyebrow">{copy.center}</p>
            <p className="mt-4">
              {activeCenters.length} {copy.locationLabel.toLowerCase()}s
            </p>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 rounded-lg border border-[rgba(15,23,42,0.08)] bg-[#fbf7ef] p-4 md:flex md:items-end md:justify-between md:gap-4">
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              <label>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.locationLabel}</span>
                <select
                  value={selectedCenterId}
                  onChange={(event) => setSelectedCenterId(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-[rgba(15,23,42,0.12)] bg-white px-3 text-sm text-deep-slate outline-none focus:border-sage-600"
                >
                  <option value="">{copy.allLocations}</option>
                  {activeCenters.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.typeLabel}</span>
                <select
                  value={selectedType}
                  onChange={(event) => setSelectedType(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-[rgba(15,23,42,0.12)] bg-white px-3 text-sm text-deep-slate outline-none focus:border-sage-600"
                >
                  <option value="">{copy.allTypes}</option>
                  {TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {formatTypeLabel(type, language)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg border border-[rgba(15,23,42,0.12)] bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-deep-slate transition hover:bg-sage-mist disabled:cursor-not-allowed disabled:opacity-50 md:mt-0 md:w-auto"
            >
              {copy.clearFilters}
            </button>
          </div>

          {isLoading ? (
            <div className="rounded-lg border border-[rgba(15,23,42,0.08)] bg-white px-6 py-10 text-center text-slate-600">
              {copy.loading}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
          ) : null}

          {!isLoading && !error && visibleEvents.length === 0 ? (
            <div className="rounded-lg border border-[rgba(15,23,42,0.08)] bg-white px-6 py-10 text-center text-slate-600">
              {copy.noEvents}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {visibleEvents.map((event) => {
              const session = getFirstSession(event.id, sessions)
              const center = event.center_id ? activeCenters.find((item) => item.id === event.center_id) : null
              return (
                <article
                  key={event.id}
                  className="rounded-lg border border-[rgba(15,23,42,0.08)] bg-white p-6 shadow-none"
                >
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-600">
                    <span>{formatTypeLabel(event.type, language)}</span>
                    <span aria-hidden="true">/</span>
                    <span>{formatDate(session?.start_time ?? null, language) ?? copy.noDate}</span>
                  </div>
                  <h2 className="mt-3 text-3xl font-serif leading-tight text-deep-slate">{event.title}</h2>
                  {center ? <p className="mt-2 text-sm font-medium text-slate-500">{center.name}</p> : null}
                  {event.description ? (
                    <p className="mt-4 text-sm leading-7 text-slate-600">{event.description}</p>
                  ) : null}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedEventId(event.id)}
                      className="inline-flex h-11 items-center justify-center rounded-lg bg-deep-slate px-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#14202a]"
                    >
                      {copy.viewDetails}
                    </button>
                    <ButtonLink to={`/events/${event.id}`} variant="outline">
                      {copy.learnMore}
                    </ButtonLink>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </Section>

      {selectedEvent ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-dialog-title"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-600">
                  {formatTypeLabel(selectedEvent.type, language)}
                </p>
                <h2 id="event-dialog-title" className="mt-2 text-3xl font-serif text-deep-slate">
                  {selectedEvent.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEventId(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl leading-none text-slate-500 transition hover:bg-slate-50"
                aria-label="Close"
              >
                x
              </button>
            </div>

            <dl className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-[rgba(15,23,42,0.08)] bg-[#fbf7ef] p-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{copy.when}</dt>
                <dd className="mt-2 text-sm text-deep-slate">
                  {formatDate(selectedSession?.start_time ?? null, language) ?? copy.noDate}
                </dd>
              </div>
              <div className="rounded-lg border border-[rgba(15,23,42,0.08)] bg-[#fbf7ef] p-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{copy.where}</dt>
                <dd className="mt-2 text-sm text-deep-slate">
                  {selectedSession?.location ?? selectedCenter?.name ?? copy.noLocation}
                </dd>
              </div>
            </dl>

            {selectedEvent.description ? (
              <p className="mt-6 text-sm leading-7 text-slate-600">{selectedEvent.description}</p>
            ) : null}

            <div className="mt-8 rounded-lg border border-[rgba(15,23,42,0.08)] bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-600">{copy.contactTitle}</p>
              <h3 className="mt-2 text-2xl font-serif text-deep-slate">{copy.contactTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{copy.contactBody}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {selectedCenter ? (
                  <ButtonLink to={`/locations/${selectedCenter.id}`} variant="primary">
                    {selectedCenter.name}
                  </ButtonLink>
                ) : null}
                <ButtonLink to="/contact" variant="outline">
                  Contact
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
