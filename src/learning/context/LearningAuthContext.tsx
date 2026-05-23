import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { type Session, type User } from '@supabase/supabase-js'
import { assertSupabaseConfigured, supabase } from '../lib/supabaseClient'

export type LearningRole = 'student' | 'instructor' | 'admin' | 'center_admin' | 'super_admin'

type LearningAuthContextValue = {
  session: Session | null
  user: User | null
  role: LearningRole | null
  managedCenterId: string | null
  isAuthLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
  isInstructor: boolean
  isSuperAdmin: boolean
  isCenterAdmin: boolean
}

const LearningAuthContext = createContext<LearningAuthContextValue | undefined>(undefined)

function getRoleFromString(value: string | null | undefined): LearningRole | null {
  if (!value) return null
  if (value === 'admin' || value === 'instructor' || value === 'student' || value === 'center_admin' || value === 'super_admin') return value
  return null
}

export function LearningAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<LearningRole | null>(null)
  const [managedCenterId, setManagedCenterId] = useState<string | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function init() {
      if (!supabase) {
        if (!isMounted) return
        setIsAuthLoading(false)
        return
      }

      setIsAuthLoading(true)
      const { data } = await assertSupabaseConfigured().auth.getSession()
      const nextSession = data.session
      if (!isMounted) return

      setSession(nextSession)
      setUser(nextSession?.user ?? null)
    }

    void init().finally(() => {
      if (isMounted) setIsAuthLoading(false)
    })

    if (supabase) {
      const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession)
        setUser(nextSession?.user ?? null)
      })

      return () => {
        isMounted = false
        subscription.subscription.unsubscribe()
      }
    }

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    async function syncRoleAndProfile() {
      if (!supabase) {
        setRole(null)
        setManagedCenterId(null)
        return
      }

      if (!user) {
        setRole(null)
        setManagedCenterId(null)
        return
      }

      const { data: profileData, error: profileError } = await assertSupabaseConfigured()
        .from('learning_profiles')
        .select('role,managed_center_id')
        .eq('user_id', user.id)
        .maybeSingle()

      // Create profile if it doesn't exist (first-time sign-in).
      if (!profileData && !profileError) {
        await assertSupabaseConfigured().from('learning_profiles').insert({
          user_id: user.id,
          role: 'student',
          email: user.email ?? null,
          full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
        })
      } else if (profileError) {
        // Try upsert as fallback (e.g. race condition).
        await assertSupabaseConfigured().from('learning_profiles').upsert(
          {
            user_id: user.id,
            role: 'student',
            email: user.email ?? null,
            full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
          },
          { onConflict: 'user_id' },
        )
      } else {
        const existingRole = getRoleFromString(profileData?.role) ?? 'student'
        const existingManagedCenterId = profileData?.managed_center_id ?? null
        await assertSupabaseConfigured().from('learning_profiles').upsert(
          {
            user_id: user.id,
            role: existingRole,
            managed_center_id: existingManagedCenterId,
            email: user.email ?? null,
            full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
          },
          { onConflict: 'user_id' },
        )
      }

      const { data: profileData2 } = await assertSupabaseConfigured()
        .from('learning_profiles')
        .select('role,managed_center_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!isMounted) return
      setRole(getRoleFromString(profileData2?.role ?? null))
      setManagedCenterId(profileData2?.managed_center_id ?? null)
    }

    void syncRoleAndProfile()
    return () => {
      isMounted = false
    }
  }, [user])

  const value = useMemo<LearningAuthContextValue>(
    () => ({
      session,
      user,
      role,
      managedCenterId,
      isAuthLoading,
      async signIn(email: string, password: string) {
        const client = assertSupabaseConfigured()
        const { error } = await client.auth.signInWithPassword({ email, password })
        if (error) throw error
      },
      async signOut() {
        const client = assertSupabaseConfigured()
        const { error } = await client.auth.signOut()
        if (error) throw error
      },
      isAdmin: role === 'admin' || role === 'super_admin' || role === 'center_admin',
      isInstructor: role === 'instructor',
      isSuperAdmin: role === 'super_admin',
      isCenterAdmin: role === 'center_admin',
    }),
    [managedCenterId, role, session, user, isAuthLoading],
  )

  return <LearningAuthContext.Provider value={value}>{children}</LearningAuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLearningAuth() {
  const ctx = useContext(LearningAuthContext)
  if (!ctx) throw new Error('useLearningAuth must be used within LearningAuthProvider')
  return ctx
}
