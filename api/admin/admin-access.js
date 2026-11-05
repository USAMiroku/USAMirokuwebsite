import { parseJsonBody, requireSuperAdmin, sendApiError } from './_supabaseAdmin.js'
import { enforceRateLimit, enforceSameOrigin } from '../_security.js'

const ALLOWED_ROLES = ['center_admin', 'super_admin']

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/** Pulls every auth account, so the page can show real login emails and sign-in methods. */
async function loadAuthAccounts(admin) {
  const accounts = new Map()
  const perPage = 1000

  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) throw new Error(error.message || 'Could not list accounts.')

    const users = data?.users || []
    for (const user of users) {
      const identityEmails = (user.identities || [])
        .map((identity) => identity?.identity_data?.email)
        .filter(Boolean)
        .map((email) => String(email).toLowerCase())

      accounts.set(user.id, {
        userId: user.id,
        email: user.email || null,
        providers: [...new Set((user.identities || []).map((i) => i?.provider).filter(Boolean))],
        identityEmails: [...new Set(identityEmails)],
        lastSignInAt: user.last_sign_in_at || null,
      })
    }

    if (users.length < perPage) break
  }

  return accounts
}

export default async function handler(req, res) {
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, DELETE')
    return res.status(405).json({ error: 'Method not allowed.' })
  }
  if (!enforceSameOrigin(req, res)) return
  if (!enforceRateLimit(req, res, { key: 'admin-access', limit: 60, windowMs: 10 * 60_000 })) return

  try {
    const { admin, currentUser } = await requireSuperAdmin(req)

    if (req.method === 'GET') {
      const [{ data: entries, error: entriesError }, { data: profiles, error: profilesError }] = await Promise.all([
        admin
          .from('learning_admin_access')
          .select('email,role,managed_center_id,note,created_at,last_applied_at,last_applied_user_id')
          .order('role', { ascending: false })
          .order('email', { ascending: true }),
        admin.from('learning_profiles').select('user_id,role,managed_center_id,full_name'),
      ])

      if (entriesError) return res.status(400).json({ error: entriesError.message })
      if (profilesError) return res.status(400).json({ error: profilesError.message })

      const accounts = await loadAuthAccounts(admin)
      const profileByUserId = new Map((profiles || []).map((p) => [p.user_id, p]))

      // An allowlist entry is "active" once an account that can sign in carries it.
      const accountsByEmail = new Map()
      for (const account of accounts.values()) {
        for (const email of [account.email, ...account.identityEmails].filter(Boolean)) {
          const key = String(email).toLowerCase()
          if (!accountsByEmail.has(key)) accountsByEmail.set(key, account)
        }
      }

      const allowlist = (entries || []).map((entry) => {
        const account = accountsByEmail.get(entry.email) || null
        const profile = account ? profileByUserId.get(account.userId) || null : null
        return {
          email: entry.email,
          role: entry.role,
          managedCenterId: entry.managed_center_id || null,
          note: entry.note || null,
          createdAt: entry.created_at,
          lastAppliedAt: entry.last_applied_at,
          account: account
            ? {
                userId: account.userId,
                loginEmail: account.email,
                providers: account.providers,
                lastSignInAt: account.lastSignInAt,
                currentRole: profile?.role || null,
                fullName: profile?.full_name || null,
              }
            : null,
        }
      })

      // Admins holding a role without an allowlist entry: visible so nothing is hidden.
      const allowlistedEmails = new Set((entries || []).map((e) => e.email))
      const unlisted = []
      for (const profile of profiles || []) {
        if (!ALLOWED_ROLES.includes(profile.role)) continue
        const account = accounts.get(profile.user_id)
        const email = account?.email ? account.email.toLowerCase() : null
        const matched =
          (email && allowlistedEmails.has(email)) ||
          (account?.identityEmails || []).some((e) => allowlistedEmails.has(e))
        if (matched) continue
        unlisted.push({
          userId: profile.user_id,
          loginEmail: account?.email || null,
          fullName: profile.full_name || null,
          role: profile.role,
          managedCenterId: profile.managed_center_id || null,
          providers: account?.providers || [],
          lastSignInAt: account?.lastSignInAt || null,
        })
      }

      return res.status(200).json({ allowlist, unlisted })
    }

    const body = parseJsonBody(req)
    const email = normalizeEmail(body.email)

    if (!email || !isEmail(email)) {
      return res.status(400).json({ error: 'Enter a valid email address.' })
    }

    if (req.method === 'DELETE') {
      const selfEmails = [currentUser.email, ...(currentUser.identities || []).map((i) => i?.identity_data?.email)]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase())

      if (selfEmails.includes(email)) {
        return res.status(400).json({ error: 'You cannot remove your own admin access.' })
      }

      const { error: deleteError } = await admin.from('learning_admin_access').delete().eq('email', email)
      if (deleteError) return res.status(400).json({ error: deleteError.message })

      // Removing the entry revokes access, otherwise the person stays an admin and
      // the page would claim they no longer are.
      let revokedUserId = null
      if (body.revokeExistingAccess !== false) {
        const accounts = await loadAuthAccounts(admin)
        const match = [...accounts.values()].find(
          (account) =>
            (account.email && account.email.toLowerCase() === email) || account.identityEmails.includes(email),
        )

        if (match) {
          const { error: demoteError } = await admin
            .from('learning_profiles')
            .update({ role: 'student', managed_center_id: null })
            .eq('user_id', match.userId)
          if (demoteError) return res.status(400).json({ error: demoteError.message })
          revokedUserId = match.userId
        }
      }

      return res.status(200).json({ email, removed: true, revokedUserId })
    }

    const role = String(body.role || '').trim()
    const managedCenterId = body.managedCenterId ? String(body.managedCenterId) : null
    const note = body.note ? String(body.note).trim().slice(0, 300) : null

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Choose either Center admin or Super admin.' })
    }
    if (role === 'center_admin' && !managedCenterId) {
      return res.status(400).json({ error: 'A center admin must be assigned to a center or group.' })
    }

    const { data: saved, error: upsertError } = await admin
      .from('learning_admin_access')
      .upsert(
        {
          email,
          role,
          managed_center_id: role === 'center_admin' ? managedCenterId : null,
          note,
          invited_by: currentUser.id,
        },
        { onConflict: 'email' },
      )
      .select('email,role,managed_center_id,note,created_at,last_applied_at')
      .single()

    if (upsertError) return res.status(400).json({ error: upsertError.message })

    // Apply straight away when the account already exists, so access does not wait
    // for the next sign-in.
    let appliedUserId = null
    const accounts = await loadAuthAccounts(admin)
    const match = [...accounts.values()].find(
      (account) => (account.email && account.email.toLowerCase() === email) || account.identityEmails.includes(email),
    )

    if (match) {
      const { error: applyError } = await admin.from('learning_profiles').upsert(
        {
          user_id: match.userId,
          email: match.email,
          role,
          managed_center_id: role === 'center_admin' ? managedCenterId : null,
        },
        { onConflict: 'user_id' },
      )
      if (applyError) return res.status(400).json({ error: applyError.message })

      appliedUserId = match.userId
      await admin
        .from('learning_admin_access')
        .update({ last_applied_at: new Date().toISOString(), last_applied_user_id: match.userId })
        .eq('email', email)
    }

    return res.status(200).json({
      email: saved.email,
      role: saved.role,
      managedCenterId: saved.managed_center_id || null,
      note: saved.note,
      appliedUserId,
      accountExists: Boolean(match),
    })
  } catch (error) {
    return sendApiError(res, error, 'Could not update admin access.')
  }
}
