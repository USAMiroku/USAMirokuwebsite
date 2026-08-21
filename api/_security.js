const buckets = new Map()

function requestIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  return forwarded || String(req.socket?.remoteAddress || 'unknown')
}

export function enforceRateLimit(req, res, { key = 'api', limit = 30, windowMs = 60_000 } = {}) {
  const now = Date.now()
  const bucketKey = `${key}:${requestIp(req)}`
  const current = buckets.get(bucketKey)
  const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current
  bucket.count += 1
  buckets.set(bucketKey, bucket)

  res.setHeader('RateLimit-Limit', String(limit))
  res.setHeader('RateLimit-Remaining', String(Math.max(0, limit - bucket.count)))
  res.setHeader('RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)))

  if (bucket.count > limit) {
    res.setHeader('Retry-After', String(Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))))
    res.status(429).json({ error: 'Too many requests. Please try again shortly.' })
    return false
  }
  return true
}

export function enforceSameOrigin(req, res) {
  const origin = String(req.headers.origin || '').replace(/\/$/, '')
  if (!origin) return true

  const configured = String(process.env.SITE_URL || '').replace(/\/$/, '')
  const allowed = new Set([
    configured,
    'https://worldmessianic.org',
    'https://www.worldmessianic.org',
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:5173'] : []),
  ].filter(Boolean))

  if (!allowed.has(origin)) {
    res.status(403).json({ error: 'Request origin is not allowed.' })
    return false
  }
  return true
}
