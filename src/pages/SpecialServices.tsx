import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { specialServices, specialServicesLandingCopy } from '../data/specialServices'

export default function SpecialServices() {
  const { language } = useTranslation()
  const copy = specialServicesLandingCopy[language]

  usePageMeta({
    title: `${copy.title} | World Messianic Church of America | Miroku Association USA`,
    description: copy.description,
  })

  return (
    <div className="bg-white pb-16 pt-32 text-deep-slate">
      <section className="px-6 pb-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-5xl font-serif leading-tight text-deep-slate md:text-6xl">{copy.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{copy.intro}</p>
        </div>
      </section>

      <section className="px-6">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {specialServices.map((service) => {
            const serviceCopy = service.copy[language]
            return (
              <Link
                key={service.slug}
                to={`/special-services/${service.slug}`}
                className="group flex min-h-[12rem] flex-col rounded-2xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-sage-600/45"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sage-600">
                  {copy.title}
                </span>
                <h2 className="mt-4 text-2xl font-serif leading-tight text-deep-slate">{serviceCopy.cardTitle}</h2>
                <span className="mt-auto pt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-deep-slate transition-colors group-hover:text-sage-600">
                  {copy.openForm}
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export function SpecialServicesThankYou() {
  const { language } = useTranslation()
  const copy = specialServicesLandingCopy[language]

  usePageMeta({
    title: `${copy.title} | World Messianic Church of America | Miroku Association USA`,
    description: copy.description,
  })

  return (
    <div className="bg-white px-6 pb-16 pt-36 text-deep-slate">
      <section className="mx-auto max-w-2xl rounded-2xl border border-[rgba(184,134,11,0.22)] bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <h1 className="text-3xl font-serif leading-tight text-deep-slate">{copy.thankYou}</h1>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/donate" variant="accent">
            {copy.donate}
          </ButtonLink>
          <ButtonLink to="/special-services" variant="outline">
            {copy.back}
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
