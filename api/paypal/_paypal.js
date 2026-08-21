const PAYPAL_BASE_URL = {
  live: 'https://api-m.paypal.com',
  sandbox: 'https://api-m.sandbox.paypal.com',
}

const FUND_ENV = {
  donation: {
    clientId: 'PAYPAL_DONATIONS_CLIENT_ID',
    secret: 'PAYPAL_DONATIONS_SECRET',
  },
  sangetsu: {
    clientId: 'PAYPAL_SANGETSU_CLIENT_ID',
    secret: 'PAYPAL_SANGETSU_SECRET',
  },
}

const DEFAULT_PROCESSING_FEE_PERCENT = 0.0289
const DEFAULT_PROCESSING_FEE_FIXED = 0.29

export function isFundType(value) {
  return value === 'donation' || value === 'sangetsu'
}

export function parseRequestBody(req) {
  const body = req.body

  if (!body) return {}
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }

  return body
}

export function getRequestOrigin(req) {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, '')
  }

  if (process.env.NODE_ENV !== 'production') return 'http://localhost:5173'
  throw new Error('SITE_URL must be configured in production.')
}

function getPayPalBaseUrl() {
  const mode = (process.env.PAYPAL_ENV || 'live').toLowerCase()
  return mode === 'sandbox' ? PAYPAL_BASE_URL.sandbox : PAYPAL_BASE_URL.live
}

function getCredentials(fundType) {
  const envConfig = FUND_ENV[fundType]

  if (!envConfig) {
    throw new Error('Invalid fund type.')
  }

  const clientId = process.env[envConfig.clientId]
  const secret = process.env[envConfig.secret]

  if (!clientId || !secret) {
    throw new Error(`Missing PayPal credentials for ${fundType}.`)
  }

  return { clientId, secret }
}

export function sanitizeText(value, maxLength = 80) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

export function parseAmount(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return null
  }

  return amount.toFixed(2)
}

function parseOptionalNumber(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export function getProcessingFeeConfig() {
  const enabledValue = String(process.env.PAYPAL_PROCESSING_FEE_COVER_ENABLED ?? 'true').toLowerCase()
  const percent = parseOptionalNumber(process.env.PAYPAL_PROCESSING_FEE_PERCENT, DEFAULT_PROCESSING_FEE_PERCENT)
  const fixed = parseOptionalNumber(process.env.PAYPAL_PROCESSING_FEE_FIXED, DEFAULT_PROCESSING_FEE_FIXED)

  return {
    supported: enabledValue !== 'false' && percent > 0,
    percent,
    fixed,
    currency: 'USD',
  }
}

export function calculateCoveredProcessingFee(amount, config = getProcessingFeeConfig()) {
  const baseAmount = Number(amount)
  if (!config.supported || !Number.isFinite(baseAmount) || baseAmount <= 0) {
    return {
      baseAmount: parseAmount(baseAmount) ?? '0.00',
      processingFee: '0.00',
      totalAmount: parseAmount(baseAmount) ?? '0.00',
    }
  }

  const totalCents = Math.ceil(((baseAmount + config.fixed) / (1 - config.percent)) * 100)
  const baseCents = Math.round(baseAmount * 100)
  const feeCents = Math.max(0, totalCents - baseCents)

  return {
    baseAmount: (baseCents / 100).toFixed(2),
    processingFee: (feeCents / 100).toFixed(2),
    totalAmount: (totalCents / 100).toFixed(2),
  }
}

export function buildCustomId({ donorName, center, centerId, donationType, fundType }) {
  const payload = [
    `fund:${sanitizeText(fundType, 12)}`,
    `centerId:${sanitizeText(centerId, 32)}`,
    `name:${sanitizeText(donorName, 24)}`,
    `center:${sanitizeText(center, 24)}`,
    `type:${sanitizeText(donationType, 24)}`,
  ].join('|')

  return payload.slice(0, 127)
}

export function buildInvoiceId(fundType) {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `WM-${fundType.toUpperCase()}-${Date.now()}-${suffix}`.slice(0, 127)
}

function parseApiPayload(text) {
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

export async function getAccessToken(fundType) {
  const baseUrl = getPayPalBaseUrl()
  const { clientId, secret } = getCredentials(fundType)
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64')

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const text = await response.text()
  const data = parseApiPayload(text)

  if (!response.ok || !data?.access_token) {
    const error = data?.error_description || data?.error || 'Could not authenticate with PayPal.'
    throw new Error(String(error))
  }

  return {
    baseUrl,
    accessToken: data.access_token,
  }
}

export async function paypalRequest({ baseUrl, accessToken, path, method = 'GET', body }) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  const data = parseApiPayload(text)

  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}

export function extractPayPalError(payload, fallback = 'PayPal request failed.') {
  const details = payload?.details
  if (Array.isArray(details) && details.length > 0 && details[0]?.description) {
    return String(details[0].description)
  }

  if (payload?.message) {
    return String(payload.message)
  }

  if (payload?.error_description) {
    return String(payload.error_description)
  }

  return fallback
}
