import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { useLearningAuth } from '../context/LearningAuthContext'
import { assertSupabaseConfigured, supabase } from '../lib/supabaseClient'

function useQueryNext() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  return params.get('next')
}

export default function LearningSignIn() {
  const location = useLocation()
  const isAdminEntry = location.pathname.startsWith('/admin')
  const next = useQueryNext()
  const navigate = useNavigate()
  const { signIn, signInWithGoogle, isAuthLoading, session, isAdmin, isInstructor, role, signOut } = useLearningAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false)

  // Google reports a refused or cancelled sign-in by sending the browser back here
  // with the reason in the URL. Without this the page would just look unresponsive.
  const oauthError = (() => {
    const fromHash = new URLSearchParams(location.hash.replace(/^#/, ''))
    const fromQuery = new URLSearchParams(location.search)
    const description = fromHash.get('error_description') || fromQuery.get('error_description')
    const code = fromHash.get('error') || fromQuery.get('error')
    if (!description && !code) return null
    return description ? description.replace(/\+/g, ' ') : `Sign-in failed (${code}).`
  })()

  // Signed in, but the account carries no admin permission. Saying so beats
  // silently leaving the login form on screen.
  const isSignedInWithoutAccess =
    !isAuthLoading && Boolean(session) && isAdminEntry && role !== null && !isAdmin && !isInstructor

  const defaultNext = isAdminEntry ? '/admin/dashboard' : '/activities'
  const resolvedNext = next ?? defaultNext

  useEffect(() => {
    if (isAuthLoading || !session) return

    if (isAdminEntry) {
      if (isAdmin || isInstructor) {
        navigate(resolvedNext, { replace: true })
      }
      return
    }

    navigate(resolvedNext, { replace: true })
  }, [isAdmin, isAdminEntry, isAuthLoading, isInstructor, navigate, resolvedNext, session])

  usePageMeta({
    title: isAdminEntry ? 'Admin Login | World Messianic' : 'Sign In | Events',
    description: isAdminEntry
      ? 'Sign in to manage public events, downloads, donations, centers, and admin users.'
      : 'Sign in only if the church has already created your event-management access.',
  })

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">
            {isAdminEntry ? 'Website Admin' : 'Authorized Access'}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">
            {isAdminEntry ? 'Admin Login' : 'Sign In'}
          </h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed">
            {isAdminEntry
              ? 'Manage public events, downloads, donations, centers, and admin users.'
              : 'Sign in only if an admin has already created your event-management access.'}
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-xl mx-auto px-6 space-y-6">
          {error || oauthError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error || oauthError}</div>
          ) : null}

          {isSignedInWithoutAccess ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-amber-900 space-y-3">
              <p className="font-semibold">You are signed in, but this account has no admin permission.</p>
              <p className="text-sm">
                Signing in worked. The address you used is not on the list of emails allowed to administer the
                site, so there is nothing to open. Ask a super admin to add it under Admin &rsaquo; Users, or sign
                in with a different account.
              </p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await signOut()
                  } catch {
                    // Nothing useful to recover here; the form below still works.
                  }
                }}
                className="text-sm font-semibold underline transition-colors hover:text-amber-950"
              >
                Sign out and use another account
              </button>
            </div>
          ) : null}
          {message ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-emerald-900">
              {message}
            </div>
          ) : null}

          <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="space-y-5">
              <button
                type="button"
                disabled={isGoogleRedirecting}
                onClick={async () => {
                  setError(null)
                  setMessage(null)
                  setIsGoogleRedirecting(true)
                  try {
                    await signInWithGoogle(`${window.location.origin}${resolvedNext}`)
                    // On success the browser leaves this page for Google, so there is
                    // nothing to reset here.
                  } catch (e) {
                    setError(e instanceof Error ? e.message : 'Could not start Google sign-in.')
                    setIsGoogleRedirecting(false)
                  }
                }}
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[rgba(15,23,42,0.14)] bg-white px-6 text-sm font-semibold text-deep-slate transition hover:bg-slate-50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg aria-hidden="true" viewBox="0 0 18 18" className="h-5 w-5 shrink-0">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62Z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86a5.36 5.36 0 0 1-5.03-3.71H1.96v2.33A9 9 0 0 0 9 18Z"
                  />
                  <path fill="#FBBC05" d="M3.97 10.71a5.41 5.41 0 0 1 0-3.42V4.96H1.96a9 9 0 0 0 0 8.08l2.01-2.33Z" />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.59A8.98 8.98 0 0 0 1.96 4.96l2.01 2.33A5.36 5.36 0 0 1 9 3.58Z"
                  />
                </svg>
                {isGoogleRedirecting ? 'Opening Google...' : 'Continue with Google'}
              </button>

              <div className="flex items-center gap-4" aria-hidden="true">
                <span className="h-px flex-1 bg-[rgba(15,23,42,0.1)]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">or</span>
                <span className="h-px flex-1 bg-[rgba(15,23,42,0.1)]" />
              </div>

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
                <ButtonLink to={isAdminEntry ? '/' : '/activities'} variant="ghost">
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
                      await signIn(email.trim(), password)
                      navigate(resolvedNext, { replace: true })
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

              <div className="pt-1 text-right">
                <button
                  type="button"
                  disabled={isSendingReset}
                  onClick={async () => {
                    setError(null)
                    setMessage(null)
                    setIsSendingReset(true)

                    try {
                      if (!supabase) {
                        throw new Error('Learning app is not configured.')
                      }

                      const targetEmail = email.trim().toLowerCase()
                      if (!targetEmail) {
                        throw new Error('Enter your email first, then use “Forgot password?”.')
                      }

                      const redirectTo = `${window.location.origin}/reset-password`
                      const { error: resetError } = await assertSupabaseConfigured().auth.resetPasswordForEmail(targetEmail, {
                        redirectTo,
                      })
                      if (resetError) throw resetError

                      setMessage('Password reset email sent. Check your inbox and open the link to choose a new password.')
                    } catch (e) {
                      setError(e instanceof Error ? e.message : 'Could not send password reset email.')
                    } finally {
                      setIsSendingReset(false)
                    }
                  }}
                  className="text-sm font-semibold text-sage-700 underline transition-colors hover:text-sage-800 disabled:opacity-70"
                >
                  {isSendingReset ? 'Sending...' : 'Forgot password?'}
                </button>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 text-center">
            {isAdminEntry
              ? 'Admin accounts are created by headquarters in the admin system.'
              : 'Learning access is created by the church administration when needed.'}
          </p>
        </div>
      </Section>
    </div>
  )
}
