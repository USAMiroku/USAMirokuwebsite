import { useEffect, useState } from 'react'
import type { Language } from '../../types'

const copyByLanguage = {
  en: { view: 'View poster', close: 'Close', openFullSize: 'Open full size' },
  es: { view: 'Ver póster', close: 'Cerrar', openFullSize: 'Abrir en tamaño completo' },
  pt: { view: 'Ver cartaz', close: 'Fechar', openFullSize: 'Abrir em tamanho real' },
} as const

type PosterImageProps = {
  src: string
  alt: string
  language: Language
  className?: string
  imageClassName?: string
}

/** Shows an event poster uncropped; clicking it opens a full-screen view. */
export function PosterImage({ src, alt, language, className = '', imageClassName = '' }: PosterImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const copy = copyByLanguage[language]

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`${copy.view}: ${alt}`}
        className={`group relative block cursor-zoom-in overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 ${className}`}
      >
        <img src={src} alt={alt} loading="lazy" className={imageClassName} />
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition group-hover:bg-black/80">
          {copy.view}
        </span>
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/85 p-4"
        >
          <img
            src={src}
            alt={alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
          <div className="flex flex-wrap justify-center gap-3" onClick={(event) => event.stopPropagation()}>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-full border border-white/40 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-white/10"
            >
              {copy.openFullSize}
            </a>
            <button
              type="button"
              autoFocus
              onClick={() => setIsOpen(false)}
              className="inline-flex h-10 items-center rounded-full bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-deep-slate hover:bg-white/90"
            >
              {copy.close}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
