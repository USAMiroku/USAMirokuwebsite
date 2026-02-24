import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { usePageMeta } from '../hooks/usePageMeta'
import { siteConfig } from '../config/siteConfig'

export default function About() {
  const gettingStarted = [
    {
      title: '1. Practice the Art of Appreciation',
      body: 'Meishu-sama taught that gratitude is the fastest way to clear spiritual clouds.',
      action:
        'Start a "Small Joys" habit. Each morning or evening, identify one beautiful thing you saw or experienced. It could be the color of the sky or a kind word from a stranger. By focusing on the positive, you naturally align your vibration with the Divine.',
    },
    {
      title: '2. Create a "Corner of Beauty"',
      body: 'Beauty has the power to purify our environment and soothe a restless mind. You can create a Prototype of Paradise in your own living space.',
      action:
        'Place a single, fresh flower in a vase where you will see it often. Meishu-sama emphasized that even one flower can radiate enough light to change the atmosphere of a room. Focus on its life and color for a few moments each day.',
    },
    {
      title: '3. Seek a Johrei Session',
      body: 'If you are curious about the healing power of Divine Light, the best way to understand it is to experience it firsthand.',
      action:
        'Receiving Johrei is a quiet, meditative experience where a practitioner channels light to you. Most newcomers describe a sense of deep warmth, peace, and a lightness of spirit following a session.',
    },
    {
      title: '4. Choose "Living" Foods',
      body: 'Aligning with nature starts with what we put into our bodies.',
      action:
        'When shopping, try to incorporate one piece of naturally grown or organic produce into your meal. As you eat, take a moment to acknowledge the energy of the soil and the sun that allowed the food to grow.',
    },
  ]

  usePageMeta({
    title: `Welcome to ${siteConfig.organizationName} | ${siteConfig.organizationName}`,
    description:
      'The World Messianic Church is a spiritual movement dedicated to the establishment of Paradise on Earth: a world defined by health, prosperity, and peace.',
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="border-b border-[rgba(184,134,11,0.2)] bg-white px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-5xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-sage-600">About</p>
          <h1 className="text-4xl font-serif leading-tight md:text-6xl">Welcome to {siteConfig.organizationName}</h1>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-4xl space-y-6">
          <p className="text-lg leading-relaxed text-slate-700">
            The World Messianic Church is a spiritual movement dedicated to the establishment of Paradise on Earth: a world defined by health, prosperity, and peace. Founded in 1935 by Meishu-sama (Mokichi Okada), we serve as a "Midwife to World Civilization," guiding humanity through the transition from the "Age of Night" into the "Daylight Age."
          </p>
          <p className="text-lg leading-relaxed text-slate-700">
            Our path is built upon three pillars: Truth (Shin), Virtue (Zen), and Beauty (Bi). Through the practice of Johrei, the transmission of Divine Light, we seek to dissolve the spiritual clouds that are the root cause of illness and conflict. By purifying the spirit, we restore natural balance to the physical body and the world around us.
          </p>
          <p className="text-lg leading-relaxed text-slate-700">
            In the United States, we welcome all to experience this transformation. Whether through Johrei, the study of sacred teachings, or the appreciation of art and nature, our mission is to help every individual awaken to their divine nature and contribute to a global civilization of light.
          </p>
        </div>
      </Section>

      <Section className="bg-sanctuary-100 border-y border-[rgba(184,134,11,0.2)]">
        <div className="mx-auto max-w-5xl space-y-8">
          <h2 className="text-3xl font-serif md:text-5xl">Getting Started: Bringing the Light Home</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            You don&apos;t need to be a scholar or a lifelong practitioner to begin experiencing the principles Meishu-sama shared. His teachings are designed to be lived. Here are four simple ways you can begin incorporating his philosophy into your daily life:
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {gettingStarted.map((item) => (
              <Card key={item.title} title={item.title} className="border-[rgba(184,134,11,0.2)] bg-white p-8">
                <p className="text-base leading-relaxed text-slate-600">{item.body}</p>
                <p className="mt-4 text-base leading-relaxed text-slate-700">
                  <span className="font-semibold">The Action:</span> {item.action}
                </p>
                {item.title.startsWith('3.') ? (
                  <div className="mt-5">
                    <ButtonLink to="/locations" variant="accent">
                      Find a Center Near You
                    </ButtonLink>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
          <Card className="border-[rgba(184,134,11,0.2)] bg-white p-8">
            <h3 className="text-2xl font-serif">A Note for Newcomers</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Meishu-sama&apos;s path is one of Self-Reform. It is not about changing the world through force, but about refining our own hearts so that peace naturally ripples outward to our families, our communities, and eventually, the planet.
            </p>
          </Card>
        </div>
      </Section>

      <Section className="border-y border-[rgba(184,134,11,0.2)] bg-sanctuary-100">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[rgba(184,134,11,0.25)] bg-white p-8 md:p-10 text-center">
          <h2 className="text-3xl font-serif md:text-4xl">More</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Learn more about Johrei, our teachings, and how to experience this path in the United States.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/johrei" variant="secondary">
              Johrei
            </ButtonLink>
            <ButtonLink to="/meishu-sama" variant="outline">
              Meishu-Sama
            </ButtonLink>
            <ButtonLink to="/contact" variant="primary">
              Contact
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
