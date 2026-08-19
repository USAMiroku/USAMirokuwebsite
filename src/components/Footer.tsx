import { Link, useLocation as useRouteLocation } from 'react-router-dom'
import { useTranslation } from '../context/TranslationContext'
import { resolveDonateHref, siteConfig } from '../config/siteConfig'
import { grantContent, nonprofitStatement } from '../data/grantContent'

function FooterDonateLink({ className }: { className: string }) {
  const { t } = useTranslation()
  const donateHref = resolveDonateHref()

  if (donateHref.startsWith('/')) {
    return (
      <Link to={donateHref} className={className}>
        {t.nav.donate}
      </Link>
    )
  }

  return (
    <a href={donateHref} target="_blank" rel="noreferrer" className={className}>
      {t.nav.donate}
    </a>
  )
}

function PublicFooter() {
  const { t, language } = useTranslation()

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.nav.about },
    { to: '/johrei', label: t.nav.aboutJohrei },
    { to: '/activities', label: t.nav.activities },
    { to: '/community-programs', label: grantContent[language].programsNav },
    { to: '/books', label: t.nav.books },
    { to: '/locations', label: t.nav.locations },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <footer className="site-footer border-t border-[rgba(15,23,42,0.06)] bg-[#f8f4eb] px-4 py-18 md:px-6">
      <div className="mx-auto max-w-7xl rounded-[30px] bg-[linear-gradient(135deg,#8fa08d_0%,#97a78f_48%,#8b9984_100%)] px-8 py-8 text-white shadow-[0_34px_80px_-52px_rgba(49,67,67,0.45)]">
        <div className="grid gap-5 lg:grid-cols-[1.3fr_0.8fr_0.95fr]">
          <div className="rounded-[24px] border border-white/14 bg-white/5 px-6 py-6">
            <p className="text-[1.35rem] font-bold leading-snug tracking-tight">Miroku Association USA</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/78">World Messianic Church of America</p>
            <p className="mt-4 max-w-sm text-base leading-8 text-white/76">{t.tagline}</p>
            <div className="mt-6 space-y-1 text-sm leading-7 text-white/78">
              <p>{siteConfig.hq.address}</p>
              <p>{siteConfig.hq.phone}</p>
              <p>{siteConfig.hq.email}</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/14 bg-white/5 px-6 py-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72">Navigation</p>
            <nav className="mt-4 flex flex-col gap-3">
              {links.map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-white/82 transition-colors hover:text-white">
                  {link.label}
                </Link>
              ))}
              <FooterDonateLink className="text-sm text-white/82 transition-colors hover:text-white" />
            </nav>
          </div>

          <div className="rounded-[24px] border border-white/14 bg-white/5 px-6 py-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72">Contact</p>
            <div className="mt-4 space-y-3 text-sm text-white/82">
              <p>
                Website:{' '}
                <a href="https://www.worldmessianic.org" className="underline-offset-2 hover:underline">
                  worldmessianic.org
                </a>
              </p>
              <p>
                Contact email:{' '}
                <a href={`mailto:${siteConfig.hq.email}`} className="underline-offset-2 hover:underline">
                  {siteConfig.hq.email}
                </a>
              </p>
              <p>
                Phone number:{' '}
                <a href={`tel:${siteConfig.hq.phone}`} className="underline-offset-2 hover:underline">
                  {siteConfig.hq.phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/12 pt-6 text-[11px] uppercase tracking-[0.18em] text-white/62 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Miroku Association USA</p>
          <p>World Messianic Church of America</p>
        </div>
        <p className="mt-5 border-t border-white/12 pt-5 text-xs leading-6 text-white/72">{nonprofitStatement[language]}</p>
      </div>
    </footer>
  )
}

function LearningFooter() {
  const { t, language } = useTranslation()

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/activities', label: t.nav.activities },
    { to: '/community-programs', label: grantContent[language].programsNav },
    { to: '/books', label: t.nav.books },
    { to: '/about', label: t.nav.about },
    { to: '/johrei', label: t.nav.aboutJohrei },
    { to: '/meishu-sama', label: t.nav.meishuSama },
    { to: '/locations', label: t.nav.locations },
    { to: '/contact', label: t.nav.contact },
    { to: '/faq', label: 'FAQ' },
  ]

  const missionByLanguage = {
    en: 'To help others dedicate themselves to the construction of Paradise on Earth.',
    es: 'Ayudar a otros a dedicarse a la construccion del Paraiso en la Tierra.',
    pt: 'Ajudar outras pessoas a se dedicarem a construcao do Paraiso Terrestre.',
  } as const

  const socialLinks = [
    { id: 'facebook', href: siteConfig.social.facebook, label: 'Facebook' },
    { id: 'instagram', href: siteConfig.social.instagram, label: 'Instagram' },
    { id: 'youtube', href: siteConfig.social.youtube, label: 'YouTube' },
  ].filter((item) => item.href)

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.5fr_0.6fr_1fr]">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt={siteConfig.organizationName} className="h-8 w-auto" />
              <span className="text-sm font-bold tracking-tight text-deep-slate uppercase">{siteConfig.shortName}</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{t.tagline}</p>
            <div className="space-y-1 text-xs text-slate-400">
              <p>{siteConfig.hq.address}</p>
              <p>{siteConfig.hq.phone}</p>
              <p>{siteConfig.hq.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Navigation</h4>
            <nav className="flex flex-col gap-3">
              {links.map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-slate-600 hover:text-sage-600 transition-colors">
                  {link.label}
                </Link>
              ))}
              <FooterDonateLink className="text-sm text-slate-600 hover:text-sage-600 transition-colors" />
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-slate-600">
              <a href={`mailto:${siteConfig.hq.email}`} className="hover:text-sage-600 transition-colors">
                {siteConfig.hq.email}
              </a>
              <a href={`tel:${siteConfig.hq.phone}`} className="hover:text-sage-600 transition-colors">
                {siteConfig.hq.phone}
              </a>
            </div>
          </div>

          <div className="space-y-6 lg:text-right">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Our Mission</h4>
            <p className="text-sm text-slate-500 italic font-serif">"{missionByLanguage[language]}"</p>
            <div className="pt-4 flex lg:justify-end gap-6 text-xs text-slate-400 font-bold tracking-widest uppercase">
              <Link to="/contact" className="hover:text-deep-slate tracking-[0.3em]">
                Visit Us
              </Link>
              <FooterDonateLink className="hover:text-deep-slate tracking-[0.3em]" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 items-center">
          {socialLinks.length > 0 ? (
            socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 hover:text-deep-slate transition-colors"
              >
                {social.label}
              </a>
            ))
          ) : (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Social links coming soon</span>
          )}
        </div>

        <div className="mt-24 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
          <p>
            © {new Date().getFullYear()} {siteConfig.organizationName}
          </p>
          <div className="flex gap-8">
            <Link to="/faq" className="hover:text-deep-slate">
              FAQ
            </Link>
            <Link to="/contact" className="hover:text-deep-slate">
              Contact
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs font-normal normal-case leading-6 text-slate-500">{nonprofitStatement[language]}</p>
      </div>
    </footer>
  )
}

export function Footer() {
  const routeLocation = useRouteLocation()
  const isLearningRoute =
    routeLocation.pathname.startsWith('/learn') ||
    routeLocation.pathname.startsWith('/admin') ||
    routeLocation.pathname.startsWith('/reset-password')

  return isLearningRoute ? <LearningFooter /> : <PublicFooter />
}
