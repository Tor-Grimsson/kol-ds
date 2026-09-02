import { useCallback, useState } from 'react'
import ParamSheet from './ParamSheet.jsx'
import { armLongPress } from './armLongPress.js'

const SIZES = { sm: 24, md: 32, lg: 40, xl: 64 }

/**
 * Knob — SVG rotary knob with drag-to-change (kol-monitor's rack, lifted
 * 2026-09-01). 270° sweep; drag ns, 200px of travel = the range; ⌥-click resets
 * to `defaultValue`; on touch a 500ms hold opens `ParamSheet` instead of the drag.
 *
 * @param {number}   value · onChange `(value) => void`
 * @param {number}   min · max        default 0–100, or −100–100 when `bipolar`
 * @param {string}   label            `kol-helper-8`, uppercase
 * @param {'column'|'row'|'row-left'|'row-right'} variant  label placement (default column)
 * @param {boolean}  bipolar          −/+ legend and a centred default
 * @param {number}   labelMinWidth    row-right only
 * @param {'sm'|'md'|'lg'|'xl'} size  24 · 32 · 40 · 64 (default sm)
 * @param {number}   defaultValue     ⌥-click / sheet reset target (default 50, or 0 bipolar)
 */
export default function Knob({ value, onChange, min, max, label, variant = 'column', bipolar = false, labelMinWidth, size: sizeProp = 'sm', defaultValue }) {
  const size = SIZES[sizeProp] || SIZES.sm
  const effMin = min ?? (bipolar ? -100 : 0)
  const effMax = max ?? 100
  const effDefault = defaultValue ?? (bipolar ? 0 : 50)
  const angle = ((value - effMin) / (effMax - effMin)) * 270 - 135
  const r = size / 2
  const ir = r * 0.56
  const [sheet, setSheet] = useState(false)

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
    // Touch: hold still 500ms → the big sheet instead of the drag
    const hold = armLongPress(e, () => { handleUp(); setSheet(true) })
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }, [value, effMin, effMax, effDefault, onChange])

  const sheetEl = sheet && (
    <ParamSheet label={label} value={value} min={effMin} max={effMax} defaultValue={effDefault} onChange={onChange} onClose={() => setSheet(false)} />
  )

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
        {sheetEl}
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
        {sheetEl}
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
      {sheetEl}
    </div>
  )
}
