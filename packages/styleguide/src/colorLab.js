/**
 * colorLab — the math behind ColorLab: ONE base colour → a palette of 2–8, each colour given its job by how it looks.
 *
 * THE ENGINE IS KOL-FXR'S (BrandLabToolWindow, kol-atlas 2026-10-29 — the user, in the kol-fxr session: *"the color should
 * not need all those slots to generate, it just needs one. and why is background first?"*): kol-fxr's Color Modes palette
 * (`src/editor/color/palette.js`), carried here so the lab and fxr build the same way.
 *
 *   Generate  in OKLCH, so equal lightness reads as equal whatever the hue. Colour 1 is the base, exactly; the others take
 *             the relation's hue offsets off the base's hue (KOL's HARMONIES, plus Monochromatic and Random). From three
 *             colours up there is one ground near black and one ink near white; the rest spread through the middle.
 *   Roles     assigned AFTER generating, by look: Background = the darkest, Ink = the lightest, Accent = the most saturated
 *             of the rest, Dim = the least saturated of what is left, Warm = the next. Two colours give Background and Ink.
 *   Roll      a seeded rng — the same seed and inputs give the same palette; locked colours keep their place.
 *   Check     every colour's WCAG contrast against the ground (the ground's own: the ink on it), with its grade.
 *   Ink       the brand's text levels — the Ink at KOL's opacities over the Background, each graded.
 *
 * The 0.17.0 model (four slots, ten hues, 60/30/10 picks) is gone from the lab; `blendRamp` and `neutralRamp` stay.
 */
import { HARMONIES } from '@kolkrabbi/kol-component'

/* ── OKLCH (Björn Ottosson's OKLab matrices; an out-of-gamut colour keeps L and h and gives up chroma until it fits) ── */
const toLin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
const rgbOf = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
const fromLch = (L, C, h) => {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s]
}
const inGamut = (rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4)

/** OKLCH → hex */
export function oklchToHex(L, C, h) {
  let lo = 0, hi = C, rgb = fromLch(L, C, h)
  if (!inGamut(rgb)) { for (let i = 0; i < 20; i++) { const mid = (lo + hi) / 2; if (inGamut(fromLch(L, mid, h))) lo = mid; else hi = mid } rgb = fromLch(L, lo, h) }
  const enc = (v) => { const x = Math.min(1, Math.max(0, v)); return Math.round(255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055)) }
  return ('#' + rgb.map((v) => enc(v).toString(16).padStart(2, '0')).join('')).toUpperCase()
}

