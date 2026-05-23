import { Link } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'

export default function LearningSignUp() {
  usePageMeta({
    title: 'Learning Access | Learn',
    description: 'Learning access is created by the church administration when needed.',
  })

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-xl mx-auto space-y-6">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Authorized Access</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">Learning Access</h1>
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-xl mx-auto px-6 space-y-6">
          <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="space-y-5 text-center">
              <p className="text-slate-600 leading-relaxed">
                Public self-registration has been removed. Learning access is created by the church administration when it is needed for materials or scheduled sessions.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
                <ButtonLink to="/learn" variant="ghost">
                  Back
                </ButtonLink>
                <ButtonLink to="/learn/sign-in" variant="accent">
                  Sign In
                </ButtonLink>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 text-center">
            Need access? Please contact the church administration first. If access has already been created for you,{' '}
            <Link to="/learn/sign-in" className="text-sage-700 hover:text-sage-800 font-semibold underline">
              sign in here
            </Link>
          </p>
        </div>
      </Section>
    </div>
  )
}
