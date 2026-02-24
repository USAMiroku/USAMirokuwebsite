import { useEffect } from 'react'

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

export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    document.title = title
    setMetaByName('description', description)
    setMetaByProperty('og:title', title)
    setMetaByProperty('og:description', description)
    setMetaByName('twitter:title', title)
    setMetaByName('twitter:description', description)
  }, [title, description])
}
