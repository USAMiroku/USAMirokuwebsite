import React from 'react'

interface SectionProps {
    children: React.ReactNode
    className?: string
    id?: string
    containerClassName?: string
}

export function Section({ children, className = '', id, containerClassName = '' }: SectionProps) {
    return (
        <section id={id} className={`py-12 md:py-20 ${className}`}>
            <div className={`mx-auto max-w-6xl px-4 md:px-6 ${containerClassName}`}>
                {children}
            </div>
        </section>
    )
}
