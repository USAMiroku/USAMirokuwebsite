import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'

const faqItemsEn = [
  {
    q: 'What exactly is Johrei?',
    a: 'Johrei is a spiritual practice that involves the channeling of Divine Light from one person to another. The word literally translates to "purification of the spirit." During a session, a practitioner holds their hand toward the recipient to help dissipate spiritual clouds, understood as the root cause of physical, mental, and emotional distress.',
  },
  {
    q: 'Is this a religion?',
    a: 'While Meishu-sama’s teachings have spiritual foundations, his philosophy is universal. People from many walks of life, including those who already belong to other faiths or consider themselves secular, practice these principles. The goal is the practical improvement of human life and the creation of Paradise on Earth.',
  },
  {
    q: 'Do I have to pay for a Johrei session?',
    a: "In accordance with Meishu-sama's spirit of service, Johrei is generally offered freely or through voluntary donations. Please check with your local center for specific visitor hours.",
  },
  {
    q: 'How long does a session last?',
    a: 'A typical session lasts between 15 and 30 minutes. It is a quiet, meditative experience. Most people report deep relaxation, warmth, or mental clarity during and after the session.',
  },
  {
    q: 'What is the connection between Art and Healing?',
    a: 'Meishu-sama taught that beauty is a physical manifestation of Divine Light. Beautiful surroundings uplift the spirit, and that elevation complements Johrei and Nature Farming.',
  },
  {
    q: 'Do I need special training to start?',
    a: 'Not at all. You can begin by practicing gratitude and beauty in daily life. If you feel drawn to Johrei, many centers offer introductory classes and orientation.',
  },
]

const faqItemsEs = [
  { q: '¿Qué es exactamente Johrei?', a: 'Johrei es una práctica espiritual que consiste en canalizar la Luz Divina de una persona a otra. El término significa literalmente "purificación del espíritu".' },
  { q: '¿Es una religión?', a: 'Aunque las enseñanzas de Meishu-sama tienen una base espiritual, su filosofía es universal y abierta para personas de todos los contextos.' },
  { q: '¿Hay que pagar para recibir Johrei?', a: 'Johrei normalmente se ofrece gratuitamente o con donaciones voluntarias, de acuerdo con el espíritu de servicio.' },
  { q: '¿Cuánto dura una sesión?', a: 'Una sesión típica dura entre 15 y 30 minutos en un ambiente de calma y meditación.' },
  { q: '¿Cuál es la conexión entre Arte y sanación?', a: 'Meishu-sama enseñó que la belleza eleva el espíritu y complementa la práctica de Johrei y la Agricultura Natural.' },
  { q: '¿Necesito entrenamiento especial para comenzar?', a: 'No. Puede empezar hoy practicando gratitud y apreciación por la belleza en su vida diaria.' },
]

const faqItemsPt = [
  { q: 'O que é Johrei?', a: 'Johrei é uma prática espiritual de canalização da Luz Divina de uma pessoa para outra, visando a purificação do espírito.' },
  { q: 'Isso é uma religião?', a: 'Embora tenha base espiritual, a filosofia de Meishu-sama é universal e acolhe pessoas de diferentes caminhos.' },
  { q: 'Preciso pagar para receber Johrei?', a: 'Em geral, o Johrei é oferecido gratuitamente ou por doação voluntária, em espírito de serviço.' },
  { q: 'Quanto tempo dura a sessão?', a: 'Uma sessão costuma durar entre 15 e 30 minutos, em um ambiente de calma e meditação.' },
  { q: 'Qual a relação entre Arte e cura?', a: 'Meishu-sama ensinou que a beleza eleva o espírito e complementa a prática de Johrei e da Agricultura Natural.' },
  { q: 'Preciso de treinamento especial para começar?', a: 'Não. Você pode começar hoje aplicando gratidão e beleza no seu cotidiano.' },
]

export default function FAQ() {
  const { t, language } = useTranslation()

  const faqs = language === 'es' ? faqItemsEs : language === 'pt' ? faqItemsPt : faqItemsEn

  const copy =
    language === 'es'
      ? {
          kicker: 'Preguntas frecuentes',
          title: 'Preguntas frecuentes',
          intro: 'Respuestas claras sobre Johrei, la práctica y qué esperar en su primera visita.',
          stillTitle: '¿Todavía tiene preguntas?',
          stillBody:
            'Nos encantará escucharle. Si busca una comunidad local o desea conocer una enseñanza específica, nuestras puertas están abiertas.',
          contactCta: 'Contáctenos / Enviar consulta',
          centerCta: 'Buscar un centro cercano',
        }
      : language === 'pt'
        ? {
            kicker: 'Perguntas frequentes',
            title: 'Perguntas frequentes',
            intro: 'Respostas claras sobre Johrei, a prática e o que esperar na primeira visita.',
            stillTitle: 'Ainda tem dúvidas?',
            stillBody:
              'Queremos ouvir você. Se procura uma comunidade local ou deseja aprender mais sobre um ensinamento específico, nossas portas estão abertas.',
            contactCta: 'Contato / Enviar mensagem',
            centerCta: 'Encontrar um centro próximo',
          }
        : {
            kicker: 'Frequently Asked Questions',
            title: 'Frequently Asked Questions',
            intro: 'Clear answers about Johrei, Meishu-sama’s teachings, and what to expect on your first visit.',
            stillTitle: 'Still have questions?',
            stillBody:
              'We’d love to hear from you. Whether you are looking for a local community or want to learn more about a specific teaching, our doors are open.',
            contactCta: 'Contact Us / Send an Inquiry',
            centerCta: 'Find a Center Near You',
          }

  usePageMeta({
    title: `${copy.title} | ${t.brand}`,
    description: copy.intro,
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="relative overflow-hidden border-b border-[rgba(141,107,38,0.14)] px-6 pb-18 pt-36 md:pt-40">
        <div className="floating-orb left-[9%] top-24 h-28 w-28 bg-[rgba(173,123,34,0.16)]" />
        <div className="floating-orb right-[11%] top-30 h-24 w-24 bg-[rgba(255,255,255,0.28)]" />
        <div className="mx-auto max-w-5xl space-y-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-sage-600">{copy.kicker}</p>
          <h1 className="text-5xl font-serif leading-[0.95] md:text-7xl">{copy.title}</h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">{copy.intro}</p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-5xl space-y-5">
          {faqs.map((faq, index) => (
            <Card key={faq.q} title={faq.q} eyebrow={`0${index + 1}`}>
              <p className="text-base leading-relaxed text-slate-600">{faq.a}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-sanctuary-100">
        <div className="mx-auto max-w-4xl rounded-[32px] bg-[linear-gradient(140deg,#1f2933_0%,#203831_100%)] px-8 py-12 text-center text-white shadow-[0_34px_80px_-48px_rgba(31,41,51,0.85)] md:px-12">
          <h2 className="text-4xl font-serif md:text-5xl">{copy.stillTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/75">{copy.stillBody}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/contact" variant="accent">
              {copy.contactCta}
            </ButtonLink>
            <ButtonLink to="/locations" variant="outline" className="border-white/30 bg-white/8 text-white hover:bg-white/12 hover:text-white">
              {copy.centerCta}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
