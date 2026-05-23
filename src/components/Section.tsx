import React from 'react'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  containerClassName?: string
  py?: string
}

export function Section({ children, className = '', id, containerClassName = '', py = 'py-14 md:py-24' }: SectionProps) {
  return (
    <section id={id} className={`${py} ${className}`}>
      <div className={`mx-auto max-w-6xl px-4 md:px-6 ${containerClassName}`}>
        {children}
      </div>
    </section>
  )
}
