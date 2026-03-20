import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

export default function LearningActivities() {
  usePageMeta({
    title: 'Learning | Activities',
    description: 'Browse learning classes, study sessions, community events, and self-study offerings.',
  })

  const [activities, setActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError('Learning app is not configured. Add Supabase env vars to enable activities.')
        return
      }

      const { data, error: queryError } = await supabase
        .from('learning_activities')
        .select('id,type,title,description')
        .order('created_at', { ascending: false })
        .limit(50)

      if (queryError) {
        setError(queryError.message)
        return
      }

      setActivities((data ?? []) as Activity[])
    }

    void load()
  }, [])

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Browse</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">Classes & Sessions</h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Pick an offering to see schedule details and register.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">
              {error}
            </div>
          ) : null}

          {!error && activities.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-6 py-10 text-center">
              <p className="text-slate-600">No learning activities have been added yet.</p>
              <p className="text-slate-500 text-sm mt-2">Ask an instructor/admin to set up activities and sessions.</p>
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            {activities.map((activity) => (
              <div key={activity.id} className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
                <div className="space-y-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-sage-600">{activity.type.replace('_',' ')}</p>
                  <h2 className="text-2xl font-serif text-deep-slate">{activity.title}</h2>
                  {activity.description ? (
                    <p className="text-sm leading-relaxed text-slate-600">{activity.description}</p>
                  ) : null}
                </div>
                <div className="mt-6">
                  <ButtonLink to={`/learn/activities/${activity.id}`} variant="primary">
                    View Sessions
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 text-center">
            <Link to="/learn" className="text-slate-600 hover:text-sage-600 transition-colors text-sm underline">
              Back to Learning Home
            </Link>
          </div>
        </div>
      </Section>
    </div>
  )
}

