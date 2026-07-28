import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Section } from '../components/Section'
import { ButtonLink } from '../components/ButtonLink'
import { useTranslation } from '../context/TranslationContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { siteConfig } from '../config/siteConfig'
import { mainDonationTypes } from '../config/donationTypeOptions'

type PayPalCardFieldsInstance = {
  isEligible: () => boolean
  NameField: () => { render: (selector: string) => void; setAttribute: (attr: string, value: string) => void }
  NumberField: () => { render: (selector: string) => void }
  ExpiryField: () => { render: (selector: string) => void }
  CVVField: () => { render: (selector: string) => void }
  submit: (options?: { contingencies?: string[] }) => Promise<void>
}

type PayPalSDK = {
  CardFields?: (options: {
    createOrder: () => Promise<string>
    onApprove: (data: { orderID: string }) => Promise<void>
    onError?: (err: unknown) => void
    style?: Record<string, Record<string, string>>
  }) => PayPalCardFieldsInstance
}

type FundType = 'donation' | 'sangetsu'

type DonationFormState = {
  donorName: string
  donorEmail: string
  center: string
  donationType: string
  amount: string
}

type ProcessingFeeConfig = {
  supported: boolean
  percent: number
  fixed: number
  currency: string
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
  cardHint: string
  cardFormTitle: string
  payNow: string
  processingCard: string
  backToOptions: string
  successTitle: string
  successAction: string
  errorTitle: string
  cancelTitle: string
  retryAction: string
  donationButton: string
  sangetsuTitle: string
  sangetsuDescription: string
  sangetsuButton: string
  sangetsuFooter: string
  coverFeeLabel: string
  coverFeeDescription: string
  paymentSummaryTitle: string
  subtotalLabel: string
  processingFeeLabel: string
  totalLabel: string
  feeUnavailable: string
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

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isFinite(value) ? value : 0)
}

