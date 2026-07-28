import {
  buildCustomId,
  buildInvoiceId,
  calculateCoveredProcessingFee,
  extractPayPalError,
  getAccessToken,
  getProcessingFeeConfig,
  getRequestOrigin,
  isFundType,
  parseAmount,
  parseRequestBody,
  paypalRequest,
  sanitizeText,
} from './_paypal.js'
import { recordDonationOrder } from './_donations.js'

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
    const centerId = sanitizeText(body.centerId, 80)
    const donationType = sanitizeText(body.donationType, 80)
    const amount = parseAmount(body.amount)
    const currency = sanitizeText(body.currency || 'USD', 3).toUpperCase()
    const fundingSource = body.fundingSource === 'card' ? 'card' : 'paypal'
    const coverProcessingFee = body.coverProcessingFee === true

    if (!donorName || !center || !donationType) {
      return res.status(400).json({ error: 'Missing required fields: donorName, center, and donationType.' })
    }

    if (!amount) {
      return res.status(400).json({ error: 'Amount must be greater than zero.' })
    }

    const { baseUrl, accessToken } = await getAccessToken(fundType)
    const origin = getRequestOrigin(req)

    const invoiceId = buildInvoiceId(fundType)
    const feeConfig = getProcessingFeeConfig()
    const feeDetails =
      fundType === 'donation' && coverProcessingFee && feeConfig.supported && currency === feeConfig.currency
        ? calculateCoveredProcessingFee(amount, feeConfig)
        : {
            baseAmount: amount,
            processingFee: '0.00',
            totalAmount: amount,
          }
    const customId = buildCustomId({
      donorName,
      center,
      centerId,
      donationType,
      fundType,
    })

    const orderBody = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: fundType.toUpperCase(),
          invoice_id: invoiceId,
          custom_id: customId,
          description: `${donorName} | ${donationType} | ${center}`.slice(0, 127),
          amount: {
            currency_code: currency,
            value: feeDetails.totalAmount,
            breakdown: {
              item_total: {
                currency_code: currency,
                value: amount,
              },
              ...(Number(feeDetails.processingFee) > 0
                ? {
                    handling: {
                      currency_code: currency,
                      value: feeDetails.processingFee,
                    },
                  }
                : {}),
            },
          },
          items: [
            {
              name: `${donorName} — ${donationType}`.slice(0, 127),
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
        landing_page: fundingSource === 'card' ? 'BILLING' : 'LOGIN',
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

    try {
      await recordDonationOrder({
        orderId: orderResponse.data.id,
        invoiceId,
        fundType,
        donorName,
        donorEmail,
        centerId,
        centerName: center,
        donationType,
        amount: feeDetails.totalAmount,
        currency,
        customId,
        orderPayload: orderResponse.data,
      })
    } catch (recordError) {
      console.error('Could not record donation order.', recordError)
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
