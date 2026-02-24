import { Link } from 'react-router-dom'

interface ButtonLinkProps {
  to: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'outline'
  className?: string
}

export function ButtonLink({ to, children, variant = 'primary', className = '' }: ButtonLinkProps) {
  const styles = {
    primary: 'bg-deep-slate text-white hover:bg-slate-700 shadow-md hover:shadow-lg',
    secondary: 'bg-sage-mist text-deep-slate hover:bg-[#f2e8cf]',
    ghost: 'text-deep-slate hover:text-sage-600 hover:bg-[#f9f6ee]',
    outline: 'border-2 border-[rgba(184,134,11,0.45)] text-deep-slate hover:bg-sage-mist',
    accent: 'bg-divine-gold text-white hover:bg-[#9e730a] border-2 border-transparent'
  }

  const base = 'inline-flex items-center justify-center rounded-full px-6 h-10 text-[10px] font-semibold tracking-[0.14em] uppercase transition-all duration-300'

  return (
    <Link to={to} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  )
}
