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

async function fetchLearningProfile(accessToken: string): Promise<{ role: LearningRole; managedCenterId: string | null }> {
  const response = await fetch('/api/learning/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const result = (await response.json().catch(() => ({}))) as {
    role?: string
    managedCenterId?: string | null
    error?: string
  }

  if (!response.ok) {
    throw new Error(result.error || 'Could not load profile.')
  }

  return {
    role: getRoleFromString(result.role) ?? 'student',
    managedCenterId: result.managedCenterId ?? null,
  }
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

      if (!session?.access_token) {
        setRole(null)
        setManagedCenterId(null)
        return
      }

      let profile: Awaited<ReturnType<typeof fetchLearningProfile>>
      try {
        profile = await fetchLearningProfile(session.access_token)
      } catch (error) {
        console.error('[learning-auth] Could not load profile', error)
        if (!isMounted) return
        setRole(null)
        setManagedCenterId(null)
        return
      }

      if (!isMounted) return
      setRole(profile.role)
      setManagedCenterId(profile.managedCenterId)
    }

    void syncRoleAndProfile()
    return () => {
      isMounted = false
    }
  }, [session?.access_token, user])

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
