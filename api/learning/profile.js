import { getSupabaseAdmin } from '../admin/_supabaseAdmin.js'

const ROLES = ['student', 'instructor', 'admin', 'center_admin', 'super_admin']
const ROLE_RANK = { center_admin: 1, super_admin: 2 }

function getBearerToken(req) {
  const authHeader = req.headers.authorization || ''
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  return match?.[1] || ''
}

function getRoleFromString(value) {
  if (ROLES.includes(value)) return value
  return 'student'
}

/**
 * Every email address this account can be recognised by: its primary address plus
 * the address behind each linked sign-in method. A Google address can differ from
 * the account's primary email, and either one may be the one on the allowlist.
 */
function collectEmails(user) {
  const emails = new Set()
  if (user.email) emails.add(String(user.email).toLowerCase())
  for (const identity of user.identities || []) {
    const identityEmail = identity?.identity_data?.email
    if (identityEmail) emails.add(String(identityEmail).toLowerCase())
  }
  return [...emails]
}

function listProviders(user) {
  const providers = new Set()
  for (const identity of user.identities || []) {
    if (identity?.provider) providers.add(String(identity.provider))
  }
  return [...providers]
}

/** The allowlist entry that applies to this account, strongest role first. */
async function findAccessGrant(admin, emails) {
  if (!emails.length) return null

  const { data, error } = await admin
    .from('learning_admin_access')
    .select('email,role,managed_center_id')
    .in('email', emails)

  if (error) {
    // A missing table (before the migration is applied) must not block sign-in.
    console.error('[learning/profile] admin access lookup failed', { error })
    return null
  }
  if (!data?.length) return null

  return [...data].sort((a, b) => (ROLE_RANK[b.role] || 0) - (ROLE_RANK[a.role] || 0))[0]
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

    const emails = collectEmails(user)
    const providers = listProviders(user)
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null

    const { data: profile, error: profileError } = await admin
      .from('learning_profiles')
      .select('role,managed_center_id,email,full_name')
      .eq('user_id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('[learning/profile] profile lookup failed', { userId: user.id, error: profileError })
      return res.status(500).json({ error: 'Could not load profile.' })
    }

    const grant = await findAccessGrant(admin, emails)

    // An allowlisted email decides the role. Anyone not on the list keeps the role
    // their profile already carries, so admins created by hand stay untouched.
    const targetRole = grant ? grant.role : getRoleFromString(profile?.role)
    const targetCenterId = grant ? grant.managed_center_id || null : profile?.managed_center_id || null

    if (!profile) {
      const { data: createdProfile, error: createError } = await admin
        .from('learning_profiles')
        .insert({
          user_id: user.id,
          role: targetRole,
          managed_center_id: targetCenterId,
          email: user.email || null,
          full_name: fullName,
        })
        .select('role,managed_center_id')
        .single()

      if (createError) {
        console.error('[learning/profile] profile creation failed', { userId: user.id, error: createError })
        return res.status(500).json({ error: 'Could not create profile.' })
      }

      if (grant) await stampGrant(admin, grant.email, user.id)

      return res.status(200).json({
        role: getRoleFromString(createdProfile.role),
        managedCenterId: createdProfile.managed_center_id || null,
        email: user.email || null,
        providers,
      })
    }

    // Keep the stored copy of the identity in step with the account, and apply the
    // allowlisted role. `email` is what the admin Users page displays, so letting it
    // drift makes the page advertise an address that cannot be signed in with.
    const updates = {}
    if ((user.email || null) !== (profile.email || null)) updates.email = user.email || null
    if (fullName && fullName !== profile.full_name) updates.full_name = fullName
    if (targetRole !== profile.role) updates.role = targetRole
    if ((targetCenterId || null) !== (profile.managed_center_id || null)) updates.managed_center_id = targetCenterId

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await admin
        .from('learning_profiles')
        .update(updates)
        .eq('user_id', user.id)

      if (updateError) {
        // Report the role we actually have on record rather than the one we failed
        // to write, so the UI never shows access the database does not back.
        console.error('[learning/profile] profile update failed', {
          userId: user.id,
          attempted: Object.keys(updates),
          error: updateError,
        })
        return res.status(200).json({
          role: getRoleFromString(profile.role),
          managedCenterId: profile.managed_center_id || null,
          email: user.email || null,
          providers,
        })
      }
    }

    if (grant) await stampGrant(admin, grant.email, user.id)

    return res.status(200).json({
      role: getRoleFromString(targetRole),
      managedCenterId: targetCenterId,
      email: user.email || null,
      providers,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load profile.'
    console.error('[learning/profile] request failed', { error })
    return res.status(500).json({ error: message })
  }
}

/** Records that an allowlist entry has been claimed, for the "Active/Pending" column. */
async function stampGrant(admin, email, userId) {
  const { error } = await admin
    .from('learning_admin_access')
    .update({ last_applied_at: new Date().toISOString(), last_applied_user_id: userId })
    .eq('email', email)

  if (error) console.error('[learning/profile] could not stamp admin access', { email, error })
}
