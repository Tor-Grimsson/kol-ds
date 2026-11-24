/* Your own picture as a field (C7): a loop that reads a shape or an image gets a 0 to 1 value per point from here.
 * Source: one of the vector shapes, a pasted SVG, or an image by its address (a link or a pasted data URL); `invert`
 * flips it and `soften` blurs it (a shape's hard edge becomes a slope a relief or a warp can read). The field is baked
 * once per source at `RES` and cached; an SVG or an image arrives on a later frame (null until then). Contain fit. */
import { VECTOR_SHAPES, rasterizeShape, rasterizeSvg } from '../penrose/shapes.js'

const RES = 192
const cache = new Map()

export const SOURCE_OPTIONS = [
  ...VECTOR_SHAPES.map((s) => ({ value: s.id, label: s.label })),
  { value: 'custom', label: 'Custom SVG' },
  { value: 'image', label: 'Image' },
]

/* the rows a loop adds for its source, in one section */
export const sourceParams = (section = 'Source', def = 'circle') => [
  { key: 'fieldSource', label: 'Source', type: 'select', default: def, options: SOURCE_OPTIONS, noRandom: true, section },
  { key: 'fieldImage', label: 'Image address', type: 'text', rows: 2, default: '', placeholder: 'https://… or data:image/…', noRandom: true, when: (l) => l.fieldSource === 'image', section },
  { key: 'customSvg', label: 'SVG code', type: 'text', rows: 4, default: '', placeholder: '<svg viewBox="0 0 24 24"><path d="…"/></svg>', noRandom: true, when: (l) => l.fieldSource === 'custom', section },
  { key: 'fieldSoften', label: 'Soften', type: 'range', min: 0, max: 0.2, step: 0.005, default: 0.04, section },
  { key: 'fieldInvert', label: 'Invert', type: 'toggle', default: false, section },
]

function blur(a, n, r) {
  if (r < 1) return a
  const tmp = new Float32Array(n * n), out = new Float32Array(n * n)
  for (let pass = 0; pass < 2; pass++) {
    const src = pass ? tmp : a, dst = pass ? out : tmp
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      let s = 0, c = 0
      for (let k = -r; k <= r; k++) {
        const xx = pass ? x : x + k, yy = pass ? y + k : y
        if (xx < 0 || yy < 0 || xx >= n || yy >= n) continue
        s += src[yy * n + xx]; c++
      }
      dst[y * n + x] = s / c
    }
  }
  return out
}

function loadImage(src, n) {
  return new Promise((res, rej) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = n; c.height = n
      const g = c.getContext('2d', { willReadFrequently: true })
      const k = Math.min(n / img.naturalWidth, n / img.naturalHeight), dw = img.naturalWidth * k, dh = img.naturalHeight * k
      g.drawImage(img, (n - dw) / 2, (n - dh) / 2, dw, dh)
      const px = g.getImageData(0, 0, n, n).data, out = new Float32Array(n * n)
      for (let i = 0; i < n * n; i++) out[i] = ((0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255) * (px[i * 4 + 3] / 255)
      res(out)
    }
    img.onerror = rej
    img.src = src
  })
}

/* the field for these params: a sampler (x, y in 0 to 1) → 0 to 1, or null while an SVG or image is still loading */
export function sourceField(p) {
  const kind = p.fieldSource || 'circle'
  const key = [kind, kind === 'image' ? p.fieldImage : kind === 'custom' ? p.customSvg : '', p.fieldSoften, !!(p.fieldInvert === true || p.fieldInvert === 'true')].join('|')
  let e = cache.get(key)
  if (!e) {
    e = { data: null }
    cache.set(key, e)
    const done = (raw) => {
      let a = raw instanceof Float32Array ? raw : Float32Array.from(raw)
      a = blur(a, RES, Math.round((p.fieldSoften || 0) * RES))
      if (p.fieldInvert === true || p.fieldInvert === 'true') a = a.map((v) => 1 - v)
      e.data = a
    }
    if (kind === 'image') { if (p.fieldImage) loadImage(p.fieldImage, RES).then(done).catch(() => {}) }
    else if (kind === 'custom') { if (p.customSvg) rasterizeSvg(p.customSvg, RES, RES).then(done).catch(() => {}) }
    else done(rasterizeShape(kind, RES, RES))
  }
  const a = e.data
  if (!a) return null
  return (x, y) => {
    const fx = Math.max(0, Math.min(RES - 1.001, x * RES - 0.5)), fy = Math.max(0, Math.min(RES - 1.001, y * RES - 0.5))
    const i = Math.floor(fx), j = Math.floor(fy), u = fx - i, v = fy - j, o = j * RES + i
    return (a[o] * (1 - u) + a[o + 1] * u) * (1 - v) + (a[o + RES] * (1 - u) + a[o + RES + 1] * u) * v
  }
}
