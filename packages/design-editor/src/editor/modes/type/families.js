/**
 * families.js — the font model (variable fonts since 2026-11-18, plan-2026-11-18-kolbox-round-2 W7).
 *
 * A text layer's FONT is a family, a weight and italic on or off:
 *   family — Inter or Malromur (the OUTLINE families: variable TTFs, so any
 *            weight on the font's own wght axis has real outlines; Inter is
 *            one file whose slnt axis is its italic, Malromur a roman and an
 *            italic file), JetBrains Mono (shipped statics) or a Google family.
 *   weight — for an outline family any value in its axis range; for the others
 *            one of the family's own weights (their style list).
 *
 * Migration is READ-TIME: a layer stored on the old Right Grotesk cut system
 * (family 'right-grotesk' or none, a width cut and a weight) and a layer saved
 * as Inter Tight (2026-11-18, before the switch to Inter) read as Inter at
 * the weight clamped into the axis; the legacy fake "Mono" width cut
 * is the JetBrains family. No data sweep; old drafts open with their text.
 *
 * Capability: morph, Flatten and the vector export are gated on
 * `isOutlineFamily`. JetBrains (woff2-only) and Google families (woff2 via
 * the css2 API) are RENDER families: they draw live and export through the
 * foreignObject fallback.
 */
/* ── the curated Google catalog (v1) ─────────────────────────────────────
 * Static so no API key is needed: the css2 endpoint serves any family
 * without one; only the full-catalog LISTING requires a key. Weights are
 * each family's real ranges, trimmed to the common stops. */
const GF = (css, weights) => ({ id: `google:${css}`, label: css, css, weights })
export const GOOGLE_FAMILIES = [
  GF('Inter', [100, 300, 400, 500, 600, 700, 900]),
  GF('Roboto', [100, 300, 400, 500, 700, 900]),
  GF('Open Sans', [300, 400, 500, 600, 700, 800]),
  GF('Montserrat', [100, 300, 400, 500, 600, 700, 900]),
  GF('Poppins', [100, 300, 400, 500, 600, 700, 900]),
  GF('Lato', [100, 300, 400, 700, 900]),
  GF('Oswald', [200, 300, 400, 500, 600, 700]),
  GF('Raleway', [100, 300, 400, 500, 600, 700, 900]),
  GF('Playfair Display', [400, 500, 600, 700, 800, 900]),
  GF('Merriweather', [300, 400, 700, 900]),
  GF('Lora', [400, 500, 600, 700]),
  GF('EB Garamond', [400, 500, 600, 700, 800]),
  GF('Libre Baskerville', [400, 700]),
  GF('Cormorant Garamond', [300, 400, 500, 600, 700]),
  GF('DM Sans', [100, 300, 400, 500, 600, 700, 900]),
  GF('DM Serif Display', [400]),
  GF('Space Grotesk', [300, 400, 500, 600, 700]),
  GF('Space Mono', [400, 700]),
  GF('IBM Plex Sans', [100, 300, 400, 500, 600, 700]),
  GF('IBM Plex Mono', [100, 300, 400, 500, 600, 700]),
  GF('Fira Code', [300, 400, 500, 600, 700]),
  GF('Source Code Pro', [200, 300, 400, 500, 600, 700, 900]),
  GF('Work Sans', [100, 300, 400, 500, 600, 700, 900]),
  GF('Manrope', [200, 300, 400, 500, 600, 700, 800]),
  GF('Sora', [100, 300, 400, 500, 600, 700, 800]),
  GF('Outfit', [100, 300, 400, 500, 600, 700, 900]),
  GF('Plus Jakarta Sans', [200, 300, 400, 500, 600, 700, 800]),
  GF('Figtree', [300, 400, 500, 600, 700, 900]),
  GF('Instrument Serif', [400]),
  GF('Fraunces', [100, 300, 400, 500, 600, 700, 900]),
  GF('Bricolage Grotesque', [200, 300, 400, 500, 600, 700, 800]),
  GF('Archivo', [100, 300, 400, 500, 600, 700, 900]),
  GF('Archivo Black', [400]),
  GF('Bebas Neue', [400]),
  GF('Anton', [400]),
  GF('Barlow', [100, 300, 400, 500, 600, 700, 900]),
  GF('Barlow Condensed', [100, 300, 400, 500, 600, 700, 900]),
  GF('Chivo', [100, 300, 400, 500, 600, 700, 900]),
  GF('Syne', [400, 500, 600, 700, 800]),
  GF('Unbounded', [200, 300, 400, 500, 600, 700, 900]),
  GF('Major Mono Display', [400]),
  GF('VT323', [400]),
  GF('Press Start 2P', [400]),
  GF('Caveat', [400, 500, 600, 700]),
  GF('Permanent Marker', [400]),
]

const googleById = new Map(GOOGLE_FAMILIES.map((f) => [f.id, f]))

