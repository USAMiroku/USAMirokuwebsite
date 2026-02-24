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

  const forwardedHost = req.headers['x-forwarded-host']
  const host = forwardedHost || req.headers.host
  const forwardedProto = req.headers['x-forwarded-proto']
  const proto = forwardedProto || 'https'

  if (!host) {
    return 'http://localhost:5173'
  }

  return `${proto}://${host}`
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

export function buildCustomId({ donorName, center, donationType, fundType }) {
  const payload = [
    `fund:${sanitizeText(fundType, 12)}`,
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
