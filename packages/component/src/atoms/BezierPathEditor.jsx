import { useEffect, useRef, useState } from 'react'
import { pathD, nearestSegmentT, splitSegment } from '../hooks/pathMath.js'

/* anchor · handle radius (px) per control rung; the hit target rides a wider transparent ring */
const RADII = { xs: [3.5, 2.5], sm: [4.5, 3], md: [5.5, 3.5] }
const HIT = 6

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/**
 * BezierPathEditor — Shape a path by dragging its nodes. a 2D bezier node editor: anchors with in / out
 * handles, drawn in a box of any aspect, holding a value of normalised points.
 *
 * Lobby BezierPathEditor (kol-fxr, 2026-10-31): fxr hand-built two SVG editors for one job — the organic
 * band's edge profile (`ProfileEditor`) and a kinetic layer's custom path (`CustomPathPoints`). KOL's
 * `CurveEditor` authors expressions, not a drawn path, and `PathNodeOverlay` is stage chrome on the
 * 1080-virtual canvas; this is the field-sized control. The geometry is `pathMath`'s (`pathD`,
 * `nearestSegmentT`, `splitSegment`), so the path it draws is the one the editor's engine draws.
 *
 * VALUE. `[{ x, y, hl?, hr? }]`, x and y in 0–1 (0 = left / top). `hl` / `hr` are the in / out handles as
 * OFFSETS from the anchor (`{ x, y }`, same units), so moving an anchor carries its handles; a node without
 * one is a corner on that side. Controlled: every gesture fires `onChange(points)` with a new array, and a
 * consumer with rules (ends locked, endpoints sharing y) enforces them there.
 *
 * GESTURES. Drag an anchor or a handle · double-click the box to add a node (split into the nearest
 * segment, shape-preserving) · alt-click an anchor to delete it (never below `minPoints`). Anchors are
 * clamped to the box; handles may leave it.
 *
 * INKS (the icon ink law — oq, never fg): the box is the control ground (surface-secondary), the path
 * oq-80, leashes oq-24, handles oq-48, anchors the accent. No border.
 *
 *   <BezierPathEditor value={pts} onChange={setPts} aspect={2} closed={false} size="sm" />
 *
 * @param {Array<{x:number, y:number, hl?:{x:number,y:number}, hr?:{x:number,y:number}}>} value - The nodes, normalised 0–1; handles are offsets from the anchor
 * @param {(points:Array) => void} onChange - Fired with the next node array on every drag move, add and delete
 * @param {boolean} [closed=false] - Close the path (last node joins the first)
 * @param {number} [aspect=1] - The box's width ÷ height; it fills its container's width
 * @param {'xs'|'sm'|'md'} [size='sm'] - The control rung — the anchor and handle sizes
 * @param {number} [minPoints=2] - Alt-click never deletes below this many nodes
 * @param {string} [ariaLabel='Path editor'] - The box's accessible name
 * @param {string} [className] - Extra classes on the box
 */
