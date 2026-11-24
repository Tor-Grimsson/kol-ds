import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Input, { selectOnFirstPress } from '../atoms/Input.jsx'
import SliderPanel from './SliderPanel.jsx'
import LabeledControl from './LabeledControl.jsx'

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
 * The minimal and float tracks read the shared track tokens (`--kol-track-h` · `-r` · `-bg` · `-run`, kol-theme
 * `.kol-track`, 2026-11-07) — ProgressBar draws the same track from them.
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
 * @param {'rail'} props.readoutPreset - the readout Input's `preset` (2026-10-25): `rail` takes the chip to 8 at the sides, a rail row's digits
 * @param {string} props.fontSize - Font size for label/value (e.g., '11px')
 * @param {Object} props.style - forwarded to the wrapper; the seam for `--kol-slider-track` / `--kol-slider-playhead`
 * @param {number} props.defaultValue - alt-click the control resets to this (falls back to `min`). Same contract on Knob
 * @param {'input'|'value'|'none'} props.readout - `input` (default) an editable Input · `value` a plain right-aligned span, Knob's own display-only readout · `none`. On `float` unset is `none`; `input` puts the value as an `Input variant="float"` pill at the track's right, sized in `ch` to the widest value (plan-2026-11-12-one-header W6.1 — the settings window's rows; typed values commit on Enter or blur, clamped, Escape reverts)
 * @param {'minimal'|'dual'|'scrub'|'panel'|'float'|'kolbox'} props.variant - `kolbox` (W31.2 batch 3): kolbox's track (2px oq-24, the run in the ink to the value, a 12 ink thumb) in a 24 row (`--kol-kolbox-ctl`); `readout` `value` (its default) the mono 12 value beside it, 40 wide, or `input` the track in an oq-16 field and the value in a text field 2 apart; no visible label (`aria-label` names it), `formatValue` defaults to the raw value · `dual` = two thumbs on one rail · `scrub` = a media scrubber: the thin track with the 4 × 28 pill knob (`.kol-playback-scrub`; `PlaybackBar`'s, 2026-10-02) · `panel` = the rack slider (was kol-hardware `Fader`, merged 2026-10-01): a drawn 2px track for a hardware panel; takes `value · onChange · min · max · step · label` plus `onHold` · `float` (float-everything W2 row 23, 2026-11-04; track only since 2026-11-12): the 3px capsule track at the float sm height — the run fg-64 to a 12 thumb (`.kol-slider-float`); a `label` is drawn by `LabeledControl variant="float"`, a `value` readout as its hint, `formatValue` its words (`65%`)
 * @param {'folio'} props.variant - also `folio` (Folio migration batch A, 2026-11-22): Folio's slider, a 24 row, the 2px track in the rule with the run in the accent to a 12 accent thumb, the value (JetBrains Mono 12 / 16, `formatValue` its words, raw by default) 32 wide at the right, 12 off; no visible label (`aria-label`). Chrome in kol-theme `.kol-slider--folio`
 * @param {number[]} props.stops - kolbox only: values marked on the track, a 2 mark each under the thumb's centre (a variable font's named weights)
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
/* `variant="kolbox"` (plan-2026-11-18-kolbox-system W31.2 batch 3, 2026-11-18): kolbox's Slider carried class for
 * class, its own component so its draft is its own state. `readout` value (its default): the bare track, the value
 * beside it, 12 apart; `input`: the track in its own field, then 2 apart the number in a field as wide as its value
 * and at least 48. The number is a text field, not type="number": Chrome draws a number field's value in the OS
 * region's format ("0,08" on an Icelandic Mac) whatever the page's lang. A draft holds what is typed until it reads
 * as a number; kolbox's field keys: one press selects it, the arrows step it (Shift ten steps), Escape restores the value
 * from before the edit. Chrome in kol-theme `.kol-slider--kolbox`. */
