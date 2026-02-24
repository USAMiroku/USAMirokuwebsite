export type Language = 'en' | 'fr'

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
  title: Record<Language, string>
  summary: Record<Language, string>
  content: Record<Language, string>
}

export type Testimonial = {
  id: string
  person: string
  summary: Record<Language, string>
  detail: Record<Language, string>
  externalUrl: string
}

export type EventItem = {
  id: string
  title: Record<Language, string>
  date?: string
  location?: string
  description: Record<Language, string>
}
