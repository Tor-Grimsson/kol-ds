/**
 * The generator windows as DATA (plan-2026-11-05-float-editor W7.3 · 7.4 · 7.6) — Generate, Repeat and Type, each section
 * and control named as his window spec names it (`_tmp/2026-11-05-generator-windows/spec.md`, the window spec he wrote for
 * fxr's plan 53). A control is `{ id, name, type, …range, def, bind?, act? }`:
 *
 *   type  slider · range (two handles) · segmented · select · toggle · point (X / Y) · color · text · ramp (A→B + curve) ·
 *         lights (a list of points) · button · picker (a layer)
 *   bind  `{ get(params) → value, set(value, params) → patch }` — the control reads and writes the ENGINE's flat params
 *         (fxr's `src/generate`, copied verbatim into `../../generate` — W7.6). The window's state IS those params, so a
 *         preset, a reopened layer and the Rail form all read back the same numbers.
 *   act   a button's action name (`expand`, `open-type`) — the window runs it.
 *   A control with neither renders DISABLED: the engine has no param for it (`disabledControls()` lists them).
 *
 * A section is `{ key, label, state(params), groups: [{ title?, note?, kind?: 'grid'|'ramps'|'more', controls }] }`.
 */
import { paramsFor, presetsOf, styleById } from '../../generate/index.js'
import { REPEAT_DEFAULTS } from '../../generate/repeat.js'
import { RAMPS } from '../../generate/styles/ascii.js'

const opts = (...xs) => xs.map((x) => (typeof x === 'string' ? { value: x.toLowerCase(), label: x } : x))
const c = (type) => (name, a = {}, b = {}) => ({ type, name, id: (b.id ?? a.id ?? name).toLowerCase().replace(/[^a-z0-9]+/g, '-'), ...a, ...b })
const slider = (name, min, max, o = {}) => c('slider')(name, { min, max, step: o.step ?? (max - min <= 4 ? 0.01 : 1), def: o.def ?? min }, o)
const range = (name, min, max, o = {}) => c('range')(name, { min, max, step: o.step ?? 0.01, def: o.def ?? [min, max] }, o)
const seg = (name, options, o = {}) => c('segmented')(name, { options: opts(...options), def: o.def ?? opts(...options)[0].value }, o)
const select = (name, options, o = {}) => c('select')(name, { options: opts(...options), def: o.def ?? opts(...options)[0].value }, o)
const toggle = (name, o = {}) => c('toggle')(name, { def: o.def ?? false }, o)
const point = (name, min, max, o = {}) => c('point')(name, { min, max, def: o.def ?? [0.5, 0.5] }, o)
const color = (name, o = {}) => c('color')(name, { def: o.def ?? '#e8e4dc' }, o)
const text = (name, o = {}) => c('text')(name, { def: o.def ?? '' }, o)
const button = (name, o = {}) => c('button')(name, {}, o)
const picker = (name, o = {}) => c('picker')(name, { def: null }, o)
const lights = (name, o = {}) => c('lights')(name, { def: o.def ?? [{ x: 0.35, y: 0.4, radius: 0.3, intensity: 1 }] }, o)
export const CURVES = opts('Linear', 'Ease', 'In', 'Out', 'Hump', 'Dip', 'Wave', 'Sine', 'Bell', 'Last')
/* Radial array's engine has its own curve set */
const RADIAL_CURVES = opts('Linear', 'Ease', 'In', 'Out', 'Hump', { value: 'alt', label: 'Alternate' })
const ramp = (name, min, max, o = {}) => c('ramp')(name, { min, max, def: o.def ?? { a: min, b: max, curve: 'linear' } }, o)

const pct = (v) => `${Math.round(v * 100)}%`
const fixed = (n) => (v) => Number(v).toFixed(n)
const deg = (v) => `${Math.round(v)}°`
const px = (v) => `${Math.round(v)} px`

/* ── binds: a control ↔ the engine's flat params ─────────────────────────────────────────────────────────────────── */
const k = (key, to = (v) => v, from = (v) => v) => ({ get: (p) => (p[key] === undefined ? undefined : from(p[key], p)), set: (v, p) => ({ [key]: to(v, p) }) })
const kk = (a, b) => ({ get: (p) => (p[a] === undefined ? undefined : [p[a], p[b]]), set: (v) => ({ [a]: v[0], [b]: v[1] }) })
const kr = (pre) => ({ get: (p) => (p[`${pre}A`] === undefined ? undefined : { a: p[`${pre}A`], b: p[`${pre}B`], curve: p[`${pre}C`] ?? 'linear' }),
  set: (v) => ({ [`${pre}A`]: v.a, [`${pre}B`]: v.b, [`${pre}C`]: v.curve }) })
/* a two-way value map (spec value ↔ engine value) */
const kmap = (key, pairs) => k(key, (v) => (pairs.find(([a]) => a === v) ?? [v, v])[1], (v) => (pairs.find(([, b]) => b === v) ?? [v])[0])

