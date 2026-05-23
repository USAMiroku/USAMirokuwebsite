import { useEffect, useState } from 'react'
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

function PublicHeader() {
  const { t } = useTranslation()
  const routeLocation = useRouteLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [routeLocation.pathname])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [routeLocation.pathname])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.nav.about },
    { to: '/johrei', label: t.nav.aboutJohrei },
    { to: '/activities', label: t.nav.activities },
    { to: '/locations', label: t.nav.locations },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <>
      <header
        className="site-header fixed inset-x-0 top-0 z-50 px-3 pt-4 sm:px-4 md:px-6"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-full border border-[rgba(208,194,168,0.72)] px-3 py-3 shadow-[0_18px_40px_-28px_rgba(34,31,27,0.34)] transition-all duration-300 sm:gap-4 sm:px-4 md:gap-5 md:px-6 ${
            isScrolled ? 'bg-[rgba(247,241,231,0.95)] backdrop-blur-xl' : 'bg-[rgba(247,241,231,0.94)] backdrop-blur-md'
          }`}
        >
          <Link to="/" onClick={closeMobileMenu} className="site-brand flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white sm:h-11 sm:w-11">
              <img src="/logo.png" alt={siteConfig.organizationName} className="h-full w-full rounded-full object-cover" />
            </div>
            <div className="min-w-0 leading-none">
              <span className="block truncate whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.14em] text-deep-slate sm:hidden">
                World Messianic
              </span>
              <span className="hidden truncate whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.1em] text-deep-slate sm:block">
                World Messianic Church of America
              </span>
              <span className="hidden whitespace-nowrap text-[10px] font-semibold tracking-[0.08em] text-slate-500 md:block">
                Miroku Association USA
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    isActive ? 'bg-[#294341] text-white' : 'text-slate-600 hover:bg-white/75 hover:text-deep-slate'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <LanguageToggle className="hidden border border-[rgba(15,23,42,0.08)] bg-white/72 shadow-none sm:inline-flex" />
            <LanguageToggle compact className="inline-flex border border-[rgba(15,23,42,0.08)] bg-white/72 shadow-none sm:hidden" />

            <DonateButton
              onClick={closeMobileMenu}
              className="hidden h-11 items-center justify-center rounded-full bg-divine-gold px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#946615] sm:inline-flex"
            />

            <button
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="rounded-full border border-[rgba(15,23,42,0.08)] bg-white/78 p-3 text-deep-slate lg:hidden"
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
        className={`fixed inset-0 z-40 bg-[#f8f4eb] px-6 py-24 transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="mx-auto flex max-w-lg flex-col gap-4 pt-10">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMobileMenu}
              className="rounded-full border border-[rgba(15,23,42,0.08)] bg-white/82 px-5 py-4 text-lg font-semibold text-deep-slate"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-4 border-t border-[rgba(15,23,42,0.08)] pt-6">
            <DonateButton
              onClick={closeMobileMenu}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-divine-gold px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
            />
            <LanguageToggle className="self-start border border-[rgba(15,23,42,0.08)] bg-white shadow-none" />
          </div>
        </nav>
      </div>
    </>
  )
}

function LearningHeader() {
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
    { to: '/activities', label: t.nav.activities },
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

export function Header() {
  const routeLocation = useRouteLocation()
  const isLearningRoute =
    routeLocation.pathname.startsWith('/learn') ||
    routeLocation.pathname.startsWith('/admin') ||
    routeLocation.pathname.startsWith('/reset-password')

  return isLearningRoute ? <LearningHeader /> : <PublicHeader />
}
