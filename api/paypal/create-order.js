import {
  buildCustomId,
  buildInvoiceId,
  extractPayPalError,
  getAccessToken,
  getRequestOrigin,
  isFundType,
  parseAmount,
  parseRequestBody,
  paypalRequest,
  sanitizeText,
} from './_paypal.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  try {
    const body = parseRequestBody(req)
    const fundType = body.fundType

    if (!isFundType(fundType)) {
      return res.status(400).json({ error: 'Invalid fund type. Must be donation or sangetsu.' })
    }

    const donorName = sanitizeText(body.donorName, 80)
    const donorEmail = sanitizeText(body.donorEmail, 120)
    const center = sanitizeText(body.center, 80)
    const donationType = sanitizeText(body.donationType, 80)
    const amount = parseAmount(body.amount)
    const currency = sanitizeText(body.currency || 'USD', 3).toUpperCase()

    if (!donorName || !center || !donationType) {
      return res.status(400).json({ error: 'Missing required fields: donorName, center, and donationType.' })
    }

    if (!amount) {
      return res.status(400).json({ error: 'Amount must be greater than zero.' })
    }

    const { baseUrl, accessToken } = await getAccessToken(fundType)
    const origin = getRequestOrigin(req)

    const orderBody = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: fundType.toUpperCase(),
          invoice_id: buildInvoiceId(fundType),
          custom_id: buildCustomId({
            donorName,
            center,
            donationType,
            fundType,
          }),
          description: `${donationType} | ${center}`.slice(0, 127),
          amount: {
            currency_code: currency,
            value: amount,
          },
          items: [
            {
              name: donationType.slice(0, 127),
              description: `Donor: ${donorName}${donorEmail ? ` (${donorEmail})` : ''}`.slice(0, 127),
              quantity: '1',
              unit_amount: {
                currency_code: currency,
                value: amount,
              },
              category: 'DIGITAL_GOODS',
            },
          ],
        },
      ],
      application_context: {
        brand_name: 'World Messianic Church',
        user_action: 'PAY_NOW',
        return_url: `${origin}/donate?fund=${fundType}`,
        cancel_url: `${origin}/donate?status=cancelled&fund=${fundType}`,
      },
    }

    const orderResponse = await paypalRequest({
      baseUrl,
      accessToken,
      path: '/v2/checkout/orders',
      method: 'POST',
      body: orderBody,
    })

    if (!orderResponse.ok) {
      return res.status(orderResponse.status).json({
        error: extractPayPalError(orderResponse.data, 'Could not create PayPal order.'),
      })
    }

    const approveUrl = orderResponse.data?.links?.find((link) => link.rel === 'approve')?.href

    if (!approveUrl) {
      return res.status(500).json({ error: 'PayPal order created but approval URL is missing.' })
    }

    return res.status(200).json({
      orderId: orderResponse.data.id,
      approveUrl,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create PayPal order.'
    return res.status(500).json({ error: message })
  }
}
