import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { TranslationProvider } from './context/TranslationContext'

const gaId = import.meta.env.VITE_GA4_ID
if (gaId && typeof window !== 'undefined') {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)

  const inline = document.createElement('script')
  inline.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}', { anonymize_ip: true });
  `
  document.head.appendChild(inline)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TranslationProvider>
        <App />
      </TranslationProvider>
    </BrowserRouter>
  </StrictMode>,
)
