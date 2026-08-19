import { useMemo, useState } from 'react'
import { annualCalendar2026, annualCalendarSourceNote, type AnnualCalendarEvent, type AnnualEventCategory } from '../../data/annualCalendar2026'
import type { Language } from '../../types'

const categoryStyles: Record<AnnualEventCategory, string> = {
  service: 'border-amber-200 bg-amber-50 text-amber-900', class: 'border-sage-200 bg-sage-50 text-sage-800',
  seminar: 'border-violet-200 bg-violet-50 text-violet-900', meeting: 'border-sky-200 bg-sky-50 text-sky-900',
  art: 'border-rose-200 bg-rose-50 text-rose-900', pilgrimage: 'border-orange-200 bg-orange-50 text-orange-900',
}

const copyByLanguage = {
  en: { title: '2026 Annual Events Calendar', intro: 'Explore the approved annual schedule of services, classes, seminars, meetings, art activities, and pilgrimage.', next: 'Next scheduled event', calendar: 'Calendar', agenda: 'Agenda', search: 'Search events', all: 'All categories', today: 'Current month', previous: 'Previous month', following: 'Next month', time: 'Time', place: 'Place', presenter: 'Presenter', details: 'Event details', noResults: 'No events match these filters.', scheduleNote: 'Times are shown exactly as provided. The source does not specify a time zone; please confirm details with the organization.', confirmation: 'Date needs confirmation', sourceSays: 'The source cell says', approved: 'Approved annual schedule', live: 'Live and newly added events', liveBody: 'These current listings come from the website’s event-management system and may include registrations, materials, or updates.', categories: { service: 'Services', class: 'Classes', seminar: 'Seminars', meeting: 'Meetings', art: 'Art', pilgrimage: 'Pilgrimage' } },
  es: { title: 'Calendario Anual de Eventos 2026', intro: 'Explore el programa anual aprobado de servicios, clases, seminarios, reuniones, actividades artísticas y peregrinación.', next: 'Próximo evento programado', calendar: 'Calendario', agenda: 'Agenda', search: 'Buscar eventos', all: 'Todas las categorías', today: 'Mes actual', previous: 'Mes anterior', following: 'Mes siguiente', time: 'Hora', place: 'Lugar', presenter: 'Presentador', details: 'Detalles del evento', noResults: 'Ningún evento coincide con estos filtros.', scheduleNote: 'Los horarios se muestran exactamente como fueron proporcionados. La fuente no especifica zona horaria; confirme los detalles con la organización.', confirmation: 'La fecha requiere confirmación', sourceSays: 'La celda de origen dice', approved: 'Programa anual aprobado', live: 'Eventos actuales y recién agregados', liveBody: 'Estos listados actuales provienen del sistema de gestión de eventos del sitio y pueden incluir inscripciones, materiales o actualizaciones.', categories: { service: 'Servicios', class: 'Clases', seminar: 'Seminarios', meeting: 'Reuniones', art: 'Arte', pilgrimage: 'Peregrinación' } },
  pt: { title: 'Calendário Anual de Eventos 2026', intro: 'Explore a programação anual aprovada de cultos, aulas, seminários, reuniões, atividades artísticas e peregrinação.', next: 'Próximo evento programado', calendar: 'Calendário', agenda: 'Agenda', search: 'Buscar eventos', all: 'Todas as categorias', today: 'Mês atual', previous: 'Mês anterior', following: 'Próximo mês', time: 'Horário', place: 'Local', presenter: 'Apresentador', details: 'Detalhes do evento', noResults: 'Nenhum evento corresponde a estes filtros.', scheduleNote: 'Os horários são exibidos exatamente como fornecidos. A fonte não informa o fuso horário; confirme os detalhes com a organização.', confirmation: 'A data precisa de confirmação', sourceSays: 'A célula de origem informa', approved: 'Programação anual aprovada', live: 'Eventos atuais e recém-adicionados', liveBody: 'Estas listagens atuais vêm do sistema de gerenciamento de eventos do site e podem incluir inscrições, materiais ou atualizações.', categories: { service: 'Cultos', class: 'Aulas', seminar: 'Seminários', meeting: 'Reuniões', art: 'Arte', pilgrimage: 'Peregrinação' } },
} as const

