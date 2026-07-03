import { useCallback, useEffect, useId, useRef } from 'react'

/* taxonomy-ok: the default composed control nests the same-file HueStrip and
 * SBSquare (KOL named exports the relative-import check can't see). */

/*
 * SpectrumControls — the HSV color-picker family: three hand-tuned widgets
 * plus the composed classic picker. Hand-tuned visuals (specific gradients,
 * inset math, handle sizes, barycentric SV math, conic-gradient ring with
 * clip-path mask). DO NOT refactor pieces to atoms — the look and the math
 * are intentional and tuned as a unit.
 *
 *   <SpectrumControls value onChange />            (default export)
 *     — HueStrip stacked over a fill-height SBSquare (the classic square
 *       picker, per the source panel's Hue mode layout).
 *
 *   <HueStrip hue onChange />
 *     — 1D hue slider (12px tall) with a knob constrained inside the box.
 *
 *   <SBSquare hue sat val onChange />
 *     — 2D saturation/value picker. Uses available width × height of its
 *       container; gradient is white→hue horizontally with a black overlay
 *       fading to transparent upward.
 *
 *   <WheelTriangle hue sat val onChangeHue onChangeSV />
 *     — Hue ring + inscribed rotating HSV triangle. Ring snaps-on-click;
 *       triangle uses grab-with-offset (handle stays put on click, drag
 *       preserves cursor↔handle delta) so fine sat/val tuning works.
 *
 * All colors here are literal color math (hsl/#000/#fff/#505050) on purpose —
 * a spectrum is not themeable. The only token is the handle's `bg-fg`.
 */

/* Handle radius (px) used to inset both the handle's positioning area AND
 * the drag hit-test math so the knob always renders inside the spectrum
 * frame. Without this the handle's center maps to 0/100% of the box and
 * half the knob hangs off the edge. */
const HANDLE_R = 7

const HUE_GRADIENT =
  'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))'

/**
 * HueStrip — 1D hue slider: a rainbow bar with a draggable knob. Pointer
 * drag anywhere on the strip; focus + Left/Right (or Down/Up) arrow keys
 * nudge hue by 1° (role="slider").
 *
 * @param {number}   hue      controlled hue, 0–360
 * @param {Function} onChange (hue: number) => void — fires on press, drag, and arrow keys
 */
export function HueStrip({ hue, onChange }) {
  const ref = useRef(null)
  const dragging = useRef(false)

  const update = useCallback((clientX) => {
    const node = ref.current
    if (!node) return
    const rect  = node.getBoundingClientRect()
    const inner = rect.width - 2 * HANDLE_R
    if (inner <= 0) return
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left - HANDLE_R) / inner))
    onChange(ratio * 360)
  }, [onChange])

  const onDown = (e) => {
    dragging.current = true
    update(e.clientX)
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (e) => { if (dragging.current) update(e.clientX) }
    const onUp   = ()  => { dragging.current = false }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [update])

  const onKeyDown = (e) => {
    let next = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(360, hue + 1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(0, hue - 1)
    if (next === null) return
    e.preventDefault()
    onChange(next)
  }

  const pos = (hue / 360) * 100

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Hue"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hue)}
      onPointerDown={onDown}
      onKeyDown={onKeyDown}
      className="relative rounded-[2px] cursor-pointer touch-none"
      style={{ height: 12, background: HUE_GRADIENT }}
    >
      {/* Handle positions inside an inset region so 0..100% maps to the
       * area where the knob can sit without spilling out. */}
      <div className="absolute inset-y-0" style={{ left: HANDLE_R, right: HANDLE_R }}>
        <Handle left={`${pos}%`} top="50%" />
      </div>
    </div>
  )
}

