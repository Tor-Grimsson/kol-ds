import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Dropdown, Input, Tooltip, useGrabEdge, floatSurfaceClass } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { useComposeState } from '../compose/state'
import { rowLabelForLayer as labelForLayer } from '../compose/labels'   /* the LayerStack's row name — a named layer by its name */
import { keysFor } from '../morph/buildMorph'
import { setMorph, useMorph } from '../morph/morphStore'
import { useTimelinePinned } from './timelinePinned'
import { EASINGS, EASING_OPTIONS } from './easing'
import { isBinding } from './resolve'
import { readAudio } from './audioBands'
import { transport, useTransport } from './transport'

/**
 * Timeline — the keyframe timeline under the canvas, on the float style (float-everything W12.2, 2026-11-04; the
 * exploration's `Floating timeline`, kol-float--style 9:8597 · gap-map board W2.12).
 *
 *   ┌ float sheet (menu-r 20, 12 in, the float shadow) ─────────────────────────────────────────┐
 *   │ toolbar 24   ⧉ Scene 01  5 layers  +                 Keyframes  ⟲  ⎯  100%  ⤢              │
 *   │ ruler   15   LAYERS                 00s     01s     02s   ┃04:12┃   03s     04s             │
 *   │ track   25   [icon · name · eye · lock 268]  [lane: ◇ diamonds on a clip · a clip · a wave]  │
 *   │ …                                                        ┃ the playhead, down the tracks    │
 *   └─────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * A row per LAYER (the layer tree flattened), the label gutter its icon · name · eye · lock — the lane is what the
 * layer carries: its first keyframe track (◇ at each key on a clip named `layer · param`), a clip the loop long when
 * it has none, a waveform when a param rides an audio source. A layer's further tracks are rows under it, the gutter
 * naming the param only; a morph's header folds them (plan 14 § 7). The clock is the editor's transport (kol-hardware's
 * `createTransport`): the head reads it, the ruler scrubs it, zoom (100 · 200 · 400 %) is a window that follows the head.
 *
 * Carried whole from the dock it replaces (`_tmp/2026-11-04-timeline-dock/`): the gestures (lane click adds a key,
 * drag moves, alt-click deletes, one write per gesture), the selected key's value graph (plan 14 § 8), the key editor,
 * the grab that resizes the dock (`useGrabEdge`), Window › Timeline's pin and `useTimelineUp`.
 *
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the sheet is made of — kol-theme's `.kol-float-*` (default solid)
 */

/* the label column and its gap — the exploration's `Layer label` 268 + the track's gap 14 (9:8629) */
const GUTTER = 268, GAP = 14, ROW = 25
const ZOOMS = [1, 2, 4]
const WAVE_BARS = 96

/* Sample a track's value at t (linear across the segment — good enough for the "add key without a
 * jump" affordance). */
export function sampleTrack(keys, t) {
  if (keys.length === 0) return 0
  if (t <= keys[0].t) return keys[0].v
  const last = keys[keys.length - 1]
  if (t >= last.t) return last.v
  let i = 0
  while (i < keys.length - 1 && keys[i + 1].t <= t) i++
  const a = keys[i], b = keys[i + 1]
  if (typeof a.v !== 'number' || typeof b.v !== 'number') return a.v
  const span = b.t - a.t || 1
  return a.v + (b.v - a.v) * ((t - a.t) / span)
}

/* Walk the layer tree, collecting every keyframe-track binding. A morph layer (`morph.steps`)
 * contributes a HEADER first — its `morphT` track in Shape / Crossfade, a synthetic one (read-only,
 * the step positions the cycle gives) in Blend — and its other tracks `under` it. */
function collectTracks(layers, out = []) {
  for (const l of layers) {
    const steps = Array.isArray(l.morph?.steps) ? l.morph.steps : null
    if (steps?.length) {
      const name = l.morph.name || 'Morph'
      const names = (keys) => keys.map((k) => steps[((Math.round(k.v) % steps.length) + steps.length) % steps.length]?.label ?? '')
      const mt = isBinding(l.morphT) && l.morphT.bind === 'track' ? l.morphT : null
      const keys = mt ? mt.keys : keysFor(steps.map((_, i) => i), l.morph.cycle ?? 'loop', l.morph.curve ?? 'in-out')
      out.push({ id: `${l.id}:morph`, layerId: l.id, key: 'morphT', label: name, keys, header: true, readOnly: !mt, names: names(keys), steps: steps.length })
    }
    for (const k in l) {
      if (k === 'morphT' && steps?.length) continue
      const v = l[k]
      if (isBinding(v) && v.bind === 'track') out.push({ id: `${l.id}:${k}`, layerId: l.id, key: k, label: `${labelForLayer(l)} · ${k}`, keys: v.keys, under: steps?.length ? `${l.id}:morph` : null })
    }
    if (Array.isArray(l.children)) collectTracks(l.children, out)
  }
  return out
}

