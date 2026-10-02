import { useCallback } from 'react'
import { armLongPress } from '../utilities/armLongPress.js'

const NO_HOLD = { move() {}, cancel() {} }

const SIZES = { sm: 24, md: 32, lg: 40, xl: 64 }

/**
 * RotaryDialPanel — RotaryDial's `variant="panel"`: the rack knob. A cap and a pointer line in the
 * hardware cap colors, sized 24 · 32 · 40 · 64 by name, with the four label placements and the
 * bipolar legend. It was kol-hardware's `Knob` (kol-monitor's rack, lifted 2026-09-01) and is
 * carried here class for class — merged into RotaryDial 2026-10-01 (user ruling). Not exported:
 * reach it through `<RotaryDial variant="panel">`.
 */
export default function RotaryDialPanel({ value, onChange, min, max, label, variant = 'column', bipolar = false, labelMinWidth, size: sizeProp = 'sm', defaultValue, onHold }) {
  const size = SIZES[sizeProp] || SIZES.sm
  const effMin = min ?? (bipolar ? -100 : 0)
  const effMax = max ?? 100
  const effDefault = defaultValue ?? (bipolar ? 0 : 50)
  const angle = ((value - effMin) / (effMax - effMin)) * 270 - 135
  const r = size / 2
  const ir = r * 0.56

  const handlePointerDown = useCallback((e) => {
    e.preventDefault()
    // Alt/Option + click resets to default instead of starting a drag
    if (e.altKey) {
      onChange(effDefault)
      return
    }
    const startY = e.clientY
    const startVal = value
    const range = effMax - effMin

    const id = e.pointerId
    const handleMove = (e) => {
      if (e.pointerId !== id) return  // a second finger is a pan, not this knob
      hold.move(e)
      const delta = (startY - e.clientY) * (range / 200)
      const next = Math.round(Math.max(effMin, Math.min(effMax, startVal + delta)))
      onChange(next)
    }
    const handleUp = () => {
      hold.cancel()
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
    // Touch: hold still 500ms → the holder's sheet instead of the drag
    const hold = onHold ? armLongPress(e, () => { handleUp(); onHold({ label, value, min: effMin, max: effMax, defaultValue: effDefault }) }) : NO_HOLD
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }, [value, effMin, effMax, effDefault, onChange, onHold, label])

  const knobSvg = (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r * 0.75} style={{ fill: 'var(--kol-ctl-hw-cap)', stroke: 'var(--kol-fg-24)' }} strokeWidth="1" />
      <line
        x1={r} y1={r}
        x2={r + ir * Math.cos((angle - 90) * Math.PI / 180)}
        y2={r + ir * Math.sin((angle - 90) * Math.PI / 180)}
        style={{ stroke: 'var(--kol-ctl-hw-on-cap)' }} strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  )

  if (variant === 'row-left' || variant === 'row') {
    return (
      <div
        onPointerDown={handlePointerDown}
        style={{ cursor: 'ns-resize', touchAction: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
      >
        {label && (
          <span className="kol-helper-8 text-fg-32" style={{ textTransform: 'uppercase', lineHeight: 1 }}>
            {label}
          </span>
        )}
        {knobSvg}
      </div>
    )
  }

  if (variant === 'row-right') {
    return (
      <div
        onPointerDown={handlePointerDown}
        style={{ cursor: 'ns-resize', touchAction: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
      >
        {knobSvg}
        {label && (
          <span className="kol-helper-8 text-fg-32" style={{ textTransform: 'uppercase', lineHeight: 1, minWidth: labelMinWidth }}>
            {label}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{ cursor: 'ns-resize', touchAction: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
    >
      {bipolar && (
        <span className="kol-helper-8 text-fg-32" style={{ lineHeight: 1 }}>
          -/+
        </span>
      )}
      {knobSvg}
      {label && (
        <span className="kol-helper-8 text-fg-32" style={{ textTransform: 'uppercase', lineHeight: 1 }}>
          {label}
        </span>
      )}
    </div>
  )
}
