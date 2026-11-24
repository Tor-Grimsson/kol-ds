import { canvasOutline } from './masks'
import { TUNE, tuneBody } from './tune'
import { vehicleOf as lineSwellVehicle } from '../../generate/lineSwell/row.js'

/**
 * THE LAYER MODEL (plan-2026-11-18-kolbox-system W22, his words: "layers are shapes, text and frames; the rest is a
 * fill or an effect"). Layer model 2:
 *
 *   photo                          → a rectangle whose `fill` is an image paint: { type: 'image', src, srcType, fit,
 *                                    imgX, imgY, imgW, imgH … } (everything the photo layer held)
 *   pattern · kinetic · generate   → an effect on a layer: a row in `layer.content`
 *   loop                           → a layer with motion: a `loop` row in `layer.content`
 *
 *   content: [{ key, type, enabled, params }]   — each row draws in the layer's box, clipped to its outline, above
 *                                                 the layer's own fill; `params` is what the old layer of that type
 *                                                 carried, minus the box
 *
 * Misc and Empty layer (`group`) are not converted: 22.5 waits on his ruling.
 *
 * DRAWING REUSES THE OLD CODE (the "vehicles"): a layer with an image fill or content rows draws its fill as the old
 * photo layer and each row as the old layer of that type, built from the row's params and the layer's box, then its
 * own body. A converted file draws through exactly the code that drew it before. `expandLayer` is the one seam the
 * canvas (LayerRenderer) and the export (build.js, useComposeFile) both go through.
 *
 * Conversion happens in one place, `toModelDeep`, on the load seam (state.jsx reidLayers, the draft restore) and in
 * addLayer, only where the chrome turns the model on (ComposeStateProvider `layerModel`). A saved file carries
 * `layerModel: 2` and is never converted twice. The converted layer keeps every old field inside its fill or its
 * row, so nothing is lost before the file is saved again.
 */
export const LAYER_MODEL = 2

/* the old types that convert, and what each becomes */
export const CONTENT_TYPES = ['pattern', 'kinetic', 'generate', 'loop']
export const CONTENT_LABELS = { pattern: 'Pattern', kinetic: 'Kinetic type', generate: 'Generate', loop: 'Motion', repeat: 'Repeat', tune: 'Tune', morph: 'Morph', lineSwell: 'Line Swell' }
/* Morph is a row too (plan-2026-11-19-kolbox-whats-left R4.2, his "isnt this an FX"): a text layer's weight axis
   morph. Like Tune it draws nothing of its own: the row is the effect's place, eye and minus; its settings stay the text
   layer's own axis fields (axisMode, weight2, axisCurve, curveCp1, curveCp2, axisBlend), and the row turns the body's
   `axisOn` on or off. A text layer from before the row (axisOn true, no row) keeps drawing through its own axisOn. */
export const MORPH = 'morph'
export const morphRowOf = (l) => contentOf(l).find((c) => c.type === MORPH) ?? null
const morphOf = (l) => { const r = morphRowOf(l); return r ? { axisOn: r.enabled !== false } : {} }
/* Tune is a row too (C6.2, ./tune.js): it draws nothing of its own, it changes what the layer's body draws */
/* Repeat is a row too, added from the Effects menu (23.0b's Generate group): copies of the layer it sits on. Old repeat
   layers (copies of ANOTHER layer, by sourceId) are not in his table and stay layers. */

/* the layer's box and transform: shared by the layer and everything drawn in it */
const BOX_KEYS = ['id', 'x', 'y', 'w', 'h', 'rotation', 'flipX', 'flipY', 'skewX', 'skewY', 'opacity', 'blend', 'maskedBy', 'isMask', '_clipD']
/* what stays the layer's own when an old layer converts (the effect systems the rail lists stay on the layer) */
/* `frameId`: the frame a layer sits in (frames as objects, ./frame.js) stays the layer's */
const HOST_KEYS = [...BOX_KEYS, 'visible', 'name', 'locked', 'aspectLocked', 'filters', 'effects', 'effectsRefW', 'effectsFillOpacity', 'frameId']
/* the rendering systems that act on the WHOLE layer: given to its first vehicle so they run once, as before */
const CHAIN_KEYS = ['filters', 'effects', 'effectsRefW', 'effectsFillOpacity']

