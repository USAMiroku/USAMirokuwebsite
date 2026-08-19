import { useEffect, useState } from 'react'
import { Section } from '../../components/Section'
import { usePageMeta } from '../../hooks/usePageMeta'
import { LearningAdminToolbar } from '../components/LearningAdminToolbar'
import { RequireSuperAdmin } from '../components/LearningRouteGuards'
import { supabase } from '../lib/supabaseClient'
import { useLearningAuth } from '../context/LearningAuthContext'
import { useManagedCenters } from '../../organization/centers'

type ProfileRow = {
  user_id: string
  email: string | null
  full_name: string | null
  role: string
  managed_center_id: string | null
}

const ROLE_OPTIONS = ['center_admin', 'super_admin'] as const

export default function LearningAdminUsers() {
  usePageMeta({
    title: 'Admin | Users',
    description: 'Provision admin logins and assign center roles.',
  })

  return (
    <RequireSuperAdmin>
      <LearningAdminUsersInner />
    </RequireSuperAdmin>
  )
}

function LearningAdminUsersInner() {
  const { session } = useLearningAuth()
  const { activeCenters } = useManagedCenters()
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [resettingUserId, setResettingUserId] = useState<string | null>(null)

  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newFullName, setNewFullName] = useState('')
  const [newRole, setNewRole] = useState<(typeof ROLE_OPTIONS)[number]>('center_admin')
  const [newManagedCenterId, setNewManagedCenterId] = useState('')

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError('Supabase is not configured.')
        setIsLoading(false)
        return
      }

      const { data, error: queryError } = await supabase
        .from('learning_profiles')
        .select('user_id,email,full_name,role,managed_center_id')
        .order('created_at', { ascending: false })
        .limit(200)

      if (queryError) {
        setError(queryError.message)
      } else {
        setProfiles((data ?? []) as ProfileRow[])
      }
      setIsLoading(false)
    }

    void load()
  }, [])

  async function updateProfile(profile: ProfileRow, nextRole: string, nextManagedCenterId: string | null) {
    if (!supabase) return

    if (nextRole === 'center_admin' && !nextManagedCenterId) {
      setError('Center admins must be assigned to a center or group.')
      return
    }

    setError(null)
    setMessage(null)

    const { error: updateError } = await supabase
      .from('learning_profiles')
      .update({
        role: nextRole,
        managed_center_id: nextRole === 'center_admin' ? nextManagedCenterId : null,
      })
      .eq('user_id', profile.user_id)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setProfiles((current) =>
      current.map((item) =>
        item.user_id === profile.user_id
          ? {
              ...item,
              role: nextRole,
              managed_center_id: nextRole === 'center_admin' ? nextManagedCenterId : null,
            }
          : item,
      ),
    )
    setMessage('User role updated.')
  }

  async function handleCreateUser() {
    if (!session?.access_token) {
      setError('You must be signed in as a super admin.')
      return
    }

    setCreating(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: newEmail.trim(),
          password: newPassword,
          fullName: newFullName.trim(),
          role: newRole,
          managedCenterId: newRole === 'center_admin' ? newManagedCenterId : null,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Could not create user.')
      }

      setProfiles((current) => [
        {
          user_id: payload.userId,
          email: payload.email,
          full_name: newFullName.trim() || null,
          role: payload.role,
          managed_center_id: payload.managedCenterId,
        },
        ...current,
      ])
      setMessage('Admin login created.')
      setNewEmail('')
      setNewPassword('')
      setNewFullName('')
      setNewRole('center_admin')
      setNewManagedCenterId('')
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Could not create user.')
    } finally {
      setCreating(false)
    }
  }

  async function handleDeleteUser(profile: ProfileRow) {
    if (!session?.access_token) {
      setError('You must be signed in as a super admin.')
      return
    }

    const label = profile.full_name || profile.email || profile.user_id
    const confirmed = window.confirm(`Delete ${label}? This will also remove any related learning access records.`)
    if (!confirmed) return

    setDeletingUserId(profile.user_id)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: profile.user_id,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Could not delete user.')
      }

      setProfiles((current) => current.filter((item) => item.user_id !== profile.user_id))
      setMessage('User removed.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete user.')
    } finally {
      setDeletingUserId(null)
    }
  }

  async function handleSendPasswordReset(profile: ProfileRow) {
    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }
    if (!profile.email) {
      setError('This profile does not have an email address for password recovery.')
      return
    }

    setResettingUserId(profile.user_id)
    setError(null)
    setMessage(null)

    try {
      const redirectTo = `${window.location.origin}/reset-password`
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(profile.email, { redirectTo })
      if (resetError) throw resetError
      setMessage(`Password-reset email sent to ${profile.email}. The administrator must open the secure link and choose a new password.`)
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Could not send the password-reset email.')
    } finally {
      setResettingUserId(null)
    }
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Super Admin</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">Admin Users</h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Create admin logins and assign access to the national site or a specific center.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <LearningAdminToolbar current="users" />

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div> : null}
            {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-emerald-900">{message}</div> : null}

            <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-serif text-deep-slate">Create Login</h2>
              <div className="mt-6 grid gap-4">
                <input value={newFullName} onChange={(e) => setNewFullName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
                <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Temporary password" className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as (typeof ROLE_OPTIONS)[number])} className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm">
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {newRole === 'center_admin' ? (
                  <select value={newManagedCenterId} onChange={(e) => setNewManagedCenterId(e.target.value)} className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm">
                    <option value="">Select center or group</option>
                    {activeCenters.filter((center) => center.kind !== 'hq').map((center) => (
                      <option key={center.id} value={center.id}>{center.name}</option>
                    ))}
                  </select>
                ) : null}
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => void handleCreateUser()}
                  disabled={creating}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-divine-gold px-6 text-[10px] font-semibold uppercase text-white hover:bg-[#9e730a] disabled:opacity-60"
                >
                  {creating ? 'Creating...' : 'Create Login'}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-serif text-deep-slate">Existing Profiles</h2>
            <div className="mt-6 space-y-4">
              {isLoading ? <p className="text-slate-600">Loading...</p> : null}
              {profiles.map((profile) => (
                <UserProfileCard
                  key={profile.user_id}
                  profile={profile}
                  centers={activeCenters}
                  onSave={updateProfile}
                  onSendPasswordReset={handleSendPasswordReset}
                  onDelete={handleDeleteUser}
                  isSendingPasswordReset={resettingUserId === profile.user_id}
                  isDeleting={deletingUserId === profile.user_id}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

function UserProfileCard({
  profile,
  centers,
  onSave,
  onSendPasswordReset,
  onDelete,
  isSendingPasswordReset,
  isDeleting,
}: {
  profile: ProfileRow
  centers: ReturnType<typeof useManagedCenters>['activeCenters']
  onSave: (profile: ProfileRow, nextRole: string, nextManagedCenterId: string | null) => Promise<void>
  onSendPasswordReset: (profile: ProfileRow) => Promise<void>
  onDelete: (profile: ProfileRow) => Promise<void>
  isSendingPasswordReset: boolean
  isDeleting: boolean
}) {
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]>(
    ROLE_OPTIONS.includes(profile.role as (typeof ROLE_OPTIONS)[number]) ? (profile.role as (typeof ROLE_OPTIONS)[number]) : 'center_admin',
  )
  const [managedCenterId, setManagedCenterId] = useState(profile.managed_center_id ?? '')

  return (
    <div className="rounded-2xl border border-[rgba(141,107,38,0.12)] bg-white/70 px-5 py-4">
      <p className="text-lg font-serif text-deep-slate">{profile.full_name || profile.email || profile.user_id}</p>
      <p className="mt-1 text-sm text-slate-500">{profile.email || profile.user_id}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <select value={role} onChange={(e) => setRole(e.target.value as (typeof ROLE_OPTIONS)[number])} className="rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm">
          {ROLE_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select value={managedCenterId} onChange={(e) => setManagedCenterId(e.target.value)} disabled={role !== 'center_admin'} className="rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm disabled:bg-slate-50">
          <option value="">Select center or group</option>
          {centers.filter((center) => center.kind !== 'hq').map((center) => (
            <option key={center.id} value={center.id}>{center.name}</option>
          ))}
        </select>
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="button"
            onClick={() => void onSave(profile, role, role === 'center_admin' ? managedCenterId || null : null)}
            className="inline-flex h-10 items-center justify-center rounded-full border border-sage-600 px-5 text-[10px] font-semibold uppercase text-sage-700 hover:bg-sage-50"
          >
            Save Access
          </button>
          <button
            type="button"
            onClick={() => void onSendPasswordReset(profile)}
            disabled={isSendingPasswordReset || !profile.email}
            className="inline-flex h-10 items-center justify-center rounded-full border border-divine-gold px-5 text-[10px] font-semibold uppercase text-amber-800 hover:bg-amber-50 disabled:opacity-60"
          >
            {isSendingPasswordReset ? 'Sending...' : 'Send Password Reset'}
          </button>
          <button
            type="button"
            onClick={() => void onDelete(profile)}
            disabled={isDeleting}
            className="inline-flex h-10 items-center justify-center rounded-full border border-rose-200 px-5 text-[10px] font-semibold uppercase text-rose-700 hover:bg-rose-50 disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      {!ROLE_OPTIONS.includes(profile.role as (typeof ROLE_OPTIONS)[number]) ? (
        <p className="mt-3 text-xs text-slate-500">
          This is a legacy profile with the role <span className="font-semibold">{profile.role}</span>. Use Delete to remove it, or Save to convert it to a current admin role.
        </p>
      ) : null}
    </div>
  )
}
