/* The color pickers' surfaces in this style (KOL's HueStrip, SBSquare and the wheel's hue ring), and the conversions they
   need. Hue 0 to 360; saturation, value and lightness 0 to 100. */

export const hexToRgb = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex ?? ''))
  if (!m) return { r: 0, g: 0, b: 0 }
  const n = parseInt(m[1], 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
export const rgbToHex = ({ r, g, b }) => `#${[r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('')}`.toUpperCase()

export function hexToHsv(hex) {
  const { r, g, b } = hexToRgb(hex)
  const R = r / 255, G = g / 255, B = b / 255
  const max = Math.max(R, G, B), d = max - Math.min(R, G, B)
  let h = 0
  if (d) h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4
  return { h: ((h * 60) + 360) % 360, s: max ? (d / max) * 100 : 0, v: max * 100 }
}
export function hsvToHex({ h, s, v }) {
  const S = s / 100, V = v / 100
  const f = (n) => { const k = (n + h / 60) % 6; return V - V * S * Math.max(0, Math.min(k, 4 - k, 1)) }
  return rgbToHex({ r: f(5) * 255, g: f(3) * 255, b: f(1) * 255 })
}
export function hexToHsl(hex) {
  const { h, s: sv, v } = hexToHsv(hex)
  const V = v / 100, S = sv / 100, l = V * (1 - S / 2)
  return { h, s: l === 0 || l === 1 ? 0 : ((V - l) / Math.min(l, 1 - l)) * 100, l: l * 100 }
}
export function hslToHex({ h, s, l }) {
  const L = l / 100, S = s / 100, v = L + S * Math.min(L, 1 - L)
  return hsvToHex({ h, s: v ? 2 * (1 - L / v) * 100 : 0, v: v * 100 })
}

/* a drag over a box: (x, y) in 0..1 on every move */
function drag(e, onMove) {
  const el = e.currentTarget
  const at = (ev) => {
    const r = el.getBoundingClientRect()
    onMove(Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (ev.clientY - r.top) / r.height)), r)
  }
  el.setPointerCapture?.(e.pointerId)
  at(e)
  const move = (ev) => at(ev)
  const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up) }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerup', up)
}

const HANDLE = 'pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fg shadow-[0_0_0_1px_rgba(0,0,0,0.5)]'

export function HueStrip({ hue, onChange }) {
  return (
    <div
      role="slider" aria-label="Hue" aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(hue)} tabIndex={0}
      onPointerDown={(e) => drag(e, (x) => onChange(x * 360))}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') onChange(Math.min(360, hue + 1)); if (e.key === 'ArrowLeft') onChange(Math.max(0, hue - 1)) }}
      className="relative h-3 shrink-0 cursor-pointer touch-none rounded-full outline-none focus-visible:outline-1 focus-visible:outline-fg"
      style={{ background: 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)' }}
    >
      <span className={HANDLE} style={{ left: `${(hue / 360) * 100}%`, top: '50%' }} />
    </div>
  )
}

export function SBSquare({ hue, sat, val, onChange, className = '' }) {
  return (
    <div
      role="slider" aria-label="Saturation and brightness" aria-valuenow={Math.round(sat)} tabIndex={0}
      onPointerDown={(e) => drag(e, (x, y) => onChange(x * 100, (1 - y) * 100))}
      className={`relative cursor-crosshair touch-none rounded-inner outline-none focus-visible:outline-1 focus-visible:outline-fg ${className}`}
      style={{ background: `linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(${hue} 100% 50%))` }}
    >
      <span className={HANDLE} style={{ left: `${sat}%`, top: `${100 - val}%` }} />
    </div>
  )
}

/* the wheel: the hue as a ring around the saturation and brightness square */
export function HueRing({ hue, sat, val, onChangeHue, onChangeSV }) {
  const onRing = (e) => {
    if (e.target !== e.currentTarget) return
    drag(e, (x, y) => onChangeHue(((Math.atan2(y - 0.5, x - 0.5) * 180) / Math.PI + 450) % 360))
  }
  const a = ((hue - 90) * Math.PI) / 180
  return (
    <div
      role="slider" aria-label="Hue" aria-valuenow={Math.round(hue)} tabIndex={0}
      onPointerDown={onRing}
      className="relative mx-auto aspect-square w-full max-w-[200px] cursor-pointer touch-none rounded-full outline-none"
      style={{ background: 'conic-gradient(#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)' }}
    >
      <div className="absolute inset-[14px] rounded-full bg-panel" />
      <span className={HANDLE} style={{ left: `${50 + Math.cos(a) * 46.5}%`, top: `${50 + Math.sin(a) * 46.5}%` }} />
      <SBSquare hue={hue} sat={sat} val={val} onChange={onChangeSV} className="!absolute inset-[24%]" />
    </div>
  )
}