/** hex → OKLCH `[L, C, h]` */
export function hexToOklch(hex) {
  const [r, g, b] = rgbOf(hex).map(toLin)
  const l = Math.cbrt(0.4122214708 * r + 0.5363015620 * g + 0.0514770613 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  return [L, Math.hypot(A, B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360]
}

/* ── contrast (WCAG 2) ── */
const luminance = (hex) => { const [r, g, b] = rgbOf(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
/** the WCAG contrast ratio of two hex colours, 1 … 21 */
export function contrastRatio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
/** `AAA` (7) · `AA` (4.5) · `AA large` (3) · `fail` */
export const contrastGrade = (ratio) => (ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'fail')
/** the ink of `inks` (`{ dark, light }`) that reads best on `hex`, its ratio and grade */
export function inkOn(hex, inks) {
  const [ink, ratio] = [inks.dark, inks.light].map((i) => [i, contrastRatio(hex, i)]).sort((m, n) => n[1] - m[1])[0]
  return { ink, ratio, grade: contrastGrade(ratio) }
}

/* ── the relations a palette can take: KOL's harmonies, plus the two that are not hue offsets ── */
export const COLOR_RELATIONS = [
  ...HARMONIES.map((h) => ({ id: h.id, label: h.label })),
  { id: 'monochromatic', label: 'Monochromatic' },
  /* Adobe's two more (review 5 — *"you are missing at least 2. just check color.adobe.com"*): compound is the base, a
   * split-complement arm and its far neighbour (the lopsided Y); shades are one hue at one chroma, lightness alone */
  { id: 'compound', label: 'Compound', offsets: [0, 150, 195] },
  { id: 'shades', label: 'Shades' },
  { id: 'random', label: 'Random' },
]
const offsetsOf = (rel) => [...new Set(COLOR_RELATIONS.find((r) => r.id === rel)?.offsets ?? HARMONIES.find((h) => h.id === rel)?.roleOffsets ?? [0])]

/* a seeded rng (mulberry32) — the same seed, the same roll */
export const seededRng = (seed) => () => {
  let t = (seed = (seed + 0x6d2b79f5) | 0)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** a palette of `count` (2–8) from `base`: colour 1 is the base, the rest off its hue by `relation` (kol-fxr's generator) */
export function generateColors({ base, relation = 'analogous', count = 5, seed = 1 }) {
  const rng = seededRng(seed)
  const n = Math.min(8, Math.max(2, Math.round(count)))
  const [L0, C0, h0] = hexToOklch(base)
  const C = Math.min(0.2, Math.max(0.06, C0)) * (0.85 + rng() * 0.3)
  const offs = relation === 'monochromatic' || relation === 'shades' ? [0] : offsetsOf(relation)
  const hueAt = (i) => (relation === 'random' ? rng() * 360 : h0 + offs[i % offs.length])
  const out = [base.toUpperCase()]
  const others = n - 1
  for (let k = 0; k < others; k++) {
    const h = hueAt(k + 1)
    let L, c
    if (n >= 3 && k === 0) { L = 0.14 + rng() * 0.05; c = C * 0.3 }            /* ground */
    else if (n >= 3 && k === 1) { L = 0.93 + rng() * 0.04; c = C * 0.2 }       /* ink */
    else if (n === 2) { L = L0 < 0.55 ? 0.93 + rng() * 0.04 : 0.14 + rng() * 0.05; c = C * 0.25 }
    else {
      const mids = others - 2
      const j = k - 2
      L = 0.4 + (mids === 1 ? 0.25 : (0.4 * j) / (mids - 1)) + (rng() - 0.5) * 0.06
      c = C * (0.7 + rng() * 0.3)
    }
    out.push(oklchToHex(L, relation === 'shades' ? C0 * (L > 0.85 || L < 0.25 ? 0.4 : 1) : c, h))
  }
  return out
}

/* ── roles, by look ── */
export const COLOR_ROLES = [
  { id: 'bg', label: 'Background' },
  { id: 'fg', label: 'Ink' },
  { id: 'accent', label: 'Accent' },
  { id: 'dim', label: 'Dim' },
  { id: 'warm', label: 'Warm' },
]
/** each role's colour, chosen by look (kol-fxr `assignRoles`) — `{ bg, fg, accent, dim, warm }` as indexes into `colors` */
export function assignRoles(colors) {
  const all = colors.map((hex, i) => { const [L, C] = hexToOklch(hex); return { i, L, C } })
  const byL = [...all].sort((a, b) => a.L - b.L)
  const bg = byL[0], fg = byL[byL.length - 1]
  const rest = all.filter((c) => c !== bg && c !== fg).sort((a, b) => b.C - a.C)
  const vivid = [...all].sort((a, b) => b.C - a.C)[0]
  const accent = rest[0] ?? vivid
  const left = rest.slice(1)
  const dim = left[left.length - 1] ?? accent
  const warm = left.length > 1 ? left[0] : accent
  return { bg: bg.i, fg: fg.i, accent: accent.i, dim: dim.i, warm: warm.i }
}

/** a colour's tint ladder, Adobe's "edit tint" (review 2: *"tints are 7"*): seven steps of its own hue and chroma in OKLCH —
 *  three lighter toward 0.97, the colour itself at step 4, three darker toward 0.15 */
export function tintLadder(hex) {
  const [L, C, h] = hexToOklch(hex)
  const up = (0.97 - L) / 3, down = (L - 0.15) / 3
  return [3, 2, 1].map((k) => oklchToHex(L + up * k, C, h)).concat([hex.toUpperCase()], [1, 2, 3].map((k) => oklchToHex(L - down * k, C, h)))
}

/** the colour between two, the OKLCH midpoint (the shorter way round the hue) — "add color" between columns */
export function midColor(a, b) {
  const [La, Ca, ha] = hexToOklch(a), [Lb, Cb, hb] = hexToOklch(b)
  const d = ((hb - ha + 540) % 360) - 180
  return oklchToHex((La + Lb) / 2, (Ca + Cb) / 2, (ha + d / 2 + 360) % 360)
}

/* the brand's text levels at KOL's opacities (kol-opacity.css: emphasis full, strong 80, lede 72, body 64, meta 48) */
export const INK_LEVELS = [['emphasis', 1], ['strong', 0.8], ['lede', 0.72], ['body', 0.64], ['meta', 0.48]]
/* KOL's whole fg ladder (kol-opacity.css `--kol-fg-01` … `-96`) and the full ink — what Color Lab's Text tab grades (review 2,
 * the user: *"INK has more stops, why did you chose these?"*); the five INK_LEVELS are named on their stops */
export const TEXT_STOPS = [100, 96, 88, 80, 72, 64, 48, 40, 32, 24, 16, 12, 8, 4, 2, 1]
const toHex = (rgb) => '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase()
const over = (fg, bg, a) => toHex(rgbOf(fg).map((c, i) => c * a + rgbOf(bg)[i] * (1 - a)))
const alpha = (hex, a) => (a >= 1 ? hex : `${hex}${Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase()}`)

/** the lab's starting value. `colors` null = generate from the rest; `locked` holds the indexes a roll keeps */
export const DEFAULT_COLOR_LAB = { base: '#3D7FF0', relation: 'analogous', count: 5, seed: 1, colors: null, locked: [] }

/** everything the lab draws, from its value: `{ ...value, colors, roles, swatches, ink }` */
export function colorLab(value) {
  const v = { ...DEFAULT_COLOR_LAB, ...value }
  if (v.harmony && !value?.relation) v.relation = v.harmony                 /* 0.17.0's word for it */
  const colors = (v.colors?.length ? v.colors : generateColors(v)).map((h) => h.toUpperCase())
  const roleIdx = assignRoles(colors)
  const roles = Object.fromEntries(Object.entries(roleIdx).map(([r, i]) => [r, colors[i]]))
  const ground = roles.bg
  const swatches = colors.map((hex, i) => {
    const role = COLOR_ROLES.find((r) => roleIdx[r.id] === i)
    /* the check: a colour on the ground; the ground itself, the ink on it */
    const ratio = i === roleIdx.bg ? contrastRatio(roles.fg, ground) : contrastRatio(hex, ground)
    const [L, C, h] = hexToOklch(hex)
    return { hex, index: i, role: role?.id ?? null, roleLabel: role?.label ?? `Colour ${i + 1}`, locked: v.locked.includes(i), ratio, grade: contrastGrade(ratio), oklch: [L, C, h] }
  })
  const ink = INK_LEVELS.map(([id, a]) => {
    const seen = over(roles.fg, ground, a)
    const ratio = contrastRatio(seen, ground)
    return { id, hex: alpha(roles.fg, a), ratio, grade: contrastGrade(ratio) }
  })
  const named = Object.fromEntries(INK_LEVELS.map(([id, a]) => [Math.round(a * 100), id]))
  const text = TEXT_STOPS.map((stop) => {
    const seen = over(roles.fg, ground, stop / 100)
    const ratio = contrastRatio(seen, ground)
    return { stop, name: named[stop] ?? null, hex: alpha(roles.fg, stop / 100), ratio, grade: contrastGrade(ratio) }
  })
  return { ...v, colors, roles, roleIdx, swatches, ink, text }
}

/** a roll: a new seed, the unlocked colours regenerated, the locked ones kept where they were */
export function rollColorLab(value, seed = Math.floor(Math.random() * 1e9)) {
  const v = { ...DEFAULT_COLOR_LAB, ...value }
  const prev = colorLab(v).colors
  const fresh = generateColors({ ...v, count: prev.length, seed })
  return { ...v, seed, colors: fresh.map((hex, i) => (v.locked.includes(i) ? prev[i] : hex)) }
}

/** the palette as CSS custom properties: each colour by number, each role, the ink levels */
export function colorLabCss(value, prefix = 'brand') {
  const c = colorLab(value)
  const line = (name, hex) => `  --${prefix}-${name}: ${hex};`
  return [
    ':root {',
    ...c.colors.map((hex, i) => line(`color-${i + 1}`, hex)),
    ...COLOR_ROLES.map((r) => line(r.id === 'bg' ? 'background' : r.id === 'fg' ? 'ink' : r.id, c.roles[r.id])),
    ...c.ink.map((x) => line(`ink-${x.id}`, x.hex)),
    '}',
  ].join('\n')
}

/* ── the blend ramps (0.17.0's), kept: five steps of one colour by Screen and Multiply ── */
const screen = (c) => c + 0.5 * (1 - (1 - c) ** 2 - c)
const multiply = (c) => c + 0.5 * (c * c - c)
/** five steps, 100 lightest … 500 darkest, the base at 300 */
export function blendRamp(hex) {
  const base = rgbOf(hex)
  const s1 = base.map(screen), m1 = base.map(multiply)
  return [s1.map(screen), s1, base, m1, m1.map(multiply)].map(toHex)
}
/** @deprecated 2026-10-29 — `colorLab` (0.17.0's name) */
export const deriveColorLab = colorLab

/* ── colour vision (review 2, Adobe's Color blindness simulator) ── */
/* Machado, Oliveira & Fernandes 2009, severity 1.0, on linear sRGB; achromatopsia by luminance */
export const CVD_TYPES = [
  { id: 'normal', label: 'Normal vision' },
  { id: 'protanopia', label: 'Protanopia' },
  { id: 'deuteranopia', label: 'Deuteranopia' },
  { id: 'tritanopia', label: 'Tritanopia' },
  { id: 'achromatopsia', label: 'Achromatopsia' },
]
const CVD = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
}
const encode = (v) => { const x = Math.min(1, Math.max(0, v)); return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055 }
/** how `hex` looks to a `type` of colour vision (CVD_TYPES) — display only, the palette keeps its values */
export function simulateCvd(hex, type) {
  if (!type || type === 'normal') return hex
  const lin = rgbOf(hex).map(toLin)
  if (type === 'achromatopsia') { const y = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]; return toHex([y, y, y].map(encode)) }
  const m = CVD[type]
  return m ? toHex(m.map((r) => encode(r[0] * lin[0] + r[1] * lin[1] + r[2] * lin[2]))) : hex
}

/* ── an image's palette (review 2, Adobe's Image source) ── */
/** `count` colours from an image's pixels (`Uint8ClampedArray` RGBA, as a canvas gives): k-means in OKLab on a sample,
 *  seeded by spreading the pixels by lightness; the clusters ordered by size, largest first (colour 1, the base) */
export function paletteFromPixels(data, count = 5) {
  const pts = []
  for (let i = 0; i < data.length; i += 4 * Math.max(1, Math.floor(data.length / 4 / 6000))) {
    if (data[i + 3] < 128) continue
    const hex = toHex([data[i], data[i + 1], data[i + 2]].map((v) => v / 255))
    const [L, C, h] = hexToOklch(hex)
    pts.push([L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)])
  }
  if (!pts.length) return []
  const n = Math.min(count, pts.length)
  const byL = [...pts].sort((a, b) => a[0] - b[0])
  let centres = Array.from({ length: n }, (_, k) => byL[Math.floor(((k + 0.5) / n) * byL.length)])
  let groups = []
  for (let it = 0; it < 12; it++) {
    groups = centres.map(() => [])
    for (const p of pts) {
      let best = 0, bd = Infinity
      centres.forEach((c, j) => { const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2; if (d < bd) { bd = d; best = j } })
      groups[best].push(p)
    }
    centres = groups.map((g, j) => (g.length ? [0, 1, 2].map((d) => g.reduce((s, p) => s + p[d], 0) / g.length) : centres[j]))
  }
  return centres
    .map((c, j) => ({ size: groups[j].length, hex: oklchToHex(c[0], Math.hypot(c[1], c[2]), ((Math.atan2(c[2], c[1]) * 180) / Math.PI + 360) % 360) }))
    .sort((a, b) => b.size - a.size)
    .map((x) => x.hex)
}
