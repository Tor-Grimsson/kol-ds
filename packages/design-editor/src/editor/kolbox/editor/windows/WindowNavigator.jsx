import { useEffect, useRef, useState } from 'react'
import { buildLayersSvg, resolveColor, useComposeState, useZoom } from '../engine.js'
import WindowPane from './WindowPane.jsx'
import { Button, Slider } from '@kolkrabbi/kol-component'

/* the canvas column: the real one's `main.kol-editor-canvas` is the real shell's; kolbox's is the Shell's canvas region */
const PANE = 'main[data-canvas]'

/* The visible part of the frame, as fractions of the frame (left, top, width, height): NavigatorPanel's own. */
function visibleRegion() {
  const frame = document.querySelector(`${PANE} [data-canvas-frame]`)
  const pane = document.querySelector(PANE)
  if (!frame || !pane) return null
  const F = frame.getBoundingClientRect(), M = pane.getBoundingClientRect()
  if (!F.width || !F.height) return null
  return { x: (M.left - F.left) / F.width, y: (M.top - F.top) / F.height, w: M.width / F.width, h: M.height / F.height, fw: F.width }
}

/* zoom by `factor` about the canvas column's centre: the viewport's own `kol:zoom-at` seam */
function zoomBy(factor) {
  const pane = document.querySelector(PANE)?.getBoundingClientRect()
  if (!pane || !Number.isFinite(factor) || factor <= 0) return
  window.dispatchEvent(new CustomEvent('kol:zoom-at', { detail: { clientX: pane.left + pane.width / 2, clientY: pane.top + pane.height / 2, factor } }))
}

/* Navigator, as the real NavigatorPanel (shell/NavigatorPanel.jsx): the zoom row (out, the zoom 10 to 800 %, in) over the
   whole frame as a thumbnail in a 200 stage, the canvas fill behind it, the visible viewport as a rectangle in the
   accent; dragging the rectangle pans as wheel deltas, the Hand tool's way. The thumbnail re-takes every 500 ms, the
   viewport every 100 ms, as the real one. */
export default function WindowNavigator({ onClose }) {
  const { layers, palette, aspect, canvasRatio, canvasW, canvasH, canvasFill, canvasFillOpacity } = useComposeState()
  const zoom = useZoom()
  const ratio = canvasW && canvasH ? canvasW / canvasH : 1
  const fillRef = resolveColor(canvasFill, palette)
  const fill = fillRef ? (canvasFillOpacity < 1 ? `color-mix(in srgb, ${fillRef} ${Math.round(canvasFillOpacity * 100)}%, transparent)` : fillRef) : 'transparent'

  const args = useRef(null)
  args.current = { layers, palette, aspect, customRatio: canvasRatio, canvasW, canvasH }
  const [src, setSrc] = useState(null)
  useEffect(() => {
    const take = () => { try { setSrc(`data:image/svg+xml;utf8,${encodeURIComponent(buildLayersSvg(args.current))}`) } catch { /* keep the last frame */ } }
    take()
    const id = setInterval(take, 500)
    return () => clearInterval(id)
  }, [layers, palette, aspect, canvasRatio, canvasW, canvasH])

  const [view, setView] = useState(visibleRegion)
  useEffect(() => {
    const id = setInterval(() => setView(visibleRegion()), 100)
    return () => clearInterval(id)
  }, [])

  const box = useRef(null)
  const drag = useRef(null)
  const onDown = (e) => {
    e.preventDefault()
    drag.current = { x: e.clientX, y: e.clientY }
    const stage = document.querySelector(`${PANE} [data-tool]`)
    const move = (ev) => {
      const r = visibleRegion()
      const bw = box.current?.getBoundingClientRect().width
      if (!r || !drag.current || !bw) return
      const k = r.fw / bw
      const dx = (ev.clientX - drag.current.x) * k, dy = (ev.clientY - drag.current.y) * k
      drag.current = { x: ev.clientX, y: ev.clientY }
      stage?.dispatchEvent(new WheelEvent('wheel', { deltaX: dx, deltaY: dy, bubbles: true, cancelable: true }))
    }
    const up = () => { drag.current = null; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const pct = Math.round(zoom * 100)
  return (
    <WindowPane title="Navigator" name="navigator" onClose={onClose}>
      <div className="flex items-center gap-1">
        <Button variant="kolbox" iconOnly="minus" aria-label="Zoom out" onClick={() => zoomBy(0.8)}/>
        <Slider variant="kolbox" className="min-w-0 flex-1" aria-label="Zoom" min={10} max={800} step={1} value={Math.min(800, Math.max(10, pct))} formatValue={(v) => `${v}%`} onChange={(next) => zoomBy(next / pct)} />
        <Button variant="kolbox" iconOnly="plus" aria-label="Zoom in" onClick={() => zoomBy(1.25)}/>
      </div>
      <div className="flex h-50 items-center justify-center">
        <div ref={box} className="relative overflow-hidden rounded-control ring-1 ring-border" data-navigator-frame
          style={{ aspectRatio: ratio, width: `min(100%, ${Math.round(200 * ratio)}px)`, background: fill }}>
          {src && <img src={src} alt="" className="block h-full w-full" draggable={false} />}
          {view && (
            <div role="presentation" onPointerDown={onDown} data-navigator-view
              className="absolute cursor-grab bg-accent-tint-soft outline-[1.5px] outline-accent outline-solid active:cursor-grabbing"
              style={{ left: `${view.x * 100}%`, top: `${view.y * 100}%`, width: `${view.w * 100}%`, height: `${view.h * 100}%` }} />
          )}
        </div>
      </div>
    </WindowPane>
  )
}
