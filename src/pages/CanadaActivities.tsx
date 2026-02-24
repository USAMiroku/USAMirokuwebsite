import { Section } from '../components/Section'
import { ButtonLink } from '../components/ButtonLink'
import { usePageMeta } from '../hooks/usePageMeta'

export default function CanadaActivities() {
  usePageMeta({ title: 'Activities — World Messianic Church of Canada', description: 'Activities and services in Canada' })

  const activities = [
    'Johrei practice sessions (ministering and receiving Johrei)',
    'Faith experiences and testimony sharing',
    'Online prayer / request form',
    'Educational materials and e-books on Meishu-Sama teachings',
    'Local gatherings and events organized by city groups and centres',
    'Donation options to support the association (tax-deductible where applicable)',
  ]

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <Section className="py-24 text-center">
        <h1 className="text-4xl font-serif">Activities & Services</h1>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Overview of commonly offered activities across Canadian centres.</p>
      </Section>

      <Section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <ul className="grid gap-4">
            {activities.map((a) => (
              <li key={a} className="p-4 rounded-md border border-slate-100 bg-slate-50">{a}</li>
            ))}
          </ul>

          <div className="mt-8">
            <ButtonLink to="/canada/units" variant="secondary">See local centres</ButtonLink>
          </div>

          <p className="mt-8 text-sm text-slate-500">For current event dates and schedules, check the association website or contact <a href="mailto:canada@johrei.ca">canada@johrei.ca</a>.</p>
        </div>
      </Section>
    </div>
  )
}
