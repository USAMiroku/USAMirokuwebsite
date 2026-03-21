import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { usePageMeta } from '../hooks/usePageMeta'
import { siteConfig } from '../config/siteConfig'
import { leadership } from '../data/leadership'

export default function Leadership() {
  usePageMeta({
    title: `Leadership | ${siteConfig.organizationName}`,
    description:
      'Spiritual and organizational leadership supporting World Messianic Church of America and its public ministry in the United States, Miroku Association USA.',
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="border-b border-[rgba(184,134,11,0.2)] bg-white px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-5xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-sage-600">Leadership</p>
          <h1 className="text-4xl font-serif leading-tight md:text-6xl">Leadership</h1>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-slate-600 md:text-2xl">
            Spiritual and organizational leadership supporting {siteConfig.organizationName} and its public ministry in the United States.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-4xl space-y-10">
          {leadership.map((entry) => (
            <Card key={entry.name} title={entry.name} eyebrow={entry.role} className="border-[rgba(184,134,11,0.2)] bg-white p-8">
              <p className="text-base leading-relaxed text-slate-600">{entry.bio}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-sanctuary-100 border-y border-[rgba(184,134,11,0.2)] text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-3xl font-serif md:text-5xl">Visit Our Centers</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Find a center near you to receive Johrei and connect with our community.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <ButtonLink to="/locations" variant="accent">
              Our Centers
            </ButtonLink>
            <ButtonLink to="/contact" variant="outline">
              Contact Us
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