/**
 * SBSquare — 2D saturation/value picker: white→hue horizontal gradient with
 * a black overlay fading upward, crosshair handle. Fills its container
 * (consumer owns the size — and the rounding: apply `rounded-[2px]
 * overflow-hidden` on the wrapper). Focus + arrow keys nudge: Left/Right =
 * saturation ±1, Up/Down = value ±1 (role="slider").
 *
 * @param {number}   hue      hue for the gradient endpoint, 0–360
 * @param {number}   sat      controlled saturation, 0–100
 * @param {number}   val      controlled value/brightness, 0–100
 * @param {Function} onChange (sat: number, val: number) => void
 */
export function SBSquare({ hue, sat, val, onChange }) {
  const ref = useRef(null)
  const dragging = useRef(false)

  const update = useCallback((clientX, clientY) => {
    const node = ref.current
    if (!node) return
    const rect   = node.getBoundingClientRect()
    const innerW = rect.width  - 2 * HANDLE_R
    const innerH = rect.height - 2 * HANDLE_R
    if (innerW <= 0 || innerH <= 0) return
    const sx = Math.max(0, Math.min(1, (clientX - rect.left - HANDLE_R) / innerW))
    const sy = Math.max(0, Math.min(1, (clientY - rect.top  - HANDLE_R) / innerH))
    onChange(sx * 100, (1 - sy) * 100)
  }, [onChange])

  const onDown = (e) => {
    dragging.current = true
    update(e.clientX, e.clientY)
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (e) => { if (dragging.current) update(e.clientX, e.clientY) }
    const onUp   = ()  => { dragging.current = false }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [update])

  const onKeyDown = (e) => {
    const clamp = (v) => Math.max(0, Math.min(100, v))
    if (e.key === 'ArrowRight')     onChange(clamp(sat + 1), val)
    else if (e.key === 'ArrowLeft') onChange(clamp(sat - 1), val)
    else if (e.key === 'ArrowUp')   onChange(sat, clamp(val + 1))
    else if (e.key === 'ArrowDown') onChange(sat, clamp(val - 1))
    else return
    e.preventDefault()
  }

  const sb = `linear-gradient(to bottom, transparent 0%, #000 100%), linear-gradient(to right, #fff 0%, hsl(${hue},100%,50%) 100%)`
  /* Gradient field is rectangular — rounding is the consumer's job (apply
   * `rounded-[2px] overflow-hidden` on the wrapper). Putting border-radius
   * on the gradient itself produces tiny antialiasing artifacts at the
   * corners; clipping via overflow-hidden on the parent is cleaner. */
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Saturation and brightness"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sat)}
      aria-valuetext={`Saturation ${Math.round(sat)}%, brightness ${Math.round(val)}%`}
      onPointerDown={onDown}
      onKeyDown={onKeyDown}
      className="relative cursor-crosshair touch-none w-full h-full"
      style={{ background: sb }}
    >
      <div className="absolute" style={{ inset: HANDLE_R }}>
        <Handle left={`${sat}%`} top={`${100 - val}%`} />
      </div>
    </div>
  )
}

/* Wheel + rotating HSV triangle.
 *
 * Layout — viewBox 100×100, all coords in viewBox space.
 *   Center (50, 50). Outer ring radius = 48. Inner hole radius = 40.
 *   Triangle inscribed in a circle of radius TRI_R = 40 (vertices touch
 *   the inner ring edge).
 *
 * Triangle vertices rotate so the hue vertex always points at the active
 * hue position on the ring. With angle = hue degrees from east (CCW negated
 * for screen y-down):
 *   V_hue   at angle θ
 *   V_white at θ - 120°  (upper-left when θ = 0)
 *   V_black at θ + 120°  (lower-left when θ = 0)
 *
 * SV mapping uses barycentric coords inside the triangle:
 *   P = a·V_hue + b·V_white + c·V_black,   a+b+c = 1
 *   value      = a + b           (1 − c, height-from-black-edge in HSV space)
 *   saturation = a / (a + b)     (0 = white side, 1 = hue side)
 *
 * Render: SVG with three stacked polygons —
 *   1. solid hue
 *   2. white-fade (linear gradient: opaque at V_white, 0 toward opposite edge)
 *   3. black-fade (linear gradient: opaque at V_black, 0 toward opposite edge)
 */

