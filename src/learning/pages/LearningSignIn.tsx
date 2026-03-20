import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { useLearningAuth } from '../context/LearningAuthContext'

function useQueryNext() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  return params.get('next') ?? '/learn/account'
}

export default function LearningSignIn() {
  const next = useQueryNext()
  const navigate = useNavigate()
  const { signIn } = useLearningAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  usePageMeta({
    title: 'Sign In | Learn',
    description: 'Sign in to register and access enrolled learning materials.',
  })

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Student Access</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">Sign In</h1>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-xl mx-auto px-6 space-y-6">
          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div> : null}

          <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="space-y-5">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                />
              </label>

              <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
                <ButtonLink to="/learn" variant="ghost">
                  Back
                </ButtonLink>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={async () => {
                    setIsSubmitting(true)
                    setError(null)
                    try {
                      await signIn(email.trim(), password)
                      navigate(next, { replace: true })
                    } catch (e) {
                      setError(e instanceof Error ? e.message : 'Could not sign in.')
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-deep-slate px-10 text-[10px] font-semibold tracking-[0.14em] uppercase text-white transition hover:bg-slate-700 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 text-center">
            New here?{' '}
            <Link to="/learn/sign-up" className="text-sage-700 hover:text-sage-800 font-semibold underline">
              Create an account
            </Link>
          </p>
        </div>
      </Section>
    </div>
  )
}

