import { getSupabaseAdmin } from '../admin/_supabaseAdmin.js'

function getBearerToken(req) {
  const authHeader = req.headers.authorization || ''
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  return match?.[1] || ''
}

function getRoleFromString(value) {
  if (['student', 'instructor', 'admin', 'center_admin', 'super_admin'].includes(value)) return value
  return 'student'
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  try {
    const token = getBearerToken(req)
    if (!token) {
      return res.status(401).json({ error: 'Missing bearer token.' })
    }

    const admin = getSupabaseAdmin()
    const { data: userData, error: userError } = await admin.auth.getUser(token)
    const user = userData.user

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid bearer token.' })
    }

    const { data: profile, error: profileError } = await admin
      .from('learning_profiles')
      .select('role,managed_center_id,email,full_name')
      .eq('user_id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('[learning/profile] profile lookup failed', {
        userId: user.id,
        error: profileError,
      })
      return res.status(500).json({ error: 'Could not load profile.' })
    }

    if (!profile) {
      const { data: createdProfile, error: createError } = await admin
        .from('learning_profiles')
        .insert({
          user_id: user.id,
          role: 'student',
          email: user.email || null,
          full_name: user.user_metadata?.full_name || null,
        })
        .select('role,managed_center_id,email,full_name')
        .single()

      if (createError) {
        console.error('[learning/profile] profile creation failed', {
          userId: user.id,
          error: createError,
        })
        return res.status(500).json({ error: 'Could not create profile.' })
      }

      return res.status(200).json({
        role: getRoleFromString(createdProfile.role),
        managedCenterId: createdProfile.managed_center_id || null,
      })
    }

    const shouldUpdateIdentity =
      (user.email || null) !== (profile.email || null) ||
      (user.user_metadata?.full_name || null) !== (profile.full_name || null)

    if (shouldUpdateIdentity) {
      const { error: updateError } = await admin
        .from('learning_profiles')
        .update({
          email: user.email || null,
          full_name: user.user_metadata?.full_name || null,
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('[learning/profile] profile identity update failed', {
          userId: user.id,
          error: updateError,
        })
      }
    }

    return res.status(200).json({
      role: getRoleFromString(profile.role),
      managedCenterId: profile.managed_center_id || null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load profile.'
    console.error('[learning/profile] request failed', { error })
    return res.status(500).json({ error: message })
  }
}
