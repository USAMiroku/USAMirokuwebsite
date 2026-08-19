export type CenterLeadership = {
  head?: string
  assistant?: string
}

export type CenterConfig = {
  id: string
  name: string
  city: string
  state: string
  address: string
  phone: string
  email: string
  schedule?: string
  leadership?: CenterLeadership
}

export const siteUrl = (import.meta.env.VITE_SITE_URL ?? 'https://www.worldmessianic.org').trim()

export const siteConfig = {
  organizationName: 'Miroku Association USA / World Messianic Church of America',
  shortName: 'Miroku Association USA',
  seoDescription:
    'Miroku Association USA, known through its religious activities as World Messianic Church of America, is a 501(C)(3) public charity serving communities across the United States.',
  hq: {
    address: '47-10 32nd Place, Suite 207, Long Island City, NY 11101',
    phone: '+1 (305) 308-8830',
    email: 'info@miroku.us',
  },
  centers: [
    {
      id: 'national-headquarters',
      name: 'National Headquarters',
      city: 'Long Island City',
      state: 'New York',
      address: '47-10 32nd Place, Suite 207, Long Island City, NY 11101',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
    {
      id: 'boston-johrei-center',
      name: 'Boston Johrei Center',
      city: 'Boston',
      state: 'Massachusetts',
      address: '230 Congress Street, 5th Floor, Boston, MA 02110',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
    {
      id: 'los-angeles-johrei-center',
      name: 'Los Angeles Johrei Center',
      city: 'Los Angeles',
      state: 'California',
      address: '2730 W 8th Street, Suite 100, Los Angeles, CA 90005',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
    {
      id: 'miami-johrei-center',
      name: 'Miami Johrei Center',
      city: 'Miami',
      state: 'Florida',
      address: '14180 SW 88th Street, Suite 201, Miami, FL 33186',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
    {
      id: 'new-york-johrei-center',
      name: 'New York Johrei Center',
      city: 'Long Island City',
      state: 'New York',
      address: '47-10 32nd Place, Suite 207, Long Island City, NY 11101',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
    {
      id: 'orlando-johrei-center',
      name: 'Orlando Johrei Center',
      city: 'Orlando',
      state: 'Florida',
      address: '9401 S Orange Blossom Trail, Suite 5, Orlando, FL 32837',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
    {
      id: 'washington-dc',
      name: 'Washington, DC Group',
      city: 'Washington',
      state: 'DC',
      address: '',
      phone: '+1 (305) 308-8830',
      email: 'info@miroku.us',
      schedule: 'By appointment.',
    },
  ] as CenterConfig[],
  donate: {
    hasInternalRoute: true,
    internalPath: '/donate',
    externalFallbackUrl: 'https://www.miroku.us/donate',
    sangetsuPaymentUrl: 'https://www.usasangetsu.org/payment.html',
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
