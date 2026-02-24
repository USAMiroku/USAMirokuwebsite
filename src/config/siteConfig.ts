export type CenterConfig = {
  id: string
  name: string
  city: string
  state: string
  address: string
  phone: string
  email: string
  schedule?: string
}

export const siteUrl = (import.meta.env.VITE_SITE_URL ?? 'https://usa-mirokuwebsite.vercel.app').trim()

export const siteConfig = {
  organizationName: 'World Messianic Church of America / Miroku Association USA',
  shortName: 'Miroku Association USA',
  seoDescription:
    'Explore Johrei, Meishu-sama teachings, community life, and gratitude offerings with the World Messianic Church of America / Miroku Association USA.',
  hq: {
    address: '47-10 32nd Place, Suite 207, Long Island City, NY 11101',
    phone: '+1 (305) 308-8830',
    email: 'info@miroku.us',
  },
  centers: [
    {
      id: 'new-york-center',
      name: 'New York Center',
      city: 'Long Island City',
      state: 'New York',
      address: '47-10 32nd Place, Suite 207, Long Island City, NY 11101',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
    {
      id: 'miami-center',
      name: 'Miami Center',
      city: 'Miami',
      state: 'Florida',
      address: '14180 SW 88th Street, Suite 201, Miami, FL 33186',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
    {
      id: 'orlando-center',
      name: 'Orlando Center',
      city: 'Orlando',
      state: 'Florida',
      address: '9401 S Orange Blossom Trail, Suite 5, Orlando, FL 32837',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
    {
      id: 'los-angeles-center',
      name: 'Los Angeles Center',
      city: 'Los Angeles',
      state: 'California',
      address: '2730 W 8th Street, Suite 100, Los Angeles, CA 90005',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
    {
      id: 'boston-center',
      name: 'Boston Center',
      city: 'Boston',
      state: 'Massachusetts',
      address: '230 Congress Street, 5th Floor, Boston, MA 02110',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
  ] as CenterConfig[],
  donate: {
    hasInternalRoute: true,
    internalPath: '/donate',
    externalFallbackUrl: 'https://www.miroku.us/donate',
  },
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
  },
} as const

export function resolveDonateHref() {
  return siteConfig.donate.hasInternalRoute ? siteConfig.donate.internalPath : siteConfig.donate.externalFallbackUrl
}

export function toAbsoluteUrl(pathname: string) {
  const cleanBase = siteUrl.replace(/\/$/, '')
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${cleanBase}${cleanPath}`
}
