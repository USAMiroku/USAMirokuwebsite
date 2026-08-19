import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { grantContent, healthDisclosure } from '../data/grantContent'
import { usePageMeta } from '../hooks/usePageMeta'

export default function CommunityPrograms() {
  const { language } = useTranslation()
  const copy = grantContent[language]
  usePageMeta({ title: `${copy.programsNav} | Miroku Association USA`, description: copy.programsIntro })

  return <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
    <section className="public-hero"><div className="public-hero-grid"><div className="public-hero-copy">
      <p className="public-eyebrow">Miroku Association USA</p><h1 className="public-title">{copy.programsNav}</h1><p className="public-body">{copy.programsIntro}</p>
    </div><div className="public-hero-note"><p className="public-eyebrow">{copy.missionTitle}</p><p className="mt-4">{copy.mission}</p></div></div></section>
    <Section className="bg-white"><div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
      {copy.programs.map(([title, body], index) => <Card key={title} title={title} eyebrow={`0${index + 1}`} className={index === copy.programs.length - 1 ? 'md:col-span-2' : ''}>
        <p className="text-base leading-relaxed text-slate-600">{body}</p>
        {index === copy.programs.length - 1 ? <p className="mt-5 rounded-2xl border border-[rgba(141,107,38,0.18)] bg-sanctuary-100 p-5 text-sm font-medium leading-7 text-deep-slate">{healthDisclosure[language]}</p> : null}
      </Card>)}
    </div></Section>
    <Section className="section-wash"><div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3">
      <ButtonLink to="/activities" variant="accent">{copy.activitiesCta}</ButtonLink><ButtonLink to="/locations" variant="secondary">{copy.locationsCta}</ButtonLink><ButtonLink to="/contact" variant="outline">{copy.volunteerCta}</ButtonLink>
    </div></Section>
  </div>
}
