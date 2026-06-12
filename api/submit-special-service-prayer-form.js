const CENTERS = [
  { name: 'National Headquarters', email: 'headquarters@miroku.us' },
  { name: 'Boston, MA', email: 'boston@miroku.us' },
  { name: 'Los Angeles, CA', email: 'losangeles@miroku.us' },
  { name: 'Miami, FL', email: 'miami@miroku.us' },
  { name: 'New York, NY', email: 'newyork@miroku.us' },
  { name: 'Orlando, FL', email: 'orlando@miroku.us' },
]

const SERVICES = new Set([
  'Paradise on Earth Service',
  'Annual Ancestors Service',
  'Meishu-sama Birthday Celebration Service',
])

const LANGUAGES = new Set(['en', 'pt', 'es'])

function parseJsonBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

function sanitizeText(value, maxLength = 500) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

function sanitizeFilename(value) {
  const filename = sanitizeText(value, 120).replace(/[^a-zA-Z0-9._-]/g, '-')
  return filename.endsWith('.pdf') ? filename : 'prayer-form.pdf'
}

function sanitizeStringArray(value) {
  if (!Array.isArray(value)) return []
  return value.map((item) => sanitizeText(item, 500)).filter(Boolean)
}

function sanitizeAncestors(value) {
  if (!Array.isArray(value)) return []
  return value
    .map((row) => ({
      name: sanitizeText(row?.name, 180),
      relationship: sanitizeText(row?.relationship, 120),
    }))
    .filter((row) => row.name || row.relationship)
}

function escapeHtml(value) {
  return sanitizeText(value, 2000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderList(items) {
  if (!items.length) return '<p>None provided.</p>'
  return `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`
}

function renderAncestorRows(rows) {
  if (!rows.length) return '<p>None provided.</p>'
  return `<table cellpadding="6" cellspacing="0" border="1"><thead><tr><th align="left">Name</th><th align="left">Relationship</th></tr></thead><tbody>${rows
    .map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.relationship)}</td></tr>`)
    .join('')}</tbody></table>`
}

function buildPlainText({ serviceName, language, centerName, name, date, section1, section2, ancestors }) {
  const lines = [
    `Service: ${serviceName}`,
    `Language: ${language}`,
    `Center: ${centerName}`,
    `Full name: ${name}`,
    `Date: ${date || 'Not provided'}`,
    '',
  ]

  if (section1.length) {
    lines.push('Section 1:', ...section1.map((item) => `- ${item}`), '')
  }

  if (section2.length) {
    lines.push('Section 2:', ...section2.map((item) => `- ${item}`), '')
  }

  if (ancestors.length) {
    lines.push('Ancestors:')
    ancestors.forEach((row) => lines.push(`- ${row.name} | ${row.relationship}`))
    lines.push('')
  }

  return lines.join('\n')
}

function buildHtmlSummary({ serviceName, language, centerName, name, date, section1, section2, ancestors }) {
  return `
    <h2>Prayer Form Submission</h2>
    <p><strong>Service:</strong> ${escapeHtml(serviceName)}</p>
    <p><strong>Language:</strong> ${escapeHtml(language)}</p>
    <p><strong>Center:</strong> ${escapeHtml(centerName)}</p>
    <p><strong>Full name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Date:</strong> ${escapeHtml(date || 'Not provided')}</p>
    <h3>Section 1</h3>
    ${renderList(section1)}
    <h3>Section 2</h3>
    ${renderList(section2)}
    <h3>Ancestors</h3>
    ${renderAncestorRows(ancestors)}
  `
}

async function sendWithSendGrid({ fromEmail, toEmail, subject, text, html, attachment, serviceName, centerName }) {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) {
    throw new Error('Missing SENDGRID_API_KEY.')
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: toEmail }],
          subject,
          custom_args: {
            form: 'special-service-prayer-form',
            service: serviceName,
            center: centerName,
          },
        },
      ],
      from: { email: fromEmail, name: 'World Messianic Church of America' },
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html },
      ],
      attachments: [
        {
          content: attachment.contentBase64,
          filename: attachment.filename,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    }),
  })

  if (!response.ok) {
    const details = await response.text().catch(() => '')
    throw new Error(details || 'SendGrid could not send the email.')
  }

  return {
    messageId: response.headers.get('x-message-id') || '',
    status: response.status,
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  try {
    const body = parseJsonBody(req)
    const serviceName = sanitizeText(body.serviceName, 120)
    const language = sanitizeText(body.language, 2)
    const centerName = sanitizeText(body.centerName, 80)
    const centerEmail = sanitizeText(body.centerEmail, 120).toLowerCase()
    const center = CENTERS.find((candidate) => candidate.name === centerName && candidate.email === centerEmail)
    const name = sanitizeText(body.fields?.name, 180)
    const date = sanitizeText(body.fields?.date, 80)
    const section1 = sanitizeStringArray(body.fields?.section1)
    const section2 = sanitizeStringArray(body.fields?.section2)
    const ancestors = sanitizeAncestors(body.fields?.ancestors)
    const filename = sanitizeFilename(body.pdf?.filename)
    const contentBase64 = String(body.pdf?.contentBase64 ?? '').trim()
    const fromEmail = sanitizeText(process.env.PRAYER_FORM_FROM_EMAIL, 180)

    if (!SERVICES.has(serviceName)) {
      return res.status(400).json({ error: 'Invalid service name.' })
    }

    if (!LANGUAGES.has(language)) {
      return res.status(400).json({ error: 'Invalid language.' })
    }

    if (!center) {
      return res.status(400).json({ error: 'Invalid Johrei Center.' })
    }

    if (!name) {
      return res.status(400).json({ error: 'Full name is required.' })
    }

    if (!contentBase64 || contentBase64.length < 100) {
      return res.status(400).json({ error: 'A completed PDF attachment is required.' })
    }

    if (!fromEmail) {
      return res.status(500).json({ error: 'Missing PRAYER_FORM_FROM_EMAIL.' })
    }

    const subject = `Prayer Form \u2014 ${serviceName} \u2014 ${center.name}`
    const summary = { serviceName, language, centerName: center.name, name, date, section1, section2, ancestors }
    const text = buildPlainText(summary)
    const html = buildHtmlSummary(summary)

    const sendResult = await sendWithSendGrid({
      fromEmail,
      toEmail: center.email,
      subject,
      text,
      html,
      serviceName,
      centerName: center.name,
      attachment: {
        filename,
        contentBase64,
      },
    })

    console.log('Special service prayer form accepted by SendGrid.', {
      messageId: sendResult.messageId,
      status: sendResult.status,
      to: center.email,
      serviceName,
      centerName: center.name,
    })

    return res.status(200).json({ ok: true, messageId: sendResult.messageId })
  } catch (error) {
    console.error('Could not submit special service prayer form.', error)
    const message = error instanceof Error ? error.message : 'Could not submit prayer form.'
    return res.status(500).json({ error: message })
  }
}
