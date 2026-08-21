import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { grantContent, healthDisclosure } from '../data/grantContent'
import { usePageMeta } from '../hooks/usePageMeta'

const pageCopy = {
  en: {
    kicker: 'Our Spiritual Foundation',
    title: 'The Three Pillars',
    intro: 'Johrei, Natural Farming, and Art and the Appreciation of Beauty are complementary expressions of our faith and mission. Together, they encourage spiritual development, respect for nature, creativity, gratitude, service, and more harmonious communities.',
    togetherTitle: 'Three Practices, One Shared Purpose',
    togetherBody: 'Johrei encourages prayer and inner reflection. Natural Farming deepens respect for the soil, food, and the natural world. Art and the Appreciation of Beauty nurture sensitivity, creativity, and gratitude. Practiced together, the three pillars help bring spiritual values into everyday life and community service.',
    johreiTitle: 'Johrei — Spiritual Well-Being',
    johreiIntro: 'The word Johrei may be understood as “purification of the spirit.” Within our faith tradition, a qualified member offers Johrei through prayer and the symbolic transmission of Divine Light. Participants are invited to use this quiet time for gratitude, inner reflection, and spiritual development. No particular sensation or immediate experience is required.',
    johreiPractice: 'Johrei is offered without charge as spiritual support. It is open to people of all backgrounds and is practiced as a path of gratitude, service, spiritual refinement, and greater harmony in everyday life.',
    farmingTitle: 'Natural Farming — Living in Harmony with Nature',
    farmingBody: 'Natural Farming is inspired by Meishu-Sama’s teachings about respecting nature and allowing the natural capacity of the soil to be expressed. In the United States, members develop this practice through gardens at participating Johrei Centers and in residential settings. Activities may include hands-on gardening, learning about soil and cultivation, and education that encourages thoughtful food choices, including a preference, when accessible, for naturally or organically grown fruits and vegetables.',
    farmingPurpose: 'This pillar encourages gratitude for food, careful stewardship of the earth, and a closer relationship between people, soil, and the natural world.',
    beautyTitle: 'Art and the Appreciation of Beauty — Enriching Life Through Beauty',
    beautyBody: 'Meishu-Sama taught that contact with beauty in nature, art, flowers, music, and everyday surroundings can refine human sensitivity and encourage gratitude, creativity, and harmony. This pillar invites people to make beauty part of daily life and community experience.',
    sangetsuBody: 'Sangetsu Ikebana is one practical expression of this pillar through floral arrangement, classes, and workshops. It is one expression of the organization’s appreciation of beauty and does not represent the full scope of its work.',
    sangetsuLink: 'Visit Sangetsu Ikebana USA',
    belief: 'These descriptions express the spiritual beliefs and values of Miroku Association USA and are not presented as universal scientific or medical claims.',
    newKicker: 'New Here',
    newTitle: 'New to Miroku Association USA?',
    newBody: 'A simple path to learn about the three pillars, plan a welcoming first visit, and connect with a Johrei Center.',
    cards: [
      ['Learn About Johrei', 'Understand this prayer-based spiritual practice and what participants may expect.', 'Read About Johrei', '#johrei'],
      ['Plan Your First Visit', 'Learn what happens during a calm, welcoming visit to one of our centers.', 'First Visit', '/first-visit'],
      ['Find a Johrei Center', 'Connect with the national headquarters or a participating center near you.', 'View Locations', '/locations'],
    ],
  },
  es: {
    kicker: 'Nuestra base espiritual', title: 'Los Tres Pilares',
    intro: 'Johrei, Agricultura Natural y Arte y Apreciación de la Belleza son expresiones complementarias de nuestra fe y misión. Juntos fomentan el desarrollo espiritual, el respeto por la naturaleza, la creatividad, la gratitud, el servicio y comunidades más armoniosas.',
    togetherTitle: 'Tres prácticas, un propósito compartido', togetherBody: 'Johrei fomenta la oración y la reflexión interior. La Agricultura Natural profundiza el respeto por el suelo, los alimentos y la naturaleza. El Arte y la Apreciación de la Belleza cultivan sensibilidad, creatividad y gratitud. Juntos llevan los valores espirituales a la vida cotidiana y al servicio comunitario.',
    johreiTitle: 'Johrei — Bienestar espiritual', johreiIntro: 'La palabra Johrei puede entenderse como “purificación del espíritu”. Dentro de nuestra tradición de fe, un miembro calificado ofrece Johrei mediante la oración y la transmisión simbólica de la Luz Divina. Los participantes pueden usar este momento tranquilo para la gratitud, la reflexión interior y el desarrollo espiritual. No se requiere ninguna sensación o experiencia inmediata en particular.',
    johreiPractice: 'Johrei se ofrece gratuitamente como apoyo espiritual. Está abierto a personas de todos los orígenes y se practica como un camino de gratitud, servicio, refinamiento espiritual y mayor armonía en la vida cotidiana.',
    farmingTitle: 'Agricultura Natural — Vivir en armonía con la naturaleza', farmingBody: 'La Agricultura Natural se inspira en las enseñanzas de Meishu-Sama sobre respetar la naturaleza y permitir que se manifieste la capacidad natural del suelo. En los Estados Unidos, miembros desarrollan esta práctica mediante huertas en Centros Johrei participantes y en residencias. Las actividades pueden incluir jardinería práctica, aprendizaje sobre el suelo y el cultivo y educación para decisiones alimentarias conscientes, incluida la preferencia, cuando sea accesible, por frutas y vegetales cultivados natural u orgánicamente.',
    farmingPurpose: 'Este pilar fomenta la gratitud por los alimentos, el cuidado responsable de la tierra y una relación más cercana entre las personas, el suelo y la naturaleza.',
    beautyTitle: 'Arte y Belleza — Enriquecer la vida mediante la belleza', beautyBody: 'Meishu-Sama enseñó que el contacto con la belleza en la naturaleza, el arte, las flores, la música y los espacios cotidianos puede refinar la sensibilidad y fomentar gratitud, creatividad y armonía. Este pilar invita a integrar la belleza en la vida diaria y comunitaria.',
    sangetsuBody: 'Sangetsu Ikebana es una expresión práctica de este pilar mediante arreglos florales, clases y talleres. Es una de las expresiones de la apreciación de la belleza y no representa toda la labor de la organización.', sangetsuLink: 'Visitar Sangetsu Ikebana USA',
    belief: 'Estas descripciones expresan las creencias y valores espirituales de Miroku Association USA y no se presentan como afirmaciones científicas o médicas universales.',
    newKicker: 'Nuevo aquí', newTitle: '¿Nuevo en Miroku Association USA?', newBody: 'Un camino sencillo para conocer los tres pilares, preparar una primera visita y conectarse con un Centro Johrei.',
    cards: [['Conozca el Johrei', 'Comprenda esta práctica espiritual basada en la oración y qué pueden esperar los participantes.', 'Leer sobre Johrei', '#johrei'], ['Prepare su primera visita', 'Conozca qué sucede durante una visita tranquila y acogedora.', 'Primera visita', '/first-visit'], ['Encuentre un Centro Johrei', 'Conéctese con la sede nacional o un centro participante cercano.', 'Ver ubicaciones', '/locations']],
  },
  pt: {
    kicker: 'Nossa base espiritual', title: 'Os Três Pilares',
    intro: 'Johrei, Agricultura Natural e Arte e Apreciação do Belo são expressões complementares de nossa fé e missão. Juntos, incentivam desenvolvimento espiritual, respeito pela natureza, criatividade, gratidão, serviço e comunidades mais harmoniosas.',
    togetherTitle: 'Três práticas, um propósito compartilhado', togetherBody: 'O Johrei incentiva a oração e a reflexão interior. A Agricultura Natural aprofunda o respeito pelo solo, pelos alimentos e pela natureza. A Arte e a Apreciação do Belo cultivam sensibilidade, criatividade e gratidão. Juntos, os três pilares levam valores espirituais à vida cotidiana e ao serviço comunitário.',
    johreiTitle: 'Johrei — Bem-estar espiritual', johreiIntro: 'A palavra Johrei pode ser compreendida como “purificação do espírito”. Em nossa tradição de fé, um membro qualificado ministra Johrei por meio da oração e da transmissão simbólica da Luz Divina. Os participantes podem usar esse momento tranquilo para gratidão, reflexão interior e desenvolvimento espiritual. Não é necessária nenhuma sensação ou experiência imediata específica.',
    johreiPractice: 'O Johrei é oferecido gratuitamente como apoio espiritual. É aberto a pessoas de todas as origens e praticado como um caminho de gratidão, serviço, aprimoramento espiritual e maior harmonia na vida cotidiana.',
    farmingTitle: 'Agricultura Natural — Viver em harmonia com a natureza', farmingBody: 'A Agricultura Natural é inspirada nos ensinamentos de Meishu-Sama sobre respeitar a natureza e permitir que a capacidade natural do solo se manifeste. Nos Estados Unidos, membros desenvolvem essa prática por meio de hortas em Centros Johrei participantes e em residências. As atividades podem incluir jardinagem prática, aprendizado sobre solo e cultivo e educação para escolhas alimentares conscientes, incluindo preferência, quando acessível, por frutas e vegetais cultivados natural ou organicamente.',
    farmingPurpose: 'Este pilar incentiva a gratidão pelos alimentos, o cuidado responsável com a terra e uma relação mais próxima entre pessoas, solo e natureza.',
    beautyTitle: 'Arte e Belo — Enriquecendo a vida por meio da beleza', beautyBody: 'Meishu-Sama ensinou que o contato com a beleza na natureza, na arte, nas flores, na música e nos espaços cotidianos pode refinar a sensibilidade e incentivar gratidão, criatividade e harmonia. Este pilar convida as pessoas a integrar a beleza à vida diária e comunitária.',
    sangetsuBody: 'O Sangetsu Ikebana é uma expressão prática desse pilar por meio de arranjos florais, aulas e workshops. É uma das expressões da apreciação do Belo e não representa toda a atuação da organização.', sangetsuLink: 'Visitar Sangetsu Ikebana USA',
    belief: 'Estas descrições expressam as crenças e os valores espirituais da Miroku Association USA e não são apresentadas como afirmações científicas ou médicas universais.',
    newKicker: 'Novo por aqui', newTitle: 'Novo na Miroku Association USA?', newBody: 'Um caminho simples para conhecer os três pilares, preparar uma primeira visita e se conectar com um Centro Johrei.',
    cards: [['Conheça o Johrei', 'Entenda esta prática espiritual baseada na oração e o que os participantes podem esperar.', 'Ler sobre Johrei', '#johrei'], ['Prepare sua primeira visita', 'Saiba o que acontece durante uma visita tranquila e acolhedora.', 'Primeira visita', '/first-visit'], ['Encontre um Centro Johrei', 'Conecte-se com a sede nacional ou com um centro participante próximo.', 'Ver locais', '/locations']],
  },
} as const

