import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'

type Activity = {
  id: string
  type: 'class' | 'study_session' | 'event' | 'self_study'
  title: string
  description: string | null
}

type Session = {
  id: string
  start_time: string | null
  end_time: string | null
  meeting_url: string | null
  seats_total: number | null
  location: string | null
}

function formatDateTime(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString()
}

export default function LearningActivityDetail() {
  const { activityId } = useParams<{ activityId: string }>()

  const [activity, setActivity] = useState<Activity | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [error, setError] = useState<string | null>(null)

  const typeLabel = useMemo(() => {
    if (!activity) return null
    return activity.type.replaceAll('_', ' ')
  }, [activity])

  usePageMeta({
    title: activity ? `${activity.title} | Learn` : 'Learn | Activity',
    description: activity?.description ?? 'Schedule details and registration.',
  })

  useEffect(() => {
    async function load() {
      if (!activityId) return

      if (!supabase) {
        setError('Learning app is not configured. Add Supabase env vars to enable activities.')
        return
      }

      const { data: activityData, error: activityError } = await supabase
        .from('learning_activities')
        .select('id,type,title,description')
        .eq('id', activityId)
        .maybeSingle()

      if (activityError) {
        setError(activityError.message)
        return
      }

      setActivity(activityData as Activity | null)

      const { data: sessionData, error: sessionsError } = await supabase
        .from('learning_sessions')
        .select('id,start_time,end_time,meeting_url,seats_total,location')
        .eq('activity_id', activityId)
        .order('start_time', { ascending: true })
        .limit(50)

      if (sessionsError) {
        setError(sessionsError.message)
        return
      }

      setSessions((sessionData ?? []) as Session[])
    }

    void load()
  }, [activityId])

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">
            {typeLabel ?? 'Offering'}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">{activity?.title ?? 'Loading...'}</h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            {activity?.description ?? 'Schedule and registration details will appear here.'}
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <Link
              to="/learn/activities"
              className="text-slate-600 hover:text-sage-600 transition-colors text-sm underline"
            >
              Back to Activities
            </Link>

            {activity ? (
              <Link
                to="/learn/account"
                className="text-slate-600 hover:text-sage-600 transition-colors text-sm underline"
              >
                My Account
              </Link>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
          ) : null}

          {!error && activity && sessions.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-6 py-10 text-center">
              <p className="text-slate-600">No upcoming sessions have been added yet.</p>
              <p className="text-slate-500 text-sm mt-2">Ask an instructor/admin to schedule sessions for this activity.</p>
            </div>
          ) : null}

          <div className="grid gap-6">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-sage-600">Session</p>
                    <h2 className="text-2xl font-serif text-deep-slate">
                      {formatDateTime(s.start_time) ?? 'Schedule to be announced'}
                    </h2>
                    {s.location ? <p className="text-sm text-slate-600">Location: {s.location}</p> : null}
                    {s.seats_total !== null ? (
                      <p className="text-sm text-slate-600">Seats: {s.seats_total}</p>
                    ) : null}
                    {s.meeting_url ? (
                      <p className="text-sm text-slate-600">
                        Online meeting will be available after enrollment confirmation.
                      </p>
                    ) : null}
                  </div>

                  <div className="pt-1 md:pt-5">
                    <ButtonLink to={`/learn/sessions/${s.id}/register`} variant="primary">
                      Register
                    </ButtonLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}

