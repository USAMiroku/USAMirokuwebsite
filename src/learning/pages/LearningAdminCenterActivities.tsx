import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'
import { LearningAdminToolbar } from '../components/LearningAdminToolbar'
import { RequireAdmin } from '../components/LearningRouteGuards'
import { useLearningAuth } from '../context/LearningAuthContext'
import { useManagedCenters } from '../../organization/centers'

type Activity = {
  id: string
  type: string
  title: string
  description: string | null
  center_id: string | null
  show_on_main_events: boolean | null
  is_published: boolean | null
  image_url: string | null
  contact_name: string | null
  contact_email: string | null
  registration_required: boolean | null
  registration_url: string | null
  created_at: string
}

type Session = {
  id: string
  activity_id: string
  start_time: string | null
  end_time: string | null
  meeting_url: string | null
  location: string | null
  seats_total: number | null
}

const ACTIVITY_TYPES = ['event', 'study_session', 'class', 'self_study'] as const

function formatEventTypeLabel(value: string) {
  switch (value) {
    case 'event':
      return 'Special Event / Service'
    case 'study_session':
      return 'Study Session'
    case 'class':
      return 'Class'
    case 'self_study':
      return 'Download / Resource'
    default:
      return value.replace('_', ' ')
  }
}

function isoToDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function datetimeLocalToISO(local: string): string | null {
  if (!local) return null
  const d = new Date(local)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

function formatSessionLabel(s: Session): string {
  if (!s.start_time) return 'Date TBD'
  const d = new Date(s.start_time)
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${date} at ${time}`
}

const FIELD_CLASS =
  'mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100'
const LABEL_CLASS = 'text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500'
const SECTION_TITLE = 'text-xs font-bold uppercase tracking-[0.22em] text-sage-600 mb-4 mt-8 border-b border-[rgba(184,134,11,0.18)] pb-2'

export default function LearningAdminCenterActivities() {
  usePageMeta({
    title: 'Admin | Activities',
    description: 'Manage public activities and activity pages per Johrei center.',
  })

  return (
    <RequireAdmin>
      <AdminCenterActivitiesInner />
    </RequireAdmin>
  )
}

function AdminCenterActivitiesInner() {
  const { role, managedCenterId, isSuperAdmin } = useLearningAuth()
  const { activeCenters } = useManagedCenters()
  const [activities, setActivities] = useState<Activity[]>([])
  const [sessionsByActivity, setSessionsByActivity] = useState<Record<string, Session[]>>({})
  const [selectedCenterId, setSelectedCenterId] = useState<string>(managedCenterId ?? '')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)

  // ─── Edit activity state ─────────────────────────────────────────────────
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editType, setEditType] = useState<string>('event')
  const [editCenterId, setEditCenterId] = useState<string>('')
  const [editShowOnMainEvents, setEditShowOnMainEvents] = useState(true)
  const [editIsPublished, setEditIsPublished] = useState(true)
  const [toggleSavedField, setToggleSavedField] = useState<string | null>(null)
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editContactName, setEditContactName] = useState('')
  const [editContactEmail, setEditContactEmail] = useState('')
  const [editRegistrationRequired, setEditRegistrationRequired] = useState(false)
  const [editRegistrationUrl, setEditRegistrationUrl] = useState('')

  // ─── Add activity state ──────────────────────────────────────────────────
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<string>('event')
  const [newCenterId, setNewCenterId] = useState<string>('')

  // ─── Session management state ────────────────────────────────────────────
  const [editingActivitySessions, setEditingActivitySessions] = useState<Session[]>([])
  const [sessionDraftMode, setSessionDraftMode] = useState<'add' | 'edit' | null>(null)
  const [sessionDraftId, setSessionDraftId] = useState<string | null>(null)
  const [sessionDraftStart, setSessionDraftStart] = useState('')
  const [sessionDraftEnd, setSessionDraftEnd] = useState('')
  const [sessionDraftLocation, setSessionDraftLocation] = useState('')
  const [sessionDraftMeetingUrl, setSessionDraftMeetingUrl] = useState('')
  const [sessionDraftSeats, setSessionDraftSeats] = useState('')

  const centers = activeCenters

  useEffect(() => {
    if (managedCenterId) {
      setSelectedCenterId(managedCenterId)
      setNewCenterId(managedCenterId)
    }
  }, [managedCenterId])

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError('Learning app is not configured.')
        return
      }
      setIsLoading(true)
      setError(null)

      const FULL_SELECT =
        'id,type,title,description,center_id,show_on_main_events,is_published,image_url,contact_name,contact_email,registration_required,registration_url,created_at'
      const BASE_SELECT = 'id,type,title,description,center_id,show_on_main_events,created_at'

      let query = supabase
        .from('learning_activities')
        .select(FULL_SELECT)
        .order('created_at', { ascending: false })
        .limit(100)

      if (!isSuperAdmin && managedCenterId) {
        query = query.eq('center_id', managedCenterId)
      }

      let { data: activitiesData, error: activitiesError } = await query

      // Graceful fallback if new columns don't exist yet
      if (activitiesError) {
        let fallbackQuery = supabase
          .from('learning_activities')
          .select(BASE_SELECT)
          .order('created_at', { ascending: false })
          .limit(100)

        if (!isSuperAdmin && managedCenterId) {
          fallbackQuery = fallbackQuery.eq('center_id', managedCenterId)
        }

        const fallback = await fallbackQuery
        activitiesData = fallback.data as typeof activitiesData
        activitiesError = fallback.error
      }

      if (activitiesError) {
        setError(activitiesError.message)
        return
      }

      const acts = ((activitiesData ?? []) as Partial<Activity>[]).map((a) => ({
        id: a.id ?? '',
        type: a.type ?? 'event',
        title: a.title ?? '',
        description: a.description ?? null,
        center_id: a.center_id ?? null,
        show_on_main_events: a.show_on_main_events ?? true,
        is_published: a.is_published ?? true,
        image_url: a.image_url ?? null,
        contact_name: a.contact_name ?? null,
        contact_email: a.contact_email ?? null,
        registration_required: a.registration_required ?? false,
        registration_url: a.registration_url ?? null,
        created_at: a.created_at ?? '',
      })) as Activity[]

      setActivities(acts)

      const activityIds = acts.map((a) => a.id)
      if (activityIds.length > 0) {
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('learning_sessions')
          .select('id,activity_id,start_time,end_time,meeting_url,location,seats_total')
          .in('activity_id', activityIds)
          .order('start_time', { ascending: true })

        if (!sessionsError && sessionsData) {
          const byActivity = (sessionsData as Session[]).reduce<Record<string, Session[]>>((acc, s) => {
            if (!acc[s.activity_id]) acc[s.activity_id] = []
            acc[s.activity_id].push(s)
            return acc
          }, {})
          setSessionsByActivity(byActivity)
        }
      }
    }

    void load().finally(() => setIsLoading(false))
  }, [isSuperAdmin, managedCenterId])

  const filteredActivities =
    selectedCenterId === ''
      ? activities
      : activities.filter((a) => (a.center_id ?? '') === selectedCenterId)

  // ─── Open edit form ──────────────────────────────────────────────────────
  function openEdit(activity: Activity) {
    setEditingActivity(activity)
    setEditTitle(activity.title)
    setEditDescription(activity.description ?? '')
    setEditType(activity.type)
    setEditCenterId(activity.center_id ?? '')
    setEditShowOnMainEvents(activity.show_on_main_events !== false)
    setEditIsPublished(activity.is_published !== false)
    setEditImageUrl(activity.image_url ?? '')
    setEditContactName(activity.contact_name ?? '')
    setEditContactEmail(activity.contact_email ?? '')
    setEditRegistrationRequired(activity.registration_required === true)
    setEditRegistrationUrl(activity.registration_url ?? '')
    setEditingActivitySessions(sessionsByActivity[activity.id] ?? [])
    setSessionDraftMode(null)
    setShowAddActivity(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ─── Instant toggle save (Published / Show on main) ─────────────────────
  async function handleToggleSave(field: 'is_published' | 'show_on_main_events', value: boolean) {
    if (!supabase || !editingActivity) return
    if (field === 'is_published') setEditIsPublished(value)
    else setEditShowOnMainEvents(value)

    const { error: toggleError } = await supabase
      .from('learning_activities')
      .update({ [field]: value })
      .eq('id', editingActivity.id)

    if (toggleError) {
      setError(toggleError.message)
      return
    }

    // Update the activity in the local list immediately
    setActivities((prev) =>
      prev.map((a) => (a.id === editingActivity.id ? { ...a, [field]: value } : a)),
    )

    // Brief "Saved" feedback
    setToggleSavedField(field)
    setTimeout(() => setToggleSavedField(null), 2000)
  }

  // ─── Save edited activity ────────────────────────────────────────────────
  async function handleSaveEdit() {
    if (!supabase || !editingActivity) return
    const { error: updateError } = await supabase
      .from('learning_activities')
      .update({
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        type: editType,
        center_id: (isSuperAdmin ? editCenterId : managedCenterId) || null,
        show_on_main_events: editShowOnMainEvents,
        is_published: editIsPublished,
        image_url: editImageUrl.trim() || null,
        contact_name: editContactName.trim() || null,
        contact_email: editContactEmail.trim() || null,
        registration_required: editRegistrationRequired,
        registration_url: editRegistrationUrl.trim() || null,
      })
      .eq('id', editingActivity.id)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setActivities((prev) =>
      prev.map((a) =>
        a.id === editingActivity.id
          ? {
              ...a,
              title: editTitle.trim(),
              description: editDescription.trim() || null,
              type: editType,
              center_id: (isSuperAdmin ? editCenterId : managedCenterId) || null,
              show_on_main_events: editShowOnMainEvents,
              is_published: editIsPublished,
              image_url: editImageUrl.trim() || null,
              contact_name: editContactName.trim() || null,
              contact_email: editContactEmail.trim() || null,
              registration_required: editRegistrationRequired,
              registration_url: editRegistrationUrl.trim() || null,
            }
          : a,
      ),
    )
    setEditingActivity(null)
  }

  // ─── Add new activity (minimal) ──────────────────────────────────────────
  async function handleAddActivity() {
    if (!supabase || !newTitle.trim()) return
    const { data, error: insertError } = await supabase
      .from('learning_activities')
      .insert({
        type: newType,
        title: newTitle.trim(),
        description: null,
        center_id: (isSuperAdmin ? newCenterId : managedCenterId) || null,
        show_on_main_events: true,
        is_published: false, // start as draft
      })
      .select(
        'id,type,title,description,center_id,show_on_main_events,is_published,image_url,contact_name,contact_email,registration_required,registration_url,created_at',
      )
      .single()

    if (insertError) {
      setError(insertError.message)
      return
    }

    const newActivity = {
      ...(data as Partial<Activity>),
      is_published: false,
      image_url: null,
      contact_name: null,
      contact_email: null,
      registration_required: false,
      registration_url: null,
    } as Activity

    setActivities((prev) => [newActivity, ...prev])
    setShowAddActivity(false)
    setNewTitle('')
    setNewType('event')
    setNewCenterId('')
    // Immediately open edit so admin can fill in details
    openEdit(newActivity)
  }

  // ─── Delete activity ─────────────────────────────────────────────────────
  async function handleDeleteActivity(activity: Activity) {
    if (!supabase) return
    if (!window.confirm(`Delete "${activity.title}" and all its sessions?`)) return
    const { error: deleteError } = await supabase.from('learning_activities').delete().eq('id', activity.id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    setActivities((prev) => prev.filter((a) => a.id !== activity.id))
    if (editingActivity?.id === activity.id) setEditingActivity(null)
  }

  // ─── Session management ──────────────────────────────────────────────────
  function openSessionAdd() {
    setSessionDraftId(null)
    setSessionDraftMode('add')
    setSessionDraftStart('')
    setSessionDraftEnd('')
    setSessionDraftLocation('')
    setSessionDraftMeetingUrl('')
    setSessionDraftSeats('')
  }

  function openSessionEdit(s: Session) {
    setSessionDraftId(s.id)
    setSessionDraftMode('edit')
    setSessionDraftStart(isoToDatetimeLocal(s.start_time))
    setSessionDraftEnd(isoToDatetimeLocal(s.end_time))
    setSessionDraftLocation(s.location ?? '')
    setSessionDraftMeetingUrl(s.meeting_url ?? '')
    setSessionDraftSeats(s.seats_total !== null ? String(s.seats_total) : '')
  }

  async function handleSaveSessionDraft() {
    if (!supabase || !editingActivity) return
    setSessionError(null)

    const payload = {
      start_time: datetimeLocalToISO(sessionDraftStart),
      end_time: datetimeLocalToISO(sessionDraftEnd),
      location: sessionDraftLocation.trim() || null,
      meeting_url: sessionDraftMeetingUrl.trim() || null,
      seats_total: sessionDraftSeats ? parseInt(sessionDraftSeats, 10) : null,
    }

    if (sessionDraftMode === 'add') {
      const { data, error: insertErr } = await supabase
        .from('learning_sessions')
        .insert({ ...payload, activity_id: editingActivity.id })
        .select('id,activity_id,start_time,end_time,meeting_url,location,seats_total')
        .single()

      if (insertErr) {
        setSessionError(insertErr.message)
        return
      }

      const added = data as Session
      const sorted = [...editingActivitySessions, added].sort((a, b) =>
        (a.start_time ?? '').localeCompare(b.start_time ?? ''),
      )
      setEditingActivitySessions(sorted)
      setSessionsByActivity((prev) => ({ ...prev, [editingActivity.id]: sorted }))
    } else if (sessionDraftMode === 'edit' && sessionDraftId) {
      const { data, error: updateErr } = await supabase
        .from('learning_sessions')
        .update(payload)
        .eq('id', sessionDraftId)
        .select('id,activity_id,start_time,end_time,meeting_url,location,seats_total')
        .single()

      if (updateErr) {
        setSessionError(updateErr.message)
        return
      }

      const updated = data as Session
      const mapped = editingActivitySessions.map((s) => (s.id === sessionDraftId ? updated : s))
      setEditingActivitySessions(mapped)
      setSessionsByActivity((prev) => ({ ...prev, [editingActivity.id]: mapped }))
    }

    setSessionDraftMode(null)
  }

  async function handleDeleteSession(sessionId: string) {
    if (!supabase || !editingActivity) return
    if (!window.confirm('Delete this session? This cannot be undone.')) return
    const { error: delErr } = await supabase.from('learning_sessions').delete().eq('id', sessionId)
    if (delErr) {
      setSessionError(delErr.message)
      return
    }
    const filtered = editingActivitySessions.filter((s) => s.id !== sessionId)
    setEditingActivitySessions(filtered)
    setSessionsByActivity((prev) => ({ ...prev, [editingActivity.id]: filtered }))
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-20 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Admin</span>
          <h1 className="text-5xl font-serif text-deep-slate leading-tight">Activities</h1>
          <p className="text-lg font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Add, edit, and schedule public activities for each Johrei center.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <LearningAdminToolbar current="activities" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
              <Link to="/admin/donations" className="text-slate-600 hover:text-sage-600 underline text-sm">
                Donations
              </Link>
              {isSuperAdmin ? (
                <>
                  <Link
                    to="/admin/organization"
                    className="text-slate-600 hover:text-sage-600 underline text-sm"
                  >
                    Centers & Groups
                  </Link>
                  <Link to="/admin/users" className="text-slate-600 hover:text-sage-600 underline text-sm">
                    Admin Users
                  </Link>
                </>
              ) : null}
              <Link to="/admin/materials" className="text-slate-600 hover:text-sage-600 underline text-sm">
                Event Downloads
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {isSuperAdmin ? (
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Filter by center:</span>
                  <select
                    value={selectedCenterId}
                    onChange={(e) => setSelectedCenterId(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="">All centers</option>
                    {centers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-slate-400">
                  {role} ·{' '}
                  {managedCenterId
                    ? (centers.find((c) => c.id === managedCenterId)?.name ?? managedCenterId)
                    : 'All centers'}
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowAddActivity(true)
                  setEditingActivity(null)
                }}
                className="inline-flex h-10 items-center justify-center rounded-full bg-divine-gold px-6 text-[10px] font-semibold tracking-[0.14em] uppercase text-white hover:bg-[#9e730a] transition"
              >
                + Add Activity
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
          ) : null}

          {/* ─── Add activity form (minimal) ─────────────────────────── */}
          {showAddActivity ? (
            <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-serif text-deep-slate">New Activity</h3>
              <p className="mt-1 text-sm text-slate-500">
                Enter the basics — you can add sessions and full details after saving.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className={LABEL_CLASS}>Title *</span>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="e.g. Monthly Appreciation Service"
                  />
                </label>

                <label className="block">
                  <span className={LABEL_CLASS}>Center</span>
                  {isSuperAdmin ? (
                    <select
                      value={newCenterId}
                      onChange={(e) => setNewCenterId(e.target.value)}
                      className={FIELD_CLASS}
                    >
                      <option value="">— National / General —</option>
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={centers.find((c) => c.id === managedCenterId)?.name ?? ''}
                      readOnly
                      className={FIELD_CLASS + ' bg-slate-50'}
                    />
                  )}
                </label>

                <label className="block">
                  <span className={LABEL_CLASS}>Type</span>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className={FIELD_CLASS}
                  >
                    {ACTIVITY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {formatEventTypeLabel(t)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => void handleAddActivity()}
                  disabled={!newTitle.trim()}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-divine-gold px-6 text-[10px] font-semibold uppercase text-white hover:bg-[#9e730a] disabled:opacity-50"
                >
                  Create & Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddActivity(false)}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-6 text-[10px] font-semibold uppercase text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {/* ─── Full edit form ──────────────────────────────────────── */}
          {editingActivity ? (
            <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-serif text-deep-slate">Edit Activity</h3>
                <ButtonLink to={`/activities/${editingActivity.id}`} variant="ghost" className="text-xs">
                  Preview →
                </ButtonLink>
              </div>

              {/* ── Basic Info ── */}
              <p className={SECTION_TITLE}>Basic Info</p>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className={LABEL_CLASS}>Title *</span>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={FIELD_CLASS}
                  />
                </label>

                <label className="block">
                  <span className={LABEL_CLASS}>Type</span>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className={FIELD_CLASS}
                  >
                    {ACTIVITY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {formatEventTypeLabel(t)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className={LABEL_CLASS}>Center</span>
                  {isSuperAdmin ? (
                    <select
                      value={editCenterId}
                      onChange={(e) => setEditCenterId(e.target.value)}
                      className={FIELD_CLASS}
                    >
                      <option value="">— National / General —</option>
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={centers.find((c) => c.id === managedCenterId)?.name ?? ''}
                      readOnly
                      className={FIELD_CLASS + ' bg-slate-50'}
                    />
                  )}
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-[rgba(184,134,11,0.16)] bg-sanctuary-50/60 px-4 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsPublished}
                    onChange={(e) => void handleToggleSave('is_published', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-sage-600"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-deep-slate">Published</span>
                    <p className="text-xs text-slate-500 mt-0.5">Visible to the public when checked</p>
                  </div>
                  {toggleSavedField === 'is_published' && (
                    <span className="text-[10px] font-semibold text-sage-600 uppercase tracking-wide">Saved ✓</span>
                  )}
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-[rgba(184,134,11,0.16)] bg-sanctuary-50/60 px-4 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editShowOnMainEvents}
                    onChange={(e) => void handleToggleSave('show_on_main_events', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-sage-600"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-deep-slate">Show on main Activities page</span>
                    <p className="text-xs text-slate-500 mt-0.5">Uncheck to show only on the center page</p>
                  </div>
                  {toggleSavedField === 'show_on_main_events' && (
                    <span className="text-[10px] font-semibold text-sage-600 uppercase tracking-wide">Saved ✓</span>
                  )}
                </label>
              </div>

              {/* ── Description & Image ── */}
              <p className={SECTION_TITLE}>Description & Image</p>
              <div className="grid gap-4">
                <label className="block">
                  <span className={LABEL_CLASS}>Description</span>
                  <p className="mt-1 text-xs text-slate-400">
                    Explain what this activity is, its significance, who it's for, and what participants can expect.
                  </p>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className={FIELD_CLASS}
                    rows={6}
                    placeholder="Describe the activity in full — spiritual significance, who it is for, what to expect..."
                  />
                </label>

                <label className="block">
                  <span className={LABEL_CLASS}>Banner Image URL</span>
                  <p className="mt-1 text-xs text-slate-400">
                    Paste a direct image URL (jpg, png, webp). Leave blank to use no image.
                  </p>
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="https://..."
                  />
                  {editImageUrl.trim() ? (
                    <img
                      src={editImageUrl}
                      alt="Preview"
                      className="mt-3 h-40 w-full rounded-xl object-cover border border-slate-100"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : null}
                </label>
              </div>

              {/* ── Sessions ── */}
              <p className={SECTION_TITLE}>Sessions</p>
              <p className="text-xs text-slate-400 mb-4">
                Each session is a specific date and time this activity takes place.
              </p>

              {sessionError ? (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                  {sessionError}
                </div>
              ) : null}

              {editingActivitySessions.length > 0 ? (
                <div className="mb-4 space-y-2">
                  {editingActivitySessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[rgba(184,134,11,0.16)] bg-sanctuary-50/50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-deep-slate">{formatSessionLabel(s)}</p>
                        {s.end_time ? (
                          <p className="text-xs text-slate-500">
                            until{' '}
                            {new Date(s.end_time).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        ) : null}
                        {s.location ? (
                          <p className="text-xs text-slate-500 mt-0.5">{s.location}</p>
                        ) : null}
                        {s.meeting_url ? (
                          <p className="text-xs text-sage-600 mt-0.5 truncate max-w-xs">{s.meeting_url}</p>
                        ) : null}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openSessionEdit(s)}
                          className="inline-flex h-8 items-center rounded-full border border-sage-600 px-3 text-[10px] font-semibold uppercase text-sage-700 hover:bg-sage-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteSession(s.id)}
                          className="inline-flex h-8 items-center rounded-full border border-rose-200 px-3 text-[10px] font-semibold uppercase text-rose-700 hover:bg-rose-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-4 text-sm text-slate-400 italic">No sessions yet.</p>
              )}

              {sessionDraftMode ? (
                <div className="rounded-2xl border border-[rgba(184,134,11,0.22)] bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage-600 mb-4">
                    {sessionDraftMode === 'add' ? 'Add Session' : 'Edit Session'}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className={LABEL_CLASS}>Start date & time *</span>
                      <input
                        type="datetime-local"
                        value={sessionDraftStart}
                        onChange={(e) => setSessionDraftStart(e.target.value)}
                        className={FIELD_CLASS}
                      />
                    </label>
                    <label className="block">
                      <span className={LABEL_CLASS}>End date & time</span>
                      <input
                        type="datetime-local"
                        value={sessionDraftEnd}
                        onChange={(e) => setSessionDraftEnd(e.target.value)}
                        className={FIELD_CLASS}
                      />
                    </label>
                    <label className="block">
                      <span className={LABEL_CLASS}>Location</span>
                      <input
                        type="text"
                        value={sessionDraftLocation}
                        onChange={(e) => setSessionDraftLocation(e.target.value)}
                        className={FIELD_CLASS}
                        placeholder="Address, room, or building name"
                      />
                    </label>
                    <label className="block">
                      <span className={LABEL_CLASS}>Online meeting link</span>
                      <input
                        type="url"
                        value={sessionDraftMeetingUrl}
                        onChange={(e) => setSessionDraftMeetingUrl(e.target.value)}
                        className={FIELD_CLASS}
                        placeholder="https://zoom.us/..."
                      />
                    </label>
                    <label className="block">
                      <span className={LABEL_CLASS}>Capacity (seats)</span>
                      <input
                        type="number"
                        value={sessionDraftSeats}
                        onChange={(e) => setSessionDraftSeats(e.target.value)}
                        className={FIELD_CLASS}
                        placeholder="Leave blank for unlimited"
                        min={1}
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => void handleSaveSessionDraft()}
                      disabled={!sessionDraftStart}
                      className="inline-flex h-9 items-center rounded-full bg-deep-slate px-5 text-[10px] font-semibold uppercase text-white hover:bg-[#14202a] disabled:opacity-50"
                    >
                      Save Session
                    </button>
                    <button
                      type="button"
                      onClick={() => setSessionDraftMode(null)}
                      className="inline-flex h-9 items-center rounded-full border border-slate-200 px-5 text-[10px] font-semibold uppercase text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openSessionAdd}
                  className="inline-flex h-9 items-center rounded-full border border-[rgba(184,134,11,0.3)] bg-sanctuary-50 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-deep-slate hover:bg-sanctuary-100 transition"
                >
                  + Add Session
                </button>
              )}

              {/* ── Contact & Registration ── */}
              <p className={SECTION_TITLE}>Contact & Registration</p>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className={LABEL_CLASS}>Contact name</span>
                  <input
                    type="text"
                    value={editContactName}
                    onChange={(e) => setEditContactName(e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="e.g. Center Director"
                  />
                </label>
                <label className="block">
                  <span className={LABEL_CLASS}>Contact email</span>
                  <input
                    type="email"
                    value={editContactEmail}
                    onChange={(e) => setEditContactEmail(e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="contact@example.org"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-[rgba(184,134,11,0.16)] bg-sanctuary-50/60 px-4 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editRegistrationRequired}
                    onChange={(e) => setEditRegistrationRequired(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-sage-600"
                  />
                  <div>
                    <span className="text-sm font-semibold text-deep-slate">Registration required</span>
                    <p className="text-xs text-slate-500 mt-0.5">Show a registration CTA on the public page</p>
                  </div>
                </label>

                {editRegistrationRequired ? (
                  <label className="block">
                    <span className={LABEL_CLASS}>Registration link</span>
                    <input
                      type="url"
                      value={editRegistrationUrl}
                      onChange={(e) => setEditRegistrationUrl(e.target.value)}
                      className={FIELD_CLASS}
                      placeholder="https://... (leave blank to use contact form)"
                    />
                  </label>
                ) : null}
              </div>

              {/* ── Save / Cancel ── */}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => void handleSaveEdit()}
                  disabled={!editTitle.trim()}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-divine-gold px-8 text-[10px] font-semibold uppercase text-white hover:bg-[#9e730a] disabled:opacity-50 transition"
                >
                  Save Activity
                </button>
                <button
                  type="button"
                  onClick={() => setEditingActivity(null)}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-6 text-[10px] font-semibold uppercase text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeleteActivity(editingActivity)}
                  className="ml-auto inline-flex h-11 items-center justify-center rounded-full border border-rose-200 px-6 text-[10px] font-semibold uppercase text-rose-700 hover:bg-rose-50"
                >
                  Delete Activity
                </button>
              </div>
            </div>
          ) : null}

          {/* ─── Activity list ───────────────────────────────────────── */}
          {isLoading ? (
            <p className="text-slate-600">Loading...</p>
          ) : filteredActivities.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-6 py-10 text-center">
              <p className="text-slate-600">
                {selectedCenterId ? 'No activities for this center yet.' : 'No activities yet.'}
              </p>
              <p className="text-slate-500 text-sm mt-2">Click &quot;+ Add Activity&quot; to create one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const center = activity.center_id
                  ? centers.find((c) => c.id === activity.center_id)
                  : null
                const sessions = sessionsByActivity[activity.id] ?? []
                const isEditing = editingActivity?.id === activity.id

                return (
                  <div
                    key={activity.id}
                    className={`rounded-3xl border bg-white p-6 shadow-sm transition ${isEditing ? 'border-divine-gold ring-2 ring-divine-gold/20' : 'border-[rgba(184,134,11,0.22)]'}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-sage-600">
                            {formatEventTypeLabel(activity.type)}
                          </span>
                          {center ? (
                            <span className="text-[10px] text-slate-400">· {center.name}</span>
                          ) : null}
                          {activity.is_published === false ? (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                              Draft
                            </span>
                          ) : null}
                          {activity.show_on_main_events === false ? (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                              Center page only
                            </span>
                          ) : null}
                        </div>
                        <h3 className="text-xl font-serif text-deep-slate mt-1">{activity.title}</h3>
                        {sessions.length > 0 ? (
                          <p className="text-xs text-slate-400 mt-1">
                            {sessions.length} session{sessions.length !== 1 ? 's' : ''} ·{' '}
                            {formatSessionLabel(sessions[0])}
                          </p>
                        ) : (
                          <p className="text-xs text-slate-400 italic mt-1">No sessions</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => (isEditing ? setEditingActivity(null) : openEdit(activity))}
                          className="inline-flex h-9 items-center justify-center rounded-full border border-sage-600 px-4 text-[10px] font-semibold uppercase text-sage-700 hover:bg-sage-50"
                        >
                          {isEditing ? 'Close' : 'Edit'}
                        </button>
                        <ButtonLink to={`/activities/${activity.id}`} variant="ghost" className="h-9 text-[10px]">
                          View
                        </ButtonLink>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Section>
    </div>
  )
}
