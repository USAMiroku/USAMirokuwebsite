import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Section } from '../../components/Section'
import { ButtonLink } from '../../components/ButtonLink'
import { usePageMeta } from '../../hooks/usePageMeta'
import { supabase } from '../lib/supabaseClient'
import { RequireAuth } from '../components/LearningRouteGuards'
import { useLearningAuth } from '../context/LearningAuthContext'

type Session = {
  id: string
  start_time: string | null
  meeting_url: string | null
  seats_total: number | null
  location: string | null
}

type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'

type ExistingRegistration = {
  id: string
  status: RegistrationStatus
}

function formatDateTime(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString()
}

function RegistrationForm({
  session,
  existingRegistration,
  onCreate,
  isSubmitting,
}: {
  session: Session
  existingRegistration: ExistingRegistration | null
  onCreate: (payload: {
    fullName: string
    phone: string
    preferredLanguage: string
    emergencyContact: string
    notes: string
  }) => Promise<void>
  isSubmitting: boolean
}) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState('en')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="rounded-3xl border border-[rgba(184,134,11,0.22)] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <h1 className="text-3xl md:text-4xl font-serif text-deep-slate">{formatDateTime(session.start_time) ?? 'Session'}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {session.location ? `Location: ${session.location}` : 'Online / center schedule will be provided.'}
      </p>

      <div className="mt-8 space-y-5">
        {existingRegistration ? (
          <div className="rounded-2xl border px-5 py-4 bg-slate-50 border-slate-200 text-slate-700">
            <p className="font-semibold">Your registration status: {existingRegistration.status}</p>
            <p className="text-sm mt-1 text-slate-600">
              If this information is incorrect, contact an instructor/admin.
            </p>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Full Name *</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
              required
              type="text"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Phone (optional)</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
              type="tel"
              placeholder="+1 ..."
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Preferred Language</span>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
            </select>
          </label>

          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Emergency Contact</span>
            <input
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
              type="text"
              placeholder="Name + phone"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[rgba(184,134,11,0.22)] bg-white px-4 py-3 text-sm text-deep-slate outline-none transition focus:border-sage-600 focus:ring-2 focus:ring-sage-100"
            rows={4}
            placeholder="Anything instructors should know..."
          />
        </label>

        {error ? <p className="text-sm text-rose-700">{error}</p> : null}

        <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
          <ButtonLink to="/learn/activities" variant="ghost">
            Back
          </ButtonLink>

          <button
            type="button"
            disabled={isSubmitting || !!existingRegistration}
            onClick={async () => {
              if (!fullName.trim()) {
                setError('Please provide your full name.')
                return
              }
              setError(null)
              await onCreate({ fullName, phone, preferredLanguage, emergencyContact, notes })
            }}
            className="inline-flex h-12 items-center justify-center rounded-full bg-divine-gold px-10 text-[10px] font-semibold tracking-[0.14em] uppercase text-white transition hover:bg-[#9e730a] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : existingRegistration ? 'Already Registered' : 'Request Enrollment'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LearningSessionRegister() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { user } = useLearningAuth()

  const [session, setSession] = useState<Session | null>(null)
  const [existingRegistration, setExistingRegistration] = useState<ExistingRegistration | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  usePageMeta({
    title: 'Request Enrollment | Learn',
    description: 'Sign up for this course, study session, or learning activity.',
  })

  useEffect(() => {
    async function load() {
      if (!sessionId) return
      if (!supabase) {
        setError('Learning app is not configured. Add Supabase env vars to enable registration.')
        return
      }
      if (!user) return

      const { data: sessionData, error: sessionError } = await supabase
        .from('learning_sessions')
        .select('id,start_time,meeting_url,seats_total,location')
        .eq('id', sessionId)
        .maybeSingle()

      if (sessionError) {
        setError(sessionError.message)
        return
      }

      setSession(sessionData as Session | null)

      const { data: regData, error: regError } = await supabase
        .from('learning_registrations')
        .select('id,status')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (regError) {
        setError(regError.message)
        return
      }

      setExistingRegistration(regData as ExistingRegistration | null)
    }

    void load()
  }, [sessionId, user])

  async function createRegistration(payload: {
    fullName: string
    phone: string
    preferredLanguage: string
    emergencyContact: string
    notes: string
  }) {
    if (!sessionId || !user) return
    if (!supabase) return

    setIsSubmitting(true)
    try {
      // Store the latest student details in profile (optional).
      await supabase.from('learning_profiles').upsert(
        {
          user_id: user.id,
          full_name: payload.fullName,
          phone: payload.phone || null,
          preferred_language: payload.preferredLanguage,
        },
        { onConflict: 'user_id' },
      )

      const { error: insertError } = await supabase.from('learning_registrations').insert({
        user_id: user.id,
        session_id: sessionId,
        status: 'pending',
        seats_reserved: 1,
        custom_fields: {
          emergency_contact: payload.emergencyContact || null,
          notes: payload.notes || null,
        },
      })

      if (insertError) throw insertError

      navigate('/learn/account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RequireAuth>
      <div className="relative min-h-screen bg-sanctuary-100 text-deep-slate">
        <div className="noise-subtle" />

        <section className="relative py-28 md:py-36 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <span className="text-[10px] font-bold tracking-[0.4em] text-sage-600 uppercase">Enrollment Request</span>
            <h1 className="text-5xl md:text-7xl font-serif text-deep-slate leading-tight">Request Enrollment</h1>
          </div>
        </section>

        <Section className="bg-white">
          <div className="max-w-5xl mx-auto px-6 space-y-6">
            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">{error}</div>
            ) : null}

            {session ? (
              <RegistrationForm
                session={session}
                existingRegistration={existingRegistration}
                isSubmitting={isSubmitting}
                onCreate={createRegistration}
              />
            ) : null}
            {!session && !error ? <p className="text-slate-600">Loading session...</p> : null}

            <p className="text-sm text-slate-500">
              Enrollment may require instructor confirmation. Meeting links and materials become available after approval.
            </p>
          </div>
        </Section>
      </div>
    </RequireAuth>
  )
}