function localDate(value: string) { return new Date(`${value}T12:00:00`) }
function formatDate(event: AnnualCalendarEvent, language: Language) {
  const locale = language === 'es' ? 'es-US' : language === 'pt' ? 'pt-BR' : 'en-US'
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }
  const start = new Intl.DateTimeFormat(locale, options).format(localDate(event.startDate))
  if (!event.endDate) return start
  return `${start} – ${new Intl.DateTimeFormat(locale, options).format(localDate(event.endDate))}`
}

function EventDetails({ event, language }: { event: AnnualCalendarEvent; language: Language }) {
  const copy = copyByLanguage[language]
  return <div className="space-y-3 text-sm leading-6 text-slate-600">
    <p className="font-semibold text-deep-slate">{formatDate(event, language)}</p>
    <p><span className="font-semibold text-deep-slate">{copy.time}:</span> {event.time}</p>
    {event.location ? <p><span className="font-semibold text-deep-slate">{copy.place}:</span> {event.location === 'Zoom' ? 'Zoom' : 'Miroku Association USA Headquarters'}</p> : null}
    {event.presenter ? <p><span className="font-semibold text-deep-slate">{copy.presenter}:</span> {event.presenter}</p> : null}
    {event.dateNeedsConfirmation ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-medium text-amber-900">{copy.confirmation}. {copy.sourceSays}: {event.sourceDate}.</p> : null}
  </div>
}

export function AnnualEventsCalendar({ language }: { language: Language }) {
  const now = new Date()
  const initialMonth = now.getFullYear() === 2026 ? now.getMonth() : 0
  const [month, setMonth] = useState(initialMonth)
  const [view, setView] = useState<'calendar' | 'agenda'>('calendar')
  const [category, setCategory] = useState<'all' | AnnualEventCategory>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const copy = copyByLanguage[language]
  const locale = language === 'es' ? 'es-US' : language === 'pt' ? 'pt-BR' : 'en-US'
  const categories = Object.keys(copy.categories) as AnnualEventCategory[]
  const filtered = useMemo(() => annualCalendar2026.filter((event) => (category === 'all' || event.category === category) && event.title.toLowerCase().includes(query.trim().toLowerCase())), [category, query])
  const monthEvents = filtered.filter((event) => localDate(event.startDate).getMonth() === month || (event.endDate && localDate(event.endDate).getMonth() === month))
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const nextEvent = annualCalendar2026.find((event) => localDate(event.endDate ?? event.startDate).getTime() >= todayStart)
  const selected = annualCalendar2026.find((event) => event.id === selectedId)
  const firstDay = new Date(2026, month, 1).getDay()
  const daysInMonth = new Date(2026, month + 1, 0).getDate()
  const monthName = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(2026, month, 1))
  const weekdayNames = Array.from({ length: 7 }, (_, day) => new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2026, 0, 4 + day)))

  return <section aria-labelledby="annual-calendar-title" className="space-y-8">
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div><p className="text-[10px] font-bold uppercase tracking-[0.35em] text-sage-600">{copy.approved}</p><h2 id="annual-calendar-title" className="mt-3 text-4xl font-serif md:text-5xl">{copy.title}</h2><p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{copy.intro}</p></div>
      {nextEvent ? <div className="rounded-3xl bg-[#294341] p-7 text-white"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/60">{copy.next}</p><p className="mt-3 text-2xl font-serif">{nextEvent.title}</p><p className="mt-3 text-sm text-white/75">{formatDate(nextEvent, language)} · {nextEvent.time}</p></div> : null}
    </div>

    <div className="rounded-3xl border border-[rgba(184,134,11,0.16)] bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex w-fit rounded-full bg-sanctuary-100 p-1" aria-label="Calendar view">
          {(['calendar', 'agenda'] as const).map((value) => <button key={value} type="button" onClick={() => setView(value)} aria-pressed={view === value} className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider ${view === value ? 'bg-[#294341] text-white' : 'text-slate-600'}`}>{copy[value]}</button>)}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="event-search">{copy.search}</label><input id="event-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} className="h-11 rounded-full border border-slate-200 px-5 text-sm outline-none focus:border-sage-600" />
          <label className="sr-only" htmlFor="event-category">{copy.all}</label><select id="event-category" value={category} onChange={(event) => setCategory(event.target.value as typeof category)} className="h-11 rounded-full border border-slate-200 bg-white px-5 text-sm outline-none focus:border-sage-600"><option value="all">{copy.all}</option>{categories.map((item) => <option key={item} value={item}>{copy.categories[item]}</option>)}</select>
        </div>
      </div>

      {view === 'calendar' ? <div className="mt-7">
        <div className="flex items-center justify-between gap-3"><button type="button" disabled={month === 0} onClick={() => setMonth((value) => Math.max(0, value - 1))} className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-35" aria-label={copy.previous}>←</button><div className="text-center"><h3 className="text-2xl font-serif capitalize">{monthName}</h3><button type="button" onClick={() => setMonth(initialMonth)} className="mt-1 text-[10px] font-bold uppercase tracking-wider text-sage-600">{copy.today}</button></div><button type="button" disabled={month === 11} onClick={() => setMonth((value) => Math.min(11, value + 1))} className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-35" aria-label={copy.following}>→</button></div>
        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-slate-400">{weekdayNames.map((day, index) => <div key={`${day}-${index}`} className="py-2">{day}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">{Array.from({ length: firstDay }, (_, index) => <div key={`blank-${index}`} className="min-h-20 rounded-xl bg-slate-50/60" />)}{Array.from({ length: daysInMonth }, (_, index) => { const day = index + 1; const events = monthEvents.filter((event) => { const start = localDate(event.startDate); const end = localDate(event.endDate ?? event.startDate); const current = new Date(2026, month, day, 12); return current >= start && current <= end }); return <div key={day} className="min-h-20 rounded-xl border border-slate-100 p-1.5 sm:min-h-28 sm:p-2"><span className="text-xs font-semibold text-slate-500">{day}</span><div className="mt-1 space-y-1">{events.map((event) => <button key={event.id} type="button" onClick={() => setSelectedId(event.id)} className={`block w-full rounded-lg border px-1.5 py-1 text-left text-[9px] font-semibold leading-tight focus:outline-none focus:ring-2 focus:ring-sage-600 ${categoryStyles[event.category]}`} title={event.title}><span className="sm:hidden" aria-hidden="true">•</span><span className="hidden sm:block">{event.title}</span><span className="sr-only sm:hidden">{event.title}</span></button>)}</div></div>})}</div>
        {monthEvents.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">{copy.noResults}</p> : null}
        {selected ? <div aria-live="polite" className="mt-5 rounded-2xl bg-sanctuary-100 p-6"><p className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${categoryStyles[selected.category]}`}>{copy.categories[selected.category]}</p><h4 className="mt-3 text-2xl font-serif">{selected.title}</h4><div className="mt-4"><EventDetails event={selected} language={language} /></div></div> : null}
      </div> : <div className="mt-7 space-y-4">{filtered.length ? filtered.map((event) => <details key={event.id} className="group rounded-2xl border border-slate-100 bg-white p-5 open:bg-sanctuary-50"><summary className="cursor-pointer list-none"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${categoryStyles[event.category]}`}>{copy.categories[event.category]}</span><h3 className="mt-3 text-xl font-serif">{event.title}</h3></div><p className="shrink-0 text-sm font-semibold text-sage-700">{formatDate(event, language)}</p></div><span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 group-open:hidden">{copy.details} +</span></summary><div className="mt-4 border-t border-slate-100 pt-4"><EventDetails event={event} language={language} /></div></details>) : <p className="py-10 text-center text-sm text-slate-500">{copy.noResults}</p>}</div>}
    </div>
    <div className="grid gap-3 text-sm leading-7 text-slate-600 md:grid-cols-2"><p className="rounded-2xl bg-amber-50 p-5">{annualCalendarSourceNote}</p><p className="rounded-2xl bg-slate-50 p-5">{copy.scheduleNote}</p></div>
    <div><p className="text-[10px] font-bold uppercase tracking-[0.35em] text-sage-600">{copy.live}</p><h2 className="mt-3 text-3xl font-serif">{copy.live}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{copy.liveBody}</p></div>
  </section>
}
