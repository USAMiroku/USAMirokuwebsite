import { createClient } from '@supabase/supabase-js'

function getEnv(name) {
  return process.env[name] || ''
}

export function getSupabaseAdmin() {
  const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL')
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function requireSuperAdmin(req) {
  const authHeader = req.headers.authorization || ''
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  const token = match?.[1]

  if (!token) {
    throw new Error('Missing bearer token.')
  }

  const admin = getSupabaseAdmin()
  const { data: userData, error: userError } = await admin.auth.getUser(token)
  if (userError || !userData.user) {
    throw new Error('Invalid bearer token.')
  }

  const { data: profile, error: profileError } = await admin
    .from('learning_profiles')
    .select('role')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (profileError) {
    throw new Error(profileError.message)
  }

  if (!profile || profile.role !== 'super_admin') {
    throw new Error('Not authorized.')
  }

  return { admin, currentUser: userData.user }
}

export async function requireAdminAccess(req) {
  const authHeader = req.headers.authorization || ''
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  const token = match?.[1]

  if (!token) {
    throw new Error('Missing bearer token.')
  }

  const admin = getSupabaseAdmin()
  const { data: userData, error: userError } = await admin.auth.getUser(token)
  if (userError || !userData.user) {
    throw new Error('Invalid bearer token.')
  }

  const { data: profile, error: profileError } = await admin
    .from('learning_profiles')
    .select('role,managed_center_id')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (profileError) {
    throw new Error(profileError.message)
  }

  if (!profile || !['admin', 'instructor', 'center_admin', 'super_admin'].includes(profile.role)) {
    throw new Error('Not authorized.')
  }

  return { admin, currentUser: userData.user, profile }
}

export function parseJsonBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}
