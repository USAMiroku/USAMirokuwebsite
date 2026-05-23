import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Section } from '../components/Section'
import { ButtonLink } from '../components/ButtonLink'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { siteConfig } from '../config/siteConfig'
import { mainDonationTypes } from '../config/donationTypeOptions'

type FundType = 'donation' | 'sangetsu'

type DonationFormState = {
  donorName: string
  donorEmail: string
  center: string
  donationType: string
  amount: string
}

type Copy = {
  heroKicker: string
  heroTitle: string
  heroBody: string
  success: string
  donationLabel: string
  cancelled: string
  error: string
  step1Title: string
  step1Body: string
  step2Title: string
  step2Body: string
  step3Title: string
  step3Body: string
  step4Title: string
  step4Body: string
  acceptedCards: string
  acceptedCardsNote: string
  paymentButtonsTitle: string
  paypalOption: string
  debitCardOption: string
  donationButton: string
  sangetsuTitle: string
  sangetsuDescription: string
  sangetsuButton: string
  sangetsuFooter: string
  gratitudeTitle: string
  gratitudeBody: string
  gratitudeNotes: string[]
  labels: {
    name: string
    emailOptional: string
    center: string
    type: string
    amount: string
    quickAmounts: string
    selectCenter: string
    preparing: string
  }
}

const quickAmounts = [20, 50, 100, 300, 500]

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

