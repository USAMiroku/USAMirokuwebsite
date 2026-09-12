import { requireAdminAccess, sendApiError } from './_supabaseAdmin.js'
import { enforceRateLimit, enforceSameOrigin } from '../_security.js'

const MATERIALS_BUCKET = 'learning-materials'
const MAX_FILE_BYTES = 10 * 1024 * 1024
const ALLOWED_FILES = new Map([
  ['pdf', 'application/pdf'],
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
  ['png', 'image/png'],
  ['webp', 'image/webp'],
])

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '12mb',
    },
  },
}

function sanitizeFileName(name) {
  return String(name || 'download')
    .normalize('NFKC')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replaceAll('/', '_')
    .replaceAll('\\', '_')
    .replace(/\s+/g, '_')
    .replace(/^\.+/, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(-160)
}

function isExpectedSignature(binary, extension) {
  if (extension === 'pdf') return binary.subarray(0, 5).toString('ascii') === '%PDF-'
  if (extension === 'jpg' || extension === 'jpeg') return binary[0] === 0xff && binary[1] === 0xd8 && binary[2] === 0xff
  if (extension === 'png') return binary.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))
  if (extension === 'webp') return binary.subarray(0, 4).toString('ascii') === 'RIFF' && binary.subarray(8, 12).toString('ascii') === 'WEBP'
  return false
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }
  if (!enforceSameOrigin(req, res)) return
  if (!enforceRateLimit(req, res, { key: 'admin-upload-material', limit: 20, windowMs: 10 * 60_000 })) return

  try {
    const { admin, profile } = await requireAdminAccess(req)
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

    const uploadMode = String(body.uploadMode || '').trim()
    const title = String(body.title || '').trim()
    const description = String(body.description || '').trim()
    const activityId = body.activityId ? String(body.activityId).trim() : ''
    const sessionId = body.sessionId ? String(body.sessionId).trim() : ''
    const fileName = sanitizeFileName(body.fileName)
    const mimeType = body.mimeType ? String(body.mimeType).trim() : null
    const fileBase64 = String(body.fileBase64 || '').trim()
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    const expectedMime = ALLOWED_FILES.get(extension)

    if (!['session', 'self_study'].includes(uploadMode)) {
      return res.status(400).json({ error: 'Invalid upload mode.' })
    }
    if (!title) {
      return res.status(400).json({ error: 'Download title is required.' })
    }
    if (!fileBase64) {
      return res.status(400).json({ error: 'File data is required.' })
    }
    if (!expectedMime || mimeType !== expectedMime) {
      return res.status(400).json({ error: 'Only PDF, JPG, PNG, and WebP files are allowed.' })
    }

    let resolvedActivityId = activityId
    let resolvedSessionId = uploadMode === 'session' ? sessionId : null
    let activityCenterId = null

    if (uploadMode === 'session') {
      if (!sessionId) {
        return res.status(400).json({ error: 'Session is required.' })
      }
      const { data: sessionRow, error: sessionError } = await admin
        .from('learning_sessions')
        .select('id,activity_id,learning_activities(center_id)')
        .eq('id', sessionId)
        .maybeSingle()

      if (sessionError) return res.status(400).json({ error: sessionError.message })
      if (!sessionRow) return res.status(404).json({ error: 'Session not found.' })

      resolvedActivityId = sessionRow.activity_id
      activityCenterId = sessionRow.learning_activities?.center_id ?? null
    } else {
      if (!activityId) {
        return res.status(400).json({ error: 'Event is required.' })
      }
      const { data: activityRow, error: activityError } = await admin
        .from('learning_activities')
        .select('id,center_id')
        .eq('id', activityId)
        .maybeSingle()

      if (activityError) return res.status(400).json({ error: activityError.message })
      if (!activityRow) return res.status(404).json({ error: 'Event not found.' })
      activityCenterId = activityRow.center_id ?? null
    }

    if (profile.role === 'center_admin' && profile.managed_center_id && activityCenterId !== profile.managed_center_id) {
      return res.status(403).json({ error: 'This event belongs to another center.' })
    }

    const binary = Buffer.from(fileBase64, 'base64')
    if (binary.length === 0 || binary.length > MAX_FILE_BYTES) {
      return res.status(400).json({ error: 'The file must be 10 MB or smaller.' })
    }
    if (!isExpectedSignature(binary, extension)) {
      return res.status(400).json({ error: 'The file content does not match its extension.' })
    }
    const path =
      uploadMode === 'session'
        ? `session/${resolvedSessionId}/${fileName}`
        : `activity/${resolvedActivityId}/${fileName}`

    const { error: uploadError } = await admin.storage.from(MATERIALS_BUCKET).upload(path, binary, {
      upsert: false,
      contentType: mimeType || undefined,
    })

    if (uploadError) {
      return res.status(400).json({ error: uploadError.message })
    }

    const { data: material, error: insertError } = await admin
      .from('learning_materials')
      .insert({
        activity_id: resolvedActivityId,
        session_id: resolvedSessionId,
        title,
        description: description || null,
        storage_path: path,
        file_name: fileName,
        mime_type: mimeType,
        is_public: uploadMode === 'self_study',
      })
      .select('id,activity_id,session_id,title,file_name')
      .single()

    if (insertError) {
      await admin.storage.from(MATERIALS_BUCKET).remove([path])
      return res.status(400).json({ error: insertError.message })
    }

    return res.status(200).json({ material })
  } catch (error) {
    return sendApiError(res, error, 'Could not upload download.')
  }
}
