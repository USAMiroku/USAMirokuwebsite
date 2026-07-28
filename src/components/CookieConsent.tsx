import { useState } from 'react'
import { useTranslation } from '../context/TranslationContext'

const STORAGE_KEY = 'miroku_cookie_consent'

export function CookieConsent() {
  const { language } = useTranslation()
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return !localStorage.getItem(STORAGE_KEY)
  })

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  const text = language === 'en'
    ? 'We use cookies to improve your experience. By continuing to use this site, you agree to our use of cookies.'
    : 'Nous utilisons des cookies pour améliorer votre expérience. En continuant à utiliser ce site, vous acceptez notre utilisation des cookies.'
  const mobileText = language === 'en'
    ? 'We use cookies to improve your experience.'
    : 'Nous utilisons des cookies pour améliorer votre expérience.'

  const learn = language === 'en' ? 'Learn More' : 'En savoir plus'
  const acceptLabel = language === 'en' ? 'Accept' : 'Accepter'

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 flex flex-col gap-3 rounded-xl bg-white p-3 shadow-lg sm:bottom-6 sm:left-6 sm:right-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
      <p className="text-xs leading-5 text-slate-700 sm:hidden">{mobileText}</p>
      <p className="hidden text-sm text-slate-700 sm:block">{text}</p>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <a href="/privacy" className="text-sm text-sage-600 hover:underline">{learn}</a>
        <button onClick={accept} className="rounded-full bg-deep-slate text-white px-4 py-2">{acceptLabel}</button>
      </div>
    </div>
  )
}
