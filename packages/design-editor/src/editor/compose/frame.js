/* THE FRAME AS A FILE PART (plan-2026-11-18-kolbox-system 11.3): the frame's place (X, Y in frame units, the
 * 1080-wide virtual space layers live in), its fill, the fill's opacity and the page color around it. One writer and
 * one reader, shared by the saved file (useComposeFile's buildSpec, loadPreset) and the draft, so the two cannot drift.
 * A file saved before these fields opens at 0,0 with today's defaults: no migration.
 * (With frames as objects, below, these fields are the PAGE's: its offset and its color around the frames.) */

import { shapeToPathNodes } from './shape-math'
import { pathD, rotatePathNodes, shiftNode } from './path-math'

export const FRAME_DEFAULTS = {
  canvasX: 0,
  canvasY: 0,
  /* a new frame is white, in every theme and mode (his ruling 2026-11-19: "default background of a frame should be
   * FFFFFF not 000000"); it was the theme's flipping surface, so black in dark */
  canvasFill: '#ffffff',
  canvasFillOpacity: 1,
  infiniteFill: 'var(--kol-surface-secondary)',
  /* the frame's name (28.1): null reads as "Canvas", the Layers row's word */
  canvasName: null,
}

/* state → the spec's frame fields */
export const frameSpec = ({ canvasX, canvasY, canvasFill, canvasFillOpacity, infiniteFill, canvasName }) => ({
  canvasX, canvasY,
  canvas: { fill: canvasFill, fillOpacity: canvasFillOpacity, infiniteFill, ...(canvasName ? { name: canvasName } : {}) },
})

/* FRAMES AS OBJECTS (plan-2026-11-19-kolbox-whats-left C1, his ruling: "frame is not automatically there when you open
 * page"). Where the chrome turns them on (ComposeStateProvider `frames`), a document holds 0 or more frames, each a
 * top-level layer `{ type: 'frame', x, y, w, h, color, fillOpacity, name, density }` in the page's space, and a layer
 * in a frame carries `frameId`; it stays a top-level layer, so the canvas edits it exactly as before. The stage the
 * engine always drew is the page now: no fill, no edge, no name. `density` is export px per page unit (1 for a drawn
 * frame; an old file's frame keeps its own, so it exports at the size it always did). A file saved in this model
 * carries `frameModel: 2` and is never converted twice. */
/* 3 (C4.4): the file holds pages, below. A model-2 file has its frames already and opens as one page. */
export const FRAME_MODEL = 3
const FRAMES_SINCE = 2

/* an old file (or draft) → the same picture as one frame holding every layer. The frame sits at the page's origin with
   the old stage's size (`stageW` by `stageH` page units, `density` px each), its fill, opacity and name from the spec;
   the layers keep their coordinates, which were frame-relative and still are. Already converted: returned as is. */
export function toFramesDoc(spec, layers, { id, stageW, stageH, density = 1 }) {
  const list = Array.isArray(layers) ? layers : []
  if (spec?.frameModel >= FRAMES_SINCE || list.some((l) => l.type === 'frame')) return list
  const f = frameFromSpec(spec)
  const frame = {
    id, type: 'frame', visible: true, opacity: 1, blend: 'normal',
    name: f.canvasName, x: 0, y: 0, w: stageW, h: stageH, density,
    color: f.canvasFill, fillOpacity: f.canvasFillOpacity,
  }
  return [frame, ...list.map((l) => ({ ...l, frameId: id }))]
}

/* the frame the rulers, guides, zoom fit, size controls and export read: the selected frame, or the frame of the
   selected layer, else the first; null when the page has none */
export function activeFrameOf(layers, selectedId) {
  const sel = selectedId ? layers.find((l) => l.id === selectedId) : null
  const own = sel?.type === 'frame' ? sel : sel?.frameId ? layers.find((l) => l.id === sel.frameId && l.type === 'frame') : null
  return own ?? layers.find((l) => l.type === 'frame') ?? null
}

/* a frame's layers: the ones that carry its id */
export const membersOf = (layers, frameId) => layers.filter((l) => l.frameId === frameId)

/* A FRAME IS A CONTAINER (plan-2026-11-20-kolbox-everything-left W5). Its layers stay top-level layers in page
   coordinates, so a frame's turn is carried by its layers: each one's centre turns about the frame's centre and its own
   rotation takes the same degrees, so the canvas, the selection and the export draw them turned with no second
   transform. `clip` false lets its layers show outside it; unset clips (Figma's default for a new frame). */
export const clipsContent = (f) => f?.type === 'frame' && f.clip !== false

