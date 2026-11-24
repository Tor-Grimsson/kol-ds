import { useEffect, useState } from 'react'

/**
 * QuantityInput — Pick a whole-number quantity. a compact integer quantity picker with two control layouts.
 *
 *   controls="chevron" (default) — value with a stacked up/down chevron pair
 *                                  on the right, inside a full-width field.
 *   controls="split"             — a − value + pill (minus and plus flank the
 *                                  value). The former `QuantityStepper`.
 *
 * Display-only value (not a text-editable input) — for an editable number
 * field with bump chevrons use `Stepper`. Size auto-adapts to the viewport
 * (sm < 768 ≤ md < 1024 ≤ lg) unless `size` pins it. Controlled: `value` +
 * `(next) => onChange`, clamped to [min, max].
 *
 * @param {number}   value     current quantity (default 1)
 * @param {Function} onChange  (next) => void
 * @param {number}   min       lower bound (default 1)
 * @param {number}   max       upper bound (default 99)
 * @param {string}   controls  'chevron' (default) | 'split'
 * @param {string}   size      'sm' | 'md' | 'lg' — pins the responsive size
 * @param {'float'}  variant   the float stepper (float-everything W2 row 24, 2026-11-04): a 36 capsule on the float
 *                             well, − value + in Inter 500 (the glyphs oq, 40% at a bound), the float heights by `size`
 * @param {string}   unit      FLOAT: a word after the value (`22 px` — the reader's text size, W11 row 151, 2026-11-04)
 * @param {string}   ariaLabel FLOAT: what the value is; the − + read `Decrease <it>` / `Increase <it>` (default quantity)
 * @param {'folio'}  variant   also `folio` (Folio migration batch A, 2026-11-22): Folio's stepper, two 32 squares at radius
 *                             4 with the rule line round the value (JetBrains Mono 12 / 16), the step glyphs 12 / 500;
 *                             8 apart, the root as wide as its row; a bound dims its square to 40%
 * @param {number}   step      FOLIO: how far one press moves the value (default 1; the reader's sizes step by 2)
 * @param {ReactNode} down     FOLIO: the − square's text (`A−`)
 * @param {ReactNode} up       FOLIO: the + square's text (`A+`)
 * @param {string}   downLabel FOLIO: the − square's name (`Smaller text`)
 * @param {string}   upLabel   FOLIO: the + square's name (`Larger text`)
 * @param {'kolbox'} variant  also `kolbox` (Folio on kolbox, 2026-11-22): kolbox has no stepper of its own, so it is built
 *                             from its parts: `Input variant="kolbox"` (its sm field, `--kol-kolbox-ctl` high: the value
 *                             in mono with `unit` after it, typed and committed on Enter or leaving, ↑↓ step it) between
 *                             two kolbox icon Buttons, − and + (your icons' `minus` and `plus`), 4 apart, the root as wide
 *                             as its row. `step`, `min`, `max` as folio's: a typed value is held to the range and the step;
 *                             a button at a bound is disabled. `downLabel`, `upLabel` name the buttons (else
 *                             `Decrease <ariaLabel>`, `Increase <ariaLabel>`); `down`, `up` are not drawn (the set's glyphs are)
 * @param {string}   className extra classes on the root
 */
import { IconLoader } from '@kolkrabbi/kol-icons'
import Input from '../atoms/Input.jsx'
import Button from '../atoms/Button.jsx'
const FLOAT_H = { sm: 'h-[var(--kol-float-h-sm)]', md: 'h-[var(--kol-float-h-md)]', lg: 'h-[var(--kol-float-h-lg)]' }

const SIZE_MAP = {
  sm: { fontSize: 11, paddingY: 12, paddingX: 24, radius: 20, icon: 10 },
  md: { fontSize: 12, paddingY: 14, paddingX: 24, radius: 22, icon: 12 },
  lg: { fontSize: 14, paddingY: 16, paddingX: 24, radius: 24, icon: 14 },
}