const pick = (o, keys) => { const out = {}; for (const k of keys) if (o[k] !== undefined) out[k] = o[k]; return out }
const omit = (o, keys) => { const out = { ...o }; for (const k of keys) delete out[k]; return out }
const newKey = () => `ct-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/* a content row for a type, from the old layer's own fields (or the defaults a fresh one gets) */
export const makeContent = (type, params = {}) => ({ key: newKey(), type, enabled: true, params })

/* the rectangle a converted layer becomes: no fill, no stroke, the old layer's box */
const hostFrom = (l) => ({ ...pick(l, HOST_KEYS), type: 'shape', kind: 'rect', fit: 'fill', color: null, stroke: null, strokeWidth: 0 })
const paramsOf = (l) => omit(l, [...HOST_KEYS, 'type'])

/* one old layer → the model; anything already in the model (or not converted) returns the SAME object */
export function toModel(l) {
  if (!l || typeof l !== 'object') return l
  if (l.type === 'photo') return { ...hostFrom(l), fill: { ...paramsOf(l), type: 'image' } }
  if (CONTENT_TYPES.includes(l.type)) return { ...hostFrom(l), content: [makeContent(l.type, paramsOf(l))] }
  if (Array.isArray(l.children)) {
    const kids = toModelDeep(l.children)
    return kids === l.children ? l : { ...l, children: kids }
  }
  return l
}
export function toModelDeep(list) {
  if (!Array.isArray(list)) return list
  let changed = false
  const next = list.map((l) => { const n = toModel(l); if (n !== l) changed = true; return n })
  return changed ? next : list
}

/* an image fill the photo vehicle draws, on a shape or a path (its Tile mode, and text wearing an image through its
   glyphs, stay the CSS paint, paintFill.js) */
export const hasImageFill = (l) => {
  const f = l?.fill
  return (l.type === 'shape' || l.type === 'path') && (f?.type === 'image' || f?.type === 'video') && f.mode !== 'tile' && !f.hidden && (!!f.src || f.srcType === 'webcam')
}
export const contentOf = (l) => (Array.isArray(l?.content) ? l.content : [])

/* SEVERAL FILLS AND STROKES (plan-2026-11-20-kolbox-everything-left W6.2, Figma's Fill and Stroke lists). A layer's own
 * fill (`color`, `fillOpacity`, `fillHidden`, or its paint `fill`) and stroke (`stroke`, `strokeOpacity`,
 * `strokeHidden`) are the bottom row of each list; `fills` and `strokes` hold the rows above them, bottom first, each
 * `{ color, opacity, hidden }`. Every stroke shares the layer's width, position and sides. A file without the two keys
 * draws as it did. The stack draws bottom first: the own fill (with the whole-layer systems), each fill row, the own
 * stroke, each stroke row; each a copy of the layer body painting that one thing.
 * ponytail: each copy wears the layer's opacity and blend on its own, so a see-through layer with several rows darkens
 * where they overlap; one group per layer is exact if that shows. */
export const fillRows = (l) => (Array.isArray(l?.fills) ? l.fills : [])
export const strokeRows = (l) => (Array.isArray(l?.strokes) ? l.strokes : [])
const STACK_TYPES = ['shape', 'path', 'frame']
const stacked = (l) => STACK_TYPES.includes(l?.type) && (fillRows(l).length > 0 || strokeRows(l).length > 0)
export function paintStack(body) {
  if (!stacked(body)) return [body]
  const own = omit(body, ['fills', 'strokes'])
  const bare = omit(own, [...CHAIN_KEYS, 'content'])
  const stroked = !!own.stroke && ((own.strokeWidth ?? 0) > 0 || Array.isArray(own.strokeSides))
  const noStroke = { stroke: null, strokeWidth: 0 }
  const noFill = { color: null, fill: null }
  return [
    { ...own, ...noStroke },
    ...fillRows(body).map((f) => ({ ...bare, ...noStroke, fill: null, color: f.color ?? null, fillOpacity: f.opacity ?? 1, fillHidden: !!f.hidden, _v: 'paint' })),
    ...(stroked ? [{ ...bare, ...noFill, _v: 'paint' }] : []),
    ...(stroked ? strokeRows(body).map((r) => ({ ...bare, ...noFill, stroke: r.color ?? null, strokeOpacity: r.opacity ?? 1, strokeHidden: !!r.hidden, _v: 'paint' })) : []),
  ]
}

export const hasVehicles = (l) => !!l && !l._v && (hasImageFill(l) || contentOf(l).some((c) => c.enabled !== false) || stacked(l))

/* The photo a layer shows: a photo layer, or a layer's image fill as the photo it draws (the generator's image
   source reads it, useGenerateImage); null for anything else. */
const photoCache = new WeakMap()
export function photoOf(l) {
  if (!l) return null
  if (l.type === 'photo') return l
  if (!hasImageFill(l)) return null
  if (photoCache.has(l)) return photoCache.get(l)
  const { type: _t, mode, ...f } = l.fill
  const out = { ...f, fit: f.fit ?? (mode === 'fit' ? 'contain' : 'cover'), srcType: f.srcType ?? (l.fill.type === 'video' ? 'video' : 'image'), type: 'photo', ...pick(l, BOX_KEYS), visible: true }
  photoCache.set(l, out)
  return out
}

/* A content row's vehicle: the old layer of its type, rebuilt from the row and the layer's box (the row's own
   settings surfaces read and write it through this view) */
export const contentView = (host, row) => ({ ...row.params, type: row.type, ...pick(host, BOX_KEYS), ...pick(host, CHAIN_KEYS), visible: true })

/* the outline a vehicle is clipped to: a shape that is not a plain box, or a path */
const plainBox = (l) => l.type === 'shape' && (l.kind ?? 'logo') === 'rect' && !l.radius && !(Array.isArray(l.radii) && l.radii.some(Boolean))
function outlines(l) {
  if (l.type !== 'path' && (l.type !== 'shape' || plainBox(l))) return null
  const local = canvasOutline({ ...l, x: 0, y: 0 })
  return local ? { local, canvas: canvasOutline(l) } : null
}

/* THE SEAM: a layer → what is drawn for it, bottom first: its image fill (as the photo layer), its own body, its
   content rows (as the old layers). Memoised on the layer's identity, so the vehicles keep theirs between renders
   (the render caches key on it). Vehicles carry the layer's id, so a press on any of them selects the layer.
   ponytail: the whole-layer systems (filter chain, layer effects) go to the first vehicle only, and two canvas-drawn
   vehicles share the id the export looks a live canvas up by; one vehicle per layer is exact (every converted file). */
const cache = new WeakMap()
export function expandLayer(l) {
  if (!hasVehicles(l)) return [l]
  const hit = cache.get(l)
  if (hit) return hit
  const box = pick(l, BOX_KEYS)
  const clip = outlines(l)
  const clipOf = clip ? { ...(box._clipD ? {} : { _clipD: clip.local }), _clipOutline: clip.canvas } : {}
  const vehicles = []
  const photo = photoOf(l)
  if (photo) vehicles.push({ ...photo, ...clipOf, _v: 'fill' })
  for (const row of contentOf(l)) {
    if (row.enabled === false || row.type === TUNE || row.type === MORPH) continue
    /* a Repeat row copies the layer it is on, without its Repeat rows (a copy that repeats would never end) */
    const src = row.type === 'repeat' ? { ...l, content: contentOf(l).filter((c) => c.type !== 'repeat') } : null
    /* a Line Swell row (R8) draws as a generate vehicle of its form */
    if (row.type === 'lineSwell') { const g = lineSwellVehicle(l, row); if (g) vehicles.push({ ...contentView(l, row), ...g, ...clipOf, _v: 'content' }); continue }
    vehicles.push(src ? { ...contentView(l, row), sourceId: l.id, _source: src, _v: 'content' } : { ...contentView(l, row), ...clipOf, _v: 'content' })
  }
  /* an enabled Tune row reshapes the body (./tune.js); with no other row the body keeps the whole-layer systems */
  const tune = contentOf(l).find((c) => c.type === TUNE && c.enabled !== false)
  if (!vehicles.length) {
    const only = paintStack(tuneBody({ ...omit(l, ['content']), ...morphOf(l), _v: 'body' }, tune))
    if (l.visible === false) only.forEach((v, i) => { only[i] = { ...v, visible: false } })
    cache.set(l, only)
    return only
  }
  vehicles[0] = { ...vehicles[0], ...pick(l, CHAIN_KEYS) }
  /* the image fill is the layer's fill, so its body draws no solid under it; a text layer under a kinetic row is drawn by
     the row (it took the layer's words) */
  const textByKinetic = l.type === 'text' && contentOf(l).some((c) => c.enabled !== false && c.type === 'kinetic')
  const body = tuneBody({ ...omit(l, ['content', ...CHAIN_KEYS]), ...morphOf(l), ...(photo ? { fill: null, color: null } : {}), ...(textByKinetic ? { visible: false } : {}), _v: 'body' }, tune)
  /* a body that paints nothing (a converted layer: no fill, no stroke) is left out, so the vehicles draw alone, exactly
     as the old layer did */
  const paints = body.visible !== false && (body.type !== 'shape' || body.color != null || (body.stroke && (body.strokeWidth ?? 0) > 0) || (body.fill?.type && !body.fill.hidden))
  const bodies = paints ? paintStack(body) : []
  const out = photo ? [vehicles[0], ...bodies, ...vehicles.slice(1)] : [...bodies, ...vehicles]
  if (l.visible === false) out.forEach((v, i) => { out[i] = { ...v, visible: false } })
  cache.set(l, out)
  return out
}
export function expandLayersDeep(list) {
  if (!Array.isArray(list)) return list
  return list.flatMap((l) => {
    const kids = Array.isArray(l.children) ? expandLayersDeep(l.children) : null
    return expandLayer(kids && kids !== l.children ? { ...l, children: kids } : l)
  })
}

/* A row's edits, as the old layer's: `patch` merges into the row's params (a box key, x or w, or the chain goes to the layer) */
export function patchContent(host, key, patch) {
  /* the box and the whole-layer systems (filter chain, layer effects) are the layer's own */
  const boxPatch = pick(patch, [...BOX_KEYS.filter((k) => k !== 'id'), ...CHAIN_KEYS])
  const rest = omit(patch, [...BOX_KEYS, ...CHAIN_KEYS, 'type'])
  return {
    ...boxPatch,
    content: contentOf(host).map((c) => (c.key === key ? { ...c, params: { ...c.params, ...rest } } : c)),
  }
}
