import { useParams } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { locations } from '../data/locations'

export default function LocationDetail() {
  const { id } = useParams()
  const { t, language } = useTranslation()
  const location = locations.find((l) => l.id === id)

  usePageMeta({
    title: location ? `${location.name} | ${t.brand}` : `${t.notFound} | ${t.brand}`,
    description: location ? `${location.city}, ${location.province}` : t.notFound,
  })

  if (!location) {
    return <p className="text-slate-700">{t.notFound}</p>
  }

  return (
    <div className="space-y-12">
      <section className="rounded-[32px] bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
          {location.type === 'ComingSoon'
            ? t.locations.types.comingSoon
            : t.locations.types[location.type.toLowerCase() as 'center' | 'group']}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{location.name}</h1>
        <p className="mt-2 text-slate-600">
          {location.city}, {location.province}
        </p>
        <div className="mt-4">
          <ButtonLink to="/locations" variant="secondary">
            {t.actions.back}
          </ButtonLink>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{t.locations.detail.contact}</h2>
          {location.address && <p className="mt-2 text-sm text-slate-700">{location.address}</p>}
          {location.notes && <p className="mt-1 text-xs text-slate-500">{location.notes}</p>}
          <div className="mt-3 text-sm text-slate-700">
            {location.phone && <p>{location.phone}</p>}
            {location.email && (
              <p>
                <a className="text-emerald-700 hover:text-emerald-800" href={`mailto:${location.email}`}>
                  {location.email}
                </a>
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {location.mapUrl && (
              <a
                href={location.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:border-emerald-400"
              >
                {t.locations.detail.directions}
              </a>
            )}
            <ButtonLink to="/contact" variant="accent">
              {t.locations.detail.contactCta}
            </ButtonLink>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{t.locations.detail.schedule}</h2>
          <p className="mt-2 text-sm text-slate-700">
            {location.schedule ||
              (location.type === 'ComingSoon'
                ? t.locations.types.comingSoon
                : language === 'en'
                  ? 'Schedule shared upon request; contact us to plan your visit.'
                  : language === 'es'
                    ? 'Horario compartido bajo solicitud; contactenos para planificar su visita.'
                    : 'Agenda compartilhada sob solicitacao; entre em contato para planejar sua visita.')}
          </p>
        </div>
      </section>
    </div>
  )
}
