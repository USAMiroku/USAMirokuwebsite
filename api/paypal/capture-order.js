import {
  extractPayPalError,
  getAccessToken,
  isFundType,
  parseRequestBody,
  paypalRequest,
  sanitizeText,
} from './_paypal.js'

async function fetchOrderDetails({ baseUrl, accessToken, orderId }) {
  return paypalRequest({
    baseUrl,
    accessToken,
    path: `/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    method: 'GET',
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  try {
    const body = parseRequestBody(req)
    const fundType = body.fundType
    const orderId = sanitizeText(body.orderId, 64)

    if (!isFundType(fundType)) {
      return res.status(400).json({ error: 'Invalid fund type. Must be donation or sangetsu.' })
    }

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId.' })
    }

    const { baseUrl, accessToken } = await getAccessToken(fundType)

    const captureResponse = await paypalRequest({
      baseUrl,
      accessToken,
      path: `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      method: 'POST',
      body: {},
    })

    if (captureResponse.ok) {
      const status = captureResponse.data?.status || 'COMPLETED'
      const captureId =
        captureResponse.data?.purchase_units?.[0]?.payments?.captures?.[0]?.id || null

      return res.status(200).json({
        status,
        orderId,
        captureId,
        message: 'Your donation was confirmed successfully.',
      })
    }

    if (captureResponse.status === 422) {
      const orderResponse = await fetchOrderDetails({ baseUrl, accessToken, orderId })

      if (orderResponse.ok && orderResponse.data?.status === 'COMPLETED') {
        return res.status(200).json({
          status: 'COMPLETED',
          orderId,
          message: 'Your donation was already confirmed.',
        })
      }
    }

    return res.status(captureResponse.status).json({
      error: extractPayPalError(captureResponse.data, 'Could not capture PayPal payment.'),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not capture PayPal payment.'
    return res.status(500).json({ error: message })
  }
}
