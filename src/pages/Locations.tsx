import { useMemo } from 'react'
import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { locations } from '../data/locations'

export default function Locations() {
  const { t, language } = useTranslation()

  usePageMeta({
    title: `${t.locations.title} | ${t.brand}`,
    description: t.locations.intro,
  })

  const copy =
    language === 'es'
      ? {
          pageTitle: 'Centros y grupos en Estados Unidos',
          intro: 'Encuentre un centro cerca de usted para recibir Johrei y participar en la comunidad.',
          visitCenter: 'Ver centro',
          viewSessions: 'Ver sesiones',
          regionalCircle: 'Grupo regional',
          firstVisitKicker: 'Primera visita',
          firstVisitTitle: 'Que esperar en su primera visita',
          communityTitle: 'Conozca la comunidad',
        }
      : language === 'pt'
        ? {
            pageTitle: 'Centros e grupos nos Estados Unidos',
            intro: 'Encontre um centro perto de voce para receber Johrei e participar da comunidade.',
            visitCenter: 'Ver centro',
            viewSessions: 'Ver sessoes',
            regionalCircle: 'Grupo regional',
            firstVisitKicker: 'Primeira visita',
            firstVisitTitle: 'O que esperar na primeira visita',
            communityTitle: 'Conheca a comunidade',
          }
        : {
            pageTitle: 'Centers and Groups in the United States',
            intro: 'Find a nearby center to receive Johrei and connect with the community.',
            visitCenter: 'Visit Center',
            viewSessions: 'View Sessions',
            regionalCircle: 'Regional gathering circle',
            firstVisitKicker: 'First Visit',
            firstVisitTitle: 'What to Expect on Your First Visit',
            communityTitle: 'Meet the Community',
          }

  const grouped = useMemo(() => {
    return locations.reduce((acc, loc) => {
      const region = loc.province
      if (!acc[region]) acc[region] = []
      acc[region].push(loc)
      return acc
    }, {} as Record<string, typeof locations>)
  }, [])

  const regions = Object.keys(grouped).sort()

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-8xl font-serif text-deep-slate leading-tight">{copy.pageTitle}</h1>
          <p className="text-xl md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">{copy.intro}</p>
        </div>
      </section>

      <Section py-24 className="bg-white">
        <div className="max-w-7xl mx-auto space-y-40 px-6">
          {regions.map((region) => (
            <div key={region} className="space-y-16">
              <div className="flex items-baseline gap-8">
                <h2 className="text-4xl md:text-6xl font-serif text-deep-slate tracking-tight">{region}</h2>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[region].map((loc) => (
                  <Card
                    key={loc.id}
                    title={loc.name}
                    eyebrow={loc.city}
                    className="glass-sanctuary rounded-sanctuary p-10 hover:border-sage-600/30 transition-all duration-500 group"
                    cta={
                      <div className="flex flex-col gap-4">
                        <ButtonLink to={`/locations/${loc.id}`} variant="primary" className="h-11">
                          {copy.visitCenter}
                        </ButtonLink>
                        <ButtonLink to={`/locations/${loc.id}`} variant="ghost" className="text-slate-400 group-hover:text-sage-600 transition-colors h-8">
                          {copy.viewSessions} →
                        </ButtonLink>
                      </div>
                    }
                  >
                    <div className="space-y-6">
                      <p className="font-serif italic text-slate-500 text-lg leading-snug">{loc.address || copy.regionalCircle}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 px-3 py-1 rounded-full">{loc.type}</span>
                        {loc.notes && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-sage-mist text-sage-600 px-3 py-1 rounded-full">
                            {loc.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-sanctuary-100 border-y border-[rgba(184,134,11,0.2)]">
        <div className="mx-auto max-w-5xl space-y-8">
          <p className="text-[11px] uppercase tracking-[0.32em] text-sage-600">{copy.firstVisitKicker}</p>
          <h2 className="text-4xl font-serif md:text-5xl">{copy.firstVisitTitle}</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p><strong>1. A Warm Greeting</strong> You’ll be met by a volunteer or member who will welcome you. There is no dress code; come in whatever makes you feel comfortable.</p>
            <p><strong>2. A Brief Introduction</strong> If it’s your first time, someone will spend a few minutes sharing the basic story of Meishu-sama and the purpose of our center. You are encouraged to ask any questions you have.</p>
            <p><strong>3. Receiving Johrei</strong> The highlight of most visits is receiving Johrei.</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600">
              <li>You will sit in a comfortable chair.</li>
              <li>A practitioner will sit facing you (usually about an arm's length away).</li>
              <li>They will hold their hand toward your forehead and upper body for 15-20 minutes.</li>
            </ul>
            <p><strong>The Experience:</strong> You don't need to do anything special, just relax. Most people close their eyes and enjoy the quiet stillness.</p>
            <p><strong>4. A Moment of Beauty</strong> After your session, we invite you to sit for a few moments, perhaps enjoy a cup of tea, or look at the flower arrangements and art in the center.</p>
            <p><strong>5. No Pressure</strong> There is never any pressure to join or sign up for anything. You are welcome to visit once to try it out, or come back as often as you like.</p>
          </div>
        </div>
      </Section>

      <Section className="bg-white border-y border-[rgba(184,134,11,0.2)]">
        <div className="mx-auto max-w-5xl space-y-8">
          <h2 className="text-4xl font-serif md:text-5xl">{copy.communityTitle}</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Our community is a vibrant tapestry of individuals from all walks of life: teachers, artists, parents, and professionals, united by a common desire to be a source of light in the world.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <Card title="Spirit of Sincerity" className="p-7 border-[rgba(184,134,11,0.2)]">
              We believe that true change starts within. By refining our own hearts, we create a ripple effect of peace in our homes and neighborhoods.
            </Card>
            <Card title="A Culture of Beauty" className="p-7 border-[rgba(184,134,11,0.2)]">
              We do not just talk about art; we live it. Our gatherings often feature flower arrangements, music, and appreciation for the natural world.
            </Card>
            <Card title="Global Connection" className="p-7 border-[rgba(184,134,11,0.2)]">
              While we meet in local centers, we are part of a global movement of millions working toward Meishu-sama&apos;s vision of a world without suffering.
            </Card>
          </div>
          <Card title="Come as You Are" className="border-[rgba(184,134,11,0.2)] bg-sanctuary-100 p-8">
            You do not need to change your beliefs or have a background in spirituality to join us. Whether you join for a 15-minute Johrei session or a community service day, you will find a supportive environment where everyone is a student of the Light.
          </Card>
          <div className="text-center pt-2">
            <ButtonLink to="/contact" variant="accent">Contact a Center</ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