export default function ThreePillars() {
  const { language } = useTranslation()
  const { hash } = useLocation()
  const copy = pageCopy[language]
  const grantCopy = grantContent[language]
  usePageMeta({ title: `${copy.title} | Miroku Association USA`, description: copy.intro })

  useEffect(() => {
    if (!hash) return
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [hash])

  return <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
    <section className="public-hero"><div className="public-hero-grid"><div className="public-hero-copy">
      <p className="public-eyebrow">{copy.kicker}</p><h1 className="public-title">{copy.title}</h1><p className="public-body">{copy.intro}</p>
    </div><div className="public-hero-note"><p className="public-eyebrow">{copy.togetherTitle}</p><p className="mt-4 leading-8">{copy.togetherBody}</p></div></div></section>

    <Section className="bg-white"><div className="mx-auto max-w-6xl space-y-8">
      <div id="johrei" className="scroll-mt-28"><Card title={copy.johreiTitle}><p className="text-lg leading-9 text-slate-600">{copy.johreiIntro}</p><p className="mt-5 text-base leading-8 text-slate-600">{copy.johreiPractice}</p><p className="mt-6 rounded-2xl border border-[rgba(141,107,38,0.18)] bg-sanctuary-100 p-5 text-sm leading-7">{healthDisclosure[language]}</p></Card></div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div id="natural-farming" className="scroll-mt-28"><Card title={copy.farmingTitle} className="h-full"><p className="text-base leading-8 text-slate-600">{copy.farmingBody}</p><p className="mt-5 text-base leading-8 text-slate-600">{copy.farmingPurpose}</p></Card></div>
        <div id="art-beauty" className="scroll-mt-28"><Card title={copy.beautyTitle} className="h-full"><p className="text-base leading-8 text-slate-600">{copy.beautyBody}</p><p className="mt-5 text-base leading-8 text-slate-600">{copy.sangetsuBody}</p><a href="https://www.usasangetsu.org/" target="_blank" rel="noreferrer" className="mt-6 inline-flex text-sm font-semibold text-sage-700 underline decoration-sage-300 underline-offset-4">{copy.sangetsuLink}</a></Card></div>
      </div>
      <p className="rounded-2xl border border-[rgba(141,107,38,0.16)] bg-sanctuary-100 p-6 text-center text-sm leading-7 text-slate-600">{copy.belief}</p>
    </div></Section>

    <Section className="section-wash"><div className="mx-auto max-w-6xl"><div className="text-center"><p className="public-eyebrow">{copy.newKicker}</p><h2 className="mt-4 text-5xl leading-none text-[#314343] md:text-6xl">{copy.newTitle}</h2><p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-slate-500">{copy.newBody}</p></div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">{copy.cards.map(([title, body, cta, to], index) => <article key={title} className="rounded-[28px] border border-white/70 bg-white px-7 py-7 shadow-[0_26px_60px_-44px_rgba(60,52,39,0.3)]"><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">0{index + 1}</p><h3 className="mt-5 text-[2.1rem] leading-none text-[#314343]">{title}</h3><p className="mt-4 text-base leading-8 text-slate-500">{body}</p>{to.startsWith('#') ? <a href={to} className="mt-8 inline-flex text-[10px] font-semibold uppercase tracking-[0.24em] text-sage-600">{cta}</a> : <Link to={to} className="mt-8 inline-flex text-[10px] font-semibold uppercase tracking-[0.24em] text-sage-600">{cta}</Link>}</article>)}</div>
    </div></Section>

    <Section className="bg-white"><div className="mx-auto max-w-4xl rounded-[32px] bg-[linear-gradient(140deg,#1f2933_0%,#203831_100%)] px-8 py-12 text-center text-white"><h2 className="text-4xl font-serif md:text-5xl">{grantCopy.pillarsTitle}</h2><p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/75">{grantCopy.pillarsIntro}</p><div className="pt-8"><ButtonLink to="/locations" variant="accent">{grantCopy.locationsCta}</ButtonLink></div></div></Section>
  </div>
}
