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
 *   value     — current option value. `null`/`undefined` = STATELESS mode
 *               (the segmented state law, 2026-08-12): role `group`, no
 *               aria-checked, no selected styling — a pure one-shot ACTION
 *               strip (canvas alignment, transform cluster); onChange is the
 *               action dispatch.
 *   onChange  — handler (newValue) => void
 *   options   — [{ value, label, ariaLabel? }]
 *   variant   — 'default' (shipped chrome: shared outer stroke + dividers,
 *               filled active cell) | 'filled' (the state law's tiles: every
 *               cell a surface-secondary tile with 1px transparent gaps, NO
 *               outline shell; the inset ring marks ONLY the selected cell) |
 *               'tonal' (filled tiles, but the clicked cell marks itself by
 *               TONE — surface-tertiary fill, no ring; 2026-08-12).
 *               Every variant renders at the SAME pinned button-ladder
 *               height (22/26/32/40) — icon or text, the box never moves.
 *   size      — mirrors Button exactly: 'sm' (26px, mono-12, 4/12 pad) |
 *               'md' (default, 32px, mono-14, 6/16 pad) | 'lg' (40px,
 *               mono-16, 8/20 pad). Same cell padding + mono type as the
 *               matching `.kol-btn-{sm,md,lg}`, so a segmented strip lines
 *               up with a Button of the same size.
 *   tone      — the ground (segmented-toggle-sunken-tone, kol-client-olina 2026-09-03: the one
 *               control ControlToneSunken skipped; kol-fxr and olina carried the same three CSS
 *               lines to fake it). `sunken` (alias `inverse`): shell border transparent, the
 *               selected cell on `--kol-surface-sunken` / `fg-96`, rest cells as the default paints
 *               them; `filled` and `tonal` keep their own selected law. Through `toneClass`, so a
 *               `kol-tone-sunken` wrapper reaches it too. Unset = inherit.
 *   ariaLabel — accessible name for the group
 *   className — additional classes on the outer shell
 */
import { toneClass } from '../utilities/tone.js'

export default function SegmentedToggle({ value, onChange, options = [], variant = 'default', size = 'md', tone = 'default', ariaLabel, className = '' }) {
  const cellType = { xs: 'kol-mono-8', sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }[size]
  const stateless = value == null
  const focusIdx = Math.max(0, options.findIndex((opt) => opt.value === value))

  const handleKeyDown = (e) => {
    if (stateless) return // plain button row — Tab moves focus, arrows do nothing
    const dir = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key]
    if (!dir || !options.length) return
    e.preventDefault()
    const next = (focusIdx + dir + options.length) % options.length
    onChange?.(options[next].value)
    e.currentTarget.children[next]?.focus()
  }

  return (
    <div
      role={stateless ? 'group' : 'radiogroup'}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={[
        'kol-seg',
        (variant === 'filled' || variant === 'tonal') && 'kol-seg--filled',
        variant === 'tonal' && 'kol-seg--tonal',
        size !== 'md' && `kol-seg--${size}`,
        toneClass(tone),
        className,
      ].filter(Boolean).join(' ')}
    >
      {options.map((opt, i) => {
        const isActive = !stateless && opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role={stateless ? undefined : 'radio'}
            aria-checked={stateless ? undefined : isActive}
            aria-label={opt.ariaLabel}
            tabIndex={stateless ? 0 : (i === focusIdx ? 0 : -1)}
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
