import { useEffect, useMemo, useRef, useState } from 'react'
import { Section } from '../../components/Section'
import { communityProgramKeys, COMMUNITY_PROGRAMS_BUCKET, isCommunityProgramKey, type CommunityProgramKey, type CommunityProgramPhoto } from '../../data/communityProgramPhotos'
import { grantContent } from '../../data/grantContent'
import { usePageMeta } from '../../hooks/usePageMeta'
import { LearningAdminToolbar } from '../components/LearningAdminToolbar'
import { RequireSuperAdmin } from '../components/LearningRouteGuards'
import { assertSupabaseConfigured, supabase } from '../lib/supabaseClient'

const MAX_SOURCE_BYTES = 12 * 1024 * 1024
const MAX_OUTPUT_DIMENSION = 2000

type EditablePhoto = CommunityProgramPhoto & { url: string }

async function optimizeImage(file: File): Promise<Blob> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.')
  }
  if (file.size > MAX_SOURCE_BYTES) throw new Error('The original image must be 12 MB or smaller.')

  const objectUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.decoding = 'async'
    image.src = objectUrl
    await image.decode()
    const scale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight))
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('This browser could not prepare the image.')
    context.drawImage(image, 0, 0, width, height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.86))
    if (!blob) throw new Error('This browser could not compress the image.')
    return blob
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export default function LearningAdminCommunityProgramPhotos() {
  usePageMeta({ title: 'Admin | Community Program Photos', description: 'Manage public Community Program photographs.' })
  return <RequireSuperAdmin><CommunityProgramPhotosAdmin /></RequireSuperAdmin>
}

