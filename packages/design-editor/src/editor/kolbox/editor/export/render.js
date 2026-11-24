/* WHAT AN EXPORT WRITES (plan-2026-11-19-kolbox-whats-left C8, W30.2): the Export window and the inspector's Export section
 * both come here. A TARGET is what is exported: `frame` (the selected frame, else the frame of the selected layer, else
 * the first: the engine's activeFrame), `selection` (the selected layers, in their bounds, on nothing), `frames` (every
 * frame on the open page, one file each; the engine's everyFrame), `frames:all` (every frame on every page) `layer:<id>` (one layer or frame, from the inspector) or `page` (the open page, from the inspector with nothing
 * selected: ONE picture of the whole page, every frame and loose layer in their bounds, W11.3). A REGION is one picture:
 * its layers moved to its origin, its size in px, its fill. The SVG is the engine's own (buildLayersSvg), with the
 * engine's export steps carried: bindings resolved at the click, fonts warmed, still photos inlined (an SVG drawn as an
 * image fetches nothing). PNG is that SVG rasterised by KOL's svgToPngBlob at the scale; JPG is that PNG on white; PDF
 * is one page the region's size in points holding that JPG (W11.2). Video is the engine's loop bake (onExportWebm's
 * steps, here per region, W11.1): one loop, t = i / N per frame, each frame the region's SVG on a canvas, encoded by
 * mediabunny. Several files go into one .zip (the engine's makeZip). */
import {
  buildLayersSvg, expandLayersDeep, makeZip, membersOf, pack, resolveColor, resolveCssVar, resolveLayersDeep,
  transport, warmTextFonts, hasBindings, downloadBlob, findLayerDeep,
} from '../engine.js'
import { makeSmoothingState } from '../../../params/resolve.js'
import { atFullRes } from '../../../lib/previewScale.js'
import { svgToPngBlob } from '@kolkrabbi/kol-component'

export const FORMATS = [{ value: 'png', label: 'PNG' }, { value: 'jpg', label: 'JPG' }, { value: 'svg', label: 'SVG' }, { value: 'pdf', label: 'PDF' }, { value: 'webm', label: 'Video (WebM)' }]
export const STILL_FORMATS = FORMATS.filter((f) => f.value !== 'webm')
const WEBM_FPS = 30
export const SCALES = [0.5, 1, 2, 3, 4]

/* a user's name reaches a filesystem: the engine's rule (useComposeFile safeFilename) */
export const safeName = (s, fallback = 'Untitled') => String(s ?? '').replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, ' ').trim().slice(0, 80) || fallback

const frameName = (f, i = 0) => f?.name || `Frame ${i + 1}`
const placed = (l) => typeof l.x === 'number' && l.w > 0 && l.h > 0

/* a frame as a picture: its members at its origin, `density` px per page unit (the engine's region) */
function frameRegion(layers, f, i) {
  const k = f.density > 0 ? f.density : 1
  const ls = membersOf(layers, f.id).map((l) => (typeof l.x === 'number' ? { ...l, x: l.x - f.x, y: l.y - f.y } : l))
  return { name: frameName(f, i), layers: ls, w: Math.max(1, Math.round(f.w * k)), h: Math.max(1, Math.round(f.h * k)), fill: f.color ?? null, fillOpacity: f.fillOpacity ?? 1, viewW: f.w, edge: f, framed: true }
}
/* loose layers as a picture: their bounds, no fill. `frames`: the frames too, drawn as their boxes under the rest (a page) */
function boundsRegion(name, ls, frames = false) {
  const shown = ls.filter((l) => l && l.visible !== false && placed(l))
  const list = frames ? [...shown.filter((l) => l.type === 'frame'), ...shown.filter((l) => l.type !== 'frame')] : shown.filter((l) => l.type !== 'frame')
  if (!list.length) return null
  const x = Math.min(...list.map((l) => l.x)), y = Math.min(...list.map((l) => l.y))
  const w = Math.max(...list.map((l) => l.x + l.w)) - x, h = Math.max(...list.map((l) => l.y + l.h)) - y
  return { name, layers: list.map((l) => ({ ...l, x: l.x - x, y: l.y - y })), w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)), fill: null, fillOpacity: 1, viewW: w, framed: false }
}