/* the engine style a window value picks, and back */
const STYLE_IDS = [['line screen', 'lineScreen'], ['dot screen', 'dotScreen'], ['ascii', 'ascii'], ['stripe array', 'stripeArray'],
  ['radial array', 'radialArray'], ['tiling', 'tiling'], ['stipple', 'stipple'], ['stipple', 'mosaic']]
export const engineStyle = (v) => (STYLE_IDS.find(([a]) => a === v) ?? STYLE_IDS[3])[1]
const windowStyle = (id) => (STYLE_IDS.find(([, b]) => b === id) ?? STYLE_IDS[3])[0]
/* a style (or preset) pick replaces the drawing params, as fxr's window does — the first preset of the style */
export const pickStyle = (styleId, presetId = presetsOf(styleId)[0]?.id ?? null) => paramsFor(styleId, presetId)
const isMosaic = (p) => p.genStyle === 'mosaic'
/* the canvas a generate layer fills (the editor's 1080 baseline) — ASCII's Cell size is px on it */
const BASE_W = 1080

/* ── GENERATE ─────────────────────────────────────────────────────────────────────────────────────────────────────── */
/* the style names in his frame's case (12:2282 — "Stripe Array"); the values the spec's */
export const STYLES = [
  { value: 'line screen', label: 'Line Screen' }, { value: 'dot screen', label: 'Dot Screen' }, { value: 'ascii', label: 'ASCII' },
  { value: 'stripe array', label: 'Stripe Array' }, { value: 'radial array', label: 'Radial Array' }, { value: 'tiling', label: 'Tiling' },
  { value: 'stipple', label: 'Stipple / Mosaic' },
]
export const FIELD_TYPES = opts('Linear', 'Radial', 'Conic', 'Diamond', 'Ellipse', 'Blob', 'Lights', 'Sine', 'Ridge', 'Waves', 'Noise', 'Ribbon', 'Image')

/* the lights list ↔ fLightN + fL{i}x · y · r · i (the engine holds up to 8) */
const LIGHTS = {
  get: (p) => (p.fLightN === undefined ? undefined : Array.from({ length: Math.max(1, Math.min(8, p.fLightN)) }, (_, i) => ({
    x: p[`fL${i + 1}x`] ?? 0.5, y: p[`fL${i + 1}y`] ?? 0.5, radius: p[`fL${i + 1}r`] ?? 0.3, intensity: p[`fL${i + 1}i`] ?? 1 }))),
  set: (list) => Object.assign({ fLightN: Math.max(1, Math.min(8, list.length)) }, ...list.slice(0, 8).map((l, i) => ({
    [`fL${i + 1}x`]: l.x, [`fL${i + 1}y`]: l.y, [`fL${i + 1}r`]: l.radius, [`fL${i + 1}i`]: l.intensity }))),
}

const FIELD = {
  key: 'field', label: 'Field', state: (p) => FIELD_TYPES.find((t) => t.value === p.fKind)?.label ?? '—',
  groups: [
    { title: 'Source', note: 'The gradient the style reads', controls: [
      select('Type', FIELD_TYPES, { def: 'radial', bind: k('fKind') }),
      point('Centre', -0.5, 1.5, { bind: kk('fX', 'fY') }), slider('Radius X', 0.02, 2, { def: 0.6, bind: k('fRx') }), slider('Radius Y', 0.02, 2, { def: 0.6, bind: k('fRy') }),
      slider('Angle', -180, 180, { def: 0, format: deg, id: 'field-angle', bind: k('fAngle') }),
      slider('Frequency X', 0.1, 24, { def: 4, step: 0.1, bind: k('fFreq') }), slider('Frequency Y', 0.1, 24, { def: 4, step: 0.1, bind: k('fFreq2') }),
      slider('Phase', -180, 180, { def: 0, format: deg, bind: k('fPhase') }), slider('Bend', -2, 2, { def: 0, bind: k('fBend') }),
      slider('Span', 0.2, 6, { def: 1, step: 0.1, bind: k('fSpan') }),
      slider('Offset', -1, 1, { def: 0, id: 'field-offset', bind: k('fOffset') }), slider('Seed', 1, 99, { def: 7, id: 'field-seed', bind: k('fSeed') }),
    ] },
    { title: 'Lights', note: 'Points of light', controls: [lights('Lights', { bind: LIGHTS })] },
    { title: 'Image', note: 'A photo layer as the field', controls: [
      picker('Photo layer', { bind: k('fImgLayer', (v) => v || null), kinds: ['photo'] }),
      range('Levels', 0, 1, { def: [0, 1], format: fixed(2), bind: { get: (p) => [p.fLo ?? 0, p.fHi ?? 1], set: (v) => ({ fLo: v[0], fHi: v[1] }) } }),
    ] },
    { kind: 'more', title: 'Second source', note: 'Combined with the first', controls: [
      select('Type', ['None', ...FIELD_TYPES], { id: 'second-type', def: 'none', bind: k('gKind') }),
      select('Combine', ['Max', 'Min', 'Add', 'Multiply', 'Screen', 'Difference'], { bind: kmap('fOp', [['difference', 'diff']]) }),
      slider('Weight', 0, 1, { def: 0.5, format: pct, bind: { get: (p) => p.gWeight ?? 1, set: (v) => ({ gWeight: v }) } }),
    ] },
  ],
}

