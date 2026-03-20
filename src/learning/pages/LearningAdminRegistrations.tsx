import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'
import { RequireAdmin } from '../components/LearningRouteGuards'
import { useLearningAuth } from '../context/LearningAuthContext'

type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'

type PendingRegistrationRow = {
  id: string
  status: RegistrationStatus
  user_id: string
  session_id: string
  created_at: string
  custom_fields: Record<string, unknown> | null
  learning_sessions:
    | {
        id: string
        start_time: string | null
        location: string | null
        activity_id: string
        meeting_url: string | null
      }
    | Array<{
        id: string
        start_time: string | null
        location: string | null
        activity_id: string
        meeting_url: string | null
      }>
    | null
}

type Profile = {
  user_id: string
  full_name: string | null
  phone: string | null
  preferred_language: string | null
}

type Activity = {
  id: string
  title: string
}

function formatDateTime(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString()
}

function normalizeSession(
  ls: PendingRegistrationRow['learning_sessions'],
): { id: string; start_time: string | null; location: string | null; activity_id: string; meeting_url: string | null } | null {
  if (!ls) return null
  return Array.isArray(ls) ? (ls[0] ?? null) : ls
}

export default function LearningAdminRegistrations() {
  const { role } = useLearningAuth()

  usePageMeta({
    title: 'Admin | Enrollment Requests',
    description: 'Approve or reject learning enrollment requests.',
  })

  return (
    <RequireAdmin>
      <AdminRegistrationsInner role={role ?? 'admin'} />
    </RequireAdmin>
  )
}

function AdminRegistrationsInner({ role }: { role: string }) {
  const [pending, setPending] = useState<PendingRegistrationRow[]>([])
  const [profilesById, setProfilesById] = useState<Record<string, Profile>>({})
  const [activitiesById, setActivitiesById] = useState<Record<string, Activity>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const activityIds = useMemo(() => {
    return Array.from(
      new Set(
        pending
          .map((p) => normalizeSession(p.learning_sessions)?.activity_id)
          .filter((v): v is string => !!v),
      ),
    )
  }, [pending])

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError('Learning app is not configured. Add Supabase env vars to enable admin.')
        return
      }

      setIsLoading(true)
      setError(null)

      const { data: pendingData, error: pendingError } = await supabase
        .from('learning_registrations')
        .select('id,status,user_id,session_id,created_at,custom_fields,learning_sessions(id,start_time,location,activity_id,meeting_url)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(100)

      if (pendingError) {
        setError(pendingError.message)
        return
      }

      const rows = (pendingData ?? []) as unknown as PendingRegistrationRow[]
      setPending(rows)

      const userIds = Array.from(new Set(rows.map((p) => p.user_id)))
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('learning_profiles')
          .select('user_id,full_name,phone,preferred_language')
          .in('user_id', userIds)

        if (!profilesError && profilesData) {
          setProfilesById(
            (profilesData as Profile[]).reduce((acc, p) => ({ ...acc, [p.user_id]: p }), {}),
          )
        }
      }

      if (activityIds.length > 0) {
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('learning_activities')
          .select('id,title')
          .in('id', activityIds)

        if (!activitiesError && activitiesData) {
          setActivitiesById(
            (activitiesData as Activity[]).reduce((acc, a) => ({ ...acc, [a.id]: a }), {}),
          )
        }
      }
    }

    void load().finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityIds.join(',')])

  async function updateStatus(registrationId: string, nextStatus: 'approved' | 'rejected') {
    if (!supabase) return
    setActionError(null)

    const { error: updateError } = await supabase
      .from('learning_registrations')
      .update({ status: nextStatus })
      .eq('id', registrationId)

    if (updateError) {
      setActionError(updateError.message)
      return
    }

    // Refresh list.
    const { data: pendingData, error: pendingError } = await supabase
      .from('learning_registrations')
      .select('id,status,user_id,session_id,created_at,custom_fields,learning_sessions(id,start_time,location,activity_id,meeting_url)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(100)

    if (!pendingError) setPending((pendingData ?? []) as unknown as PendingRegistrationRow[])
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Admin</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">Enrollment Requests</h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Approve or reject pending registrations.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <Link to="/learn" className="text-slate-600 hover:text-sage-600 underline text-sm">
              Back to Learning
            </Link>
            <ButtonLink to="/learn/admin/materials" variant="outline">
              Upload Materials
            </ButtonLink>
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-slate-400">Role: {role}</p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
          ) : null}
          {actionError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{actionError}</div>
          ) : null}

          {isLoading ? <p className="text-slate-600">Loading requests...</p> : null}

          {!isLoading && pending.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-6 py-10 text-center">
              <p className="text-slate-600">No pending requests.</p>
              <p className="text-slate-500 text-sm mt-2">When students request enrollment, they appear here.</p>
              <div className="mt-6">
                <ButtonLink to="/learn/activities" variant="outline">
                  View Activities
                </ButtonLink>
              </div>
            </div>
          ) : null}

          {!isLoading && pending.length > 0 ? (
            <div className="grid gap-6">
              {pending.map((p) => {
                const session = normalizeSession(p.learning_sessions)
                const profile = profilesById[p.user_id]
                const activityTitle = session ? activitiesById[session.activity_id]?.title : undefined
                return (
                  <div
                    key={p.id}
                    className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-sage-600">
                          {activityTitle ?? 'Activity'}
                        </p>
                        <h2 className="text-2xl font-serif text-deep-slate">
                          {formatDateTime(session?.start_time ?? null) ?? 'Session'}
                        </h2>
                        <p className="text-sm text-slate-600">
                          Student: {profile?.full_name ?? p.user_id}
                        </p>
                        {profile?.phone ? <p className="text-sm text-slate-600">Phone: {profile.phone}</p> : null}
                        {session?.location ? <p className="text-sm text-slate-600">Location: {session.location}</p> : null}
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => void updateStatus(p.id, 'approved')}
                          className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-600 px-6 text-[10px] font-semibold tracking-[0.14em] uppercase text-white hover:bg-emerald-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => void updateStatus(p.id, 'rejected')}
                          className="inline-flex h-10 items-center justify-center rounded-full bg-rose-600 px-6 text-[10px] font-semibold tracking-[0.14em] uppercase text-white hover:bg-rose-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
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