const RING_OUTER = 48
const RING_INNER = 40           /* thin ring band — triangle vertices land on this edge */
const TRI_R      = RING_INNER   /* vertices touch the inner ring edge directly */

function vertexAt(angleRad) {
  return [50 + TRI_R * Math.cos(angleRad), 50 + TRI_R * Math.sin(angleRad)]
}

/**
 * WheelTriangle — HSV color wheel: conic hue ring with an inscribed,
 * rotating HSV triangle for saturation/value. Ring press snaps hue to the
 * cursor angle and drags; triangle press grabs the SV handle with a
 * cursor↔handle offset so fine tuning never teleports it. Focus + arrow
 * keys nudge: Left/Right = hue ±1° (wrapping), Up/Down = value ±1
 * (role="slider"; saturation is pointer-only).
 *
 * @param {number}   hue         controlled hue, 0–360 — ring handle angle + triangle rotation
 * @param {number}   sat         controlled saturation, 0–100
 * @param {number}   val         controlled value/brightness, 0–100
 * @param {Function} onChangeHue (hue: number) => void — ring drag / hue arrow keys
 * @param {Function} onChangeSV  (sat: number, val: number) => void — triangle drag / value arrow keys
 */
export function WheelTriangle({ hue, sat, val, onChangeHue, onChangeSV }) {
  const svgRef   = useRef(null)
  const dragMode = useRef(null)   /* { type: 'ring' } | { type: 'tri', offsetX, offsetY } | null */

  /* [source-bug] fixed — the source hardcoded these three <defs> ids, so
   * mounting two WheelTriangles collided (clip + gradients resolve to the
   * first instance in the document). useId-derived per instance; sanitized
   * because React wraps ids in ":"/"«»", which are unreliable inside
   * url(#…) references. */
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const ringClipId  = `kol-wheel-ring-clip-${uid}`
  const whiteFadeId = `kol-wheel-white-fade-${uid}`
  const blackFadeId = `kol-wheel-black-fade-${uid}`

  /* Convert client coords to viewBox coords (0..100). */
  const toView = useCallback((clientX, clientY) => {
    const node = svgRef.current
    if (!node) return [50, 50]
    const rect = node.getBoundingClientRect()
    return [
      ((clientX - rect.left) / rect.width)  * 100,
      ((clientY - rect.top)  / rect.height) * 100,
    ]
  }, [])

  /* Compute hue vertex angle (radians). */
  const hueAngle    = hue * Math.PI / 180
  const angleHue    = hueAngle
  const angleWhite  = hueAngle - (2 * Math.PI / 3)
  const angleBlack  = hueAngle + (2 * Math.PI / 3)
  const Vh = vertexAt(angleHue)
  const Vw = vertexAt(angleWhite)
  const Vb = vertexAt(angleBlack)

  /* Barycentric weights for point P given the triangle vertices. */
  const baryFor = (px, py) => {
    const [x1, y1] = Vh
    const [x2, y2] = Vw
    const [x3, y3] = Vb
    const denom = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3)
    if (Math.abs(denom) < 1e-9) return [1, 0, 0]
    const a = ((y2 - y3) * (px - x3) + (x3 - x2) * (py - y3)) / denom
    const b = ((y3 - y1) * (px - x3) + (x1 - x3) * (py - y3)) / denom
    const c = 1 - a - b
    return [a, b, c]
  }

  /* Clamp a point to the triangle interior using its barycentric coords. */
  const clampToTriangle = (px, py) => {
    let [a, b, c] = baryFor(px, py)
    a = Math.max(0, a); b = Math.max(0, b); c = Math.max(0, c)
    const sum = a + b + c
    if (sum === 0) return [Vh[0], Vh[1], 1, 0, 0]
    a /= sum; b /= sum; c /= sum
    const x = a * Vh[0] + b * Vw[0] + c * Vb[0]
    const y = a * Vh[1] + b * Vw[1] + c * Vb[1]
    return [x, y, a, b, c]
  }

  /* SV handle position from current (sat, val). */
  const aH = (sat / 100) * (val / 100)
  const bH = (1 - sat / 100) * (val / 100)
  const cH = 1 - val / 100
  const handleX = aH * Vh[0] + bH * Vw[0] + cH * Vb[0]
  const handleY = aH * Vh[1] + bH * Vw[1] + cH * Vb[1]

  /* Hue handle on ring (midline between outer and inner radius). */
  const ringR  = (RING_OUTER + RING_INNER) / 2
  const ringHx = 50 + ringR * Math.cos(hueAngle)
  const ringHy = 50 + ringR * Math.sin(hueAngle)

  /* Pointer behavior:
   *  - Ring → snap-on-click; continued drag tracks cursor angle.
   *  - Tri  → grab-with-offset so fine-tuning doesn't teleport the handle. */
  const onSvgDown = (e) => {
    const [vx, vy] = toView(e.clientX, e.clientY)
    const dist = Math.hypot(vx - 50, vy - 50)
    if (dist > RING_INNER) {
      const cursorAngle = (Math.atan2(vy - 50, vx - 50) * 180 / Math.PI + 360) % 360
      onChangeHue(cursorAngle)
      dragMode.current = { type: 'ring' }
    } else {
      dragMode.current = {
        type: 'tri',
        offsetX: handleX - vx,
        offsetY: handleY - vy,
      }
    }
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (e) => {
      const d = dragMode.current
      if (!d) return
      const [vx, vy] = toView(e.clientX, e.clientY)
      if (d.type === 'ring') {
        const cursorAngle = (Math.atan2(vy - 50, vx - 50) * 180 / Math.PI + 360) % 360
        onChangeHue(cursorAngle)
      } else {
        const tx = vx + d.offsetX
        const ty = vy + d.offsetY
        const [, , a, b] = clampToTriangle(tx, ty)
        const value = a + b
        const s     = (a + b) > 0 ? (a / (a + b)) : 0
        onChangeSV(s * 100, value * 100)
      }
    }
    const onUp = () => { dragMode.current = null }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [toView, onChangeHue, onChangeSV, Vh, Vw, Vb])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight')     onChangeHue((hue + 1) % 360)
    else if (e.key === 'ArrowLeft') onChangeHue((hue - 1 + 360) % 360)
    else if (e.key === 'ArrowUp')   onChangeSV(sat, Math.min(100, val + 1))
    else if (e.key === 'ArrowDown') onChangeSV(sat, Math.max(0, val - 1))
    else return
    e.preventDefault()
  }

  /* Gradient endpoints: white-fade goes from V_white (opaque) toward the
   * midpoint of the V_hue—V_black edge (transparent). Same idea for black. */
  const midHB = [(Vh[0] + Vb[0]) / 2, (Vh[1] + Vb[1]) / 2]
  const midHW = [(Vh[0] + Vw[0]) / 2, (Vh[1] + Vw[1]) / 2]

  const trianglePoints = `${Vh[0]},${Vh[1]} ${Vw[0]},${Vw[1]} ${Vb[0]},${Vb[1]}`

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Hue wheel"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hue)}
      aria-valuetext={`Hue ${Math.round(hue)} degrees, saturation ${Math.round(sat)}%, brightness ${Math.round(val)}%`}
      onKeyDown={onKeyDown}
      className="aspect-square max-h-full max-w-full"
    >
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      onPointerDown={onSvgDown}
      preserveAspectRatio="xMidYMid meet"
      className="block cursor-crosshair select-none touch-none w-full h-full"
    >
      <defs>
        <clipPath id={ringClipId} clipPathUnits="userSpaceOnUse">
          <path
            d={`M 50 ${50 - RING_OUTER} a ${RING_OUTER} ${RING_OUTER} 0 1 0 0.001 0 Z
                M 50 ${50 - RING_INNER} a ${RING_INNER} ${RING_INNER} 0 1 1 -0.001 0 Z`}
            fillRule="evenodd"
          />
        </clipPath>
        <linearGradient id={whiteFadeId} gradientUnits="userSpaceOnUse"
          x1={midHB[0]} y1={midHB[1]} x2={Vw[0]} y2={Vw[1]}>
          <stop offset="0"  stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1"  stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={blackFadeId} gradientUnits="userSpaceOnUse"
          x1={midHW[0]} y1={midHW[1]} x2={Vb[0]} y2={Vb[1]}>
          <stop offset="0"  stopColor="#000000" stopOpacity="0" />
          <stop offset="1"  stopColor="#000000" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Outer ring: foreignObject + CSS conic gradient, clipped to a torus
          path so only the band is visible. */}
      <foreignObject x="0" y="0" width="100" height="100" clipPath={`url(#${ringClipId})`}>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            width: '100%', height: '100%',
            background: `conic-gradient(from 0deg,
              hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%),
              hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%),
              hsl(360,100%,50%))`,
          }}
        />
      </foreignObject>

      {/* Triangle layers — three stacked polygons mix to a true HSV triangle */}
      <polygon points={trianglePoints} fill={`hsl(${hue}, 100%, 50%)`} />
      <polygon points={trianglePoints} fill={`url(#${whiteFadeId})`} />
      <polygon points={trianglePoints} fill={`url(#${blackFadeId})`} />

      {/* Handles. Ring handle is larger than the SV handle to match the Ref. */}
      <SvgHandle cx={ringHx}  cy={ringHy}  r={3.2} />
      <SvgHandle cx={handleX} cy={handleY} r={2.0} />
    </svg>
    </div>
  )
}

