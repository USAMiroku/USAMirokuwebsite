import { siteConfig, siteUrl } from '../config/siteConfig'

export const site = {
  url: siteUrl,
  email: siteConfig.hq.email,
  phone: siteConfig.hq.phone,
  paypalUrl: siteConfig.donate.externalFallbackUrl,
}
