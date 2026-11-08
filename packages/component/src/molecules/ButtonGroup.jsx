/**
 * ButtonGroup — the one component for a group of buttons (plan-2026-11-06-buttons-page 2.7; the user,
 * 2026-11-06: *"button group CAN be segmented toggle … just by the fact it wraps multiple buttons"*).
 * Three layouts:
 *
 *   layout="row"    (default) — a responsive layout wrapper for a group of Buttons: stacked full-width on
 *                   mobile, a horizontal row from `sm` up, aligned left / center / right. Pure layout —
 *                   children compose at the call site and render as-is (nothing is cloned, no props
 *                   injected); all button behavior lives on each Button. `center` (default) hugs its
 *                   content and self-centers; `left` / `right` stay full-width block. Alignment classes
 *                   come from static lookup maps of complete literals — never interpolated — so
 *                   Tailwind's scanner sees them.
 *   layout="stack"  — the same wrapper, stacked at every width (the row's 8 stacked gap).
 *   layout="joined" — the segmented control (was `SegmentedToggle`, kept as its alias on the retirement
 *                   ledger): joined cells, no gap, built from `options` instead of children. See below.
 *
 * row / stack props:
 * @param {'left'|'center'|'right'} align horizontal alignment + container layout mode (default 'center')
 * @param {string}    title     optional heading rendered above the group, authored at the call site
 * @param {string}    className extra container classes (appended) — note this lands on the OUTER
 *   container, not the flex row that carries the gap; the gap is responsive by default (8 stacked,
 *   16 as a row) rather than reachable, so there is nothing to reach for.
 * @param {ReactNode} children  the Buttons
 *
 * layout="joined" — N-way segmented control. Joined cells sharing one outer stroke; thin dividers
 * between cells; no gap. Active cell fills with surface-secondary + text-emphasis, inactive is
 * text-meta with hover lifting. Chrome comes from .kol-seg* in kol-theme (NOT Tailwind utilities —
 * those never generate from package sources).
 *
 *   <ButtonGroup layout="joined"
 *     value={current}
 *     onChange={setCurrent}
 *     options={[{ value, label }]}
 *   />
 *
 * Companion to `ViewToggle`:
 *   - ViewToggle (text)   — bare segmented buttons separated by gap; no shared shell.
 *   - ViewToggle (icon)   — inset-well row of square icon buttons.
 *   - ButtonGroup joined  — flat segmented strip with shared border + dividers.
 *
 * Labels accept any node — pass strings or inline SVG previews. Optional `ariaLabel` per option for
 * non-text labels.
 *
 * A11y: radiogroup/radio semantics with a roving tabindex — Tab enters the group on the active cell,
 * ←/→ (or ↑/↓) move selection + focus.
 *
 * Props (joined):
 *   value     — current option value. `null`/`undefined` = STATELESS mode
 *               (the segmented state law, 2026-08-12): role `group`, no
 *               aria-checked, no selected styling — a pure one-shot ACTION
 *               strip (canvas alignment, transform cluster); onChange is the
 *               action dispatch.
 *   onChange  — handler (newValue) => void
 *   options   — [{ value, label, ariaLabel?, tooltip?, disabled?, count? }] — a cell whose label is not a string
 *               (a glyph) shows its `ariaLabel` as a KOL Tooltip; `tooltip` overrides it.
 *               `count` (float-everything W2 row 26, 2026-11-04): a number after the label, mono one step down,
 *               12 off the label — `Open 5`; drawn on `variant="float"` (`.kol-seg-count`), ignored elsewhere.
 *               `disabled` (kol-fxr 2026-10-09): the cell draws the family's disabled ink
 *               (`aria-disabled`, not the attribute — the tooltip still gives the reason),
 *               refuses the press, and ←/→ step over it. It may still be the current `value`
 *               (the ground changed under it): selected + disabled, no throw.
 *   variant   — 'default' — BORDERLESS (2026-10-29, the user: *"WE DONT USE BORDER, almost NEVER … DONT USE FUCKING
 *               BORDER unless I APPROVE it"*): the `sunken` tone, no outer stroke, the selected cell on the sunken
 *               ground. A choice is a Dropdown or text tabs first; a toggle that stays is this one |
 *               'outlined' (the old default: shared outer stroke + dividers, filled active cell — only where he has
 *               approved a border) | 'filled' (the state law's tiles: every
 *               cell a surface-secondary tile with 1px transparent gaps, NO
 *               outline shell; the inset ring marks ONLY the selected cell) |
 *               'tonal' (filled tiles, but the clicked cell marks itself by
 *               TONE — surface-tertiary fill, no ring; 2026-08-12).
 *               'float' (W16, round 3 — 2026-10-31): a capsule track 6 in on its `surface`, pills 4 apart at the
 *               float heights (28/36/44, touch 36/44/52), the selected pill filled with the ink.
 *               Every other variant renders at the SAME pinned button-ladder
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
 *   surface   — `variant="float"` only: 'solid' (default) | 'glass-dark' | 'glass-light' — the track's material
 *               (`floatSurfaceClass`, kol-theme `.kol-float-*`)
 *   ariaLabel — accessible name for the group
 *   className — additional classes on the outer shell
 */
