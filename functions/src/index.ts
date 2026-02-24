import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import Stripe from 'stripe'

const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY')

type CreatePaymentIntentBody = {
  amountInCents?: number
  currency?: string
  donationType?: string
  donorName?: string
  donorEmail?: string
}

let stripeClient: Stripe | null = null

function getStripeClient(secret: string) {
  if (!stripeClient) {
    stripeClient = new Stripe(secret)
  }

  return stripeClient
}

function setCorsHeaders(origin: string | undefined, res: { set: (field: string, value: string) => void }) {
  const defaultAllowed = [
    'https://mirokucanada-site.web.app',
    'https://mirokucanada-site.firebaseapp.com',
    'http://localhost:5173',
  ]

  const configured = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

  const allowedOrigins = configured.length ? configured : defaultAllowed

  if (origin && allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin)
  }

  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
}

export const createPaymentIntent = onRequest({ secrets: [stripeSecretKey] }, async (req, res) => {
  setCorsHeaders(req.headers.origin, res)

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  const body = (req.body ?? {}) as CreatePaymentIntentBody
  const amountInCents = Number(body.amountInCents)

  if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
    res.status(400).json({ error: 'Amount must be greater than 0.' })
    return
  }

  const secretKey = stripeSecretKey.value()

  if (!secretKey) {
    res.status(500).json({ error: 'Missing Stripe secret key configuration.' })
    return
  }

  try {
    const stripe = getStripeClient(secretKey)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountInCents),
      currency: (body.currency ?? 'cad').toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        donationType: body.donationType ?? 'unspecified',
        donorName: body.donorName ?? '',
        donorEmail: body.donorEmail ?? '',
      },
    })

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create PaymentIntent.'
    res.status(500).json({ error: message })
  }
})
