/* ASCII — `fields/`, `data/`, `patterns/text·type` (plan 53 W2). His sheets started as ASCII in Figma.
 * A character grid: each cell picks a glyph from an ordered RAMP by the field's brightness (" .:-=+*#%@"
 * dark → bright), drawn as a vector outline from a registered font or the pixel font. Text mode lays a
 * string (or random letters) where the field is below Text below, and the ramp above it — his asterisk
 * regions in a page of words. Size by field scales each glyph instead of swapping it (type). */
import { compound } from '../geom.js'
import { glyph } from '../fonts.js'

const rnd = (i, seed) => {
  let h = Math.imul(i + 1, 2654435761) ^ Math.imul(seed + 5, 40503)
  h = Math.imul(h ^ (h >>> 15), 2246822519); h ^= h >>> 13
  return (h >>> 0) / 4294967296
}
export const RAMPS = {
  classic: ' .:-=+*#%@',
  blocks: ' .:░▒▓█',
  dots: ' .·•●',
  data: ' .-|=#',
  glyphs: ' ·+x*#',
}
/* the glyph a brightness picks: ramp[floor(f · n)], clamped — brighter never picks an earlier glyph */
export const pickChar = (ramp, f) => ramp[Math.min(ramp.length - 1, Math.max(0, Math.floor(f * ramp.length)))]

export const ASCII_FONTS = [
  { value: 'pixel', label: 'Pixel' },
  { value: 'rg-base-900', label: 'Right Grotesk Black' },
  { value: 'rg-Compact-700', label: 'Right Grotesk Compact Bold' },
  { value: 'rg-Tight-700', label: 'Right Grotesk Tight Bold' },
  { value: 'rg-Wide-900', label: 'Right Grotesk Wide Black' },
]

export default {
  id: 'ascii',
  label: 'ASCII',
  about: 'ASCII — a character grid; each cell’s glyph is picked from a ramp by the field’s brightness',
  sampled: true,
  hold: ['cols', 'cell', 'font', 'ramp', 'text', 'letters', 'word'],
  schema: [
    { key: 'font', label: 'Font', type: 'select', default: 'pixel', options: ASCII_FONTS, section: 'Characters' },
    { key: 'ramp', label: 'Ramp', type: 'text', default: RAMPS.classic, placeholder: 'dark → bright', section: 'Characters' },
    { key: 'rampPreset', label: 'Ramp preset', type: 'select', default: '', section: 'Characters',
      options: [{ value: '', label: 'Custom' }, ...Object.entries(RAMPS).map(([value, r]) => ({ value, label: `${value}  ${r.trim()}` }))] },
    { key: 'reverse', label: 'Reverse ramp', type: 'toggle', default: false, section: 'Characters' },
    { key: 'sizeBy', label: 'Size by field', type: 'toggle', default: false, section: 'Characters' },
    { key: 'sizeMin', label: 'Smallest', type: 'range', min: 0, max: 1.5, step: 0.01, default: 0.2, format: (v) => `${Math.round(v * 100)}%`, section: 'Characters', when: (l) => !!l.sizeBy },
    /* Fill cell: each glyph stretched to its cell, so full blocks butt into solid areas (his fields) */
    { key: 'fitCell', label: 'Fill cell', type: 'toggle', default: false, section: 'Characters' },
    { key: 'scale', label: 'Glyph scale', type: 'range', min: 0.2, max: 2, step: 0.01, default: 1, format: (v) => `${Math.round(v * 100)}%`, section: 'Characters' },
    { key: 'cols', label: 'Columns', type: 'range', min: 4, max: 240, step: 1, default: 60, animatable: false, section: 'Grid' },
    { key: 'cell', label: 'Cell height', type: 'range', min: 0.5, max: 3, step: 0.01, default: 1.4, format: (v) => `${v}×`, section: 'Grid' },
    { key: 'text', label: 'Text', type: 'text', default: '', placeholder: 'words where the field is low', section: 'Text' },
    { key: 'letters', label: 'Random letters', type: 'text', default: '', placeholder: 'SWEHTIL', section: 'Text' },
    { key: 'word', label: 'Word', type: 'range', min: 0, max: 12, step: 1, default: 0, format: (v) => (v ? `${v} letters` : 'No spaces'), section: 'Text' },
    { key: 'textBelow', label: 'Text below', type: 'range', min: 0, max: 1, step: 0.01, default: 0, format: (v) => `${Math.round(v * 100)}%`, section: 'Text' },
    { key: 'seed', label: 'Seed', type: 'range', min: 1, max: 99, step: 1, default: 1, section: 'Text' },
  ],
  draw(m, p, box, { field, mask, warp }) {
    const cols = Math.max(1, Math.round(p.cols ?? 60))
    const cw = box.w / cols, ch = cw * (p.cell ?? 1.4)
    const rows = Math.max(1, Math.floor(box.h / ch))
    const oy = (box.h - rows * ch) / 2
    let ramp = [...(RAMPS[p.rampPreset] ?? p.ramp ?? RAMPS.classic)]
    if (p.reverse) ramp = ramp.reverse()
    const font = p.font ?? 'pixel'
    const text = [...(p.text ?? '')], letters = [...(p.letters ?? '')]
    const word = Math.round(p.word ?? 0), tb = p.textBelow ?? 0, seed = p.seed ?? 1
    const scale = p.scale ?? 1
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i
        let u = (i + 0.5) / cols, v = (oy + (j + 0.5) * ch) / box.h
        let fu = u, fv = v
        if (warp) {
          const [wu, wv] = warp(u, v)
          if (p.wTarget === 'field') { fu = wu; fv = wv } else { u = fu = wu; v = fv = wv }
        }
        if (!mask(u, v)) continue
        const f = field(fu, fv)
        let c
        if ((text.length || letters.length) && f < tb) {
          if (word > 0 && i % (word + 1) === word) continue
          c = text.length ? text[k % text.length] : letters[Math.floor(rnd(k, seed) * letters.length)]
        } else {
          const ff = tb > 0 && (text.length || letters.length) ? (f - tb) / (1 - tb) : f
          c = p.sizeBy ? ramp[ramp.length - 1] : pickChar(ramp, ff)
        }
        if (!c || c === ' ') continue
        const g = glyph(font, c)
        if (!g.rings.length) continue
        const s = (p.sizeBy ? (p.sizeMin ?? 0.2) + (1 - (p.sizeMin ?? 0.2)) * f : 1) * scale
        const eh = ch * s, ew = p.fitCell ? cw * s : g.advance * eh
        const sx = p.fitCell ? ew / Math.max(1e-6, g.advance) : eh
        const x0 = box.x + u * box.w - ew / 2, y0 = box.y + v * box.h - eh / 2
        compound(m, g.rings.map((r) => r.map(([x, y]) => [x0 + x * sx, y0 + y * eh])))
      }
    }
  },
}
