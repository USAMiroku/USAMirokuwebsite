export type AnnualEventCategory = 'service' | 'class' | 'seminar' | 'meeting' | 'art' | 'pilgrimage'

export type AnnualCalendarEvent = {
  id: string
  title: string
  startDate: string
  endDate?: string
  time: string
  location?: 'Headquarters' | 'Zoom'
  presenter?: string
  category: AnnualEventCategory
  dateNeedsConfirmation?: boolean
  sourceDate?: string
}

export const annualCalendar2026: AnnualCalendarEvent[] = [
  { id: 'new-years-prayer', title: "New Year's Prayer", startDate: '2026-01-01', time: '1:00 PM', location: 'Headquarters', category: 'service' },
  { id: 'monthly-jan', title: 'Monthly Appreciation Service', startDate: '2026-01-04', time: '11:00 AM', location: 'Headquarters', category: 'service' },
  { id: 'risshun', title: 'Risshun Service · Hatsuike Ceremony · Monthly Appreciation', startDate: '2026-02-01', time: '11:00 AM', location: 'Headquarters', category: 'service' },
  { id: 'monthly-mar', title: 'Monthly Appreciation Service', startDate: '2026-03-01', time: '11:00 AM', location: 'Headquarters', category: 'service' },
  { id: 'ministers-meeting', title: 'Ministers Meeting', startDate: '2026-03-21', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Marco Negrao', category: 'meeting' },
  { id: 'ministerial-1', title: 'Ministerial Candidates · Class #1', startDate: '2026-04-04', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Marco Negrao', category: 'class' },
  { id: 'monthly-apr', title: 'Monthly Appreciation Service', startDate: '2026-04-05', time: '11:00 AM', location: 'Headquarters', category: 'service' },
  { id: 'ministerial-2', title: 'Ministerial Candidates · Class #2', startDate: '2026-04-18', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Romilson', category: 'class' },
  { id: 'ikebana-seminar', title: 'Ikebana Instructors Seminar · Study/Training Session', startDate: '2026-04-25', endDate: '2026-04-26', time: 'All day', location: 'Headquarters', presenter: 'Instructor Talita', category: 'seminar' },
  { id: 'monthly-may', title: 'Monthly Appreciation Service', startDate: '2026-05-03', time: '11:00 AM', location: 'Headquarters', category: 'service' },
  { id: 'ministerial-3', title: 'Ministerial Candidates · Class #3', startDate: '2026-05-09', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Guilherme', category: 'class' },
  { id: 'ministerial-4', title: 'Ministerial Candidates · Class #4', startDate: '2026-05-23', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Nagase', category: 'class' },
  { id: 'ministerial-written', title: 'Ministerial Candidates Exam · Written Test', startDate: '2026-05-30', time: 'All day', location: 'Headquarters', category: 'class' },
  { id: 'ministerial-interview', title: 'Ministerial Candidates Exam · Interview', startDate: '2026-05-31', time: '9:30 AM–2:00 PM', location: 'Headquarters', category: 'class' },
  { id: 'paradise-service', title: 'Paradise on Earth Service', startDate: '2026-06-07', time: '11:00 AM', location: 'Headquarters', category: 'service' },
  { id: 'art-opening', title: 'Art Exhibition Opening', startDate: '2026-06-12', time: '6:00 PM', location: 'Headquarters', category: 'art' },
  { id: 'art-exhibition', title: 'Art Exhibition', startDate: '2026-06-13', time: 'All day', location: 'Headquarters', category: 'art' },
  { id: 'lay-level3-1', title: 'Lay Leader Level 3 · Class #1', startDate: '2026-06-20', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Marco Negrao', category: 'class' },
  { id: 'monthly-jul', title: 'Monthly Appreciation Service', startDate: '2026-07-05', time: '11:00 AM', location: 'Headquarters', category: 'service' },
  { id: 'lay-level3-2', title: 'Lay Leader Level 3 · Class #2', startDate: '2026-07-11', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Romilson', category: 'class' },
  { id: 'lay-level2-1', title: 'Lay Leader Level 2 · Class #1', startDate: '2026-07-25', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Marco Negrao', category: 'class' },
  { id: 'monthly-aug', title: 'Monthly Appreciation Service', startDate: '2026-08-02', time: '11:00 AM', location: 'Headquarters', category: 'service' },
  { id: 'lay-level3-3', title: "Lay Leader Level 3 · Class #3 · Meishu-sama's Work of Salvation through His Calligraphies", startDate: '2026-08-08', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Terry', category: 'class' },
  { id: 'pre-ministerial-aug', title: 'Pre-Ministerial Candidates', startDate: '2026-08-22', time: '3:30 PM', location: 'Zoom', category: 'class' },
  { id: 'lay-level2-2', title: 'Lay Leader Level 2 · Class #2', startDate: '2026-08-29', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Romilson', category: 'class' },
  { id: 'ancestors-service', title: 'Annual Ancestors Memorial Service', startDate: '2026-09-06', time: '11:00 AM', location: 'Headquarters', category: 'service' },
  { id: 'lay-level3-4', title: 'Lay Leader Level 3 · Class #4', startDate: '2026-09-12', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Nagase', category: 'class' },
  { id: 'advanced-lay-1a', title: 'Advanced Lay Leader Class #1', startDate: '2026-09-19', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Marco Negrao', category: 'class' },
  { id: 'japan-pilgrimage', title: 'Japan Pilgrimage', startDate: '2026-09-25', endDate: '2026-10-06', time: 'Departure on September 25', category: 'pilgrimage' },
  { id: 'pre-ministerial-sep', title: 'Pre-Ministerial Candidates', startDate: '2026-09-26', time: '3:30 PM', location: 'Zoom', category: 'class' },
  { id: 'monthly-oct', title: 'Monthly Appreciation Service', startDate: '2026-10-04', time: '11:00 AM', location: 'Headquarters', category: 'service', dateNeedsConfirmation: true, sourceDate: '10/4/2025' },
  { id: 'lay-level3-5', title: 'Lay Leader Level 3 · Class #5', startDate: '2026-10-10', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Vania', category: 'class' },
  { id: 'lay-level2-3', title: 'Lay Leader Level 2 · Class #3', startDate: '2026-10-17', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Guilherme', category: 'class' },
  { id: 'pre-ministerial-oct', title: 'Pre-Ministerial Candidates', startDate: '2026-10-24', time: '3:30 PM', location: 'Zoom', category: 'class' },
  { id: 'monthly-nov', title: 'Monthly Appreciation Service', startDate: '2026-11-01', time: '11:00 AM', location: 'Headquarters', category: 'service', dateNeedsConfirmation: true, sourceDate: '11/1/2025' },
  { id: 'lay-level3-6', title: 'Lay Leader Level 3 · Class #6', startDate: '2026-11-07', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Guilherme', category: 'class' },
  { id: 'advanced-lay-1b', title: 'Advanced Lay Leader Class #1', startDate: '2026-11-14', time: '3:30 PM', location: 'Zoom', category: 'class' },
  { id: 'lay-level2-4', title: 'Lay Leader Level 2 · Class #4', startDate: '2026-11-21', time: '3:30 PM', location: 'Zoom', presenter: 'Rev. Nagase', category: 'class' },
  { id: 'pre-ministerial-nov', title: 'Pre-Ministerial Candidates', startDate: '2026-11-28', time: '3:30 PM', location: 'Zoom', category: 'class' },
  { id: 'lay-seminar', title: 'Lay Leader Seminar · All Levels', startDate: '2026-12-05', time: 'All day · starts at 9:00 AM', location: 'Headquarters', presenter: 'Rev. Resende', category: 'seminar' },
  { id: 'birthday-service', title: "Meishu-sama's Birthday Service", startDate: '2026-12-06', time: '11:00 AM', location: 'Headquarters', category: 'service' },
  { id: 'certificate-ceremony', title: 'Lay Leader Certificate of Participation Ceremony', startDate: '2026-12-06', time: '11:00 AM', location: 'Headquarters', category: 'service' },
]

export const annualCalendarSourceNote = 'Other than the monthly services, all other activities are subject to change.'
