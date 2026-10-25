import { useEffect, useRef, useState } from 'react'

/**
 * useCanvasViewport — the one engine under every canvas (the canvas family, 2026-10-23).
 *
 * `CanvasEditor` (the artboard, a fixed 1080-virtual frame with rulers and guides) and
 * `CanvasStudio` (the infinite dotted surface the rack and the desk sit on) are two surfaces
 * with one set of gestures and one key table. Until this file the gestures lived three times:
 * kol-component's `PanZoomViewport`, kol-monitor's `RackViewport` and kol-mirror's desk — each
 * with its own modifier, its own clamp and its own touch code, drifting on every one (⌘-wheel
 * here, ⌥-scroll there; ⌘0, ⌥0 and a bare 0). The ruling (user, 2026-10-23): ⌘ is the canvas's
 * modifier, globally; ⌥ belongs to the Hub's page keys (⌥1 … ⌥9). Nothing on the canvas reads ⌥.
 *
 * The view is `{ zoom, x, y }` — one `translate(x, y) scale(zoom)` with origin 0 0 on the
 * transform layer, so a consumer's screen → content math divides by the zoom and nothing else.
 * Controlled (`view` + `onViewChange`) or not (`defaultView`); either way `setView` takes a value
 * or an updater, as React's does.
 *
 * Listeners mount on `ref.current` (pointer, wheel) and on the window (keys, move, up), so the
 * component renders a div with the ref and nothing else. Keys never fire while typing in a field.
 */

/* THE KEY TABLE — read by both surfaces, the docs page and a Hub's shortcuts sheet. `surface`
 * narrows a row to one canvas; absent, it is both. */
export const CANVAS_KEYS = [
  { id: 'pan-space', label: 'Grab and pan (hold)', combo: 'Space + drag' },
  { id: 'pan-drag', label: 'Pan', combo: 'Middle-drag, ⌘ drag' },
  { id: 'pan-wheel', label: 'Pan', combo: 'Scroll (Shift for sideways)' },
  { id: 'zoom', label: 'Zoom at the pointer', combo: '⌘ scroll, pinch' },
  { id: 'zoom-in', label: 'Zoom in', combo: '⌘ =' },
  { id: 'zoom-out', label: 'Zoom out', combo: '⌘ −' },
  { id: 'zoom-reset', label: 'Reset pan and zoom', combo: '⌘ 0' },
  { id: 'fps', label: 'Framerate', combo: 'F' },
  { id: 'grid', label: 'Dot grid', combo: 'G', surface: 'studio' },
  { id: 'lock', label: 'Lock the view', combo: 'L', surface: 'studio' },
  { id: 'snap', label: 'Snap positions', combo: '1–9', surface: 'studio' },
]

/* THE SNAP POSITIONS (CanvasStudioSnapPositions, kol-mirror 2026-10-25 — monitor's RackViewport keys, so mirror's desk
 * reuses them instead of a fourth copy: *"read monitor and see what shortcuts they have set as convention and reuse
 * those"*). Numpad-laid: 7 8 9 the top, 4 5 6 the middle, 1 2 3 the bottom, each at the left · centre · right. A PAN,
 * never a zoom — the content box lands `snapPadding` inside the surface's edge, or centred on that axis. */
export const SNAP_PADDING = 48
const SNAP = {
  7: [0, 0], 8: [0.5, 0], 9: [1, 0],
  4: [0, 0.5], 5: [0.5, 0.5], 6: [1, 0.5],
  1: [0, 1], 2: [0.5, 1], 3: [1, 1],
}
/* where the content's top-left should land, in surface space, for key `k`: 0 = the padding, 1 = the far edge less
 * the padding and the content's size, 0.5 = centred */
function snapTarget(k, surface, content, p) {
  const [ax, ay] = SNAP[k]
  const at = (a, size, extent) => (a === 0.5 ? (extent - size) / 2 : a === 0 ? p : extent - p - size)
  return { x: at(ax, content.width, surface.width), y: at(ay, content.height, surface.height) }
}

