import { getSupabaseAdmin } from '../admin/_supabaseAdmin.js'

export default async function handler(_req, res) {
  if (_req.method && _req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('organization_centers')
      .select('id,slug,kind,name,city,state,address,phone,email,schedule,notes,leadership_head,leadership_assistant,is_active,display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json({ centers: data ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error.'
    res.status(500).json({ error: message })
  }
}
