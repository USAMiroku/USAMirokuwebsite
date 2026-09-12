const MAX_SOURCE_BYTES = 12 * 1024 * 1024
const MAX_OUTPUT_DIMENSION = 2000

/** Validates a photo and re-encodes it in the browser as a WebP no larger than 2000px on its longest side. */
export async function optimizeImage(file: File): Promise<Blob> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.')
  }
  if (file.size > MAX_SOURCE_BYTES) throw new Error('The original image must be 12 MB or smaller.')

  const objectUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.decoding = 'async'
    image.src = objectUrl
    await image.decode()
    const scale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight))
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('This browser could not prepare the image.')
    context.drawImage(image, 0, 0, width, height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.86))
    if (!blob) throw new Error('This browser could not compress the image.')
    return blob
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
