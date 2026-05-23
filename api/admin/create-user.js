import { parseJsonBody, requireSuperAdmin } from './_supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

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

    if (!['center_admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' })
    }

    if (role === 'center_admin' && !managedCenterId) {
      return res.status(400).json({ error: 'Center admin requires a managed center.' })
    }

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || undefined,
      },
    })

    if (createError || !created.user) {
      return res.status(400).json({ error: createError?.message || 'Could not create user.' })
    }

    const { error: profileError } = await admin.from('learning_profiles').upsert(
      {
        user_id: created.user.id,
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
      userId: created.user.id,
      email,
      role,
      managedCenterId: role === 'center_admin' ? managedCenterId : null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create user.'
    return res.status(500).json({ error: message })
  }
}
