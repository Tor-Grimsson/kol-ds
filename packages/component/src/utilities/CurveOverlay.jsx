import { useId } from 'react'

/* ------------------------------------------------------------------ *
 * Curve math — ported from the brand app's curveMath so the primitive
 * has no app import. Curves return a blend in [0..1] for a position
 * `t` in [0..1]. `blend` is the amount knob — for 'flat' it IS the
 * value; for other presets it biases the curve up/down (0.5 = pure
 * curve); for 'custom' it biases the bezier. Consumers with their own
 * math bypass all of this via the `easing` prop.
 * ------------------------------------------------------------------ */

const TAU = Math.PI * 2
const clamp = (v, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v)

/* CSS-style cubic-bezier easing: bisect for the parameter s where the
 * bezier's x(s) ≈ t, then return y(s). 30 iterations = sub-pixel. */
function cubicBezier(x1, y1, x2, y2, t) {
  if (t <= 0) return 0
  if (t >= 1) return 1
  let lo = 0, hi = 1
  for (let i = 0; i < 30; i++) {
    const s = (lo + hi) / 2
    const oneMs = 1 - s
    const x = 3 * oneMs * oneMs * s * x1 + 3 * oneMs * s * s * x2 + s * s * s
    if (x < t) lo = s
    else       hi = s
  }
  const s = (lo + hi) / 2
  const oneMs = 1 - s
  return 3 * oneMs * oneMs * s * y1 + 3 * oneMs * s * s * y2 + s * s * s
}

function curveBlend(t, curve, blend, cp1, cp2) {
  const bias = (blend - 0.5) * 2
  switch (curve) {
    case 'linear':   return clamp(t + bias)
    case 'reverse':  return clamp((1 - t) + bias)
    case 'ease':     return clamp((t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)) + bias)
    case 'expo-in':  return clamp(Math.pow(t, 3) + bias)
    case 'expo-out': return clamp(1 - Math.pow(1 - t, 3) + bias)
    case 'log':      return clamp(Math.log(1 + t * 9) / Math.log(10) + bias)
    case 'sine':     return 0.5 + 0.5 * Math.sin((t + blend) * TAU)
    case 'custom':   return clamp(cubicBezier(cp1.x, cp1.y, cp2.x, cp2.y, t) + bias)
    case 'flat':
    default:         return blend
  }
}

const SAMPLES = 48
/* Retokened from the app's `--ui-warning` accent yellow: the overlay
 * stroke is the theme's editor-accent role, not a warning state. */
const STROKE = 'var(--kol-accent-primary)'

function sampleCurve(width, height, curve, blend, cp1, cp2, easing) {
  const pts = []
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / (SAMPLES - 1)
    const v = clamp(easing ? easing(t) : curveBlend(t, curve, blend, cp1, cp2))
    pts.push({ x: t * width, y: (1 - v) * height })
  }
  return pts
}

/* Draggable control-point dot. The SVG root is pointer-events:none;
 * only these opt back in, so a parent drag system hit-tests them via
 * their stable data-role. Outline is `--kol-surface-primary` (was
 * literal white) so the contrast ring holds in both themes. */
function Handle({ cx, cy, role }) {
  return (
    <circle
      data-role={role}
      cx={cx}
      cy={cy}
      r="6"
      fill={STROKE}
      stroke="var(--kol-surface-primary)"
      strokeWidth="1.5"
      style={{ cursor: 'grab', pointerEvents: 'auto' }}
    />
  )
}

/**
 * CurveOverlay — SVG easing/curve visualizer laid absolutely over a frame:
 * a dashed accent curve with endpoint dots, and — in `curve="custom"`
 * mode — a two-handle cubic-bezier editor (Figma/After-Effects style)
 * with tangent lines back to the anchored endpoints.
 *
 * Store-free and render-only: the root is pointer-events-none; only the
 * two handles accept pointers, carrying data-role="curve-cp1"/"curve-cp2"
 * so a PARENT drag system picks them up, maps pointer → normalized cp and
 * passes it back down. Coordinates: x = t·width; y is inverted
 * (y = (1-v)·height) so value 0 sits at the bottom, 1 at the top —
 * endpoints are anchored at (0, height) and (width, 0). The svg gets a
 * useId-derived id so per-instance [data-role] queries can be scoped
 * (`#id [data-role=…]` — CSS.escape the id, useId contains colons).
 *
 * Built-in presets are ported curve math ('flat' | 'linear' | 'reverse' |
 * 'ease' | 'expo-in' | 'expo-out' | 'log' | 'sine'); pass `easing` to make
 * the primitive math-agnostic instead.
 *
 * @param {number}   width   frame width in px — viewBox width, x-scale
 * @param {number}   height  frame height in px — viewBox height, y-scale
 * @param {string}   curve   'custom' → bezier path + handles; else preset name
 * @param {number}   blend   0..1 curve amount for presets (0.5 = pure curve)
 * @param {Object}   cp1     {x,y} normalized 0..1 first control point (custom)
 * @param {Object}   cp2     {x,y} normalized 0..1 second control point (custom)
 * @param {Function} easing  (t)=>v sampler overriding the built-in presets
 */
export default function CurveOverlay({
  width,
  height,
  curve = 'linear',
  blend = 0.5,
  cp1,
  cp2,
  easing,
}) {
  const id = useId()
  const isCustom = curve === 'custom'

  /* Endpoints stay anchored; only the two control points slide. */
  const cp1Px = isCustom ? { x: cp1.x * width, y: (1 - cp1.y) * height } : null
  const cp2Px = isCustom ? { x: cp2.x * width, y: (1 - cp2.y) * height } : null

  const pts = isCustom ? null : sampleCurve(width, height, curve, blend, cp1, cp2, easing)
  const polylinePoints = pts
    ? pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
    : null

  /* Custom curve: a true cubic path instead of a sampled polyline. */
  const cubicPath = isCustom
    ? `M0 ${height.toFixed(1)} C ${cp1Px.x.toFixed(1)} ${cp1Px.y.toFixed(1)}, ${cp2Px.x.toFixed(1)} ${cp2Px.y.toFixed(1)}, ${width.toFixed(1)} 0`
    : null

  return (
    <svg
      id={id}
      aria-hidden
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute left-0 top-0 overflow-visible pointer-events-none"
      style={{ zIndex: 3 }}
    >
      {isCustom ? (
        <>
          <path
            d={cubicPath}
            fill="none"
            stroke={STROKE}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.85"
          />
          {/* Tangent lines from endpoints to control points. */}
          <line x1="0" y1={height} x2={cp1Px.x} y2={cp1Px.y} stroke={STROKE} strokeWidth="1" opacity="0.45" />
          <line x1={width} y1="0" x2={cp2Px.x} y2={cp2Px.y} stroke={STROKE} strokeWidth="1" opacity="0.45" />
          <circle cx="0" cy={height} r="3" fill={STROKE} opacity="0.85" />
          <circle cx={width} cy="0" r="3" fill={STROKE} opacity="0.85" />
          <Handle cx={cp1Px.x} cy={cp1Px.y} role="curve-cp1" />
          <Handle cx={cp2Px.x} cy={cp2Px.y} role="curve-cp2" />
        </>
      ) : (
        <>
          <polyline
            points={polylinePoints}
            fill="none"
            stroke={STROKE}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.85"
          />
          <circle cx={pts[0].x} cy={pts[0].y} r="3" fill={STROKE} opacity="0.85" />
          <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={STROKE} opacity="0.85" />
        </>
      )}
    </svg>
  )
}
