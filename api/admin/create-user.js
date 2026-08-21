import { parseJsonBody, requireSuperAdmin, sendApiError } from './_supabaseAdmin.js'
import { enforceRateLimit, enforceSameOrigin } from '../_security.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }
  if (!enforceSameOrigin(req, res)) return
  if (!enforceRateLimit(req, res, { key: 'admin-create-user', limit: 8, windowMs: 10 * 60_000 })) return

  try {
    const { admin } = await requireSuperAdmin(req)
    const body = parseJsonBody(req)

    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '').trim()
    const fullName = String(body.fullName || '').trim()
    const role = String(body.role || '').trim()
    const managedCenterId = body.managedCenterId ? String(body.managedCenterId) : null

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }
    if (password.length < 14 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must be at least 14 characters and include upper- and lowercase letters, a number, and a symbol.' })
    }

    if (!['center_admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' })
    }

    if (role === 'center_admin' && !managedCenterId) {
      return res.status(400).json({ error: 'Center admin requires a managed center.' })
    }

    let userId

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || undefined,
      },
    })

    if (createError) {
      const alreadyExists =
        createError.message?.toLowerCase().includes('already been registered') ||
        createError.message?.toLowerCase().includes('already exists')

      if (!alreadyExists) {
        return res.status(400).json({ error: createError.message || 'Could not create user.' })
      }

      return res.status(409).json({ error: 'An authentication account already exists for this email. Use the password-reset workflow instead of replacing its credentials.' })
    } else {
      if (!created.user) {
        return res.status(400).json({ error: 'Could not create user.' })
      }
      userId = created.user.id
    }

    const { error: profileError } = await admin.from('learning_profiles').upsert(
      {
        user_id: userId,
        email,
        full_name: fullName || null,
        role,
        managed_center_id: role === 'center_admin' ? managedCenterId : null,
      },
      { onConflict: 'user_id' },
    )

    if (profileError) {
      return res.status(400).json({ error: profileError.message })
    }

    return res.status(200).json({
      userId,
      email,
      role,
      managedCenterId: role === 'center_admin' ? managedCenterId : null,
    })
  } catch (error) {
    return sendApiError(res, error, 'Could not create user.')
  }
}
