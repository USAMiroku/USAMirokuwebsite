import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useLearningAuth } from '../context/LearningAuthContext'

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { session, isAuthLoading } = useLearningAuth()

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!session) {
    const next = `${location.pathname}${location.search}`
    const signInPath = location.pathname.startsWith('/admin') ? '/admin' : '/learn/sign-in'
    return <Navigate to={`${signInPath}?next=${encodeURIComponent(next)}`} replace />
  }

  return <>{children}</>
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { session, isAuthLoading, isAdmin, isInstructor } = useLearningAuth()

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!session) {
    const next = `${location.pathname}${location.search}`
    return <Navigate to={`/admin?next=${encodeURIComponent(next)}`} replace />
  }

  if (!isAdmin && !isInstructor) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-xl px-6 text-center space-y-4">
          <h1 className="text-3xl font-serif text-deep-slate">Not authorized</h1>
          <p className="text-slate-600">This page is available to instructors/admins only.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export function RequireSuperAdmin({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { session, isAuthLoading, isSuperAdmin } = useLearningAuth()

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!session) {
    const next = `${location.pathname}${location.search}`
    return <Navigate to={`/admin?next=${encodeURIComponent(next)}`} replace />
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-xl px-6 text-center space-y-4">
          <h1 className="text-3xl font-serif text-deep-slate">Not authorized</h1>
          <p className="text-slate-600">This page is available to super admins only.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