/* the layer tree in reading order — a row per layer, children after their group */
function flattenLayers(layers, out = []) {
  for (const l of layers) { out.push(l); if (Array.isArray(l.children)) flattenLayers(l.children, out) }
  return out
}
/* a param riding an audio source (`{ bind:'mod', source:'audio-…' }`) — the lane draws the waveform */
const hasAudio = (l) => Object.values(l).some((v) => isBinding(v) && v.bind === 'mod' && String(v.source).startsWith('audio'))

/* the LayerStack's map over the engine's types (LayerStackView.jsx) */
const TYPE_ICONS = { background: 'square', pattern: 'ptrn-dot', photo: 'image', shape: 'rectangle', text: 'type', group: 'layers', bool: 'layers', loop: 'refresh', misc: 'refresh', kinetic: 'type' }
const iconFor = (type) => TYPE_ICONS[type] ?? 'rectangle'

const secs = (frac, len) => `${(frac * len).toFixed(2)}`
/* the marker's readout: seconds and hundredths in the loop, `04:12` */
const timecode = (sec) => `${String(Math.floor(sec)).padStart(2, '0')}:${String(Math.floor((sec % 1) * 100)).padStart(2, '0')}`

/* a float control: an icon on oq ink, the float focus ring, lit when `on`; a `toggle` reports its state */
function IconButton({ name, label, on = true, toggle = false, size = 14, onClick, disabled, className = '' }) {
  return (
    <Tooltip label={label} variant="float" asChild>
      <button
        type="button" aria-label={label} aria-pressed={toggle ? on : undefined} disabled={disabled}
        onClick={onClick}
        className={`flex items-center justify-center shrink-0 rounded cursor-pointer outline-none focus-visible:shadow-[var(--kol-float-focus)] disabled:opacity-40 disabled:cursor-default ${on ? 'text-oq-96' : 'text-oq-48'} ${className}`.trim()}
      >
        <Icon name={name} size={size} />
      </button>
    </Tooltip>
  )
}

