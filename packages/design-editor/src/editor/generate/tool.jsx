import { useEffect, useMemo, useRef } from 'react'
import { useComposeState, resolveColor, CANVAS_W } from '../compose/state'
import { findLayerDeep } from '../compose/helpers'
import { pack } from '../packs'
import { renderGenerate, presetsOf } from '../../generate/index.js'
import { marksD } from '../../generate/geom.js'
import { copyMatrices } from '../../generate/repeat.js'
import { useGenerateRings } from './rings'
import { useGenerateFont } from './useGenerateFont'
import { useGenerateImage } from './useGenerateImage'
import { WINDOWS, valueOf, patchOf, isLive, pickStyle } from './windows'
import { useTool, setTool, openTool } from './store'

/**
 * useGeneratorTool — one generator tool (generate · repeat · type) for whichever form shows it, the Rail or the settings
 * dialog: its controls read and write the shared params (`./store`), and Apply / Expand put them on the canvas the way
 * fxr's editor does — a live `generate` or `repeat` layer (fxr's GenerateLayer · RepeatLayer, its export as `<g>`), and
 * Expand its flattenGenerate · flattenRepeat (Paratype: flattenParatype).
 */
const flat = (ls) => ls.flatMap((l) => [l, ...(l.children ? flat(l.children) : [])])
const LINKABLE = { photo: (l) => l.type === 'photo', shape: (l) => l.type === 'shape', path: (l) => l.type === 'path', misc: (l) => l.type === 'misc' && l.loopId === 'paratype-glyph' }

