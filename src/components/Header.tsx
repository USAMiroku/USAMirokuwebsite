import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation as useRouteLocation } from 'react-router-dom'
import { useTranslation } from '../context/TranslationContext'
import { resolveDonateHref, siteConfig } from '../config/siteConfig'
import { LanguageToggle } from './LanguageToggle'

function DonateButton({ className, onClick }: { className: string; onClick?: () => void }) {
  const { t } = useTranslation()
  const donateHref = resolveDonateHref()

  if (donateHref.startsWith('/')) {
    return (
      <Link to={donateHref} onClick={onClick} className={className}>
        {t.actions.donate}
      </Link>
    )
  }

  return (
    <a href={donateHref} target="_blank" rel="noreferrer" onClick={onClick} className={className}>
      {t.actions.donate}
    </a>
  )
}

export function Header() {
  const { t } = useTranslation()
  const routeLocation = useRouteLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [routeLocation.pathname])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.nav.about },
    { to: '/johrei', label: t.nav.aboutJohrei },
    { to: '/meishu-sama', label: t.nav.meishuSama },
    { to: '/locations', label: t.nav.locations },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 border-b border-[rgba(184,134,11,0.28)] transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_16px_42px_-34px_rgba(45,55,72,0.55)]'
            : 'bg-white/85 backdrop-blur-lg shadow-[0_12px_36px_-34px_rgba(45,55,72,0.5)]'
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-12">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3">
            <img src="/logo.png" alt={siteConfig.organizationName} className="h-11 w-auto" />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-deep-slate uppercase">{siteConfig.shortName}</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `whitespace-nowrap text-[11px] font-bold tracking-[0.15em] uppercase transition-colors ${
                    isActive ? 'text-sage-600' : 'text-deep-slate/90 hover:text-sage-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <LanguageToggle className="hidden sm:inline-flex bg-white/75 shadow-sm" />

            <DonateButton
              onClick={closeMobileMenu}
              className="inline-flex h-9 items-center justify-center rounded-full bg-divine-gold px-4 text-[10px] font-semibold tracking-[0.14em] uppercase text-white transition-all hover:bg-[#9e730a] md:h-10 md:px-5"
            />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-deep-slate"
              aria-label="Toggle menu"
            >
              <div className="w-6 space-y-1.5">
                <div className={`h-[2px] w-6 bg-current transition-all ${isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                <div className={`h-[2px] w-6 bg-current transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`h-[2px] w-6 bg-current transition-all ${isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-white px-8 py-24 transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-8 text-center pt-12">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMobileMenu}
              className="whitespace-nowrap text-3xl font-serif italic text-deep-slate hover:text-sage-600 transition-all"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-12 pt-12 border-t border-slate-100 flex flex-col items-center gap-8">
            <DonateButton
              onClick={closeMobileMenu}
              className="w-full max-w-xs rounded-full bg-amber-500 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase text-white text-center"
            />
            <LanguageToggle />
          </div>
        </nav>
      </div>
    </>
  )
}
