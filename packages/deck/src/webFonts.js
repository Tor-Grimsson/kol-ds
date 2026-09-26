/**
 * webFonts — the families a text layer can carry (kol-olina's brand decks).
 *
 * `sans` and `mono` are the THEME's two families — whatever `--kol-font-family-sans` / `-mono`
 * resolve to in the app the deck runs in (Right Grotesk here, olina's own sans there). After them a
 * short curated Google list, so a co-branded deck is possible without turning the deck into a type
 * sampler. The list is data; lengthening it is one line.
 *
 * TWO PLACES A FAMILY HAS TO ARRIVE, and the second is the one that bites:
 *   1. the SCREEN — a stylesheet link, which `ensureFont` injects once.
 *   2. the EXPORT — a standalone SVG has no network, so the exporter inlines the actual woff2 as
 *      base64 (slideExport). `googleFontFaces` does it for a Google family; the theme's two are read
 *      off the page's own `@font-face` rules there.
 */
export const FONT_OPTIONS = [
  { value: 'sans', label: 'Sans (theme)' },
  { value: 'mono', label: 'Mono (theme)' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Instrument Serif', label: 'Instrument Serif' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Archivo', label: 'Archivo' },
  { value: 'Fraunces', label: 'Fraunces' },
]

const THEME = { sans: '--kol-font-family-sans', mono: '--kol-font-family-mono' }
export const isThemeFont = (v) => !v || v in THEME

/** The concrete family name for a layer's `font` — a theme key resolves through its CSS variable. */
export function familyFor(value) {
  const v = value || 'sans'
  if (!(v in THEME)) return v
  let stack = ''
  try { stack = getComputedStyle(document.documentElement).getPropertyValue(THEME[v]) } catch { /* no DOM */ }
  return stack.split(',')[0]?.trim().replace(/^["']|["']$/g, '') || (v === 'mono' ? 'monospace' : 'sans-serif')
}

const cssUrl = (family) =>
  `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:ital,wght@0,200..800;1,200..800&display=swap`

const injected = new Set()

/** Put a Google family on the PAGE. Idempotent; theme families are a no-op. */
export function ensureFont(value) {
  if (isThemeFont(value) || injected.has(value) || typeof document === 'undefined') return
  injected.add(value)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = cssUrl(value)
  link.dataset.deckFont = value
  document.head.appendChild(link)
}

const faceCache = new Map()
export const toBase64 = (buf) => {
  const bytes = new Uint8Array(buf)
  let s = ''
  /* chunked — String.fromCharCode(...bytes) blows the argument limit on a 200 kB font */
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s)
}

/**
 * `@font-face` rules with the woff2 INLINED, for a Google family on the export path. Google splits a
 * family into SUBSETS distinguished only by `unicode-range`, so whole blocks are kept and only their
 * `src` swapped — harvesting bare URLs picked cyrillic and rendered nothing (olina's export test).
 */
export async function googleFontFaces(value) {
  if (isThemeFont(value)) return ''
  if (faceCache.has(value)) return faceCache.get(value)
  const p = (async () => {
    const css = await (await fetch(cssUrl(value))).text()
    const blocks = [...css.matchAll(/@font-face\s*{[^}]*}/g)].map((m) => m[0])
    const latin = blocks.filter((b) => /U\+0000-00FF|U\+0100-02[0-9A-F]{2}/i.test(b))
    const wanted = (latin.length ? latin : blocks).slice(0, 2)
    const faces = await Promise.all(wanted.map(async (block) => {
      const url = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/)?.[1]
      if (!url) return ''
      const b64 = toBase64(await (await fetch(url)).arrayBuffer())
      return block.replace(/src:\s*url\([^)]+\)\s*format\([^)]+\)/, `src:url(data:font/woff2;base64,${b64}) format("woff2")`)
    }))
    return faces.filter(Boolean).join('')
  })().catch(() => '')   /* a font that will not load must not fail the export */
  faceCache.set(value, p)
  return p
}
