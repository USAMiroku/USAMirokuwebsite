import { getSupabaseAdmin } from '../admin/_supabaseAdmin.js'

const MATERIALS_BUCKET = 'learning-materials'

export default async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  try {
    const activityId = String(req.query?.activityId || '').trim()
    if (!activityId) {
      res.status(400).json({ error: 'activityId is required.' })
      return
    }

    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('learning_materials')
      .select('id,activity_id,session_id,title,description,storage_path,file_name,mime_type,created_at')
      .eq('activity_id', activityId)
      .order('created_at', { ascending: false })

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }

    const materials = await Promise.all(
      (data ?? []).map(async (material) => {
        const { data: signed, error: signedError } = await admin.storage
          .from(MATERIALS_BUCKET)
          .createSignedUrl(material.storage_path, 60 * 60)

        return {
          ...material,
          download_url: signedError ? null : signed?.signedUrl ?? null,
        }
      }),
    )

    res.status(200).json({ materials })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error.'
    res.status(500).json({ error: message })
  }
}
