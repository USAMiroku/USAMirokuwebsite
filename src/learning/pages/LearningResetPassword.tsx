import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { useTranslation } from '../../context/TranslationContext'
import { useLearningAuth } from '../context/LearningAuthContext'
import { assertSupabaseConfigured, supabase } from '../lib/supabaseClient'

export default function LearningResetPassword() {
  const navigate = useNavigate()
  const { language } = useTranslation()
  const { session, isAuthLoading, signOut } = useLearningAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const copy = useMemo(
    () =>
      language === 'es'
        ? {
            title: 'Restablecer contraseña',
            intro: 'Use el enlace enviado por correo para elegir una nueva contraseña para su cuenta.',
            password: 'Nueva contraseña',
            confirm: 'Confirmar contraseña',
            back: 'Volver',
            save: 'Guardar nueva contraseña',
            saving: 'Guardando...',
            success: 'Su contraseña fue actualizada. Ahora puede iniciar sesión con la nueva contraseña.',
            missingSession:
              'Este enlace de recuperación no está activo. Solicite un nuevo correo para restablecer la contraseña.',
            configuredError:
              'La aplicación de aprendizaje no está configurada. Agregue las variables de Supabase para habilitar este flujo.',
            mismatch: 'Las contraseñas no coinciden.',
            short: 'Use una contraseña de al menos 8 caracteres.',
            signIn: 'Ir al inicio de sesión',
          }
        : language === 'pt'
          ? {
              title: 'Redefinir senha',
              intro: 'Use o link enviado por e-mail para escolher uma nova senha para sua conta.',
              password: 'Nova senha',
              confirm: 'Confirmar senha',
              back: 'Voltar',
              save: 'Salvar nova senha',
              saving: 'Salvando...',
              success: 'Sua senha foi atualizada. Agora você já pode entrar com a nova senha.',
              missingSession:
                'Este link de recuperação não está ativo. Solicite um novo e-mail para redefinir a senha.',
              configuredError:
                'O aplicativo de aprendizado não está configurado. Adicione as variáveis do Supabase para habilitar este fluxo.',
              mismatch: 'As senhas não coincidem.',
              short: 'Use uma senha com pelo menos 8 caracteres.',
              signIn: 'Ir para entrar',
            }
          : {
              title: 'Reset Password',
              intro: 'Use the link sent by email to choose a new password for your account.',
              password: 'New Password',
              confirm: 'Confirm Password',
              back: 'Back',
              save: 'Save New Password',
              saving: 'Saving...',
              success: 'Your password was updated. You can now sign in with the new password.',
              missingSession: 'This recovery link is no longer active. Request a new password reset email.',
              configuredError:
                'Learning app is not configured. Add Supabase env vars to enable this flow.',
              mismatch: 'Passwords do not match.',
              short: 'Use a password with at least 8 characters.',
              signIn: 'Go to Sign In',
            },
    [language],
  )

  usePageMeta({
    title: `${copy.title} | Learn`,
    description: copy.intro,
  })

  useEffect(() => {
    if (!supabase) {
      setError(copy.configuredError)
      return
    }

    const hash = window.location.hash
    if (!hash.includes('access_token') && !hash.includes('refresh_token')) return

    void assertSupabaseConfigured().auth.getSession()
  }, [copy.configuredError])

  const canReset = Boolean(session)

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">
            Learn Access
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">{copy.title}</h1>
          <p className="text-lg md:text-2xl font-serif italic text-slate-500 leading-relaxed">{copy.intro}</p>
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
            {isAuthLoading ? (
              <p className="text-slate-600">Loading...</p>
            ) : canReset ? (
              <div className="space-y-5">
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.password}</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.confirm}</span>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
                  />
                </label>

                <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
                  <ButtonLink to="/admin/sign-in" variant="ghost">
                    {copy.back}
                  </ButtonLink>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={async () => {
                      setIsSubmitting(true)
                      setError(null)
                      setMessage(null)

                      try {
                        if (!supabase) {
                          throw new Error(copy.configuredError)
                        }
                        if (password.length < 8) {
                          throw new Error(copy.short)
                        }
                        if (password !== confirm) {
                          throw new Error(copy.mismatch)
                        }

                        const { error: updateError } = await assertSupabaseConfigured().auth.updateUser({ password })
                        if (updateError) throw updateError

                        setMessage(copy.success)
                        setPassword('')
                        setConfirm('')
                        await signOut()
                        window.setTimeout(() => {
                          navigate('/admin/sign-in', { replace: true })
                        }, 1200)
                      } catch (e) {
                        setError(e instanceof Error ? e.message : 'Could not update password.')
                      } finally {
                        setIsSubmitting(false)
                      }
                    }}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-deep-slate px-10 text-[10px] font-semibold tracking-[0.14em] uppercase text-white transition hover:bg-slate-700 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? copy.saving : copy.save}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-center">
                <p className="text-slate-600">{copy.missingSession}</p>
                <div className="flex justify-center">
                  <ButtonLink to="/admin/sign-in" variant="accent">
                    {copy.signIn}
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}