const RAMP = {
  key: 'ramp', label: 'Ramp', state: (p) => (p.fSteps > 1 ? `${p.fSteps} steps` : 'Continuous'),
  groups: [
    { title: 'Ramp', note: 'Shapes the gradient', controls: [
      range('From / To', 0, 1, { def: [0, 1], format: fixed(2), id: 'from-to', bind: kk('fFrom', 'fTo') }),
      slider('Contrast', 0.2, 4, { def: 1, bind: k('fContrast') }), slider('Gamma', 0.2, 4, { def: 1, bind: k('fGamma') }),
      slider('Steps', 1, 12, { def: 1, step: 1, format: (v) => (v > 1 ? String(v) : 'Smooth'), bind: k('fSteps', (v) => (v > 1 ? v : 0), (v) => (v > 1 ? v : 1)) }),
      toggle('Invert', { bind: k('fInvert') }), slider('Split at', 0, 1, { def: 0, format: (v) => (v ? pct(v) : 'Off'), bind: k('fSplit') }),
    ] },
  ],
}

/* his seven widths ↔ the engine's Right Grotesk cuts; his seven weights ↔ the cut's weights (Fine and Thin both the thinnest) */
const CUTS = [['compressed', 'Tight'], ['condensed', 'Compact'], ['narrow', 'Narrow'], ['normal', 'base'], ['wide', 'Wide'], ['extended', 'Spatial'], ['expanded', 'Tall']]
const WEIGHTS = [['fine', 100], ['thin', 100], ['light', 300], ['regular', 400], ['medium', 500], ['bold', 700], ['black', 900]]
const MASK = {
  key: 'mask', label: 'Mask', state: (p) => (MASK_SHAPES.find((s) => s.value === (p.mKind === 'layer' ? 'linked' : p.mKind))?.label ?? 'None'),
  groups: [
    { title: 'Shape', note: 'Where the style draws', controls: [
      select('Shape', MASK_SHAPES_LIST(), { def: 'none', bind: kmap('mKind', [['linked', 'layer']]) }), slider('Size', 0.2, 1.5, { def: 1, bind: k('mSize') }),
      point('Rect position', 0, 1, { bind: kk('mX', 'mY') }), point('Rect size', 0, 1, { def: [1, 1], bind: kk('mW', 'mH') }),
      slider('Waist', 0, 0.5, { def: 0.2, bind: k('mWaist') }),
    ] },
    { title: 'Letter', note: 'One character as the mask', controls: [
      text('Letter', { def: 'A', bind: k('mChar', (v) => [...String(v ?? '')].slice(-1).join('') || 'A') }),
      select('Cut', ['Compressed', 'Condensed', 'Narrow', 'Normal', 'Wide', 'Extended', 'Expanded'], { def: 'normal', bind: kmap('mCut', CUTS) }),
      select('Weight', ['Fine', 'Thin', 'Light', 'Regular', 'Medium', 'Bold', 'Black'], { def: 'regular', id: 'letter-weight',
        bind: { get: (p) => (p.mWeight === undefined ? undefined : (WEIGHTS.find(([, w]) => w === Number(p.mWeight)) ?? ['bold'])[0]), set: (v) => ({ mWeight: (WEIGHTS.find(([a]) => a === v) ?? [0, 700])[1] }) } }),
      slider('Fit', 0.2, 1.2, { def: 0.8, format: pct, bind: k('mFit') }),
    ] },
    { title: 'Linked layer', controls: [picker('Linked layer', { bind: k('mLayer', (v) => v || null), kinds: ['shape', 'path', 'misc'] }), button('Letter…', { id: 'open-type-window', act: 'open-type' })] },
  ],
}
function MASK_SHAPES_LIST() { return ['None', 'Rect', 'Ellipse', 'Circle', 'Hourglass', 'Diamond', 'Octagon', 'Arch', 'Letter', { value: 'linked', label: 'Linked layer' }] }
const MASK_SHAPES = opts(...MASK_SHAPES_LIST())

const WARP_KINDS = opts('None', 'Pinch', 'Bulge', 'Wave', 'Swirl', 'Noise', 'Flow')
const WARP = {
  key: 'warp', label: 'Warp', state: (p) => (!p.wKind || p.wKind === 'none' ? 'Off' : WARP_KINDS.find((x) => x.value === p.wKind)?.label ?? p.wKind),
  groups: [
    { title: 'Warp', note: 'Bends the grid or the field', controls: [
      select('Kind', ['None', 'Pinch', 'Bulge', 'Wave', 'Swirl', 'Noise', 'Flow'], { def: 'none', bind: k('wKind') }), seg('Bends', ['Grid', 'Field'], { bind: k('wTarget') }),
      toggle('Pin edges', { bind: k('wPin') }), slider('Amount', -1, 1, { def: 0.2, id: 'warp-amount', bind: k('wAmt') }),
      slider('Frequency', 0.2, 8, { def: 1, id: 'warp-frequency', step: 0.05, bind: k('wFreq') }),
      point('Centre', 0, 1, { id: 'warp-centre', bind: { get: (p) => [p.wX ?? 0.5, p.wY ?? 0.5], set: (v) => ({ wX: v[0], wY: v[1] }) } }),
    ] },
  ],
}

