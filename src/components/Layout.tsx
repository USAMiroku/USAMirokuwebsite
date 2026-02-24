import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { CookieConsent } from './CookieConsent'
import { WelcomeOverlay } from './WelcomeOverlay'

export function Layout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <Header />
      <WelcomeOverlay />
      <CookieConsent />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
