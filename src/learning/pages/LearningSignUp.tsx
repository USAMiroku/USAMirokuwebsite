import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { useLearningAuth } from '../context/LearningAuthContext'

export default function LearningSignUp() {
  const navigate = useNavigate()
  const { signUp } = useLearningAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  usePageMeta({
    title: 'Create Account | Learn',
    description: 'Create an account to register for learning activities.',
  })

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Student Access</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">Create Account</h1>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-xl mx-auto px-6 space-y-6">
          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div> : null}
          {message ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-emerald-900">
              {message}
            </div>
          ) : null}

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

              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Confirm Password</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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
                    setMessage(null)

                    try {
                      if (password !== confirm) {
                        throw new Error('Passwords do not match.')
                      }
                      await signUp(email.trim(), password)
                      setMessage('Account created. Please check your email to confirm, if required, then sign in.')
                      navigate('/learn/sign-in')
                    } catch (e) {
                      setError(e instanceof Error ? e.message : 'Could not create account.')
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-divine-gold px-10 text-[10px] font-semibold tracking-[0.14em] uppercase text-white transition hover:bg-[#9e730a] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 text-center">
            Already have an account?{' '}
            <Link to="/learn/sign-in" className="text-sage-700 hover:text-sage-800 font-semibold underline">
              Sign in
            </Link>
          </p>
        </div>
      </Section>
    </div>
  )
}