const RANDOMNESS = {
  key: 'random', label: 'Randomness', state: (p) => (p.jPos || p.jSize || p.jDrop ? 'On' : 'Off'),
  groups: [
    { title: 'Randomness', note: 'Per mark', controls: [
      slider('Jitter position', 0, 40, { def: 0, step: 0.5, format: px, bind: k('jPos') }), slider('Jitter size', 0, 1, { def: 0, format: pct, bind: k('jSize') }),
      slider('Drop-out', 0, 1, { def: 0, format: pct, bind: k('jDrop') }), slider('Seed', 1, 99, { def: 1, id: 'random-seed', bind: k('jSeed') }),
    ] },
  ],
}

const FRAME_SECTION = {
  key: 'frame', label: 'Frame', state: (p) => (p.inset ? `${p.inset} px inset` : 'Full bleed'),
  groups: [
    { title: 'Frame', note: 'Inset and paint', controls: [
      slider('Inset', 0, 400, { def: 0, format: px, bind: k('inset') }),
      color('Ink', { def: '#FFFFFF', bind: k('color') }),
      color('Ground', { def: '#000000', bind: k('bg', (v) => (v ? v : null), (v) => v ?? '') }),
    ] },
  ],
}

/* Stipple / Mosaic — one window style, two engine styles: Mosaic cell shape None draws Stipple, Hex / Square draw Mosaic */
const GAMMA = { to: (d) => 0.2 * 20 ** (1 - d), from: (g) => 1 - Math.log((g ?? 1) / 0.2) / Math.log(20) }
const STIPPLE_MOSAIC = [
  slider('Density', 0, 1, { def: 0.5, format: pct, bind: {
    get: (p) => (isMosaic(p) ? ((p.cols ?? 40) - 3) / 157 : GAMMA.from(p.gamma)),
    set: (d, p) => (isMosaic(p) ? { cols: Math.round(3 + d * 157) } : { gamma: Math.max(0.2, Math.min(4, GAMMA.to(d))) }) } }),
  slider('Min spacing', 2, 60, { def: 8, step: 0.5, format: px, bind: {
    get: (p) => (isMosaic(p) ? Math.max(2, (p.gap ?? 0.08) * 100) : p.spacing),
    set: (v, p) => (isMosaic(p) ? { gap: Math.min(0.6, v / 100) } : { spacing: v }) } }),
  range('Dot size range', 0.05, 1, { def: [0.35, 0.35], format: fixed(2), bind: {
    get: (p) => (isMosaic(p) ? [p.min ?? 0.05, 1] : [p.sizeBy ? (p.dot ?? 0.35) * 0.3 : p.dot ?? 0.35, p.dot ?? 0.35]),
    set: (v, p) => (isMosaic(p) ? { min: v[0] } : { dot: v[1], sizeBy: v[0] < v[1] - 0.01 }) } }),
  seg('Mosaic cell shape', ['None', 'Hex', 'Square'], { bind: {
    get: (p) => (isMosaic(p) ? p.tile ?? 'hex' : 'none'),
    set: (v, p) => (v === 'none' ? (isMosaic(p) ? pickStyle('stipple') : {}) : { ...(isMosaic(p) ? {} : pickStyle('mosaic')), tile: v }) } }),
  slider('Seed', 1, 99, { def: 5, id: 'stipple-seed', bind: k('seed') }),
]

