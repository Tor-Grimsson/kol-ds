/**
 * svgExport — turn a finished SVG string into pixels, and embed the fonts it
 * needs so the export reads like the screen.
 *
 * Packaged 2026-09-04 (`export-and-history-want-packaging`, kol-fxr for
 * kol-client-olina, who had copied ~180 lines of it). **The BUILDER is
 * deliberately not here.** Assembling an SVG welds to an app's own layer
 * schema — slides in one editor, compose layers in another — so it was never
 * the reusable half. This takes a finished string and gives back a Blob.
 */

/**
 * Rasterize an SVG string to a PNG Blob at `scale`× the SVG's own dimensions.
 * Triggers no download.
 *
 * @param {string} svgString - A complete, self-contained SVG document
 * @param {number} [scale=1] - The @Nx multiplier
 * @param {number} [fallbackSize=1080] - Used when the SVG declares no intrinsic size
 * @returns {Promise<Blob>} the PNG
 */
export function svgToPngBlob(svgString, scale = 1, fallbackSize = 1080) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = (img.width || fallbackSize) * scale
      canvas.height = (img.height || fallbackSize) * scale
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      canvas.toBlob((pngBlob) => {
        if (pngBlob) resolve(pngBlob)
        else reject(new Error('PNG encode failed'))
      }, 'image/png')
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG rasterize failed')) }
    img.src = url
  })
}

const b64 = (buf) => {
  const bytes = new Uint8Array(buf)
  let bin = ''
  const CH = 0x8000
  for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH))
  return btoa(bin)
}

const FORMAT = { woff2: 'woff2', woff: 'woff', ttf: 'truetype', otf: 'opentype' }
const formatFor = (url) => FORMAT[(url.split('?')[0].split('.').pop() || '').toLowerCase()] ?? 'truetype'

/**
 * Inline every font a stylesheet references, by REWRITING its `@font-face`
 * blocks and swapping only the `src`.
 *
 * ⚠ **NEVER SYNTHESIZE A FACE.** This is the bug the seam exists to stop
 * (kol-client-olina, 2026-09-04): they harvested bare `url(...)` matches out
 * of Google's CSS and emitted their own `@font-face` without `unicode-range`.
 * Google splits ONE family into latin / latin-ext / cyrillic / greek subsets
 * that are distinguished by that range and nothing else — so the first subset
 * fetched got embedded, matched no glyph, and every family exported in a system
 * fallback while the screen looked perfect. Rewriting the whole block keeps
 * `unicode-range`, the weight and stretch ranges, and anything else the
 * foundry declared.
 *
 * A face that fails to fetch is REPORTED, not swallowed: a silent `catch {}`
 * is how the same export goes out in fallback with nothing to look at.
 *
 * @param {string} cssText - The stylesheet whose `@font-face` blocks to inline
 * @param {Function} [fetchFont] - `(url) => Promise<ArrayBuffer>`; defaults to `fetch`
 * @returns {Promise<{css: string, failed: Array<{url: string, error: Error}>}>} the rewritten CSS and every face that could not be embedded
 */
export async function inlineFontFaces(cssText, fetchFont) {
  const load = fetchFont ?? (async (url) => {
    const r = await fetch(url)
    if (!r.ok) throw new Error(`font fetch failed: ${r.status} ${url}`)
    return r.arrayBuffer()
  })

  const failed = []
  const blocks = [...cssText.matchAll(/@font-face\s*{[^}]*}/g)].map((m) => m[0])
  const urls = new Map()
  for (const block of blocks) {
    for (const m of block.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
      if (!m[1].startsWith('data:')) urls.set(m[1], null)
    }
  }

  await Promise.all([...urls.keys()].map(async (url) => {
    try {
      urls.set(url, `data:font/${formatFor(url)};base64,${b64(await load(url))}`)
    } catch (error) {
      failed.push({ url, error })
    }
  }))

  /* Only the `src` is touched — every other descriptor in the block, and
   * `unicode-range` above all, survives exactly as authored. */
  const css = cssText.replace(/url\(\s*['"]?([^'")]+)['"]?\s*\)(\s*format\(\s*['"]?[^'")]+['"]?\s*\))?/g,
    (whole, url) => {
      const data = urls.get(url)
      return data ? `url(${data}) format('${formatFor(url)}')` : whole
    })

  return { css, failed }
}

/**
 * Build one `@font-face` block for a SELF-HOSTED, full-range file — the only
 * case where synthesizing is safe, because there are no subsets to confuse.
 * Anything served as subsets (Google's families, any foundry CSS) must go
 * through `inlineFontFaces` instead.
 *
 * @param {{family: string, url: string, weight?: string, stretch?: string}} face
 * @param {Function} [fetchFont] - `(url) => Promise<ArrayBuffer>`
 * @returns {Promise<string>} the `@font-face` block, fonts inlined
 */
export async function embedFontFace({ family, url, weight = '1 1000', stretch = '1% 1000%' }, fetchFont) {
  const load = fetchFont ?? (async (u) => {
    const r = await fetch(u)
    if (!r.ok) throw new Error(`font fetch failed: ${r.status} ${u}`)
    return r.arrayBuffer()
  })
  const data = `data:font/${formatFor(url)};base64,${b64(await load(url))}`
  return `@font-face{font-family:'${family}';src:url(${data}) format('${formatFor(url)}');font-weight:${weight};font-stretch:${stretch};}`
}

/**
 * Download a Blob under a filename. The one place a DOM anchor is minted for
 * a save, so a consumer's export path does not hand-roll it.
 *
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
