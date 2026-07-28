import { books } from '../data/books'
import { usePageMeta } from '../hooks/usePageMeta'

const featuredBook = books.find((book) => book.status === 'available') ?? books[0]
const printBooks = books.filter((book) => book.printEdition !== false)
const ebookBooks = books.filter((book) => book.ebookLinks?.kindle || book.ebookLinks?.appleBooks)
const ebookKindleCount = ebookBooks.filter((book) => book.ebookLinks?.kindle).length
const ebookAppleCount = ebookBooks.filter((book) => book.ebookLinks?.appleBooks).length

function PurchaseAction({ purchaseUrl, volume }: { purchaseUrl?: string; volume: number }) {
  if (purchaseUrl) {
    return (
      <a
        href={purchaseUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#ad7b22] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#946615] sm:w-auto"
      >
        Buy Volume {volume}
      </a>
    )
  }

  return (
    <span className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[rgba(15,23,42,0.12)] bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:w-auto">
      Purchase link coming soon
    </span>
  )
}

function KindleLogo({ className = 'h-10 w-10 rounded-lg' }: { className?: string }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden bg-[#1f2933] ${className}`}>
      <img
        src="/images/books/amazon-kindle-symbol.png"
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
  )
}

function AppleBooksLogo({ className = 'h-10 w-10 rounded-lg' }: { className?: string }) {
  return (
    <div className={`flex shrink-0 items-center justify-center bg-[#f47b20] ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 40 40" className="h-[70%] w-[70%] fill-white">
        <path d="M20 11.5c-2.8-2.1-6.2-3.2-10.2-3.4-.8 0-1.3.5-1.3 1.3v17.8c0 .7.5 1.2 1.2 1.3 3.7.2 6.8 1.1 9.3 2.9.6.4 1.4.4 2 0 2.5-1.8 5.6-2.8 9.3-2.9.7-.1 1.2-.6 1.2-1.3V9.4c0-.8-.5-1.3-1.3-1.3-4 .2-7.4 1.3-10.2 3.4Zm-1.7 15.2c-2.1-1.1-4.4-1.7-7-1.9V11.2c2.8.4 5.1 1.3 7 2.8v12.7Zm10.4-1.9c-2.6.2-4.9.8-7 1.9V14c1.9-1.5 4.2-2.4 7-2.8v13.6Z" />
      </svg>
    </div>
  )
}

function EbookStoreAction({
  href,
  store,
}: {
  href?: string
  store: 'kindle' | 'appleBooks'
}) {
  const label = store === 'kindle' ? 'Kindle' : 'Apple Books'
  const logo =
    store === 'kindle' ? (
      <KindleLogo className="h-8 w-8 rounded-md" />
    ) : (
      <AppleBooksLogo className="h-8 w-8 rounded-md" />
    )

  if (!href) {
    return (
      <span className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[rgba(15,23,42,0.22)] bg-white/70 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {store === 'kindle' ? 'Kindle under revision' : `${label} coming soon`}
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#203831] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#294941]"
    >
      {logo}
      <span>Buy on {label}</span>
    </a>
  )
}

export default function Books() {
  usePageMeta({
    title: 'Books | World Messianic Church of America / Miroku Association USA',
    description: 'Purchase and learn about the Teachings of Meishu-sama book collection.',
  })

  return (
    <div className="min-h-screen bg-[#fffdf8] text-deep-slate">
      <section className="border-b border-[rgba(15,23,42,0.08)] px-5 pb-9 pt-32 sm:px-6 md:pb-16 md:pt-40">
        <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.58fr)] lg:items-center lg:gap-10">
          <div className="max-w-3xl">
            <h1 className="whitespace-nowrap text-[clamp(1.8rem,7vw,4rem)] font-serif leading-[0.98] text-slate-950">
              Teachings of Meishu-sama
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:mt-6 md:text-xl md:leading-8">
              A growing collection of Meishu-sama&apos;s teachings, made available for study, reflection, and spiritual growth.
            </p>
            <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row md:mt-8">
              <a
                href="#available-book"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#203831] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#294941]"
              >
                Print books
              </a>
              <a
                href="#ebooks"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[rgba(15,23,42,0.12)] bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 transition-colors hover:bg-slate-50"
              >
                Ebooks
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[236px] sm:max-w-[280px] md:max-w-[360px] lg:justify-self-end">
            <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-white p-3 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.34)] md:p-4">
              <img
                src={featuredBook.coverImage}
                alt={`${featuredBook.title}, ${featuredBook.subtitle} cover`}
                className="aspect-[0.62] w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="available-book" className="bg-white px-5 py-10 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d6b26]">Print editions</p>
            <h2 className="mt-3 text-3xl font-serif leading-tight text-slate-950 md:text-5xl">Teachings of Meishu-sama volumes</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg md:leading-8">
              Browse the print collection. Available volumes can be purchased through IngramSpark.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 md:mt-9 lg:grid-cols-3 lg:gap-5">
            {printBooks.map((book) => (
              <article key={book.id} className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#fbf7ef] p-4">
                <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-4 sm:grid-cols-[110px_minmax(0,1fr)]">
                  <img
                    src={book.coverImage}
                    alt={`${book.title}, ${book.subtitle} cover`}
                    className="aspect-[0.62] w-full rounded-lg object-cover shadow-[0_18px_34px_-26px_rgba(15,23,42,0.55)]"
                  />
                  <div className="min-w-0 py-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8d6b26]">
                      {book.status === 'available' ? 'Available now' : 'Coming soon'}
                    </p>
                    <h3 className="mt-2 text-2xl font-serif leading-7 text-slate-950">{book.subtitle}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{book.description}</p>
                    <div className="mt-4">
                      <PurchaseAction purchaseUrl={book.purchaseUrl} volume={book.volume} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ebooks" className="border-t border-[rgba(15,23,42,0.08)] bg-white px-5 py-10 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(280px,0.48fr)] lg:items-end lg:gap-10">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d6b26]">Digital editions</p>
              <h2 className="mt-3 text-3xl font-serif leading-tight text-slate-950 md:text-5xl">Ebook editions</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg md:leading-8">
                Choose a volume below and purchase the digital edition through Amazon Kindle or Apple Books. Kindle editions for Volumes 6 and 7 are still being revised by Amazon and will be added when available.
              </p>
            </div>

            <div className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#fbf7ef] p-4 md:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8d6b26]">Available now</p>
              <div className="mt-4 grid gap-3 min-[460px]:grid-cols-2 lg:grid-cols-1">
                <div className="flex min-h-16 items-center gap-3 rounded-lg bg-white p-3">
                  <AppleBooksLogo />
                  <div>
                    <p className="text-base font-serif leading-5 text-slate-950">{ebookAppleCount} volumes</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">On Apple Books</p>
                  </div>
                </div>
                <div className="flex min-h-16 items-center gap-3 rounded-lg bg-white p-3">
                  <KindleLogo />
                  <div>
                    <p className="text-base font-serif leading-5 text-slate-950">{ebookKindleCount} volumes</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">On Kindle now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:mt-10 lg:grid-cols-2">
            {ebookBooks.map((book) => (
              <article key={`${book.id}-ebook`} className="rounded-xl border border-[rgba(15,23,42,0.08)] bg-[#fbf7ef] p-4 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.28)]">
                <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 min-[520px]:grid-cols-[128px_minmax(0,1fr)]">
                  <img
                    src={book.ebookCoverImage ?? book.coverImage}
                    alt={`${book.title}, ${book.subtitle} ebook cover`}
                    className="aspect-[0.625] w-full rounded-lg object-cover shadow-[0_18px_34px_-26px_rgba(15,23,42,0.55)]"
                    loading="lazy"
                  />
                  <div className="min-w-0 py-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8d6b26]">Ebook edition</p>
                    <h3 className="mt-2 text-2xl font-serif leading-7 text-slate-950">{book.subtitle}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{book.title}</p>
                    {book.appleOnly ? (
                      <div className="mt-4">
                        <EbookStoreAction href={book.ebookLinks?.appleBooks} store="appleBooks" />
                      </div>
                    ) : (
                      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        <EbookStoreAction href={book.ebookLinks?.kindle} store="kindle" />
                        <EbookStoreAction href={book.ebookLinks?.appleBooks} store="appleBooks" />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