/* target → the regions it writes ([] when there is nothing) */
export function regionsOf(state, target) {
  const { layers, frameMode, activeFrame, selectedIds = [] } = state
  const frames = frameMode ? layers.filter((l) => l.type === 'frame') : []
  const idx = (f) => frames.indexOf(f)
  /* a chrome with the one built-in frame (no frames as objects): the stage, as the engine always exported it */
  const stage = () => ({ name: state.canvasName || 'Canvas', layers, w: state.canvasW, h: state.canvasH, fill: state.canvasFill, fillOpacity: state.canvasFillOpacity ?? 1, viewW: null, framed: true })
  /* every frame, this page's or every page's (the engine's everyFrame: each frame with its own page's layers); on all
     pages the page's name leads a frame's, so two pages' "Frame 1" stay two files */
  if (target === 'frames' || target === 'frames:all') {
    if (!frameMode) return [stage()]
    const all = target === 'frames:all'
    const list = state.everyFrame(all ? null : state.pageId)
    const named = all && new Set(list.map((e) => e.pageId)).size > 1
    return list.flatMap((e) => regionsOf({ ...state, layers: e.layers }, `layer:${e.frame.id}`).map((r) => (named ? { ...r, name: `${e.pageName} ${r.name}` } : r)))
  }
  if (target === 'page') {
    if (!frameMode) return [stage()]
    const r = boundsRegion(state.pages?.find((p) => p.id === state.pageId)?.name || 'Page', layers, true)
    return r ? [r] : []
  }
  if (target === 'selection') {
    const ids = selectedIds.filter((id) => id !== 'canvas')
    const sel = ids.map((id) => findLayerDeep(layers, id)).filter(Boolean)
    if (sel.length === 1 && sel[0].type === 'frame') return [frameRegion(layers, sel[0], idx(sel[0]))]
    const r = boundsRegion(sel.length === 1 ? sel[0].name || 'Selection' : 'Selection', sel)
    return r ? [r] : []
  }
  if (typeof target === 'string' && target.startsWith('layer:')) {
    const l = findLayerDeep(layers, target.slice(6))
    if (!l) return []
    if (l.type === 'frame') return [frameRegion(layers, l, idx(l))]
    const r = boundsRegion(l.name || 'Layer', [l])
    return r ? [r] : []
  }
  /* 'frame' */
  if (!frameMode) return [stage()]
  if (activeFrame) return [frameRegion(layers, activeFrame, idx(activeFrame))]
  const r = boundsRegion('Page', layers)
  return r ? [r] : []
}

/* the targets this document offers, for the Export window's first row */
export function targetsOf(state) {
  const { frameMode, activeFrame, layers, selectedIds = [] } = state
  const frames = frameMode ? layers.filter((l) => l.type === 'frame') : []
  const out = [{ value: 'frame', label: !frameMode ? 'Frame' : activeFrame ? `Frame: ${frameName(activeFrame, frames.indexOf(activeFrame))}` : 'Page' }]
  const ids = selectedIds.filter((id) => id !== 'canvas')
  if (ids.length && !(ids.length === 1 && activeFrame?.id === ids[0])) out.push({ value: 'selection', label: ids.length === 1 ? 'Selection' : `Selection (${ids.length})` })
  const every = frameMode ? state.everyFrame().length : 0
  if (every > 1) out.push({ value: 'frames', label: `Every frame (${every})` })
  return out
}

/* does anything on the page move (a binding, a loop, kinetic type, a video)? then a video is worth writing.
   ponytail: a scan of the expanded layers on every render; memo on `layers` if it ever shows in a profile */
export function moves(layers) {
  const walk = (ls) => (ls ?? []).some((l) => hasBindings(l) || l.type === 'loop' || l.type === 'kinetic'
    || (l.type === 'photo' && (l.srcType === 'video' || l.srcType === 'webcam')) || walk(l.children))
  return walk(expandLayersDeep(layers))
}

/* MEDIA AS DATA: a photo layer's src and an image fill's src, fetched once and kept as a data URL (the engine's
   warmImageSrcs, carried). `clips` (W11.4): a video clip's src (a video photo, a video fill) too, when the clip is at
   most that many bytes; 0, the default, leaves clips as they are (an export draws the live clip itself). The webcam is
   live, never a file. */
const srcData = new Map()
const isFile = (src) => typeof src === 'string' && !src.startsWith('data:')
const toDataUrl = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob) })
const isClip = (l) => (l.type === 'photo' && l.srcType === 'video') || l.fill?.type === 'video'
const mediaSrcOf = (l, clips) => (isClip(l) && !clips ? null
  : l.type === 'photo' && l.srcType !== 'webcam' && isFile(l.src) ? l.src
    : (l.fill?.type === 'image' || l.fill?.type === 'video') && isFile(l.fill.src) ? l.fill.src : null)
export async function inlineMedia(layers, { clips = 0 } = {}) {
  const srcs = []
  const walk = (ls) => (ls ?? []).forEach((l) => { const s = mediaSrcOf(l, clips); if (s && !srcData.has(s)) srcs.push([s, isClip(l)]); walk(l.children) })
  walk(layers)
  await Promise.all(srcs.map(async ([src, clip]) => {
    try {
      const r = await fetch(src)
      const blob = r.ok ? await r.blob() : null
      if (blob && (!clip || blob.size <= clips)) srcData.set(src, await toDataUrl(blob))
    } catch { /* unreachable: left as it was */ }
  }))
  const swap = (ls) => ls.map((l) => {
    const s = mediaSrcOf(l, clips)
    const got = s && srcData.get(s)
    /* a clip held from a larger cap is not written under a smaller one (a data URL is 4 characters for 3 bytes) */
    const data = got && (!isClip(l) || got.length * 0.75 <= clips) ? got : null
    const kids = Array.isArray(l.children) ? swap(l.children) : l.children
    if (!data && kids === l.children) return l
    const next = { ...l, ...(kids !== l.children ? { children: kids } : {}) }
    if (data && l.type === 'photo') next.src = data
    else if (data) next.fill = { ...l.fill, src: data }
    return next
  })
  return swap(layers)
}

/* one region → its SVG string. `fill` false leaves the frame's fill out; `rasterScale` bakes live rasters for a PNG;
   `ctx` is the transport's moment (a video's frame), the live one by default */
export async function regionSvg(region, { palette, aspect, fill = true, rasterScale = 1, ctx = transport.getCtx() }) {
  const resolved = resolveLayersDeep(expandLayersDeep(region.layers), ctx)
  await warmTextFonts(resolved)
  if (resolved.some((l) => l.type === 'kinetic')) await pack('motion')?.warmFontCss?.()
  const ref = fill ? resolveColor(region.fill ?? null, palette) : null
  const token = typeof ref === 'string' && ref.match(/^var\((--[^),\s]+)/)
  const color = token ? (resolveCssVar(token[1]) || null) : ref
  return buildLayersSvg({
    layers: await inlineMedia(resolved), palette, aspect, canvasW: region.w, canvasH: region.h, rasterScale,
    fill: color, fillOpacity: region.fillOpacity ?? 1, viewW: region.viewW, edge: region.edge ?? null,
  })
}

/* a PNG flattened on white as a JPG (JPG holds no transparency), with its pixel size */
async function jpgOf(png) {
  const bmp = await createImageBitmap(png)
  const c = document.createElement('canvas')
  c.width = bmp.width; c.height = bmp.height
  const g = c.getContext('2d')
  g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(bmp, 0, 0)
  const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.92))
  return { blob, w: c.width, h: c.height }
}

/* ONE PAGE OF PDF holding one JPG: `pw` by `ph` points, the image (DCTDecode, written as it is) filling the page.
   The objects: catalog, pages, page, image, the page's one drawing line; then the cross-reference table. */
export async function pdfOf({ blob, w, h }, pw, ph) {
  const img = new Uint8Array(await blob.arrayBuffer())
  const enc = new TextEncoder()
  const draw = `q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
    [`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>\nstream\n`, img, '\nendstream'],
    `<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`,
  ]
  const parts = []
  let at = 0
  const put = (x) => { const b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); at += b.length }
  const offsets = []
  put('%PDF-1.4\n')
  objects.forEach((o, i) => { offsets.push(at); put(`${i + 1} 0 obj\n`); [].concat(o).forEach(put); put('\nendobj\n') })
  const xref = at
  put(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`)
  put(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`)
  return new Blob(parts, { type: 'application/pdf' })
}

/* one region → { name, blob } in a still format. `suffix` follows the name as Figma's does; empty, a scale other
   than 1 writes `@2x` */
export async function regionFile(region, { format, scale = 1, fill = true, palette, aspect, name, suffix = '' }) {
  const raster = format !== 'svg'
  const svg = await regionSvg(region, { palette, aspect, fill, rasterScale: raster ? scale : 1 })
  const base = `${safeName(name ?? region.name)}${suffix ? safeName(suffix, '') : !raster || scale === 1 ? '' : `@${scale}x`}`
  if (format === 'svg') return { name: `${base}.svg`, blob: new Blob([svg], { type: 'image/svg+xml' }) }
  const png = await svgToPngBlob(svg, scale)
  if (format === 'png') return { name: `${base}.png`, blob: png }
  const jpg = await jpgOf(png)
  if (format === 'jpg') return { name: `${base}.jpg`, blob: jpg.blob }
  /* the page is the region's size in points; the scale is the picture's resolution on it */
  return { name: `${base}.pdf`, blob: await pdfOf(jpg, region.w, region.h) }
}

/* one region → { name, blob } as one loop of video (onExportWebm's bake, on this region): the transport paused, one
   silent lap for the `smooth` bindings, then every frame seeked, painted (two animation frames, so live canvases and
   clips repaint) and encoded; the transport's moment and play state put back. `onProgress(done, total)` */
const nextFrame = () => new Promise((r) => requestAnimationFrame(r))
async function drawSvg(g, svg, w, h) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  try {
    const img = new Image()
    await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('SVG rasterize failed')); img.src = url })
    g.clearRect(0, 0, w, h); g.drawImage(img, 0, 0, w, h)
  } finally { URL.revokeObjectURL(url) }
}
export async function regionVideo(region, { scale = 1, palette, aspect, name, onProgress }) {
  const N = Math.max(1, Math.round(transport.getLoopSeconds() * WEBM_FPS))
  const w = Math.round(region.w * scale), h = Math.round(region.h * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const g = canvas.getContext('2d')
  const { Output, WebMOutputFormat, BufferTarget, CanvasSource } = await import('mediabunny')
  const output = new Output({ format: new WebMOutputFormat(), target: new BufferTarget() })
  const source = new CanvasSource(canvas, { codec: 'vp9', bitrate: Math.round(w * h * WEBM_FPS * 0.1) })
  output.addVideoTrack(source, { frameRate: WEBM_FPS })
  await output.start()
  const smoothState = makeSmoothingState()
  for (let i = 0; i < N; i++) resolveLayersDeep(expandLayersDeep(region.layers), { ...transport.getCtx(), t: i / N, smoothState })
  for (let i = 0; i < N; i++) {
    transport.seek(i / N)
    await nextFrame(); await nextFrame()
    await drawSvg(g, await regionSvg(region, { palette, aspect, rasterScale: scale, ctx: { ...transport.getCtx(), smoothState } }), w, h)
    await source.add(i / WEBM_FPS, 1 / WEBM_FPS)
    onProgress?.(i + 1, N)
  }
  await output.finalize()
  return { name: `${safeName(name ?? region.name)}.webm`, blob: new Blob([output.target.buffer], { type: 'video/webm' }) }
}

/* several regions as video, one after another, at full resolution; `names[i]` names region i's file */
export const regionVideos = (regions, { names = [], onProgress, ...opts }) => atFullRes(async () => {
  const wasPlaying = transport.isPlaying(), prevT = transport.getT()
  if (wasPlaying) transport.pause()
  try {
    const out = []
    for (let r = 0; r < regions.length; r++) {
      out.push(await regionVideo(regions[r], { ...opts, name: names[r], onProgress: (done, total) => onProgress?.(r * total + done, regions.length * total) }))
    }
    return out
  } finally {
    transport.seek(prevT)
    if (wasPlaying) transport.play()
  }
})

/* write files: one downloads as itself, several as one .zip named `zipName` */
export async function writeFiles(files, zipName) {
  if (!files.length) return
  if (files.length === 1) { downloadBlob(files[0].blob, files[0].name); return }
  const entries = await Promise.all(files.map(async (f) => ({ name: f.name, data: new Uint8Array(await f.blob.arrayBuffer()) })))
  downloadBlob(makeZip(entries), `${safeName(zipName)}.zip`)
}