import { toneClass, floatSurfaceClass } from '../utilities/tone.js'
import { Tooltip } from '../utilities/Popover.jsx'

const CONTAINER = {
  left: 'flex flex-col w-full',
  center: 'flex sm:inline-flex flex-col w-full sm:w-auto sm:mx-auto',
  right: 'flex flex-col w-full',
}

const JUSTIFY = {
  left: 'sm:justify-start',
  center: 'sm:justify-center',
  right: 'sm:justify-end',
}

export default function ButtonGroup({ layout = 'row', align = 'center', title, className = '', children, ...joined }) {
  if (layout === 'joined') return <Joined className={className} {...joined} />
  return (
    <div className={[CONTAINER[align] || CONTAINER.center, className].filter(Boolean).join(' ')}>
      {title && <h3 className="kol-sans-heading-05 text-emphasis mb-6">{title}</h3>}
      <div
        className={[
          /* THE GAP IS TWO JOBS, NOT ONE (ButtonGroupResponsiveGap, kol-website
           * 2026-08-31). The group changes axis at `sm`, so a single `gap-4` was
           * doing horizontal separation between two side-by-side buttons AND
           * vertical separation between two full-width stacked ones. Those do not
           * want the same number: 16 reads too open stacked (user: "16 is way too
           * big, at least lets see 8 or 12"), and 8 is what looks right on device.
           * A responsive default rather than a prop — the stacked case IS the
           * narrow viewport, so the value is pickable once instead of per
           * consumer. The row keeps today's 16 and nothing moves at `sm` and up.
           * `stack` keeps the stacked half at every width. */
          layout === 'stack' ? 'flex flex-col gap-2' : 'flex flex-col gap-2 sm:flex-row sm:gap-4 sm:items-center',
          layout === 'stack' ? '' : JUSTIFY[align] || JUSTIFY.center,
        ].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    </div>
  )
}

/* layout="joined" — the segmented control (SegmentedToggle's implementation, moved here 2026-11-06) */
function Joined({ value, onChange, options = [], variant = 'default', size = 'md', tone = 'default', surface = 'solid', ariaLabel, className = '' }) {
  const float = variant === 'float'
  const cellType = { xs: 'kol-mono-8', sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }[size]
  const stateless = value == null
  const focusIdx = Math.max(0, options.findIndex((opt) => opt.value === value))

  const handleKeyDown = (e) => {
    if (stateless) return // plain button row — Tab moves focus, arrows do nothing
    const dir = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key]
    if (!dir || !options.length) return
    e.preventDefault()
    let next = focusIdx
    for (let step = 0; step < options.length; step++) {
      next = (next + dir + options.length) % options.length
      if (!options[next].disabled) break
    }
    if (options[next].disabled) return
    onChange?.(options[next].value)
    e.currentTarget.children[next]?.focus()
  }

  /* the default draws borderless — the sunken tone — unless a tone is asked for; `outlined` keeps the stroke */
  const resolvedTone = variant === 'default' && tone === 'default' ? 'sunken' : tone
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
        float && `kol-seg--float ${floatSurfaceClass(surface)}`,
        toneClass(resolvedTone),
        className,
      ].filter(Boolean).join(' ')}
    >
      {options.map((opt, i) => {
        const isActive = !stateless && opt.value === value
        return (
          <Tooltip key={opt.value} asChild label={opt.tooltip ?? (typeof opt.label === 'string' ? null : opt.ariaLabel)}>
          <button
            type="button"
            role={stateless ? undefined : 'radio'}
            aria-checked={stateless ? undefined : isActive}
            aria-label={opt.ariaLabel}
            aria-disabled={opt.disabled || undefined}
            tabIndex={stateless ? 0 : (i === focusIdx ? 0 : -1)}
            onClick={opt.disabled ? undefined : () => onChange?.(opt.value)}
            className={['kol-seg-cell', cellType, isActive && 'is-active'].filter(Boolean).join(' ')}
          >
            {opt.label}
            {float && opt.count != null && <span className="kol-seg-count">{opt.count}</span>}
          </button>
          </Tooltip>
        )
      })}
    </div>
  )
}
