import { useEffect, useMemo, useState } from 'react'
import { Section } from '../../components/Section'
import { usePageMeta } from '../../hooks/usePageMeta'
import { LearningAdminToolbar } from '../components/LearningAdminToolbar'
import { RequireAdmin } from '../components/LearningRouteGuards'
import { supabase } from '../lib/supabaseClient'
import { useLearningAuth } from '../context/LearningAuthContext'
import { useManagedCenters } from '../../organization/centers'
import { allDonationTypes } from '../../config/donationTypeOptions'

type DonationStatus = 'created' | 'completed' | 'cancelled' | 'error'
type DonationRow = {
  id: number
  order_id: string
  capture_id: string | null
  provider: string
  fund_type: 'donation' | 'sangetsu'
  status: DonationStatus
  donor_name: string | null
  donor_email: string | null
  paypal_payer_email: string | null
  payer_id: string | null
  center_id: string | null
  center_name: string | null
  donation_type: string | null
  amount: number
  currency: string
  provider_invoice_id: string | null
  paypal_status: string | null
  recorded_at: string
  completed_at: string | null
}

function formatDateTime(value: string | null) {
  if (!value) return 'Pending'
  const next = new Date(value)
  if (Number.isNaN(next.getTime())) return 'Pending'
  return next.toLocaleString()
}

function getStatusLabel(status: DonationStatus) {
  switch (status) {
    case 'created':
      return 'Started'
    case 'completed':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
    case 'error':
      return 'Needs Review'
    default:
      return status
  }
}

function getStatusHelp(status: DonationStatus) {
  switch (status) {
    case 'created':
      return 'The donation was started but payment was not confirmed yet.'
    case 'completed':
      return 'Payment was confirmed successfully.'
    case 'cancelled':
      return 'The donor stopped before completing payment.'
    case 'error':
      return 'Something went wrong while recording or confirming the payment.'
    default:
      return ''
  }
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency || 'USD'} ${amount.toFixed(2)}`
  }
}

function csvEscape(value: string | number | null | undefined) {
  const text = String(value ?? '')
  return `"${text.replaceAll('"', '""')}"`
}