/* ── the lane: what a layer carries, on the loop's window ── */
function KeyLane({ track, view, selected, setSelected, writeKeys, lit }) {
  const laneRef = useRef(null)
  const drag = useRef(null)   /* local drag state — committed once on pointer-up */
  const [, force] = useState(0)
  const header = !!track.header
  const readOnly = !!track.readOnly
  const { X, fracFromEvent } = view

  const isSel = (i) => selected && selected.trackId === track.id && selected.index === i

  const onLanePointerDown = (e) => {
    if (e.target.closest('[data-diamond]') || e.target.closest('[data-name]') || readOnly) return
    /* Add a key at the click position, valued at the track's current value there (no visual jump), then select it. */
    const clickT = fracFromEvent(e, laneRef.current)
    const v = sampleTrack(track.keys, clickT)
    const next = [...track.keys, { t: clickT, v, easing: 'linear' }].sort((a, b) => a.t - b.t)
    writeKeys(track, next)
    setSelected({ trackId: track.id, index: next.findIndex((k) => k.t === clickT) })
  }
  const onDiamondPointerDown = (i) => (e) => {
    e.stopPropagation()
    if (readOnly) return
    if (e.altKey) {
      /* alt-click deletes (min 1 key stays — an empty track is a broken binding) */
      if (track.keys.length > 1) { writeKeys(track, track.keys.filter((_, j) => j !== i)); setSelected(null) }
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { index: i, t: track.keys[i].t }
    setSelected({ trackId: track.id, index: i })
  }
  const onDiamondPointerMove = (i) => (e) => {
    if (!drag.current || drag.current.index !== i) return
    drag.current.t = fracFromEvent(e, laneRef.current)
    force((n) => n + 1)
  }
  const onDiamondPointerUp = (i) => () => {
    if (!drag.current || drag.current.index !== i) return
    const moved = { ...track.keys[i], t: drag.current.t }
    drag.current = null
    if (moved.t === track.keys[i].t) return   /* a click: it stays selected, the key editor opens */
    const next = track.keys.map((k, j) => (j === i ? moved : k)).sort((a, b) => a.t - b.t)
    writeKeys(track, next)
    setSelected({ trackId: track.id, index: next.indexOf(moved) })
  }
  /* a step name pressed on the header: the Morph rail edits that step (plan 14 § 7) */
  const editStep = (i) => (e) => { e.stopPropagation(); setMorph({ editRequest: ((Math.round(track.keys[i].v) % track.steps) + track.steps) % track.steps }) }

  return (
    <div ref={laneRef} className={`relative flex-1 min-w-0 overflow-hidden rounded-[5px] bg-[var(--kol-float-well)] ${readOnly ? '' : 'cursor-copy'}`} style={{ height: ROW }} onPointerDown={onLanePointerDown}>
      <Clip view={view} lit={lit} label={track.label} />
      {track.keys.map((k, i) => {
        const kt = drag.current?.index === i ? drag.current.t : k.t
        const name = header ? track.names?.[i] : null
        const tip = header ? `${name} · ${secs(kt, view.loop)} s` : `${secs(kt, view.loop)} s · v=${typeof k.v === 'number' ? Math.round(k.v * 100) / 100 : k.v} (alt-click deletes)`
        return (
          <Tooltip key={i} label={tip} variant="float" asChild>
            <span
              data-diamond=""
              onPointerDown={onDiamondPointerDown(i)} onPointerMove={onDiamondPointerMove(i)} onPointerUp={onDiamondPointerUp(i)}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex ${readOnly ? '' : 'cursor-grab'} ${isSel(i) ? 'text-[var(--kol-accent-primary)]' : 'text-oq-96'}`}
              /* a key on the loop's edge keeps its whole glyph on the lane */
              style={{ left: `clamp(6px, ${X(kt) * 100}%, 100% - 6px)` }}
            >
              <Icon name="diamond" size={12} />
            </span>
          </Tooltip>
        )
      })}
      {/* the step names, after each diamond; the last one (the closing key) sits before its diamond */}
      {header && track.keys.map((k, i) => {
        const kt = drag.current?.index === i ? drag.current.t : k.t
        const last = i === track.keys.length - 1 && kt > 0.5
        return (
          <button
            key={`n${i}`} type="button" data-name="" onPointerDown={(e) => e.stopPropagation()} onClick={editStep(i)}
            aria-label={`Edit step ${track.names?.[i]}`}
            className="absolute top-0 bottom-0 kol-float-label text-fg-64 hover:text-emphasis truncate cursor-pointer"
            style={{ left: last ? undefined : `calc(${X(kt) * 100}% + 10px)`, right: last ? `calc(${(1 - X(kt)) * 100}% + 10px)` : undefined, maxWidth: `${100 / track.keys.length}%` }}
          >
            {track.names?.[i]}
          </button>
        )
      })}
    </div>
  )
}

/* the clip bar: the loop's length on the lane, 2 in, named */
function Clip({ view, lit, label, mono = false, children }) {
  const a = view.X(0), b = view.X(1)
  return (
    <div className={`absolute top-0.5 h-[21px] rounded ${lit ? 'bg-fg-16' : 'bg-fg-08'}`} style={{ left: `${a * 100}%`, width: `${(b - a) * 100}%` }}>
      <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${mono ? 'kol-float-ruler' : 'kol-float-label'} text-fg-64 whitespace-nowrap pointer-events-none`}>{label}</span>
      {children}
    </div>
  )
}

/* a layer with no track: a clip the loop long, its length on it */
function ClipLane({ view, lit }) {
  return (
    <div className="relative flex-1 min-w-0 overflow-hidden rounded-[5px] bg-[var(--kol-float-well)]" style={{ height: ROW }}>
      <Clip view={view} lit={lit} label={`${view.loop.toFixed(2)} s`} mono />
    </div>
  )
}

/* a layer riding an audio source: the clip carries the level, the last WAVE_BARS frames of it */
function WaveLane({ view, lit, label, wave }) {
  return (
    <div className="relative flex-1 min-w-0 overflow-hidden rounded-[5px] bg-[var(--kol-float-well)]" style={{ height: ROW }}>
      <Clip view={view} lit={lit} label={label}>
        <span className="absolute top-0 bottom-0 left-[120px] right-2.5" aria-hidden="true">
          {wave.map((v, i) => (
            <span key={i} className="absolute top-1/2 -translate-y-1/2 w-0.5 bg-oq-40" style={{ left: `${(i / WAVE_BARS) * 100}%`, height: 2 + Math.round(v * 10) }} />
          ))}
        </span>
      </Clip>
    </div>
  )
}

/* ── the label gutter: icon · name · eye · lock (268, the row's height, 8 in) ── */
function LayerLabel({ layer, name, sub, lit, select, toggleLayer, toggleLayerLock, fold }) {
  return (
    <div
      className={`flex items-center gap-2.5 shrink-0 px-2 rounded-md ${lit ? 'bg-fg-16' : ''} ${layer ? 'cursor-pointer' : ''}`}
      style={{ width: GUTTER, height: ROW, paddingLeft: sub ? 8 + 14 + 10 : undefined }}
      onClick={layer ? () => select(layer.id) : undefined}
    >
      {!sub && <span className="flex shrink-0 text-oq-64" aria-hidden="true"><Icon name={layer ? iconFor(layer.type) : 'layers'} size={14} /></span>}
      <span className={`kol-float-label truncate flex-1 min-w-0 ${sub ? 'text-fg-64' : 'text-emphasis'}`}>{name}</span>
      {fold && (
        <IconButton name="chevron-down" size={12} label={fold.folded ? 'Show the morph’s tracks' : 'Hide the morph’s tracks'} onClick={(e) => { e.stopPropagation(); fold.toggle() }} className={fold.folded ? '-rotate-90' : ''} />
      )}
      {layer && !sub && (
        <>
          <IconButton name={layer.visible === false ? 'eye-off' : 'eye-on'} size={12} label={layer.visible === false ? 'Show layer' : 'Hide layer'} toggle on={layer.visible !== false} onClick={(e) => { e.stopPropagation(); toggleLayer(layer.id) }} />
          <IconButton name={layer.locked ? 'lock' : 'unlock'} size={12} label={layer.locked ? 'Unlock layer' : 'Lock layer'} toggle on={!!layer.locked} onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id) }} />
        </>
      )}
    </div>
  )
}

/* ── the ruler: LAYERS over the gutter, the seconds over the lanes (scrub to seek) ── */
function Ruler({ view, seek }) {
  const ref = useRef(null)
  const drag = useRef(false)
  const first = Math.ceil(view.origin - 1e-9), last = Math.floor(view.origin + view.span + 1e-9)
  const ticks = Array.from({ length: Math.max(0, last - first + 1) }, (_, i) => first + i)
  const at = (e) => seek(view.fracFromEvent(e, ref.current))
  return (
    <div className="flex items-center shrink-0" style={{ height: 15, gap: GAP }}>
      <span className="kol-float-label leading-none text-meta shrink-0" style={{ width: GUTTER }}>LAYERS</span>
      <div
        ref={ref} className="relative flex-1 min-w-0 h-full kol-float-ruler text-meta cursor-ew-resize"
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); at(e) }}
        onPointerMove={(e) => { if (drag.current) at(e) }}
        onPointerUp={() => { drag.current = false }}
        onPointerCancel={() => { drag.current = false }}
      >
        {ticks.map((s) => {
          const x = (s - view.origin) / view.span
          return (
            <span key={s} className="absolute top-0 leading-[15px] whitespace-nowrap" style={{ left: `${x * 100}%`, transform: x <= 0 ? undefined : x >= 1 ? 'translateX(-100%)' : 'translateX(-50%)' }}>
              {view.span <= 16 || s % 4 === 0 ? `${String(s).padStart(2, '0')}s` : ''}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ── the playhead: a line down the tracks, the marker riding above the ruler ── */
function Playhead({ view, now }) {
  const x = view.X(now / view.loop)
  if (x < 0 || x > 1) return null
  return (
    <div aria-hidden="true" className="absolute pointer-events-none" style={{ left: `calc(${GUTTER + GAP}px + (100% - ${GUTTER + GAP}px) * ${x})`, top: -1, bottom: 0 }}>
      <span className="absolute top-0 bottom-0 w-px bg-fg-96" />
      <span className="absolute -top-3 -translate-x-1/2 flex items-center justify-center h-4 w-[43px] rounded kol-float-ruler leading-none bg-[var(--kol-surface-on-primary)] text-[var(--kol-surface-primary)]">{timecode(now)}</span>
    </div>
  )
}

/* ── the curve (plan 14 § 8) ── */
const bezOf = (easing) => (Array.isArray(easing) ? easing : EASINGS[easing] ?? null)
/* THE VALUE GRAPH (the user, 2026-10-09: "bezier handles … should connect with keymarks on timeline
 * using the height, ref adobe, davinci"). The lane of the selected key opens tall: each key at
 * (time, value), each segment drawn as its real cubic-bezier, the handles hanging off the keys they
 * belong to — out of key i, into key i+1. A handle writes the segment's `[x1, y1, x2, y2]` (x held to
 * the segment, y free, so it can overshoot); a key drags in time and value. One write per gesture. */
const GH = 132, GPAD = 14
function GraphLane({ track, writeKeys, selected, setSelected }) {
  const ref = useRef(null)
  const [w, setW] = useState(0)
  const [live, setLive] = useState(null)   /* the keys mid-gesture, committed on pointer-up */
  const drag = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const keys = live ?? track.keys
  const vals = keys.map((k) => k.v)
  let lo = Math.min(...vals), hi = Math.max(...vals)
  if (drag.current?.range) [lo, hi] = drag.current.range   /* the scale holds still while dragging */
  if (hi - lo < 1e-9) { lo -= 1; hi += 1 }
  const X = (t) => t * w
  const Y = (v) => GPAD + (1 - (v - lo) / (hi - lo)) * (GH - 2 * GPAD)
  const fromPx = (e) => {
    const r = ref.current.getBoundingClientRect()
    return { t: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), v: lo + (1 - (e.clientY - r.top - GPAD) / (GH - 2 * GPAD)) * (hi - lo) }
  }
  const segs = keys.slice(0, -1).map((a, i) => {
    const b = keys[i + 1]
    const bez = a.easing === 'hold' ? null : bezOf(a.easing ?? 'linear') ?? EASINGS.linear
    return { i, a, b, bez }
  })
  const start = (kind, i) => (e) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { kind, i, range: [lo, hi], moved: false }
    if (kind === 'key') setSelected({ trackId: track.id, index: i })
  }
  const move = (e) => {
    const d = drag.current
    if (!d) return
    d.moved = true
    const p = fromPx(e)
    const next = keys.map((k) => ({ ...k }))
    if (d.kind === 'key') {
      const prevT = next[d.i - 1]?.t ?? 0, nextT = next[d.i + 1]?.t ?? 1
      next[d.i].t = Math.min(nextT, Math.max(prevT, p.t))
      next[d.i].v = p.v
    } else {
      /* out-handle of segment i = control point 1, in-handle = control point 2, in the segment's unit box */
      const a = next[d.i], b = next[d.i + 1]
      const dt = b.t - a.t || 1e-6, dv = Math.abs(b.v - a.v) > 1e-9 ? b.v - a.v : (hi - lo)
      const ux = Math.min(1, Math.max(0, (p.t - a.t) / dt)), uy = (p.v - a.v) / dv
      const bez = [...(bezOf(a.easing ?? 'linear') ?? EASINGS.linear)]
      if (d.kind === 'out') { bez[0] = ux; bez[1] = uy } else { bez[2] = ux; bez[3] = uy }
      a.easing = bez.map((n) => Math.round(n * 1000) / 1000)
    }
    setLive(next)
  }
  const end = () => {
    const d = drag.current
    drag.current = null
    if (d?.moved && live) {
      const moved = live[d.i]
      writeKeys(track, live)
      if (d.kind === 'key') setSelected({ trackId: track.id, index: [...live].sort((p, q) => p.t - q.t).indexOf(moved) })
    }
    setLive(null)
  }
  const sel = selected?.trackId === track.id ? selected.index : -1
  const handle = (cx, cy, x0, y0, kind, i) => (
    <g key={`${kind}${i}`}>
      <line x1={x0} y1={y0} x2={cx} y2={cy} stroke="var(--kol-accent-primary)" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={4} fill="var(--kol-surface-primary)" stroke="var(--kol-accent-primary)" strokeWidth={1.5} style={{ cursor: 'grab' }}
        onPointerDown={start(kind, i)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} />
    </g>
  )
  return (
    <div className="flex items-stretch" style={{ gap: GAP }}>
      <span className="shrink-0 flex flex-col justify-between items-end kol-float-ruler text-meta py-2" style={{ width: GUTTER }}>
        <span>{Math.round(hi * 100) / 100}</span><span>{Math.round(lo * 100) / 100}</span>
      </span>
      <div ref={ref} className="relative flex-1 rounded-[5px] bg-[var(--kol-float-well)]" style={{ height: GH, touchAction: 'none' }}>
        {w > 0 && (
          <svg width={w} height={GH} className="absolute inset-0 overflow-visible">
            {segs.map(({ i, a, b, bez }) => (bez
              ? <path key={`s${i}`} d={`M ${X(a.t)} ${Y(a.v)} C ${X(a.t + bez[0] * (b.t - a.t))} ${Y(a.v + bez[1] * (b.v - a.v))}, ${X(a.t + bez[2] * (b.t - a.t))} ${Y(a.v + bez[3] * (b.v - a.v))}, ${X(b.t)} ${Y(b.v)}`} fill="none" stroke="var(--kol-fg-emphasis)" strokeWidth={1.5} />
              : <path key={`s${i}`} d={`M ${X(a.t)} ${Y(a.v)} H ${X(b.t)} V ${Y(b.v)}`} fill="none" stroke="var(--kol-fg-emphasis)" strokeWidth={1.5} strokeDasharray="3 3" />))}
            {/* handles on the segments either side of the selected key, After Effects' rule */}
            {segs.filter(({ i, bez }) => bez && (i === sel || i + 1 === sel)).map(({ i, a, b, bez }) => {
              const dv = Math.abs(b.v - a.v) > 1e-9 ? b.v - a.v : (hi - lo)
              return [
                i === sel ? handle(X(a.t + bez[0] * (b.t - a.t)), Y(a.v + bez[1] * dv), X(a.t), Y(a.v), 'out', i) : null,
                i + 1 === sel ? handle(X(a.t + bez[2] * (b.t - a.t)), Y(a.v + bez[3] * dv), X(b.t), Y(b.v), 'in', i) : null,
              ]
            })}
            {keys.map((k, i) => (
              <rect key={`k${i}`} x={X(k.t) - 4.5} y={Y(k.v) - 4.5} width={9} height={9} rx={1.5}
                transform={`rotate(45 ${X(k.t)} ${Y(k.v)})`}
                fill={i === sel ? 'var(--kol-accent-primary)' : 'var(--kol-fg-emphasis)'} style={{ cursor: 'grab' }}
                onPointerDown={start('key', i)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} />
            ))}
          </svg>
        )}
      </div>
    </div>
  )
}
const CURVE_OPTIONS = [...EASING_OPTIONS, { value: 'custom', label: 'Custom' }]

function SelectedKeyEditor({ tracks, selected, setSelected, writeKeys, len }) {
  if (!selected) return null
  const track = tracks.find((tr) => tr.id === selected.trackId)
  const key = track?.keys[selected.index]
  if (!key || track.readOnly) return null

  const patchKey = (patch) => {
    writeKeys(track, track.keys.map((k, i) => (i === selected.index ? { ...k, ...patch } : k)))
  }
  const isNum = typeof key.v === 'number'
  const easingName = Array.isArray(key.easing) ? 'custom' : (key.easing ?? 'linear')

  return (
    <div className="flex items-start gap-3 pt-1">
      <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
        <span className="kol-float-label text-meta shrink-0">key @ {secs(key.t, len)} s</span>
        {!track.header && (
          <Input
            variant="float" size="sm" chars={7}
            type={isNum ? 'number' : 'text'}
            value={String(key.v)}
            onChange={(e) => patchKey({ v: isNum ? Number(e.target.value) || 0 : e.target.value })}
          />
        )}
        <Dropdown
          variant="subtle" size="sm"
          options={CURVE_OPTIONS}
          value={easingName}
          onChange={(v) => patchKey({ easing: v === 'custom' ? [...(bezOf(key.easing) ?? EASINGS['in-out'])] : v })}
        />
        <Button
          variant="float" tone="ghost" size="sm"
          onClick={() => {
            if (track.keys.length > 1) writeKeys(track, track.keys.filter((_, i) => i !== selected.index))
            setSelected(null)
          }}
        >
          Delete key
        </Button>
        <Button variant="float" tone="ghost" size="sm" className="ml-auto" onClick={() => setSelected(null)}>
          Close
        </Button>
      </div>
    </div>
  )
}

/* the dock's height — the lanes scroll inside it; remembered per browser */
const DOCK_KEY = 'kol-fxr:dock-h'
const DOCK_MIN = 128, DOCK_MAX = 480
const readDockH = () => { try { const n = Number(localStorage.getItem(DOCK_KEY)); return n >= DOCK_MIN ? n : null } catch { return null } }

function DockGrab({ onDrag, onEnd, onReset }) {
  const ref = useRef(null)
  const start = useRef(null)
  const [dragging, setDragging] = useState(false)
  useGrabEdge(ref, { axis: 'x' })
  return (
    <div
      ref={ref}
      className={`kol-timeline-grab ${dragging ? 'is-dragging' : ''}`.trim()}
      role="separator" aria-orientation="horizontal" aria-label="Resize the timeline"
      onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); start.current = e.clientY; setDragging(true) }}
      onPointerMove={(e) => { if (start.current == null) return; onDrag(start.current - e.clientY); }}
      onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); start.current = null; setDragging(false); onEnd?.() }}
      onPointerCancel={() => { start.current = null; setDragging(false); onEnd?.() }}
      /* double-click: back to the default height (the user, 2026-10-09) */
      onDoubleClick={onReset}
    />
  )
}

