import { useMemo } from 'react'
import { Card } from '../components/Card'
import { ButtonLink } from '../components/ButtonLink'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { locations } from '../data/locations'
import { Section } from '../components/Section'

export default function Locations() {
  const { t, language } = useTranslation()
  usePageMeta({
    title: `${t.locations.title} | ${t.brand}`,
    description: t.locations.intro,
  })

  const copy =
    language === 'fr'
      ? {
          pageTitle: 'Centres au Canada',
          visitCenter: 'Visiter le centre',
          viewSessions: 'Voir les sessions',
          regionalCircle: 'Cercle régional',
          provinceLabels: {
            Ontario: 'Ontario',
            Quebec: 'Québec',
            'Western Canada': 'Ouest du Canada',
            'Atlantic Canada': 'Canada atlantique',
          } as Record<string, string>,
          nameLabels: {
            'Toronto Center': 'Centre de Toronto',
            'Montreal Group': 'Groupe de Montréal',
            'Quebec City Group': 'Groupe de Québec',
            'Vancouver Group': 'Groupe de Vancouver',
            'Calgary Group': 'Groupe de Calgary',
            'Edmonton Group': "Groupe d'Edmonton",
            'Nova Scotia Group': 'Groupe de la Nouvelle-Écosse',
            'Prince Edward Island Group': "Groupe de l'Île-du-Prince-Édouard",
          } as Record<string, string>,
          cityLabels: {
            Toronto: 'Toronto',
            Montreal: 'Montréal',
            'Quebec City': 'Québec',
            Vancouver: 'Vancouver',
            Calgary: 'Calgary',
            Edmonton: 'Edmonton',
            'Nova Scotia': 'Nouvelle-Écosse',
            'Prince Edward Island': 'Île-du-Prince-Édouard',
          } as Record<string, string>,
          notesByValue: {
            'By appointment': 'Sur rendez-vous',
          } as Record<string, string>,
          title: 'Y a-t-il un groupe dans votre ville ?',
          body: "Si vous ne trouvez pas encore d'oasis dans votre région, contactez-nous pour nous aider à en manifester une près de chez vous.",
          button: 'Demander une séance',
        }
      : {
          pageTitle: 'Centers in Canada',
          visitCenter: 'Visit Center',
          viewSessions: 'View Sessions',
          regionalCircle: 'Regional gathering circle',
          provinceLabels: {},
          nameLabels: {},
          cityLabels: {},
          notesByValue: {},
          title: 'Is there a group in your city?',
          body: "If you can't find an oasis in your region yet, reach out to help us manifest one near you.",
          button: 'Request a Session',
        }

  const firstVisit =
    language === 'fr'
      ? {
          kicker: 'Premiere visite',
          title: 'A quoi vous attendre lors de votre premiere visite',
          intro:
            'Entrer dans un nouveau lieu spirituel ou communautaire peut sembler intimidant. Nous voulons que vous vous sentiez chez vous des votre arrivee.',
          steps: [
            {
              title: '1. Un accueil chaleureux',
              body: 'Un benevole ou un membre vous accueillera. Il n’y a pas de code vestimentaire; venez simplement dans une tenue confortable.',
            },
            {
              title: '2. Une breve introduction',
              body: 'Si c’est votre premiere visite, quelqu’un vous presentera en quelques minutes l’histoire de Meishu-sama et la mission du centre. Vous pouvez poser toutes vos questions.',
            },
            {
              title: '3. Recevoir le Johrei',
              body: 'Le moment principal de la plupart des visites est de recevoir le Johrei.',
              bullets: [
                'Vous serez assis confortablement.',
                'Un pratiquant sera assis face a vous (generalement a une longueur de bras).',
                'Il tiendra sa main vers votre front et le haut du corps pendant 15 a 20 minutes.',
              ],
              experienceLabel: "L'experience",
              experienceBody:
                'Vous n’avez rien de special a faire. Detendez-vous simplement. La plupart des personnes ferment les yeux et profitent du calme.',
            },
            {
              title: '4. Un moment de beaute',
              body: 'Apres la seance, nous vous invitons a rester quelques minutes, a prendre un the, ou a contempler les arrangements floraux et les oeuvres d’art du centre. Nous croyons que l’apres-lumiere est un moment ideal pour la reflection.',
            },
            {
              title: '5. Aucune pression',
              body: 'Il n’y a jamais de pression pour s’inscrire ou adhérer. Vous pouvez venir une seule fois pour decouvrir, ou revenir aussi souvent que vous le souhaitez.',
            },
          ],
          ctaTitle: 'Vous etes les bienvenus, a votre rythme',
          ctaBody: 'Si vous souhaitez planifier une premiere visite ou poser une question, notre equipe est la pour vous guider.',
          ctaButton: 'Planifier ma premiere visite',
        }
      : {
          kicker: 'First Visit',
          title: 'What to Expect on Your First Visit',
          intro:
            "Walking into a new spiritual or community space can feel a little intimidating. We want you to feel at home from the moment you step through the door.",
          steps: [
            {
              title: '1. A Warm Greeting',
              body: "You’ll be met by a volunteer or member who will welcome you. There is no dress code; come in whatever makes you feel comfortable.",
            },
            {
              title: '2. A Brief Introduction',
              body: "If it’s your first time, someone will spend a few minutes sharing the basic story of Meishu-sama and the purpose of our center. You are encouraged to ask any questions you have.",
            },
            {
              title: '3. Receiving Johrei',
              body: 'The highlight of most visits is receiving Johrei.',
              bullets: [
                'You will sit in a comfortable chair.',
                "A practitioner will sit facing you (usually about an arm's length away).",
                'They will hold their hand toward your forehead and upper body for 15-20 minutes.',
              ],
              experienceLabel: 'The Experience',
              experienceBody: "You don't need to do anything special, just relax. Most people close their eyes and enjoy the quiet stillness.",
            },
            {
              title: '4. A Moment of Beauty',
              body: 'After your session, we invite you to sit for a few moments, perhaps enjoy a cup of tea, or look at the flower arrangements and art in the center. We believe the afterglow of the Light is a perfect time for reflection.',
            },
            {
              title: '5. No Pressure',
              body: 'There is never any pressure to join or sign up for anything. You are welcome to visit once to try it out, or come back as often as you like.',
            },
          ],
          ctaTitle: 'You are welcome to come at your own pace',
          ctaBody: 'If you want to plan a first visit or ask a question before coming, we are happy to help.',
          ctaButton: 'Plan My First Visit',
        }

  const community =
    language === 'fr'
      ? {
          title: 'Rencontrez la communaute',
          intro:
            'Notre communaute est une tapisserie vivante de personnes de tous horizons, enseignants, artistes, parents et professionnels, unies par le desir commun d’etre une source de lumiere dans le monde.',
          valuesTitle: 'Ce que nous valorisons',
          values: [
            {
              title: 'Esprit de sincerite',
              body: 'Nous croyons que le vrai changement commence en nous. En affinant notre propre coeur, nous creons un effet de paix dans nos foyers et nos quartiers.',
            },
            {
              title: 'Culture de la beaute',
              body: 'Nous ne parlons pas seulement d’art, nous le vivons. Nos rencontres incluent souvent des arrangements floraux, de la musique et l’appreciation du monde naturel.',
            },
            {
              title: 'Connexion mondiale',
              body: 'Tout en nous reunissant dans des centres locaux, nous faisons partie d’un mouvement mondial de millions de personnes oeuvrant pour la vision de Meishu-sama d’un monde sans souffrance.',
            },
          ],
          comeTitle: 'Venez comme vous etes',
          comeBody:
            'Vous n’avez pas besoin de changer vos croyances ni d’avoir une experience spirituelle prealable pour nous rejoindre. Beaucoup de membres ont commence exactement ou vous etes maintenant: curieux et en recherche de quelque chose de plus. Que vous veniez pour une seance de Johrei de 15 minutes ou pour une journee de jardin communautaire, vous trouverez un environnement bienveillant ou chacun est etudiant de la Lumiere.',
        }
      : {
          title: 'Meet the Community',
          intro:
            'Our community is a vibrant tapestry of individuals from all walks of life, teachers, artists, parents, and professionals, united by a common desire to be a source of light in the world.',
          valuesTitle: 'What We Value',
          values: [
            {
              title: 'Spirit of Sincerity',
              body: 'We believe that true change starts within. By refining our own hearts, we create a ripple effect of peace in our homes and neighborhoods.',
            },
            {
              title: 'A Culture of Beauty',
              body: "We don't just talk about art; we live it. Our gatherings often feature flower arrangements, music, and appreciation for the natural world.",
            },
            {
              title: 'Global Connection',
              body: "While we meet in local centers, we are part of a global movement of millions who are working toward Meishu-sama's vision of a world without suffering.",
            },
          ],
          comeTitle: 'Come as You Are',
          comeBody:
            `You don't need to change your beliefs or have a background in spirituality to join us. Many of our members began exactly where you are now, curious and looking for something "more." Whether you join us for a 15-minute Johrei session or a community garden day, you will find a supportive environment where everyone is a student of the Light.`,
        }

  const labelProvince = (province: string) => copy.provinceLabels[province] ?? province
  const labelName = (name: string) => copy.nameLabels[name] ?? name
  const labelCity = (city: string) => copy.cityLabels[city] ?? city
  const labelNotes = (notes?: string) => {
    if (!notes) return notes
    return copy.notesByValue[notes] ?? notes
  }
  const labelType = (type: string) => {
    if (type === 'Center') return t.locations.types.center
    if (type === 'Group') return t.locations.types.group
    if (type === 'Coming soon') return t.locations.types.comingSoon
    return type
  }

  // Group locations by province
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

      {/* Intro Header */}
      <section className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-8xl font-serif text-deep-slate leading-tight">
            {copy.pageTitle}
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            {t.locations.intro}
          </p>
        </div>
      </section>

      {/* Regional Directory */}
      <Section py-24 className="bg-white">
        <div className="max-w-7xl mx-auto space-y-40 px-6">
          {regions.map((region) => (
            <div key={region} className="space-y-16">
              <div className="flex items-baseline gap-8">
                <h2 className="text-4xl md:text-6xl font-serif text-deep-slate tracking-tight">
                  {labelProvince(region)}
                </h2>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[region].map((loc) => (
                  <Card
                    key={loc.id}
                    title={labelName(loc.name)}
                    eyebrow={labelCity(loc.city)}
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
                      <p className="font-serif italic text-slate-500 text-lg leading-snug">
                        {loc.address || copy.regionalCircle}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 px-3 py-1 rounded-full">
                          {labelType(loc.type)}
                        </span>
                        {loc.notes && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-sage-mist text-sage-600 px-3 py-1 rounded-full">
                            {labelNotes(loc.notes)}
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

      <Section className="bg-white border-y border-[rgba(184,134,11,0.2)]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-sage-600">{firstVisit.kicker}</p>
            <h2 className="text-4xl md:text-6xl font-serif text-deep-slate">{firstVisit.title}</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600">{firstVisit.intro}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {firstVisit.steps.map((step) => (
              <Card key={step.title} title={step.title} className="rounded-sanctuary p-8">
                <p className="text-base leading-relaxed text-slate-600">{step.body}</p>
                {step.bullets ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
                    {step.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {step.experienceBody ? (
                  <p className="mt-4 text-sm leading-relaxed text-slate-700">
                    <span className="font-semibold">{step.experienceLabel}:</span> {step.experienceBody}
                  </p>
                ) : null}
              </Card>
            ))}
          </div>

          <div className="rounded-sanctuary border border-[rgba(184,134,11,0.2)] bg-sanctuary-100 p-8 text-center">
            <h3 className="text-2xl md:text-3xl font-serif text-deep-slate">{firstVisit.ctaTitle}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{firstVisit.ctaBody}</p>
            <div className="mt-6">
              <ButtonLink to="/contact" variant="accent">{firstVisit.ctaButton}</ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-sanctuary-100 border-y border-[rgba(184,134,11,0.2)]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif text-deep-slate">{community.title}</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600">{community.intro}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif text-deep-slate">{community.valuesTitle}</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {community.values.map((value) => (
                <Card key={value.title} title={value.title} className="rounded-sanctuary bg-white p-8">
                  <p className="text-base leading-relaxed text-slate-600">{value.body}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="rounded-sanctuary border border-[rgba(184,134,11,0.2)] bg-white p-8">
            <h3 className="text-2xl md:text-3xl font-serif text-deep-slate">{community.comeTitle}</h3>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{community.comeBody}</p>
          </div>
        </div>
      </Section>

      {/* Missing City CTA */}
      <Section className="pb-40">
        <div className="relative max-w-5xl mx-auto bg-deep-slate rounded-sanctuary-lg p-16 md:p-24 text-center text-white overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sage-600/10 to-transparent" />
          <div className="space-y-8 relative">
            <h2 className="text-4xl md:text-6xl font-serif">{copy.title}</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto font-serif italic">
              {copy.body}
            </p>
            <ButtonLink to="/contact" variant="accent" className="mt-8 h-16">
              {copy.button}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