const QuantityInput = ({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  controls = 'chevron',
  size,
  variant,
  unit,
  ariaLabel = 'quantity',
  step = 1,
  down,
  up,
  downLabel,
  upLabel,
  className = '',
}) => {
  const [resolvedSize, setResolvedSize] = useState('md')
  const [componentWidth, setComponentWidth] = useState('180px')

  useEffect(() => {
    const determineSize = () => {
      if (size) { setResolvedSize(size); return }
      if (typeof window === 'undefined') { setResolvedSize('md'); return }
      if (window.innerWidth >= 1024) setResolvedSize('lg')
      else if (window.innerWidth >= 768) setResolvedSize('md')
      else setResolvedSize('sm')
    }
    determineSize()
    window.addEventListener('resize', determineSize)
    return () => window.removeEventListener('resize', determineSize)
  }, [size])

  useEffect(() => {
    const updateWidth = () => {
      if (typeof window === 'undefined') return
      if (window.innerWidth >= 1024) setComponentWidth('180px')
      else if (window.innerWidth >= 768) setComponentWidth('140px')
      else setComponentWidth('100px')
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const metrics = SIZE_MAP[resolvedSize] || SIZE_MAP.md
  const increment = () => { if (value < max) onChange?.(value + 1) }
  const decrement = () => { if (value > min) onChange?.(value - 1) }

  /* the float stepper: one capsule, the glyphs at each end, the value between */
  if (variant === 'float') {
    const btn = 'inline-flex h-full w-8 shrink-0 items-center justify-center rounded-full text-oq-64 hover:text-oq-96 disabled:opacity-40 disabled:hover:text-oq-64 cursor-pointer disabled:cursor-not-allowed outline-none focus-visible:[box-shadow:var(--kol-float-focus)] transition-colors'
    return (
      <div className={`inline-flex items-center rounded-full bg-[var(--kol-float-well)] px-1 kol-float-panel text-fg-emphasis ${FLOAT_H[size] ?? FLOAT_H.md} ${className}`.trim()}>
        <button type="button" onClick={decrement} disabled={value <= min} className={btn} aria-label={`Decrease ${ariaLabel}`}><IconLoader name="minus" size={14} /></button>
        <span className="min-w-6 flex-1 text-center tabular-nums">{value}{unit ? ` ${unit}` : ''}</span>
        <button type="button" onClick={increment} disabled={value >= max} className={btn} aria-label={`Increase ${ariaLabel}`}><IconLoader name="plus" size={14} /></button>
      </div>
    )
  }

  /* folio (Folio migration batch A, 2026-11-22): Folio's Stepper carried class for class (apps/folio Chrome.jsx), two 32
   * squares round the value, stepping by `step`; the chrome in kol-theme `.kol-quantity-input--folio` */
  if (variant === 'folio') {
    const stepCls = 'kol-quantity-input-step flex size-[32px] items-center justify-center rounded-[4px] border disabled:opacity-40'
    return (
      <div className={`kol-quantity-input--folio flex items-center gap-[8px] ${className}`.trim()}>
        <button type="button" aria-label={downLabel} disabled={value <= min} onClick={() => onChange?.(value - step)} className={stepCls}>{down}</button>
        <p className="kol-quantity-input-value flex-1 text-center tabular-nums">{value}{unit ? ` ${unit}` : ''}</p>
        <button type="button" aria-label={upLabel} disabled={value >= max} onClick={() => onChange?.(value + step)} className={stepCls}>{up}</button>
      </div>
    )
  }

  /* kolbox (Folio on kolbox, 2026-11-22): kolbox's field between its two icon buttons */
  if (variant === 'kolbox') {
    const to = (n) => Math.min(max, Math.max(min, min + Math.round((n - min) / step) * step))
    const commit = (text) => { const n = parseFloat(text); if (Number.isFinite(n) && to(n) !== value) onChange?.(to(n)) }
    return (
      <div className={`flex min-w-0 items-center gap-1 ${className}`.trim()}>
        <Button variant="kolbox" iconOnly="minus" aria-label={downLabel ?? `Decrease ${ariaLabel}`} disabled={value <= min} onClick={() => onChange?.(to(value - step))} />
        <Input variant="kolbox" aria-label={ariaLabel} value={value} onCommit={commit} suffix={unit} className="flex-1" />
        <Button variant="kolbox" iconOnly="plus" aria-label={upLabel ?? `Increase ${ariaLabel}`} disabled={value >= max} onClick={() => onChange?.(to(value + step))} />
      </div>
    )
  }

  /* controls="split" — the − value + pill (formerly QuantityStepper). */
  if (controls === 'split') {
    const btn = (disabled) => ({
      padding: `${metrics.paddingY}px 12px`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'transparent', border: 'none',
      color: 'var(--kol-surface-on-primary)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.3 : 1,
      transition: 'opacity 0.15s',
      fontFamily: 'var(--kol-font-family-mono)',
      fontSize: `${metrics.fontSize}px`, lineHeight: '120%',
    })
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          width: componentWidth, minWidth: componentWidth,
          border: '1px solid var(--kol-border-default)',
          borderRadius: `${metrics.radius}px`,
          backgroundColor: 'var(--kol-surface-primary)',
        }}
      >
        <button type="button" onClick={decrement} disabled={value <= min} style={btn(value <= min)} aria-label="Decrease quantity">−</button>
        <span style={{ minWidth: '24px', textAlign: 'center', color: 'var(--kol-surface-on-primary)', fontFamily: 'var(--kol-font-family-mono)', fontSize: `${metrics.fontSize}px`, lineHeight: '120%' }}>{value}</span>
        <button type="button" onClick={increment} disabled={value >= max} style={btn(value >= max)} aria-label="Increase quantity">+</button>
      </div>
    )
  }

  /* controls="chevron" (default) — value + stacked chevron pair on the right. */
  return (
    <div className={`relative block ${className}`}>
      <div
        className="w-full flex items-center"
        style={{
          position: 'relative', height: '42.5px',
          border: '1px solid var(--kol-border-default)',
          borderRadius: `${metrics.radius}px`,
          backgroundColor: 'var(--kol-surface-primary)',
          color: 'var(--kol-surface-on-primary)',
          paddingLeft: `${metrics.paddingX}px`, paddingRight: `${metrics.paddingX}px`,
          fontSize: `${metrics.fontSize}px`, lineHeight: '120%',
          fontFamily: 'var(--kol-font-family-mono)', boxSizing: 'border-box',
        }}
      >
        <span>{value}</span>
        <div style={{ position: 'absolute', right: `${metrics.paddingX}px`, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column' }}>
          <button type="button" onClick={increment} disabled={value >= max} style={{ backgroundColor: 'transparent', border: 'none', padding: '0', cursor: value >= max ? 'not-allowed' : 'pointer', opacity: value >= max ? 0.3 : 1, lineHeight: 0, display: 'block' }} aria-label="Increase quantity">
            <svg width={metrics.icon} height={metrics.icon} viewBox="0 0 12 12" fill="none">
              <path d="m3 7 3-3 3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" onClick={decrement} disabled={value <= min} style={{ backgroundColor: 'transparent', border: 'none', padding: '0', cursor: value <= min ? 'not-allowed' : 'pointer', opacity: value <= min ? 0.3 : 1, lineHeight: 0, display: 'block' }} aria-label="Decrease quantity">
            <svg width={metrics.icon} height={metrics.icon} viewBox="0 0 12 12" fill="none">
              <path d="m3 5 3 3 3-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuantityInput
