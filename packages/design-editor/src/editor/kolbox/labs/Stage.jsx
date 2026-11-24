import { useEffect, useRef, useState } from 'react'
import { Tooltip } from '@kolkrabbi/kol-component'
import {
  getAppSettings, isTyping, KineticElementOverlay, loopById, OutputCanvas, SoftformsHandleOverlay, transport, useAppSettings,
  useComposeState, useFps, useLabsLayer, useTool,
} from './engine.js'

/* Labs' stage, the real LabsStage (editor/labs/LabsView.jsx) carried: the output with the engine's on-canvas editors
   (round 4 W7), and the stage's own view (round 4, 6.3). Edit on canvas (`kol:kinetic-edit`, Type and Kinetic) and Edit
   forms on canvas (`kol:softform-edit`, Soft Forms) toggle the package's KineticElementOverlay and
   SoftformsHandleOverlay over OutputCanvas, in its virtual px; Escape or Enter exits. The real Labs listens for the
   kinetic one only (its CanvasArea, the editor's, takes both); kolbox takes both so the Soft Forms button acts here too.
   The tool follows Settings' Grab, as the real LabsBody's: Drag (C) and Orbit (C) switch Grab on, and the engine's
   camera rigs answer the orbit tool.
   The view, as the real one: zoom is relative to the fit (1 is the resting frame, kolbox's 32 margin where the real one
   takes 85%); the wheel steps it (not while Grab owns the wheel, never under Zoom lock), - and + step by 1.25, 0 to 4
   jump to fit, 50%, 100%, 150%, 200%, a double click resets zoom and pan; two fingers pinch and move the frame, one tap
   plays and pauses (not on Penrose, whose presses are the piece). F shows the fps readout, measured only while shown. */
const ZOOM_MIN = 0.3
const ZOOM_MAX = 2.5
const ZOOM_KEYS = { 0: 1, 1: 0.5, 2: 1, 3: 1.5, 4: 2 }
const clampZoom = (z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z))