export default function BezierPathEditor({
  value = [],
  onChange,
  closed = false,
  aspect = 1,
  size = 'sm',
  minPoints = 2,
  ariaLabel = 'Path editor',
  className = '',
}) {
  const ref = useRef(null)
  const drag = useRef(null) /* { i, part: 'anchor'|'hl'|'hr' } */
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [rA, rH] = RADII[size] ?? RADII.sm

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* the 0–1 square is inset by an anchor's reach, so a node on an edge draws whole */
  const pad = rA + 2
  const w = Math.max(1, box.w - pad * 2), h = Math.max(1, box.h - pad * 2)
  const pts = Array.isArray(value) ? value : []
  /* normalised value → pathMath's absolute pixel nodes ({ x, y, in, out }) */
  const abs = pts.map((p) => ({
    x: pad + p.x * w, y: pad + p.y * h,
    in: p.hl ? { x: pad + (p.x + p.hl.x) * w, y: pad + (p.y + p.hl.y) * h } : null,
    out: p.hr ? { x: pad + (p.x + p.hr.x) * w, y: pad + (p.y + p.hr.y) * h } : null,
  }))
  const fromAbs = (n) => {
    const p = { x: clamp01((n.x - pad) / w), y: clamp01((n.y - pad) / h) }
    if (n.in) p.hl = { x: (n.in.x - pad) / w - p.x, y: (n.in.y - pad) / h - p.y }
    if (n.out) p.hr = { x: (n.out.x - pad) / w - p.x, y: (n.out.y - pad) / h - p.y }
    return p
  }

  const local = (e) => {
    const r = ref.current.getBoundingClientRect()
    return { x: (e.clientX - r.left - pad) / w, y: (e.clientY - r.top - pad) / h }
  }

  const onDown = (i, part) => (e) => {
    e.stopPropagation()
    if (part === 'anchor' && e.altKey) {
      if (pts.length > minPoints) onChange?.(pts.filter((_, k) => k !== i))
      return
    }
    e.preventDefault()
    drag.current = { i, part }
    try { ref.current.setPointerCapture(e.pointerId) } catch { /* */ }
  }

  const onMove = (e) => {
    const d = drag.current
    if (!d) return
    const { x, y } = local(e)
    onChange?.(pts.map((p, k) => {
      if (k !== d.i) return p
      if (d.part === 'anchor') return { ...p, x: clamp01(x), y: clamp01(y) }
      return { ...p, [d.part]: { x: x - p.x, y: y - p.y } }
    }))
  }

  const onUp = (e) => {
    drag.current = null
    try { ref.current.releasePointerCapture(e.pointerId) } catch { /* */ }
  }

  const onDoubleClick = (e) => {
    if (e.target.closest('[data-node]')) return
    const { x, y } = local(e)
    const px = pad + x * w, py = pad + y * h
    if (abs.length < 2) {
      onChange?.([...pts, { x: clamp01(x), y: clamp01(y) }])
      return
    }
    const segs = abs.length - 1 + (closed ? 1 : 0)
    let best = { i: 0, t: 0.5, dist: Infinity }
    for (let i = 0; i < segs; i++) {
      const hit = nearestSegmentT(abs[i], abs[(i + 1) % abs.length], px, py)
      if (hit.dist < best.dist) best = { i, ...hit }
    }
    const j = (best.i + 1) % abs.length
    const sp = splitSegment(abs[best.i], abs[j], best.t)
    const next = pts.slice()
    next[best.i] = fromAbs(sp.a)
    next[j] = fromAbs(sp.b)
    next.splice(best.i + 1, 0, fromAbs(sp.mid))
    onChange?.(next)
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className={`kol-bezier-path-editor relative w-full overflow-hidden touch-none select-none rounded-[var(--kol-radius-sm)] bg-[var(--kol-tone-bg,var(--kol-surface-secondary))] ${className}`.trim()}
      style={{ aspectRatio: String(aspect) }}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onDoubleClick={onDoubleClick}
    >
      {box.w > 0 && (
        <svg className="absolute inset-0 overflow-visible" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`}>
          <path d={pathD(abs, closed)} fill="none" stroke="var(--kol-oq-80)" strokeWidth="1.5" />
          {abs.map((n, i) => (
            <g key={i} data-node="">
              {['in', 'out'].map((side) => n[side] && (
                <g key={side}>
                  <line x1={n.x} y1={n.y} x2={n[side].x} y2={n[side].y} stroke="var(--kol-oq-24)" strokeWidth="1" />
                  <circle cx={n[side].x} cy={n[side].y} r={rH + HIT} fill="transparent" className="cursor-grab"
                    onPointerDown={onDown(i, side === 'in' ? 'hl' : 'hr')} />
                  <circle cx={n[side].x} cy={n[side].y} r={rH} fill="var(--kol-oq-48)" pointerEvents="none" />
                </g>
              ))}
              <circle cx={n.x} cy={n.y} r={rA + HIT} fill="transparent" className="cursor-grab" onPointerDown={onDown(i, 'anchor')} />
              <circle cx={n.x} cy={n.y} r={rA} fill="var(--kol-accent-primary)" pointerEvents="none" />
            </g>
          ))}
        </svg>
      )}
    </div>
  )
}
