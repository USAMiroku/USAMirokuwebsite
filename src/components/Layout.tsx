import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { CookieConsent } from './CookieConsent'

export function Layout() {
  const location = useLocation()
  const isLearningRoute =
    location.pathname.startsWith('/learn') ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/reset-password'

  return (
    <div className={`site-shell min-h-screen bg-white text-slate-900 ${isLearningRoute ? 'learning-site' : 'public-site'}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <Header />
      <CookieConsent />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