export default function Stage() {
  const { layer } = useLabsLayer()
  const { layers, select, updateLayer, beginTransaction, commitTransaction } = useComposeState()
  const [mode, setMode] = useState(null)

  useEffect(() => {
    const on = (kind, test) => (e) => {
      const { id, index } = e.detail || {}
      setMode((m) => {
        if (m?.kind === kind && m.id === id) return null
        if (!layers.some((l) => l.id === id && test(l) && !l.locked)) return m
        select(id)
        return { kind, id, index: index ?? 0 }
      })
    }
    const onKinetic = on('kinetic', (l) => l.type === 'kinetic')
    const onForms = on('forms', (l) => l.type === 'loop' && l.loopId === 'softforms')
    window.addEventListener('kol:kinetic-edit', onKinetic)
    window.addEventListener('kol:softform-edit', onForms)
    return () => {
      window.removeEventListener('kol:kinetic-edit', onKinetic)
      window.removeEventListener('kol:softform-edit', onForms)
    }
  }, [layers, select])

  const { tool, setTool } = useTool()
  const grab = !!useAppSettings().grab
  useEffect(() => { setTool(grab ? 'orbit' : 'select') }, [grab, setTool])

  /* the view */
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [showFps, setShowFps] = useState(false)
  const fps = useFps(showFps)
  const cellRef = useRef(null)
  const orbitRef = useRef(false); orbitRef.current = tool === 'orbit'

  useEffect(() => {
    const el = cellRef.current
    if (!el) return undefined
    const onWheel = (e) => {
      if (orbitRef.current) return
      e.preventDefault()
      if (getAppSettings().zoomLock) return
      setZoom((z) => clampZoom(z * (e.deltaY > 0 ? 0.94 : 1.06)))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const step = (dir) => setZoom((z) => clampZoom(z * (dir > 0 ? 1.25 : 0.8)))
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isTyping(e)) return
      if (e.key === 'f' || e.key === 'F') { setShowFps((v) => !v); return }
      if (getAppSettings().zoomLock && (e.key === '-' || e.key === '_' || e.key === '+' || e.key === '=' || ZOOM_KEYS[e.key] !== undefined)) return
      if (e.key === '-' || e.key === '_') { step(-1); return }
      if (e.key === '+' || e.key === '=') { step(1); return }
      if (ZOOM_KEYS[e.key] !== undefined) setZoom(ZOOM_KEYS[e.key])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* touch: two fingers pinch about their midpoint and move the frame, one tap plays and pauses */
  const touchRef = useRef({ pts: new Map(), start: null, tap: null })
  const viewRef = useRef({ zoom, pan }); viewRef.current = { zoom, pan }
  const onTouchDown = (e) => {
    if (e.pointerType !== 'touch') return
    const t = touchRef.current
    t.pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
    t.tap = t.pts.size === 1 ? { id: e.pointerId, x: e.clientX, y: e.clientY, at: performance.now() } : null
    if (t.pts.size === 2) {
      const [a, b] = [...t.pts.values()]
      const r = cellRef.current.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
      const { zoom: z0, pan: p0 } = viewRef.current
      t.start = { d: Math.hypot(a.x - b.x, a.y - b.y), cx, cy, z0, qx: (mx - cx - p0.x) / z0, qy: (my - cy - p0.y) / z0 }
      transport.setStagePointer?.(null)
      e.stopPropagation()
    }
  }
  const onTouchMove = (e) => {
    const t = touchRef.current
    if (e.pointerType !== 'touch' || !t.pts.has(e.pointerId)) return
    t.pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (t.pts.size >= 2 && t.start) {
      e.stopPropagation()
      const [a, b] = [...t.pts.values()], st = t.start
      const z = getAppSettings().zoomLock ? st.z0 : clampZoom(st.z0 * (Math.hypot(a.x - b.x, a.y - b.y) / st.d))
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
      setZoom(z)
      setPan({ x: mx - st.cx - z * st.qx, y: my - st.cy - z * st.qy })
    }
  }
  const onTouchUp = (e) => {
    const t = touchRef.current
    if (e.pointerType !== 'touch') return
    const tap = t.tap
    if (tap && tap.id === e.pointerId && e.type === 'pointerup' && !t.start
        && performance.now() - tap.at < 350 && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 12) {
      const def = layer?.type === 'loop' ? loopById(layer.loopId) : null
      if (def?.group !== 'penrose') transport.toggle()
    }
    if (tap?.id === e.pointerId) t.tap = null
    t.pts.delete(e.pointerId)
    if (t.pts.size < 2) t.start = null
  }

  const target = mode && layers.find((l) => l.id === mode.id)
  const exit = () => setMode(null)
  const shared = { layer: target, toVirtual: null, updateLayer, beginTransaction, commitTransaction, onExit: exit }
  const overlay = !target ? undefined
    : mode.kind === 'kinetic'
      ? (toVirtual) => <KineticElementOverlay {...shared} toVirtual={toVirtual} initialIndex={mode.index} />
      : (toVirtual) => <SoftformsHandleOverlay {...shared} toVirtual={toVirtual} />
  const size = `calc((100% - var(--spacing-8) * 2) * ${zoom})`
  return (
    <div
      ref={cellRef}
      className="relative flex h-full w-full touch-none items-center justify-center overflow-hidden"
      onDoubleClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}
      onPointerDownCapture={onTouchDown}
      onPointerMoveCapture={onTouchMove}
      onPointerUpCapture={onTouchUp}
      onPointerCancelCapture={onTouchUp}
      data-stage
      data-zoom={zoom}
    >
      {/* `.kol-design-editor` is the root class the engine's sheet scopes to; flex none, so past 100% the frame
          overflows the cell instead of shrinking back into it */}
      <div className="kol-design-editor flex-none" style={{ width: size, height: size, transform: `translate(${pan.x}px, ${pan.y}px)` }} data-output>
        <OutputCanvas overlay={overlay} />
      </div>
      {showFps && (
        <div className="absolute right-3 bottom-3 flex items-center gap-2" data-fps>
          <Tooltip variant="kolbox" label="Framerate — press F to hide">
            <span className="rounded-control bg-panel px-2 py-1 font-mono text-meta text-text tabular-nums">{fps} fps</span>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
