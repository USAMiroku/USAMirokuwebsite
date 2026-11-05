import { useCallback, useEffect, useState } from 'react'
import { useLearningAuth } from '../context/LearningAuthContext'
import { useManagedCenters } from '../../organization/centers'

type AllowlistAccount = {
  userId: string
  loginEmail: string | null
  providers: string[]
  lastSignInAt: string | null
  currentRole: string | null
  fullName: string | null
}

type AllowlistEntry = {
  email: string
  role: 'center_admin' | 'super_admin'
  managedCenterId: string | null
  note: string | null
  createdAt: string
  lastAppliedAt: string | null
  account: AllowlistAccount | null
}

type UnlistedAdmin = {
  userId: string
  loginEmail: string | null
  fullName: string | null
  role: string
  managedCenterId: string | null
  providers: string[]
  lastSignInAt: string | null
}

const PROVIDER_LABELS: Record<string, string> = {
  email: 'Password',
  google: 'Google',
  azure: 'Microsoft',
  apple: 'Apple',
}

function formatProviders(providers: string[]): string {
  if (!providers.length) return 'No sign-in method'
  return providers.map((provider) => PROVIDER_LABELS[provider] || provider).join(' + ')
}

function formatDate(value: string | null): string {
  if (!value) return 'never'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'never'
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function AdminAccessAllowlist() {
  const { session } = useLearningAuth()
  const { activeCenters } = useManagedCenters()

  const [entries, setEntries] = useState<AllowlistEntry[]>([])
  const [unlisted, setUnlisted] = useState<UnlistedAdmin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [removingEmail, setRemovingEmail] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'center_admin' | 'super_admin'>('center_admin')
  const [managedCenterId, setManagedCenterId] = useState('')
  const [note, setNote] = useState('')

  const accessToken = session?.access_token ?? null

  const load = useCallback(async () => {
    if (!accessToken) {
      setError('You must be signed in as a super admin.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/admin-access', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Could not load admin access.')
      setEntries(payload.allowlist ?? [])
      setUnlisted(payload.unlisted ?? [])
      setError(null)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load admin access.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    void load()
  }, [load])

  async function handleSave() {
    if (!accessToken) return

    setIsSaving(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/admin-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          email,
          role,
          managedCenterId: role === 'center_admin' ? managedCenterId || null : null,
          note,
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Could not save admin access.')

      setMessage(
        payload.accountExists
          ? `${payload.email} now has ${role === 'super_admin' ? 'super admin' : 'center admin'} access. It applies the next time they load the admin area.`
          : `${payload.email} is approved. Access is granted automatically the first time they sign in.`,
      )
      setEmail('')
      setNote('')
      setManagedCenterId('')
      await load()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save admin access.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleRemove(entry: AllowlistEntry) {
    if (!accessToken) return

    const warning = entry.account
      ? `Remove ${entry.email}? They will lose admin access immediately. Their account and sign-in stay, but they will no longer be able to open the admin area.`
      : `Remove the approval for ${entry.email}?`
    if (!window.confirm(warning)) return

    setRemovingEmail(entry.email)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/admin-access', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ email: entry.email }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Could not remove admin access.')

      setMessage(`${entry.email} no longer has admin access.`)
      await load()
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Could not remove admin access.')
    } finally {
      setRemovingEmail(null)
    }
  }

  const centerOptions = activeCenters.filter((center) => center.kind !== 'hq')

  return (
    <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <h2 className="text-2xl font-serif text-deep-slate">Who Has Admin Permission</h2>
      <p className="mt-2 text-sm text-slate-600">
        Approve people by email address. Anyone on this list gets their role automatically when they sign in, with a
        password or with Google. Nobody else can reach the admin area, however they sign in.
      </p>

      {error ? <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900">{error}</div> : null}
      {message ? <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">{message}</div> : null}

      <div className="mt-6 grid gap-4 rounded-2xl border border-[rgba(141,107,38,0.12)] bg-sanctuary-100/60 p-5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address to approve"
          aria-label="Email address to approve"
          className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'center_admin' | 'super_admin')}
          aria-label="Role"
          className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm"
        >
          <option value="center_admin">Center admin — one center only</option>
          <option value="super_admin">Super admin — the whole site</option>
        </select>
        {role === 'center_admin' ? (
          <select
            value={managedCenterId}
            onChange={(e) => setManagedCenterId(e.target.value)}
            aria-label="Center or group"
            className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm"
          >
            <option value="">Select center or group</option>
            {centerOptions.map((center) => (
              <option key={center.id} value={center.id}>{center.name}</option>
            ))}
          </select>
        ) : null}
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional) — who this is, why they have access"
          aria-label="Note"
          className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm"
        />
        <div>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving || !email.trim()}
            className="inline-flex h-10 items-center justify-center rounded-full bg-divine-gold px-6 text-[10px] font-semibold uppercase text-white hover:bg-[#9e730a] disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Approve Email'}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {isLoading ? <p className="text-slate-600">Loading...</p> : null}
        {!isLoading && entries.length === 0 ? (
          <p className="text-sm text-slate-600">No approved emails yet.</p>
        ) : null}

        {entries.map((entry) => (
          <div key={entry.email} className="rounded-2xl border border-[rgba(141,107,38,0.12)] bg-white/70 px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-deep-slate break-words">{entry.email}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {entry.role === 'super_admin' ? 'Super admin — whole site' : `Center admin — ${entry.managedCenterId || 'no center set'}`}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                  entry.account ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                }`}
              >
                {entry.account ? 'Active' : 'Waiting for first sign-in'}
              </span>
            </div>

            {entry.account ? (
              <p className="mt-3 text-xs text-slate-500">
                Signs in with: <span className="font-semibold">{formatProviders(entry.account.providers)}</span>
                {entry.account.loginEmail && entry.account.loginEmail.toLowerCase() !== entry.email ? (
                  <> · account email <span className="font-semibold">{entry.account.loginEmail}</span></>
                ) : null}
                {' '}· last signed in {formatDate(entry.account.lastSignInAt)}
              </p>
            ) : (
              <p className="mt-3 text-xs text-slate-500">
                No account yet. They become an admin automatically the first time they sign in with this address.
              </p>
            )}

            {entry.note ? <p className="mt-2 text-xs italic text-slate-500">{entry.note}</p> : null}

            <div className="mt-4">
              <button
                type="button"
                onClick={() => void handleRemove(entry)}
                disabled={removingEmail === entry.email}
                className="inline-flex h-9 items-center justify-center rounded-full border border-rose-200 px-5 text-[10px] font-semibold uppercase text-rose-700 hover:bg-rose-50 disabled:opacity-60"
              >
                {removingEmail === entry.email ? 'Removing...' : 'Remove Access'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {unlisted.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4">
          <p className="text-sm font-semibold text-amber-900">Admins not on the list</p>
          <p className="mt-1 text-xs text-amber-900/80">
            These accounts hold an admin role that was set directly on the profile. They keep working. Approve the
            email above to manage them here, or change the role under Existing Profiles.
          </p>
          <ul className="mt-3 space-y-2">
            {unlisted.map((admin) => (
              <li key={admin.userId} className="text-xs text-amber-900">
                <span className="font-semibold">{admin.loginEmail || admin.userId}</span> — {admin.role}
                {admin.managedCenterId ? ` (${admin.managedCenterId})` : ''} · {formatProviders(admin.providers)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