/* ── family registry ────────────────────────────────────────────────── */
export const FAMILY_INTER = 'inter'
export const FAMILY_MALROMUR = 'malromur'
export const FAMILY_JB = 'jetbrains-mono'
export const DEFAULT_FAMILY = FAMILY_INTER

/* The outline families — axis ranges read from each file's fvar (2026-11-18):
 * Inter wght 100..900 and slnt -10..0 in ONE file, italic = slnt at -10;
 * Malromur wght 300..900 (default 400, roman and italic; the 2026-11-12 roman
 * export moved its default from 300), two files.
 * `css` is the FontFace family name — Inter's is its own, so the theme's
 * Inter (a different file) never stands in for it on the canvas. */
/* The comma stays raw: it is legal in a URL path, and Vite's static server
 * answers the %2C form with index.html. FontFace gets it quoted. */
const INTER_FILE = '/fonts/inter/Inter-VariableFont_slnt,wght.ttf'
export const VARIABLE_FAMILIES = {
  [FAMILY_INTER]: {
    label: 'Inter', css: 'Inter VF', min: 100, max: 900,
    roman: INTER_FILE, italic: INTER_FILE, slnt: -10,
  },
  [FAMILY_MALROMUR]: {
    label: 'Malromur', css: 'TG Malromur', min: 300, max: 900,
    roman: '/fonts/TG/TGMalromurRomanVF.ttf',
    italic: '/fonts/TG/TGMalromurItalicVF.ttf',
  },
}

/* Family dropdown options — outline families first, then JetBrains, then the
 * Google shelf; a Google family an outline family already is (Inter) is left
 * out, so the list has one row per name. */
const OUTLINE_LABELS = new Set(Object.values(VARIABLE_FAMILIES).map((f) => f.label))
export const FAMILY_OPTIONS = [
  ...Object.entries(VARIABLE_FAMILIES).map(([value, f]) => ({ value, label: f.label })),
  { value: FAMILY_JB, label: 'JetBrains Mono' },
  ...GOOGLE_FAMILIES.filter((f) => !OUTLINE_LABELS.has(f.label)).map((f) => ({ value: f.id, label: f.label })),
]

/* Ids that read as another family: Inter Tight (the outline family for an hour
 * on 2026-11-18) and the Google Inter row are Inter. */
const ALIASES = { 'inter-tight': FAMILY_INTER, 'google:Inter': FAMILY_INTER }

/* A family id or anything older (a Right Grotesk width cut, 'right-grotesk',
 * Inter Tight, nothing) → a family this model knows. Used by the loader too, so
 * every old caller that passes a cut id lands on Inter. */
export function resolveFamily(id) {
  if (ALIASES[id]) return ALIASES[id]
  if (id === FAMILY_JB || VARIABLE_FAMILIES[id] || googleById.has(id)) return id
  return id === 'mono' ? FAMILY_JB : DEFAULT_FAMILY
}

/* Read-time migration: a known `family` wins; the legacy "Mono" width cut is
 * JetBrains; everything else (Right Grotesk, no family) is Inter. */
export function layerFamily(layer) {
  if (layer?.family && layer.family !== 'right-grotesk') return resolveFamily(layer.family)
  return layer?.width === 'mono' ? FAMILY_JB : DEFAULT_FAMILY
}

export const isOutlineFamily = (fam) => !!VARIABLE_FAMILIES[fam]

/* The axis range of an outline family ({ min, max }), null for the others. */
export const weightRange = (fam) => VARIABLE_FAMILIES[fam] ?? null

/* A weight clamped into the family's axis (outline families only). */
export function clampWeight(fam, weight) {
  const f = VARIABLE_FAMILIES[fam]
  const w = Number.isFinite(weight) ? weight : 400
  return f ? Math.min(f.max, Math.max(f.min, w)) : w
}

/* The weight a layer draws at — the nearest the family has. */
export const layerWeight = (layer, key = 'weight') => clampWeight(layerFamily(layer), layer?.[key] ?? 600)

/* The variable TTF behind an outline family's roman or italic. */
export function fontFileFor(fam, italic = false) {
  const f = VARIABLE_FAMILIES[resolveFamily(fam)]
  return f ? (italic ? f.italic : f.roman) : null
}

/* The CSS font-style a layer draws with. A slant family's italic is its
 * oblique angle: `italic` on an oblique face makes the browser add its own
 * skew on top of the slnt axis (measured 0.42 against the axis' 0.17). */
export function fontStyleFor(layer) {
  const f = VARIABLE_FAMILIES[layerFamily(layer)]
  if (f?.slnt != null) { const s = slantOf(f, layer?.italic, layer?.slant); return s ? `oblique ${-s}deg` : 'normal' }
  return layer?.italic ? 'italic' : 'normal'
}

/* A slant family's slnt value: the layer's own `slant` (the Variable tab's axis value), else the axis end when italic. */
function slantOf(f, italic, slant) {
  if (Number.isFinite(slant)) return Math.min(0, Math.max(f.slnt, slant))
  return italic ? f.slnt : 0
}

