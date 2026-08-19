import { useTranslation } from '../context/TranslationContext'
import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { usePageMeta } from '../hooks/usePageMeta'
import { siteConfig } from '../config/siteConfig'
import { grantContent, nonprofitStatement } from '../data/grantContent'

export default function About() {
  const { language } = useTranslation()
  const grantCopy = grantContent[language]

  const copy =
    language === 'es'
      ? {
          kicker: 'Sobre nosotros',
          title: `Bienvenido a ${siteConfig.organizationName}`,
          intro:
            'Un movimiento espiritual dedicado al establecimiento del Paraíso en la Tierra mediante salud, prosperidad, paz y el refinamiento del corazón humano.',
          core: 'Orientación central',
          coreNote:
            'Fundada en 1935 por Meishu-sama, la iglesia guía a las personas hacia una vida en la que la verdad, la virtud y la belleza se practican y no solo se admiran.',
          story: [
            'La Iglesia Mesiánica Mundial es un movimiento espiritual dedicado al establecimiento del Paraíso en la Tierra: un mundo definido por la salud, la prosperidad y la paz. Fundada en 1935 por Meishu-sama (Mokichi Okada), servimos como partera de una nueva civilización, guiando a la humanidad en la transición de la Era de la Noche hacia la Era de la Luz.',
            'Nuestro camino se apoya en tres pilares: Verdad, Virtud y Belleza. A través de la práctica del Johrei, la transmisión de la Luz Divina, buscamos disolver las nubes espirituales que se entienden como la causa profunda de la enfermedad y del conflicto. Al purificar el espíritu, restauramos el equilibrio en el cuerpo y en el mundo que nos rodea.',
            'En Estados Unidos, damos la bienvenida a todos para experimentar esta transformación. Ya sea por medio del Johrei, del estudio de las enseñanzas sagradas o de la apreciación del arte y la naturaleza, nuestra misión es ayudar a cada persona a despertar a su naturaleza divina y contribuir a una civilización de luz.',
          ],
          started: 'Primeros pasos',
          startedTitle: 'Llevando la Luz al hogar',
          startedIntro:
            'No es necesario ser un estudioso ni un practicante de toda la vida para comenzar. Estos principios están hechos para vivirse en la vida diaria.',
          actionLabel: 'Acción:',
          centerCta: 'Encuentre un centro cercano',
          continueTitle: 'Siga explorando',
          continueIntro:
            'Conozca más sobre Johrei, nuestras enseñanzas y cómo vivir este camino en Estados Unidos.',
          contact: 'Contacto',
        }
      : language === 'pt'
        ? {
            kicker: 'Sobre',
            title: `Bem-vindo a ${siteConfig.organizationName}`,
            intro:
              'Um movimento espiritual dedicado ao estabelecimento do Paraíso Terrestre por meio da saúde, prosperidade, paz e do refinamento do coração humano.',
            core: 'Orientação central',
            coreNote:
              'Fundada em 1935 por Meishu-sama, a igreja orienta as pessoas para uma vida em que verdade, virtude e beleza são praticadas, e não apenas admiradas.',
            story: [
              'A Igreja Messiânica Mundial é um movimento espiritual dedicado ao estabelecimento do Paraíso Terrestre: um mundo definido por saúde, prosperidade e paz. Fundada em 1935 por Meishu-sama (Mokichi Okada), servimos como parteira de uma nova civilização, guiando a humanidade na transição da Era da Noite para a Era da Luz.',
              'Nosso caminho é sustentado por três pilares: Verdade, Virtude e Beleza. Por meio da prática do Johrei, a transmissão da Luz Divina, buscamos dissolver as nuvens espirituais compreendidas como a causa profunda das enfermidades e dos conflitos. Ao purificar o espírito, restauramos o equilíbrio no corpo e no mundo ao nosso redor.',
              'Nos Estados Unidos, acolhemos todos para experimentar essa transformação. Seja por meio do Johrei, do estudo dos ensinamentos sagrados ou da apreciação da arte e da natureza, nossa missão é ajudar cada pessoa a despertar para sua natureza divina e contribuir para uma civilização de luz.',
            ],
            started: 'Primeiros passos',
            startedTitle: 'Levando a Luz para casa',
            startedIntro:
              'Você não precisa ser estudioso nem praticante de longa data para começar. Esses princípios devem ser vividos no cotidiano.',
            actionLabel: 'Ação:',
            centerCta: 'Encontre um centro próximo',
            continueTitle: 'Continue explorando',
            continueIntro:
              'Saiba mais sobre Johrei, nossos ensinamentos e como viver este caminho nos Estados Unidos.',
            contact: 'Contato',
          }
        : {
            kicker: 'About',
            title: `Welcome to ${siteConfig.shortName}`,
            intro:
              'A spiritual movement dedicated to the establishment of Paradise on Earth through health, prosperity, peace, and the refinement of the human heart.',
            core: 'Core Orientation',
            coreNote:
              'Founded in 1935 by Meishu-sama, the church guides people toward a life where truth, virtue, and beauty are practiced rather than merely admired.',
            story: [
              'The World Messianic Church is a spiritual movement dedicated to the establishment of Paradise on Earth: a world defined by health, prosperity, and peace. Founded in 1935 by Meishu-sama (Mokichi Okada), we serve as a midwife to world civilization, guiding humanity through the transition from the Age of Night into the Daylight Age.',
              'Our path is built upon three pillars: Truth, Virtue, and Beauty. Through Johrei, study, art, nature, and service, we seek spiritual refinement and greater harmony in everyday life.',
              'In the United States, we welcome all to experience this transformation. Whether through Johrei, the study of sacred teachings, or the appreciation of art and nature, our mission is to help every individual awaken to their divine nature and contribute to a civilization of light.',
            ],
            started: 'Getting Started',
            startedTitle: 'Bringing the Light Home',
            startedIntro:
              'You do not need to be a scholar or a lifelong practitioner to begin. These principles are meant to be lived in ordinary daily life.',
            actionLabel: 'The Action:',
            centerCta: 'Find a Center Near You',
            continueTitle: 'Continue Exploring',
            continueIntro:
              'Learn more about Johrei, our teachings, and how to experience this path in the United States.',
            contact: 'Contact',
          }

  const gettingStarted =
    language === 'es'
      ? [
          {
            title: 'Practique el arte de la apreciación',
            body: 'Meishu-sama enseñó que la gratitud es una de las formas más rápidas de disipar nubes espirituales y recuperar claridad en la vida diaria.',
            action:
              'Cree el hábito de las “pequeñas alegrías”. Cada mañana o noche identifique algo bello que haya visto o vivido.',
          },
          {
            title: 'Cree un rincón de belleza',
            body: 'La belleza purifica tanto el ambiente como la mente. Incluso un espacio sencillo puede convertirse en un prototipo de paraíso.',
            action:
              'Coloque una flor fresca donde pueda verla con frecuencia y tómese un momento cada día para apreciarla.',
          },
          {
            title: 'Busque una sesión de Johrei',
            body: 'La práctica de Johrei se comprende mejor por experiencia directa que por explicación abstracta.',
            action:
              'Visite un centro y reciba Johrei en un ambiente sereno y acogedor. Muchos visitantes describen calidez y ligereza interior.',
          },
          {
            title: 'Elija alimentos vivos',
            body: 'La armonía con la naturaleza también incluye lo que recibimos de la tierra y la consciencia con la que lo hacemos.',
            action:
              'Empiece con un ingrediente natural u orgánico en una comida y reconozca la energía del suelo, del sol y del cultivo.',
          },
        ]
      : language === 'pt'
        ? [
            {
              title: 'Pratique a arte da gratidão',
              body: 'Meishu-sama ensinou que a gratidão é um dos caminhos mais rápidos para dissipar nuvens espirituais e restaurar clareza no cotidiano.',
              action:
                'Crie o hábito das “pequenas alegrias”. Todas as manhãs ou noites, identifique algo belo que você viu ou viveu.',
            },
            {
              title: 'Crie um canto de beleza',
              body: 'A beleza purifica tanto o ambiente quanto a mente. Mesmo um espaço simples pode se tornar um protótipo do paraíso.',
              action:
                'Coloque uma flor fresca em um lugar visível e reserve alguns momentos por dia para apreciá-la.',
            },
            {
              title: 'Busque uma sessão de Johrei',
              body: 'A prática do Johrei é melhor compreendida pela experiência direta do que por explicações abstratas.',
              action:
                'Visite um centro e receba Johrei em um ambiente calmo e acolhedor. Muitos descrevem calor e leveza espiritual depois.',
            },
            {
              title: 'Escolha alimentos vivos',
              body: 'A harmonia com a natureza também inclui o que recebemos da terra e a consciência com que recebemos isso.',
              action:
                'Comece com um ingrediente natural ou orgânico em uma refeição e reconheça a energia do solo, do sol e do cultivo.',
            },
          ]
        : [
          {
            title: 'Practice the Art of Appreciation',
            body: 'Meishu-sama taught that gratitude is one of the fastest ways to clear spiritual clouds and restore clarity to daily life.',
      action:
        'Start a "Small Joys" habit. Each morning or evening, identify one beautiful thing you saw or experienced, and let that attention reshape your inner atmosphere.',
    },
    {
      title: 'Create a Corner of Beauty',
      body: 'Beauty purifies environment as well as mind. Even a modest, intentional space can become a prototype of paradise.',
      action:
        'Place a fresh flower where you will see it often. Pause for a few moments each day to appreciate its life, color, and silent presence.',
    },
    {
      title: 'Seek a Johrei Session',
      body: 'The practice of Johrei is best understood through direct experience rather than abstract explanation.',
      action:
        'Visit a center and receive Johrei in a calm, welcoming setting. Many newcomers describe warmth, ease, and a lightness of spirit afterward.',
    },
    {
      title: 'Choose Living Foods',
      body: 'Harmony with nature also includes what we receive from the earth and how consciously we receive it.',
      action:
        'Begin with one naturally grown or organic ingredient in a meal and take a moment to recognize the energy of soil, sun, and cultivation behind it.',
    },
        ]

  usePageMeta({
    title: `${copy.kicker} | ${siteConfig.organizationName}`,
    description:
      'The World Messianic Church is a spiritual movement dedicated to the establishment of Paradise on Earth: a world defined by health, prosperity, and peace.',
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="public-hero">
        <div className="public-hero-grid">
          <div className="public-hero-copy">
            <p className="public-eyebrow">{copy.kicker}</p>
            <h1 className="public-title">{copy.title}</h1>
            <p className="public-body">{copy.intro}</p>
          </div>
          <div className="public-hero-note">
            <p className="public-eyebrow">{copy.core}</p>
            <p className="mt-4">{copy.coreNote}</p>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-5xl border border-[rgba(15,23,42,0.08)] bg-white p-8 md:p-10">
          <div className="space-y-6 text-lg leading-relaxed text-slate-700">
            {copy.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section className="section-wash border-y border-[rgba(141,107,38,0.12)]">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <Card title={grantCopy.whoTitle}><p className="text-base leading-8 text-slate-600">{grantCopy.who}</p><p className="mt-4 text-base leading-8 text-slate-600">{grantCopy.welcome}</p><p className="mt-5 rounded-2xl border border-[rgba(141,107,38,0.2)] bg-sanctuary-100 p-5 text-base font-medium leading-7 text-deep-slate">{nonprofitStatement[language]}</p></Card>
          <Card title={grantCopy.missionTitle}><p className="text-base leading-8 text-slate-600">{grantCopy.mission}</p></Card>
        </div>
      </Section>

      <Section className="section-wash border-y border-[rgba(141,107,38,0.12)]">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-sage-600">{copy.started}</p>
            <h2 className="text-4xl font-serif md:text-5xl">{copy.startedTitle}</h2>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
              {copy.startedIntro}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {gettingStarted.map((item) => (
              <Card key={item.title} title={item.title} className="h-full">
                <p className="text-base leading-relaxed text-slate-600">{item.body}</p>
                <p className="mt-4 text-base leading-relaxed text-slate-700">
                  <span className="font-semibold">{copy.actionLabel}</span> {item.action}
                </p>
                {['Seek a Johrei Session', 'Busque una sesión de Johrei', 'Busque uma sessão de Johrei'].includes(item.title) ? (
                  <div className="mt-6">
                    <ButtonLink to="/locations" variant="accent">
                      {copy.centerCta}
                    </ButtonLink>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-sanctuary-100">
        <div className="public-band mx-auto max-w-4xl px-8 py-12 text-center md:px-12">
          <h2 className="text-4xl font-serif md:text-5xl">{copy.continueTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8">
            {copy.continueIntro}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/johrei" variant="secondary" className="bg-white text-deep-slate hover:bg-[#f3ede2]">
              Johrei
            </ButtonLink>
            <ButtonLink to="/meishu-sama" variant="outline" className="border-white/30 bg-white/8 text-white hover:bg-white/12 hover:text-white">
              Meishu-Sama
            </ButtonLink>
            <ButtonLink to="/contact" variant="accent">
              {copy.contact}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