function downloadCsv(filename: string, rows: DonationRow[]) {
  const headers = [
    'Completed At',
    'Recorded At',
    'Status',
    'Type of Donation',
    'Amount',
    'Currency',
    'Donor Name',
    'Donor Email',
    'PayPal Payer Email',
    'Center ID',
    'Center Name',
    'Donation Type',
    'Order ID',
    'Capture ID',
    'Invoice ID',
    'PayPal Status',
    'Payer ID',
  ]

  const body = rows.map((row) =>
    [
      row.completed_at ?? '',
      row.recorded_at,
      row.status,
      row.donation_type ?? '',
      row.amount,
      row.currency,
      row.donor_name ?? '',
      row.donor_email ?? '',
      row.paypal_payer_email ?? '',
      row.center_id ?? '',
      row.center_name ?? '',
      row.donation_type ?? '',
      row.order_id,
      row.capture_id ?? '',
      row.provider_invoice_id ?? '',
      row.paypal_status ?? '',
      row.payer_id ?? '',
    ]
      .map(csvEscape)
      .join(','),
  )

  const csv = `\ufeff${headers.map(csvEscape).join(',')}\n${body.join('\n')}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function LearningAdminDonations() {
  usePageMeta({
    title: 'Admin | Donations',
    description: 'Review and export donation records captured from the website donation page.',
  })

  return (
    <RequireAdmin>
      <LearningAdminDonationsInner />
    </RequireAdmin>
  )
}

function LearningAdminDonationsInner() {
  const { managedCenterId, isSuperAdmin, isCenterAdmin } = useLearningAuth()
  const { centers } = useManagedCenters()
  const [donations, setDonations] = useState<DonationRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | DonationStatus>('all')
  const [donationTypeFilter, setDonationTypeFilter] = useState('all')
  const [centerFilter, setCenterFilter] = useState('all')
  const [search, setSearch] = useState('')

  const centerNameById = useMemo(
    () => new Map(centers.map((center) => [center.id, center.name] as const)),
    [centers],
  )

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError('Supabase is not configured. Add the site Supabase env vars to enable donations admin.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      let query = supabase
        .from('website_donations')
        .select(
          'id,order_id,capture_id,provider,fund_type,status,donor_name,donor_email,paypal_payer_email,payer_id,center_id,center_name,donation_type,amount,currency,provider_invoice_id,paypal_status,recorded_at,completed_at',
        )
        .order('completed_at', { ascending: false, nullsFirst: false })
        .order('recorded_at', { ascending: false })
        .limit(1000)

      if (isCenterAdmin && managedCenterId) {
        query = query.eq('center_id', managedCenterId)
      }

      const { data, error: queryError } = await query

      if (queryError) {
        if (queryError.message.includes('website_donations')) {
          setError('Donation records table not found yet. Run supabase/donations_schema.sql in the live Supabase project first.')
        } else {
          setError(queryError.message)
        }
      } else {
        setDonations((data ?? []) as DonationRow[])
      }

      setIsLoading(false)
    }

    void load()
  }, [isCenterAdmin, managedCenterId])

  const visibleCenterFilter = isSuperAdmin ? centerFilter : managedCenterId ?? 'all'

  const donationTypeOptions = useMemo(() => [...allDonationTypes], [])

  const filteredDonations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return donations.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (donationTypeFilter !== 'all' && row.donation_type !== donationTypeFilter) return false
      if (visibleCenterFilter !== 'all' && row.center_id !== visibleCenterFilter) return false

      if (!normalizedSearch) return true

      const haystack = [
        row.donor_name,
        row.donor_email,
        row.paypal_payer_email,
        row.center_name,
        row.center_id,
        row.donation_type,
        row.order_id,
        row.capture_id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedSearch)
    })
  }, [donationTypeFilter, donations, search, statusFilter, visibleCenterFilter])

  const totalAmount = useMemo(
    () => filteredDonations.reduce((sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0), 0),
    [filteredDonations],
  )

  const completedCount = useMemo(
    () => filteredDonations.filter((row) => row.status === 'completed').length,
    [filteredDonations],
  )

  const latestCompletedAt = filteredDonations[0]?.completed_at ?? filteredDonations[0]?.recorded_at ?? null

  function handleExport() {
    const date = new Date().toISOString().slice(0, 10)
    downloadCsv(`worldmessianic-donations-${date}.csv`, filteredDonations)
  }

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Admin</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">Donation Records</h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Review every website donation record, check payment progress, and export the current list whenever you need it.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <LearningAdminToolbar current="donations" />

          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div> : null}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white px-6 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Visible Records</p>
              <p className="mt-3 text-3xl font-serif text-deep-slate">{filteredDonations.length}</p>
              <p className="mt-2 text-sm text-slate-500">{completedCount} completed in the current view.</p>
            </div>

            <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white px-6 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Visible Total</p>
              <p className="mt-3 text-3xl font-serif text-deep-slate">{formatCurrency(totalAmount, 'USD')}</p>
              <p className="mt-2 text-sm text-slate-500">Calculated from the filtered rows below.</p>
            </div>

            <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white px-6 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Latest Donation</p>
              <p className="mt-3 text-2xl font-serif text-deep-slate">{formatDateTime(latestCompletedAt)}</p>
              <p className="mt-2 text-sm text-slate-500">Most recent completed or recorded timestamp in this view.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.7fr_0.9fr_0.9fr_auto]">
              <label className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Search</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Donor, email, center, donation type, order ID"
                  className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm"
                />
              </label>

              <label className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Status</span>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | DonationStatus)} className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm">
                  <option value="all">All statuses</option>
                  <option value="created">Started</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="error">Needs review</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Type of Donation</span>
                <select value={donationTypeFilter} onChange={(event) => setDonationTypeFilter(event.target.value)} className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm">
                  <option value="all">All donation types</option>
                  {donationTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {isSuperAdmin ? (
                <label className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Center</span>
                  <select value={centerFilter} onChange={(event) => setCenterFilter(event.target.value)} className="w-full rounded-xl border border-[rgba(184,134,11,0.22)] px-4 py-3 text-sm">
                    <option value="all">All centers</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Center</span>
                  <div className="rounded-xl border border-[rgba(184,134,11,0.22)] bg-sanctuary-50 px-4 py-3 text-sm text-slate-600">
                    {managedCenterId ? centerNameById.get(managedCenterId) ?? managedCenterId : 'All assigned records'}
                  </div>
                </div>
              )}

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={filteredDonations.length === 0}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-divine-gold px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#9e730a] disabled:opacity-60"
                >
                  Download CSV
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <table className="min-w-full divide-y divide-[rgba(15,23,42,0.08)] text-sm">
              <thead className="bg-sanctuary-50">
                <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Donor</th>
                  <th className="px-5 py-4">Center</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(15,23,42,0.06)]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                      Loading donation records...
                    </td>
                  </tr>
                ) : null}

                {!isLoading && filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                      No donation records matched the current filters.
                    </td>
                  </tr>
                ) : null}

                {!isLoading
                  ? filteredDonations.map((row) => (
                      <tr key={row.id} className="align-top">
                        <td className="px-5 py-4 text-slate-600">
                          <div>{formatDateTime(row.completed_at ?? row.recorded_at)}</div>
                          <div className="mt-1 text-xs text-slate-400">{getStatusLabel(row.status)}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          <div className="font-medium text-deep-slate">{row.donor_name ?? 'Unknown donor'}</div>
                          <div className="mt-1">{row.donor_email ?? row.paypal_payer_email ?? 'No email saved'}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          <div>{row.center_name ?? centerNameById.get(row.center_id ?? '') ?? 'Unassigned center'}</div>
                          <div className="mt-1 text-xs text-slate-400">{row.center_id ?? 'No center id'}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{row.donation_type ?? 'Not saved'}</td>
                        <td className="px-5 py-4 text-deep-slate font-medium">{formatCurrency(row.amount, row.currency)}</td>
                        <td className="px-5 py-4 text-slate-600">
                          <span className="rounded-full bg-sanctuary-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-700">
                            {getStatusLabel(row.status)}
                          </span>
                          <div className="mt-2 text-xs text-slate-400">{getStatusHelp(row.status)}</div>
                          {row.paypal_status ? <div className="mt-2 text-xs text-slate-400">PayPal: {row.paypal_status}</div> : null}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          <div className="text-xs text-slate-500">Order</div>
                          <div className="font-mono text-xs break-all">{row.order_id}</div>
                          {row.capture_id ? (
                            <>
                              <div className="mt-3 text-xs text-slate-500">Capture</div>
                              <div className="font-mono text-xs break-all">{row.capture_id}</div>
                            </>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </div>
  )
}
