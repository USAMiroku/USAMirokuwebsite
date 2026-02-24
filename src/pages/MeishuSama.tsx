import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function MeishuSama() {
  const { t } = useTranslation()
  const timeline = [
    {
      title: '1882: Born in Tokyo, Japan',
      body: 'From a young age, he showed a deep interest in the arts and a sensitive nature.',
    },
    {
      title: 'Early 1900s: Personal Trials and Hardship',
      body: 'He experienced major losses, including the passing of his first wife and child, and the collapse of his retail business. These hardships led him to seek a deeper understanding of the laws of the universe.',
    },
    {
      title: '1926: Spiritual Awakening',
      body: 'After years of intense study and meditation, he received a series of divine revelations regarding the spiritual cause of physical suffering.',
    },
    {
      title: '1935: Formal Mission and Johrei',
      body: 'He formally began his mission and introduced Johrei as a method of channeling Divine Light to purify the spirit and support healing of the body.',
    },
    {
      title: '1945-1955: Prototypes of Paradise',
      body: 'Following WWII, he accelerated his work by establishing sacred grounds with gardens and art museums to demonstrate how beauty and nature can elevate the human soul.',
    },
    {
      title: '1955: Legacy Continues',
      body: 'Meishu-sama passed away in 1955, leaving behind a global legacy of spiritual practitioners and a philosophy that continues to grow today.',
    },
  ]

  const pillars = [
    {
      title: 'The Purification of the Spirit (Johrei)',
      body: 'He taught that the root cause of illness and misfortune is spiritual clouds or impurities. By channeling Divine Light through the palms, these clouds can be dissipated, leading to physical health and mental clarity.',
    },
    {
      title: 'Natural Farming',
      body: 'Meishu-sama was a pioneer of Nature Farming, cultivating food without chemical fertilizers or pesticides. He believed the earth is a living entity and that consuming living food is essential for harmony of body and soul.',
    },
    {
      title: 'The Power of Beauty',
      body: 'He believed art and beauty are not luxuries, but spiritual necessities. Flowers, fine art, and beautiful architecture naturally uplift the spirit and reduce negativity and conflict.',
    },
  ]

  usePageMeta({
    title: `${t.meishuSama.title} | ${t.brand}`,
    description: t.meishuSama.intro,
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="border-b border-[rgba(184,134,11,0.2)] bg-white px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-5xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-sage-600">{t.nav.meishuSama}</p>
          <h1 className="text-4xl font-serif leading-tight md:text-6xl">{t.meishuSama.title}</h1>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-slate-600 md:text-2xl">{t.meishuSama.intro}</p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-5xl space-y-6">
          <h2 className="text-3xl font-serif md:text-5xl">Who is Meishu-sama?</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            To his followers, he is known as <strong>Meishu-sama</strong> (Lord of Light), born Mokichi Okada
            (1882-1955). He was a visionary, philosopher, and spiritual leader who dedicated his life to a singular,
            monumental goal: <strong>the elimination of human suffering.</strong>
          </p>
          <p className="text-lg leading-relaxed text-slate-600">
            Meishu-sama taught that the world is currently undergoing a profound spiritual transition. He believed that
            by aligning ourselves with the laws of nature and spiritual truth, humanity could move away from a culture
            defined by conflict and disease toward a Paradise on Earth, a world of health, prosperity, and peace.
          </p>
        </div>
      </Section>

      <Section className="bg-sanctuary-100 border-y border-[rgba(184,134,11,0.2)]">
        <div className="mx-auto max-w-5xl space-y-8">
          <h2 className="text-3xl font-serif md:text-5xl">A Timeline of Transformation</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Meishu-sama&apos;s life was marked by personal hardship, business challenges, and eventual spiritual awakening.
            Here are the pivotal moments that shaped his mission:
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {timeline.map((item) => (
              <Card key={item.title} title={item.title} className="border-[rgba(184,134,11,0.2)] bg-white p-8">
                <p className="text-base leading-relaxed text-slate-600">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="mx-auto max-w-5xl space-y-8">
          <h2 className="text-3xl font-serif md:text-5xl">His Divine Purpose</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Meishu-sama&apos;s mission was not to start a traditional religion, but to initiate a <strong>civilizational
            shift</strong>. He identified three core pillars necessary to fulfill his divine purpose:
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Card
                key={pillar.title}
                title={`${index + 1}. ${pillar.title}`}
                className="border-[rgba(184,134,11,0.2)] bg-white p-8"
              >
                <p className="text-base leading-relaxed text-slate-600">{pillar.body}</p>
              </Card>
            ))}
          </div>
          <blockquote className="rounded-3xl border border-[rgba(184,134,11,0.25)] bg-sanctuary-100 p-8 text-center md:p-10">
            <p className="text-xl font-serif italic leading-relaxed text-slate-700">
              "The ultimate goal of my work is to create a world where there is no disease, no poverty, and no conflict."
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.15em] text-slate-500">Meishu-sama</p>
          </blockquote>
        </div>
      </Section>

      <Section className="bg-white text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-3xl font-serif md:text-5xl">Discover More</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Meishu-sama&apos;s teachings offer a practical roadmap for anyone looking to find more balance and purpose
            in the modern world. Whether through the practice of Johrei or simply appreciating the beauty in a single
            flower, his legacy invites you to become a co-creator of a more peaceful world.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <ButtonLink to="/meishu-sama/legacy" variant="accent">{t.meishuSama.learnMore}</ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
