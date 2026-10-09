/**
 * prepareUpload — one dropped file → the objects to put (upload-dialog-optimise-and-keep-originals,
 * kol-website 2026-10-09). kol-client-olina's recipe (`apps/media/src/lib/upload.js`, studio16's
 * img-web-batch.sh on a canvas), lifted when a second consumer arrived, as
 * `docs/documentation/04-compositions/15-media-uploads.md` said it would be.
 *
 *   import { isOptimisable, prepareUpload } from '@kolkrabbi/kol-media-client'
 *   const ask = files.some(isOptimisable)          // only then show the dialog
 *   for (const f of files)
 *     for (const { key, blob, thumb } of await prepareUpload(f, { folder, optimise, keepOriginals }))
 *       await put(key, blob, thumb)                // the consumer puts, then re-lists
 *
 * PURE: it never uploads. Browser-only past the pass-through paths (canvas, createImageBitmap).
 *
 * The recipe, unchanged: slugged name · stills ≤2560 wide, never enlarged · quality 0.9 → 0.4
 * until ≤500 KB (then a smaller width, if 0.4 is not enough) · an already-web still untouched · video / SVG / GIF / undecodable pass through ·
 * a video's 96px thumb taken at 0.5s.
 *
 * ONE CHANGE: alpha is never flattened. olina put every still on white as a JPEG; kol-website's
 * bucket holds render output where the alpha is the point. A still with a transparent pixel is
 * re-encoded as WebP with its alpha. (Any still already ≤2560 wide and ≤500 KB is left as it is.)
 */

const MAX_W = 2560
const MAX_BYTES = 500 * 1024
const QUALITIES = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4]
/* stills a browser can re-encode; GIF (animation) and SVG (vector) go up untouched */
const RASTER = /^image\/(jpeg|png|webp|avif|bmp|tiff|heic|heif)$/
/* the formats that can carry alpha */
const ALPHA_CAPABLE = /^image\/(png|webp|avif|tiff)$/

const slug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '')
const at = (...parts) => parts.filter(Boolean).join('/')
const splitName = (name) => {
  const i = name.lastIndexOf('.')
  return i > 0 ? [name.slice(0, i), name.slice(i + 1)] : [name, '']
}

/** `*HERO.png` → `hero.png` — slugged, extension kept. */
export const cleanName = (name) => {
  const [base, ext] = splitName(name)
  return (slug(base) || 'file') + (ext ? `.${slug(ext)}` : '')
}

/** Would `prepareUpload` re-encode this file? Cheap — the type only; ask the question when any file says yes. */
export const isOptimisable = (file) => RASTER.test(file?.type ?? '')

const hasAlpha = (ctx, w, h) => {
  const d = ctx.getImageData(0, 0, w, h).data
  for (let i = 3; i < d.length; i += 4) if (d[i] < 255) return true
  return false
}

/* quality 0.9 → 0.4 until ≤500 KB (olina's jpeg:extent). One addition: a frame that is still over
 * at 0.4 — noise, grain, a dense render — steps its width down by a fifth and tries again, so
 * ≤500 KB holds for every still, not only the ones that compress (floor: 640 wide). */
const encode = async (canvas, type) => {
  let blob
  for (let src = canvas; ; ) {
    for (const q of QUALITIES) {
      blob = await new Promise((r) => src.toBlob(r, type, q))
      if (!blob || blob.size <= MAX_BYTES) return blob
    }
    if (src.width * 0.8 < 640) return blob
    const next = document.createElement('canvas')
    next.width = Math.round(src.width * 0.8)
    next.height = Math.round(src.height * 0.8)
    const ctx = next.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(src, 0, 0, next.width, next.height)
    src = next
  }
}

/* → { blob, ext } for the web copy, or null when the file is already web-sized (or undecodable) */
async function toWeb(file) {
  const bmp = await createImageBitmap(file)
  /* already web-sized — ANY still, not only a JPEG: olina's JPEG-only skip turned a 224 KB PNG
   * into a 409 KB JPEG (measured 2026-10-09), a web copy larger than its original */
  if (file.size <= MAX_BYTES && bmp.width <= MAX_W) { bmp.close(); return null }
  const scale = Math.min(1, MAX_W / bmp.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  bmp.close()
  if (ALPHA_CAPABLE.test(file.type) && hasAlpha(ctx, canvas.width, canvas.height)) {
    const blob = await encode(canvas, 'image/webp')
    /* a browser that cannot encode WebP hands back PNG — still lossless, still alpha */
    return blob && { blob, ext: blob.type === 'image/webp' ? 'webp' : 'png' }
  }
  /* opaque: olina's JPEG; the white ground only matters under a pixel that is not fully opaque */
  ctx.globalCompositeOperation = 'destination-over'
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const blob = await encode(canvas, 'image/jpeg')
  return blob && { blob, ext: 'jpg' }
}

/** A video's picture in a list: one frame, 96px, as a JPEG data URL ≤12k. null when it can't decode. */
export async function videoThumb(file) {
  let url
  try {
    url = URL.createObjectURL(file)
    const v = document.createElement('video')
    v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url
    const once = (ev) => new Promise((res, rej) => {
      v.addEventListener(ev, res, { once: true })
      v.addEventListener('error', () => rej(new Error('video decode')), { once: true })
      setTimeout(() => rej(new Error('video timeout')), 8000)
    })
    await once('loadedmetadata')
    const seeked = once('seeked')
    v.currentTime = Math.min(0.5, (v.duration || 1) / 2)
    await seeked
    const scale = 96 / Math.max(v.videoWidth, v.videoHeight)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(v.videoWidth * scale))
    canvas.height = Math.max(1, Math.round(v.videoHeight * scale))
    canvas.getContext('2d').drawImage(v, 0, 0, canvas.width, canvas.height)
    for (const q of [0.6, 0.4, 0.25]) {
      const out = canvas.toDataURL('image/jpeg', q)
      if (out.length <= 12000) return out
    }
    return null
  } catch {
    return null
  } finally {
    if (url) URL.revokeObjectURL(url)
  }
}

/**
 * One file → `[{ key, blob, thumb? }]`, the objects to put.
 *   folder         '' or 'a/b' (slashes trimmed)
 *   optimise       re-encode a still to its web copy (default true); off = the file as is
 *   keepOriginals  with a web copy, also put the untouched file at `<folder>/original/<name>`
 * A file nothing is done to — not a still, already web-sized, undecodable, or `optimise` off — is
 * one object under its clean name; a video carries `thumb`.
 */
export async function prepareUpload(file, { folder = '', optimise = true, keepOriginals = true } = {}) {
  const dir = String(folder).replace(/^\/+|\/+$/g, '')
  const name = cleanName(file.name ?? 'file')
  const asIs = [{ key: at(dir, name), blob: file, ...((file.type ?? '').startsWith('video/') ? { thumb: await videoThumb(file) } : null) }]
  if (!optimise || !isOptimisable(file)) return asIs
  const web = await toWeb(file).catch(() => null)
  if (!web) return asIs
  return [
    ...(keepOriginals ? [{ key: at(dir, 'original', name), blob: file }] : []),
    { key: at(dir, `${splitName(name)[0]}.${web.ext}`), blob: web.blob },
  ]
}
