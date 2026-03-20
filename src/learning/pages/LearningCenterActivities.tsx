import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'
import { siteConfig } from '../../config/siteConfig'

type Activity = {
  id: string
  type: string
  title: string
  description: string | null
  center_id: string | null
}

export default function LearningCenterActivities() {
  const { centerId } = useParams<{ centerId: string }>()
  const [activities, setActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string | null>(null)

  const center = centerId ? siteConfig.centers.find((c) => c.id === centerId) : null

  usePageMeta({
    title: center ? `${center.name} — Learning | ${siteConfig.shortName}` : 'Center Activities',
    description: center
      ? `Classes, study sessions, and activities at ${center.name}.`
      : 'Browse learning activities by center.',
  })

  useEffect(() => {
    async function load() {
      if (!centerId || !supabase) return

      const { data, error: queryError } = await supabase
        .from('learning_activities')
        .select('id,type,title,description,center_id')
        .eq('center_id', centerId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (queryError) {
        setError(queryError.message)
        return
      }
      setActivities((data ?? []) as Activity[])
    }

    void load()
  }, [centerId])

  if (!center) {
    return (
      <div className="min-h-screen bg-sanctuary-100 py-32 px-6 text-center">
        <h1 className="text-3xl font-serif text-deep-slate">Center not found</h1>
        <Link to="/locations" className="mt-6 inline-block text-sage-600 hover:text-sage-700 underline">
          Back to Locations
        </Link>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">
            {center.name}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">
            Classes & Activities
          </h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Sign up for classes, study sessions, and learning activities at this center.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <Link
              to={`/locations/${centerId}`}
              className="text-slate-600 hover:text-sage-600 transition-colors text-sm underline"
            >
              Back to {center.name}
            </Link>
            <Link to="/learn/activities" className="text-slate-600 hover:text-sage-600 transition-colors text-sm underline">
              All Activities
            </Link>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
          ) : null}

          {!error && activities.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-6 py-10 text-center">
              <p className="text-slate-600">No activities have been added for this center yet.</p>
              <p className="text-slate-500 text-sm mt-2">Check back later or browse all activities.</p>
              <div className="mt-6">
                <ButtonLink to="/learn/activities" variant="accent">
                  Browse All Activities
                </ButtonLink>
              </div>
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
              >
                <div className="space-y-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-sage-600">
                    {activity.type.replace('_', ' ')}
                  </p>
                  <h2 className="text-2xl font-serif text-deep-slate">{activity.title}</h2>
                  {activity.description ? (
                    <p className="text-sm leading-relaxed text-slate-600">{activity.description}</p>
                  ) : null}
                </div>
                <div className="mt-6">
                  <ButtonLink to={`/learn/activities/${activity.id}`} variant="primary">
                    View Sessions & Register
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
