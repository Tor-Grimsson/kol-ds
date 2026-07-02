/**
 * SegmentedToggle — N-way segmented control. Joined cells sharing one
 * outer stroke; thin dividers between cells; no gap. Active cell fills
 * with surface-secondary + text-emphasis, inactive is text-meta with
 * hover lifting. Chrome comes from .kol-seg* in kol-theme (NOT Tailwind
 * utilities — those never generate from package sources).
 *
 *   <SegmentedToggle
 *     value={current}
 *     onChange={setCurrent}
 *     options={[{ value, label }]}
 *   />
 *
 * Companion to `ViewToggle`:
 *   - ViewToggle (text)   — bare segmented buttons separated by gap; no shared shell.
 *   - ViewToggle (icon)   — inset-well row of square icon buttons.
 *   - SegmentedToggle     — flat segmented strip with shared border + dividers.
 *
 * Labels accept any node — pass strings or inline SVG previews. Optional
 * `ariaLabel` per option for non-text labels.
 *
 * A11y: radiogroup/radio semantics with a roving tabindex — Tab enters
 * the group on the active cell, ←/→ (or ↑/↓) move selection + focus.
 *
 * Props:
 *   value     — current option value
 *   onChange  — handler (newValue) => void
 *   options   — [{ value, label, ariaLabel? }]
 *   size      — 'md' (default, 26px) | 'sm' (16px). `sm` is for icon/preview-
 *               only options (e.g. line-style previews) where text labels
 *               aren't used; the cells still center their contents but the
 *               outer height is tighter.
 *   ariaLabel — accessible name for the group
 *   className — additional classes on the outer shell
 */
export default function SegmentedToggle({ value, onChange, options = [], size = 'md', ariaLabel, className = '' }) {
  const cellType = size === 'sm' ? '' : 'kol-mono-12'
  const focusIdx = Math.max(0, options.findIndex((opt) => opt.value === value))

  const handleKeyDown = (e) => {
    const dir = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key]
    if (!dir || !options.length) return
    e.preventDefault()
    const next = (focusIdx + dir + options.length) % options.length
    onChange?.(options[next].value)
    e.currentTarget.children[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={['kol-seg', size === 'sm' && 'kol-seg--sm', className].filter(Boolean).join(' ')}
    >
      {options.map((opt, i) => {
        const isActive = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.ariaLabel}
            tabIndex={i === focusIdx ? 0 : -1}
            onClick={() => onChange?.(opt.value)}
            className={['kol-seg-cell', cellType, isActive && 'is-active'].filter(Boolean).join(' ')}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
