import { useMemo, useRef } from 'react'
import { system, systemDrag, grid } from '@kolkrabbi/kol-tuner'
import { Board, Keylines, Labels, inksOf, useLight } from './logoBoard.jsx'

/* LOGOSYSTEM (W27.4, 2026-11-19): the System board of @kolkrabbi/kol-tuner (the canvas's system-01-arcs), a mark built
 * from measures, nothing placed by hand. It draws the form, the wedges, the construction and the math, the grid, the
 * keylines, a reference image and the six handles (y, axisAt, x, angle, footAt, footSize). The settings are the host's:
 * `settings` is the engine's System props as they stand, a handle drag calls `onDrag(key, value)` with the measure under
 * the pointer, a double-click on a handle calls `onDragReset()`, a file dropped on the board calls `onFile(file)`.
 * `reference` is `{ src, w, h }`, drawn faint behind the form. `peek` draws the form alone. */
export default function LogoSystem({ settings: p, reference, peek = false, onDrag, onDragReset, onFile, className = '' }) {
  const inks = inksOf(p), themeLight = useLight(), light = inks ? inks.light : themeLight, svg = useRef(null), dragging = useRef(null)
  const v = useMemo(() => system(p), [p])
  const grey = p.fill === 'grey', strokeAlpha = grey ? 0.85 : 0.5
  const gridD = p.grid && p.grid !== 'off' && !peek && v.measures ? grid(p.grid, (+p.gridStep || 1) * v.measures.x * (v.box || 480), +p.gridTurn || 0) : ''
  const at = (e) => { const pt = svg.current.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const q = pt.matrixTransform(svg.current.getScreenCTM().inverse()); return [q.x - 600, q.y - 400] }
  const move = (e) => { const k = dragging.current; if (!k) return; const m = at(e); onDrag?.(k, systemDrag(p, k, m[0], m[1])) }
  const refBox = reference && (() => { const k = Math.min(v.box / reference.w, v.box / reference.h), w = reference.w * k, h = reference.h * k; return { x: -w / 2, y: -h / 2, w, h } })()

  return (
    <div className={`h-full w-full ${className}`.trim()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile?.(e.dataTransfer.files[0]) }}>
      <Board svgRef={svg} inks={inks} label="Mark built from a few measures">
        {refBox && <image href={reference.src} x={refBox.x} y={refBox.y} width={refBox.w} height={refBox.h} className="kol-logo-ref" />}
        {gridD && <path d={gridD} className="kol-logo-grid" />}
        <path d={v.d} className={`kol-logo-form${grey && !peek ? ' is-grey' : ''}`} />
        {!peek && p.math && <path d={v.wedges} className="kol-logo-wedges" />}
        {!peek && <path d={(p.construction ? v.guides : '') + (p.math ? v.dims : '')} className="kol-logo-lines" opacity={strokeAlpha} />}
        {!peek && p.handles && v.handlePts.map((h) => (
          <circle key={h.k} data-handle={h.k} cx={h.p[0]} cy={h.p[1]} r="9" className="kol-logo-handle"
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); dragging.current = h.k; e.currentTarget.setPointerCapture(e.pointerId) }}
            onPointerMove={move} onPointerUp={() => { dragging.current = null }} onDoubleClick={(e) => { e.preventDefault(); dragging.current = null; onDragReset?.() }} />
        ))}
        {p.keylines && !peek && <Keylines box={(v.box || 480) * 1.2} light={light} />}
        {!peek && p.math && <Labels list={v.dimLabels} />}
      </Board>
    </div>
  )
}
