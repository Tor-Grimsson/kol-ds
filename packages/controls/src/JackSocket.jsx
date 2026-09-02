import { useRef, useEffect } from 'react'

/* Read a colour binding once, lazily — the roles live in kol-theme's
 * kol-components-controls.css. HEX is required here: the ring appends a hex
 * alpha (`${color}${aa}`), so these must resolve to hex on :root, never var(). */
const _hex = {}
function token(name) {
  if (!_hex[name]) _hex[name] = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return _hex[name]
}

/* Shared jack animation loop — single rAF, throttled to ~15fps, dirty-checked */
const jackCallbacks = new Set()
let jackRafId = null
let jackFrame = 0
function jackTick() {
  jackFrame++
  if (jackFrame % 4 === 0) {
    for (const cb of jackCallbacks) cb()
  }
  jackRafId = requestAnimationFrame(jackTick)
}
function startJackLoop() {
  if (jackRafId == null) jackRafId = requestAnimationFrame(jackTick)
}
function stopJackLoop() {
  if (jackRafId != null) { cancelAnimationFrame(jackRafId); jackRafId = null }
}

/**
 * JackSocket — the 3.5mm eurorack jack, PRESENTATIONAL (kol-monitor's rack,
 * lifted 2026-09-01): ring (well) + hole + label, and a rim that glows with the
 * signal — `signalRef.current` is `{ type: 'scalar'|'color'|'points', value, … }`,
 * read on a shared rAF at ~15fps, dirty-checked. Drag-to-patch, the registry and
 * the pending cable are the CONSUMER'S: they arrive as the props below and
 * `onPointerDown`. Colour role: `color` is a HEX (the glow appends a hex alpha);
 * default is the LED red; the consumer passes `--kol-ctl-signal-input` /
 * `--kol-ctl-cv-attenuate` for its primary / attenuate inputs.
 *
 * @param {'in'|'out'} type
 * @param {'sm'|'md'}  size         12 · 16 (default md)
 * @param {string}     label · {string} labelSize  (`kol-helper-${labelSize}`, default `xxs`)
 * @param {boolean}    active       a cable is connected here
 * @param {boolean}    pending      this output is the pending cable's source
 * @param {boolean}    dimPending   a cable is pending elsewhere (an input shows a dim ring)
 * @param {boolean}    cablesHidden the consumer hides cables — a connected hole fills solid
 * @param {string}     color        HEX role colour (default `--kol-ctl-led-red`)
 * @param {object}     signalRef    `{ current }` — the live signal for the glow
 * @param {boolean}    bg           the fg-04 plate behind the ring (default: outputs only)
 * @param {Function}   onPointerDown  the consumer's routing gesture
 * @param {string}     title
 * @param {object|Function} ringRef  the RING element (ControlsJackSeams, kol-monitor 2026-09-01) — the
 *                                consumer's drag-to-patch registers it for hit-testing (pointerup finds
 *                                the nearest input ring centre); a ref object or a callback
 */
export default function JackSocket({
  type = 'out',
  size = 'md',
  label,
  labelSize = 'xxs',
  active = false,
  pending = false,
  dimPending = false,
  cablesHidden = false,
  color,
  signalRef,
  bg,
  onPointerDown,
  title,
  ringRef: ringRefProp,
}) {
  const ringRef = useRef(null)
  /* one element, two refs: the glow loop's and the consumer's */
  const setRing = (el) => {
    ringRef.current = el
    if (typeof ringRefProp === 'function') ringRefProp(el)
    else if (ringRefProp) ringRefProp.current = el
  }
  const catColor = color || token('--kol-ctl-led-red')
  const isConnected = active

  // Animate ring glow proportional to signal value (shared rAF, ~15fps, dirty-checked)
  useEffect(() => {
    if (!signalRef || !ringRef.current) return
    let prevNorm = -1
    const cb = () => {
      const signal = signalRef.current
      let val = 0
      if (!signal) val = 0
      else if (signal.type === 'scalar') val = signal.value
      else if (signal.type === 'color') { const c = signal.value; val = Math.max(c.r, c.g, c.b) * 100 }
      else if (signal.type === 'points') val = signal.value?.length > 0 ? (signal.opacity ?? 1) * 100 : 0
      const norm = Math.min(1, val / 100)
      if (norm === prevNorm) return
      prevNorm = norm
      const ring = ringRef.current
      if (ring) {
        const alpha = Math.round(norm * 255).toString(16).padStart(2, '0')
        ring.style.borderColor = norm > 0.01 ? `${catColor}${alpha}` : 'var(--kol-fg-24)'
        ring.style.boxShadow = norm > 0.01 ? `0 0 ${2 + norm * 6}px ${catColor}${alpha}` : 'inset 0 1px 2px rgba(0,0,0,0.5)'
      }
    }
    jackCallbacks.add(cb)
    startJackLoop()
    return () => {
      jackCallbacks.delete(cb)
      if (jackCallbacks.size === 0) stopJackLoop()
    }
  }, [signalRef, catColor])

  const s = size === 'sm' ? 12 : 16
  const hole = size === 'sm' ? 4 : 6

  return (
    <div
      className="inline-flex flex-col items-center gap-0.5 select-none"
      style={{ cursor: type === 'out' ? 'grab' : (dimPending ? 'pointer' : 'default'), touchAction: 'none' }}
      onPointerDown={onPointerDown}
      title={title ?? label}
    >
      <div
        className={(bg ?? type === 'out') ? 'bg-fg-04' : ''}
        style={{ width: `${s + 4}px`, height: `${s + 4}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}
      >
        <div
          ref={setRing}
          style={{
            width: `${s}px`,
            height: `${s}px`,
            borderRadius: '50%',
            backgroundColor: 'var(--kol-ctl-hw-well)',
            border: `1.5px solid ${
              pending ? catColor
              : active ? catColor
              : dimPending && type === 'in' ? `${catColor}66`
              : 'var(--kol-fg-24)'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
            transition: 'border-color 0.1s',
          }}
        >
          <div style={{
            width: `${hole}px`,
            height: `${hole}px`,
            borderRadius: '50%',
            backgroundColor: cablesHidden && isConnected ? catColor : isConnected || pending ? `${catColor}66` : 'var(--kol-ctl-hw-well)',
            border: type === 'in' ? '1px solid var(--kol-ctl-hw-cap-edge)' : '0.5px solid var(--kol-ctl-hw-shade)',
          }} />
        </div>
      </div>
      {label && (
        <span className={`kol-helper-${labelSize} text-fg-32`} style={{ textTransform: 'uppercase', lineHeight: 1 }}>
          {label}
        </span>
      )}
    </div>
  )
}
