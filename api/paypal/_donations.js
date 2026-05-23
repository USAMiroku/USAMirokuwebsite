import { getSupabaseAdmin } from '../admin/_supabaseAdmin.js'

function getAdminClientOrNull() {
  try {
    return getSupabaseAdmin()
  } catch {
    return null
  }
}

function toNullableText(value, maxLength = 255) {
  const next = String(value || '').replace(/\s+/g, ' ').trim()
  if (!next) return null
  return next.slice(0, maxLength)
}

function toNullableNumber(value) {
  const next = Number(value)
  return Number.isFinite(next) ? next : null
}

function toIsoTimestamp(value) {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString()
}

function parseCustomId(value) {
  const raw = String(value || '').trim()
  if (!raw) return {}

  return raw.split('|').reduce((acc, segment) => {
    const [key, ...rest] = segment.split(':')
    if (!key || rest.length === 0) return acc
    acc[key.trim()] = rest.join(':').trim()
    return acc
  }, {})
}

function parseDonorDescription(value) {
  const raw = String(value || '').trim()
  if (!raw) return {}

  const match = raw.match(/^Donor:\s*(.+?)(?:\s*\(([^)]+)\))?$/i)
  if (!match) return {}

  return {
    donorName: match[1]?.trim() || null,
    donorEmail: match[2]?.trim() || null,
  }
}

export async function recordDonationOrder({
  orderId,
  invoiceId,
  fundType,
  donorName,
  donorEmail,
  centerId,
  centerName,
  donationType,
  amount,
  currency,
  customId,
  orderPayload,
}) {
  const admin = getAdminClientOrNull()
  if (!admin) return

  const payload = {
    order_id: toNullableText(orderId, 128),
    provider_invoice_id: toNullableText(invoiceId, 128),
    provider: 'paypal',
    fund_type: toNullableText(fundType, 20),
    status: 'created',
    donor_name: toNullableText(donorName, 120),
    donor_email: toNullableText(donorEmail, 160),
    center_id: toNullableText(centerId, 120),
    center_name: toNullableText(centerName, 160),
    donation_type: toNullableText(donationType, 160),
    amount: toNullableNumber(amount),
    currency: toNullableText(currency, 8) ?? 'USD',
    source: 'website_donate_page',
    custom_id: toNullableText(customId, 127),
    order_payload: orderPayload ?? null,
  }

  const { error } = await admin.from('website_donations').upsert(payload, { onConflict: 'order_id' })
  if (error) throw error
}

export async function markDonationCompleted({
  orderId,
  captureId,
  fundType,
  paypalStatus,
  payerEmail,
  payerId,
  capturePayload,
}) {
  const admin = getAdminClientOrNull()
  if (!admin) return

  const purchaseUnit = capturePayload?.purchase_units?.[0] ?? null
  const firstItem = purchaseUnit?.items?.[0] ?? null
  const unitAmount = purchaseUnit?.amount?.value ?? null
  const unitCurrency = purchaseUnit?.amount?.currency_code ?? null
  const customId = purchaseUnit?.custom_id ?? null
  const invoiceId = purchaseUnit?.invoice_id ?? null
  const customIdFields = parseCustomId(customId)
  const donorDescription = parseDonorDescription(firstItem?.description)
  const derivedDonationType = firstItem?.name ?? customIdFields.type ?? null
  const derivedCenterName =
    customIdFields.center ??
    (typeof purchaseUnit?.description === 'string' && purchaseUnit.description.includes(' | ')
      ? purchaseUnit.description.split(' | ').slice(1).join(' | ')
      : purchaseUnit?.description ?? null)

  const payload = {
    order_id: toNullableText(orderId, 128),
    capture_id: toNullableText(captureId, 128),
    provider: 'paypal',
    fund_type: toNullableText(fundType, 20),
    status: 'completed',
    paypal_status: toNullableText(paypalStatus, 40),
    paypal_payer_email: toNullableText(payerEmail, 160),
    payer_id: toNullableText(payerId, 128),
    provider_invoice_id: toNullableText(invoiceId, 128),
    custom_id: toNullableText(customId, 127),
    donor_name: toNullableText(donorDescription.donorName ?? customIdFields.name, 120),
    donor_email: toNullableText(donorDescription.donorEmail, 160),
    center_id: toNullableText(customIdFields.centerId, 120),
    center_name: toNullableText(derivedCenterName, 160),
    donation_type: toNullableText(derivedDonationType, 160),
    capture_payload: capturePayload ?? null,
    completed_at:
      toIsoTimestamp(capturePayload?.update_time) ??
      toIsoTimestamp(capturePayload?.purchase_units?.[0]?.payments?.captures?.[0]?.create_time) ??
      new Date().toISOString(),
  }

  const parsedAmount = toNullableNumber(unitAmount)
  if (parsedAmount !== null) {
    payload.amount = parsedAmount
  }

  const parsedCurrency = toNullableText(unitCurrency, 8)
  if (parsedCurrency) {
    payload.currency = parsedCurrency
  }

  const { error } = await admin.from('website_donations').upsert(payload, { onConflict: 'order_id' })
  if (error) throw error
}
