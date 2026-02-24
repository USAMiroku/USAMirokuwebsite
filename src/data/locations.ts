import { siteConfig } from '../config/siteConfig'
import { type Location } from '../types'

function buildMapUrl(address: string) {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`
}

export const locations: Location[] = siteConfig.centers.map((center) => ({
  id: center.id,
  name: center.name,
  city: center.city,
  province: center.state,
  type: 'Center',
  address: center.address,
  mapUrl: buildMapUrl(center.address),
  phone: center.phone,
  email: center.email,
  schedule: center.schedule,
}))