function StepCard({
  number,
  title,
  body,
  children,
}: {
  number: string
  title: string
  body: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[26px] border border-[rgba(15,23,42,0.10)] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] md:p-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
        {number} · {title}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{body}</p>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function AcceptedCards({ copy }: { copy: Copy }) {
  const cardLabels = [
    { label: 'VISA', className: 'text-[#1a1f71]' },
    { label: 'Mastercard', className: 'text-[#eb001b]' },
    { label: 'Discover', className: 'text-[#ff6000]' },
    { label: 'AMEX', className: 'text-[#006fcf]' },
  ]

  return (
    <div className="rounded-[24px] border border-[rgba(184,134,11,0.18)] bg-[#faf5e7] p-5 shadow-[0_14px_36px_rgba(15,23,42,0.04)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">{copy.acceptedCards}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {cardLabels.map((card) => (
          <span
            key={card.label}
            className={`rounded-lg border border-[rgba(15,23,42,0.10)] bg-white px-4 py-2 text-xs font-semibold ${card.className}`}
          >
            {card.label}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">{copy.acceptedCardsNote}</p>
    </div>
  )
}

function PaymentButtons({
  sectionTitle,
  preparingLabel,
  paypalLabel,
  debitLabel,
  isSubmitting,
  disabled,
  onClick,
}: {
  sectionTitle: string
  preparingLabel: string
  paypalLabel: string
  debitLabel: string
  isSubmitting: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">{sectionTitle}</p>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#1475c4] px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#0f66ad] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? preparingLabel : paypalLabel}
      </button>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#1f2937] px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? preparingLabel : debitLabel}
      </button>
    </div>
  )
}

export default function Donate() {
  const { t, language } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const donationApiBaseUrl = (import.meta.env.VITE_DONATION_API_BASE_URL ?? '').trim().replace(/\/$/, '')
  const createOrderEndpoint = `${donationApiBaseUrl}/api/paypal/create-order`
  const captureOrderEndpoint = `${donationApiBaseUrl}/api/paypal/capture-order`
  const sangetsuPaymentUrl = siteConfig.donate.sangetsuPaymentUrl

  const centerSuggestions = useMemo(() => {
    const names = siteConfig.centers.map((center) => center.name)
    if (!names.includes('Headquarters')) {
      names.push('Headquarters')
    }
    return names
  }, [])

  const centerIdByName = useMemo(() => {
    const entries = siteConfig.centers.map((center) => [center.name, center.id] as const)
    return new Map<string, string>([...entries, ['Headquarters', 'national-headquarters']])
  }, [])

  const donationTypeSuggestions = useMemo(() => mainDonationTypes, [])

  const copy: Copy =
    language === 'es'
      ? {
          heroKicker: 'Oferta de gratitud',
          heroTitle: 'Payment / Donation',
          heroBody: 'Complete este formulario de manera clara para que cada ofrenda quede identificada por donante, centro y tipo de donación antes de continuar al pago.',
          success: 'Pago completado para',
          donationLabel: 'donaciones generales',
          cancelled: 'El pago fue cancelado. Puede completar el formulario nuevamente cuando esté listo.',
          error: 'No pudimos confirmar su pago.',
          step1Title: 'Seleccione centro o grupo',
          step1Body: 'Elija el centro o grupo relacionado con esta ofrenda.',
          step2Title: 'Seleccione el tipo de donación',
          step2Body: 'Elija el propósito correcto para que el reporte quede organizado.',
          step3Title: 'Defina el monto',
          step3Body: 'Puede escribir cualquier monto o usar uno de los valores rápidos.',
          step4Title: 'Datos del donante',
          step4Body: 'Estos datos ayudan a identificar correctamente la ofrenda en el registro y en la confirmación.',
          acceptedCards: 'Tarjetas aceptadas',
          acceptedCardsNote: 'La disponibilidad final de tarjetas depende de la elegibilidad del comprador en PayPal.',
          paymentButtonsTitle: 'Opciones de pago',
          paypalOption: 'Pagar con PayPal',
          debitCardOption: 'Tarjeta de débito o crédito',
          donationButton: 'Preparando el pago por PayPal...',
          sangetsuTitle: 'Pagos relacionados con Sangetsu',
          sangetsuDescription: 'Los pagos y donaciones de Sangetsu continúan siendo gestionados en el sitio de USA Sangetsu, donde también se administran actividades, centros y registros.',
          sangetsuButton: 'Ir al pago de Sangetsu',
          sangetsuFooter: 'Use esta opción cuando el pago corresponda a clases, talleres, demostraciones, flores, exámenes u otros conceptos de Sangetsu.',
          gratitudeTitle: 'Su oferta de gratitud',
          gratitudeBody: 'Su generosidad apoya la misión de Miroku Association USA y ayuda a extender Johrei, el estudio espiritual, Sangetsu y las actividades comunitarias por todo Estados Unidos.',
          gratitudeNotes: [
            'Miroku Association USA es una organización religiosa sin fines de lucro.',
            'Las donaciones son deducibles de impuestos en la máxima medida permitida por la ley.',
            'No se proporcionaron bienes ni servicios a cambio de esta contribución.',
          ],
          labels: {
            name: 'Nombre completo *',
            emailOptional: 'Correo electrónico (opcional)',
            center: 'Centro o grupo *',
            type: 'Tipo de donación *',
            amount: 'Monto (USD) *',
            quickAmounts: 'Montos rápidos',
            selectCenter: 'Seleccione un centro o grupo',
            preparing: 'Preparando el pago por PayPal...',
          },
        }
      : language === 'pt'
        ? {
            heroKicker: 'Oferta de gratidão',
            heroTitle: 'Payment / Donation',
            heroBody: 'Preencha este formulário com clareza para que cada oferta fique identificada por doador, centro e tipo de doação antes de seguir para o pagamento.',
            success: 'Pagamento concluído para',
            donationLabel: 'doações gerais',
            cancelled: 'O pagamento foi cancelado. Você pode preencher o formulário novamente quando estiver pronto.',
            error: 'Não foi possível confirmar o pagamento.',
            step1Title: 'Selecione centro ou grupo',
            step1Body: 'Escolha o centro ou grupo relacionado a esta oferta.',
            step2Title: 'Selecione o tipo de doação',
            step2Body: 'Escolha a finalidade correta para manter o relatório organizado.',
            step3Title: 'Defina o valor',
            step3Body: 'Você pode informar qualquer valor ou usar um dos valores rápidos.',
            step4Title: 'Dados do doador',
            step4Body: 'Esses dados ajudam a identificar corretamente a oferta no registro e na confirmação.',
            acceptedCards: 'Cartões aceitos',
            acceptedCardsNote: 'A disponibilidade final dos cartões depende da elegibilidade do comprador no PayPal.',
            paymentButtonsTitle: 'Opções de pagamento',
            paypalOption: 'Pagar com PayPal',
            debitCardOption: 'Cartão de débito ou crédito',
            donationButton: 'Preparando o pagamento pelo PayPal...',
            sangetsuTitle: 'Pagamentos relacionados à Sangetsu',
            sangetsuDescription: 'Os pagamentos e doações de Sangetsu continuam sendo tratados no site da USA Sangetsu, onde também são administradas atividades, centros e registros.',
            sangetsuButton: 'Ir para o pagamento Sangetsu',
            sangetsuFooter: 'Use esta opção quando o pagamento corresponder a aulas, workshops, demonstrações, flores, exames ou outros itens da Sangetsu.',
            gratitudeTitle: 'Sua oferta de gratidão',
            gratitudeBody: 'Sua generosidade apoia a missão da Miroku Association USA e ajuda a expandir o Johrei, o estudo espiritual, a Sangetsu e as atividades comunitárias por todos os Estados Unidos.',
            gratitudeNotes: [
              'A Miroku Association USA é uma organização religiosa sem fins lucrativos.',
              'As doações são dedutíveis de impostos na máxima medida permitida por lei.',
              'Nenhum bem ou serviço foi fornecido em troca desta contribuição.',
            ],
            labels: {
              name: 'Nome completo *',
              emailOptional: 'E-mail (opcional)',
              center: 'Centro ou grupo *',
              type: 'Tipo de doação *',
              amount: 'Valor (USD) *',
              quickAmounts: 'Valores rápidos',
              selectCenter: 'Selecione um centro ou grupo',
              preparing: 'Preparando o pagamento pelo PayPal...',
            },
          }
        : {
            heroKicker: 'Gratitude Offering',
            heroTitle: 'Payment / Donation',
            heroBody: 'Complete this form clearly so each offering is identified by donor, center, and donation type before you continue to payment.',
            success: 'Payment completed for',
            donationLabel: 'general donations',
            cancelled: 'Payment was cancelled. You can complete the form again when you are ready.',
            error: 'We could not confirm your payment.',
            step1Title: 'Select center or group',
            step1Body: 'Choose the center or group connected to this offering.',
            step2Title: 'Select donation type',
            step2Body: 'Choose the correct purpose so the donation report stays organized.',
            step3Title: 'Set the amount',
            step3Body: 'You can enter any amount or use one of the quick amounts below.',
            step4Title: 'Payer details',
            step4Body: 'These details help identify the offering correctly in the donation record and confirmation flow.',
            acceptedCards: 'Commonly accepted cards',
            acceptedCardsNote: 'Final card availability still depends on buyer eligibility inside PayPal checkout.',
            paymentButtonsTitle: 'Payment options',
            paypalOption: 'Pay with PayPal',
            debitCardOption: 'Debit or Credit Card',
            donationButton: 'Preparing PayPal checkout...',
            sangetsuTitle: 'Sangetsu related payments',
            sangetsuDescription: 'Sangetsu payments and donations continue to be handled on the USA Sangetsu website, where activities, centers, and records are managed there directly.',
            sangetsuButton: 'Go to Sangetsu Payment',
            sangetsuFooter: 'Use this option when the payment is for classes, workshops, demonstrations, flowers, exams, or other Sangetsu-related purposes.',
            gratitudeTitle: 'Your Offering of Gratitude',
            gratitudeBody: 'Your generosity supports the mission of Miroku Association USA and helps extend Johrei, spiritual study, Sangetsu, and community activities across the United States.',
            gratitudeNotes: [
              'Miroku Association USA is a nonprofit religious organization.',
              'Donations are tax-deductible to the fullest extent allowed by law.',
              'No goods or services were provided in exchange for this contribution.',
            ],
            labels: {
              name: 'Full Name *',
              emailOptional: 'Email (optional)',
              center: 'Center or Group *',
              type: 'Type of Donation *',
              amount: 'Amount (USD) *',
              quickAmounts: 'Quick amounts',
              selectCenter: 'Select a center or group',
              preparing: 'Preparing PayPal checkout...',
            },
          }

  const [donationForm, setDonationForm] = useState<DonationFormState>(() =>
    initForm(donationTypeSuggestions[0] ?? 'Gratitude Offering'),
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
    const centerId = centerIdByName.get(center) ?? null
    const donationType = form.donationType.trim()
    const amount = Number(form.amount)

    if (!donorName || !center || !donationType) {
      setFormError('Please fill Full Name, Johrei Center, and Type of Donation before continuing.')
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError('Please provide a valid amount greater than zero.')
      return
    }

    setPendingFund(fundType)

    if (fundType === 'sangetsu') {
      window.location.assign(sangetsuPaymentUrl)
      return
    }

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
          centerId,
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
      <section className="public-hero">
        <div className="mx-auto max-w-4xl text-center">
          <p className="public-eyebrow">{copy.heroKicker}</p>
          <h1 className="public-title mx-auto">{copy.heroTitle}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">{copy.heroBody}</p>
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
                  {copy.success} {statusFund === 'sangetsu' ? 'Sangetsu' : copy.donationLabel}.{' '}
                  {statusMessage ?? 'Thank you for your offering.'}
                </p>
              )}
              {isCancelled && <p>{copy.cancelled}</p>}
              {isError && <p>{copy.error} {statusMessage ?? 'Please try again or contact support.'}</p>}
            </div>
          )}

          {formError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900">
              {formError}
            </div>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5 rounded-[30px] border border-[rgba(15,23,42,0.08)] bg-white p-6 shadow-[0_28px_70px_rgba(15,23,42,0.08)] md:p-8">
              <StepCard number="Step 1" title={copy.step1Title} body={copy.step1Body}>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.labels.center}</span>
                  <select
                    value={donationForm.center}
                    onChange={(event) => setDonationForm((previous) => ({ ...previous, center: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                    required
                  >
                    <option value="">{copy.labels.selectCenter}</option>
                    {centerSuggestions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </StepCard>

              <StepCard number="Step 2" title={copy.step2Title} body={copy.step2Body}>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.labels.type}</span>
                  <select
                    value={donationForm.donationType}
                    onChange={(event) => setDonationForm((previous) => ({ ...previous, donationType: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                    required
                  >
                    {donationTypeSuggestions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </StepCard>

              <StepCard number="Step 3" title={copy.step3Title} body={copy.step3Body}>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.labels.amount}</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={donationForm.amount}
                    onChange={(event) => setDonationForm((previous) => ({ ...previous, amount: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                    required
                  />
                </label>

                <div className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.labels.quickAmounts}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {quickAmounts.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDonationForm((previous) => ({ ...previous, amount: String(value) }))}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          Number(donationForm.amount) === value
                            ? 'border-sage-600 bg-sage-600 text-white'
                            : 'border-[rgba(184,134,11,0.22)] bg-white text-deep-slate hover:border-sage-600'
                        }`}
                      >
                        ${value}
                      </button>
                    ))}
                  </div>
                </div>
              </StepCard>

              <StepCard number="Step 4" title={copy.step4Title} body={copy.step4Body}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.labels.name}</span>
                    <input
                      type="text"
                      value={donationForm.donorName}
                      onChange={(event) => setDonationForm((previous) => ({ ...previous, donorName: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.labels.emailOptional}</span>
                    <input
                      type="email"
                      value={donationForm.donorEmail}
                      onChange={(event) => setDonationForm((previous) => ({ ...previous, donorEmail: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                      placeholder="you@example.org"
                    />
                  </label>
                </div>
              </StepCard>

              <AcceptedCards copy={copy} />

              <div className="space-y-3">
                <PaymentButtons
                  sectionTitle={copy.paymentButtonsTitle}
                  preparingLabel={copy.labels.preparing}
                  paypalLabel={copy.paypalOption}
                  debitLabel={copy.debitCardOption}
                  isSubmitting={pendingFund === 'donation'}
                  disabled={false}
                  onClick={() => {
                    void startCheckout('donation', donationForm)
                  }}
                />
                <p className="text-xs text-center text-slate-500">Powered by PayPal</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[30px] border border-[rgba(15,23,42,0.08)] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
                <h2 className="text-3xl font-serif text-deep-slate">{copy.sangetsuTitle}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{copy.sangetsuDescription}</p>
                <div className="mt-6">
                  <a
                    href={sangetsuPaymentUrl}
                    className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-deep-slate px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-sage-600"
                  >
                    {copy.sangetsuButton}
                  </a>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-500">{copy.sangetsuFooter}</p>
              </div>

              <div className="rounded-[30px] border border-[rgba(184,134,11,0.18)] bg-[#faf6ef] p-8 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
                <h2 className="text-2xl font-serif text-deep-slate">{copy.gratitudeTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy.gratitudeBody}</p>
                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  {copy.gratitudeNotes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-[rgba(15,23,42,0.08)] bg-white p-6 text-center shadow-[0_16px_34px_rgba(15,23,42,0.04)]">
                <p className="text-sm leading-7 text-slate-600">
                  Need help choosing the right center or donation type?
                </p>
                <div className="mt-4 flex justify-center">
                  <ButtonLink to="/contact" variant="outline">
                    Contact Us
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
