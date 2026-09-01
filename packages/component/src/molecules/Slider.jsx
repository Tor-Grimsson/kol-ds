import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Input from '../atoms/Input.jsx'

/**
 * Slider — range slider with label and a value readout. The LINEAR VARIANT of
 * RotaryDial (atoms/RotaryDial.jsx): both implement the shared value-control
 * contract — `value` / `min` / `max` / `step` / `onChange(next: number)` /
 * `label` / `size` / `disabled` / `formatValue` / `defaultValue`.
 * Controlled; onChange always fires with the plain number.
 *
 * One bare inline row: label · track · readout. (Bordered `default` and chip
 * `subtle` variants retired 2026-07-08 — minimal is the only single slider.)
 *
 * Track color is `--kol-slider-track`. Set it per-instance via
 * `style={{ '--kol-slider-track': '…' }}` on this component, or from ANY
 * ancestor — `.slider-black` reads it as a fallback rather than declaring it,
 * so it inherits (SliderTrackVariableNotForwarded, kol-mirror 2026-08-30: both
 * routes were documented and neither was wired, so consumers were reaching into
 * `.slider-black` by specificity from their own stylesheets).
 * `--kol-slider-playhead` works the same way on the dual rail.
 *
 * DUAL + PLAYHEAD (SliderDualThumbAndPlayhead, kol-mirror 2026-08-30):
 * `variant="dual"` stacks two native ranges on one rail for an in/out pair,
 * with an optional draggable playhead. Built because mirror was maintaining a
 * verbatim copy of this component's CSS at 10 call sites to get it — 8 of which
 * needed nothing else. The clamp lives HERE, not in the consumer: an in-thumb
 * that can cross its out-thumb is a bug every caller would re-fix.
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
 * @param {Object} props.style - forwarded to the wrapper; the seam for `--kol-slider-track` / `--kol-slider-playhead`
 * @param {number} props.defaultValue - alt-click the control resets to this (falls back to `min`). Same contract on RotaryDial
 * @param {'input'|'value'|'none'} props.readout - `input` (default) an editable Input · `value` a plain right-aligned span, RotaryDial's own display-only readout · `none`
 * @param {'minimal'|'dual'} props.variant - `dual` = two thumbs on one rail
 * @param {number} props.value2 - dual only — the out value
 * @param {Function} props.onChange2 - dual only — (next: number) => void for the out thumb
 * @param {string} props.label1 - dual only — replaces the formatted in value above the rail
 * @param {string} props.label2 - dual only — replaces the formatted out value
 * @param {number|null} props.playhead - dual only — marker position in min…max; null renders nothing and attaches no listeners
 * @param {Function} props.onPlayheadChange - dual only — (next: number) => void; omit and the marker is not draggable and the rail does not seek
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
  defaultValue,
  readout = 'input',
  variant = 'minimal',
  value2,
  onChange2,
  label1,
  label2,
  playhead = null,
  onPlayheadChange,
  style,
}) => {
  /* Label ↔ input pairing — the <label> is a sibling of the range input, so
   * without an htmlFor/id pair the visible label confers no accessible name. */
  const sliderId = useId()

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

  const fmt = useCallback(
    (v) => {
      if (formatValue) return String(formatValue(v))
      if (decimals && decimals > 0) return Number(v).toFixed(decimals)
      return String(Math.round(v))
    },
    [decimals, formatValue],
  )

  const displayValue = useMemo(() => fmt(value), [fmt, value])

  /* Editable readout — local string state lets the user type intermediate
   * values (e.g. "-" while entering a negative) without clamping mid-keystroke.
   * Commits on blur / Enter; reverts to current value on Escape. */
  const [draft, setDraft]     = useState(displayValue)
  const [editing, setEditing] = useState(false)
  useEffect(() => { if (!editing) setDraft(displayValue) }, [displayValue, editing])

  /* EVERY hook runs before the dual branch returns. The prior art in kol-mirror
   * called useMemo *after* its early return, so hook order changed with the
   * variant — it survived only because no call site switched variant at
   * runtime. Not carried. */
  const trackRef = useRef(null)

  const seekTo = useCallback(
    (clientX) => {
      const el = trackRef.current
      if (!onPlayheadChange || !el) return
      const rect = el.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      onPlayheadChange(min + ratio * (max - min))
    },
    [min, max, onPlayheadChange],
  )

  const handlePlayheadDrag = useCallback(
    (e) => {
      if (!onPlayheadChange) return
      e.preventDefault()
      seekTo(e.clientX)
      const onMove = (me) => seekTo(me.clientX)
      const onUp = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [onPlayheadChange, seekTo],
  )

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

  /* alt-click anywhere on the control resets — RotaryDial carries the same
   * gesture, so a reset that worked on the knob and not the fader would be the
   * shared value-control contract splitting again. */
  const onAltReset = (e) => {
    if (!e.altKey || !onChange || disabled) return
    e.preventDefault()
    onChange(defaultValue ?? min)
  }

  if (variant === 'dual') {
    const v1 = value ?? min
    const v2 = value2 ?? max
    const showLabels = label1 != null || label2 != null
    const ratio = max > min ? (playhead - min) / (max - min) : 0
    return (
      <div className={`control-slider gap-3 shadow-none ${className}`} style={style}>
        {label && (
          <label
            className={`kol-helper-12 whitespace-nowrap shrink-0 w-fit ${disabled ? 'opacity-50' : ''}`}
            style={fontSize ? { fontSize } : undefined}
          >
            {label}
          </label>
        )}
        <div className="flex-1">
          {showLabels && (
            <div
              className="kol-helper-12 text-fg-32 flex items-center justify-between"
              style={{ marginBottom: '-2px' }}
            >
              <span>{label1 ?? fmt(v1)}</span>
              <span>{label2 ?? fmt(v2)}</span>
            </div>
          )}
          <div
            ref={trackRef}
            className="kol-slider-dual"
            style={onPlayheadChange ? { cursor: 'pointer' } : undefined}
            /* the whole rail seeks, not just the marker — hunting a 3px target
             * to scrub is the thing that makes a playhead feel broken */
            onPointerDown={(e) => { if (e.target === e.currentTarget) seekTo(e.clientX) }}
          >
            <div className="kol-slider-dual-rail" />
            {playhead != null && max > min && (
              <div
                className="kol-slider-dual-playhead"
                /* half a thumb in from each end, so the marker lines up with
                 * where a thumb CENTRE can actually reach */
                style={{ left: `calc(6px + (100% - 12px) * ${ratio})` }}
                onPointerDown={handlePlayheadDrag}
              />
            )}
            <input
              type="range"
              min={min} max={max} step={step} value={v1}
              disabled={disabled}
              aria-label={label1 ?? 'In'}
              onChange={(e) => onChange?.(Math.min(Number(e.target.value), v2))}
              className="kol-slider-range kol-slider-range--in"
              style={{ zIndex: 1 }}
            />
            <input
              type="range"
              min={min} max={max} step={step} value={v2}
              disabled={disabled}
              aria-label={label2 ?? 'Out'}
              onChange={(e) => onChange2?.(Math.max(Number(e.target.value), v1))}
              className="kol-slider-range kol-slider-range--out"
              style={{ zIndex: 2 }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`control-slider gap-3 shadow-none ${className}`} style={style} onClick={onAltReset}>
      {label && (
        <label
          htmlFor={sliderId}
          className={`kol-helper-12 whitespace-nowrap shrink-0 w-fit ${disabled ? 'opacity-50' : ''}`}
          style={fontSize ? { fontSize } : undefined}
        >
          {label}
        </label>
      )}
      <input
        id={sliderId}
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
      {readout === 'input' && (
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
      )}
      {/* `value` is RotaryDial's readout, not a second design — a mixer running
       * ~23 faders in a 24px row cannot afford an input chip on every one, and
       * that is why the easy call sites could not move. */}
      {readout === 'value' && (
        <span
          className={`kol-helper-12 shrink-0 w-fit text-right ${disabled ? 'opacity-50' : ''}`}
          style={fontSize ? { fontSize } : undefined}
        >
          {displayValue}
        </span>
      )}
    </div>
  )
}

export default Slider
