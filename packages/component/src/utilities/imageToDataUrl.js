/**
 * imageToDataUrl — a picked image file as a small data URL, for a card's cover (the file rail's Upload
 * image, 2026-10-24 — plan home-library-detail-one-card 2.2). Decodes the file, fits it inside `max`
 * on its longer side, encodes webp at `quality`. What the editor's `captureThumb` writes for a save,
 * for a picture the user supplies.
 *
 * @param {File}   file
 * @param {Object} [opts]
 * @param {number} [opts.max=640]      the longer side, px
 * @param {number} [opts.quality=0.82]
 * @returns {Promise<string>} `data:image/webp;base64,…`
 */
export default async function imageToDataUrl(file, { max = 640, quality = 0.82 } = {}) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()
  return canvas.toDataURL('image/webp', quality)
}

/** pickImage — opens the file chooser for one image and resolves with its data URL, or null when cancelled. */
export function pickImage(opts) {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const f = input.files?.[0]
      resolve(f ? await imageToDataUrl(f, opts).catch(() => null) : null)
    }
    input.oncancel = () => resolve(null)
    input.click()
  })
}