/* the frame's outline in page coordinates: its corners and its turn */
export function frameOutline(f) {
  const geo = shapeToPathNodes({ kind: 'rect', w: f.w, h: f.h, radius: f.radius, radii: f.radii, strokeWidth: 0 })
  let nodes = geo.nodes.map((n) => shiftNode(n, f.x ?? 0, f.y ?? 0))
  if (f.rotation) nodes = rotatePathNodes(nodes, f.rotation, f.x + f.w / 2, f.y + f.h / 2)
  return pathD(nodes, true)
}

/* after a write to frame `id`: a change of its rotation turns its layers with it (a no-op for anything else) */
export function turnMembers(prev, next, id) {
  if (next === prev) return next
  const f0 = prev.find((l) => l.id === id)
  const f1 = next.find((l) => l.id === id)
  if (f0?.type !== 'frame' || !f1) return next
  const d = (Number(f1.rotation) || 0) - (Number(f0.rotation) || 0)
  if (!d) return next
  const r = (d * Math.PI) / 180, cos = Math.cos(r), sin = Math.sin(r)
  const cx = f1.x + f1.w / 2, cy = f1.y + f1.h / 2
  return next.map((l) => {
    if (l.frameId !== id || typeof l.x !== 'number') return l
    const w = l.w ?? 0, h = l.h ?? 0
    const px = l.x + w / 2 - cx, py = l.y + h / 2 - cy
    return { ...l, x: cx + px * cos - py * sin - w / 2, y: cy + px * sin + py * cos - h / 2, rotation: ((((l.rotation ?? 0) + d) % 360) + 360) % 360 }
  })
}

/* the topmost visible frame under a page point, or null */
export function frameAt(layers, x, y) {
  for (let i = layers.length - 1; i >= 0; i--) {
    const l = layers[i]
    if (l.type !== 'frame' || l.visible === false) continue
    /* a turned frame: the point turned back into its box */
    const r = (-(l.rotation ?? 0) * Math.PI) / 180, cx = l.x + l.w / 2, cy = l.y + l.h / 2
    const px = cx + (x - cx) * Math.cos(r) - (y - cy) * Math.sin(r), py = cy + (x - cx) * Math.sin(r) + (y - cy) * Math.cos(r)
    if (px >= l.x && px <= l.x + l.w && py >= l.y && py <= l.y + l.h) return l
  }
  return null
}

/* LAYERS NEST BY DRAG (plan-2026-11-19-kolbox-whats-left R5, his "nothing pushes inside layer"): one layer (or a frame
   with its members) moved in the page's flat list, bottom of the z-order first, and its frame set. `position`, as the
   Layers list shows it (top of the z-order first): 'into' a frame (on top of its members), 'above' or 'below' a row.
   Next to a frame's row is the page level; next to a member's row is inside that member's frame. A frame moves as a
   block among the top level (a member's row stands for its frame, 'into' reads 'above'). Coordinates are the page's
   for every layer, framed or not, so nothing moves on screen. Unchanged, the same array comes back (no undo step). */
export function placeInList(layers, id, targetId, position) {
  const me = layers.find((l) => l.id === id)
  if (!me || id === targetId) return layers
  const isFrame = me.type === 'frame'
  const block = layers.filter((l) => l.id === id || (isFrame && l.frameId === id))
  const ids = new Set(block.map((l) => l.id))
  if (ids.has(targetId)) return layers
  const rest = layers.filter((l) => !ids.has(l.id))
  let t = rest.find((l) => l.id === targetId)
  if (!t) return layers
  let pos = position
  if (isFrame) {
    if (t.frameId) t = rest.find((l) => l.id === t.frameId) ?? t
    if (pos === 'into') pos = 'above'
  }
  const indexOf = (lid) => rest.findIndex((l) => l.id === lid)
  /* a frame's block ends at its topmost member */
  const blockEnd = (fid) => rest.reduce((k, l, i) => (l.frameId === fid && i > k ? i : k), indexOf(fid))
  let at, frameId = null
  if (pos === 'into') {
    if (t.type !== 'frame') return layers
    frameId = t.id
    at = blockEnd(t.id) + 1
  } else if (t.type === 'frame') {
    at = pos === 'above' ? blockEnd(t.id) + 1 : indexOf(t.id)
  } else {
    frameId = t.frameId ?? null
    at = pos === 'above' ? indexOf(t.id) + 1 : indexOf(t.id)
  }
  const moved = isFrame ? block : block.map((l) => {
    if (frameId) return l.frameId === frameId ? l : { ...l, frameId }
    if (l.frameId == null) return l
    const { frameId: _drop, ...bare } = l
    return bare
  })
  const next = [...rest.slice(0, at), ...moved, ...rest.slice(at)]
  return next.every((l, i) => l === layers[i]) ? layers : next
}

/* PAGES (plan-2026-11-19-kolbox-whats-left C4.4, his words: "Pages dont work"). A document holds 1 or more pages, each
 * `{ id, name, color }` (color: the page color around its frames). In the FILE every layer and frame carries its
 * `pageId` and `pages` lists them in order; in the ENGINE the open page's layers are the live `layers` and each other
 * page keeps its own under `layers` in its entry, so the canvas, Layers and every write read the open page as before.
 * A file without pages (any older file, after toFramesDoc) opens as one page holding everything, its page color the
 * file's `canvas.infiniteFill`. */