/* the per-style sections, each control on its engine style's param */
const STYLE_SECTIONS = {
  'line screen': { label: 'Line Screen', state: (p) => `${p.count} ${p.orient === 'v' ? 'columns' : 'rows'}`, groups: [
    { title: 'Lines', note: 'One line per row', controls: [
      seg('Rows / Columns', ['Rows', 'Columns'], { id: 'orientation', bind: kmap('orient', [['rows', 'h'], ['columns', 'v']]) }),
      slider('Count', 2, 200, { def: 48, id: 'line-count', bind: k('count') }),
      slider('Fill', 0.05, 1, { def: 0.6, format: pct, bind: k('fill') }), slider('Hairline', 0, 8, { def: 0, step: 0.1, format: px, bind: k('hair') }),
      slider('Cut below', 0, 1, { def: 0, bind: k('cut') }),
      seg('Edge', ['Stepped', 'Tapered'], { bind: kmap('edge', [['stepped', 'step'], ['tapered', 'taper']]) }),
      slider('Sample', 0.5, 40, { def: 4, step: 0.5, format: px, bind: k('sample') }),
      slider('Angle', -90, 90, { def: 0, format: deg, id: 'line-angle' }), slider('Smoothing', 0, 12, { def: 0, bind: k('smooth') }),
      toggle('Round ends', { bind: k('round') }), ramp('Flare', 0, 2, { def: { a: 1, b: 1, curve: 'linear' } }),
    ] },
  ] },
  'dot screen': { label: 'Dot Screen', state: (p) => `${p.cols} columns`, groups: [
    { title: 'Dots', note: 'A dot per cell', controls: [
      slider('Columns', 4, 160, { def: 40, bind: k('cols') }),
      slider('Rows', 1, 200, { def: 1, format: (v) => (v > 1 ? String(v) : 'Square'), id: 'dot-rows', bind: k('rows', (v) => (v > 1 ? v : 0), (v) => (v > 1 ? v : 1)) }),
      slider('Size', 0.05, 1.8, { def: 1, format: pct, id: 'dot-size', bind: k('size') }), slider('Smallest', 0, 1, { def: 0, format: pct, bind: k('min') }),
      slider('Floor', 0, 0.6, { def: 0, format: pct, bind: k('floor') }),
      seg('Shape', ['Circle', 'Square', 'Diamond'], { id: 'dot-shape', bind: k('shape') }), slider('Stretch', 0.2, 5, { def: 1, step: 0.1, format: (v) => `${v}×`, bind: k('stretch') }),
      toggle('Stagger', { bind: k('stagger') }),
    ] },
  ] },
  ascii: { label: 'ASCII', state: (p) => p.ramp || '—', groups: [
    { title: 'Cells', note: 'A glyph per cell', controls: [
      slider('Cell size', 4, 64, { def: 12, format: px, bind: k('cols', (v) => Math.max(4, Math.min(240, Math.round(BASE_W / v))), (n) => Math.round(BASE_W / Math.max(1, n))) }),
      slider('Cell aspect', 0.3, 2, { def: 0.6, bind: k('cell', (v) => Math.max(0.5, Math.min(3, 1 / v)), (h) => 1 / h) }),
      select('Font', [{ value: 'grotesk', label: 'Right Grotesk cut' }, 'Mono', 'Pixel'], { bind: kmap('font', [['grotesk', 'rg-base-900'], ['pixel', 'pixel']]),
        /* the engine draws a registered opentype cut or its pixel font — it has no mono, so Mono draws the pixel font */
      }),
      slider('Glyph scale', 0.2, 2, { def: 1, bind: k('scale') }),
    ] },
    { title: 'Ramp', note: 'Dark to light', controls: [
      text('Ramp', { def: ' .:-=+*#%@', id: 'ramp-text', bind: { get: (p) => (p.rampPreset ? RAMPS[p.rampPreset] : p.ramp), set: (v) => ({ ramp: v, rampPreset: '' }) } }),
      select('Ramp presets', ['Standard', 'Blocks', 'Dense', 'Minimal'], { bind: kmap('rampPreset', [['standard', 'classic'], ['blocks', 'blocks'], ['dense', 'data'], ['minimal', 'dots']]) }),
      toggle('Reverse ramp', { bind: k('reverse') }),
    ] },
  ] },
  'stripe array': { label: 'Stripe Array', state: (p) => `${p.count} ${p.orient === 'v' ? 'columns' : 'rows'}`, groups: [
    { title: 'Layout', note: 'Placement and rhythm', controls: [
      seg('Direction', ['Rows', 'Columns'], { bind: kmap('orient', [['rows', 'h'], ['columns', 'v']]) }),
      slider('Count', 1, 120, { def: 48, bind: k('count') }),
      slider('Angle', -90, 90, { def: 0, format: deg, bind: k('angle') }),
      select('Spacing', ['Even', 'Packed', 'Units'], { bind: k('spread') }),
      slider('Period', 0, 40, { def: 12, format: (v) => (v ? String(Math.round(v)) : 'All'), bind: k('period') }),
      slider('Lead', 0.2, 60, { def: 0.5, step: 0.01, format: fixed(2), bind: k('lead') }),
    ] },
    { kind: 'ramps', title: 'Shape ramps', note: 'Interpolate from A to B', controls: [
      ramp('Width', 0, 1, { def: { a: 0.5, b: 0.5, curve: 'linear' }, bind: kr('w') }),
      ramp('Gap', 0, 400, { def: { a: 0.5, b: 0.5, curve: 'linear' }, bind: kr('g') }), ramp('Start', -0.5, 1, { def: { a: 0, b: 0, curve: 'linear' }, bind: kr('s') }),
      ramp('End', 0, 1.5, { def: { a: 1, b: 1, curve: 'linear' }, bind: kr('e') }), ramp('Shear', -3, 3, { def: { a: 0, b: 0, curve: 'linear' }, bind: kr('k') }),
    ] },
    { kind: 'more', title: 'More geometry', note: 'Waves, dash & offsets', controls: [
      ramp('Wave height', 0, 0.3, { def: { a: 0, b: 0, curve: 'linear' }, bind: kr('a') }),
      ramp('Wave phase', -1, 1, { def: { a: 0, b: 0, curve: 'linear' }, bind: kr('ph') }), ramp('Bend', -0.6, 0.6, { def: { a: 0, b: 0, curve: 'linear' }, id: 'stripe-bend', bind: kr('b') }),
      slider('Waves', 0, 12, { def: 3, step: 0.1, bind: k('freq') }), slider('Dash', 0, 1, { def: 0, format: (v) => (v ? pct(v) : 'Off'), bind: k('dash') }),
      slider('Dash gap', 0, 1, { def: 0.05, format: pct, bind: k('gap') }),
      slider('Link hairline', 0, 8, { def: 0, step: 0.1, format: px, bind: k('link') }),
      slider('Offset', -1, 1, { def: 0, id: 'stripe-offset', bind: k('offset') }),
    ] },
  ] },
  'radial array': { label: 'Radial Array', state: (p) => `${p.count} ${p.mode === 'rings' ? 'rings' : 'rays'}`, groups: [
    { title: 'Layout', note: 'Rays or rings round a centre', controls: [
      seg('Draw', ['Rays', 'Rings'], { bind: k('mode') }), slider('Count', 1, 240, { def: 36, id: 'radial-count', bind: k('count') }),
      point('Centre', -2, 3, { id: 'radial-centre', bind: kk('cx', 'cy') }),
      slider('Start', -180, 180, { def: -90, format: deg, id: 'radial-start', bind: k('start') }), slider('Span', 1, 360, { def: 360, format: deg, id: 'radial-span', bind: k('span') }),
      seg('Ray shape', ['Bar', 'Wedge', 'Spike'], { bind: k('shape') }),
    ] },
    { kind: 'ramps', title: 'Shape ramps', note: 'Interpolate from A to B', controls: [
      ramp('Inner radius', 0, 4, { def: { a: 0.2, b: 0.2, curve: 'linear' }, bind: kr('r0'), curves: RADIAL_CURVES }),
      ramp('Outer radius', 0, 12, { def: { a: 1, b: 1, curve: 'linear' }, bind: kr('r1'), curves: RADIAL_CURVES }),
      ramp('Width', 0, 1, { def: { a: 0.5, b: 0.5, curve: 'linear' }, id: 'radial-width', bind: kr('w'), curves: RADIAL_CURVES }),
      ramp('Turn', -180, 180, { def: { a: 0, b: 0, curve: 'linear' }, bind: kr('rot'), curves: RADIAL_CURVES }),
    ] },
    { kind: 'more', title: 'Segments', note: 'Breaks and zigzags', controls: [
      slider('Segments', 1, 24, { def: 1, bind: k('segments') }), slider('Segment gap', 0, 0.9, { def: 0.1, format: pct, bind: k('segGap') }),
      slider('Taper', -1, 1, { def: 0, bind: k('taper') }),
      slider('Zigzag', 0, 1, { def: 0, bind: k('zig') }), slider('Zigzag points', 2, 32, { def: 8, bind: k('zigN') }),
    ] },
  ] },
  tiling: { label: 'Tiling', state: (p) => `${p.cols} × ${p.rows}`, groups: [
    { title: 'Layout', note: 'Cells and their fills', controls: [
      select('Layout', ['Bricks', 'Checker', 'Columns', 'Maze'], { bind: k('layout') }), slider('Columns', 1, 40, { def: 4, id: 'tile-columns', bind: k('cols') }),
      slider('Rows', 1, 60, { def: 6, id: 'tile-rows', bind: k('rows') }), slider('Gap', 0, 0.4, { def: 0.04, format: pct, id: 'tile-gap', bind: k('gap') }),
      slider('Vary length', 0, 0.9, { def: 0.4, format: pct, bind: k('vary') }),
      toggle('Shift odd columns', { bind: k('shift', (v) => (v ? 0.5 : 0), (v) => v > 0) }),
      select('Fill A', ['Solid', 'Dots', 'Lines', { value: 'rows', label: 'Rows of lines' }, 'None'], { bind: kmap('fillA', [['rows', 'hlines']]) }),
      select('Fill B', ['Solid', 'Dots', 'Lines', { value: 'rows', label: 'Rows of lines' }, 'None'], { def: 'dots', bind: kmap('fillB', [['rows', 'hlines']]) }),
      select('Alternate', ['Checker', 'Row', 'Column', 'Random'], { bind: kmap('alt', [['column', 'col']]) }),
      slider('Texture pitch', 2, 40, { def: 8, format: px, bind: k('tex') }), slider('Texture size', 0.05, 1, { def: 0.45, format: pct, bind: k('texSize') }),
      slider('Frame', 0, 0.1, { def: 0, step: 0.005, format: pct, id: 'tile-frame', bind: k('frame') }), slider('Seed', 1, 99, { def: 1, id: 'tile-seed', bind: k('seed') }),
    ] },
  ] },
  stipple: { label: 'Stipple / Mosaic', state: (p) => (isMosaic(p) ? `${p.cols} columns` : `${p.spacing} px spacing`), groups: [
    { title: 'Stipple', note: 'Dots by the field', controls: STIPPLE_MOSAIC },
  ] },
}

