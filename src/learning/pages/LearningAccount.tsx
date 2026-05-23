import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'
import { RequireAuth } from '../components/LearningRouteGuards'
import { useLearningAuth } from '../context/LearningAuthContext'

type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'

type RegistrationRow = {
  id: string
  status: RegistrationStatus
  session_id: string
  custom_fields: Record<string, unknown> | null
  learning_sessions:
    | {
        id: string
        start_time: string | null
        meeting_url: string | null
        location: string | null
        activity_id: string
      }
    | Array<{
        id: string
        start_time: string | null
        meeting_url: string | null
        location: string | null
        activity_id: string
      }>
    | null
}

type Activity = {
  id: string
  title: string
}

type Material = {
  id: string
  activity_id: string
  session_id: string | null
  title: string
  description: string | null
  storage_path: string
  file_name: string
  mime_type: string | null
}

const MATERIALS_BUCKET = 'learning-materials'

function formatDateTime(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString()
}

function normalizeSession(
  ls: RegistrationRow['learning_sessions'],
): { id: string; start_time: string | null; meeting_url: string | null; location: string | null; activity_id: string } | null {
  if (!ls) return null
  return Array.isArray(ls) ? (ls[0] ?? null) : ls
}

export default function LearningAccount() {
  const { user, signOut, role } = useLearningAuth()

  usePageMeta({
    title: 'My Account | Learn',
    description: 'Your registrations and learning materials.',
  })

  return (
    <RequireAuth>
      <AccountInner userId={user?.id ?? ''} signOut={signOut} role={role} />
    </RequireAuth>
  )
}

