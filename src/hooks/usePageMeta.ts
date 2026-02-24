import { useEffect } from 'react'
import { toAbsoluteUrl } from '../config/siteConfig'

type PageMeta = {
  title: string
  description?: string
}

function setMetaByName(name: string, content?: string) {
  if (!content) return
  const tag = document.querySelector(`meta[name="${name}"]`)
  if (tag) {
    tag.setAttribute('content', content)
  }
}

function setMetaByProperty(property: string, content?: string) {
  if (!content) return
  const tag = document.querySelector(`meta[property="${property}"]`)
  if (tag) {
    tag.setAttribute('content', content)
  }
}

function setCanonical(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }

  canonical.setAttribute('href', url)
}

export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    const url = toAbsoluteUrl(window.location.pathname)

    document.title = title
    setCanonical(url)

    setMetaByName('description', description)
    setMetaByProperty('og:title', title)
    setMetaByProperty('og:description', description)
    setMetaByProperty('og:url', url)

    setMetaByName('twitter:title', title)
    setMetaByName('twitter:description', description)
  }, [title, description])
}
