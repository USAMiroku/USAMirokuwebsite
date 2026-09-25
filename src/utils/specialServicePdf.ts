import jsPDF from 'jspdf'
import { specialServiceFormUiCopy, type SpecialServiceDefinition } from '../data/specialServices'
import type { Language } from '../data/translations'

export type PrayerFormData = {
  service: SpecialServiceDefinition
  language: Language
  center: string
  fullName: string
  date: string
  section1: string
  section2: string
  ancestors: { name: string; relationship: string }[]
}

/** Draw real PDF text and vector rules so the form stays sharp at any print resolution. */
export function createSpecialServicePdf(data: PrayerFormData, logo?: string) {
  const pdf = new jsPDF({ unit: 'pt', format: 'letter', compress: true })
  const copy = data.service.copy[data.language]
  const ui = specialServiceFormUiCopy[data.language]
  const left = 42
  const right = 570
  const width = right - left
  const bottom = 742
  let y = 42
  pdf.setProperties({ title: copy.title, author: 'Miroku Association USA' })
  pdf.setTextColor(31, 41, 51)
  pdf.setDrawColor(70)
  pdf.setLineWidth(0.45)

  function header() {
    y = 42
    if (logo) pdf.addImage(logo, 'PNG', left, y - 5, 30, 30)
    pdf.setFont('helvetica', 'bold').setFontSize(10)
    pdf.text('MIROKU ASSOCIATION USA', left + (logo ? 40 : 0), y + 5)
    pdf.setFont('helvetica', 'normal').setFontSize(8)
    pdf.text('World Messianic Church of America', left + (logo ? 40 : 0), y + 18)
    pdf.line(left, y + 32, right, y + 32)
    y += 54
    pdf.setFont('times', 'bold').setFontSize(16)
    const title = pdf.splitTextToSize(copy.title, width) as string[]
    for (const line of title) {
      pdf.text(line, 306, y, { align: 'center' })
      y += 18
    }
    y += 10
  }
  function room(height: number) {
    if (y + height > bottom) {
      pdf.addPage()
      header()
    }
  }
  function paragraph(text: string, italic = false) {
    pdf.setFont('times', italic ? 'italic' : 'normal').setFontSize(11)
    const lines = pdf.splitTextToSize(text, width) as string[]
    for (const line of lines) {
      room(14)
      pdf.setFont('times', italic ? 'italic' : 'normal').setFontSize(11)
      pdf.text(line, left, y)
      y += 14
    }
    y += 6
  }
  function ruledText(text: string, minimumLines: number) {
    pdf.setFont('times', 'normal').setFontSize(11)
    const lines = pdf.splitTextToSize(text, width - 8) as string[]
    for (let i = 0; i < Math.max(minimumLines, lines.length); i++) {
      room(14)
      pdf.setFont('times', 'normal').setFontSize(11)
      if (lines[i]) pdf.text(lines[i], left + 3, y)
      pdf.line(left, y + 3, right, y + 3)
      y += 14
    }
    y += 13
  }
  function field(label: string, value: string, x: number, fieldWidth: number) {
    pdf.setFont('helvetica', 'bold').setFontSize(8)
    pdf.text(label.toUpperCase(), x, y)
    pdf.setFont('times', 'normal').setFontSize(11)
    const lines = pdf.splitTextToSize(value || ' ', fieldWidth - 6) as string[]
    lines.forEach((line, index) => pdf.text(line, x + 2, y + 17 + index * 14))
    pdf.line(x, y + 21 + (lines.length - 1) * 14, x + fieldWidth, y + 21 + (lines.length - 1) * 14)
    return 35 + (lines.length - 1) * 14
  }
  header()
  if (copy.quote) {
    paragraph(`“${copy.quote}”`, true)
    pdf.setFont('helvetica', 'normal').setFontSize(8)
    pdf.text('- Meishu-sama', right, y, { align: 'right' })
    y += 20
  }
  if (data.service.slug === 'annual-ancestors') {
    paragraph(copy.prayerText ?? '')
    y += 8
    const split = left + width * 0.64
    const tableHeader = () => {
      pdf.setFont('helvetica', 'bold').setFontSize(8)
      pdf.text(copy.tableHeaders?.name ?? '', left + 4, y)
      pdf.text(copy.tableHeaders?.relationship ?? '', split + 8, y)
      y += 14
    }
    tableHeader()
    for (const row of data.ancestors) {
      pdf.setFont('times', 'normal').setFontSize(11)
      const names = pdf.splitTextToSize(row.name || ' ', split - left - 12) as string[]
      const relationships = pdf.splitTextToSize(row.relationship || ' ', right - split - 16) as string[]
      const count = Math.max(names.length, relationships.length)
      // Long entries continue on the next page instead of shrinking or clipping.
      for (let i = 0; i < count; i++) {
        if (y + 22 > bottom) { pdf.addPage(); header(); tableHeader() }
        pdf.setFont('times', 'normal').setFontSize(11)
        if (names[i]) pdf.text(names[i], left + 4, y)
        if (relationships[i]) pdf.text(relationships[i], split + 8, y)
        pdf.line(left, y + 5, split - 4, y + 5)
        pdf.line(split + 4, y + 5, right, y + 5)
        y += 22
      }
    }
    y += 18
  } else {
    paragraph(copy.section1 ?? '')
    ruledText(data.section1, copy.section1Lines ?? 14)
    paragraph(copy.section2 ?? '')
    ruledText(data.section2, copy.section2Lines ?? 12)
  }
  // Keep the identification block together and allow long names to wrap.
  pdf.setFont('times', 'normal').setFontSize(11)
  const nameLines = (pdf.splitTextToSize(data.fullName || ' ', 378) as string[]).length
  const dateLines = (pdf.splitTextToSize(data.date || ' ', 126) as string[]).length
  const centerLines = (pdf.splitTextToSize(data.center || ' ', width - 6) as string[]).length
  room(70 + (centerLines - 1 + Math.max(nameLines, dateLines) - 1) * 14)
  y += field(ui.centerLabel, data.center, left, width)
  const nameHeight = field(ui.fullName, data.fullName, left, 384)
  const dateHeight = field(ui.date, data.date, 438, 132)
  y += Math.max(nameHeight, dateHeight)
  return pdf
}