export function useGeneratorTool(id) {
  const win = WINDOWS[id]
  const gen = pack('generators')
  const state = useComposeState()
  const typeInit = () => (gen ? gen.presetParams({ id: 'type', loop: win.loop, params: {} }) : {})
  const tool = useTool(id, win.init ?? typeInit)
  const { params, layerId, live } = tool
  const setParams = (fn) => setTool(id, (s) => ({ params: fn(s.params) }))
  const set = (x) => (v) => setParams((p) => ({ ...p, ...patchOf(win, x, v, p) }))
  const sections = win.sections(params)
  const all = flat(state.layers ?? [])
  const layerName = (l) => l.name || l.genLabel || l.presetLabel || l.kind || l.type
  /* a picker's options: the layers its kinds allow (Source: any placed layer but a repeat) */
  const layersFor = (x) => all.filter((l) => l.type !== 'background' && l.id !== layerId
    && (x.kinds ? x.kinds.some((k) => LINKABLE[k]?.(l)) : l.type !== 'repeat' && l.w != null)).map((l) => ({ value: l.id, label: layerName(l) }))

  /* Repeat's source defaults to the selection */
  useEffect(() => {
    if (id !== 'repeat' || params.sourceId) return
    const sel = state.selectedId && state.selectedId !== 'canvas' ? findLayerDeep(state.layers, state.selectedId) : null
    if (sel && sel.type !== 'repeat' && sel.w != null) setParams((p) => ({ ...p, sourceId: sel.id }))
  }, [id, params.sourceId, state.selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  const presets = id === 'generate'
    ? [...(params.genPreset ? [] : [{ value: 'custom', label: 'Custom' }]), ...presetsOf(params.genStyle).map((p) => ({ value: p.id, label: p.label }))]
    : null
  const setPreset = (pid) => { if (pid !== 'custom') setParams(() => pickStyle(params.genStyle, pid)) }

  /* the layer this tool drew last, if it is still there */
  const target = layerId ? findLayerDeep(state.layers ?? [], layerId) : null
  const canApply = id === 'repeat' ? !!params.sourceId : id === 'type' ? !!gen : true
  const apply = () => {
    if (!canApply) return null
    if (id === 'type') {
      if (target) { state.updateLayer(target.id, params); return target.id }
      const nid = state.addLayer('misc', { loopGroup: 'paratype', presetId: null, presetLabel: win.title(params), loopId: win.loop, ...params })
      setTool(id, { layerId: nid }); return nid
    }
    const type = id === 'generate' ? 'generate' : 'repeat'
    if (target?.type === type) { state.updateLayer(target.id, params); return target.id }
    const nid = state.addLayer(type, { ...params, ...(id === 'repeat' ? { name: 'Repeat' } : {}) })
    setTool(id, { layerId: nid }); return nid
  }
  const expand = () => {
    const lid = apply()
    if (!lid) return
    /* the add lands this commit — flatten on the next tick, when the layer is in the list */
    setTimeout(() => {
      if (id === 'generate') state.flattenGenerate(lid)
      else if (id === 'repeat') state.flattenRepeat(lid)
      else state.flattenParatype(lid)
      setTool(id, { layerId: null })
    }, 0)
  }
  const run = (act) => {
    if (act === 'expand') expand()
    else if (act === 'open-type') openTool('type')
  }
  const reset = () => setTool(id, { params: (win.init ?? typeInit)(), layerId: null })
  const setLive = (v) => setTool(id, { live: v })
  return { id, win, gen, state, params, setParams, set, sections, presets, setPreset, layersFor, apply, expand, run, reset, live, setLive, canApply, target,
    valueOf: (x) => valueOf(x, params), isLive }
}

/* ── previews ────────────────────────────────────────────────────────────────────────────────────────────────────── */
/* Generate: the engine's marks at the size Apply places (the editor's canvas), as the layer will draw them */
export function GeneratePreview({ t, className = '' }) {
  const { params, state, live } = t
  const w = CANVAS_W, h = Math.round(CANVAS_W / (state.canvasRatio || 1))
  const probe = useMemo(() => ({ ...params, id: '__generator-preview', x: 0, y: 0, w, h }), [params, w, h])
  const rings = useGenerateRings(probe)
  const fontVer = useGenerateFont(probe)
  const image = useGenerateImage(probe)
  const last = useRef('')
  const d = useMemo(() => {
    if (!live) return last.current
    try { last.current = marksD(renderGenerate(probe, w, h, { rings, image })) } catch { /* a param the engine rejects keeps the last frame */ }
    return last.current
  }, [probe, rings, image, fontVer, live, w, h])
  const ink = resolveColor(params.color, state.palette) ?? '#FFFFFF'
  const bg = params.bg == null ? null : resolveColor(params.bg, state.palette)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className={className} data-preview>
      {bg && <rect width={w} height={h} fill={bg} />}
      {d && <path d={d} fill={ink} />}
    </svg>
  )
}

/* Repeat: the source's box and its copies, each through its matrix — the copy grid */
export function RepeatPreview({ t, className = '' }) {
  const { params, state } = t
  const src = params.sourceId ? findLayerDeep(state.layers ?? [], params.sourceId) : null
  const box = src && src.w != null ? { x: src.x ?? 0, y: src.y ?? 0, w: src.w, h: src.h } : { x: 440, y: 440, w: 200, h: 200 }
  const mats = copyMatrices(params, box)
  /* fit everything: the source plus every copy's corners */
  const pts = [[box.x, box.y], [box.x + box.w, box.y + box.h]]
  for (const m of mats) for (const [x, y] of [[box.x, box.y], [box.x + box.w, box.y], [box.x, box.y + box.h], [box.x + box.w, box.y + box.h]]) pts.push([m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]])
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
  const pad = 24, x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad, vw = Math.max(...xs) - x0 + pad, vh = Math.max(...ys) - y0 + pad
  const sw = Math.max(vw, vh) / 200
  const rect = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={box.w / 12} />
  return (
    <svg viewBox={`${x0} ${y0} ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet" className={className} data-preview data-copies={mats.length}>
      <g fill="var(--kol-oq-16)" stroke="var(--kol-fg-64)" strokeWidth={sw}>
        {mats.map((m, i) => <g key={i} transform={`matrix(${m.join(' ')})`}>{rect}</g>)}
      </g>
      <g fill="var(--kol-fg-96)">{rect}</g>
    </svg>
  )
}

/* Type: the Paratype glyph loop's frame */
export function TypePreview({ t, size = 512, className = '' }) {
  const ref = useRef(null)
  const { gen, win, params, live } = t
  useEffect(() => {
    if (!live || !ref.current || !gen) return
    const ctx = ref.current.getContext('2d')
    ctx.clearRect(0, 0, size, size)
    try { gen.drawLoopFrame(ctx, gen.loopById(win.loop), 0, size, size, params) } catch { /* a param the engine rejects draws nothing */ }
  }, [win, params, live, gen, size])
  return <canvas ref={ref} width={size} height={size} className={className} data-preview />
}

export const ToolPreview = ({ t, className }) => (t.id === 'generate' ? <GeneratePreview t={t} className={className} />
  : t.id === 'repeat' ? <RepeatPreview t={t} className={className} /> : <TypePreview t={t} className={className} />)

