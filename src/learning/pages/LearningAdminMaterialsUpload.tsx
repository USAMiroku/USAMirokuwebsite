import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'
import { RequireAdmin } from '../components/LearningRouteGuards'
import { useLearningAuth } from '../context/LearningAuthContext'

type Activity = {
  id: string
  title: string
}

type Session = {
  id: string
  activity_id: string
  start_time: string | null
}

type UploadMode = 'session' | 'self_study'

const MATERIALS_BUCKET = 'learning-materials'

function sanitizeFileName(name: string) {
  // Keep it simple: avoid spaces and path traversal.
  return name.replaceAll('/', '_').replaceAll('\\', '_').replace(/\s+/g, '_')
}

function formatDateTime(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString()
}

export default function LearningAdminMaterialsUpload() {
  const { role } = useLearningAuth()

  usePageMeta({
    title: 'Admin | Upload Materials',
    description: 'Upload course/study materials to be downloaded by enrolled students.',
  })

  return (
    <RequireAdmin>
      <AdminMaterialsUploadInner role={role ?? 'admin'} />
    </RequireAdmin>
  )
}

function AdminMaterialsUploadInner({ role }: { role: string }) {
  const [uploadMode, setUploadMode] = useState<UploadMode>('session')
  const [activities, setActivities] = useState<Activity[]>([])
  const [sessions, setSessions] = useState<Session[]>([])

  const [activityId, setActivityId] = useState<string>('')
  const [sessionId, setSessionId] = useState<string>('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const derivedActivityId = useMemo(() => {
    if (uploadMode === 'self_study') return activityId
    const session = sessions.find((s) => s.id === sessionId)
    return session?.activity_id ?? ''
  }, [activityId, sessionId, sessions, uploadMode])

  useEffect(() => {
    async function load() {
      if (!supabase) return

      const [activitiesRes, sessionsRes] = await Promise.all([
        supabase.from('learning_activities').select('id,title').order('created_at', { ascending: false }).limit(50),
        supabase
          .from('learning_sessions')
          .select('id,activity_id,start_time')
          .order('start_time', { ascending: false })
          .limit(50),
      ])

      if (!activitiesRes.error && activitiesRes.data) setActivities((activitiesRes.data ?? []) as Activity[])
      if (!sessionsRes.error && sessionsRes.data) setSessions((sessionsRes.data ?? []) as Session[])
    }

    void load()
  }, [])

  useEffect(() => {
    // Keep selections valid when switching modes.
    if (uploadMode === 'self_study') {
      if (!activityId && activities.length > 0) setActivityId(activities[0].id)
    } else {
      if (!sessionId && sessions.length > 0) setSessionId(sessions[0].id)
    }
  }, [activities, sessions, activityId, sessionId, uploadMode])

  async function handleUpload() {
    if (!supabase) {
      setError('Learning app is not configured (Supabase missing).')
      return
    }
    if (!file) {
      setError('Please select a file to upload.')
      return
    }
    if (!title.trim()) {
      setError('Please provide a title for the material.')
      return
    }
    if (!derivedActivityId) {
      setError('Please select the related activity/session.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const safeFileName = sanitizeFileName(file.name)
      const path =
        uploadMode === 'session'
          ? `session/${sessionId}/${safeFileName}`
          : `activity/${activityId}/${safeFileName}`

      const { error: uploadError } = await supabase.storage.from(MATERIALS_BUCKET).upload(path, file, {
        upsert: false,
        contentType: file.type || undefined,
      })

      if (uploadError) throw uploadError

      const { error: insertError } = await supabase.from('learning_materials').insert({
        activity_id: derivedActivityId,
        session_id: uploadMode === 'session' ? sessionId : null,
        title: title.trim(),
        description: description.trim() || null,
        storage_path: path,
        file_name: safeFileName,
        mime_type: file.type || null,
      })

      if (insertError) throw insertError

      setTitle('')
      setDescription('')
      setFile(null)
      // Keep selection
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not upload material.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Admin</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">Upload Materials</h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Upload files that become available to enrolled students.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex gap-3">
              <Link to="/learn/admin/registrations" className="text-slate-600 hover:text-sage-600 underline text-sm">
                Registrations
              </Link>
              <Link to="/learn/admin/centers" className="text-slate-600 hover:text-sage-600 underline text-sm">
                Centers & Activities
              </Link>
            </div>
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-slate-400">Role: {role}</p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
          ) : null}

          <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="space-y-6">
              <div className="flex gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setUploadMode('session')}
                  className={`inline-flex h-10 items-center justify-center rounded-full px-6 text-[10px] font-semibold tracking-[0.14em] uppercase transition ${
                    uploadMode === 'session' ? 'bg-divine-gold text-white' : 'bg-white text-deep-slate border border-slate-200 hover:bg-sage-mist'
                  }`}
                >
                  Session Material
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('self_study')}
                  className={`inline-flex h-10 items-center justify-center rounded-full px-6 text-[10px] font-semibold tracking-[0.14em] uppercase transition ${
                    uploadMode === 'self_study' ? 'bg-divine-gold text-white' : 'bg-white text-deep-slate border border-slate-200 hover:bg-sage-mist'
                  }`}
                >
                  Self-Study Material
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {uploadMode === 'session' ? (
                  <label className="block md:col-span-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Choose Session</span>
                    <select
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                    >
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {formatDateTime(s.start_time) ?? 'Session'} (session_id: {s.id.slice(0, 8)}...)
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <label className="block md:col-span-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Choose Activity</span>
                    <select
                      value={activityId}
                      onChange={(e) => setActivityId(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                    >
                      {activities.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.title}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Material Title *</span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">File *</span>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="mt-2 block w-full text-sm text-slate-700"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Description (optional)</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                    rows={3}
                    placeholder="Short description shown to students."
                  />
                </label>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
                <ButtonLink to="/learn" variant="ghost">
                  Back to Learning
                </ButtonLink>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void handleUpload()}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-divine-gold px-10 text-[10px] font-semibold tracking-[0.14em] uppercase text-white transition hover:bg-[#9e730a] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Material'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

