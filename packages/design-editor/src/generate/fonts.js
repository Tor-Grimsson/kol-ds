/* GENERATE — the font registry (plan 53 § 2.1). The core is synchronous and pure, so fonts come IN: the
 * editor loads a cut (fontLoader, async) and registers the parsed opentype Font; the Node scripts register
 * it from the file. A glyph's rings are cached per font + character, in an em box (x 0..advance/em,
 * y 0..1 from the ascender line down). An unregistered font falls back to the pixel font. */
import { flattenD } from './path.js'
import { pixelRings } from './glyphs.js'

const fonts = new Map()
const cache = new Map()

export function registerFont(key, font) {
  fonts.set(key, font)
  for (const k of [...cache.keys()]) if (k.startsWith(`${key}|`)) cache.delete(k)
}
export const hasFont = (key) => fonts.has(key)

/* { rings, advance } — advance in em; pixel glyphs are 5/7 wide */
export function glyph(key, ch) {
  const ck = `${key}|${ch}`
  if (cache.has(ck)) return cache.get(ck)
  const font = fonts.get(key)
  let out
  if (!font || key === 'pixel') {
    out = { rings: pixelRings(ch), advance: 5 / 7 }
  } else {
    const em = font.unitsPerEm, asc = font.ascender, desc = -font.descender
    const g = font.charToGlyph(ch)
    /* getPath(x, baseline, size): size = em units → path in font units, y down from the baseline */
    const d = g.getPath(0, asc, em).toPathData(2)
    const h = asc + desc
    out = { rings: flattenD(d, 4).map((r) => r.map(([x, y]) => [x / h, y / h])), advance: (g.advanceWidth || em * 0.6) / h }
  }
  cache.set(ck, out)
  return out
}
