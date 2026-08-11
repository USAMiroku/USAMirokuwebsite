import { type CSSProperties, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Navigate, useParams } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { useTranslation } from '../context/TranslationContext'
import {
  getSpecialService,
  specialServiceCenters,
  specialServiceFormUiCopy,
} from '../data/specialServices'

type AncestorRow = {
  name: string
  relationship: string
}

function IconPrint() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8V4h10v4M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M7 14h10v7H7z" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 12 17-8-7 17-3-7-7-2zM11 14l10-10" />
    </svg>
  )
}

function LineInput({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (value: string) => void
  label: string
}) {
  return (
    <span className="special-service-line-frame">
      <input
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="special-service-line"
      />
    </span>
  )
}

function LinedTextarea({
  value,
  onChange,
  label,
  lines,
  id,
}: {
  value: string
  onChange: (value: string) => void
  label: string
  lines: number
  id: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showOverflowWarning, setShowOverflowWarning] = useState(false)
  const warningId = `${id}-overflow-warning`

  function handleChange(nextValue: string) {
    const textarea = textareaRef.current
    if (textarea && textarea.scrollHeight > textarea.clientHeight + 1) {
      textarea.value = value
      setShowOverflowWarning(true)
      return
    }

    onChange(nextValue)
    setShowOverflowWarning(false)
  }

  return (
    <span className="block">
      <span className="special-service-textarea-frame" style={{ '--special-service-lines': lines } as CSSProperties}>
        <textarea
          id={id}
          ref={textareaRef}
          aria-label={label}
          aria-describedby={showOverflowWarning && isEditing ? warningId : undefined}
          value={value}
          onBlur={() => setIsEditing(false)}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => setIsEditing(true)}
          className="special-service-textarea"
          rows={lines}
        />
      </span>
      {showOverflowWarning && isEditing ? (
        <span id={warningId} className="screen-only mt-1 block text-[11px] font-semibold text-rose-800">
          End of text box reached. Please send this form and continue in a new one.
        </span>
      ) : null}
    </span>
  )
}

