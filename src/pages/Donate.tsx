import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Section } from '../components/Section'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { siteConfig } from '../config/siteConfig'

type FundType = 'donation' | 'sangetsu'
type DonationFormState = {
  donorName: string
  donorEmail: string
  center: string
  donationType: string
  amount: string
}

type DonationCardProps = {
  fundType: FundType
  title: string
  description: string
  typeSuggestions: string[]
  centerSuggestions: string[]
  buttonLabel: string
  isSubmitting: boolean
  form: DonationFormState
  onChange: (field: keyof DonationFormState, value: string) => void
  onSubmit: () => void
}

const mainDonationTypes = [
  'Gratitude',
  'Ancestral Enshrinement (Sorei-Saishi)',
  'Books, Ohikari Cases, Strings',
  'Religious Itens',
  'Fundraisings',
  'Ohikari Membership',
  'Pilgrimage',
]

const sangetsuDonationTypes = [
  'Ikebana Classes',
  'Workshops',
  'Donation for Flowers',
  'Fundraisings Sangetsu',
  'Supplies',
  'Sangetsu Exame',
  'Study Fund',
]

function isFundType(value: string | null): value is FundType {
  return value === 'donation' || value === 'sangetsu'
}

function initForm(defaultType: string): DonationFormState {
  return {
    donorName: '',
    donorEmail: '',
    center: '',
    donationType: defaultType,
    amount: '',
  }
}

