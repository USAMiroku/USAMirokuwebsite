import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'
import { RequireAdmin } from '../components/LearningRouteGuards'
import { siteConfig } from '../../config/siteConfig'

type Activity = {
  id: string
  type: string
  title: string
  description: string | null
  center_id: string | null
  created_at: string
}

type Session = {
  id: string
  activity_id: string
  start_time: string | null
  meeting_url: string | null
  location: string | null
  seats_total: number | null
}

const ACTIVITY_TYPES = ['class', 'study_session', 'event', 'self_study'] as const

function formatDateTime(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString()
}

export default function LearningAdminCenterActivities() {
  usePageMeta({
    title: 'Admin | Centers & Activities',
    description: 'Manage activities and classes per Johrei center.',
  })

  return (
    <RequireAdmin>
      <AdminCenterActivitiesInner />
    </RequireAdmin>
  )
}

function AdminCenterActivitiesInner() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [sessionsByActivity, setSessionsByActivity] = useState<Record<string, Session[]>>({})
  const [selectedCenterId, setSelectedCenterId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editType, setEditType] = useState<string>('class')
  const [editCenterId, setEditCenterId] = useState<string>('')

  const [showAddActivity, setShowAddActivity] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newType, setNewType] = useState<string>('class')
  const [newCenterId, setNewCenterId] = useState<string>('')

  const centers = siteConfig.centers

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError('Learning app is not configured.')
        return
      }
      setIsLoading(true)
      setError(null)

      const { data: activitiesData, error: activitiesError } = await supabase
        .from('learning_activities')
        .select('id,type,title,description,center_id,created_at')
        .order('created_at', { ascending: false })
        .limit(100)

      if (activitiesError) {
        setError(activitiesError.message)
        return
      }

      const acts = (activitiesData ?? []) as Activity[]
      setActivities(acts)

      const activityIds = acts.map((a) => a.id)
      if (activityIds.length > 0) {
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('learning_sessions')
          .select('id,activity_id,start_time,meeting_url,location,seats_total')
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
  }, [])

  const filteredActivities =
    selectedCenterId === ''
      ? activities
      : activities.filter((a) => (a.center_id ?? '') === selectedCenterId)

  async function handleSaveEdit() {
    if (!supabase || !editingActivity) return
    const { error: updateError } = await supabase
      .from('learning_activities')
      .update({
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        type: editType,
        center_id: editCenterId || null,
      })
      .eq('id', editingActivity.id)

    if (updateError) {
      setError(updateError.message)
      return
    }
    setActivities((prev) =>
      prev.map((a) =>
        a.id === editingActivity.id
          ? { ...a, title: editTitle.trim(), description: editDescription.trim() || null, type: editType, center_id: editCenterId || null }
          : a,
      ),
    )
    setEditingActivity(null)
  }

  async function handleAddActivity() {
    if (!supabase || !newTitle.trim()) return
    const { data, error: insertError } = await supabase
      .from('learning_activities')
      .insert({
        type: newType,
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        center_id: newCenterId || null,
      })
      .select('id,type,title,description,center_id,created_at')
      .single()

    if (insertError) {
      setError(insertError.message)
      return
    }
    setActivities((prev) => [data as Activity, ...prev])
    setShowAddActivity(false)
    setNewTitle('')
    setNewDescription('')
    setNewType('class')
    setNewCenterId('')
  }

  async function handleDeleteActivity(activity: Activity) {
    if (!supabase) return
    if (!window.confirm(`Delete "${activity.title}" and all its sessions?`)) return
    const { error: deleteError } = await supabase.from('learning_activities').delete().eq('id', activity.id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    setActivities((prev) => prev.filter((a) => a.id !== activity.id))
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Admin</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">Centers & Activities</h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Add, edit, or remove activities and classes for each Johrei center.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
              <Link to="/learn/admin/registrations" className="text-slate-600 hover:text-sage-600 underline text-sm">
                Registrations
              </Link>
              <Link to="/learn/admin/materials" className="text-slate-600 hover:text-sage-600 underline text-sm">
                Upload Materials
              </Link>
            </div>
            <div className="flex items-center gap-4">
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
              <button
                type="button"
                onClick={() => setShowAddActivity(true)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-divine-gold px-6 text-[10px] font-semibold tracking-[0.14em] uppercase text-white hover:bg-[#9e730a] transition"
              >
                Add Activity
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
          ) : null}

          {showAddActivity ? (
            <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-serif text-deep-slate">Add New Activity</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Title *</span>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm"
                    placeholder="e.g. Introduction to Johrei"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Center</span>
                  <select
                    value={newCenterId}
                    onChange={(e) => setNewCenterId(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm"
                  >
                    <option value="">— National / General —</option>
                    {centers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Type</span>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm"
                  >
                    {ACTIVITY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Description</span>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm"
                    rows={3}
                  />
                </label>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => void handleAddActivity()}
                  disabled={!newTitle.trim()}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-divine-gold px-6 text-[10px] font-semibold uppercase text-white hover:bg-[#9e730a] disabled:opacity-50"
                >
                  Save
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

          {editingActivity ? (
            <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-serif text-deep-slate">Edit Activity</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Title *</span>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Center</span>
                  <select
                    value={editCenterId}
                    onChange={(e) => setEditCenterId(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm"
                  >
                    <option value="">— National / General —</option>
                    {centers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Type</span>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm"
                  >
                    {ACTIVITY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Description</span>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm"
                    rows={3}
                  />
                </label>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => void handleSaveEdit()}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-divine-gold px-6 text-[10px] font-semibold uppercase text-white hover:bg-[#9e730a]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingActivity(null)}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-6 text-[10px] font-semibold uppercase text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {isLoading ? (
            <p className="text-slate-600">Loading...</p>
          ) : filteredActivities.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-6 py-10 text-center">
              <p className="text-slate-600">
                {selectedCenterId ? 'No activities for this center yet.' : 'No activities yet.'}
              </p>
              <p className="text-slate-500 text-sm mt-2">Click &quot;Add Activity&quot; to create one.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredActivities.map((activity) => {
                const center = activity.center_id ? centers.find((c) => c.id === activity.center_id) : null
                const sessions = sessionsByActivity[activity.id] ?? []
                return (
                  <div
                    key={activity.id}
                    className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-sage-600">
                          {activity.type.replace('_', ' ')} {center ? `· ${center.name}` : '· National'}
                        </p>
                        <h3 className="text-2xl font-serif text-deep-slate mt-1">{activity.title}</h3>
                        {activity.description ? (
                          <p className="text-sm text-slate-600 mt-2">{activity.description}</p>
                        ) : null}
                        {sessions.length > 0 ? (
                          <div className="mt-4 space-y-1">
                            <p className="text-xs font-semibold text-slate-500">Sessions:</p>
                            {sessions.map((s) => (
                              <p key={s.id} className="text-sm text-slate-600">
                                {formatDateTime(s.start_time) ?? 'TBD'} — {s.location || 'Online'}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 mt-2">No sessions yet. Add in Supabase or Materials page.</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingActivity(activity)
                            setEditTitle(activity.title)
                            setEditDescription(activity.description ?? '')
                            setEditType(activity.type)
                            setEditCenterId(activity.center_id ?? '')
                          }}
                          className="inline-flex h-9 items-center justify-center rounded-full border border-sage-600 px-4 text-[10px] font-semibold uppercase text-sage-700 hover:bg-sage-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteActivity(activity)}
                          className="inline-flex h-9 items-center justify-center rounded-full border border-rose-200 px-4 text-[10px] font-semibold uppercase text-rose-700 hover:bg-rose-50"
                        >
                          Remove
                        </button>
                        <ButtonLink to={`/learn/activities/${activity.id}`} variant="ghost" className="h-9">
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