function AccountInner({
  userId,
  signOut,
  role,
}: {
  userId: string
  signOut: () => Promise<void>
  role: string | null
}) {
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([])
  const [activitiesById, setActivitiesById] = useState<Record<string, Activity>>({})
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const approvedSessionIds = useMemo(() => {
    return registrations
      .filter((r) => r.status === 'approved' || r.status === 'completed')
      .map((r) => normalizeSession(r.learning_sessions)?.id)
      .filter((v): v is string => !!v)
  }, [registrations])

  const approvedActivityIds = useMemo(() => {
    return registrations
      .filter((r) => r.status === 'approved' || r.status === 'completed')
      .map((r) => normalizeSession(r.learning_sessions)?.activity_id)
      .filter((v): v is string => !!v)
  }, [registrations])

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError('Learning app is not configured. Add Supabase env vars to enable your account.')
        return
      }
      if (!userId) return

      setIsLoading(true)
      setError(null)

      const { data: regData, error: regError } = await supabase
        .from('learning_registrations')
        .select('id,status,session_id,custom_fields,learning_sessions(id,start_time,meeting_url,location,activity_id)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (regError) {
        setError(regError.message)
        return
      }

      const rows = (regData ?? []) as unknown as RegistrationRow[]
      setRegistrations(rows)

      const activityIds = Array.from(
        new Set(
          rows
            .map((r) => normalizeSession(r.learning_sessions)?.activity_id)
            .filter((v): v is string => !!v),
        ),
      )

      if (activityIds.length > 0) {
        const { data: activityData, error: activityError } = await supabase
          .from('learning_activities')
          .select('id,title')
          .in('id', activityIds)

        if (!activityError && activityData) {
          setActivitiesById((activityData as Activity[]).reduce((acc, a) => ({ ...acc, [a.id]: a }), {}))
        }
      }

      // Fetch materials for approved sessions.
      const [sessionMaterialsRes, activityMaterialsRes] = await Promise.all([
        approvedSessionIds.length > 0
          ? supabase
              .from('learning_materials')
              .select('id,activity_id,session_id,title,description,storage_path,file_name,mime_type')
              .in('session_id', approvedSessionIds)
              .order('created_at', { ascending: false })
          : Promise.resolve({ data: [], error: null }),
        approvedActivityIds.length > 0
          ? supabase
              .from('learning_materials')
              .select('id,activity_id,session_id,title,description,storage_path,file_name,mime_type')
              .is('session_id', null)
              .in('activity_id', approvedActivityIds)
              .order('created_at', { ascending: false })
          : Promise.resolve({ data: [], error: null }),
      ])

      const sessionMaterialsData = sessionMaterialsRes.data
      const activityMaterialsData = activityMaterialsRes.data

      if (sessionMaterialsRes.error) {
        setError(sessionMaterialsRes.error.message)
      } else if (activityMaterialsRes.error) {
        setError(activityMaterialsRes.error.message)
      } else {
        setMaterials([...(sessionMaterialsData ?? []) as Material[], ...(activityMaterialsData ?? []) as Material[]])
      }
    }

    void load().finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, approvedSessionIds.join(','), approvedActivityIds.join(',')])

  async function handleDownload(material: Material) {
    if (!supabase) return
    const { data } = await supabase.storage.from(MATERIALS_BUCKET).createSignedUrl(material.storage_path, 60 * 60)
    const signedUrl = data?.signedUrl
    if (signedUrl) {
      window.open(signedUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Student</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">My Account</h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Registrations, meeting links, and your enrolled materials.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <Link to="/activities" className="text-slate-600 hover:text-sage-600 underline text-sm">
              Browse Activities
            </Link>

            <div className="flex items-center gap-4">
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-slate-400">
                Role: {role ?? 'student'}
              </p>
              <button
                type="button"
                onClick={() => void signOut()}
                className="text-sm text-rose-700 hover:text-rose-800 underline"
              >
                Sign Out
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
          ) : null}

          {isLoading ? <p className="text-slate-600">Loading your account...</p> : null}

          {!isLoading && registrations.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-6 py-10 text-center">
              <p className="text-slate-600">No registrations yet.</p>
              <p className="text-slate-500 text-sm mt-2">Browse activities and request enrollment.</p>
              <div className="mt-6">
                <ButtonLink to="/activities" variant="accent">
                  Explore Classes
                </ButtonLink>
              </div>
            </div>
          ) : null}

          {!isLoading && registrations.length > 0 ? (
            <div className="grid gap-6">
              {registrations.map((r) => {
                const session = normalizeSession(r.learning_sessions)
                if (!session) return null
                const activityTitle = activitiesById[session.activity_id]?.title ?? 'Activity'
                const showMeeting = r.status === 'approved' || r.status === 'completed'
                const sessionMaterials = materials.filter(
                  (m) => m.session_id === session.id || (m.session_id === null && m.activity_id === session.activity_id),
                )

                return (
                  <div
                    key={r.id}
                    className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                      <div className="space-y-3">
                        <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-sage-600">
                          {activityTitle}
                        </p>
                        <h2 className="text-2xl font-serif text-deep-slate">{formatDateTime(session.start_time) ?? 'Session'}</h2>
                        <p className="text-sm text-slate-600">Status: {r.status}</p>
                        {session.location ? <p className="text-sm text-slate-600">Location: {session.location}</p> : null}
                      </div>

                      <div className="space-y-3 pt-1">
                        {showMeeting && session.meeting_url ? (
                          <a
                            className="inline-flex h-10 items-center justify-center rounded-full bg-deep-slate px-6 text-[10px] font-semibold tracking-[0.14em] uppercase text-white hover:bg-slate-700 transition"
                            href={session.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open Meeting
                          </a>
                        ) : session.meeting_url ? (
                          <p className="text-sm text-slate-500">Meeting link available after approval.</p>
                        ) : null}
                      </div>
                    </div>

                    {sessionMaterials.length > 0 ? (
                      <div className="mt-8 space-y-3">
                        <h3 className="text-lg font-semibold text-deep-slate">Materials</h3>
                        <div className="space-y-3">
                          {sessionMaterials.map((m) => (
                            <div key={m.id} className="flex items-center justify-between gap-4 border border-slate-100 rounded-2xl p-4">
                              <div className="min-w-0">
                                <p className="font-semibold text-sm text-deep-slate truncate">{m.title}</p>
                                {m.description ? <p className="text-sm text-slate-500">{m.description}</p> : null}
                              </div>
                              <button
                                type="button"
                                onClick={() => void handleDownload(m)}
                                className="text-sm text-sage-700 hover:text-sage-800 font-semibold underline"
                              >
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-8 text-sm text-slate-500">No materials attached to this session yet.</div>
                    )}
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
