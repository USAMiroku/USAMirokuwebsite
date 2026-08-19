import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLearningAuth } from '../context/LearningAuthContext'

type AdminSection = 'donations' | 'activities' | 'organization' | 'materials' | 'program-photos' | 'users'

const SECTION_LABELS: Record<AdminSection, string> = {
  donations: 'Donations',
  activities: 'Activities',
  organization: 'Centers & Groups',
  materials: 'Event Downloads',
  'program-photos': 'Program Photos',
  users: 'Admin Users',
}

export function LearningAdminToolbar({ current }: { current: AdminSection }) {
  const navigate = useNavigate()
  const { role, isSuperAdmin, isCenterAdmin, signOut } = useLearningAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  const links: Array<{ key: AdminSection; to: string; label: string }> = [
    { key: 'donations', to: '/admin/donations', label: SECTION_LABELS.donations },
    { key: 'activities', to: '/admin/activities', label: SECTION_LABELS.activities },
    { key: 'materials', to: '/admin/materials', label: SECTION_LABELS.materials },
  ]

  if (isSuperAdmin || isCenterAdmin) {
    links.push({ key: 'program-photos', to: '/admin/program-photos', label: SECTION_LABELS['program-photos'] })
  }

  if (isSuperAdmin) {
    links.push(
      { key: 'organization', to: '/admin/organization', label: SECTION_LABELS.organization },
      { key: 'users', to: '/admin/users', label: SECTION_LABELS.users },
    )
  }

  async function handleSignOut() {
    setIsSigningOut(true)
    setSignOutError(null)

    try {
      await signOut()
      navigate('/admin', { replace: true })
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Could not log out.')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/activities" className="text-slate-600 hover:text-sage-600 underline text-sm">
            Back to Activities
          </Link>
          {links.map((link) =>
            link.key === current ? (
              <span
                key={link.key}
                className="rounded-full bg-sage-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-700"
              >
                {link.label}
              </span>
            ) : (
              <Link key={link.key} to={link.to} className="text-slate-600 hover:text-sage-600 underline text-sm">
                {link.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-4">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-slate-400">Role: {role ?? 'admin'}</p>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={isSigningOut}
            className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {isSigningOut ? 'Logging Out...' : 'Log Out'}
          </button>
        </div>
      </div>

      {signOutError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-900">{signOutError}</div>
      ) : null}
    </div>
  )
}
