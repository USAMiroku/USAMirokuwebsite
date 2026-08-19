import { useEffect, useMemo, useState } from 'react'
import { ButtonLink } from '../components/ButtonLink'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { grantContent, healthDisclosure } from '../data/grantContent'
import {
  COMMUNITY_PROGRAMS_BUCKET,
  communityProgramKeys,
  isCommunityProgramKey,
  type CommunityProgramPhoto,
  type CommunityProgramKey,
} from '../data/communityProgramPhotos'
import { usePageMeta } from '../hooks/usePageMeta'
import { supabase } from '../learning/lib/supabaseClient'

type PhotoWithUrl = CommunityProgramPhoto & { url: string }

export default function CommunityPrograms() {
  const { language } = useTranslation()
  const copy = grantContent[language]
  const [photos, setPhotos] = useState<PhotoWithUrl[]>([])
  const [galleryProgram, setGalleryProgram] = useState<CommunityProgramKey | null>(null)
  const photoLabel = language === 'es' ? 'Foto del programa próximamente' : language === 'pt' ? 'Foto do programa em breve' : 'Program photo coming soon'
  const viewGalleryLabel = language === 'es' ? 'Ver fotos' : language === 'pt' ? 'Ver fotos' : 'View photos'
  const closeLabel = language === 'es' ? 'Cerrar galería' : language === 'pt' ? 'Fechar galeria' : 'Close gallery'
  usePageMeta({ title: `${copy.programsNav} | Miroku Association USA`, description: copy.programsIntro })

  useEffect(() => {
    let active = true
    async function loadPhotos() {
      if (!supabase) return
      const client = supabase
      const { data, error } = await client
        .from('community_program_photos')
        .select('id,program_key,center_id,storage_path,alt_text,caption,display_order,is_featured,is_published,created_at')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (!active || error || !data) return
      const validPhotos = data.filter((photo): photo is CommunityProgramPhoto => isCommunityProgramKey(photo.program_key))
      setPhotos(validPhotos.map((photo) => ({
        ...photo,
        url: client.storage.from(COMMUNITY_PROGRAMS_BUCKET).getPublicUrl(photo.storage_path).data.publicUrl,
      })))
    }
    void loadPhotos()
    return () => { active = false }
  }, [])

  const photosByProgram = useMemo(() => {
    const grouped = new Map<CommunityProgramKey, PhotoWithUrl[]>()
    communityProgramKeys.forEach((key) => grouped.set(key, []))
    photos.forEach((photo) => grouped.get(photo.program_key)?.push(photo))
    return grouped
  }, [photos])

  const galleryPhotos = galleryProgram ? photosByProgram.get(galleryProgram) ?? [] : []
  const galleryTitle = galleryProgram ? copy.programs[communityProgramKeys.indexOf(galleryProgram)]?.[0] : ''

  useEffect(() => {
    if (!galleryProgram) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setGalleryProgram(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [galleryProgram])

  return <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
    <section className="public-hero"><div className="public-hero-grid"><div className="public-hero-copy">
      <p className="public-eyebrow">Miroku Association USA</p><h1 className="public-title">{copy.programsNav}</h1><p className="public-body">{copy.programsIntro}</p>
    </div><div className="public-hero-note"><p className="public-eyebrow">{copy.missionTitle}</p><p className="mt-4">{copy.mission}</p></div></div></section>
    <Section className="bg-white"><div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-2">
      {copy.programs.map(([title, body], index) => {
        const programKey = communityProgramKeys[index]
        const programPhotos = photosByProgram.get(programKey) ?? []
        const featuredPhoto = programPhotos.find((photo) => photo.is_featured) ?? programPhotos[0]
        return <article key={title} data-program={programKey} className="paper-panel ornament-ring group overflow-hidden rounded-[30px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-46px_rgba(31,41,51,0.45)]">
          <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,#edf1e8_0%,#faf5e8_52%,#e4ebdf_100%)]">
            {featuredPhoto ? <img src={featuredPhoto.url} alt={featuredPhoto.alt_text} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" /> : <div role="img" aria-label={`${photoLabel}: ${title}`} className="flex h-full items-center justify-center px-8 text-center">
              <div><span aria-hidden="true" className="mx-auto block h-12 w-12 rounded-full border border-[rgba(141,107,38,0.28)] bg-white/60 shadow-[inset_0_0_0_8px_rgba(255,255,255,0.35)]" /><p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-sage-700">{photoLabel}</p></div>
            </div>}
            <span className="absolute left-5 top-5 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-sage-700 shadow-sm">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <div className="p-7">
            <h2 className="text-2xl font-serif text-slate-900">{title}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{body}</p>
            {index === 6 ? <p className="mt-5 rounded-2xl border border-[rgba(141,107,38,0.18)] bg-sanctuary-100 p-5 text-sm font-medium leading-7 text-deep-slate">{healthDisclosure[language]}</p> : null}
            {programPhotos.length > 0 ? <button type="button" onClick={() => setGalleryProgram(programKey)} className="mt-6 inline-flex rounded-full border border-[rgba(141,107,38,0.3)] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-700 transition hover:bg-sanctuary-100 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2">{viewGalleryLabel} ({programPhotos.length})</button> : null}
          </div>
        </article>
      })}
    </div></Section>
    <Section className="section-wash"><div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3">
      <ButtonLink to="/activities" variant="accent">{copy.activitiesCta}</ButtonLink><ButtonLink to="/locations" variant="secondary">{copy.locationsCta}</ButtonLink><ButtonLink to="/contact" variant="outline">{copy.volunteerCta}</ButtonLink>
    </div></Section>

    {galleryProgram ? <div role="dialog" aria-modal="true" aria-labelledby="program-gallery-title" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 md:p-8" onMouseDown={(event) => { if (event.currentTarget === event.target) setGalleryProgram(null) }}>
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-[30px] bg-white p-5 shadow-2xl md:p-8">
        <div className="flex items-start justify-between gap-6"><div><p className="public-eyebrow">{copy.programsNav}</p><h2 id="program-gallery-title" className="mt-2 text-3xl font-serif text-deep-slate">{galleryTitle}</h2></div><button type="button" onClick={() => setGalleryProgram(null)} aria-label={closeLabel} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sage-500">×</button></div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">{galleryPhotos.map((photo) => <figure key={photo.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-sanctuary-100"><img src={photo.url} alt={photo.alt_text} className="aspect-[4/3] w-full object-cover" loading="lazy" />{photo.caption ? <figcaption className="px-5 py-4 text-sm leading-6 text-slate-600">{photo.caption}</figcaption> : null}</figure>)}</div>
      </div>
    </div> : null}
  </div>
}
