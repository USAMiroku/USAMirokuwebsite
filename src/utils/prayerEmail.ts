function base64(bytes: Uint8Array) {
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
  }
  return btoa(binary)
}

function wrap(value: string) {
  return value.match(/.{1,76}/g)?.join('\r\n') ?? ''
}

/** An RFC 822 message containing the actual PDF bytes, not a mailto attachment hint. */
export async function createPrayerEmail(pdf: File, recipient: string, subject: string, body: string) {
  if (/[\r\n]/.test(recipient) || !/^[a-zA-Z0-9._-]+\.pdf$/.test(pdf.name)) {
    throw new Error('Invalid email metadata.')
  }
  const boundary = `prayer-${crypto.randomUUID()}`
  const encodedSubject = base64(new TextEncoder().encode(subject))
  const subjectWords = encodedSubject.match(/.{1,60}/g)?.map(part => `=?UTF-8?B?${part}?=`).join('\r\n ') ?? ''
  const content = [
    `To: ${recipient}`,
    `Subject: ${subjectWords}`,
    'MIME-Version: 1.0',
    'X-Unsent: 1',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap(base64(new TextEncoder().encode(body))),
    `--${boundary}`,
    `Content-Type: application/pdf; name="${pdf.name}"`,
    `Content-Disposition: attachment; filename="${pdf.name}"`,
    'Content-Transfer-Encoding: base64',
    '',
    wrap(base64(new Uint8Array(await pdf.arrayBuffer()))),
    `--${boundary}--`,
    '',
  ].join('\r\n')
  return new File([content], pdf.name.replace(/\.pdf$/, '.eml'), { type: 'message/rfc822' })
}
