import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'wmc_welcome_overlay_closed'
const FADE_DURATION_MS = 800

export function WelcomeOverlay() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.sessionStorage.getItem(STORAGE_KEY)
  })
  const [closing, setClosing] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!visible) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [visible])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const closeOverlay = () => {
    if (closing) return

    setClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      window.sessionStorage.setItem(STORAGE_KEY, '1')
      setVisible(false)
    }, FADE_DURATION_MS)
  }

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[220] transition-opacity duration-[800ms] ${closing ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to a Path of Light"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/johrei-group.png')" }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <button
        type="button"
        onClick={closeOverlay}
        aria-label="Close welcome overlay"
        className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-black/25 text-xl leading-none text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        ×
      </button>

      <div className="relative z-10 flex h-full items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[800px] rounded-3xl border border-[rgba(184,134,11,0.45)] bg-[rgba(42,27,71,0.68)] px-6 py-10 text-center text-white shadow-[0_28px_70px_-28px_rgba(0,0,0,0.65)] backdrop-blur-[1px] sm:px-10">
          <h1 className="font-playfair text-4xl leading-tight sm:text-6xl">Welcome to a Path of Light</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
            Whether you&apos;ve arrived here seeking healing, peace of mind, or a deeper connection to the world around you,
            we are glad you found us.
            <br />
            <br />
            In a world that often feels chaotic, the teachings of Meishu-sama offer a grounded, practical roadmap to a life
            of harmony. Our community is dedicated to the vision of a &quot;Paradise on Earth&quot;, a world defined not by what we
            lack, but by the abundance of health, beauty, and sincere service to one another.
            <br />
            <br />
            We invite you to explore, ask questions, and discover how these timeless principles can illuminate your own
            journey.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={closeOverlay}
              className="inline-flex h-12 items-center justify-center rounded-full border border-[rgba(184,134,11,0.7)] bg-divine-gold px-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#9e730a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Enter the Path
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
