import { ButtonLink } from '../components/ButtonLink'
import { Card } from '../components/Card'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function MeishuSama() {
  const { t, language } = useTranslation()

  const copy =
    language === 'es'
      ? {
          orientationLabel: 'Orientación',
          orientationBody:
            'Meishu-sama es recordado como un visionario, filósofo y reformador espiritual cuya obra buscó la eliminación del sufrimiento humano.',
          whoTitle: '¿Quién es Meishu-sama?',
          whoBody1:
            'Para sus seguidores, es conocido como <strong>Meishu-sama</strong>, nacido como Mokichi Okada (1882-1955). Dedicó su vida a una meta singular y amplia: la eliminación del sufrimiento humano.',
          whoBody2:
            'Enseñó que el mundo atraviesa una profunda transición espiritual y que la humanidad puede pasar del conflicto y la enfermedad a un mundo de salud, prosperidad y paz al alinearse con la verdad espiritual y las leyes de la naturaleza.',
          timelineLabel: 'Cronología',
          timelineTitle: 'Una vida de transformación',
          timeline: [
            {
              title: '1882: Nace en Tokio, Japón',
              body: 'Desde muy joven mostró una profunda sensibilidad, interés artístico y atención a la belleza.',
            },
            {
              title: 'Primeros años del siglo XX: Pruebas personales y dificultades',
              body: 'La pérdida, la enfermedad y el colapso de sus negocios lo llevaron a preguntas más profundas sobre el sufrimiento, la causalidad y la ley espiritual.',
            },
            {
              title: '1926: Despertar espiritual',
              body: 'Después de años de estudio y oración, recibió revelaciones sobre las causas espirituales del sufrimiento humano.',
            },
            {
              title: '1935: Misión formal y Johrei',
              body: 'Inició formalmente su misión y presentó el Johrei como un medio para canalizar la Luz Divina y purificar el espíritu.',
            },
            {
              title: '1945-1955: Prototipos del Paraíso',
              body: 'Impulsó suelos sagrados, jardines, museos y espacios de belleza para mostrar en forma visible una civilización espiritual.',
            },
            {
              title: '1955: El legado continúa',
              body: 'Partió en 1955, dejando un legado espiritual global que sigue dando forma a comunidades en todo el mundo.',
            },
          ],
          missionLabel: 'Misión',
          missionTitle: 'Su propósito divino',
          pillars: [
            {
              title: 'La purificación del espíritu',
              body: 'Enseñó que la enfermedad y la desgracia surgen de nubes o impurezas espirituales. El Johrei ayuda a disolver esas nubes y a restaurar la claridad y el equilibrio.',
            },
            {
              title: 'Agricultura natural',
              body: 'Enseñó que la tierra está viva y que el cultivo sin intervención química dañina sostiene la armonía entre cuerpo, tierra y alma.',
            },
            {
              title: 'El poder de la belleza',
              body: 'El arte, las flores, la arquitectura y los ambientes sagrados no son lujos, sino necesidades espirituales que elevan el corazón humano.',
            },
          ],
          quote:
            '"El objetivo último de mi obra es crear un mundo donde no haya enfermedad, ni pobreza, ni conflicto."',
          discoverTitle: 'Descubrir más',
          discoverBody:
            'Su legado ofrece una guía práctica hacia el equilibrio, la belleza y una civilización más pacífica.',
        }
      : language === 'pt'
        ? {
            orientationLabel: 'Orientação',
            orientationBody:
              'Meishu-sama é lembrado como um visionário, filósofo e reformador espiritual cuja obra visava à eliminação do sofrimento humano.',
            whoTitle: 'Quem é Meishu-sama?',
            whoBody1:
              'Para seus seguidores, ele é conhecido como <strong>Meishu-sama</strong>, nascido como Mokichi Okada (1882-1955). Dedicou sua vida a um objetivo singular e abrangente: a eliminação do sofrimento humano.',
            whoBody2:
              'Ensinou que o mundo passa por uma profunda transição espiritual e que a humanidade pode passar do conflito e da doença para um mundo de saúde, prosperidade e paz ao se alinhar com a verdade espiritual e as leis da natureza.',
            timelineLabel: 'Linha do tempo',
            timelineTitle: 'Uma vida de transformação',
            timeline: [
              {
                title: '1882: Nascimento em Tóquio, Japão',
                body: 'Desde muito jovem demonstrou profunda sensibilidade, interesse artístico e atenção à beleza.',
              },
              {
                title: 'Início dos anos 1900: Provações pessoais e dificuldades',
                body: 'Perdas, doenças e o colapso dos negócios o levaram a questões mais profundas sobre sofrimento, causalidade e lei espiritual.',
              },
              {
                title: '1926: Despertar espiritual',
                body: 'Após anos de estudo e oração, recebeu revelações sobre as causas espirituais do sofrimento humano.',
              },
              {
                title: '1935: Missão formal e Johrei',
                body: 'Iniciou formalmente sua missão e apresentou o Johrei como um meio de canalizar a Luz Divina e purificar o espírito.',
              },
              {
                title: '1945-1955: Protótipos do Paraíso',
                body: 'Promoveu solos sagrados, jardins, museus e espaços de beleza para demonstrar em forma visível uma civilização espiritual.',
              },
              {
                title: '1955: O legado continua',
                body: 'Partiu em 1955, deixando um legado espiritual global que continua a moldar comunidades ao redor do mundo.',
              },
            ],
            missionLabel: 'Missão',
            missionTitle: 'Seu propósito divino',
            pillars: [
              {
                title: 'A purificação do espírito',
                body: 'Ensinou que a doença e a infelicidade surgem de nuvens ou impurezas espirituais. O Johrei ajuda a dissolver essas nuvens e a restaurar clareza e equilíbrio.',
              },
              {
                title: 'Agricultura natural',
                body: 'Ensinou que a terra é viva e que o cultivo sem intervenção química nociva sustenta a harmonia entre corpo, terra e alma.',
              },
              {
                title: 'O poder da beleza',
                body: 'Arte, flores, arquitetura e ambientes sagrados não são luxos, mas necessidades espirituais que elevam o coração humano.',
              },
            ],
            quote:
              '"O objetivo último da minha obra é criar um mundo onde não haja doença, pobreza nem conflito."',
            discoverTitle: 'Descubra mais',
            discoverBody:
              'Seu legado oferece um caminho prático rumo ao equilíbrio, à beleza e a uma civilização mais pacífica.',
          }
        : {
            orientationLabel: 'Orientation',
            orientationBody:
              'Meishu-sama is remembered as a visionary, philosopher, and spiritual reformer whose work aimed at the elimination of human suffering.',
            whoTitle: 'Who is Meishu-sama?',
            whoBody1:
              'To his followers, he is known as <strong>Meishu-sama</strong>, born Mokichi Okada (1882-1955). He dedicated his life to a singular and expansive goal: the elimination of human suffering.',
            whoBody2:
              'He taught that the world is undergoing a profound spiritual transition and that humanity can move from conflict and illness toward a world of health, prosperity, and peace by aligning with spiritual truth and the laws of nature.',
            timelineLabel: 'Timeline',
            timelineTitle: 'A Life of Transformation',
            timeline: [
              {
                title: '1882: Born in Tokyo, Japan',
                body: 'From a young age, he showed a deep sensitivity, artistic interest, and attentiveness to beauty.',
              },
              {
                title: 'Early 1900s: Personal Trials and Hardship',
                body: 'Loss, illness, and business collapse pushed him toward deeper questions about suffering, causation, and spiritual law.',
              },
              {
                title: '1926: Spiritual Awakening',
                body: 'After years of study and prayer, he received revelations regarding the spiritual causes of human suffering.',
              },
              {
                title: '1935: Formal Mission and Johrei',
                body: 'He formally began his mission and introduced Johrei as a way to channel Divine Light and purify the spirit.',
              },
              {
                title: '1945-1955: Prototypes of Paradise',
                body: 'He advanced sacred grounds, gardens, museums, and spaces of beauty to demonstrate spiritual civilization in visible form.',
              },
              {
                title: '1955: Legacy Continues',
                body: 'He passed away in 1955, leaving a global spiritual legacy that continues to shape communities around the world.',
              },
            ],
            missionLabel: 'Mission',
            missionTitle: 'His Divine Purpose',
            pillars: [
              {
                title: 'The Purification of the Spirit',
                body: 'He taught that illness and misfortune arise from spiritual clouds or impurities. Johrei helps dissolve those clouds and restore clarity and balance.',
              },
              {
                title: 'Natural Farming',
                body: 'He taught that the earth is living and that cultivation without harmful chemical intervention supports harmony between body, land, and soul.',
              },
              {
                title: 'The Power of Beauty',
                body: 'Art, flowers, architecture, and sacred environments are not luxuries but spiritual necessities that elevate the human heart.',
              },
            ],
            quote:
              '"The ultimate goal of my work is to create a world where there is no disease, no poverty, and no conflict."',
            discoverTitle: 'Discover More',
            discoverBody:
              'His legacy offers a practical roadmap toward balance, beauty, and a more peaceful civilization.',
          }

  usePageMeta({
    title: `${t.meishuSama.title} | ${t.brand}`,
    description: t.meishuSama.intro,
  })

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="relative overflow-hidden border-b border-[rgba(141,107,38,0.14)] px-6 pb-18 pt-36 md:pt-40">
        <div className="floating-orb left-[10%] top-24 h-28 w-28 bg-[rgba(173,123,34,0.16)]" />
        <div className="floating-orb right-[11%] top-30 h-24 w-24 bg-[rgba(255,255,255,0.28)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-sage-600">{t.nav.meishuSama}</p>
            <h1 className="text-5xl font-serif leading-[0.95] md:text-7xl">{t.meishuSama.title}</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">{t.meishuSama.intro}</p>
          </div>
          <div className="paper-panel ornament-ring rounded-[32px] p-7 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sage-600">{copy.orientationLabel}</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">{copy.orientationBody}</p>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-5xl rounded-[32px] paper-panel p-8 md:p-10">
          <h2 className="text-4xl font-serif md:text-5xl">{copy.whoTitle}</h2>
          <div className="mt-5 space-y-5 text-lg leading-relaxed text-slate-600">
            <p dangerouslySetInnerHTML={{ __html: copy.whoBody1 }} />
            <p>{copy.whoBody2}</p>
          </div>
        </div>
      </Section>

      <Section className="section-wash border-y border-[rgba(141,107,38,0.12)]">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-sage-600">{copy.timelineLabel}</p>
            <h2 className="text-4xl font-serif md:text-5xl">{copy.timelineTitle}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {copy.timeline.map((item) => (
              <Card key={item.title} title={item.title} className="h-full">
                <p className="text-base leading-relaxed text-slate-600">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-sage-600">{copy.missionLabel}</p>
            <h2 className="text-4xl font-serif md:text-5xl">{copy.missionTitle}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {copy.pillars.map((pillar, index) => (
              <Card key={pillar.title} title={pillar.title} eyebrow={`0${index + 1}`} className="h-full">
                <p className="text-base leading-relaxed text-slate-600">{pillar.body}</p>
              </Card>
            ))}
          </div>
          <div className="rounded-[32px] paper-panel p-8 text-center md:p-10">
            <p className="text-2xl font-serif italic leading-relaxed text-ink-warm">{copy.quote}</p>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Meishu-sama</p>
          </div>
        </div>
      </Section>

      <Section className="bg-sanctuary-100">
        <div className="mx-auto max-w-4xl rounded-[32px] bg-[linear-gradient(140deg,#1f2933_0%,#203831_100%)] px-8 py-12 text-center text-white shadow-[0_34px_80px_-48px_rgba(31,41,51,0.85)] md:px-12">
          <h2 className="text-4xl font-serif md:text-5xl">{copy.discoverTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/75">{copy.discoverBody}</p>
          <div className="mt-8">
            <ButtonLink to="/meishu-sama/legacy" variant="accent">
              {t.meishuSama.learnMore}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