/* Is the timeline up? — the one gate (plan 29 § 9): a track exists, the Morph rail is up, or Window ›
 * Timeline pins it. The timeline and the editor footer's Transport tab both read it, so the transport
 * shows exactly when the clock it drives is on screen. */
export function useTimelineUp() {
  const { layers } = useComposeState()
  const morph = useMorph()
  const pinned = useTimelinePinned()
  const hasTrack = useMemo(() => collectTracks(layers).length > 0, [layers])
  return hasTrack || !!morph.active || pinned
}

export default function Timeline({ surface = 'solid' }) {
  const { layers, updateLayer, selectedIds, select, toggleLayer, toggleLayerLock, currentPresetName } = useComposeState()
  const { t, loopSeconds, seek } = useTransport()
  const morph = useMorph()
  const pinned = useTimelinePinned()
  const collected = useMemo(() => collectTracks(layers), [layers])
  /* ON THE MORPH RAIL THE TIMELINE IS ALWAYS UP (the user, 2026-10-09: "show timeline when you enter morph
     regardless of slot empty or not") — until a morph is built (two steps) its lane is an empty header */
  const tracks = useMemo(() => (morph.active && !collected.some((tr) => tr.header)
    ? [{ id: 'morph:empty', layerId: null, key: 'morphT', label: morph.fileName || 'Morph', keys: [], header: true, readOnly: true, names: [], steps: 0 }, ...collected]
    : collected), [collected, morph.active, morph.fileName])
  const [selected, setSelected] = useState(null)   /* { trackId, index } */
  const [folded, setFolded] = useState(() => new Set())
  const [zoom, setZoom] = useState(1)
  const [dockH, setDockH] = useState(readDockH)   /* null = as tall as its lanes */
  const base = useRef(null)
  useEffect(() => { try { if (dockH) localStorage.setItem(DOCK_KEY, String(dockH)); else localStorage.removeItem(DOCK_KEY) } catch { /* private mode */ } }, [dockH])

  /* the level's last WAVE_BARS frames, for a waveform lane — sampled on the ticks this render already pays for */
  const wave = useRef(new Array(WAVE_BARS).fill(0))
  const flat = useMemo(() => flattenLayers(layers), [layers])
  const wantsWave = flat.some(hasAudio)
  if (wantsWave) { wave.current.push(readAudio().level); wave.current.shift() }

  /* Window › Timeline pins the timeline up with no lanes (plan 28 § 17) */
  if (tracks.length === 0 && !pinned) return null

  /* THE WINDOW: the loop at 100 %, a span of it at 200 / 400 % that follows the head. `X(frac)` puts a loop fraction on
   * the lane (0..1 of its width), `fracFromEvent` reads one back from a pointer on it. */
  const now = t * loopSeconds
  const span = loopSeconds / zoom
  const origin = zoom === 1 ? 0 : Math.min(Math.max(0, now - span / 2), loopSeconds - span)
  const view = {
    loop: loopSeconds, origin, span,
    X: (frac) => (frac * loopSeconds - origin) / span,
    fracFromEvent: (e, el) => {
      const r = el.getBoundingClientRect()
      const sec = origin + Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * span
      return Math.min(1, Math.max(0, sec / loopSeconds))
    },
  }
  const looping = !!transport.clock.state.looping

  const writeKeys = (track, nextKeys) => {
    const sorted = [...nextKeys].sort((a, b) => a.t - b.t)
    updateLayer(track.layerId, { [track.key]: { bind: 'track', keys: sorted } })
  }
  const toggleFold = (id) => setFolded((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })

  /* + adds a key at the head: on the selected key's track, else the selected layer's first */
  const target = (selected && tracks.find((tr) => tr.id === selected.trackId)) || tracks.find((tr) => selectedIds.includes(tr.layerId) && !tr.readOnly) || null
  const addKeyAtHead = () => {
    if (!target) return
    const next = [...target.keys, { t, v: sampleTrack(target.keys, t), easing: 'linear' }].sort((a, b) => a.t - b.t)
    writeKeys(target, next)
    setSelected({ trackId: target.id, index: next.findIndex((k) => k.t === t) })
  }

  /* THE ROWS: a layer, its first track on its lane; its other tracks under it, the param named in the gutter; a track
   * with no layer (the empty morph header) stands alone */
  const byLayer = new Map()
  for (const tr of tracks) { const list = byLayer.get(tr.layerId) ?? []; list.push(tr); byLayer.set(tr.layerId, list) }
  const rows = []
  for (const layer of flat) {
    const ts = byLayer.get(layer.id) ?? []
    if (ts.length === 0) rows.push({ id: layer.id, layer, kind: hasAudio(layer) ? 'wave' : 'clip' })
    else ts.forEach((track, i) => rows.push({ id: track.id, layer, track, sub: i > 0 }))
  }
  for (const track of byLayer.get(null) ?? []) rows.push({ id: track.id, layer: null, track })
  const shown = rows.filter((r) => !(r.track?.under && folded.has(r.track.under)))
  const litLayer = (l) => !!l && selectedIds.includes(l.id)
  const graphOpen = !!(selected && tracks.find((tr) => tr.id === selected.trackId && !tr.header && !tr.readOnly))

  return (
    <div className="kol-timeline-dock relative p-3 select-none" style={{ height: dockH ?? undefined, maxHeight: dockH ? undefined : DOCK_MAX }}>
      <DockGrab
        onDrag={(dy) => { if (base.current == null) base.current = dockH ?? 0; setDockH(Math.min(DOCK_MAX, Math.max(DOCK_MIN, (base.current || 222) + dy))) }}
        onEnd={() => { base.current = null }}
        onReset={() => setDockH(null)}
      />
      <div className={`kol-timeline flex flex-col gap-2 p-3 h-full min-h-0 ${floatSurfaceClass(surface, true)}`} style={{ borderRadius: 'var(--kol-float-menu-r)' }}>
        {/* the toolbar: the scene, its count, a key; the view, loop, fit, zoom, the dock's height */}
        <div className="flex items-center justify-between h-6 shrink-0">
          <div className="flex items-center gap-3.5">
            <span className="flex text-oq-96" aria-hidden="true"><Icon name="layers" size={14} /></span>
            <span className="kol-float-panel text-emphasis whitespace-nowrap">{currentPresetName || 'Untitled'}</span>
            <span className="kol-float-label text-meta whitespace-nowrap">{flat.length} {flat.length === 1 ? 'layer' : 'layers'}</span>
            <IconButton name="plus" label="Add a key at the head" disabled={!target} onClick={addKeyAtHead} />
          </div>
          <div className="flex items-center gap-[18px]">
            <span className="kol-float-label text-fg-64">{graphOpen ? 'Curve' : 'Keyframes'}</span>
            <IconButton name="overlap" label={looping ? 'Loop off' : 'Loop on'} toggle on={looping} onClick={() => transport.clock.set({ looping: !looping })} />
            <IconButton name="cap-round" label="Fit the loop" on={zoom !== 1} onClick={() => setZoom(1)} />
            <Tooltip label="Zoom the lanes" variant="float" asChild>
              <button type="button" onClick={() => setZoom(ZOOMS[(ZOOMS.indexOf(zoom) + 1) % ZOOMS.length])} className="kol-float-timecode text-emphasis leading-none cursor-pointer rounded outline-none focus-visible:shadow-[var(--kol-float-focus)]">{zoom * 100}%</button>
            </Tooltip>
            <IconButton name="nav-create" label={dockH ? 'Fit the timeline to its lanes' : 'Expand the timeline'} on={!!dockH} onClick={() => setDockH(dockH ? null : DOCK_MAX)} />
          </div>
        </div>
        {/* the ruler and the tracks share the head */}
        <div className="relative flex flex-col gap-2 min-h-0">
          <Ruler view={view} seek={seek} />
          <div className="flex flex-col gap-1 min-h-0 overflow-y-auto">
            {shown.map((row) => (
              <Fragment key={row.id}>
                <div className="flex items-start shrink-0" style={{ gap: GAP, height: ROW }}>
                  <LayerLabel
                    layer={row.layer} sub={row.sub} lit={litLayer(row.layer)}
                    name={row.sub ? row.track.key : row.layer ? labelForLayer(row.layer) : row.track.label}
                    select={select} toggleLayer={toggleLayer} toggleLayerLock={toggleLayerLock}
                    fold={row.track?.header && tracks.some((x) => x.under === row.track.id) ? { folded: folded.has(row.track.id), toggle: () => toggleFold(row.track.id) } : null}
                  />
                  {row.track
                    ? <KeyLane track={row.track} view={view} selected={selected} setSelected={setSelected} writeKeys={writeKeys} lit={litLayer(row.layer) || selected?.trackId === row.track.id} />
                    : row.kind === 'wave'
                      ? <WaveLane view={view} lit={litLayer(row.layer)} label={`${labelForLayer(row.layer)} · audio`} wave={wave.current} />
                      : <ClipLane view={view} lit={litLayer(row.layer)} />}
                </div>
                {/* the selected key's lane opens as a value graph (numbers only; a morph header is step indices) */}
                {row.track && selected?.trackId === row.track.id && !row.track.header && !row.track.readOnly && row.track.keys.every((k) => typeof k.v === 'number') && (
                  <GraphLane track={row.track} writeKeys={writeKeys} selected={selected} setSelected={setSelected} />
                )}
              </Fragment>
            ))}
          </div>
          <Playhead view={view} now={now} />
        </div>
        <SelectedKeyEditor tracks={tracks} selected={selected} setSelected={setSelected} writeKeys={writeKeys} len={loopSeconds} />
      </div>
    </div>
  )
}