export default function SpecialServiceForm() {
  const { serviceSlug } = useParams<{ serviceSlug: string }>()
  const service = getSpecialService(serviceSlug)
  const { language } = useTranslation()
  const formRef = useRef<HTMLDivElement | null>(null)
  const [selectedCenterEmail, setSelectedCenterEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [date, setDate] = useState('')
  const [section1, setSection1] = useState('')
  const [section2, setSection2] = useState('')
  const [ancestors, setAncestors] = useState<AncestorRow[]>(
    () => Array.from({ length: 15 }, () => ({ name: '', relationship: '' })),
  )
  const [fieldErrors, setFieldErrors] = useState<{ center?: string; fullName?: string }>({})
  const [error, setError] = useState('')
  const [sendNotice, setSendNotice] = useState('')
  const [isSending, setIsSending] = useState(false)

  const copy = service?.copy[language]
  const ui = specialServiceFormUiCopy[language]
  const selectedCenter = useMemo(
    () => specialServiceCenters.find((center) => center.email === selectedCenterEmail) ?? null,
    [selectedCenterEmail],
  )

  usePageMeta({
    title: copy ? `${copy.title} | World Messianic Church of America | Miroku Association USA` : 'Special Services',
    description: copy
      ? `${copy.title} prayer form for World Messianic Church of America / Miroku Association USA. Available in English, Portuguese, and Spanish.`
      : undefined,
  })

  if (!service || !copy) {
    return <Navigate to="/special-services" replace />
  }

  const activeService = service
  function updateAncestor(index: number, field: keyof AncestorRow, value: string) {
    setAncestors((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)))
  }

  function validateForm() {
    const nextErrors: { center?: string; fullName?: string } = {}
    if (!selectedCenter) {
      nextErrors.center = ui.selectCenterError
    }
    if (!fullName.trim()) {
      nextErrors.fullName = ui.nameError
    }
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return false
    setError('')
    setSendNotice('')
    return true
  }

  async function generatePdfBlob() {
    if (!formRef.current) {
      throw new Error('Missing form.')
    }

    formRef.current.classList.add('special-service-capturing')
    const canvas = await html2canvas(formRef.current, {
      scale: 1.15,
      backgroundColor: '#ffffff',
      useCORS: true,
      onclone: (documentClone) => {
        const style = documentClone.createElement('style')
        style.textContent = `
          .special-service-sheet,
          .special-service-sheet * {
            color: #1f2933 !important;
            border-color: #000000 !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }

          .special-service-sheet {
            background: #ffffff !important;
          }

          .special-service-sheet .bg-slate-100 {
            background: #f1f5f9 !important;
          }

          .special-service-sheet input,
          .special-service-sheet select {
            background: transparent !important;
          }

          .special-service-line-frame,
          .special-service-pdf-line,
          .special-service-textarea-frame,
          .special-service-pdf-textarea {
            box-sizing: border-box !important;
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            height: 20px !important;
            overflow: hidden !important;
            border-bottom: 1px solid #000000 !important;
            background: transparent !important;
          }

          .special-service-textarea-frame,
          .special-service-pdf-textarea {
            height: calc(var(--special-service-lines, 1) * 20px) !important;
            border-bottom: 0 !important;
            background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 19px, #000000 19px, #000000 20px) !important;
            background-size: 100% 20px !important;
            background-repeat: repeat-y !important;
          }

          .special-service-pdf-line {
            white-space: nowrap !important;
            font-family: Georgia, "Times New Roman", serif !important;
            font-size: 13px !important;
            line-height: 19px !important;
            padding: 0 !important;
          }

          .special-service-pdf-textarea {
            white-space: pre-wrap !important;
            overflow-wrap: anywhere !important;
            font-family: Georgia, "Times New Roman", serif !important;
            font-size: 13px !important;
            line-height: 20px !important;
            padding: 0 !important;
          }
        `
        documentClone.head.appendChild(style)

        documentClone.querySelectorAll<HTMLTextAreaElement>('textarea.special-service-textarea').forEach((textarea) => {
          const replacement = documentClone.createElement('div')
          replacement.className = 'special-service-pdf-textarea'
          replacement.style.setProperty('--special-service-lines', textarea.rows.toString())
          replacement.textContent = textarea.value
          textarea.replaceWith(replacement)
        })

        documentClone.querySelectorAll<HTMLInputElement>('input.special-service-line').forEach((input) => {
          const replacement = documentClone.createElement('div')
          replacement.className = 'special-service-pdf-line'
          replacement.textContent = input.value
          input.replaceWith(replacement)
        })
      },
      ignoreElements: (element) => element.classList.contains('screen-only'),
    }).finally(() => {
      formRef.current?.classList.remove('special-service-capturing')
    })
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 36
    const printableHeight = pageHeight - margin * 2
    const imageWidth = pageWidth - margin * 2
    const imageHeight = (canvas.height * imageWidth) / canvas.width
    const imageData = canvas.toDataURL('image/jpeg', 0.78)

    if (imageHeight <= printableHeight) {
      pdf.addImage(imageData, 'JPEG', margin, margin, imageWidth, imageHeight, undefined, 'FAST')
    } else if (imageHeight <= printableHeight * 1.06) {
      const fitScale = printableHeight / imageHeight
      const scaledWidth = imageWidth * fitScale
      const x = margin + (imageWidth - scaledWidth) / 2
      pdf.addImage(imageData, 'JPEG', x, margin, scaledWidth, printableHeight, undefined, 'FAST')
    } else {
      let position = margin
      let remainingHeight = imageHeight
      while (remainingHeight > 0) {
        pdf.addImage(imageData, 'JPEG', margin, position, imageWidth, imageHeight, undefined, 'FAST')
        remainingHeight -= printableHeight
        if (remainingHeight > 0) {
          pdf.addPage()
          position = margin - (imageHeight - remainingHeight)
        }
      }
    }

    const blob = pdf.output('blob')
    if (!blob.size) {
      throw new Error('Empty PDF.')
    }
    return blob
  }

  function downloadPdf(file: File) {
    const downloadUrl = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)
  }

  function openEmailDraft(recipient: string, subject: string, filename: string) {
    const body = encodeURIComponent(ui.emailBody.replace('{filename}', filename))
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`
  }

  async function handleSend() {
    if (isSending) return
    if (!validateForm() || !selectedCenter) return

    setIsSending(true)
    setError('')
    setSendNotice('')

    try {
      const pdfBlob = await generatePdfBlob()
      const pdfFile = new File([pdfBlob], activeService.pdfFilename, { type: 'application/pdf' })
      const subject = `Prayer Form - ${activeService.apiServiceName} - ${selectedCenter.name}`

      let canShareFile = false
      try {
        canShareFile = typeof navigator.share === 'function'
          && typeof navigator.canShare === 'function'
          && navigator.canShare({ files: [pdfFile] })
      } catch {
        canShareFile = false
      }

      if (canShareFile) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: subject,
            text: ui.shareText.replaceAll('{recipient}', selectedCenter.email),
          })
          setSendNotice(ui.shareComplete.replace('{recipient}', selectedCenter.email))
        } catch (shareError) {
          if (shareError instanceof DOMException && shareError.name === 'AbortError') {
            setSendNotice(ui.shareCanceled)
            return
          }
          downloadPdf(pdfFile)
          setSendNotice(ui.downloadInstructions
            .replace('{filename}', pdfFile.name)
            .replace('{recipient}', selectedCenter.email))
          openEmailDraft(selectedCenter.email, subject, pdfFile.name)
        }
      } else {
        downloadPdf(pdfFile)
        setSendNotice(ui.downloadInstructions
          .replace('{filename}', pdfFile.name)
          .replace('{recipient}', selectedCenter.email))
        openEmailDraft(selectedCenter.email, subject, pdfFile.name)
      }
    } catch (sendError) {
      console.error('Could not prepare the special-service PDF.', sendError)
      setError(ui.pdfError)
    } finally {
      setIsSending(false)
    }
  }

  const isAncestorForm = activeService.slug === 'annual-ancestors'

  return (
    <div className="bg-white px-4 pb-16 pt-32 text-deep-slate md:px-6">
      <div className="mx-auto max-w-[840px]">
        <div ref={formRef} className="special-service-sheet bg-white px-7 py-7 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.32)] md:px-10">
          <header className="flex items-start justify-between gap-4 border-b-2 border-deep-slate pb-3">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="World Messianic Church of America" className="h-8 w-8 rounded-full object-cover" />
              <p className="max-w-[13rem] text-[11.5px] font-medium leading-tight text-deep-slate">
                World Messianic Church of America
              </p>
            </div>
            <p className="max-w-[15rem] text-right text-[9.5px] font-bold uppercase leading-snug tracking-[1.4px] text-deep-slate">
              Prayer Form | {copy.title}
            </p>
          </header>

          {copy.quote ? (
            <div className="mt-4 bg-slate-100 px-4 py-3">
              <p className="font-serif text-[12px] italic leading-normal text-slate-700">"{copy.quote}"</p>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">- Meishu-sama</p>
            </div>
          ) : (
            <h1 className="mt-6 text-center text-[18px] font-medium leading-tight text-deep-slate">{copy.title}</h1>
          )}

          {isAncestorForm ? (
            <div className="mt-6">
              <p className="font-serif text-[13px] leading-relaxed text-deep-slate">{copy.prayerText}</p>
              <div className="mt-6">
                <div className="grid grid-cols-[65%_35%] gap-4 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <span>{copy.tableHeaders?.name}</span>
                  <span>{copy.tableHeaders?.relationship}</span>
                </div>
                <div className="mt-1 space-y-1">
                  {ancestors.map((row, index) => (
                    <div key={index} className="special-service-two-column">
                      <LineInput
                        label={`${copy.tableHeaders?.name} ${index + 1}`}
                        value={row.name}
                        onChange={(value) => updateAncestor(index, 'name', value)}
                      />
                      <LineInput
                        label={`${copy.tableHeaders?.relationship} ${index + 1}`}
                        value={row.relationship}
                        onChange={(value) => updateAncestor(index, 'relationship', value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div>
                <p className="font-serif text-[13px] leading-relaxed text-deep-slate">{copy.section1}</p>
                <div className="mt-2">
                  <LinedTextarea
                    id="section-1"
                    label="Section 1"
                    value={section1}
                    onChange={setSection1}
                    lines={copy.section1Lines ?? 14}
                  />
                </div>
              </div>

              <div>
                <p className="font-serif text-[13px] leading-relaxed text-deep-slate">{copy.section2}</p>
                <div className="mt-2">
                  <LinedTextarea
                    id="section-2"
                    label="Section 2"
                    value={section2}
                    onChange={setSection2}
                    lines={copy.section2Lines ?? 12}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="screen-only">
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500" htmlFor="johrei-center">
                {ui.centerLabel}
              </label>
              <select
                id="johrei-center"
                required
                aria-invalid={fieldErrors.center ? 'true' : undefined}
                aria-describedby={fieldErrors.center ? 'johrei-center-error' : selectedCenter ? 'form-recipient' : undefined}
                value={selectedCenterEmail}
                onChange={(event) => {
                  setSelectedCenterEmail(event.target.value)
                  setFieldErrors((current) => ({ ...current, center: undefined }))
                }}
                className="mt-2 w-full rounded-lg border border-[rgba(15,23,42,0.16)] bg-white px-3 py-2 text-sm text-deep-slate outline-none focus:border-sage-600"
              >
                <option value="">{ui.centerPlaceholder}</option>
                {specialServiceCenters.map((center) => (
                  <option key={center.email} value={center.email}>
                    {center.name}
                  </option>
                ))}
              </select>
              {fieldErrors.center ? (
                <p id="johrei-center-error" className="mt-2 text-xs font-medium text-rose-800">
                  {fieldErrors.center}
                </p>
              ) : null}
              {selectedCenter ? (
                <div id="form-recipient" className="mt-3 rounded-lg border border-[rgba(141,107,38,0.22)] bg-sanctuary-100 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-600">{ui.recipientLabel}</p>
                  <p className="mt-1 font-serif text-lg text-deep-slate">{selectedCenter.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {ui.recipientEmailLabel}: <span className="font-semibold text-deep-slate break-all">{selectedCenter.email}</span>
                  </p>
                </div>
              ) : null}
            </div>

            <div className="pdf-print-only">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{ui.centerLabel}</p>
              <p className="special-service-static-line">{selectedCenter?.name ?? ''}</p>
            </div>

            <div className="special-service-bottom-fields">
              <label className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{ui.fullName}</span>
                <LineInput
                  label={ui.fullName}
                  value={fullName}
                  onChange={(value) => {
                    setFullName(value)
                    setFieldErrors((current) => ({ ...current, fullName: undefined }))
                  }}
                />
                {fieldErrors.fullName ? (
                  <span className="screen-only mt-1 block text-xs font-medium text-rose-800">
                    {fieldErrors.fullName}
                  </span>
                ) : null}
              </label>
              <label className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{ui.date}</span>
                <LineInput label={ui.date} value={date} onChange={setDate} />
              </label>
            </div>
          </div>
        </div>

        <div className="screen-only mt-5">
          <p className="text-sm text-slate-500">{ui.helper}</p>
          {sendNotice ? (
            <p role="status" className="mt-3 rounded-lg border border-sage-200 bg-sage-50 px-4 py-3 text-sm leading-relaxed text-deep-slate">
              {sendNotice}
            </p>
          ) : null}
          {error ? <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{error}</p> : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[rgba(15,23,42,0.18)] bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-deep-slate transition-colors hover:bg-sanctuary-100"
            >
              <IconPrint />
              {ui.print}
            </button>
            <button
              type="button"
              disabled={isSending}
              onClick={() => void handleSend()}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-deep-slate px-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#14202a] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <IconSend />
              {isSending ? ui.sending : ui.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
