export type RecurrenceRule = 'none' | 'monthly_nth_weekday'

export type RecurringSession = {
  id: string
  start_time: string | null
  end_time?: string | null
  recurrence_rule?: RecurrenceRule | null
  recurrence_ordinal?: number | null
  recurrence_weekday?: number | null
  recurrence_until?: string | null
}

function nthWeekdayOfMonth(year: number, month: number, weekday: number, ordinal: number) {
  const first = new Date(year, month, 1)
  const day = 1 + ((weekday - first.getDay() + 7) % 7) + (ordinal - 1) * 7
  const result = new Date(year, month, day)
  return result.getMonth() === month ? result : null
}

function withAnchorTime(date: Date, anchor: Date) {
  date.setHours(anchor.getHours(), anchor.getMinutes(), anchor.getSeconds(), anchor.getMilliseconds())
  return date
}

export function isRecurringSession(session: RecurringSession) {
  return (
    session.recurrence_rule === 'monthly_nth_weekday' &&
    Number.isInteger(session.recurrence_ordinal) &&
    Number.isInteger(session.recurrence_weekday)
  )
}

export function expandUpcomingSessions<T extends RecurringSession>(
  sessions: T[],
  from = new Date(),
  recurringOccurrenceLimit = 12,
): T[] {
  const fromTime = from.getTime()
  const expanded: T[] = []

  for (const session of sessions) {
    if (!session.start_time) continue
    const anchor = new Date(session.start_time)
    if (Number.isNaN(anchor.getTime())) continue

    if (!isRecurringSession(session)) {
      if (anchor.getTime() >= fromTime) expanded.push(session)
      continue
    }

    const ordinal = session.recurrence_ordinal as number
    const weekday = session.recurrence_weekday as number
    const until = session.recurrence_until ? new Date(`${session.recurrence_until}T23:59:59`) : null
    const duration = session.end_time
      ? Math.max(0, new Date(session.end_time).getTime() - anchor.getTime())
      : null
    let year = Math.max(anchor.getFullYear(), from.getFullYear())
    let month = year === anchor.getFullYear() ? anchor.getMonth() : from.getMonth()
    if (year === from.getFullYear()) month = Math.max(month, from.getMonth())
    let found = 0

    for (let checked = 0; checked < 240 && found < recurringOccurrenceLimit; checked += 1) {
      const occurrenceDate = nthWeekdayOfMonth(year, month, weekday, ordinal)
      if (occurrenceDate) {
        const occurrence = withAnchorTime(occurrenceDate, anchor)
        if (
          occurrence.getTime() >= Math.max(fromTime, anchor.getTime()) &&
          (!until || occurrence.getTime() <= until.getTime())
        ) {
          expanded.push({
            ...session,
            id: `${session.id}:${occurrence.toISOString()}`,
            start_time: occurrence.toISOString(),
            end_time: duration === null ? session.end_time : new Date(occurrence.getTime() + duration).toISOString(),
          })
          found += 1
        }
      }

      month += 1
      if (month > 11) {
        month = 0
        year += 1
      }
      if (until && new Date(year, month, 1).getTime() > until.getTime()) break
    }
  }

  return expanded.sort((a, b) => new Date(a.start_time!).getTime() - new Date(b.start_time!).getTime())
}

export function recurrenceLabel(session: RecurringSession) {
  if (!isRecurringSession(session)) return null
  const ordinals: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th' }
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return `Every ${ordinals[session.recurrence_ordinal as number]} ${weekdays[session.recurrence_weekday as number]}`
}