function CommunityProgramPhotosAdmin() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<EditablePhoto[]>([])
  const [programKey, setProgramKey] = useState<CommunityProgramKey>(communityProgramKeys[0])
  const [altText, setAltText] = useState('')
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const programLabels = useMemo(() => new Map(communityProgramKeys.map((key, index) => [key, grantContent.en.programs[index][0]])), [])

  async function loadPhotos() {
    if (!supabase) {
      setError('Supabase is not configured.')
      setIsLoading(false)
      return
    }
    const client = supabase
    setIsLoading(true)
    const { data, error: loadError } = await client
      .from('community_program_photos')
      .select('id,program_key,storage_path,alt_text,caption,display_order,is_featured,is_published,created_at')
      .order('program_key')
      .order('display_order')
      .order('created_at')
    if (loadError) setError(loadError.message)
    else setPhotos((data ?? []).filter((photo): photo is CommunityProgramPhoto => isCommunityProgramKey(photo.program_key)).map((photo) => ({
      ...photo,
      url: client.storage.from(COMMUNITY_PROGRAMS_BUCKET).getPublicUrl(photo.storage_path).data.publicUrl,
    })))
    setIsLoading(false)
  }

  useEffect(() => { void loadPhotos() }, [])

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    if (!file) return setError('Choose a photograph first.')
    if (altText.trim().length < 3) return setError('Add a short description for visitors using screen readers.')
    if (!hasPermission) return setError('Confirm that the organization has permission to publish this photograph.')

    setIsUploading(true)
    let uploadedPath: string | null = null
    try {
      const client = assertSupabaseConfigured()
      const optimized = await optimizeImage(file)
      const nextOrder = Math.max(-1, ...photos.filter((photo) => photo.program_key === programKey).map((photo) => photo.display_order)) + 1
      uploadedPath = `${programKey}/${crypto.randomUUID()}.webp`
      const { error: uploadError } = await client.storage.from(COMMUNITY_PROGRAMS_BUCKET).upload(uploadedPath, optimized, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: false,
      })
      if (uploadError) throw uploadError

      const shouldFeature = !photos.some((photo) => photo.program_key === programKey && photo.is_featured)
      const { error: insertError } = await client.from('community_program_photos').insert({
        program_key: programKey,
        storage_path: uploadedPath,
        alt_text: altText.trim(),
        caption: caption.trim() || null,
        display_order: nextOrder,
        is_featured: shouldFeature,
        is_published: true,
      })
      if (insertError) {
        await client.storage.from(COMMUNITY_PROGRAMS_BUCKET).remove([uploadedPath])
        uploadedPath = null
        throw insertError
      }

      setFile(null)
      setAltText('')
      setCaption('')
      setHasPermission(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setNotice('Photo uploaded and published successfully.')
      await loadPhotos()
    } catch (uploadFailure) {
      setError(uploadFailure instanceof Error ? uploadFailure.message : 'Could not upload the photograph.')
    } finally {
      setIsUploading(false)
    }
  }

  function updateLocal(id: string, changes: Partial<EditablePhoto>) {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, ...changes } : photo))
  }

  async function savePhoto(photo: EditablePhoto) {
    setError(null)
    setNotice(null)
    const client = assertSupabaseConfigured()
    const { error: saveError } = await client.from('community_program_photos').update({
      alt_text: photo.alt_text.trim(),
      caption: photo.caption?.trim() || null,
      display_order: Math.max(0, Number(photo.display_order) || 0),
      is_published: photo.is_published,
    }).eq('id', photo.id)
    if (saveError) setError(saveError.message)
    else {
      setNotice('Photo details saved.')
      await loadPhotos()
    }
  }

  async function setFeatured(photo: EditablePhoto) {
    setError(null)
    setNotice(null)
    const client = assertSupabaseConfigured()
    const { error: clearError } = await client.from('community_program_photos').update({ is_featured: false }).eq('program_key', photo.program_key).eq('is_featured', true)
    if (clearError) return setError(clearError.message)
    const { error: featureError } = await client.from('community_program_photos').update({ is_featured: true }).eq('id', photo.id)
    if (featureError) setError(featureError.message)
    else {
      setNotice('Featured photograph updated.')
      await loadPhotos()
    }
  }

  async function deletePhoto(photo: EditablePhoto) {
    if (!window.confirm('Delete this photograph permanently? This cannot be undone.')) return
    setError(null)
    setNotice(null)
    const client = assertSupabaseConfigured()
    const { error: deleteError } = await client.from('community_program_photos').delete().eq('id', photo.id)
    if (deleteError) return setError(deleteError.message)
    const { error: storageError } = await client.storage.from(COMMUNITY_PROGRAMS_BUCKET).remove([photo.storage_path])
    if (storageError) setError(`The record was removed, but storage cleanup failed: ${storageError.message}`)
    else setNotice('Photograph deleted.')
    await loadPhotos()
  }

  return <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
    <section className="relative px-6 py-24 text-center md:py-32"><div className="mx-auto max-w-4xl space-y-5"><span className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage-600">Admin</span><h1 className="text-5xl font-serif md:text-7xl">Community Program Photos</h1><p className="mx-auto max-w-2xl text-lg text-slate-500">Upload, describe, feature, arrange, publish, and remove photographs shown on the Community Programs page.</p></div></section>
    <Section className="bg-white"><div className="mx-auto max-w-6xl space-y-8 px-6">
      <LearningAdminToolbar current="program-photos" />
      {error ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-900">{error}</div> : null}
      {notice ? <div role="status" className="rounded-2xl border border-sage-200 bg-sage-50 px-6 py-4 text-sage-900">{notice}</div> : null}

      <form onSubmit={handleUpload} className="rounded-[30px] border border-[rgba(141,107,38,0.2)] bg-sanctuary-100 p-6 shadow-sm md:p-8">
        <h2 className="text-3xl font-serif">Upload a photograph</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Program</span><select value={programKey} onChange={(event) => setProgramKey(event.target.value as CommunityProgramKey)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3">{communityProgramKeys.map((key) => <option key={key} value={key}>{programLabels.get(key)}</option>)}</select></label>
          <label className="block"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Photograph</span><input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm" required /></label>
          <label className="block"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Image description (required)</span><input value={altText} onChange={(event) => setAltText(event.target.value)} maxLength={240} placeholder="Example: Volunteers arranging flowers during a community workshop" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3" required /></label>
          <label className="block"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Caption (optional)</span><input value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={500} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3" /></label>
        </div>
        <label className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><input type="checkbox" checked={hasPermission} onChange={(event) => setHasPermission(event.target.checked)} className="mt-1 h-4 w-4" required /><span>I confirm that Miroku Association USA has permission to publish this photograph, including appropriate consent for any identifiable children.</span></label>
        <button type="submit" disabled={isUploading} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-divine-gold px-8 text-xs font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-60">{isUploading ? 'Preparing and uploading…' : 'Upload and publish'}</button>
        <p className="mt-3 text-xs leading-5 text-slate-500">JPG, PNG, or WebP; maximum original size 12 MB. Images are resized to 2,000 pixels and converted to WebP before upload.</p>
      </form>

      <div className="space-y-10">
        {communityProgramKeys.map((key) => {
          const programPhotos = photos.filter((photo) => photo.program_key === key)
          return <section key={key} aria-labelledby={`photos-${key}`}><div className="flex items-end justify-between gap-4"><h2 id={`photos-${key}`} className="text-3xl font-serif">{programLabels.get(key)}</h2><span className="text-sm text-slate-500">{programPhotos.length} photo{programPhotos.length === 1 ? '' : 's'}</span></div>
            {isLoading ? <p className="mt-4 text-slate-500">Loading photographs…</p> : programPhotos.length === 0 ? <p className="mt-4 rounded-2xl border border-dashed border-slate-200 px-5 py-6 text-slate-500">No photographs uploaded yet.</p> : <div className="mt-5 grid gap-6 lg:grid-cols-2">{programPhotos.map((photo) => <article key={photo.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"><img src={photo.url} alt={photo.alt_text} className="aspect-[16/9] w-full object-cover" /><div className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">{photo.is_featured ? <span className="rounded-full bg-divine-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Featured</span> : null}{!photo.is_published ? <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">Hidden</span> : null}</div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Description<input value={photo.alt_text} maxLength={240} onChange={(event) => updateLocal(photo.id, { alt_text: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal normal-case tracking-normal text-deep-slate" /></label>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Caption<input value={photo.caption ?? ''} maxLength={500} onChange={(event) => updateLocal(photo.id, { caption: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal normal-case tracking-normal text-deep-slate" /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Display order<input type="number" min="0" value={photo.display_order} onChange={(event) => updateLocal(photo.id, { display_order: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label><label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 px-4 py-3 text-sm"><input type="checkbox" checked={photo.is_published} onChange={(event) => updateLocal(photo.id, { is_published: event.target.checked })} /> Published</label></div>
              <div className="flex flex-wrap gap-3"><button type="button" onClick={() => void savePhoto(photo)} className="rounded-full bg-sage-700 px-5 py-2 text-xs font-semibold text-white">Save</button>{!photo.is_featured ? <button type="button" onClick={() => void setFeatured(photo)} className="rounded-full border border-divine-gold px-5 py-2 text-xs font-semibold text-amber-800">Make featured</button> : null}<button type="button" onClick={() => void deletePhoto(photo)} className="rounded-full border border-rose-200 px-5 py-2 text-xs font-semibold text-rose-700">Delete</button></div>
            </div></article>)}</div>}
          </section>
        })}
      </div>
    </div></Section>
  </div>
}
