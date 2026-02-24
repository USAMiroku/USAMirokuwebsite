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
    a: 'In accordance with Meishu-sama\'s spirit of service, Johrei is generally offered freely or through voluntary donations. Our goal is to share the Light with as many people as possible. Please check with your local center for specific visitor hours.',
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

const faqItemsFr = [
  {
    q: 'Qu’est-ce que le Johrei, exactement?',
    a: 'Le Johrei est une pratique spirituelle qui consiste à canaliser la Lumière Divine d’une personne vers une autre. Le mot signifie littéralement « purification de l’esprit ». Pendant une séance, le pratiquant dirige la main vers le receveur pour aider à dissiper les nuages spirituels, compris comme la cause profonde des souffrances physiques, mentales et émotionnelles.',
  },
  {
    q: 'Est-ce une religion?',
    a: 'Même si les enseignements de Meishu-sama ont des bases spirituelles, sa philosophie est universelle. Des personnes de tous horizons, y compris celles appartenant déjà à d’autres traditions religieuses ou se considérant laïques, pratiquent ces principes. L’objectif est l’amélioration concrète de la vie humaine et la construction d’un Paradis sur Terre.',
  },
  {
    q: 'Doit-on payer pour recevoir le Johrei?',
    a: 'Conformément à l’esprit de service de Meishu-sama, le Johrei est généralement offert gratuitement ou par don volontaire. Notre objectif est de partager la Lumière avec le plus grand nombre. Veuillez vérifier auprès de votre centre local pour les horaires d’accueil.',
  },
  {
    q: 'Combien de temps dure une séance?',
    a: 'Une séance dure habituellement entre 15 et 30 minutes. C’est une expérience calme et méditative. Vous restez simplement assis confortablement pendant que le pratiquant canalise la Lumière. La plupart des personnes ressentent une profonde détente, de la chaleur ou une clarté mentale pendant et après la séance.',
  },
  {
    q: 'Quel est le lien entre l’Art et la guérison?',
    a: 'Meishu-sama enseignait que la beauté est une manifestation physique de la Lumière Divine. Lorsque nous contemplons une belle peinture ou une fleur pleinement épanouie, notre esprit s’élève naturellement. Cette élévation spirituelle est une forme de guérison qui complète la pratique du Johrei et de l’Agriculture Naturelle.',
  },
  {
    q: 'Faut-il une formation spéciale pour commencer?',
    a: 'Pas du tout. Vous pouvez commencer dès aujourd’hui en appliquant simplement les principes de gratitude et de beauté chez vous. Si vous souhaitez aller plus loin dans la pratique du Johrei, la plupart des centres proposent des cours d’introduction pour comprendre la philosophie et, éventuellement, apprendre à canaliser la Lumière.',
  },
]

export default function FAQ() {
  const { t, language } = useTranslation()
  const isFr = language === 'fr'
  const faqs = isFr ? faqItemsFr : faqItemsEn

  const copy = isFr
    ? {
        kicker: 'Foire aux questions',
        title: 'Questions frequentes',
        intro: 'Reponses claires sur le Johrei, la pratique et ce a quoi vous attendre lors de votre premiere visite.',
        stillTitle: 'Vous avez encore des questions?',
        stillBody:
          'Nous serions heureux de vous entendre. Que vous recherchiez une communaute locale ou que vous vouliez en savoir plus sur un enseignement precis, nos portes vous sont ouvertes.',
        contactCta: 'Nous contacter / Envoyer une demande',
        centerCta: 'Trouver un centre pres de chez vous',
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
