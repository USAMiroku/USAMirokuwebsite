import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { type Session, type User } from '@supabase/supabase-js'
import { assertSupabaseConfigured, supabase } from '../lib/supabaseClient'

type Role = 'student' | 'instructor' | 'admin'

type LearningAuthContextValue = {
  session: Session | null
  user: User | null
  role: Role | null
  isAuthLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
  isInstructor: boolean
}

const LearningAuthContext = createContext<LearningAuthContextValue | undefined>(undefined)

function getRoleFromString(value: string | null | undefined): Role | null {
  if (!value) return null
  if (value === 'admin' || value === 'instructor' || value === 'student') return value
  return null
}

export function LearningAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)
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
        return
      }

      if (!user) {
        setRole(null)
        return
      }

      const { data: profileData, error: profileError } = await assertSupabaseConfigured()
        .from('learning_profiles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      if (profileError) {
        // If no profile exists yet, create one with the default student role.
        if (profileData === null || profileData === undefined) {
          await assertSupabaseConfigured().from('learning_profiles').upsert(
            { user_id: user.id, role: 'student' },
            { onConflict: 'user_id' },
          )
        }
      }

      const { data: profileData2 } = await assertSupabaseConfigured()
        .from('learning_profiles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!isMounted) return
      setRole(getRoleFromString(profileData2?.role ?? null))
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
      isAuthLoading,
      async signIn(email: string, password: string) {
        const client = assertSupabaseConfigured()
        const { error } = await client.auth.signInWithPassword({ email, password })
        if (error) throw error
      },
      async signUp(email: string, password: string) {
        const client = assertSupabaseConfigured()
        const { error } = await client.auth.signUp({ email, password })
        if (error) throw error
      },
      async signOut() {
        const client = assertSupabaseConfigured()
        const { error } = await client.auth.signOut()
        if (error) throw error
      },
      isAdmin: role === 'admin',
      isInstructor: role === 'instructor',
    }),
    [role, session, user, isAuthLoading],
  )

  return <LearningAuthContext.Provider value={value}>{children}</LearningAuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLearningAuth() {
  const ctx = useContext(LearningAuthContext)
  if (!ctx) throw new Error('useLearningAuth must be used within LearningAuthProvider')
  return ctx
}

