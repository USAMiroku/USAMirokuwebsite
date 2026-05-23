import { parseJsonBody, requireSuperAdmin } from './_supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  try {
    const { admin, currentUser } = await requireSuperAdmin(req)
    const body = parseJsonBody(req)
    const userId = String(body.userId || '').trim()

    if (!userId) {
      return res.status(400).json({ error: 'User id is required.' })
    }

    if (userId === currentUser.id) {
      return res.status(400).json({ error: 'You cannot delete your own super admin account.' })
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(userId)

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message || 'Could not delete user.' })
    }

    return res.status(200).json({ ok: true, userId })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not delete user.'
    return res.status(500).json({ error: message })
  }
}
