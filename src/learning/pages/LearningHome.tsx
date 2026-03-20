import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { useTranslation } from '../../context/TranslationContext'
import { useLearningAuth } from '../context/LearningAuthContext'

export default function LearningHome() {
  const { t } = useTranslation()
  const { role } = useLearningAuth()

  usePageMeta({
    title: `Learn | ${t.brand}`,
    description: 'Courses, study sessions, self-study materials, and community learning opportunities.',
  })

  return (
    <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
      <div className="noise-subtle" />

      <section className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Learning Path</span>
          <h1 className="text-6xl md:text-8xl font-serif text-deep-slate leading-tight">
            Johrei
            <span className="text-sage-600">. </span>
            Miroku
          </h1>
          <p className="text-xl md:text-3xl font-serif italic text-slate-500 leading-relaxed max-w-2xl mx-auto">
            A place to sign up for classes, study sessions, community activities, and self-study—rooted in Johrei
            principles and philosophy.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <ButtonLink to="/learn/activities" variant="accent">
              Explore Classes & Sessions
            </ButtonLink>
            {role ? (
              <ButtonLink to="/learn/account" variant="outline">
                Go to My Account
              </ButtonLink>
            ) : (
              <ButtonLink to="/learn/sign-in" variant="outline">
                Sign In / Sign Up
              </ButtonLink>
            )}
          </div>
        </div>
      </section>

      <Section py-24 className="bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-10">
          <div className="space-y-3">
            <h2 className="text-4xl font-serif text-deep-slate italic">What you can do here</h2>
            <div className="h-1 w-24 bg-sage-600 mx-auto" />
          </div>

          <div className="grid gap-6 md:grid-cols-3 text-left">
            <div className="glass-sanctuary rounded-3xl p-8 space-y-3">
              <h3 className="text-lg font-semibold text-deep-slate">Register</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Public self-signup for learning activities. Instructors confirm your enrollment when needed.
              </p>
            </div>

            <div className="glass-sanctuary rounded-3xl p-8 space-y-3">
              <h3 className="text-lg font-semibold text-deep-slate">Join Online</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Access meeting links for scheduled sessions once you are enrolled.
              </p>
            </div>

            <div className="glass-sanctuary rounded-3xl p-8 space-y-3">
              <h3 className="text-lg font-semibold text-deep-slate">Study Materials</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Download prepared resources for your courses and study sessions (enrolled students/admin only).
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

