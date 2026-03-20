import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null

export function assertSupabaseConfigured(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Learning app is missing Supabase configuration. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your .env (or .env.local).',
    )
  }
  return supabase
}