function SliderKolbox({ value, min, max, step, onChange, formatValue, readout = 'value', ariaLabel, stops, className = '' }) {
  const [draft, setDraft] = useState(null)
  const before = useRef(value)
  const format = formatValue ?? ((v) => v)
  const p = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  /* a stop: a 2 mark on the track, under the thumb's centre at that value (the thumb is 12, so its centre runs 6 to
     the width less 6) */
  const marks = stops?.length > 0 && stops.map((v) => (
    <span key={v} data-slider-stop={v} className="pointer-events-none absolute top-1/2 size-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-oq-64"
      style={{ left: `calc(6px + (100% - 12px) * ${(v - min) / (max - min)})` }} />
  ))
  const input = (
    <input
      type="range"
      className="kol-slider-input min-w-0 flex-1"
      style={{ '--p': `${p}%` }}
      aria-label={ariaLabel}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange?.(Number(e.target.value))}
    />
  )
  const range = marks ? <span className="relative flex min-w-0 flex-1 items-center">{input}{marks}</span> : input
  if (readout === 'input') {
    return (
      <div className={`kol-slider--kolbox flex h-(--kol-kolbox-ctl) min-w-0 items-center gap-0.5 ${className}`}>
        <div className="kol-slider-field flex h-(--kol-kolbox-ctl) min-w-0 flex-1 items-center px-2">{range}</div>
        <input
          type="text"
          inputMode="decimal"
          aria-label={ariaLabel}
          className="kol-slider-number field-sizing-content h-(--kol-kolbox-ctl) min-w-12 shrink-0 px-2 text-left outline-none focus-visible:outline-1 focus-visible:-outline-offset-1"
          value={draft ?? String(format(value))}
          onChange={(e) => {
            /* parseFloat: a formatted value keeps its unit while it is typed ("45°") */
            const s = e.target.value, n = parseFloat(s)
            setDraft(s)
            if (s.trim() !== '' && Number.isFinite(n)) onChange?.(n)
          }}
          onMouseDown={selectOnFirstPress}
          onFocus={() => { before.current = value }}
          onBlur={() => setDraft(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); return }
            /* Escape puts back the value from before the edit and leaves the field (kolbox's field, useKolboxField) */
            if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setDraft(null); if (before.current !== value) onChange?.(before.current); e.currentTarget.blur(); return }
            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
            e.preventDefault()
            const dec = String(step).split('.')[1]?.length ?? 0
            const by = (e.shiftKey ? 10 : 1) * (e.key === 'ArrowUp' ? step : -step)
            const n = Math.min(max, Math.max(min, value + by))
            setDraft(null)
            before.current = Number(n.toFixed(dec))
            onChange?.(before.current)
            const el = e.currentTarget
            requestAnimationFrame(() => { if (document.activeElement === el) el.select() })
          }}
        />
      </div>
    )
  }
  return (
    <div className={`kol-slider--kolbox flex h-(--kol-kolbox-ctl) min-w-0 items-center gap-3 ${className}`}>
      {range}
      <span className="kol-slider-value w-10 shrink-0 text-right">{format(value)}</span>
    </div>
  )
}

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
  readoutPreset,
  fontSize,
  defaultValue,
  readout,
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
  stops,
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
    /* parseFloat, so a formatted value typed back (`45°`, `0,5`) still reads; an empty field reverts */
    const parsed = parseFloat(String(draft).replace(',', '.'))
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

  if (variant === 'kolbox') {
    return <SliderKolbox value={value} min={min} max={max} step={step} onChange={onChange} formatValue={formatValue} readout={readout} ariaLabel={ariaLabel} stops={stops} className={className} />
  }

  /* folio (Folio migration batch A, 2026-11-22): Folio's Slider carried class for class (apps/folio Chrome.jsx): a 24
   * row, the native range (its track and thumb in kol-theme `.kol-slider--folio`), the value beside it, 32 wide */
  if (variant === 'folio') {
    const format = formatValue ?? ((n) => n)
    const run = `${((value - min) / (max - min)) * 100}%`
    return (
      <div className={`kol-slider--folio flex h-[24px] w-full items-center gap-[12px] ${className}`}>
        <input type="range" min={min} max={max} step={step} value={value} onChange={handleChange} aria-label={ariaLabel} style={{ '--run': run }}
          className="kol-slider-input h-[24px] min-w-0 flex-1 cursor-pointer appearance-none bg-transparent" />
        <span className="kol-slider-value w-[32px] shrink-0 text-right tabular-nums">{format(value)}</span>
      </div>
    )
  }

  if (variant === 'panel') {
    return <SliderPanel value={value} onChange={onChange} min={min} max={max} step={step} label={label} direction={direction} height={height} onHold={onHold} />
  }

  /* A NAMED SLIDER IS A LabeledControl (plan-2026-11-12-float-rails-figma W12.1, the law: every label beside a control
   * is one): the label slot carries the slider's own label look (kol-helper-12 at fg-80, hugging), the control slot the
   * `.control-slider` row (track and readout) exactly as it drew before. Unlabelled, the row is the whole slider. Called as functions, never as components: a component defined in render
   * remounts the range on every value and drops the drag. */
  const labelEl = label && (
    <label htmlFor={sliderId} style={fontSize ? { fontSize } : undefined}>{label}</label>
  )
  const labelClass = `kol-helper-12 text-fg-80 ${disabled ? 'opacity-50' : ''}`.trim()
  const row = ({ className: cls, style: st, onClick, children }) => {
    if (!label) return <div className={cls} style={st} onClick={onClick}>{children}</div>
    const outer = cls.split(/\s+/).filter((c) => !/^(control-slider|shadow-none|h-7)$/.test(c)).join(' ')
    return (
      <LabeledControl horizontal label={labelEl} labelWidth="fit-content" labelClass={labelClass}
        className={`${/(^|\s)(hidden|block|flex|inline-flex|grid)(?=\s|$)/.test(outer) ? '' : 'inline-flex'} ${outer}`} style={st} onClick={onClick}>
        <div className={`flex w-full ${cls.split(/\s+/).filter((c) => /^(control-slider|shadow-none|h-7|gap-3)$/.test(c)).join(' ')}`}>{children}</div>
      </LabeledControl>
    )
  }
  const column = ({ className: cls, style: st, onClick, children }) => (label
    ? <LabeledControl label={labelEl} labelClass={labelClass} className={cls} style={st} onClick={onClick}>{children}</LabeledControl>
    : <div className={cls} style={st} onClick={onClick}>{children}</div>)

  if (variant === 'dual') {
    const v1 = value ?? min
    const v2 = value2 ?? max
    /* an empty label is no label: `label1="" label2=""` (SettingsRange, RailSettings) drew an empty 16px row that pushed the rail low */
    const showLabels = !!(label1 || label2)
    const ratio = max > min ? (playhead - min) / (max - min) : 0
    return row({ className: `control-slider gap-3 shadow-none ${className}`, style, children: <>
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
      </> })
  }

  const vertical = direction === 'vertical'
  const scrub = variant === 'scrub'
  const length = vertical ? height ?? 96 : size

  /* the float slider: track and thumb only, at the float sm height (plan-2026-11-12-float-system W2.1 — the label head it
   * carried went; the user: "SOME IDIOT tried to put label on the slider instead of using a fucking LABELEDCONTROL").
   * Its name is a LabeledControl's: a `label` passed here is drawn by `LabeledControl variant="float"`, the `value`
   * readout as its hint. The run is the value as a percent on the track. */
  if (variant === 'float') {
    const pct = max > min ? ((value - min) / (max - min)) * 100 : 0
    const track = (
      <input
        id={sliderId}
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={handleChange}
        onClick={onAltReset}
        disabled={disabled}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
        className={`kol-slider-float block min-w-0 ${readout === 'input' ? 'flex-1 w-full' : label ? 'w-full' : className || 'w-full'}`.trim()}
        style={{ '--kol-slider-pct': `${pct}%`, ...(length ? { width: length } : null), ...(label || readout === 'input' ? null : style) }}
      />
    )
    /* the value pill: the float Input, its width the widest value in `ch` (never a fixed px — validate:float F4) */
    const box = readout === 'input' && (
      <Input
        type="text"
        inputMode="decimal"
        variant="float"
        size="sm"
        chars={Math.max(2, fmt(min).length, fmt(max).length)}
        value={draft}
        disabled={disabled}
        aria-label={`${ariaLabel ?? (typeof label === 'string' ? label : 'Value')} value`}
        /* editing shows the raw number (a `50%` reading is typed as 0.5, the engine's unit) */
        onFocus={(e) => { const el = e.target; setEditing(true); setDraft(String(value)); requestAnimationFrame(() => el.select()) }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        className="shrink-0"
        inputClassName="text-center"
      />
    )
    const control = box
      ? <div className={`flex min-w-0 items-center gap-3 ${label ? 'w-full' : className || 'w-full'}`.trim()} style={label ? undefined : style}>{track}{box}</div>
      : track
    if (!label) return control
    return (
      <LabeledControl variant="float" label={label} hint={readout === 'value' ? displayValue : undefined} className={`${disabled ? 'opacity-40' : ''} ${className}`.trim()}>
        {control}
      </LabeledControl>
    )
  }


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

  const readoutNode = (readout ?? 'input') === 'input' ? (
    <Input
      type="text"
      inputMode="decimal"
      variant="filled"
      size="sm"
      preset={readoutPreset}
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
    return column({ className: `inline-flex flex-col items-center gap-2 ${className}`, style, onClick: onAltReset, children: <>
        {/* a native range turned upright: the box is the track's length tall, the input that long */}
        <div className="w-6 flex items-center justify-center" style={{ height: length }}>{range}</div>
        {readoutNode}
      </> })
  }

  return row({ className: `control-slider gap-3 shadow-none ${scrub ? 'h-7' : ''} ${className}`, style, onClick: onAltReset, children: <>
      {range}
      {readoutNode}
    </> })
}

export default Slider