/* his one line for Stripe Array; the engine's own line for the others */
const ABOUT = { stripeArray: 'Rows of bands whose width, gap and ends ramp from A to B.' }

export const GENERATE = {
  id: 'generate', kind: 'Generate', title: (p) => STYLES.find((s) => s.value === windowStyle(p.genStyle))?.label,
  init: () => pickStyle('stripeArray'),
  header: [
    select('Style', STYLES, { def: 'stripe array', bind: { get: (p) => windowStyle(p.genStyle), set: (v) => pickStyle(engineStyle(v)) } }),
    select('Preset', ['Custom'], { def: 'custom' }),
    text('Description', { def: ABOUT.stripeArray, bind: { get: (p) => ABOUT[p.genStyle] ?? styleById(p.genStyle).about, set: () => ({}) } }),
    button('Expand', { act: 'expand' }),
  ],
  sections: (p) => [FIELD, RAMP, { key: 'style', ...STYLE_SECTIONS[windowStyle(p.genStyle)] }, MASK, WARP, RANDOMNESS, FRAME_SECTION],
  allSections: () => [FIELD, RAMP, ...Object.entries(STYLE_SECTIONS).map(([key, s]) => ({ key: `style:${key}`, ...s })), MASK, WARP, RANDOMNESS, FRAME_SECTION],
  /* the field map strip under the preview — the field type drawn as a CSS gradient */
  fieldMap: (p) => {
    const cx = p.fX ?? 0.5, cy = p.fY ?? 0.5
    const type = p.fKind
    const stops = 'var(--kol-oq-16), var(--kol-fg-96), var(--kol-oq-16)'
    const background = type === 'linear' ? `linear-gradient(${90 + (p.fAngle ?? 0)}deg, var(--kol-oq-16), var(--kol-fg-96))`
      : type === 'conic' ? `conic-gradient(from ${p.fAngle ?? 0}deg, ${stops})`
      : type === 'sine' || type === 'waves' || type === 'ridge' ? `repeating-linear-gradient(90deg, ${stops} ${Math.max(4, 100 / (p.fFreq || 1))}%)`
      : `linear-gradient(90deg, var(--kol-oq-16) 0%, var(--kol-fg-96) ${cx * 100}%, var(--kol-oq-16) 100%)`
    return { background, left: FIELD_TYPES.find((t) => t.value === type)?.label, right: `Centre ${Number(cx).toFixed(2)} / ${Number(cy).toFixed(2)}` }
  },
}

