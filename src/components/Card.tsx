type CardProps = {
  title?: React.ReactNode
  children: React.ReactNode
  eyebrow?: string
  cta?: React.ReactNode
  className?: string
}

function classNames(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function Card({ title, children, eyebrow, cta, className }: CardProps) {
  return (
    <div
      data-ui="content-card"
      className={classNames(
        'paper-panel ornament-ring rounded-[30px] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-46px_rgba(31,41,51,0.45)]',
        className,
      )}
    >
      {eyebrow && <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-sage-600">{eyebrow}</p>}
      {title && <h3 className="mt-3 text-2xl font-serif text-slate-900">{title}</h3>}
      <div className="mt-4 text-sm leading-7 text-slate-600">{children}</div>
      {cta && <div className="mt-6">{cta}</div>}
    </div>
  )
}
