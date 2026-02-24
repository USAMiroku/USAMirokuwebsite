export type Language = 'en' | 'es' | 'pt'

export type LocationType = 'Center' | 'Group' | 'ComingSoon'

export type Location = {
  id: string
  name: string
  city: string
  province: string
  type: LocationType
  address?: string
  mapUrl?: string
  phone?: string
  email?: string
  notes?: string
  schedule?: string
}

export type ResourceCategory =
  | 'Johrei Basics'
  | 'Gratitude & Dedication'
  | 'Preparing for a Visit'
  | 'Faith & Daily Practice'

export type ResourceItem = {
  id: string
  category: ResourceCategory
  title: Record<string, string>
  summary: Record<string, string>
  content: Record<string, string>
}

export type Testimonial = {
  id: string
  person: string
  summary: Record<string, string>
  detail: Record<string, string>
  externalUrl: string
}

export type EventItem = {
  id: string
  title: Record<string, string>
  date?: string
  location?: string
  description: Record<string, string>
}
