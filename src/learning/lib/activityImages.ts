import type { SupabaseClient } from '@supabase/supabase-js'
import { optimizeImage } from './optimizeImage'

export const ACTIVITY_IMAGES_BUCKET = 'activity-images'

/** Optimizes and uploads an activity banner, returning its public URL. */
export async function uploadActivityImage(
  client: SupabaseClient,
  file: File,
  activityId: string,
  centerId: string | null,
): Promise<string> {
  const optimized = await optimizeImage(file)
  const path = `${centerId || 'shared'}/${activityId}/${crypto.randomUUID()}.webp`
  const { error } = await client.storage.from(ACTIVITY_IMAGES_BUCKET).upload(path, optimized, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error
  return client.storage.from(ACTIVITY_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl
}

/** Returns the storage path for a URL that points into the activity images bucket, or null for external URLs. */
export function activityImagePathFromUrl(client: SupabaseClient, url: string | null | undefined): string | null {
  if (!url) return null
  const prefix = client.storage.from(ACTIVITY_IMAGES_BUCKET).getPublicUrl('').data.publicUrl
  return url.startsWith(prefix) ? decodeURIComponent(url.slice(prefix.length)) || null : null
}

/** Best-effort removal of an uploaded activity banner; external URLs are ignored. */
export async function removeActivityImage(client: SupabaseClient, url: string | null | undefined): Promise<void> {
  const path = activityImagePathFromUrl(client, url)
  if (path) await client.storage.from(ACTIVITY_IMAGES_BUCKET).remove([path])
}
