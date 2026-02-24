import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { useTranslation } from '../context/TranslationContext'

export function Footer() {
  const { t, language } = useTranslation()
  const social = {
    facebook: 'https://www.facebook.com/mirokucanada',
    instagram: 'https://www.instagram.com/mirokucanada/',
    youtube: 'https://www.youtube.com/channel/UCcscIAAb59vkRXysCnS9Njw',
  }

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.nav.about },
    { to: '/johrei', label: t.nav.aboutJohrei },
    { to: '/meishu-sama', label: t.nav.meishuSama },
    { to: '/locations', label: t.nav.locations },
    { to: '/contact', label: t.nav.contact },
    // donate handled separately to support external Stripe link
  ]

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.5fr_0.5fr_1fr]">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt={t.brand} className="h-8 w-auto" />
              <span className="text-sm font-bold tracking-tight text-deep-slate uppercase">{t.brand}</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              {t.tagline}
            </p>
            <div className="space-y-1 text-xs text-slate-400">
              <p>Registered Canadian charity</p>
              <p>86271 146 RR0001</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Navigation</h4>
            <nav className="flex flex-col gap-3">
              {links.map(link => (
                <Link key={link.to} to={link.to} className="text-sm text-slate-600 hover:text-sage-600 transition-colors">
                  {link.label}
                </Link>
              ))}
              <Link to="/donate" className="text-sm text-slate-600 hover:text-sage-600 transition-colors">{t.nav.donate}</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-slate-600">
              <a href={`mailto:${site.email}`} className="hover:text-sage-600 transition-colors">{site.email}</a>
              <a href={`tel:${site.phone}`} className="hover:text-sage-600 transition-colors">{site.phone}</a>
            </div>
          </div>

          {/* Mission */}
          <div className="space-y-6 lg:text-right">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Our Mission</h4>
            <p className="text-sm text-slate-500 italic font-serif">
              "{language === 'en'
                ? 'To help others dedicate themselves to the construction of Paradise on Earth.'
                : 'Aider les personnes à s’engager dans la construction du Paradis Terrestre.'}"
            </p>
            <div className="pt-4 flex lg:justify-end gap-6 text-xs text-slate-400 font-bold tracking-widest uppercase">
              <Link to="/contact" className="hover:text-deep-slate tracking-[0.3em]">Visit Us</Link>
              <Link to="/donate" className="hover:text-deep-slate tracking-[0.3em]">Support</Link>
            </div>
          </div>
        </div>

        {/* Social icons */}
        <div className="mt-10 flex gap-4 items-center">
          <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label={language === 'en' ? 'Follow us on Facebook' : 'Suivez-nous sur Facebook'} className="text-slate-400 hover:text-deep-slate transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 2 6.48 2 12.07 2 17.1 5.66 21.19 10.44 21.98v-7.02H8.07v-2.89h2.37V9.3c0-2.34 1.39-3.63 3.52-3.63 1.02 0 2.09.18 2.09.18v2.31h-1.19c-1.17 0-1.53.73-1.53 1.48v1.77h2.6l-.42 2.89h-2.18V22C18.34 21.19 22 17.1 22 12.07z"/></svg>
          </a>

          <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label={language === 'en' ? 'Follow us on Instagram' : 'Suivez-nous sur Instagram'} className="text-slate-400 hover:text-deep-slate transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-3a1 1 0 100 2 1 1 0 000-2z"/></svg>
          </a>

          <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label={language === 'en' ? 'Follow us on YouTube' : 'Suivez-nous sur YouTube'} className="text-slate-400 hover:text-deep-slate transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 15l5.19-3L10 9v6zm11.54-5.23c-.2-1.45-..."/></svg>
          </a>
        </div>
        <div className="mt-24 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
          <p>© {new Date().getFullYear()} {t.brand}</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-deep-slate">Privacy</Link>
            <Link to="/terms" className="hover:text-deep-slate">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
