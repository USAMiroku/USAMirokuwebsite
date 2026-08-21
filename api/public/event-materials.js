import { getSupabaseAdmin } from '../admin/_supabaseAdmin.js'
import { enforceRateLimit } from '../_security.js'

const MATERIALS_BUCKET = 'learning-materials'

export default async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  if (!enforceRateLimit(req, res, { key: 'public-materials', limit: 40 })) return

  try {
    const activityId = String(req.query?.activityId || '').trim()
    if (!activityId) {
      res.status(400).json({ error: 'activityId is required.' })
      return
    }

    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('learning_materials')
      .select('id,activity_id,session_id,title,description,storage_path,file_name,mime_type,created_at,is_public,learning_activities!inner(is_published)')
      .eq('activity_id', activityId)
      .eq('is_public', true)
      .eq('learning_activities.is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      res.status(500).json({ error: 'Could not load materials.' })
      return
    }

    const materials = await Promise.all(
      (data ?? []).map(async (material) => {
        const { data: signed, error: signedError } = await admin.storage
          .from(MATERIALS_BUCKET)
          .createSignedUrl(material.storage_path, 60 * 60)

        const { learning_activities: _activity, storage_path: _storagePath, is_public: _isPublic, ...publicMaterial } = material
        return {
          ...publicMaterial,
          download_url: signedError ? null : signed?.signedUrl ?? null,
        }
      }),
    )

    res.status(200).json({ materials })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Could not load materials.' })
  }
}
