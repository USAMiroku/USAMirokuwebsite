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
    a: 'While Meishu-sama’s teachings have spiritual foundations, his philosophy is universal. People from all walks of life, including those who already belong to various faiths or those who consider themselves secular, practice these principles. The goal is the practical improvement of human life and the creation of a Paradise on Earth.',
  },
  {
    q: 'Do I have to pay for a Johrei session?',
    a: "In accordance with Meishu-sama's spirit of service, Johrei is generally offered freely or through voluntary donations. Our goal is to share the Light with as many people as possible. Please check with your local center for specific visitor hours.",
  },
  {
    q: 'How long does a session last?',
    a: 'A typical session lasts between 15 and 30 minutes. It is a quiet, meditative experience. You simply sit comfortably while the practitioner channels the Light. Most people report feeling a sense of deep relaxation, warmth, or mental clarity during and after the session.',
  },
  {
    q: 'What is the connection between Art and Healing?',
    a: 'Meishu-sama taught that beauty is a physical manifestation of Divine Light. When we look at a beautiful painting or a perfectly bloomed flower, our spirits are naturally uplifted. This spiritual elevation is a form of healing that complements the practice of Johrei and Nature Farming.',
  },
  {
    q: 'Do I need special training to start?',
    a: 'Not at all. You can begin by simply applying the principles of gratitude and beauty in your home today. If you find yourself drawn to the practice of Johrei, most centers offer introductory classes to help you understand the philosophy and eventually learn how to channel the Light yourself.',
  },
]

const faqItemsEs = [
  {
    q: 'Que es exactamente Johrei?',
    a: 'Johrei es una practica espiritual que consiste en canalizar la Luz Divina de una persona a otra. El termino significa literalmente "purificacion del espiritu".',
  },
  {
    q: 'Es una religion?',
    a: 'Aunque las ensenanzas de Meishu-sama tienen una base espiritual, su filosofia es universal y abierta para personas de todos los contextos.',
  },
  {
    q: 'Hay que pagar para recibir Johrei?',
    a: 'Johrei normalmente se ofrece gratuitamente o con donaciones voluntarias, de acuerdo con el espiritu de servicio.',
  },
  {
    q: 'Cuanto dura una sesion?',
    a: 'Una sesion tipica dura entre 15 y 30 minutos en un ambiente de calma y meditacion.',
  },
  {
    q: 'Cual es la conexion entre Arte y sanacion?',
    a: 'Meishu-sama enseno que la belleza eleva el espiritu y complementa la practica de Johrei y la Agricultura Natural.',
  },
  {
    q: 'Necesito entrenamiento especial para comenzar?',
    a: 'No. Puedes empezar hoy practicando gratitud y apreciacion por la belleza en tu vida diaria.',
  },
]

const faqItemsPt = [
  {
    q: 'O que e Johrei?',
    a: 'Johrei e uma pratica espiritual de canalizacao da Luz Divina de uma pessoa para outra, visando a purificacao do espirito.',
  },
  {
    q: 'Isso e uma religiao?',
    a: 'Embora tenha base espiritual, a filosofia de Meishu-sama e universal e acolhe pessoas de diferentes caminhos.',
  },
  {
    q: 'Preciso pagar para receber Johrei?',
    a: 'Em geral, o Johrei e oferecido gratuitamente ou por doacao voluntaria, em espirito de servico.',
  },
  {
    q: 'Quanto tempo dura a sessao?',
    a: 'Uma sessao costuma durar entre 15 e 30 minutos, em um ambiente de calma e meditacao.',
  },
  {
    q: 'Qual a relacao entre Arte e cura?',
    a: 'Meishu-sama ensinou que a beleza eleva o espirito e complementa a pratica de Johrei e Agricultura Natural.',
  },
  {
    q: 'Preciso de treinamento especial para comecar?',
    a: 'Nao. Voce pode comecar hoje aplicando gratidao e beleza no seu cotidiano.',
  },
]

export default function FAQ() {
  const { t, language } = useTranslation()

  const faqs = language === 'es' ? faqItemsEs : language === 'pt' ? faqItemsPt : faqItemsEn

  const copy =
    language === 'es'
      ? {
          kicker: 'Preguntas frecuentes',
          title: 'Preguntas frecuentes',
          intro: 'Respuestas claras sobre Johrei, la practica y que esperar en su primera visita.',
          stillTitle: 'Todavia tiene preguntas?',
          stillBody:
            'Nos encantara escucharle. Si busca una comunidad local o desea conocer una ensenanza especifica, nuestras puertas estan abiertas.',
          contactCta: 'Contactanos / Enviar consulta',
          centerCta: 'Buscar un centro cercano',
        }
      : language === 'pt'
        ? {
            kicker: 'Perguntas frequentes',
            title: 'Perguntas frequentes',
            intro: 'Respostas claras sobre Johrei, a pratica e o que esperar na primeira visita.',
            stillTitle: 'Ainda tem duvidas?',
            stillBody:
              'Queremos ouvir voce. Se procura uma comunidade local ou deseja aprender mais sobre um ensinamento especifico, nossas portas estao abertas.',
            contactCta: 'Contato / Enviar mensagem',
            centerCta: 'Encontrar um centro proximo',
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
      <section className="border-b border-[rgba(184,134,11,0.2)] bg-white px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-5xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-sage-600">{copy.kicker}</p>
          <h1 className="text-4xl font-serif leading-tight md:text-6xl">{copy.title}</h1>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-slate-600 md:text-2xl">{copy.intro}</p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-5xl space-y-6">
          {faqs.map((faq) => (
            <Card key={faq.q} title={faq.q} className="border-[rgba(184,134,11,0.2)] bg-white p-8">
              <p className="text-base leading-relaxed text-slate-600">{faq.a}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-sanctuary-100 border-y border-[rgba(184,134,11,0.2)] text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-3xl font-serif md:text-5xl">{copy.stillTitle}</h2>
          <p className="text-lg leading-relaxed text-slate-600">{copy.stillBody}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <ButtonLink to="/contact" variant="accent">{copy.contactCta}</ButtonLink>
            <ButtonLink to="/locations" variant="outline">{copy.centerCta}</ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
