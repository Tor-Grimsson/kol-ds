/**
 * Stepper — number input + chevron buttons, built on the .kol-control shell.
 *
 *   size="xs" / "sm" (default) / "md" / "lg" — matched padding + type class.
 *   Chevron scale follows the size: 6 / 8 / 10 / 12 px each, stacked. xs is the
 *   panel rung (ControlsXsRung, kol-monitor 2026-09-01).
 *
 *   options — step through a LIST instead of a number range (the rack's
 *   ‹ value › Selector, as a variant of this on the ladder; user: "selector
 *   could be a variant of ours if we make it follow the size ladder"). `value`
 *   is one of the options, the field is read-only, the chevrons step and WRAP
 *   at both ends, and `onChange` reports the option in the same event shape
 *   as the number path — `{ target: { value: option } }`.
 *
 *   layout="inline" — `‹ value ›` on ONE line (StepperInlineVariant, kol-monitor
 *   2026-09-02; the rack's Selector shape, the other half of its collapse onto
 *   this): the chevrons flank the value as left/right hit targets, the value is
 *   centred in a 3ch floor so the row does not jitter as it steps, and there is
 *   NO `.kol-control` field chrome — it is inline text on the panel. Value
 *   `text-fg-64`, chevrons `text-fg-40`, type from the size ladder; casing is the
 *   caller's. Works for `options` and for the number range alike. Default
 *   `stacked` is the field with the chevron stack, exactly as before.
 *
 * Loaded from `00-kol/chevron-{up,down}.svg` via the Icon registry — first
 * stroke icons in the kol curated set. For a plain number input without
 * bump affordance, use `<Input type="number" />`.
 */
import { Icon } from '@kolkrabbi/kol-icons'

const SIZE_TYPE    = { xs: 'kol-mono-8', sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }
const CHEVRON_SIZE = { xs: 6,            sm: 8,             md: 10,            lg: 12 }

export default function Stepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  options,
  layout = 'stacked',
  size = 'sm',
  className = '',
  style = {},
  ...props
}) {
  /* the list path: wrap at both ends, report the option */
  const stepList = (dir) => {
    const i = options.indexOf(value)
    const n = i < 0 ? 0 : (i + dir + options.length) % options.length
    onChange?.({ target: { value: options[n] } })
  }
  const handleIncrement = () => {
    if (options) return stepList(1)
    const newValue = Number(value) + step
    if (max !== undefined && newValue > max) return
    onChange?.({ target: { value: newValue } })
  }

  const handleDecrement = () => {
    if (options) return stepList(-1)
    const newValue = Number(value) - step
    if (min !== undefined && newValue < min) return
    onChange?.({ target: { value: newValue } })
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    if (newValue === '' || newValue === '-') { onChange?.(e); return }
    const numValue = Number(newValue)
    if (isNaN(numValue)) return
    if (min !== undefined && numValue < min) return
    if (max !== undefined && numValue > max) return
    onChange?.(e)
  }

  /* INLINE — ‹ value › with no field: the chevrons are the hit targets, the
   * value is text on the panel. `min-w-[3ch]` holds the width across steps. */
  if (layout === 'inline') {
    const chev = CHEVRON_SIZE[size]
    return (
      <div className={`inline-flex items-center justify-center gap-0.5 select-none ${SIZE_TYPE[size]} ${className}`.trim()} style={style}>
        <button type="button" onClick={handleDecrement} className="inline-flex items-center justify-center px-0.5 text-fg-40 hover:text-emphasis transition-colors" aria-label="Previous">
          <Icon name="chevron-left" size={chev} />
        </button>
        <span className="min-w-[3ch] text-center text-fg-64" {...props}>{value ?? ''}</span>
        <button type="button" onClick={handleIncrement} className="inline-flex items-center justify-center px-0.5 text-fg-40 hover:text-emphasis transition-colors" aria-label="Next">
          <Icon name="chevron-right" size={chev} />
        </button>
      </div>
    )
  }

  const shellCls = [
    'kol-control',
    'kol-control--filled',
    `kol-control-${size}`,
    SIZE_TYPE[size],
    'relative',
    className,
  ].filter(Boolean).join(' ')

  /* Reserve right space inside the input so the value never tucks under the
   * chevrons. Chevrons themselves are absolute — shell height stays driven
   * by the input's line-height, not by chevron stack height. */
  const chevronWidth = CHEVRON_SIZE[size]
  const inputPaddingRight = chevronWidth + 4

  return (
    <div className={shellCls} style={style}>
      <input
        type={options ? 'text' : 'number'}
        readOnly={options ? true : undefined}
        value={value ?? ''}
        onChange={options ? undefined : handleInputChange}
        min={options ? undefined : min}
        max={options ? undefined : max}
        step={options ? undefined : step}
        className="w-full min-w-0 bg-transparent border-none outline-none text-auto hide-number-spinners"
        style={{ paddingRight: `${inputPaddingRight}px` }}
        {...props}
      />
      <div className="absolute top-1/2 -translate-y-1/2 right-2 flex flex-col shrink-0 leading-none">
        <button
          type="button"
          onClick={handleIncrement}
          className="flex items-center justify-center text-meta hover:text-emphasis transition-colors"
          aria-label="Increment"
        >
          <Icon name="chevron-up" size={chevronWidth} />
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          className="flex items-center justify-center text-meta hover:text-emphasis transition-colors"
          aria-label="Decrement"
        >
          <Icon name="chevron-down" size={chevronWidth} />
        </button>
      </div>
    </div>
  )
}
