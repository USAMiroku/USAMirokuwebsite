import { useEffect, useMemo, useState } from 'react'
import { siteConfig } from '../config/siteConfig'
import { type Location, type LocationType } from '../types'
import { supabase } from '../learning/lib/supabaseClient'

export type ManagedCenterKind = 'center' | 'group' | 'hq'

export type ManagedCenter = {
  id: string
  slug: string
  kind: ManagedCenterKind
  name: string
  city: string
  state: string
  address: string
  phone: string
  email: string
  schedule?: string
  notes?: string
  leadership?: {
    head?: string
    assistant?: string
  }
  isActive: boolean
  displayOrder: number
}

type CenterRow = {
  id: string
  slug: string
  kind: ManagedCenterKind
  name: string
  city: string
  state: string
  address: string
  phone: string
  email: string
  schedule: string | null
  notes: string | null
  leadership_head: string | null
  leadership_assistant: string | null
  is_active: boolean
  display_order: number
}

async function fetchCenterRowsFromApi(): Promise<CenterRow[] | null> {
  try {
    const response = await fetch('/api/public/centers')
    if (!response.ok) return null
    const payload = (await response.json()) as { centers?: CenterRow[] }
    return Array.isArray(payload.centers) ? payload.centers : null
  } catch {
    return null
  }
}

function inferKind(centerId: string, address: string) {
  if (centerId === 'national-headquarters') return 'hq' as const
  if (!address.trim()) return 'group' as const
  return 'center' as const
}

const fallbackDisplayOrder: Record<string, number> = {
  'national-headquarters': 10,
  'boston-johrei-center': 20,
  'los-angeles-johrei-center': 30,
  'miami-johrei-center': 40,
  'new-york-johrei-center': 50,
  'orlando-johrei-center': 60,
  'washington-dc': 70,
}

function normalizeDisplayOrder(centerId: string, displayOrder: number) {
  if (displayOrder < 10 && fallbackDisplayOrder[centerId]) {
    return fallbackDisplayOrder[centerId]
  }
  return displayOrder
}

export const fallbackManagedCenters: ManagedCenter[] = siteConfig.centers.map((center, index) => ({
  id: center.id,
  slug: center.id,
  kind: inferKind(center.id, center.address),
  name: center.name,
  city: center.city,
  state: center.state,
  address: center.address,
  phone: center.phone,
  email: center.email,
  schedule: center.schedule,
  notes: undefined,
  leadership: center.leadership,
  isActive: true,
  displayOrder: fallbackDisplayOrder[center.id] ?? (index + 1) * 10,
}))

function mapRow(row: CenterRow): ManagedCenter {
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
    schedule: row.schedule ?? undefined,
    notes: row.notes ?? undefined,
    leadership: {
      head: row.leadership_head ?? undefined,
      assistant: row.leadership_assistant ?? undefined,
    },
    isActive: row.is_active,
    displayOrder: normalizeDisplayOrder(row.id, row.display_order),
  }
}

function mergeWithFallbackCenters(managedCenters: ManagedCenter[]) {
  const managedIds = new Set(managedCenters.map((center) => center.id))
  const missingFallbackCenters = fallbackManagedCenters.filter((center) => !managedIds.has(center.id))

  return [...managedCenters, ...missingFallbackCenters].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder
    return a.name.localeCompare(b.name)
  })
}

function buildMapUrl(address: string) {
  return address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : undefined
}

export function toLocation(center: ManagedCenter): Location {
  const type: LocationType =
    center.kind === 'group' ? 'Group' : center.isActive ? 'Center' : 'ComingSoon'

  return {
    id: center.id,
    name: center.name,
    city: center.city,
    province: center.state,
    type,
    address: center.address || undefined,
    mapUrl: buildMapUrl(center.address),
    phone: center.phone || undefined,
    email: center.email || undefined,
    notes: center.notes,
    schedule: center.schedule,
    leadership: center.leadership,
  }
}

export function useManagedCenters() {
  const [centers, setCenters] = useState<ManagedCenter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      let rows = await fetchCenterRowsFromApi()

      if ((!rows || rows.length === 0) && supabase) {
        const { data, error } = await supabase
          .from('organization_centers')
          .select('id,slug,kind,name,city,state,address,phone,email,schedule,notes,leadership_head,leadership_assistant,is_active,display_order')
          .order('display_order', { ascending: true })
          .order('name', { ascending: true })

        if (!error && data && data.length > 0) {
          rows = data as CenterRow[]
        }
      }

      if (cancelled) return
      if (rows && rows.length > 0) {
        setCenters(mergeWithFallbackCenters(rows.map(mapRow)))
      } else {
        setCenters(fallbackManagedCenters)
      }
      setIsLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const activeCenters = useMemo(() => centers.filter((center) => center.isActive), [centers])

  return { centers, activeCenters, isLoading }
}
