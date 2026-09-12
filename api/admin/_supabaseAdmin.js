import { createClient } from '@supabase/supabase-js'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function sendApiError(res, error, fallback = 'Unexpected error.') {
  if (error instanceof ApiError) {
    return res.status(error.status).json({ error: error.message })
  }
  console.error(error)
  return res.status(500).json({ error: fallback })
}

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
    throw new ApiError(401, 'Authentication is required.')
  }

  const admin = getSupabaseAdmin()
  const { data: userData, error: userError } = await admin.auth.getUser(token)
  if (userError || !userData.user) {
    throw new ApiError(401, 'The authentication session is invalid or expired.')
  }

  const { data: profile, error: profileError } = await admin
    .from('learning_profiles')
    .select('role')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (profileError) {
    throw new ApiError(500, 'Could not verify administrative access.')
  }

  if (!profile || profile.role !== 'super_admin') {
    throw new ApiError(403, 'Not authorized.')
  }

  return { admin, currentUser: userData.user }
}

export async function requireAdminAccess(req) {
  const authHeader = req.headers.authorization || ''
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  const token = match?.[1]

  if (!token) {
    throw new ApiError(401, 'Authentication is required.')
  }

  const admin = getSupabaseAdmin()
  const { data: userData, error: userError } = await admin.auth.getUser(token)
  if (userError || !userData.user) {
    throw new ApiError(401, 'The authentication session is invalid or expired.')
  }

  const { data: profile, error: profileError } = await admin
    .from('learning_profiles')
    .select('role,managed_center_id')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (profileError) {
    throw new ApiError(500, 'Could not verify administrative access.')
  }

  if (!profile || !['admin', 'instructor', 'center_admin', 'super_admin'].includes(profile.role)) {
    throw new ApiError(403, 'Not authorized.')
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
