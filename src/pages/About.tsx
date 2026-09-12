import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { grantContent, healthDisclosure, nonprofitStatement } from '../data/grantContent'
import { usePageMeta } from '../hooks/usePageMeta'
import { siteConfig } from '../config/siteConfig'

export default function About() {
  const { language } = useTranslation()
  const grantCopy = grantContent[language]
  const copy = language === 'es' ? {
    kicker: 'Sobre nosotros', title: `Bienvenido a ${siteConfig.shortName}`,
    intro: 'Una organización sin fines de lucro inspirada por las enseñanzas de Meishu-Sama y dedicada al desarrollo espiritual, el respeto por la naturaleza, la creatividad, el servicio y comunidades más armoniosas.',
    johrei: 'Johrei es una práctica espiritual basada en la oración y central en nuestra tradición de fe. Mediante la oración y la transmisión simbólica de la Luz Divina, los participantes buscan refinamiento espiritual, gratitud, reflexión interior y mayor armonía en la vida cotidiana. No se requiere ninguna sensación o experiencia inmediata en particular.',
    farming: 'La Agricultura Natural se inspira en las enseñanzas de Meishu-Sama sobre respetar la naturaleza y permitir que se manifieste la capacidad natural del suelo. En los Estados Unidos, miembros desarrollan esta práctica mediante huertas en Centros Johrei participantes y en residencias. Las actividades pueden incluir jardinería práctica, aprendizaje sobre el suelo y el cultivo y educación para decisiones alimentarias conscientes, incluida la preferencia, cuando sea accesible, por frutas y vegetales cultivados natural u orgánicamente.',
    beauty: 'Meishu-Sama enseñó que el contacto con la belleza en la naturaleza, el arte, las flores y los espacios cotidianos puede refinar la sensibilidad y fomentar gratitud, creatividad y armonía. El Ikebana Sangetsu es una expresión práctica de este pilar mediante arreglos florales, clases y talleres; no representa por sí solo toda la labor de la organización.',
    belief: 'Estas descripciones expresan las creencias y valores espirituales de nuestra organización y no se presentan como afirmaciones científicas o médicas universales.',
    sangetsu: 'Visitar Ikebana Sangetsu USA', connections: 'Conexiones internacionales y Suelos Sagrados',
    sacred: 'Los Suelos Sagrados de Atami en Japón, Guarapiranga en Brasil y Saraburi en Tailandia son referencias de nuestra tradición internacional, donde fe, naturaleza, arte y belleza se expresan en espacios dedicados a la oración y la apreciación.',
    continueTitle: 'Conozca nuestro trabajo en los Estados Unidos', programs: 'Programas Comunitarios', contact: 'Contacto',
  } : language === 'pt' ? {
    kicker: 'Sobre', title: `Bem-vindo à ${siteConfig.shortName}`,
    intro: 'Uma organização sem fins lucrativos inspirada nos ensinamentos de Meishu-Sama e dedicada ao desenvolvimento espiritual, respeito pela natureza, criatividade, serviço e comunidades mais harmoniosas.',
    johrei: 'Johrei é uma prática espiritual baseada na oração e central em nossa tradição de fé. Por meio da oração e da transmissão simbólica da Luz Divina, os participantes buscam aprimoramento espiritual, gratidão, reflexão interior e maior harmonia na vida cotidiana. Não é necessária nenhuma sensação ou experiência imediata específica.',
    farming: 'A Agricultura Natural é inspirada nos ensinamentos de Meishu-Sama sobre respeitar a natureza e permitir que a capacidade natural do solo se manifeste. Nos Estados Unidos, membros desenvolvem essa prática por meio de hortas em Centros Johrei participantes e em residências. As atividades podem incluir jardinagem prática, aprendizado sobre solo e cultivo e educação para escolhas alimentares conscientes, incluindo preferência, quando acessível, por frutas e vegetais cultivados natural ou organicamente.',
    beauty: 'Meishu-Sama ensinou que o contato com a beleza na natureza, arte, flores e espaços cotidianos pode refinar a sensibilidade e incentivar gratidão, criatividade e harmonia. O Ikebana Sangetsu é uma expressão prática desse pilar por meio de arranjos florais, aulas e workshops; ele não representa sozinho toda a atuação da organização.',
    belief: 'Essas descrições expressam as crenças e os valores espirituais de nossa organização e não são apresentadas como afirmações científicas ou médicas universais.',
    sangetsu: 'Visitar Ikebana Sangetsu USA', connections: 'Conexões internacionais e Solos Sagrados',
    sacred: 'Os Solos Sagrados de Atami no Japão, Guarapiranga no Brasil e Saraburi na Tailândia são referências de nossa tradição internacional, onde fé, natureza, arte e beleza se expressam em espaços dedicados à oração e à apreciação.',
    continueTitle: 'Conheça nosso trabalho nos Estados Unidos', programs: 'Programas Comunitários', contact: 'Contato',
  } : {
    kicker: 'About', title: `Welcome to ${siteConfig.shortName}`,
    intro: 'A nonprofit organization inspired by the teachings of Meishu-Sama and dedicated to spiritual development, respect for nature, creativity, service, and more harmonious communities.',
    johrei: 'Johrei is a prayer-based spiritual practice central to our faith tradition. Through prayer and the symbolic transmission of Divine Light, participants seek spiritual refinement, gratitude, inner reflection, and greater harmony in everyday life. No particular sensation or immediate experience is required.',
    farming: 'Natural Farming is inspired by Meishu-Sama’s teachings about respecting nature and allowing the natural capacity of the soil to be expressed. In the United States, members are developing this practice through gardens at participating Johrei Centers and in residential settings. Activities may include hands-on gardening, learning about soil and cultivation, and education that encourages thoughtful food choices, including a preference, when accessible, for naturally or organically grown fruits and vegetables.',
    beauty: 'Meishu-Sama taught that contact with beauty in nature, art, flowers, and everyday surroundings can refine human sensitivity and encourage gratitude, creativity, and harmony. Sangetsu Ikebana is one practical expression of this pillar through floral arrangement, classes, and workshops; it does not represent the full scope of the organization’s work.',
    belief: 'These descriptions express our organization’s spiritual beliefs and values and are not presented as universal scientific or medical claims.',
    sangetsu: 'Visit Ikebana Sangetsu USA', connections: 'International Connections and Sacred Grounds',
    sacred: 'The Sacred Grounds of Atami in Japan, Guarapiranga in Brazil, and Saraburi in Thailand are references within our international tradition, where faith, nature, art, and beauty are expressed through places dedicated to prayer and appreciation.',
    continueTitle: 'Explore our work in the United States', programs: 'Community Programs', contact: 'Contact Us',
  }

  const pillarBodies = [copy.johrei, copy.farming, copy.beauty]
  usePageMeta({ title: `${copy.kicker} | ${siteConfig.organizationName}`, description: copy.intro })

  return <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
    <section className="public-hero"><div className="public-hero-grid"><div className="public-hero-copy">
      <p className="public-eyebrow">{copy.kicker}</p><h1 className="public-title">{copy.title}</h1><p className="public-body">{copy.intro}</p>
    </div><div className="public-hero-note"><p className="public-eyebrow">{grantCopy.missionTitle}</p><p className="mt-4">{grantCopy.mission}</p></div></div></section>

    <Section className="bg-white"><div className="mx-auto max-w-6xl">
      <div className="text-center"><p className="public-eyebrow">{grantCopy.pillarsTitle}</p><p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">{grantCopy.pillarsIntro}</p></div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">{grantCopy.pillars.map(([title], index) => <Card key={title} title={title} className="h-full">
        <p className="text-base leading-8 text-slate-600">{pillarBodies[index]}</p>
        {index === 0 ? <p className="mt-5 rounded-2xl border border-[rgba(141,107,38,0.18)] bg-sanctuary-100 p-5 text-sm leading-7 text-deep-slate">{healthDisclosure[language]}</p> : null}
        {index === 2 ? <a href="https://www.usasangetsu.org/" target="_blank" rel="noreferrer" className="mt-6 inline-flex text-sm font-semibold text-sage-700 underline decoration-sage-300 underline-offset-4">{copy.sangetsu}</a> : null}
      </Card>)}</div>
      <p className="mx-auto mt-8 max-w-4xl rounded-2xl border border-[rgba(141,107,38,0.16)] bg-sanctuary-100 p-6 text-center text-sm leading-7 text-slate-600">{copy.belief}</p>
    </div></Section>

    <Section className="section-wash"><div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card title={copy.connections}><p className="text-base leading-8 text-slate-600">{copy.sacred}</p></Card>
      <Card title={grantCopy.internationalTitle}><p className="text-base leading-8 text-slate-600">{grantCopy.internationalBody}</p><p className="mt-5 text-base leading-8 text-slate-600">{grantCopy.independenceBody}</p></Card>
    </div></Section>

    <Section className="bg-white"><div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
      <Card title={grantCopy.whoTitle}><p className="text-base leading-8 text-slate-600">{grantCopy.who}</p><p className="mt-4 text-base leading-8 text-slate-600">{grantCopy.welcome}</p><p className="mt-5 rounded-2xl border border-[rgba(141,107,38,0.2)] bg-sanctuary-100 p-5 text-base font-medium leading-7 text-deep-slate">{nonprofitStatement[language]}</p></Card>
      <div className="public-band flex flex-col justify-center px-8 py-10"><h2 className="text-4xl font-serif">{copy.continueTitle}</h2><div className="mt-8 flex flex-wrap gap-3"><ButtonLink to="/community-programs" variant="accent">{copy.programs}</ButtonLink><ButtonLink to="/contact" variant="outline" className="border-white/30 bg-white/8 text-white hover:bg-white/12 hover:text-white">{copy.contact}</ButtonLink></div></div>
    </div></Section>
  </div>
}
