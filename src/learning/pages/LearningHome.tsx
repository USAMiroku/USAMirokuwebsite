import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { useTranslation } from '../../context/TranslationContext'
import { useLearningAuth } from '../context/LearningAuthContext'
import { useManagedCenters } from '../../organization/centers'

export default function LearningHome() {
  const { t, language } = useTranslation()
  const { isAdmin, isSuperAdmin } = useLearningAuth()
  const { activeCenters } = useManagedCenters()
  const eventCenters = activeCenters.filter((center) => center.kind !== 'hq')

  const copy =
    language === 'es'
      ? {
          metaTitle: 'Eventos',
          metaDescription: 'Servicios especiales, sesiones de estudio, seminarios y descargas públicas para la comunidad.',
          kicker: 'Eventos públicos',
          intro:
            'Un espacio público para revisar servicios especiales, sesiones de estudio, seminarios y materiales de apoyo compartidos por la iglesia.',
          explore: 'Explorar eventos',
          findCenter: 'Encontrar un centro',
          openAdmin: 'Abrir admin',
          whatTitle: 'Qué encontrará aquí',
          eventsTitle: 'Eventos públicos',
          eventsBody: 'Revise los próximos servicios especiales, seminarios y sesiones de estudio abiertos a miembros y visitantes.',
          detailsTitle: 'Detalles del evento',
          detailsBody: 'Cada página del evento reúne horario, ubicación, notas importantes y cualquier información de participación.',
          materialsTitle: 'Descargas públicas',
          materialsBody: 'Las páginas de eventos pueden incluir formularios de oración, programas, detalles del evento y otros archivos públicos.',
          nationalTitle: 'Eventos nacionales y locales',
          nationalBody: 'Explore los eventos nacionales o vaya directamente a la página pública de eventos de un centro o grupo.',
          nationalLabel: 'Nacional',
          nationalCardTitle: 'Todos los eventos públicos',
          nationalCardBody: 'Vea en un solo lugar los servicios especiales, seminarios y actividades públicas vinculadas a centros.',
          openNational: 'Abrir eventos nacionales',
          group: 'Grupo',
          center: 'Centro',
          openCenterPage: 'Abrir página de eventos',
        }
      : language === 'pt'
        ? {
            metaTitle: 'Eventos',
            metaDescription: 'Cultos especiais, sessões de estudo, seminários e downloads públicos para a comunidade.',
            kicker: 'Eventos públicos',
            intro:
              'Um espaço público para revisar cultos especiais, sessões de estudo, seminários e materiais de apoio compartilhados pela igreja.',
            explore: 'Explorar eventos',
            findCenter: 'Encontrar um centro',
            openAdmin: 'Abrir admin',
            whatTitle: 'O que você encontrará aqui',
            eventsTitle: 'Eventos públicos',
            eventsBody: 'Revise os próximos cultos especiais, seminários e sessões de estudo abertos a membros e visitantes.',
            detailsTitle: 'Detalhes do evento',
            detailsBody: 'Cada página do evento reúne horário, local, avisos importantes e qualquer informação de participação.',
            materialsTitle: 'Downloads públicos',
            materialsBody: 'As páginas de eventos podem incluir formulários de oração, programas, detalhes do evento e outros arquivos públicos.',
            nationalTitle: 'Eventos nacionais e locais',
            nationalBody: 'Explore os eventos nacionais ou vá diretamente para a página pública de eventos de um centro ou grupo.',
            nationalLabel: 'Nacional',
            nationalCardTitle: 'Todos os eventos públicos',
            nationalCardBody: 'Veja em um só lugar os cultos especiais, seminários e atividades públicas ligadas aos centros.',
            openNational: 'Abrir eventos nacionais',
            group: 'Grupo',
            center: 'Centro',
            openCenterPage: 'Abrir página de eventos',
          }
        : {
            metaTitle: 'Events',
            metaDescription: 'Special services, study sessions, seminars, and public downloads for the community.',
            kicker: 'Public Events',
            intro:
              'A public place to review special services, study sessions, seminars, and supporting materials shared by the church.',
            explore: 'Explore Events',
            findCenter: 'Find a Center',
            openAdmin: 'Open Admin',
            whatTitle: 'What you can find here',
            eventsTitle: 'Public Events',
            eventsBody: 'Review upcoming special services, seminars, and study sessions open to members and visitors.',
            detailsTitle: 'Event Details',
            detailsBody: 'Each event page brings together the schedule, location, important notes, and participation details.',
            materialsTitle: 'Public Downloads',
            materialsBody: 'Event pages can include prayer forms, schedules, event details, and other public files for download.',
            nationalTitle: 'National and Local Events',
            nationalBody: 'Browse national events or go straight to a center or group event page.',
            nationalLabel: 'National',
            nationalCardTitle: 'All Public Events',
            nationalCardBody: 'See special services, seminars, and other public center-linked events in one place.',
            openNational: 'Open National Events',
            group: 'Group',
            center: 'Center',
            openCenterPage: 'Open Event Page',
          }

  usePageMeta({
    title: `${copy.metaTitle} | ${t.brand}`,
    description: copy.metaDescription,
  })

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">{copy.kicker}</span>
          <h1 className="text-6xl md:text-8xl font-serif text-deep-slate leading-tight">Events</h1>
          <p className="text-xl md:text-3xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            {copy.intro}
          </p>

          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <ButtonLink to="/learn/activities" variant="accent">
              {copy.explore}
            </ButtonLink>
            <ButtonLink to="/locations" variant="outline">
              {copy.findCenter}
            </ButtonLink>
            {isAdmin ? (
              <ButtonLink to={isSuperAdmin ? '/admin/organization' : '/admin/activities'} variant="ghost">
                {copy.openAdmin}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </section>

      <Section py-24 className="bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-10">
          <div className="space-y-3">
            <h2 className="text-4xl font-serif text-deep-slate italic">{copy.whatTitle}</h2>
            <div className="h-1 w-24 bg-sage-600 mx-auto" />
          </div>

          <div className="grid gap-6 md:grid-cols-3 text-left">
            <div className="glass-sanctuary rounded-3xl p-8 space-y-3">
              <h3 className="text-lg font-semibold text-deep-slate">{copy.eventsTitle}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{copy.eventsBody}</p>
            </div>

            <div className="glass-sanctuary rounded-3xl p-8 space-y-3">
              <h3 className="text-lg font-semibold text-deep-slate">{copy.detailsTitle}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{copy.detailsBody}</p>
            </div>

            <div className="glass-sanctuary rounded-3xl p-8 space-y-3">
              <h3 className="text-lg font-semibold text-deep-slate">{copy.materialsTitle}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{copy.materialsBody}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="section-wash border-y border-[rgba(141,107,38,0.12)]">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-serif text-deep-slate italic">{copy.nationalTitle}</h2>
            <p className="mx-auto max-w-2xl text-slate-600">{copy.nationalBody}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="glass-sanctuary rounded-3xl p-8 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-600">{copy.nationalLabel}</p>
              <h3 className="text-2xl font-serif text-deep-slate">{copy.nationalCardTitle}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{copy.nationalCardBody}</p>
              <ButtonLink to="/learn/activities" variant="primary">
                {copy.openNational}
              </ButtonLink>
            </div>

            {eventCenters.map((center) => (
              <div key={center.id} className="glass-sanctuary rounded-3xl p-8 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-600">
                  {center.kind === 'group' ? copy.group : copy.center}
                </p>
                <h3 className="text-2xl font-serif text-deep-slate">{center.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {center.city}, {center.state}
                </p>
                <ButtonLink to={`/learn/centers/${center.id}`} variant="outline">
                  {copy.openCenterPage}
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