/* The axis coordinates for a weight: wght, plus Inter's slnt when slanted. */
export function axisCoords(fam, weight, italic = false, slant) {
  const f = VARIABLE_FAMILIES[resolveFamily(fam)]
  const s = f?.slnt != null ? slantOf(f, italic, slant) : 0
  return s ? { wght: weight, slnt: s } : { wght: weight }
}

/* The CSS font-family stack for a layer (or a {family,width} shaped value). */
export function familyCssFor(value) {
  const fam = layerFamily(value)
  if (VARIABLE_FAMILIES[fam]) return `'${VARIABLE_FAMILIES[fam].css}', sans-serif`
  if (fam === FAMILY_JB) return `'JetBrains Mono', monospace`
  const gf = googleById.get(fam)
  return gf ? `'${gf.css}', sans-serif` : 'sans-serif'
}

const WEIGHT_NAMES = { 100: 'Thin', 200: 'Extra Light', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold', 800: 'Extra Bold', 900: 'Black' }
export const weightLabel = (w) => WEIGHT_NAMES[w] ?? String(Math.round(w))

/* Styles per family — [{ value, label, patch }]. For an outline family the
 * named stops of its axis (the float toolbar's menu; the rail uses a slider). */
export function stylesFor(familyId) {
  const vf = VARIABLE_FAMILIES[familyId]
  if (vf) {
    const out = []
    for (let wt = Math.ceil(vf.min / 100) * 100; wt <= vf.max; wt += 100) {
      out.push({ value: `v/${wt}`, label: weightLabel(wt), patch: { weight: wt } })
    }
    return out
  }
  if (familyId === FAMILY_JB) {
    /* The shipped statics: Regular / Medium / SemiBold (+ italics via the
     * Italic toggle). width stays 'mono' so legacy consumers keep working. */
    return [400, 500, 600].map((wt) => ({
      value: `mono/${wt}`,
      label: weightLabel(wt),
      patch: { width: 'mono', weight: wt },
    }))
  }
  const gf = googleById.get(familyId)
  if (!gf) return []
  return gf.weights.map((wt) => ({
    value: `g/${wt}`,
    label: weightLabel(wt),
    patch: { weight: wt },
  }))
}

/* The style value a layer currently sits on (for the Style dropdown). */
export function styleValueFor(layer) {
  const fam = layerFamily(layer)
  if (VARIABLE_FAMILIES[fam]) return `v/${layerWeight(layer)}`
  if (fam === FAMILY_JB) return `mono/${[400, 500, 600].includes(layer.weight) ? layer.weight : 400}`
  return `g/${layer.weight ?? 400}`
}

/* Human name of the resolved font — the Inspector's Font line. */
export function fontNameFor(layer) {
  const fam = layerFamily(layer)
  const name = VARIABLE_FAMILIES[fam]?.label ?? (fam === FAMILY_JB ? 'JetBrains Mono' : (googleById.get(fam)?.label ?? fam))
  return `${name} ${weightLabel(layerWeight(layer))}${layer.italic ? ' Italic' : ''}`
}

/* ── Google webfont loading (render path) ───────────────────────────────
 * css2 <link> injection, deduped per family — serves woff2, no key needed.
 * Loads ALL the family's curated weights + italics in one request so style
 * hopping never pops. */
const loaded = new Set()
export function ensureFamilyLoaded(familyId) {
  if (VARIABLE_FAMILIES[familyId]) { ensureVariableFace(familyId); return }
  if (!familyId?.startsWith?.('google:') || loaded.has(familyId)) return
  const gf = googleById.get(familyId)
  if (!gf || typeof document === 'undefined') return
  loaded.add(familyId)
  const axis = gf.weights.map((w) => `0,${w}`).concat(gf.weights.map((w) => `1,${w}`)).join(';')
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(gf.css).replace(/%20/g, '+')}:ital,wght@${axis}&display=swap`
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  link.dataset.kolFont = familyId
  document.head.appendChild(link)
}

/* ── outline families on the canvas ─────────────────────────────────────
 * The live render draws real text with CSS, so the same variable files are
 * registered as FontFaces with their axis range (the kinetic registry's form)
 * and the canvas and the exported outlines come from one file. */
function ensureVariableFace(familyId) {
  if (loaded.has(familyId) || typeof FontFace === 'undefined' || typeof document === 'undefined') return
  loaded.add(familyId)
  const f = VARIABLE_FAMILIES[familyId]
  /* A slant family is one face whose oblique range is its slnt axis: the
   * browser draws `font-style: italic` at the axis' end, no synthetic skew. */
  const faces = f.slnt != null
    ? [[f.roman, `oblique 0deg ${-f.slnt}deg`]]
    : [[f.roman, 'normal'], [f.italic, 'italic']]
  for (const [url, style] of faces) {
    try {
      const ff = new FontFace(f.css, `url("${url}")`, { weight: `${f.min} ${f.max}`, style })
      document.fonts.add(ff)
      ff.load().catch(() => {})
    } catch { /* ignore */ }
  }
}