/* ── REPEAT ───────────────────────────────────────────────────────────────────────────────────────────────────────── */
const REPEAT_MODES = { radial: 'Radial', grid: 'Grid', mirror: 'Mirror' }
const COMMON = () => [seg('Mode', ['Radial', 'Grid', 'Mirror'], { bind: k('repMode') }), picker('Source', { bind: k('sourceId', (v) => v || null) }), toggle('Reverse overlap', { bind: k('repReverse') })]
export const REPEAT = {
  id: 'repeat', kind: 'Repeat', title: () => 'Repeat',
  init: () => ({ ...REPEAT_DEFAULTS, sourceId: null }),
  header: [button('Expand', { act: 'expand' })],
  /* Mode is the tabs; the nav lists the common rows and the mode's own */
  sections: (p) => [
    { key: 'common', label: 'Common', state: () => REPEAT_MODES[p.repMode ?? 'radial'], groups: [{ title: 'Repeat', note: 'Copies of a linked layer', controls: COMMON() }] },
    { key: 'mode', ...REPEAT_SECTIONS[p.repMode ?? 'radial'] },
  ],
  allSections: () => [{ key: 'common', label: 'Common', groups: [{ controls: COMMON() }] },
    ...Object.entries(REPEAT_SECTIONS).map(([key, s]) => ({ key: `mode:${key}`, ...s }))],
}
const REPEAT_SECTIONS = {
  radial: { label: 'Radial', state: (p) => `${p.repCount} copies`, groups: [{ title: 'Radial', note: 'Round a centre', controls: [
    slider('Count', 2, 64, { def: 8, id: 'repeat-count', bind: k('repCount') }), slider('Radius', 0, 2000, { def: 200, format: px, id: 'repeat-radius', bind: k('repRadius') }),
    slider('Start angle', -180, 180, { def: 90, format: deg, bind: k('repPivotAngle') }), slider('Span', 1, 360, { def: 360, format: deg, id: 'repeat-span', bind: k('repSpan') }),
    slider('Rotate per step', -180, 180, { def: 0, format: deg, bind: k('repRotate') }), slider('Scale per step', 0.5, 1.5, { def: 1, step: 0.005, format: pct, bind: k('repScale') }),
    toggle('Align to path'),
  ] }] },
  grid: { label: 'Grid', state: (p) => `${p.repCols} × ${p.repRows}`, groups: [{ title: 'Grid', note: 'Rows and columns', controls: [
    slider('Columns', 1, 40, { def: 3, id: 'grid-columns', bind: k('repCols') }), slider('Rows', 1, 40, { def: 3, id: 'grid-rows', bind: k('repRows') }),
    slider('Gap X', -1000, 1000, { def: 20, format: px, bind: k('repGapX') }), slider('Gap Y', -1000, 1000, { def: 20, format: px, bind: k('repGapY') }),
    slider('Row offset', -1000, 1000, { def: 0, format: px, bind: k('repRowShift') }), slider('Column offset', -1000, 1000, { def: 0, format: px, bind: k('repColShift') }),
    slider('Rotate per step', -180, 180, { def: 0, format: deg, id: 'grid-rotate', bind: k('repRotate') }),
    slider('Scale per step', 0.5, 1.5, { def: 1, step: 0.005, format: pct, id: 'grid-scale', bind: k('repScale') }),
  ] }] },
  mirror: { label: 'Mirror', state: (p) => (p.repPoint ? 'Point' : `${Math.round(p.repAxisAngle)}° axis`), groups: [{ title: 'Mirror', note: 'Across an axis or a point', controls: [
    slider('Axis angle', -180, 180, { def: 90, format: deg, bind: k('repAxisAngle') }),
    point('Axis offset', -2000, 2000, { def: [0, 0], bind: kk('repAxisX', 'repAxisY') }), toggle('Point mirror', { bind: k('repPoint') }),
  ] }] },
}

