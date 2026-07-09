import { useEffect, useRef, useState } from 'react'

/** Clamp to min–max, snapped to the nearest step from min. */
const snapTo = (v, min, max, step) => {
  const stepped = min + Math.round((v - min) / step) * step
  return Math.max(min, Math.min(max, stepped))
}

/**
 * RotaryDial — drag-to-set rotary knob numeric input. The KNOB VARIANT of
 * Slider (molecules/Slider.jsx): both implement the shared value-control
 * contract — `value` / `min` / `max` / `step` / `onChange(next: number)` /
 * `label` / `size` / `disabled` / `formatValue`. Controlled; onChange always
 * fires with the plain number.
 *
 * Vertical pointer drag rotates the whole dial over a 270° sweep (−135° to
 * +135°) mapped onto min–max; a full sweep is ~200px of drag, movement
 * measured absolute from drag start. A local visual buffer keeps rotation
 * smooth while parent updates are RAF-throttled; the final value fires on
 * release. Focus + arrow keys step the value (role="slider" with
 * aria-valuemin/max/now). The label and readout rows render only when
 * `label` is set; label text renders as authored.
 *
 * @param {string}   label       text under the dial; also gates the label + readout rows
 * @param {number}   value       controlled value within min–max
 * @param {Function} onChange    (next: number) => void — RAF-throttled while dragging, final on release
 * @param {number}   min         minimum value (default 0)
 * @param {number}   max         maximum value (default 100)
 * @param {number}   step        drag snap / arrow-key increment (default 1)
 * @param {number}   size        dial px size (default 80); derives ring + disc radii
 * @param {boolean}  disabled    blocks drag + keyboard and dims the control (default false)
 * @param {Function} formatValue optional readout formatter (value: number) => string; default `${value}%`
 */
export default function RotaryDial({
  label,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 80,
  disabled = false,
  formatValue,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [localValue, setLocalValue] = useState(value) // visual buffer — updates every move
  const dragRef = useRef({ startY: 0, startValue: 0 })
  const rafRef = useRef(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // External updates land whenever a drag isn't in progress
  useEffect(() => {
    if (!isDragging) setLocalValue(value)
  }, [value, isDragging])

  useEffect(() => {
    if (!isDragging) return
    let current = dragRef.current.startValue
    const handleMove = (e) => {
      // absolute delta from drag start; full min→max sweep ≈ 200px
      const deltaY = dragRef.current.startY - e.clientY
      current = snapTo(dragRef.current.startValue + deltaY * ((max - min) / 200), min, max, step)
      setLocalValue(current)
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          onChangeRef.current?.(current)
          rafRef.current = null
        })
      }
    }
    const handleUp = () => {
      setIsDragging(false)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      onChangeRef.current?.(current)
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [isDragging, min, max, step])

  const handlePointerDown = (e) => {
    setIsDragging(true)
    dragRef.current = { startY: e.clientY, startValue: localValue }
  }

  const handleKeyDown = (e) => {
    let next = null
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') next = snapTo(localValue + step, min, max, step)
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') next = snapTo(localValue - step, min, max, step)
    if (next === null) return
    e.preventDefault()
    setLocalValue(next)
    onChange?.(next)
  }

  const outerRadius = size / 2
  const innerRadius = (size * 0.7) / 2
  const strokeWidth = 2
  const angle = -135 + ((localValue - min) / (max - min || 1)) * 270

  return (
    <div className={`flex flex-col items-center gap-2 ${disabled ? 'opacity-50' : ''}`}>
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={localValue}
        aria-disabled={disabled || undefined}
        className={`relative select-none touch-none ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
        style={{
          width: size,
          height: size,
          transform: `rotate(${angle}deg)`,
          willChange: isDragging ? 'transform' : 'auto',
        }}
        onPointerDown={disabled ? undefined : handlePointerDown}
        onKeyDown={disabled ? undefined : handleKeyDown}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
          {/* outer dashed tick ring */}
          <circle
            cx={outerRadius}
            cy={outerRadius}
            r={outerRadius - strokeWidth}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray="4 4"
            className="text-fg-24"
          />
          {/* inner solid disc */}
          <circle cx={outerRadius} cy={outerRadius} r={innerRadius} fill="currentColor" className="text-fg-96" />
          {/* pointer notch — reads as a cut into the disc */}
          <line
            x1={outerRadius}
            y1={outerRadius}
            x2={outerRadius}
            y2={outerRadius - innerRadius + 4}
            stroke="var(--kol-surface-primary)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
      </div>
      {label && <div className="kol-helper-12 text-fg-64">{label}</div>}
      {label && (
        <div className="kol-helper-12 text-fg-96">
          {formatValue ? String(formatValue(value)) : `${value}%`}
        </div>
      )}
    </div>
  )
}
