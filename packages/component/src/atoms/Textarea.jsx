
import { Icon } from '@kolkrabbi/kol-icons'

/**
 * Textarea — multi-line text atom built on the .kol-control shell with the
 * `--textarea` modifier (display: block).
 *
 *   variant="filled" (default) — persistent solid bg
 *   variant="ghost"            — legacy alias, resolves to outline
 *   variant="outline"          — bordered, transparent bg
 *
 *   size="sm" / "md" (default) / "lg" — padding + type class
 *
 * Default rows = 3 (kept short — long content gets scrollbars instead of
 * dominating the panel). Resize is real (2026-07-08): native resize is
 * OFF (Firefox's built-in grip cannot be hidden any other way) and the
 * kol-icon-set-v1 `resize-grip` icon IS the drag handle — corner drag,
 * both axes, min 120×40. One grip, every browser.
 *
 * Controlled OR uncontrolled:
 *   - pass `value` + `onChange` for controlled,
 *   - pass `value` alone (no onChange) and we route through defaultValue.
 *
 * Pairs with `<Input>` for single-line.
 */

const SIZE_TYPE = { sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }

export default function Textarea({
  value,
  onChange,
  variant = 'filled',
  size = 'md',
  rows = 3,
  placeholder,
  disabled = false,
  className = '',
  ...props
}) {
  // ghost folds into outline (2026-07-08 chrome law): one secondary treatment.
  const resolvedVariant = variant === 'ghost' ? 'outline' : variant

  const wrapperCls = [
    'kol-control',
    `kol-control--${resolvedVariant}`,
    'kol-control--textarea',
    `kol-control-${size}`,
    SIZE_TYPE[size],
    'relative block w-full',
    className,
  ].filter(Boolean).join(' ')

  /* React requires controlled inputs (value + onChange) OR uncontrolled
   * (defaultValue only). Pick based on whether onChange was passed. */
  const valueProps = onChange
    ? { value: value ?? '', onChange }
    : { defaultValue: value ?? '' }

  return (
    <label className={wrapperCls} aria-disabled={disabled || undefined}>
      <textarea
        {...valueProps}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck={false}
        className="block w-full bg-transparent border-none outline-none text-auto"
        style={{ resize: 'none' }}
        {...props}
      />
      <span
        aria-hidden="true"
        className="kol-textarea-resize-icon"
        onPointerDown={(e) => {
          // The grip IS the resize handle — corner drag, both axes
          // (min 120×40). Width lands on the shell, height on the textarea.
          const shell = e.currentTarget.parentElement
          const ta = shell?.querySelector('textarea')
          if (!shell || !ta) return
          e.preventDefault()
          const startX = e.clientX
          const startY = e.clientY
          const startW = shell.offsetWidth
          const startH = ta.offsetHeight
          const move = (ev) => {
            shell.style.width = `${Math.max(startW + ev.clientX - startX, 120)}px`
            ta.style.height = `${Math.max(startH + ev.clientY - startY, 40)}px`
          }
          const up = () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
          }
          window.addEventListener('pointermove', move)
          window.addEventListener('pointerup', up)
        }}
      >
        <Icon name="resize-grip" size={12} />
      </span>
    </label>
  )
}
