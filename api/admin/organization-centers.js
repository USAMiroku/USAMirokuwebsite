import { parseJsonBody, requireSuperAdmin } from './_supabaseAdmin.js'

const CENTER_COLUMNS =
  'id,slug,kind,name,city,state,address,phone,email,schedule,notes,leadership_head,leadership_assistant,is_active,display_order'

function requestId() {
  return `org-centers-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function nullableTrim(value) {
  const trimmed = String(value || '').trim()
  return trimmed || null
}

function toManagedCenter(row) {
  return {
    id: row.id,
    slug: row.slug,
    kind: row.kind,
    name: row.name,
    city: row.city,
    state: row.state,
    address: row.address,
    phone: row.phone,
    email: row.email,
    schedule: row.schedule || undefined,
    notes: row.notes || undefined,
    leadership: {
      head: row.leadership_head || undefined,
      assistant: row.leadership_assistant || undefined,
    },
    isActive: row.is_active,
    displayOrder: row.display_order,
  }
}

function buildCenterPayload(body) {
  const id = String(body.id || '').trim()
  const slug = String(body.slug || '').trim()
  const kind = String(body.kind || 'center').trim()
  const name = String(body.name || '').trim()

  if (!id || !slug || !name) {
    throw new Error('ID, slug, and name are required.')
  }

  if (!['center', 'group', 'hq'].includes(kind)) {
    throw new Error('Kind must be center, group, or hq.')
  }

  return {
    id,
    slug,
    kind,
    name,
    city: String(body.city || '').trim(),
    state: String(body.state || '').trim(),
    address: String(body.address || '').trim(),
    phone: String(body.phone || '').trim(),
    email: String(body.email || '').trim(),
    schedule: nullableTrim(body.schedule),
    notes: nullableTrim(body.notes),
    leadership_head: nullableTrim(body.leadership_head),
    leadership_assistant: nullableTrim(body.leadership_assistant),
    is_active: body.is_active !== false,
    display_order: Number.isFinite(Number(body.display_order)) ? Number(body.display_order) : 0,
  }
}

export default async function handler(req, res) {
  const traceId = requestId()

  if (!['PUT', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'PUT, DELETE')
    return res.status(405).json({ error: 'Method not allowed.', requestId: traceId })
  }

  try {
    const { admin, currentUser } = await requireSuperAdmin(req)
    const body = parseJsonBody(req)

    if (req.method === 'DELETE') {
      const centerId = String(body.id || '').trim()
      if (!centerId) {
        return res.status(400).json({ error: 'Center id is required.', requestId: traceId })
      }

      const { error } = await admin.from('organization_centers').delete().eq('id', centerId)
      if (error) {
        console.error('[admin/organization-centers] delete failed', {
          requestId: traceId,
          userId: currentUser.id,
          centerId,
          error,
        })
        return res.status(400).json({ error: error.message || 'Could not delete center.', requestId: traceId })
      }

      return res.status(200).json({ ok: true, id: centerId, requestId: traceId })
    }

    const payload = buildCenterPayload(body)
    const { data, error } = await admin
      .from('organization_centers')
      .upsert(payload)
      .select(CENTER_COLUMNS)
      .single()

    if (error) {
      console.error('[admin/organization-centers] upsert failed', {
        requestId: traceId,
        userId: currentUser.id,
        centerId: payload.id,
        error,
      })
      return res.status(400).json({ error: error.message || 'Could not save center.', requestId: traceId })
    }

    return res.status(200).json({ center: toManagedCenter(data), requestId: traceId })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update organization centers.'
    console.error('[admin/organization-centers] request failed', {
      requestId: traceId,
      error,
    })
    return res.status(500).json({ error: message, requestId: traceId })
  }
}
