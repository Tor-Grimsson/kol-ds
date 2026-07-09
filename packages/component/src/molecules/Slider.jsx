import { useEffect, useMemo, useState } from 'react'
import Input from '../atoms/Input.jsx'

/**
 * Slider — range slider with label and an editable value readout. The LINEAR
 * VARIANT of RotaryDial (atoms/RotaryDial.jsx): both implement the shared
 * value-control contract — `value` / `min` / `max` / `step` /
 * `onChange(next: number)` / `label` / `size` / `disabled` / `formatValue`.
 * Controlled; onChange always fires with the plain number.
 *
 * One bare inline row: label · track · editable readout. (Bordered
 * `default` and chip `subtle` variants retired 2026-07-08 — minimal is
 * the only slider.)
 *
 * The value readout is an editable <Input> (type a value, commit on
 * blur / Enter, revert on Escape) — a Slider-only extra; RotaryDial's
 * readout is display-only (atoms nest no KOL component). Track color is
 * exposed as the `--kol-slider-track` CSS variable on `.slider-black`;
 * override per-instance via style={{ '--kol-slider-track': '...' }}.
 *
 * @param {Object} props
 * @param {string} props.label - Slider label text
 * @param {number} props.min - Minimum value (default: 0)
 * @param {number} props.max - Maximum value (default: 100)
 * @param {number} props.value - Controlled value within min–max
 * @param {Function} props.onChange - (next: number) => void change handler
 * @param {number} props.step - Slider step increment (default: 1)
 * @param {number} props.size - Track length in px (mirrors RotaryDial's dial px size); unset = fluid flex-1 track
 * @param {boolean} props.disabled - Disables track + readout and dims the control (default: false)
 * @param {Function} props.formatValue - Optional formatter for displayed value; RotaryDial's default readout is `${value}%`
 * @param {string} props.className - Additional wrapper classes
 * @param {number} props.displayWidth - Width of the value readout, in characters (default: 6)
 * @param {string} props.fontSize - Font size for label/value (e.g., '11px')
 */
const Slider = ({
  label,
  min = 0,
  max = 100,
  value = 0,
  onChange,
  step = 1,
  size,
  disabled = false,
  formatValue,
  className = '',
  displayWidth = 6,
  fontSize,
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(Number(e.target.value))
    }
  }

  const decimals = useMemo(() => {
    if (formatValue) return null
    if (!Number.isFinite(step)) return 0
    if (step >= 1) return 0
    const decimalPart = step.toString().split('.')[1]
    return decimalPart ? decimalPart.length : 2
  }, [formatValue, step])

  const displayValue = useMemo(() => {
    if (formatValue) return String(formatValue(value))
    if (decimals && decimals > 0) {
      return Number(value).toFixed(decimals)
    }
    return String(Math.round(value))
  }, [decimals, formatValue, value])

  /* Editable readout — local string state lets the user type intermediate
   * values (e.g. "-" while entering a negative) without clamping mid-keystroke.
   * Commits on blur / Enter; reverts to current value on Escape. */
  const [draft, setDraft]     = useState(displayValue)
  const [editing, setEditing] = useState(false)
  useEffect(() => { if (!editing) setDraft(displayValue) }, [displayValue, editing])

  const commit = () => {
    setEditing(false)
    const parsed = Number(draft)
    if (!Number.isFinite(parsed) || onChange == null) {
      setDraft(displayValue)
      return
    }
    const clamped = Math.max(min, Math.min(max, parsed))
    onChange(clamped)
    setDraft(String(clamped))
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter')  { e.currentTarget.blur() }
    if (e.key === 'Escape') { setDraft(displayValue); setEditing(false); e.currentTarget.blur() }
  }

  return (
    <div className={`control-slider gap-3 shadow-none ${className}`}>
      {label && (
        <label
          className={`kol-helper-12 whitespace-nowrap shrink-0 w-fit ${disabled ? 'opacity-50' : ''}`}
          style={fontSize ? { fontSize } : undefined}
        >
          {label}
        </label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`slider-black cursor-pointer disabled:cursor-default disabled:opacity-50 ${size ? 'flex-none' : 'flex-1 w-full'}`}
        style={size ? { width: size } : undefined}
      />
      <Input
        type="text"
        inputMode="decimal"
        variant="filled"
        size="sm"
        chars={displayWidth}
        value={draft}
        disabled={disabled}
        onFocus={(e) => { setEditing(true); e.target.select() }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        inputClassName="text-center"
      />
    </div>
  )
}

export default Slider
