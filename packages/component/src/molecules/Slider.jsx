import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Input from '../atoms/Input.jsx'
import SliderPanel from './SliderPanel.jsx'

/**
 * Slider — range slider with label and a value readout. The LINEAR VARIANT of
 * Knob (molecules/Knob.jsx): both implement the shared value-control
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
 * @param {number} props.size - Track length in px (mirrors Knob's dial px size); unset = fluid flex-1 track
 * @param {boolean} props.disabled - Disables track + readout and dims the control (default: false)
 * @param {Function} props.formatValue - Optional formatter for displayed value; Knob's default readout is `${value}%`
 * @param {string} props.className - Additional wrapper classes
 * @param {number} props.displayWidth - Width of the value readout, in characters (default: 6)
 * @param {string} props.fontSize - Font size for label/value (e.g., '11px')
 * @param {Object} props.style - forwarded to the wrapper; the seam for `--kol-slider-track` / `--kol-slider-playhead`
 * @param {number} props.defaultValue - alt-click the control resets to this (falls back to `min`). Same contract on Knob
 * @param {'input'|'value'|'none'} props.readout - `input` (default) an editable Input · `value` a plain right-aligned span, Knob's own display-only readout · `none`
 * @param {'minimal'|'dual'|'scrub'|'panel'} props.variant - `dual` = two thumbs on one rail · `scrub` = a media scrubber: the thin track with the 4 × 28 pill knob (`.kol-playback-scrub`; `PlaybackBar`'s, 2026-10-02) · `panel` = the rack slider (was kol-hardware `Fader`, merged 2026-10-01): a drawn 2px track for a hardware panel; takes `value · onChange · min · max · step · label` plus `onHold`
 * @param {'horizontal'|'vertical'} props.direction - `vertical` stands the track upright at `height`, label above and readout below (2026-10-02 — the volume ranges were hand-drawn for want of it). On `panel`, horizontal takes the row and shows a readout
 * @param {number} props.height - vertical only — the track's length in px (default 96; panel 60)
 * @param {string} props['aria-label'] - names the range when there is no visible `label`
 * @param {Function} props.onHold - panel only — touch hold, 500ms: `({ label, value, min, max, step }) => void`; the holder opens its sheet
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
  direction,
  height,
  onHold,
  'aria-label': ariaLabel,
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

  /* alt-click anywhere on the control resets — Knob carries the same
   * gesture, so a reset that worked on the knob and not the fader would be the
   * shared value-control contract splitting again. */
  const onAltReset = (e) => {
    if (!e.altKey || !onChange || disabled) return
    e.preventDefault()
    onChange(defaultValue ?? min)
  }

  if (variant === 'panel') {
    return <SliderPanel value={value} onChange={onChange} min={min} max={max} step={step} label={label} direction={direction} height={height} onHold={onHold} />
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

  const vertical = direction === 'vertical'
  const scrub = variant === 'scrub'
  const length = vertical ? height ?? 96 : size

  const labelNode = label && (
    <label
      htmlFor={sliderId}
      className={`kol-helper-12 whitespace-nowrap shrink-0 w-fit ${disabled ? 'opacity-50' : ''}`}
      style={fontSize ? { fontSize } : undefined}
    >
      {label}
    </label>
  )

  const range = (
    <input
      id={sliderId}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${scrub ? 'kol-playback-scrub' : 'slider-black cursor-pointer disabled:cursor-default'} disabled:opacity-50 ${vertical ? '-rotate-90 flex-none' : length ? 'flex-none' : 'flex-1 w-full min-w-0'}`}
      /* upright, the drag is vertical — so the page's pan is the horizontal one */
      style={length ? { width: length, ...(vertical && { touchAction: 'pan-x' }) } : undefined}
    />
  )

  const readoutNode = readout === 'input' ? (
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
  ) : readout === 'value' ? (
    /* `value` is Knob's readout, not a second design — a mixer running
     * ~23 faders in a 24px row cannot afford an input chip on every one, and
     * that is why the easy call sites could not move. */
    <span
      className={`kol-helper-12 shrink-0 w-fit text-right ${disabled ? 'opacity-50' : ''}`}
      style={fontSize ? { fontSize } : undefined}
    >
      {displayValue}
    </span>
  ) : null

  if (vertical) {
    return (
      <div className={`inline-flex flex-col items-center gap-2 ${className}`} style={style} onClick={onAltReset}>
        {labelNode}
        {/* a native range turned upright: the box is the track's length tall, the input that long */}
        <div className="w-6 flex items-center justify-center" style={{ height: length }}>{range}</div>
        {readoutNode}
      </div>
    )
  }

  return (
    <div className={`control-slider gap-3 shadow-none ${scrub ? 'h-7' : ''} ${className}`} style={style} onClick={onAltReset}>
      {labelNode}
      {range}
      {readoutNode}
    </div>
  )
}

export default Slider
