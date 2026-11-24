// Font registry for the kinetic layer. Since 2026-11-18 Inter and Malromur are
// the editor's outline families (editor/modes/type/families.js): Inter one
// variable file (weight 100 to 900, italic its slnt axis), Malromur roman and
// italic variable files (weight 300 to 900), registered through families.js so
// kinetic and text layers draw the same faces. Rot and Gullhamrar are his TG
// variable fonts, kinetic's own as they always were. Axes read from each file's
// fvar (the 2026-11-12 exports, read 2026-11-18): Rot roman and italic wdth 64
// to 172 (default 100) and wght 100 to 900 (default 400); Gullhamrar and
// Malromur wght 300 to 900 (default 400). Every outline (the morph) parses
// through fontLoader's loadFontFile.
//
// Also owns the export font cache: base64 @font-face CSS pre-fetched at layer
// mount (warmFontCss) so build.js can embed fonts SYNCHRONOUSLY into the
// exported SVG (its layer walk is sync).

import { VARIABLE_FAMILIES, FAMILY_INTER, FAMILY_MALROMUR, ensureFamilyLoaded } from '../editor/modes/type/families.js'

const outline = (key, def) => {
  const f = VARIABLE_FAMILIES[key]
  return {
    key, label: f.label, family: f.css, url: f.roman, italicUrl: f.italic, slnt: f.slnt, outline: true,
    /* the CSS font-style an italic draws with: a slant family's oblique angle (families.js fontStyleFor) */
    italicStyle: f.slnt != null ? `oblique ${-f.slnt}deg` : 'italic',
    axes: [{ tag: 'wght', min: f.min, max: f.max, def }],
  }
}
const ROT = { key: 'rot', label: 'Rot', family: 'TG Rot', url: '/fonts/TG/TGRotVF.ttf', italicUrl: '/fonts/TG/TGRotItalicVF.ttf', axes: [{ tag: 'wdth', min: 64, max: 172, def: 100 }, { tag: 'wght', min: 100, max: 900, def: 400 }] }
const GULLHAMRAR = { key: 'gullhamrar', label: 'Gullhamrar', family: 'TG Gullhamrar', url: '/fonts/TG/TGGullhamrarVF.ttf', axes: [{ tag: 'wght', min: 300, max: 900, def: 400 }] }
export const FONTS = [outline(FAMILY_INTER, 400), outline(FAMILY_MALROMUR, 400), ROT, GULLHAMRAR]

/* Penrose's glyph shape (loops/penrose) offers the TG faces it always had: Rot, Malromur, Gullhamrar. */
export const TG_FACES = [ROT, FONTS[1], GULLHAMRAR]

export const FONT_OPTIONS = FONTS.map((f) => ({ value: f.key, label: f.label }))
export const AXIS_LABELS = { wght: 'Weight', wdth: 'Width', ital: 'Italic', slnt: 'Slant', opsz: 'Optical size' }
export const fontByKey = (k) => FONTS.find((f) => f.key === k) || FONTS[0]

// Default vf object for a font (each present axis at its default value).
export function defaultVf(font) {
  const out = {}
  for (const a of font.axes) out[a.tag] = a.def
  return out
}

// vf object → `'wght' 600, 'wdth' 120` (a font-variation-settings string).
export function vfString(vf) {
  const parts = Object.entries(vf || {}).map(([tag, val]) => `'${tag}' ${Math.round(val * 100) / 100}`)
  return parts.length ? parts.join(', ') : 'normal'
}

// Register every face via FontFace: the outline families through families.js,
// Rot and Gullhamrar here, with their variable ranges. Idempotent.
let started = false
export async function loadFonts() {
  if (started || typeof FontFace === 'undefined') return
  started = true
  for (const f of FONTS) if (f.outline) ensureFamilyLoaded(f.key)
  for (const f of FONTS) {
    if (f.outline) continue
    const desc = {}
    const wght = f.axes.find((a) => a.tag === 'wght')
    const wdth = f.axes.find((a) => a.tag === 'wdth')
    if (wght) desc.weight = `${wght.min} ${wght.max}`
    if (wdth) desc.stretch = `${wdth.min}% ${wdth.max}%`
    /* Rot's italic is its own variable file, registered as the italic face */
    for (const [url, style] of [[f.url, 'normal'], ...(f.italicUrl ? [[f.italicUrl, 'italic']] : [])]) {
      try {
        const ff = new FontFace(f.family, `url(${url})`, { ...desc, style })
        document.fonts.add(ff)
        ff.load().catch(() => {})
      } catch { /* ignore */ }
    }
  }
  try { await document.fonts.ready } catch { /* ignore */ }
}

// ── export font embedding ────────────────────────────────────────────────
import { embedFontFace } from '@kolkrabbi/kol-component'

/* Each face the kinetic fonts draw with: Inter's one file over its oblique
 * range, Malromur's and Rot's roman and italic files, Gullhamrar's one file. */
const FACES = FONTS.flatMap((f) => (f.slnt != null
  ? [{ font: f, url: f.url, style: `oblique 0deg ${-f.slnt}deg`, italic: null }]
  : f.italicUrl
    ? [{ font: f, url: f.url, style: 'normal', italic: false }, { font: f, url: f.italicUrl, style: 'italic', italic: true }]
    : [{ font: f, url: f.url, style: 'normal', italic: null }]))
const faceKey = (face) => `${face.url}|${face.style}`

// face → @font-face css with the font inlined as a base64 data URI. Warmed
// async at layer mount; read sync at export time; fetched once per session.
const cssCache = new Map()
let warming = null

export function warmFontCss() {
  if (warming) return warming
  warming = Promise.all(FACES.map(async (face) => {
    if (cssCache.has(faceKey(face))) return
    try {
      /* `embedFontFace` is the DS's synthesize path and it is only safe for a
       * SELF-HOSTED, FULL-RANGE file — which every face in FONTS is. The day a
       * subsetted or Google-hosted family joins this list it must go through
       * `inlineFontFaces` instead: a synthesized block has no `unicode-range`,
       * so one subset gets embedded, matches no glyph, and the export renders
       * in a system fallback while the screen looks perfect
       * (export-and-history-want-packaging, kol-client-olina 2026-09-04). */
      const w = face.font.axes.find((a) => a.tag === 'wght')
      const css = await embedFontFace({ family: face.font.family, url: face.url, weight: `${w.min} ${w.max}` })
      cssCache.set(faceKey(face), css.replace(/}$/, `font-style:${face.style};}`))
    } catch (error) {
      /* NOT a silent catch. The export still falls back for this face, but a
       * failed fetch that says nothing is exactly how olina shipped an export
       * with no embedded type and no way to see it. */
      console.warn(`[design-editor] font not embedded, export will fall back for ${face.font.family}:`, error)
    }
  }))
  return warming
}

// Sync: joined @font-face css for every face the composition uses (empty
// string until warmFontCss has resolved — export then falls back to whatever
// the rasterizer has, same trade-off as the raster-snapshot idiom).
export function kineticFontCss(comp) {
  const keys = new Set()
  for (const inst of comp?.instances ?? []) {
    const f = fontByKey(inst.font)
    for (const face of FACES) if (face.font === f && (face.italic === null || face.italic === !!inst.italic)) keys.add(faceKey(face))
  }
  return [...keys].map((k) => cssCache.get(k)).filter(Boolean).join('\n')
}
