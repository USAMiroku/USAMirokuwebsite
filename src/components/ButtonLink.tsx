import { Link } from 'react-router-dom'

interface ButtonLinkProps {
  to: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'outline'
  className?: string
}

export function ButtonLink({ to, children, variant = 'primary', className = '' }: ButtonLinkProps) {
  const styles = {
    primary:
      'bg-deep-slate text-white shadow-[0_18px_36px_-24px_rgba(31,41,51,0.8)] hover:-translate-y-0.5 hover:bg-[#14202a] hover:shadow-[0_24px_42px_-24px_rgba(31,41,51,0.9)]',
    secondary:
      'bg-sage-mist text-deep-slate shadow-[0_16px_34px_-26px_rgba(141,107,38,0.45)] hover:-translate-y-0.5 hover:bg-[#e9dcc4]',
    ghost:
      'text-deep-slate hover:-translate-y-0.5 hover:text-sage-600 hover:bg-white/70',
    outline:
      'border border-[rgba(141,107,38,0.36)] bg-white/45 text-deep-slate hover:-translate-y-0.5 hover:bg-sage-mist',
    accent:
      'bg-divine-gold text-white shadow-[0_18px_36px_-24px_rgba(173,123,34,0.72)] hover:-translate-y-0.5 hover:bg-[#946615] hover:shadow-[0_24px_42px_-24px_rgba(173,123,34,0.85)] border border-transparent',
  }

  const base =
    'inline-flex h-11 items-center justify-center rounded-full px-6 text-[10px] font-semibold tracking-[0.18em] uppercase transition-all duration-300'

  return (
    <Link to={to} data-ui="button-link" className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  )
}
