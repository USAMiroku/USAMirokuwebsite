import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Donate() {
  const { t } = useTranslation()
  const stripeDonationLink = (import.meta.env.VITE_STRIPE_DONATION_LINK ?? '').trim()

  usePageMeta({
    title: `${t.donate.title} | ${t.brand}`,
    description: t.donate.intro,
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="border-b border-[rgba(184,134,11,0.2)] bg-white px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.32em] text-sage-600">Gratitude Offering</p>
          <h1 className="text-5xl font-serif md:text-7xl">{t.donate.title}</h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 md:text-2xl">{t.donate.intro}</p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-3xl border border-[rgba(184,134,11,0.25)] bg-sanctuary-100 p-8 md:p-10">
            <h2 className="text-3xl font-serif text-deep-slate">{t.donate.stripeTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Use secure checkout powered by Stripe. Payment methods are displayed automatically based on your region and device.
            </p>

            {stripeDonationLink ? (
              <a
                href={stripeDonationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-deep-slate px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-sage-600"
              >
                Donate via Stripe Checkout
              </a>
            ) : (
              <a
                href="mailto:canada@johrei.ca"
                className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full border border-[rgba(184,134,11,0.35)] bg-white px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-deep-slate transition-all hover:bg-sage-mist"
              >
                Contact us to donate
              </a>
            )}

            <p className="mt-4 text-sm text-slate-500">
              {stripeDonationLink
                ? 'A secure Stripe page will open in a new tab.'
                : 'Stripe checkout link is not configured yet.'}
            </p>
          </div>

          <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 md:p-10">
            <h3 className="text-4xl font-serif text-deep-slate">Your Offering of Gratitude</h3>
            <p className="mt-5 text-base leading-relaxed text-slate-700">
              An act of giving is more than a simple contribution; it is a profound spiritual practice. By offering
              your gratitude through a donation, you are participating in a divine plan of God. Your generosity
              directly supports our activities and our efforts to bring the light of Johrei to every person across
              Canada.
            </p>

            <h4 className="mt-8 text-2xl font-serif text-deep-slate">Tax &amp; Legal Information</h4>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
              <li>Miroku Association CANADA is a not-for-profit religious corporation.</li>
              <li>Your donations are tax-deductible to the full extent allowable by law.</li>
              <li>No goods or services were provided in exchange for this contribution.</li>
            </ul>

            <p className="mt-6 text-sm leading-relaxed text-slate-700">
              Thank you for your heart-centered support and your commitment to building a brighter world.
            </p>
          </div>
        </div>
      </Section>
    </div>
  )
}