function DonationCard({
  fundType,
  title,
  description,
  typeSuggestions,
  centerSuggestions,
  buttonLabel,
  isSubmitting,
  form,
  onChange,
  onSubmit,
}: DonationCardProps) {
  const typeListId = `${fundType}-type-options`
  const centerListId = `${fundType}-center-options`

  return (
    <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-10">
      <h2 className="text-3xl font-serif text-deep-slate">{title}</h2>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{description}</p>

      <div className="mt-7 space-y-4">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Full Name *</span>
          <input
            type="text"
            value={form.donorName}
            onChange={(event) => onChange('donorName', event.target.value)}
            className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
            required
          />
        </label>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Email (optional)</span>
          <input
            type="email"
            value={form.donorEmail}
            onChange={(event) => onChange('donorEmail', event.target.value)}
            className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
            placeholder="you@example.org"
          />
        </label>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Johrei Center *</span>
          <input
            type="text"
            value={form.center}
            onChange={(event) => onChange('center', event.target.value)}
            list={centerListId}
            className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
            placeholder="Ex: Los Angeles, New York, Miami"
            required
          />
          <datalist id={centerListId}>
            {centerSuggestions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Type of Donation / Payment *</span>
          <input
            type="text"
            value={form.donationType}
            onChange={(event) => onChange('donationType', event.target.value)}
            list={typeListId}
            className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
            placeholder="Ex: Gratitude, Enshrinement, Sangetsu Class"
            required
          />
          <datalist id={typeListId}>
            {typeSuggestions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Amount (USD) *</span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={form.amount}
            onChange={(event) => onChange('amount', event.target.value)}
            className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
            required
          />
        </label>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-deep-slate px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Preparing PayPal checkout...' : buttonLabel}
        </button>

        <p className="text-xs leading-relaxed text-slate-500">
          You will not need to type the amount again on PayPal. We send your amount and details directly to checkout.
        </p>
      </div>
    </div>
  )
}

export default function Donate() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const donationApiBaseUrl = (import.meta.env.VITE_DONATION_API_BASE_URL ?? '').trim().replace(/\/$/, '')
  const createOrderEndpoint = `${donationApiBaseUrl}/api/paypal/create-order`
  const captureOrderEndpoint = `${donationApiBaseUrl}/api/paypal/capture-order`

  const centerSuggestions = useMemo(() => siteConfig.centers.map((center) => center.name), [])

  const donationTypeSuggestions = useMemo(() => mainDonationTypes, [])

  const sangetsuTypeSuggestions = useMemo(() => sangetsuDonationTypes, [])

  const [donationForm, setDonationForm] = useState<DonationFormState>(() =>
    initForm(donationTypeSuggestions[0] ?? 'Gratitude'),
  )

  const [sangetsuForm, setSangetsuForm] = useState<DonationFormState>(() =>
    initForm(sangetsuTypeSuggestions[0] ?? 'Sangetsu Class'),
  )

  const [pendingFund, setPendingFund] = useState<FundType | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  usePageMeta({
    title: `${t.donate.title} | ${t.brand}`,
    description: t.donate.intro,
  })

  useEffect(() => {
    const token = searchParams.get('token')
    const fund = searchParams.get('fund')
    const status = searchParams.get('status')

    if (!token || status || !isFundType(fund)) {
      return
    }

    const captureOrder = async () => {
      setPendingFund(fund)
      setFormError(null)

      try {
        const response = await fetch(captureOrderEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: token,
            fundType: fund,
          }),
        })

        const data = (await response.json().catch(() => null)) as { error?: string; message?: string } | null

        if (!response.ok) {
          throw new Error(data?.error ?? 'Could not confirm the PayPal payment.')
        }

        const next = new URLSearchParams()
        next.set('status', 'success')
        next.set('fund', fund)
        if (data?.message) {
          next.set('message', data.message)
        }

        navigate(`/donate?${next.toString()}`, { replace: true })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not confirm the PayPal payment.'
        const next = new URLSearchParams()
        next.set('status', 'error')
        next.set('fund', fund)
        next.set('message', message)
        navigate(`/donate?${next.toString()}`, { replace: true })
      } finally {
        setPendingFund(null)
      }
    }

    void captureOrder()
  }, [captureOrderEndpoint, navigate, searchParams])

  async function startCheckout(fundType: FundType, form: DonationFormState) {
    setFormError(null)

    const donorName = form.donorName.trim()
    const donorEmail = form.donorEmail.trim()
    const center = form.center.trim()
    const donationType = form.donationType.trim()
    const amount = Number(form.amount)

    if (!donorName || !center || !donationType) {
      setFormError('Please fill Full Name, Johrei Center, and Type of Donation/Payment before continuing.')
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError('Please provide a valid amount greater than zero.')
      return
    }

    setPendingFund(fundType)

    try {
      const response = await fetch(createOrderEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fundType,
          donorName,
          donorEmail,
          center,
          donationType,
          amount,
          currency: 'USD',
        }),
      })

      const data = (await response.json().catch(() => null)) as
        | {
            approveUrl?: string
            error?: string
          }
        | null

      if (!response.ok || !data?.approveUrl) {
        throw new Error(data?.error ?? 'Unable to start PayPal checkout right now.')
      }

      window.location.assign(data.approveUrl)
    } catch (error) {
      setPendingFund(null)
      setFormError(error instanceof Error ? error.message : 'Unable to start PayPal checkout right now.')
    }
  }

  const status = searchParams.get('status')
  const statusFund = isFundType(searchParams.get('fund')) ? searchParams.get('fund') : null
  const statusMessage = searchParams.get('message')

  const isSuccess = status === 'success'
  const isCancelled = status === 'cancelled'
  const isError = status === 'error'

  return (
    <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
      <section className="border-b border-[rgba(184,134,11,0.2)] bg-white px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.32em] text-sage-600">Gratitude Offering</p>
          <h1 className="text-5xl font-serif md:text-7xl">{t.donate.title}</h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 md:text-2xl">{t.donate.intro}</p>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-500 md:text-base">
            Please complete your information first. This helps us accurately identify each offering by donor, center,
            and purpose.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-6xl space-y-6">
          {(isSuccess || isCancelled || isError) && (
            <div
              className={`rounded-2xl border px-5 py-4 text-sm ${
                isSuccess
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : isCancelled
                    ? 'border-amber-200 bg-amber-50 text-amber-900'
                    : 'border-rose-200 bg-rose-50 text-rose-900'
              }`}
            >
              {isSuccess && (
                <p>
                  Payment completed for {statusFund === 'sangetsu' ? 'Sangetsu' : 'General Donations'}.{' '}
                  {statusMessage ?? 'Thank you for your offering.'}
                </p>
              )}
              {isCancelled && <p>Payment was cancelled. You can complete the form again when you are ready.</p>}
              {isError && (
                <p>
                  We could not confirm your payment. {statusMessage ?? 'Please try again or contact support.'}
                </p>
              )}
            </div>
          )}

          {formError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900">
              {formError}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            <DonationCard
              fundType="donation"
              title="General Donations"
              description="Use this section for offerings such as Gratitude, Enshrinement, Membership, events, and other center-related contributions."
              typeSuggestions={donationTypeSuggestions}
              centerSuggestions={centerSuggestions}
              buttonLabel="Continue to PayPal (General)"
              isSubmitting={pendingFund === 'donation'}
              form={donationForm}
              onChange={(field, value) => setDonationForm((previous) => ({ ...previous, [field]: value }))}
              onSubmit={() => {
                void startCheckout('donation', donationForm)
              }}
            />

            <DonationCard
              fundType="sangetsu"
              title="Sangetsu Class & Payments"
              description="Use this section for Sangetsu class fees, workshops, and other Sangetsu-related payments. This checkout uses the dedicated Sangetsu PayPal account."
              typeSuggestions={sangetsuTypeSuggestions}
              centerSuggestions={centerSuggestions}
              buttonLabel="Continue to PayPal (Sangetsu)"
              isSubmitting={pendingFund === 'sangetsu'}
              form={sangetsuForm}
              onChange={(field, value) => setSangetsuForm((previous) => ({ ...previous, [field]: value }))}
              onSubmit={() => {
                void startCheckout('sangetsu', sangetsuForm)
              }}
            />
          </div>
        </div>
      </Section>
    </div>
  )
}
