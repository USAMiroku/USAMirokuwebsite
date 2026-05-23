import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'
import { useManagedCenters } from '../../organization/centers'
import { useTranslation } from '../../context/TranslationContext'

type Activity = {
  id: string
  type: string
  title: string
  description: string | null
  center_id: string | null
}

export default function LearningCenterActivities() {
  const { centerId } = useParams<{ centerId: string }>()
  const { language } = useTranslation()
  const [activities, setActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string | null>(null)
  const { activeCenters } = useManagedCenters()

  const center = centerId ? activeCenters.find((c) => c.id === centerId) : null

  const copy =
    language === 'es'
      ? {
          metaTitle: 'Eventos del centro',
          metaDescription: center ? `Servicios especiales, sesiones de estudio y eventos en ${center.name}.` : 'Explore eventos públicos por centro.',
          notFound: 'Centro no encontrado',
          backToLocations: 'Volver a ubicaciones',
          title: 'Eventos del centro',
          intro: 'Revise los servicios especiales, seminarios y sesiones públicas compartidas por este centro.',
          backToCenter: `Volver a ${center?.name ?? 'este centro'}`,
          allActivities: 'Todos los eventos',
          emptyTitle: 'Aún no se han agregado eventos para este centro.',
          emptyBody: 'Vuelva más tarde o explore todos los eventos públicos.',
          browseAll: 'Explorar todos los eventos',
          viewSessions: 'Ver evento',
        }
      : language === 'pt'
        ? {
            metaTitle: 'Eventos do centro',
            metaDescription: center ? `Cultos especiais, sessões de estudo e eventos em ${center.name}.` : 'Explore eventos públicos por centro.',
            notFound: 'Centro não encontrado',
            backToLocations: 'Voltar para locais',
            title: 'Eventos do centro',
            intro: 'Revise os cultos especiais, seminários e sessões públicas compartilhadas por este centro.',
            backToCenter: `Voltar para ${center?.name ?? 'este centro'}`,
            allActivities: 'Todos os eventos',
            emptyTitle: 'Ainda não foram adicionados eventos para este centro.',
            emptyBody: 'Volte depois ou explore todos os eventos públicos.',
            browseAll: 'Explorar todos os eventos',
            viewSessions: 'Ver evento',
          }
        : {
            metaTitle: 'Center Activities',
            metaDescription: center ? `Special services, study sessions, and activities at ${center.name}.` : 'Browse public activities by center.',
            notFound: 'Center not found',
            backToLocations: 'Back to Locations',
            title: 'Center Activities',
            intro: 'Review the special services, seminars, and public activities shared by this center.',
            backToCenter: `Back to ${center?.name ?? 'this center'}`,
            allActivities: 'All Activities',
            emptyTitle: 'No public activities have been added for this center yet.',
            emptyBody: 'Check back later or browse all public activities.',
            browseAll: 'Browse All Activities',
            viewSessions: 'View Activity',
          }

  usePageMeta({
    title: center ? `${center.name} — ${copy.metaTitle}` : copy.metaTitle,
    description: copy.metaDescription,
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
        <h1 className="text-3xl font-serif text-deep-slate">{copy.notFound}</h1>
        <Link to="/locations" className="mt-6 inline-block text-sage-600 hover:text-sage-700 underline">
          {copy.backToLocations}
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
            {copy.title}
          </h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            {copy.intro}
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
              {copy.backToCenter}
            </Link>
            <Link to="/activities" className="text-slate-600 hover:text-sage-600 transition-colors text-sm underline">
              {copy.allActivities}
            </Link>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
          ) : null}

          {!error && activities.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-sanctuary-50/50 px-6 py-10 text-center">
              <p className="text-slate-600">{copy.emptyTitle}</p>
              <p className="text-slate-500 text-sm mt-2">{copy.emptyBody}</p>
              <div className="mt-6">
                <ButtonLink to="/activities" variant="accent">
                  {copy.browseAll}
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
                  <ButtonLink to={`/activities/${activity.id}`} variant="primary">
                    {copy.viewSessions}
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
