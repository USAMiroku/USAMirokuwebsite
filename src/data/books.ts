export type BookStatus = 'available' | 'coming-soon'

export type Book = {
  id: string
  volume: number
  title: string
  subtitle: string
  description: string
  coverImage: string
  status: BookStatus
  purchaseUrl?: string
  qrImage?: string
  ebookCoverImage?: string
  appleOnly?: boolean
  printEdition?: boolean
  ebookLinks?: {
    kindle?: string
    appleBooks?: string
  }
}

export const books: Book[] = [
  {
    id: 'teachings-meishu-sama-volume-1',
    volume: 1,
    title: 'Teachings of Meishu-sama',
    subtitle: 'Volume 1',
    description:
      'The first volume in the Teachings of Meishu-sama collection, prepared for study, reflection, and the deepening of faith.',
    coverImage: '/images/books/teachings-meishu-sama-volume-1.jpeg',
    status: 'available',
    purchaseUrl: 'https://shop.ingramspark.com/b/084?params=gTKR43qnoBVgZVFfxrj80xHrVhzFjWQOx3FSxJot9aR',
    qrImage: '/images/books/teachings-meishu-sama-volume-1-qr.png',
    ebookCoverImage: '/images/books/ebooks/teachings-meishu-sama-ebook-volume-1.jpeg',
    ebookLinks: {
      kindle: 'https://www.amazon.com/dp/B0H859XVMY',
      appleBooks: 'http://books.apple.com/us/book/id6788813522',
    },
  },
  {
    id: 'teachings-meishu-sama-volume-2',
    volume: 2,
    title: 'Teachings of Meishu-sama',
    subtitle: 'Volume 2',
    description:
      'Another volume in the Teachings of Meishu-sama collection, prepared for study, reflection, and the deepening of faith.',
    coverImage: '/images/books/teachings-meishu-sama-volume-2.jpeg',
    status: 'available',
    purchaseUrl: 'https://shop.ingramspark.com/b/084?params=3phgWoopXsy6xy3B2NftNnszSI1EhirSLVDBvximAEK',
    ebookCoverImage: '/images/books/ebooks/teachings-meishu-sama-ebook-volume-2.jpeg',
    ebookLinks: {
      kindle: 'https://www.amazon.com/Teachings-Meishu-sama-2-Meishu-sama-ebook/dp/B0H84PPHXM?ref_=saga_dp_bnx_dsk_dp',
      appleBooks: 'http://books.apple.com/us/book/id6788922281',
    },
  },
  {
    id: 'teachings-meishu-sama-volume-3',
    volume: 3,
    title: 'Teachings of Meishu-sama',
    subtitle: 'Volume 3',
    description:
      'Another volume in the Teachings of Meishu-sama collection, prepared for study, reflection, and the deepening of faith.',
    coverImage: '/images/books/teachings-meishu-sama-volume-3.jpeg',
    status: 'available',
    purchaseUrl: 'https://shop.ingramspark.com/b/084?params=H1u0agBoVeu27oGxk43PRhXUQ4njibh0HLxuMlcowWL',
    ebookCoverImage: '/images/books/ebooks/teachings-meishu-sama-ebook-volume-3.jpeg',
    ebookLinks: {
      kindle: 'https://www.amazon.com/Teachings-Meishu-sama-Meishu-sama-ebook/dp/B0H852ZCZP?ref_=saga_dp_bnx_dsk_dp',
      appleBooks: 'http://books.apple.com/us/book/id6788917385',
    },
  },
  {
    id: 'teachings-meishu-sama-volume-4',
    volume: 4,
    title: 'Teachings of Meishu-sama',
    subtitle: 'Volume 4',
    description:
      'Another volume in the Teachings of Meishu-sama collection, prepared for study, reflection, and the deepening of faith.',
    coverImage: '/images/books/teachings-meishu-sama-volume-4.jpeg',
    status: 'available',
    purchaseUrl: 'https://shop.ingramspark.com/b/084?params=q8oWPbO03Ivw8j79X58BzCJUBoIEKVZDjFZW9b3IRdm',
    ebookCoverImage: '/images/books/ebooks/teachings-meishu-sama-ebook-volume-4.jpeg',
    ebookLinks: {
      kindle: 'https://www.amazon.com/Teachings-Meishu-sama-4-Meishu-sama-ebook/dp/B0H85GZLB9?ref_=saga_dp_bnx_dsk_dp',
      appleBooks: 'http://books.apple.com/us/book/id6788923778',
    },
  },
  {
    id: 'teachings-meishu-sama-volume-5',
    volume: 5,
    title: 'Teachings of Meishu-sama',
    subtitle: 'Volume 5',
    description:
      'Another volume in the Teachings of Meishu-sama collection, prepared for study, reflection, and the deepening of faith.',
    coverImage: '/images/books/teachings-meishu-sama-volume-5.jpeg',
    status: 'available',
    purchaseUrl: 'https://shop.ingramspark.com/b/084?params=cQuTfdwWwELco81gqqnPvlPSn1ZlIlqPX0e4QM7zF1f',
    ebookCoverImage: '/images/books/ebooks/teachings-meishu-sama-ebook-volume-5.jpeg',
    ebookLinks: {
      kindle: 'https://www.amazon.com/Teachings-Meishu-sama-5-Meishu-sama-ebook/dp/B0H85FL8QV?ref_=saga_dp_bnx_dsk_dp',
      appleBooks: 'http://books.apple.com/us/book/id6788931867',
    },
  },
  {
    id: 'teachings-meishu-sama-volume-6',
    volume: 6,
    title: 'Teachings of Meishu-sama',
    subtitle: 'Volume 6',
    description:
      'Another volume in the Teachings of Meishu-sama collection, prepared for study, reflection, and the deepening of faith.',
    coverImage: '/images/books/teachings-meishu-sama-volume-6.jpeg',
    status: 'available',
    purchaseUrl: 'https://shop.ingramspark.com/b/084?params=pq8qjjwZks3sLja4TZjKk2z9W6fzavMmI5b7adTgFIw',
    ebookCoverImage: '/images/books/ebooks/teachings-meishu-sama-ebook-volume-6.jpeg',
    ebookLinks: {
      appleBooks: 'http://books.apple.com/us/book/id6788937669',
    },
  },
  {
    id: 'teachings-meishu-sama-volume-7',
    volume: 7,
    title: 'Teachings of Meishu-sama',
    subtitle: 'Volume 7',
    description:
      'Another volume in the Teachings of Meishu-sama collection, prepared for study, reflection, and the deepening of faith.',
    coverImage: '/images/books/teachings-meishu-sama-volume-7.jpeg',
    status: 'available',
    purchaseUrl: 'https://shop.ingramspark.com/b/084?params=364hk9rcAspFNcRWrDXIPBzPjYlsLHIlYwU4tSW8G5s',
    ebookCoverImage: '/images/books/ebooks/teachings-meishu-sama-ebook-volume-7.jpeg',
    ebookLinks: {
      appleBooks: 'http://books.apple.com/us/book/id6789254257',
    },
  },
  {
    id: 'our-daily-bread-volume-1',
    volume: 1,
    title: 'Teachings of Meishu-sama',
    subtitle: 'Our Daily Bread — Volume 1',
    description:
      'A daily companion of Meishu-sama’s teachings — short readings for peace and spiritual growth, one for every day.',
    coverImage: '/images/books/our-daily-bread-volume-1.jpeg',
    status: 'coming-soon',
    ebookCoverImage: '/images/books/ebooks/our-daily-bread-ebook-volume-1.jpeg',
    appleOnly: true,
    ebookLinks: {
      appleBooks: 'http://books.apple.com/us/book/id6795384289',
    },
  },
  {
    id: 'our-daily-bread-volume-2',
    volume: 2,
    title: 'Teachings of Meishu-sama',
    subtitle: 'Our Daily Bread — Volume 2',
    description:
      'A daily companion of Meishu-sama’s teachings — short readings for peace and spiritual growth, one for every day.',
    coverImage: '/images/books/our-daily-bread-volume-2.jpeg',
    status: 'coming-soon',
    ebookCoverImage: '/images/books/ebooks/our-daily-bread-ebook-volume-2.jpeg',
    appleOnly: true,
    ebookLinks: {
      appleBooks: 'http://books.apple.com/us/book/id6795395962',
    },
  },
  {
    id: 'reminiscences-about-meishu-sama-volume-1',
    volume: 1,
    title: 'Teachings of Meishu-sama',
    subtitle: 'Reminiscences About Meishu-sama — Volume 1',
    description:
      'Personal recollections and accounts of Meishu-sama, offered for reflection and the deepening of faith.',
    coverImage: '/images/books/reminiscences-about-meishu-sama-volume-1.jpeg',
    status: 'coming-soon',
    ebookCoverImage: '/images/books/ebooks/reminiscences-about-meishu-sama-ebook-volume-1.jpeg',
    appleOnly: true,
    ebookLinks: {
      appleBooks: 'http://books.apple.com/us/book/id6795423026',
    },
  },
]
