import { useState, useRef, useEffect } from 'react'

const SIZES = { sm: 8, md: 12 }
const LONG_PRESS_MS = 500
const BLINK_MS_DEFAULT = 500

/**
 * Toggle — the LED-dot on/off button with a label (kol-monitor's rack, lifted
 * 2026-09-01). `momentary` fires `onChange(true)` and the dot flashes 120ms;
 * `onLongPress` (hold ≥500ms) fires instead of `onChange`; `blink` pulses the
 * dot as an indicator; `forceLit` holds it on.
 *
 * @param {boolean}  value · onChange `(next) => void`
 * @param {string}   label
 * @param {boolean}  horizontal   label beside the dot instead of below
 * @param {'sm'|'md'} size        8 · 12 (default md)
 * @param {number}   padding      hit padding (default 4)
 * @param {boolean}  momentary
 * @param {string}   color        CSS colour (default `var(--kol-ctl-led-red)`)
 * @param {Function} onLongPress
 * @param {boolean}  blink · {number} blinkPeriodMs (500)
 * @param {boolean}  forceLit
 */
export default function Toggle({ value, onChange, label, horizontal = false, size = 'md', padding = 4, momentary = false, color = 'var(--kol-ctl-led-red)', onLongPress, blink = false, blinkPeriodMs = BLINK_MS_DEFAULT, forceLit = false }) {
  const [lit, setLit] = useState(false)
  const [blinkOn, setBlinkOn] = useState(true)
  const timerRef = useRef(null)
  const longPressTimerRef = useRef(null)
  const longPressFiredRef = useRef(false)
  const s = SIZES[size]
  const isOn = momentary ? lit : value

  useEffect(() => {
    if (!blink) return
    const halfPeriod = Math.max(20, blinkPeriodMs / 2)
    const id = setInterval(() => setBlinkOn(b => !b), halfPeriod)
    return () => clearInterval(id)
  }, [blink, blinkPeriodMs])

  const fireClick = () => {
    if (momentary) {
      onChange(true)
      setLit(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setLit(false), 120)
    } else {
      onChange(!value)
    }
  }

  const handlePointerDown = () => {
    if (!onLongPress) return
    longPressFiredRef.current = false
    longPressTimerRef.current = setTimeout(() => {
      longPressFiredRef.current = true
      onLongPress()
    }, LONG_PRESS_MS)
  }

  const handlePointerUp = () => {
    if (!onLongPress) return
    clearTimeout(longPressTimerRef.current)
  }

  const handleClick = () => {
    if (onLongPress && longPressFiredRef.current) return
    fireClick()
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
      className={`inline-flex ${horizontal ? 'flex-row' : 'flex-col'} items-center gap-1 select-none`}
      style={{ cursor: 'pointer', touchAction: 'none', padding }}
    >
      <div style={{
        width: s,
        height: s,
        borderRadius: '50%',
        backgroundColor: color,
        opacity: blink ? (blinkOn ? 1 : 0.3) : (isOn || forceLit ? 1 : 0.3),
        border: 'none',
        transition: 'opacity 0.1s, background-color 0.15s',
      }} />
      {label && (
        <span className="kol-helper-8 text-fg-32" style={{ textTransform: 'uppercase', lineHeight: 1 }}>
          {label}
        </span>
      )}
    </div>
  )
}
