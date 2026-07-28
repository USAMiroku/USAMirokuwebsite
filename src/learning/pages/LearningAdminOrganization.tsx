import { useEffect, useState } from 'react'
import { Section } from '../../components/Section'
import { usePageMeta } from '../../hooks/usePageMeta'
import { LearningAdminToolbar } from '../components/LearningAdminToolbar'
import { RequireSuperAdmin } from '../components/LearningRouteGuards'
import { useLearningAuth } from '../context/LearningAuthContext'
import { type ManagedCenter, useManagedCenters } from '../../organization/centers'

type EditableCenter = ManagedCenter

const KIND_OPTIONS = ['center', 'group', 'hq'] as const

const blankCenter: EditableCenter = {
  id: '',
  slug: '',
  kind: 'center',
  name: '',
  city: '',
  state: '',
  address: '',
  phone: '',
  email: '',
  schedule: '',
  notes: '',
  leadership: {},
  isActive: true,
  displayOrder: 100,
}

export default function LearningAdminOrganization() {
  usePageMeta({
    title: 'Admin | Centers & Groups',
    description: 'Manage centers, groups, and national locations.',
  })

  return (
    <RequireSuperAdmin>
      <LearningAdminOrganizationInner />
    </RequireSuperAdmin>
  )
}

function LearningAdminOrganizationInner() {
  const { centers, isLoading } = useManagedCenters()
  const { session } = useLearningAuth()
  const [centerList, setCenterList] = useState<EditableCenter[]>([])
  const [editing, setEditing] = useState<EditableCenter>(blankCenter)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setCenterList(centers)
  }, [centers])

  function updateField<K extends keyof EditableCenter>(field: K, value: EditableCenter[K]) {
    setEditing((current) => ({ ...current, [field]: value }))
  }

  function updateLeadership(field: 'head' | 'assistant', value: string) {
    setEditing((current) => ({
      ...current,
      leadership: {
        ...current.leadership,
        [field]: value || undefined,
      },
    }))
  }

  async function handleSave() {
    if (isSaving) return

    if (!session?.access_token) {
      setError('Your admin session expired. Please sign in again.')
      return
    }

    if (!editing.id.trim() || !editing.slug.trim() || !editing.name.trim()) {
      setError('ID, slug, and name are required.')
      return
    }

    setError(null)
    setMessage(null)

    const payload = {
      id: editing.id.trim(),
      slug: editing.slug.trim(),
      kind: editing.kind,
      name: editing.name.trim(),
      city: editing.city.trim(),
      state: editing.state.trim(),
      address: editing.address.trim(),
      phone: editing.phone.trim(),
      email: editing.email.trim(),
      schedule: editing.schedule?.trim() || null,
      notes: editing.notes?.trim() || null,
      leadership_head: editing.leadership?.head?.trim() || null,
      leadership_assistant: editing.leadership?.assistant?.trim() || null,
      is_active: editing.isActive,
      display_order: editing.displayOrder,
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/organization-centers', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const result = (await response.json().catch(() => ({}))) as {
        center?: EditableCenter
        error?: string
        requestId?: string
      }

      if (!response.ok || !result.center) {
        const suffix = result.requestId ? ` (Request ${result.requestId})` : ''
        setError(`${result.error || 'Could not save center.'}${suffix}`)
        return
      }

      const savedCenter = result.center
      setCenterList((current) => {
        const next = current.some((center) => center.id === savedCenter.id)
          ? current.map((center) => (center.id === savedCenter.id ? savedCenter : center))
          : [...current, savedCenter]

        return [...next].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name))
      })
      setEditing(savedCenter)
      setMessage('Center or group saved.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(centerId: string) {
    if (deletingId) return

    if (!session?.access_token) {
      setError('Your admin session expired. Please sign in again.')
      return
    }
    if (!window.confirm('Delete this center or group?')) return

    setError(null)
    setMessage(null)
    setDeletingId(centerId)
    try {
      const response = await fetch('/api/admin/organization-centers', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: centerId }),
      })
      const result = (await response.json().catch(() => ({}))) as { error?: string; requestId?: string }

      if (!response.ok) {
        const suffix = result.requestId ? ` (Request ${result.requestId})` : ''
        setError(`${result.error || 'Could not delete center.'}${suffix}`)
        return
      }

      setCenterList((current) => current.filter((center) => center.id !== centerId))
      setMessage('Center or group removed.')
      if (editing.id === centerId) setEditing(blankCenter)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Super Admin</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">Centers & Groups</h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Add, edit, remove, and organize the public center and group directory.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <LearningAdminToolbar current="organization" />

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div> : null}
            {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-emerald-900">{message}</div> : null}

            <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-serif text-deep-slate">Saved Centers</h2>
                <button
                  type="button"
                  onClick={() => setEditing(blankCenter)}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-5 text-[10px] font-semibold uppercase text-slate-600 hover:bg-slate-50"
                >
                  New
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {isLoading ? <p className="text-slate-600">Loading...</p> : null}
                {centerList.map((center) => (
                  <div key={center.id} className="rounded-2xl border border-[rgba(141,107,38,0.12)] bg-white/70 px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-600">{center.kind}</p>
                        <p className="mt-2 text-lg font-serif text-deep-slate">{center.name}</p>
                        <p className="text-sm text-slate-600">{center.city}, {center.state}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditing(center)}
                          className="inline-flex h-9 items-center justify-center rounded-full border border-sage-600 px-4 text-[10px] font-semibold uppercase text-sage-700 hover:bg-sage-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(center.id)}
                          disabled={deletingId === center.id}
                          className="inline-flex h-9 items-center justify-center rounded-full border border-rose-200 px-4 text-[10px] font-semibold uppercase text-rose-700 hover:bg-rose-50"
                        >
                          {deletingId === center.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-serif text-deep-slate">{editing.id ? 'Edit Center or Group' : 'Add Center or Group'}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">ID</span>
                <input value={editing.id} onChange={(e) => updateField('id', e.target.value)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Slug</span>
                <input value={editing.slug} onChange={(e) => updateField('slug', e.target.value)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Name</span>
                <input value={editing.name} onChange={(e) => updateField('name', e.target.value)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Kind</span>
                <select value={editing.kind} onChange={(e) => updateField('kind', e.target.value as EditableCenter['kind'])} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm">
                  {KIND_OPTIONS.map((kind) => (
                    <option key={kind} value={kind}>{kind}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Display Order</span>
                <input type="number" value={editing.displayOrder} onChange={(e) => updateField('displayOrder', Number(e.target.value) || 0)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">City</span>
                <input value={editing.city} onChange={(e) => updateField('city', e.target.value)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">State</span>
                <input value={editing.state} onChange={(e) => updateField('state', e.target.value)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Address</span>
                <input value={editing.address} onChange={(e) => updateField('address', e.target.value)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Phone</span>
                <input value={editing.phone} onChange={(e) => updateField('phone', e.target.value)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Email</span>
                <input value={editing.email} onChange={(e) => updateField('email', e.target.value)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Schedule</span>
                <input value={editing.schedule ?? ''} onChange={(e) => updateField('schedule', e.target.value)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Notes</span>
                <textarea value={editing.notes ?? ''} onChange={(e) => updateField('notes', e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Leader</span>
                <input value={editing.leadership?.head ?? ''} onChange={(e) => updateLeadership('head', e.target.value)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Assistant</span>
                <input value={editing.leadership?.assistant ?? ''} onChange={(e) => updateLeadership('assistant', e.target.value)} className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm" />
              </label>
              <label className="flex items-center gap-3 md:col-span-2">
                <input type="checkbox" checked={editing.isActive} onChange={(e) => updateField('isActive', e.target.checked)} />
                <span className="text-sm text-slate-700">Visible on the public site</span>
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="inline-flex h-10 items-center justify-center rounded-full bg-divine-gold px-6 text-[10px] font-semibold uppercase text-white hover:bg-[#9e730a]"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(blankCenter)}
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-6 text-[10px] font-semibold uppercase text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