/* ── TYPE (the Paratype letter) — every row is the Paratype glyph loop's own param ─────────────────────────────────── */
const GLYPHS = ['o', 'c', 'e', 'n', 'm', 'h', 'l', 'i', 'd', 'b', 'p', 'q', 't']
export const TYPE = {
  id: 'type', kind: 'Type', title: () => 'Paratype letter',
  loop: 'paratype-glyph',
  header: [button('Expand', { act: 'expand' })],
  sections: () => TYPE_SECTIONS,
  allSections: () => TYPE_SECTIONS,
}
const TYPE_SECTIONS = [
  { key: 'glyph', label: 'Glyph', state: (p) => `“${p.glyph}” · ${p.engine}`, groups: [{ title: 'Glyph', note: 'The letter and its engine', controls: [
    select('Glyph', GLYPHS.map((g) => ({ value: g, label: g })), { def: 'o', bind: k('glyph') }),
    seg('Engine', ['Classic', 'Skeleton'], { bind: k('engine') }),
    seg('Layout', ['Single', 'Specimen'], { bind: k('layout') }),
  ] }] },
  { key: 'metrics', label: 'Metrics', state: (p) => `x ${p.xHeight}`, groups: [{ title: 'Metrics', note: 'Heights in font units', controls: [
    slider('X-height', 40, 220, { def: 100, bind: k('xHeight') }), slider('Ascender', 60, 260, { def: 150, bind: k('ascender') }),
    slider('Descender', 5, 100, { def: 40, bind: k('descender') }), slider('Overshoot', 0, 20, { def: 4, bind: k('overshoot') }),
  ] }] },
  { key: 'weights', label: 'Weights', state: (p) => `stem ${p.stemWidth}`, groups: [{ title: 'Weights', note: 'Stroke widths', controls: [
    slider('Stem width', 2, 60, { def: 18, bind: k('stemWidth') }), slider('Round width', 30, 220, { def: 95, bind: k('oWidth') }),
    slider('Bowl width', 30, 220, { def: 88, bind: k('bowlWidth') }), slider('Hairline', 0.5, 30, { def: 6, step: 0.5, bind: k('hairWidth'), id: 'type-hairline' }),
  ] }] },
  { key: 'expressive', label: 'Expressive', state: (p) => (p.serif > 0 ? 'Serif' : 'Sans'), groups: [{ title: 'Expressive', note: 'The letter’s character', controls: [
    slider('Aperture', 0.1, 1, { def: 0.7, bind: k('aperture') }), slider('Arch height', 0.5, 1.05, { def: 0.92, bind: k('archHeight') }),
    slider('Shoulder', 0, 0.4, { def: 0.12, bind: k('shoulder') }), slider('Superness', 0.1, 1.5, { def: 0.5, bind: k('superness') }),
    slider('Serif', 0, 1, { def: 0, bind: k('serif') }), slider('Jut length', 0, 1, { def: 0, bind: k('jut') }),
    slider('Segments', 6, 200, { def: 48, bind: k('segments') }),
  ] }] },
]

export const WINDOWS = { generate: GENERATE, repeat: REPEAT, type: TYPE }

/* every control of a window (each section, each style, each mode) */
export const controlsOf = (win) => [...win.header, ...win.allSections().flatMap((s) => s.groups.flatMap((g) => g.controls))]
/* a control's value: the engine's param, else its default */
export const valueOf = (x, p) => { const v = x.bind?.get(p); return v === undefined ? x.def : v }
/* a control's patch onto the params — any edit makes the preset Custom (fxr's setProp) */
export const patchOf = (win, x, v, p) => ({ ...x.bind.set(v, p), ...(win.id === 'generate' && x.id !== 'style' ? { genPreset: null } : {}) })
export const isLive = (x) => !!(x.bind || x.act)
/* the controls the engine has no param for — Style, Preset and Description are the window's own */
const OWN = new Set(['preset'])
export const disabledControls = (win) => controlsOf(win).filter((x) => !OWN.has(x.id) && !isLive(x)).map((x) => x.name)
/* kept for the W7.5 hand-off script */
export const fxrControls = disabledControls