export const PAGE_NAME = (n) => `Page ${n}`

/* spec + its (converted) layers → the engine's pages `[{ id, name, color, layers }]`, the first page first */
export function toPages(spec, layers) {
  const list = Array.isArray(layers) ? layers : []
  const meta = Array.isArray(spec?.pages) && spec.pages.length
    ? spec.pages.filter((p) => p && typeof p.id === 'string')
    : [{ id: 'page-1', name: PAGE_NAME(1), color: frameFromSpec(spec).infiniteFill }]
  const ids = new Set(meta.map((p) => p.id))
  const pageOf = (l) => (ids.has(l.pageId) ? l.pageId : meta[0].id)
  return meta.map((p, i) => ({
    id: p.id,
    name: typeof p.name === 'string' && p.name ? p.name : PAGE_NAME(i + 1),
    color: p.color !== undefined ? p.color : FRAME_DEFAULTS.infiniteFill,
    /* the color style the page follows (W7) */
    ...(typeof p.style === 'string' ? { style: p.style } : {}),
    layers: list.filter((l) => pageOf(l) === p.id),
  }))
}

/* the engine's pages (the open one's layers live) → the file's `pages` and its one `layers` list, each stamped */
export function pagesSpec(pages, openId, liveLayers) {
  return {
    pages: pages.map(({ id, name, color, style }) => ({ id, name, color, ...(style ? { style } : {}) })),
    layers: pages.flatMap((p) => (p.id === openId ? liveLayers : p.layers).map((l) => (l.pageId === p.id ? l : { ...l, pageId: p.id }))),
  }
}

/* EVERY FRAME (C4.4 for the Export window): `[{ pageId, pageName, frame, layers }]`, page by page in page order, each
   frame with its page's whole layer list (so a frame's members and region read as on its page); `pageId` narrows it to
   one page */
export function everyFrameOf(pages, openId, liveLayers, pageId = null) {
  return pages
    .filter((p) => !pageId || p.id === pageId)
    .flatMap((p) => {
      const layers = p.id === openId ? liveLayers : p.layers
      return layers.filter((l) => l.type === 'frame').map((frame) => ({ pageId: p.id, pageName: p.name, frame, layers }))
    })
}

/* THE CLIPBOARD'S PLACING (C4.4): copied layers (already re-id'd, a frame before its members) onto a page's `layers`.
   `at` (a page point) moves the set so its top left lands there; without it they keep their place. A frame in the set
   keeps its members; any other layer lands in the frame under its centre on that page, or on the page. */
export function placePaste(items, layers, at = null) {
  const placed = items.filter((l) => typeof l.x === 'number')
  const x0 = placed.length ? Math.min(...placed.map((l) => l.x)) : 0
  const y0 = placed.length ? Math.min(...placed.map((l) => l.y)) : 0
  const dx = at ? at.x - x0 : 0, dy = at ? at.y - y0 : 0
  const moved = items.map((l) => (typeof l.x === 'number' && (dx || dy) ? { ...l, x: l.x + dx, y: l.y + dy } : l))
  const ownFrames = new Set(moved.filter((l) => l.type === 'frame').map((l) => l.id))
  return moved.map((l) => {
    if (l.type === 'frame') { const { frameId, ...rest } = l; return rest }
    if (l.frameId && ownFrames.has(l.frameId)) return l
    const f = typeof l.x === 'number' ? frameAt(layers, l.x + (l.w ?? 0) / 2, l.y + (l.h ?? 0) / 2) : null
    if (f) return { ...l, frameId: f.id }
    const { frameId, ...rest } = l
    return rest
  })
}

/* a spec (file or draft) → the frame's state, defaults for whatever it lacks; `null` fill (None) survives */
export function frameFromSpec(spec) {
  const c = spec?.canvas ?? {}
  return {
    canvasX: typeof spec?.canvasX === 'number' ? spec.canvasX : FRAME_DEFAULTS.canvasX,
    canvasY: typeof spec?.canvasY === 'number' ? spec.canvasY : FRAME_DEFAULTS.canvasY,
    canvasFill: c.fill !== undefined ? c.fill : FRAME_DEFAULTS.canvasFill,
    canvasFillOpacity: typeof c.fillOpacity === 'number' ? c.fillOpacity : FRAME_DEFAULTS.canvasFillOpacity,
    infiniteFill: c.infiniteFill !== undefined ? c.infiniteFill : FRAME_DEFAULTS.infiniteFill,
    canvasName: typeof c.name === 'string' && c.name ? c.name : FRAME_DEFAULTS.canvasName,
  }
}