/* ────────── Internal helpers (not exported) ────────── */

/* DOM handle for HueStrip / SBSquare. Solid white-stroked circle with thin
 * black halo (matching the macOS-port look). */
function Handle({ left, top }) {
  return (
    <span
      className="absolute pointer-events-none rounded-full bg-fg"
      style={{
        left, top,
        width: 14, height: 14,
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 0 1px #000, 0 0 0 2px #505050',
      }}
    />
  )
}

/* SVG handle for WheelTriangle. Two concentric circles to stay sharp at any
 * zoom — outer black halo + white outline. */
function SvgHandle({ cx, cy, r = 2.4 }) {
  return (
    <g pointerEvents="none">
      <circle cx={cx} cy={cy} r={r + 0.5} fill="none" stroke="#000" strokeOpacity="0.7" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={r}       fill="none" stroke="#FFF" strokeWidth="1.4" />
    </g>
  )
}

/**
 * SpectrumControls — the composed classic square picker: HueStrip stacked
 * over a fill-height SBSquare, per the source color panel's Hue mode layout
 * (SBSquare wrapped in `rounded-[2px] overflow-hidden`, see its comment).
 * Fills its container — the consumer owns the outer size. For the ring
 * picker, use WheelTriangle directly; the primitives are also exported for
 * custom layouts.
 *
 * Controlled on a single HSV object; hex/RGB conversion stays at the call
 * site (pairs with ColorSwatch + a hex Input there).
 *
 * @param {Object}   value    { hue: 0–360, sat: 0–100, val: 0–100 }
 * @param {Function} onChange (next: { hue, sat, val }) => void
 */
export default function SpectrumControls({ value, onChange }) {
  const { hue, sat, val } = value
  return (
    <div className="flex flex-col gap-3 w-full h-full min-h-0">
      <HueStrip hue={hue} onChange={(h) => onChange({ hue: h, sat, val })} />
      <div className="flex-1 min-h-0 rounded-[2px] overflow-hidden">
        <SBSquare hue={hue} sat={sat} val={val} onChange={(s, v) => onChange({ hue, sat: s, val: v })} />
      </div>
    </div>
  )
}
