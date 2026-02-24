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

  const learn = language === 'en' ? 'Learn More' : 'En savoir plus'
  const acceptLabel = language === 'en' ? 'Accept' : 'Accepter'

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 bg-white rounded-xl p-4 shadow-lg flex items-center justify-between gap-4">
      <p className="text-sm text-slate-700">{text}</p>
      <div className="flex items-center gap-3">
        <a href="/privacy" className="text-sm text-sage-600 hover:underline">{learn}</a>
        <button onClick={accept} className="rounded-full bg-deep-slate text-white px-4 py-2">{acceptLabel}</button>
      </div>
    </div>
  )
}
