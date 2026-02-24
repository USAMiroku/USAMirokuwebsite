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
      className={classNames(
        'rounded-3xl border border-[rgba(184,134,11,0.2)] bg-white p-6 shadow-[0_14px_34px_-30px_rgba(45,55,72,0.45)] transition-transform duration-200 hover:-translate-y-1',
        className,
      )}
    >
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{eyebrow}</p>}
      {title && <h3 className="mt-2 text-lg font-semibold text-slate-900">{title}</h3>}
      <div className="mt-3 text-sm text-slate-600">{children}</div>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  )
}