/* the dot grid — kol-monitor's and kol-mirror's exact rule, on the token: a 1px fg-12 dot on a
 * 36px cell at zoom 1, the cell scaled by the zoom and the field offset by the pan so the surface
 * moves under the work instead of the work sliding over a static field */
export const CANVAS_GRID_CELL = 36
export const CANVAS_GRID_IMAGE = 'radial-gradient(var(--kol-fg-12) 1px, transparent 1px)'

/* one rate per input, both surfaces: a mouse wheel notch is ~100 deltaY, a trackpad pinch
 * arrives as a ctrlKey wheel with deltas of a few px — the same exponent would make one of them
 * useless */
const WHEEL_RATE = 0.0015
const PINCH_RATE = 0.01
const STEP = 1.2
const TAP_MS = 350
const TAP_PX = 12
/* on a touch surface a finger on one of these is the control's, not a pan (monitor's useTouchGestures) */
const CONTROL = '[data-jack-id], button, input, select, textarea, a, [role="button"], [role="slider"]'

export function isTypingTarget(el) {
  if (!el || !el.tagName) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

const isControl = (t) => {
  if (!t || t === document || !t.closest) return false
  if (t.closest(CONTROL)) return true
  const c = getComputedStyle(t).cursor
  return c !== 'auto' && c !== 'default' && c !== 'grab' && c !== 'grabbing'
}

/* Anchor a zoom change at a screen point (sx, sy relative to the surface's top-left) so the
 * content under the cursor stays put: screen = p * zoom + pan, inverted for a fixed p. */
export function zoomAt(v, factor, sx, sy, clamp) {
  const z2 = clamp(v.zoom * factor)
  return {
    zoom: z2,
    x: sx - (sx - v.x) * (z2 / v.zoom),
    y: sy - (sy - v.y) * (z2 / v.zoom),
  }
}

/* useFps(enabled) — live framerate, measured only while `enabled` (the RAF idles when off);
 * frames per second, updated twice a second. A plain comment on purpose: `@param` belongs to a
 * destructured props signature, and the props gate pairs a doc block with the next such export. */
export function useFps(enabled) {
  const [fps, setFps] = useState(0)
  useEffect(() => {
    if (!enabled) return undefined
    let raf, frames = 0, last = performance.now()
    const loop = (now) => {
      frames++
      if (now - last >= 500) {
        setFps(Math.round((frames * 1000) / (now - last)))
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [enabled])
  return fps
}

const REST = { zoom: 1, x: 0, y: 0 }

/* useCanvasViewport(options) — see the file comment. Options:
 *   ref            the surface element (required) — pointer and wheel listeners mount on it
 *   view, defaultView, onViewChange   the view, controlled or not
 *   minZoom, maxZoom   the clamp (studio: the zoom itself; editor: in REAL terms through `fit`)
 *   fit            () => number — the editor's fit scale, so the clamp reads zoom × fit
 *   rest           () => view — what ⌘0 and `reset` return to (default zoom 1 at 0, 0); the studio's `fit` sets it
 *   locked, onLockChange   the lock, controlled or not; `L` toggles it when `lockKey` is on
 *   grid, onGridChange     the grid, controlled or not; `G` toggles it when `gridKey` is on
 *   gridKey, lockKey       whether the surface binds G and L (the studio does, the editor does not)
 *   touch          'studio' (one finger pans unless on a control, two pan and pinch) · 'editor'
 *                  (two pan and pinch, a one-finger tap fires onSpaceTap) · 'none'
 *   spaceWhenOver  Space grabs only while the pointer is over the surface (a desk whose app
 *                  gives Space to the transport elsewhere), in the capture phase
 *   ignore         a selector — wheel and touch pass through what matches (an inner scroller)
 *   onSpaceTap     a Space press released without a pan, or a one-finger tap on the editor
 *   snapKeys       whether `1–9` snap the view to the nine positions (the studio does, the editor does not)
 *   content        () => DOMRect | null — the content box the snap positions place, in screen space
 *   snapPadding    the inset a snapped edge keeps from the surface's edge (default 48, monitor's)
 * Returns { view, setView, reset, zoomTo, spaceHeld, dragging, pinching, deaf, cursor, locked,
 * setLocked, grid, setGrid, showFps, fps, transform }. */
export function useCanvasViewport({
  ref,
  view: viewProp,
  defaultView,
  onViewChange,
  minZoom = 0.1,
  maxZoom = 2,
  fit,
  rest,
  locked: lockedProp,
  onLockChange,
  grid: gridProp,
  onGridChange,
  gridKey = false,
  lockKey = false,
  touch = 'studio',
  spaceWhenOver = false,
  ignore = 'input, textarea, select, [data-scroll-own]',
  onSpaceTap,
  snapKeys = false,
  content,
  snapPadding = SNAP_PADDING,
}) {
  const [inner, setInner] = useState(defaultView ?? REST)
  const controlled = viewProp !== undefined
  const view = controlled ? viewProp : inner
  const viewRef = useRef(view)
  viewRef.current = view
  const onViewRef = useRef(onViewChange)
  onViewRef.current = onViewChange
  const fitRef = useRef(fit)
  fitRef.current = fit
  const restRef = useRef(rest)
  restRef.current = rest
  const restView = () => restRef.current?.() ?? REST
  const clampRef = useRef(null)
  clampRef.current = (z) => {
    const f = fitRef.current ? fitRef.current() : 1
    return Math.min(maxZoom / f, Math.max(minZoom / f, z))
  }
  const setView = (next) => {
    const v = typeof next === 'function' ? next(viewRef.current) : next
    viewRef.current = v
    if (!controlled) setInner(v)
    onViewRef.current?.(v)
  }
  const setViewRef = useRef(setView)
  setViewRef.current = setView

  /* lock and grid — controlled or not; handlers read the refs (they are registered once) */
  const [lockedState, setLockedState] = useState(!!lockedProp)
  const locked = onLockChange ? !!lockedProp : lockedState
  const lockedRef = useRef(locked)
  lockedRef.current = locked
  const setLocked = (v) => { const next = typeof v === 'function' ? v(lockedRef.current) : v; lockedRef.current = next; if (onLockChange) onLockChange(next); else setLockedState(next) }
  const setLockedRef = useRef(setLocked)
  setLockedRef.current = setLocked

  const [gridState, setGridState] = useState(gridProp ?? true)
  const grid = onGridChange ? !!gridProp : gridState
  const gridRef = useRef(grid)
  gridRef.current = grid
  const setGrid = (v) => { const next = typeof v === 'function' ? v(gridRef.current) : v; gridRef.current = next; if (onGridChange) onGridChange(next); else setGridState(next) }
  const setGridRef = useRef(setGrid)
  setGridRef.current = setGrid

  const [spaceHeld, setSpaceHeld] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [pinching, setPinching] = useState(false)
  const [showFps, setShowFps] = useState(false)
  const fps = useFps(showFps)
  const spaceTapRef = useRef(onSpaceTap)
  spaceTapRef.current = onSpaceTap
  const spacePannedRef = useRef(false)
  const spaceRef = useRef(false)
  const overRef = useRef(!spaceWhenOver)
  const dragStart = useRef(null)
  const optsRef = useRef({ gridKey, lockKey, spaceWhenOver, touch, ignore, snapKeys, snapPadding })
  optsRef.current = { gridKey, lockKey, spaceWhenOver, touch, ignore, snapKeys, snapPadding }
  const contentRef = useRef(content)
  contentRef.current = content

  /* keys — Space (pan mode, a tap), ⌘0 / ⌘= / ⌘− (zoom), F (fps), G and L where the surface binds them, 1–9 the snap
   * positions where it binds those (⌥1–9 stay the Hub's: the alt check above returns first) */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (isTypingTarget(e.target)) return
      const o = optsRef.current
      if (e.code === 'Space') {
        if (o.spaceWhenOver && !overRef.current) return
        e.preventDefault()
        if (o.spaceWhenOver) e.stopImmediatePropagation()
        if (!e.repeat) spacePannedRef.current = false
        if (!spaceRef.current) { spaceRef.current = true; setSpaceHeld(true) }
        return
      }
      if (e.metaKey || e.ctrlKey) {
        if (e.altKey) return
        const el = ref.current
        const r = el?.getBoundingClientRect()
        const cx = (r?.width ?? 0) / 2, cy = (r?.height ?? 0) / 2
        if (e.key === '0') { e.preventDefault(); if (!lockedRef.current) setViewRef.current(restView()) }
        else if (e.key === '=' || e.key === '+') { e.preventDefault(); if (!lockedRef.current) setViewRef.current((v) => zoomAt(v, STEP, cx, cy, clampRef.current)) }
        else if (e.key === '-') { e.preventDefault(); if (!lockedRef.current) setViewRef.current((v) => zoomAt(v, 1 / STEP, cx, cy, clampRef.current)) }
        return
      }
      if (e.altKey) return
      if (e.key === 'f' || e.key === 'F') { setShowFps((v) => !v); return }
      if (o.gridKey && (e.key === 'g' || e.key === 'G')) { e.preventDefault(); setGridRef.current((v) => !v); return }
      if (o.lockKey && (e.key === 'l' || e.key === 'L')) { e.preventDefault(); setLockedRef.current((v) => !v); return }
      if (o.snapKeys && e.key.length === 1 && '123456789'.includes(e.key)) {
        e.preventDefault()
        if (lockedRef.current) return
        const surface = ref.current?.getBoundingClientRect()
        const box = contentRef.current?.()
        if (!surface || !box) return
        /* the view's translate is in screen px (translate, then scale), so the pan moves by the screen delta as is */
        const t = snapTarget(e.key, surface, box, o.snapPadding)
        const dx = surface.left + t.x - box.left, dy = surface.top + t.y - box.top
        setViewRef.current((v) => ({ ...v, x: v.x + dx, y: v.y + dy }))
      }
    }
    const onKeyUp = (e) => {
      if (e.code !== 'Space') return
      const was = spaceRef.current
      spaceRef.current = false
      setSpaceHeld(false)
      setDragging(false)
      dragStart.current = null
      if (was && !spacePannedRef.current && !isTypingTarget(e.target)) spaceTapRef.current?.()
    }
    const capture = optsRef.current.spaceWhenOver
    window.addEventListener('keydown', onKeyDown, capture)
    window.addEventListener('keyup', onKeyUp, capture)
    return () => {
      window.removeEventListener('keydown', onKeyDown, capture)
      window.removeEventListener('keyup', onKeyUp, capture)
    }
  }, [ref])

  /* the pointer — Space+drag, middle-drag and ⌘-drag pan; enter/leave for `spaceWhenOver` */
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const onEnter = () => { if (optsRef.current.spaceWhenOver) overRef.current = true }
    const onLeave = () => { if (optsRef.current.spaceWhenOver) overRef.current = false }
    const onDown = (e) => {
      if (e.pointerType === 'touch') return
      if (lockedRef.current) return
      const wants = spaceRef.current || e.button === 1 || (e.metaKey && e.button === 0)
      if (!wants) return
      e.preventDefault()
      if (spaceRef.current) spacePannedRef.current = true
      const v = viewRef.current
      dragStart.current = { x: e.clientX - v.x, y: e.clientY - v.y }
      setDragging(true)
    }
    const onMove = (e) => {
      const s = dragStart.current
      if (!s) return
      setViewRef.current((v) => ({ ...v, x: e.clientX - s.x, y: e.clientY - s.y }))
    }
    const onUp = () => {
      if (!dragStart.current) return
      dragStart.current = null
      setDragging(false)
    }
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [ref])

  /* the wheel — plain scroll pans (Shift sideways), ⌘-wheel and a pinch (ctrlKey) zoom at the
   * pointer; native and non-passive so the page neither scrolls nor zooms */
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const onWheel = (e) => {
      const ig = optsRef.current.ignore
      if (ig && e.target.closest?.(ig)) return
      e.preventDefault()
      if (lockedRef.current) return
      const r = el.getBoundingClientRect()
      const sx = e.clientX - r.left, sy = e.clientY - r.top
      if (e.ctrlKey) setViewRef.current((v) => zoomAt(v, Math.exp(-e.deltaY * PINCH_RATE), sx, sy, clampRef.current))
      else if (e.metaKey) setViewRef.current((v) => zoomAt(v, Math.exp(-e.deltaY * WHEEL_RATE), sx, sy, clampRef.current))
      else setViewRef.current((v) => ({ ...v, x: v.x - (e.shiftKey ? e.deltaY : e.deltaX), y: v.y - (e.shiftKey ? 0 : e.deltaY) }))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [ref])

  /* touch — two fingers pan at their midpoint and pinch-zoom anchored there, on both surfaces.
   * studio: a lone finger on empty surface pans (a finger on a control is the control's).
   * editor: a lone finger is the consumer's, except a tap, which fires onSpaceTap. */
  useEffect(() => {
    const el = ref.current
    if (!el || touch === 'none') return undefined
    const pts = new Map()
    let last = null, solo = null, tap = null
    const geom = () => {
      const [a, b] = [...pts.values()]
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(b.x - a.x, b.y - a.y) || 1 }
    }
    const onDown = (e) => {
      if (e.pointerType !== 'touch') return
      const ig = optsRef.current.ignore
      if (ig && e.target.closest?.(ig)) return
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pts.size === 1) {
        solo = touch === 'studio' && !isControl(e.target) ? { id: e.pointerId, x: e.clientX, y: e.clientY } : null
        tap = touch === 'editor' ? { id: e.pointerId, t: e.timeStamp, x: e.clientX, y: e.clientY } : null
        last = null
      } else if (pts.size === 2) {
        solo = null; tap = null
        last = geom()
        setPinching(true)
      }
    }
    const onMove = (e) => {
      if (!pts.has(e.pointerId)) return
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > TAP_PX) tap = null
      if (lockedRef.current) return
      if (pts.size === 1 && solo && solo.id === e.pointerId) {
        const dx = e.clientX - solo.x, dy = e.clientY - solo.y
        solo.x = e.clientX; solo.y = e.clientY
        setViewRef.current((v) => ({ ...v, x: v.x + dx, y: v.y + dy }))
        return
      }
      if (pts.size !== 2 || !last) return
      const prev = last, next = geom()
      last = next
      const r = el.getBoundingClientRect()
      setViewRef.current((v) => {
        const z = zoomAt(v, next.d / prev.d, prev.x - r.left, prev.y - r.top, clampRef.current)
        return { ...z, x: z.x + next.x - prev.x, y: z.y + next.y - prev.y }
      })
    }
    const onUp = (e) => {
      if (!pts.delete(e.pointerId)) return
      if (tap?.id === e.pointerId && e.type === 'pointerup' && e.timeStamp - tap.t < TAP_MS) spaceTapRef.current?.()
      if (tap?.id === e.pointerId) tap = null
      if (solo?.id === e.pointerId) solo = null
      last = pts.size === 2 ? geom() : null
      if (pts.size < 2) setPinching(false)
    }
    el.addEventListener('pointerdown', onDown, true)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown, true)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [ref, touch])

  const cursor = dragging ? 'grabbing' : spaceHeld && !locked ? 'grab' : undefined
  return {
    view,
    setView,
    reset: () => setView(restView()),
    /* a REAL zoom (1 = 100 %) about the surface's centre */
    zoomTo: (scale) => {
      const r = ref.current?.getBoundingClientRect()
      const f = fitRef.current ? fitRef.current() : 1
      setView((v) => zoomAt(v, scale / (v.zoom * f), (r?.width ?? 0) / 2, (r?.height ?? 0) / 2, clampRef.current))
    },
    clamp: (z) => clampRef.current(z),
    spaceHeld,
    dragging,
    pinching,
    /* the transform layer goes deaf while a gesture holds the surface, so a layer mousedown never fires mid-pan */
    deaf: spaceHeld || pinching,
    cursor,
    locked,
    setLocked,
    grid,
    setGrid,
    showFps,
    fps,
    transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
  }
}