function calculateCoveredFee(amount: number, config: ProcessingFeeConfig | null) {
  if (!config?.supported || !Number.isFinite(amount) || amount <= 0 || config.percent <= 0) {
    return {
      baseAmount: Number.isFinite(amount) && amount > 0 ? amount : 0,
      processingFee: 0,
      totalAmount: Number.isFinite(amount) && amount > 0 ? amount : 0,
    }
  }

  const totalCents = Math.ceil(((amount + config.fixed) / (1 - config.percent)) * 100)
  const baseCents = Math.round(amount * 100)
  const processingFeeCents = Math.max(0, totalCents - baseCents)

  return {
    baseAmount: baseCents / 100,
    processingFee: processingFeeCents / 100,
    totalAmount: totalCents / 100,
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
  cardHint,
  isSubmitting,
  disabled,
  onPayPalClick,
  onCardClick,
}: {
  sectionTitle: string
  preparingLabel: string
  paypalLabel: string
  debitLabel: string
  cardHint: string
  isSubmitting: boolean
  disabled: boolean
  onPayPalClick: () => void
  onCardClick: () => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">{sectionTitle}</p>
      <button
        type="button"
        onClick={onPayPalClick}
        disabled={disabled || isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#1475c4] px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#0f66ad] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? preparingLabel : paypalLabel}
      </button>
      <button
        type="button"
        onClick={onCardClick}
        disabled={disabled || isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#1f2937] px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? preparingLabel : debitLabel}
      </button>
      <p className="text-[11px] leading-relaxed text-slate-500 text-center">{cardHint}</p>
    </div>
  )
}

function FeeCoverageControl({
  copy,
  feeConfig,
  checked,
  disabled,
  subtotal,
  processingFee,
  total,
  onChange,
}: {
  copy: Copy
  feeConfig: ProcessingFeeConfig | null
  checked: boolean
  disabled: boolean
  subtotal: number
  processingFee: number
  total: number
  onChange: (checked: boolean) => void
}) {
  if (!feeConfig?.supported) {
    return null
  }

  return (
    <div className="rounded-[24px] border border-[rgba(15,23,42,0.10)] bg-sanctuary-50/70 p-5">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 accent-sage-600 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <span>
          <span className="block text-sm font-semibold text-deep-slate">{copy.coverFeeLabel}</span>
          <span className="mt-1 block text-xs leading-relaxed text-slate-500">{copy.coverFeeDescription}</span>
        </span>
      </label>

      <div className="mt-4 border-t border-[rgba(15,23,42,0.08)] pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">{copy.paymentSummaryTitle}</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4 text-slate-600">
            <dt>{copy.subtotalLabel}</dt>
            <dd>{formatUsd(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-600">
            <dt>{copy.processingFeeLabel}</dt>
            <dd>{formatUsd(checked ? processingFee : 0)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-[rgba(15,23,42,0.08)] pt-2 font-semibold text-deep-slate">
            <dt>{copy.totalLabel}</dt>
            <dd>{formatUsd(checked ? total : subtotal)}</dd>
          </div>
        </dl>
      </div>
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
  const feeConfigEndpoint = `${donationApiBaseUrl}/api/paypal/fee-config`
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
          cardHint: 'Ingrese los datos de su tarjeta directamente — no necesita una cuenta PayPal.',
          cardFormTitle: 'Pago seguro con tarjeta',
          payNow: 'Pagar',
          processingCard: 'Procesando el pago...',
          backToOptions: '← Volver a opciones de pago',
          successTitle: '¡Gracias por su ofrenda!',
          successAction: 'Hacer otra ofrenda',
          errorTitle: 'No se pudo procesar el pago',
          cancelTitle: 'El pago fue cancelado',
          retryAction: 'Intentar de nuevo',
          donationButton: 'Preparando el pago por PayPal...',
          sangetsuTitle: 'Pagos relacionados con Sangetsu',
          sangetsuDescription: 'Los pagos y donaciones de Sangetsu continúan siendo gestionados en el sitio de USA Sangetsu, donde también se administran actividades, centros y registros.',
          sangetsuButton: 'Ir al pago de Sangetsu',
          sangetsuFooter: 'Use esta opción cuando el pago corresponda a clases, talleres, demostraciones, flores, exámenes u otros conceptos de Sangetsu.',
          coverFeeLabel: 'Agregar la tarifa de procesamiento',
          coverFeeDescription: 'El total se ajustará automáticamente para ayudar a cubrir la tarifa estimada de procesamiento de tarjeta.',
          paymentSummaryTitle: 'Resumen del pago',
          subtotalLabel: 'Monto',
          processingFeeLabel: 'Tarifa estimada',
          totalLabel: 'Total',
          feeUnavailable: 'La opción para cubrir la tarifa no está disponible para este procesador.',
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
            cardHint: 'Insira os dados do cartão diretamente — não é necessária uma conta PayPal.',
            cardFormTitle: 'Pagamento seguro com cartão',
            payNow: 'Pagar',
            processingCard: 'Processando pagamento...',
            backToOptions: '← Voltar às opções de pagamento',
            successTitle: 'Obrigado pela sua oferta!',
            successAction: 'Fazer outra oferta',
            errorTitle: 'Não foi possível processar o pagamento',
            cancelTitle: 'O pagamento foi cancelado',
            retryAction: 'Tentar novamente',
            donationButton: 'Preparando o pagamento pelo PayPal...',
            sangetsuTitle: 'Pagamentos relacionados à Sangetsu',
            sangetsuDescription: 'Os pagamentos e doações de Sangetsu continuam sendo tratados no site da USA Sangetsu, onde também são administradas atividades, centros e registros.',
            sangetsuButton: 'Ir para o pagamento Sangetsu',
            sangetsuFooter: 'Use esta opção quando o pagamento corresponder a aulas, workshops, demonstrações, flores, exames ou outros itens da Sangetsu.',
            coverFeeLabel: 'Adicionar a taxa de processamento',
            coverFeeDescription: 'O total será ajustado automaticamente para ajudar a cobrir a taxa estimada de processamento do cartão.',
            paymentSummaryTitle: 'Resumo do pagamento',
            subtotalLabel: 'Valor',
            processingFeeLabel: 'Taxa estimada',
            totalLabel: 'Total',
            feeUnavailable: 'A opção para cobrir a taxa não está disponível para este processador.',
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
            cardHint: 'Enter your card details directly — no PayPal account required.',
            cardFormTitle: 'Secure card payment',
            payNow: 'Pay',
            processingCard: 'Processing payment...',
            backToOptions: '← Back to payment options',
            successTitle: 'Thank You for Your Offering',
            successAction: 'Make Another Offering',
            errorTitle: 'Payment Could Not Be Completed',
            cancelTitle: 'Payment Was Cancelled',
            retryAction: 'Try Again',
            donationButton: 'Preparing PayPal checkout...',
            sangetsuTitle: 'Sangetsu related payments',
            sangetsuDescription: 'Sangetsu payments and donations continue to be handled on the USA Sangetsu website, where activities, centers, and records are managed there directly.',
            sangetsuButton: 'Go to Sangetsu Payment',
            sangetsuFooter: 'Use this option when the payment is for classes, workshops, demonstrations, flowers, exams, or other Sangetsu-related purposes.',
            coverFeeLabel: 'Add the processing fee',
            coverFeeDescription: 'The total will adjust automatically to help cover the estimated card processing fee.',
            paymentSummaryTitle: 'Payment summary',
            subtotalLabel: 'Amount',
            processingFeeLabel: 'Estimated fee',
            totalLabel: 'Total',
            feeUnavailable: 'The fee-cover option is not available for this processor.',
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
  const [donationFieldErrors, setDonationFieldErrors] = useState<Partial<Record<keyof DonationFormState, string>>>({})
  const [pendingFund, setPendingFund] = useState<FundType | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [cardMode, setCardMode] = useState<'hidden' | 'loading' | 'ready' | 'submitting'>('hidden')
  const [cardPaymentError, setCardPaymentError] = useState<string | null>(null)
  const [feeConfig, setFeeConfig] = useState<ProcessingFeeConfig | null>(null)
  const [coverProcessingFee, setCoverProcessingFee] = useState(false)
  const formDataRef = useRef(donationForm)
  const coverProcessingFeeRef = useRef(coverProcessingFee)
  const navigateRef = useRef(navigate)
  const cardFieldsRef = useRef<PayPalCardFieldsInstance | null>(null)
  const parsedAmount = Number(donationForm.amount)
  const feeSummary = calculateCoveredFee(parsedAmount, feeConfig)
  const payableTotal = coverProcessingFee ? feeSummary.totalAmount : feeSummary.baseAmount

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

  // Keep refs in sync with latest values for use inside PayPal callbacks
  useEffect(() => { formDataRef.current = donationForm }, [donationForm])
  useEffect(() => { coverProcessingFeeRef.current = coverProcessingFee }, [coverProcessingFee])
  useEffect(() => { navigateRef.current = navigate }, [navigate])

  useEffect(() => {
    let isMounted = true

    async function loadFeeConfig() {
      try {
        const response = await fetch(feeConfigEndpoint)
        const data = (await response.json().catch(() => null)) as ProcessingFeeConfig | null
        if (!isMounted) return

        if (response.ok && data?.supported && data.currency === 'USD') {
          setFeeConfig(data)
        } else {
          setFeeConfig({ supported: false, percent: 0, fixed: 0, currency: 'USD' })
          setCoverProcessingFee(false)
        }
      } catch {
        if (isMounted) {
          setFeeConfig({ supported: false, percent: 0, fixed: 0, currency: 'USD' })
          setCoverProcessingFee(false)
        }
      }
    }

    void loadFeeConfig()

    return () => {
      isMounted = false
    }
  }, [feeConfigEndpoint])

  function updateDonationField(field: keyof DonationFormState, value: string) {
    setDonationForm((previous) => ({ ...previous, [field]: value }))
    setDonationFieldErrors((previous) => ({ ...previous, [field]: undefined }))
    setFormError(null)
  }

  function validateDonationForm(form: DonationFormState) {
    const requiredMessage =
      language === 'es' ? 'Este campo es obligatorio.' : language === 'pt' ? 'Este campo é obrigatório.' : 'This field is required.'
    const amountMessage =
      language === 'es'
        ? 'Ingrese un monto mayor que cero.'
        : language === 'pt'
          ? 'Informe um valor maior que zero.'
          : 'Enter an amount greater than zero.'
    const nextErrors: Partial<Record<keyof DonationFormState, string>> = {}
    const amount = Number(form.amount)

    if (!form.center.trim()) nextErrors.center = requiredMessage
    if (!form.donationType.trim()) nextErrors.donationType = requiredMessage
    if (!form.donorName.trim()) nextErrors.donorName = requiredMessage
    if (!Number.isFinite(amount) || amount <= 0) nextErrors.amount = amountMessage

    setDonationFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  // Render PayPal card fields into DOM containers once 'ready'
  useEffect(() => {
    if (cardMode !== 'ready' || !cardFieldsRef.current) return
    const cf = cardFieldsRef.current
    try {
      const nameField = cf.NameField()
      nameField.setAttribute('aria-required', 'true')
      nameField.render('#paypal-card-name')
      cf.NumberField().render('#paypal-card-number')
      cf.ExpiryField().render('#paypal-card-expiry')
      cf.CVVField().render('#paypal-card-cvv')
    } catch (err) {
      console.error('Card field render error:', err)
    }
  }, [cardMode])

  async function openCardFields() {
    setFormError(null)
    setCardPaymentError(null)

    const donorName = donationForm.donorName.trim()
    const center = donationForm.center.trim()
    const donationType = donationForm.donationType.trim()
    const amount = Number(donationForm.amount)

    if (!donorName || !center || !donationType) {
      setFormError('Please fill Full Name, Johrei Center, and Type of Donation before continuing.')
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError('Please provide a valid amount greater than zero.')
      return
    }

    setCardMode('loading')

    try {
      // Fetch the PayPal client ID from our API
      const configRes = await fetch(`${donationApiBaseUrl}/api/paypal/client-id`)
      const config = (await configRes.json().catch(() => null)) as { clientId?: string } | null
      if (!configRes.ok || !config?.clientId) throw new Error('Payment setup failed. Please try again.')

      // Load PayPal JS SDK if not already present
      const paypalWindow = window as Window & { paypal?: PayPalSDK }
      if (!paypalWindow.paypal) {
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector('script[src*="paypal.com/sdk/js"]')
          if (existing) {
            const check = setInterval(() => {
              if ((window as Window & { paypal?: PayPalSDK }).paypal) {
                clearInterval(check)
                resolve()
              }
            }, 100)
            setTimeout(() => { clearInterval(check); reject(new Error('Payment SDK timed out.')) }, 10000)
            return
          }
          const script = document.createElement('script')
          script.src = `https://www.paypal.com/sdk/js?client-id=${config.clientId}&components=card-fields&currency=USD`
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Could not load the payment SDK.'))
          document.head.appendChild(script)
        })
      }

      const sdk = (window as Window & { paypal?: PayPalSDK }).paypal
      if (!sdk?.CardFields) throw new Error('Card payment is not available right now. Please use the PayPal option.')

      const cardFields = sdk.CardFields({
        createOrder: async () => {
          const form = formDataRef.current
          const response = await fetch(createOrderEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fundType: 'donation',
              donorName: form.donorName.trim(),
              donorEmail: form.donorEmail.trim(),
              center: form.center.trim(),
              centerId: centerIdByName.get(form.center.trim()) ?? null,
              donationType: form.donationType.trim(),
              amount: Number(form.amount),
              currency: 'USD',
              fundingSource: 'card',
              coverProcessingFee: coverProcessingFeeRef.current,
            }),
          })
          const data = (await response.json().catch(() => null)) as { orderId?: string; error?: string } | null
          if (!response.ok || !data?.orderId) throw new Error(data?.error ?? 'Could not start payment.')
          return data.orderId
        },

        onApprove: async (data) => {
          const response = await fetch(captureOrderEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID, fundType: 'donation' }),
          })
          const result = (await response.json().catch(() => null)) as { error?: string; message?: string } | null
          if (!response.ok) throw new Error(result?.error ?? 'Could not confirm payment.')
          const next = new URLSearchParams()
          next.set('status', 'success')
          next.set('fund', 'donation')
          if (result?.message) next.set('message', result.message)
          navigateRef.current(`/donate?${next.toString()}`, { replace: true })
        },

        onError: (err: unknown) => {
          console.error('PayPal card error:', err)
          const message = err instanceof Error ? err.message : 'Payment failed. Please check your card details and try again.'
          setCardPaymentError(message)
          setCardMode('ready')
        },

        style: {
          input: {
            'font-size': '14px',
            color: '#0f172a',
            'font-family': 'system-ui, -apple-system, sans-serif',
          },
        },
      })

      if (!cardFields.isEligible()) {
        setCardMode('hidden')
        void startCheckout('donation', donationForm, 'card')
        return
      }

      cardFieldsRef.current = cardFields
      setCardMode('ready')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load the card payment form.'
      setCardMode('hidden')
      setFormError(message)
    }
  }

  async function submitCardPayment() {
    if (!cardFieldsRef.current || cardMode !== 'ready') return
    setCardMode('submitting')
    setCardPaymentError(null)
    try {
      await cardFieldsRef.current.submit({ contingencies: ['3D_SECURE'] })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment could not be processed. Please try again.'
      setCardPaymentError(message)
      setCardMode('ready')
    }
  }

  async function startCheckout(fundType: FundType, form: DonationFormState, fundingSource: 'paypal' | 'card' = 'paypal') {
    setFormError(null)

    if (!validateDonationForm(form)) return

    const donorName = form.donorName.trim()
    const donorEmail = form.donorEmail.trim()
    const center = form.center.trim()
    const centerId = centerIdByName.get(center) ?? null
    const donationType = form.donationType.trim()
    const amount = Number(form.amount)

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
          centerId,
          donationType,
          amount,
          currency: 'USD',
          fundingSource,
          coverProcessingFee,
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
  const statusMessage = searchParams.get('message')
  const isSuccess = status === 'success'
  const isCancelled = status === 'cancelled'
  const isError = status === 'error'

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
        <section className="public-hero">
          <div className="mx-auto max-w-4xl text-center">
            <p className="public-eyebrow">{copy.heroKicker}</p>
            <h1 className="public-title mx-auto">{copy.heroTitle}</h1>
          </div>
        </section>
        <Section className="bg-white">
          <div className="mx-auto max-w-lg py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl text-deep-slate">{copy.successTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              {statusMessage ?? 'Your donation was confirmed successfully.'}
            </p>
            <p className="mt-5 text-sm text-slate-500">{copy.gratitudeNotes[0]}</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigate('/donate', { replace: true })}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-deep-slate px-8 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-sage-600"
              >
                {copy.successAction}
              </button>
              <ButtonLink to="/" variant="outline">Home</ButtonLink>
            </div>
          </div>
        </Section>
      </div>
    )
  }

  if (isCancelled || isError) {
    return (
      <div className="min-h-screen bg-sanctuary-100 text-deep-slate">
        <section className="public-hero">
          <div className="mx-auto max-w-4xl text-center">
            <p className="public-eyebrow">{copy.heroKicker}</p>
            <h1 className="public-title mx-auto">{copy.heroTitle}</h1>
          </div>
        </section>
        <Section className="bg-white">
          <div className="mx-auto max-w-lg py-16 text-center">
            <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${isError ? 'bg-rose-100' : 'bg-amber-100'}`}>
              <svg
                className={`h-8 w-8 ${isError ? 'text-rose-500' : 'text-amber-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={isError ? 'M6 18L18 6M6 6l12 12' : 'M12 9v4m0 4h.01'}
                />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-deep-slate">
              {isError ? copy.errorTitle : copy.cancelTitle}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {statusMessage ?? (isError ? copy.error : copy.cancelled)}
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => navigate('/donate', { replace: true })}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-deep-slate px-8 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-sage-600"
              >
                {copy.retryAction}
              </button>
            </div>
          </div>
        </Section>
      </div>
    )
  }

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
                    id="donation-center"
                    value={donationForm.center}
                    onChange={(event) => updateDonationField('center', event.target.value)}
                    aria-invalid={donationFieldErrors.center ? 'true' : undefined}
                    aria-describedby={donationFieldErrors.center ? 'donation-center-error' : undefined}
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
                  {donationFieldErrors.center ? (
                    <p id="donation-center-error" className="mt-2 text-xs font-medium text-rose-800">{donationFieldErrors.center}</p>
                  ) : null}
                </label>
              </StepCard>

              <StepCard number="Step 2" title={copy.step2Title} body={copy.step2Body}>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.labels.type}</span>
                  <select
                    id="donation-type"
                    value={donationForm.donationType}
                    onChange={(event) => updateDonationField('donationType', event.target.value)}
                    aria-invalid={donationFieldErrors.donationType ? 'true' : undefined}
                    aria-describedby={donationFieldErrors.donationType ? 'donation-type-error' : undefined}
                    className="mt-2 w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                    required
                  >
                    {donationTypeSuggestions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {donationFieldErrors.donationType ? (
                    <p id="donation-type-error" className="mt-2 text-xs font-medium text-rose-800">{donationFieldErrors.donationType}</p>
                  ) : null}
                </label>
              </StepCard>

              <StepCard number="Step 3" title={copy.step3Title} body={copy.step3Body}>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.labels.amount}</span>
                  <input
                    id="donation-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={donationForm.amount}
                    onChange={(event) => updateDonationField('amount', event.target.value)}
                    aria-invalid={donationFieldErrors.amount ? 'true' : undefined}
                    aria-describedby={donationFieldErrors.amount ? 'donation-amount-error' : undefined}
                    className="mt-2 w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                    required
                  />
                  {donationFieldErrors.amount ? (
                    <p id="donation-amount-error" className="mt-2 text-xs font-medium text-rose-800">{donationFieldErrors.amount}</p>
                  ) : null}
                </label>

                <div className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.labels.quickAmounts}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {quickAmounts.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateDonationField('amount', String(value))}
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
                      id="donation-donor-name"
                      type="text"
                      value={donationForm.donorName}
                      onChange={(event) => updateDonationField('donorName', event.target.value)}
                      aria-invalid={donationFieldErrors.donorName ? 'true' : undefined}
                      aria-describedby={donationFieldErrors.donorName ? 'donation-donor-name-error' : undefined}
                      className="mt-2 w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                      required
                    />
                    {donationFieldErrors.donorName ? (
                      <p id="donation-donor-name-error" className="mt-2 text-xs font-medium text-rose-800">{donationFieldErrors.donorName}</p>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.labels.emailOptional}</span>
                    <input
                      type="email"
                      value={donationForm.donorEmail}
                      onChange={(event) => updateDonationField('donorEmail', event.target.value)}
                      className="mt-2 w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                      placeholder="you@example.org"
                    />
                  </label>
                </div>
              </StepCard>

              <AcceptedCards copy={copy} />

              <FeeCoverageControl
                copy={copy}
                feeConfig={feeConfig}
                checked={coverProcessingFee}
                disabled={cardMode === 'submitting' || pendingFund !== null}
                subtotal={feeSummary.baseAmount}
                processingFee={feeSummary.processingFee}
                total={feeSummary.totalAmount}
                onChange={setCoverProcessingFee}
              />

              <div className="space-y-3">
                {cardMode === 'hidden' ? (
                  <>
                    <PaymentButtons
                      sectionTitle={copy.paymentButtonsTitle}
                      preparingLabel={copy.labels.preparing}
                      paypalLabel={copy.paypalOption}
                      debitLabel={copy.debitCardOption}
                      cardHint={copy.cardHint}
                      isSubmitting={pendingFund === 'donation'}
                      disabled={false}
                      onPayPalClick={() => {
                        void startCheckout('donation', donationForm, 'paypal')
                      }}
                      onCardClick={() => {
                        void openCardFields()
                      }}
                    />
                    <p className="text-xs text-center text-slate-500">Powered by PayPal</p>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                      {copy.cardFormTitle}
                    </p>

                    {cardPaymentError && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                        {cardPaymentError}
                      </div>
                    )}

                    {cardMode === 'loading' && (
                      <div className="flex items-center justify-center rounded-xl border border-[rgba(15,23,42,0.10)] bg-white py-8">
                        <p className="text-sm text-slate-500">Loading secure card form…</p>
                      </div>
                    )}

                    {(cardMode === 'ready' || cardMode === 'submitting') && (
                      <div className="space-y-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Name on Card</p>
                          <div
                            id="paypal-card-name"
                            className="mt-2 min-h-[46px] w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white"
                          />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Card Number</p>
                          <div
                            id="paypal-card-number"
                            className="mt-2 min-h-[46px] w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Expiry Date</p>
                            <div
                              id="paypal-card-expiry"
                              className="mt-2 min-h-[46px] w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white"
                            />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Security Code</p>
                            <div
                              id="paypal-card-cvv"
                              className="mt-2 min-h-[46px] w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {cardMode !== 'loading' && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => void submitCardPayment()}
                          disabled={cardMode === 'submitting'}
                          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#1f2937] px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {cardMode === 'submitting'
                            ? copy.processingCard
                            : `${copy.payNow} ${formatUsd(payableTotal)}`}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCardMode('hidden')
                            setCardPaymentError(null)
                            cardFieldsRef.current = null
                          }}
                          disabled={cardMode === 'submitting'}
                          className="w-full py-1 text-center text-[11px] text-slate-500 transition hover:text-slate-700 disabled:opacity-50"
                        >
                          {copy.backToOptions}
                        </button>
                      </div>
                    )}

                    <p className="text-center text-xs text-slate-500">Powered by PayPal · Secure card processing</p>
                  </div>
                )}
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
