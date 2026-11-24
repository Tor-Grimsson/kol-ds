/**
 * ButtonGroup — the one component for a group of buttons (plan-2026-11-06-buttons-page 2.7; the user,
 * 2026-11-06: *"button group CAN be segmented toggle … just by the fact it wraps multiple buttons"*).
 * Five layouts:
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
 *   layout="wrap"   — the buttons 8 apart in a row that wraps to the next line when its column runs out, full
 *                   width (kolbox's rail rows, plan-2026-11-18-kolbox-system W31.2, 2026-11-18).
 *   layout="grid"   — two equal columns 8 apart, full width, so the longest label fits a narrow rail (kolbox's
 *                   Rolls and randomise rows). wrap and grid take no `align` or `title`; other props land on the box.
 *
 * row / stack props:
 * @param {'left'|'center'|'right'|'between'} align horizontal alignment + container layout mode (default 'center'); `between`
 *   (2026-11-12, plan-2026-11-12-one-header W6.1) sets the first button at the left and the last at the right — a float
 *   window's Cancel · Export row
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
 *   variant="kolbox" — kolbox's icon group (W31.2 batch 3): `options` `[{ icon, ariaLabel, pressed, onPress }]`, each its
 *               own action; `tone` unset (cells) or `sunken` (the track). With `value` (Folio on kolbox, 2026-11-22) kolbox's
 *               choice that stays, its tab track: `options` `[{ value, label }]`, the picked cell lit, aria-pressed
 *   variant="folio" — Folio's (batch A, 2026-11-22), by the state law: with `value` its segmented choice (`options`
 *               `[{ value, label }]`, the picked cell lit, aria-pressed); without, its tool icons joined (`options`
 *               `[{ icon, ariaLabel, pressed, onPress }]`)
 */
import { toneClass, floatSurfaceClass } from '../utilities/tone.js'
import { Tooltip } from '../utilities/Popover.jsx'
import Button from '../atoms/Button.jsx'

const CONTAINER = {
  left: 'flex flex-col w-full',
  center: 'flex sm:inline-flex flex-col w-full sm:w-auto sm:mx-auto',
  right: 'flex flex-col w-full',
  between: 'flex flex-col w-full',
}

const JUSTIFY = {
  left: 'sm:justify-start',
  center: 'sm:justify-center',
  right: 'sm:justify-end',
  between: 'sm:justify-between',
}

export default function ButtonGroup({ layout = 'row', align = 'center', title, className = '', children, ...joined }) {
  if (layout === 'joined') return <Joined className={className} {...joined} />
  if (layout === 'wrap' || layout === 'grid') {
    return <div className={`${layout === 'grid' ? 'grid grid-cols-2' : 'flex flex-wrap items-center'} w-full min-w-0 gap-2 ${className}`.trim()} {...joined}>{children}</div>
  }
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

/* layout="joined" variant="kolbox" (plan-2026-11-18-kolbox-system W31.2 batch 3, 2026-11-18): kolbox's IconGroup carried
 * class for class. Each option is its own action, a kolbox icon Button (`{ icon, ariaLabel, pressed, onPress }`): no
 * `value`, every option lights by its own `pressed`. Unset tone: each glyph in its own oq-16 cell, 1px apart so the
 * ground shows between them, radius 4 on the group's outer corners only, a pressed cell the accent tint. `tone="sunken"`:
 * Home's view switch, square cells the group's height (24, Figma's view toggles measured, plan-2026-11-23-editor-measured-
 * against-figma W7), side by side on the ground, the pressed cell (aria-pressed only) the oq-16 field
 * with its glyph in the ink, the others bare. Chrome in kol-theme `.kol-btn-group--kolbox`. */
function JoinedKolbox({ options, tone, className }) {
  const sunken = tone === 'sunken'
  return (
    <div className={`kol-btn-group--kolbox${sunken ? ' kol-btn-group--kolbox-sunken' : ' gap-px overflow-hidden'} inline-flex h-(--kol-kolbox-ctl) shrink-0 ${className}`}>
      {options.map(({ icon, ariaLabel, pressed, onPress }) => (sunken
        ? <Button key={ariaLabel} variant="kolbox" iconOnly={icon} aria-label={ariaLabel} aria-pressed={!!pressed} onClick={onPress} className="aspect-square h-full! w-auto!" />
        : <Button key={ariaLabel} variant="kolbox" iconOnly={icon} aria-label={ariaLabel} pressed={pressed} onClick={onPress} className="flex-1 rounded-none" />))}
    </div>
  )
}

/* layout="joined" variant="folio" (Folio migration batch A, 2026-11-22): Folio's two joined parts, split by the segmented
 * state law. With a `value` it is Folio's Seg (apps/folio Chrome.jsx), a choice that stays: 32 high, radius 4, the rule
 * line round equal cells padded 16, the picked one the accent's soft ground and strong ink (aria-pressed, as Folio's),
 * the rest muted, the ink on hover. Stateless it is Folio's ToolGroup (EditorChrome.jsx): Folio's tool icons side by side,
 * no gap, `options` `[{ icon, ariaLabel, pressed, onPress }]`, each its own action. Chrome in kol-theme
 * `.kol-btn-group--folio`. */
function JoinedFolio({ value, onChange, options, ariaLabel, className }) {
  if (value == null) {
    return (
      <span role="group" aria-label={ariaLabel} className={`flex shrink-0 items-center ${className}`.trim()}>
        {options.map(({ icon, ariaLabel: name, pressed, onPress }) => <Button key={name} variant="folio" iconOnly={icon} aria-label={name} pressed={pressed} onClick={onPress} />)}
      </span>
    )
  }
  return (
    <div role="group" aria-label={ariaLabel} className={`kol-btn-group--folio flex h-[32px] overflow-hidden rounded-[4px] border ${className}`.trim()}>
      {options.map((opt) => (
        <button key={opt.value} type="button" aria-pressed={value === opt.value} onClick={() => onChange?.(opt.value)} className="kol-btn-group-cell flex-1 whitespace-nowrap px-[16px]">{opt.label}</button>
      ))}
    </div>
  )
}
/* layout="joined" variant="kolbox" with a `value` (Folio on kolbox, 2026-11-22): kolbox's choice that stays (Off and On,
 * Miter, Round and Bevel) is its tab track, so this draws TabsRow kolbox sm's track and cells (its chrome,
 * `.kol-tabs--kolbox-sm`, kol-components-molecules.css) as a group: `options` `[{ value, label }]`, the picked cell lit and
 * aria-pressed, `ariaLabel` names it. */
function JoinedKolboxChoice({ value, onChange, options, ariaLabel, className }) {
  return (
    <div role="group" aria-label={ariaLabel} className={`kol-tabs--kolbox kol-tabs--kolbox-sm inline-flex h-(--kol-kolbox-ctl) items-center gap-px p-0.5 ${className}`.trim()}>
      {options.map((opt) => (
        <button key={opt.value} type="button" aria-pressed={opt.value === value} disabled={opt.disabled} onClick={() => onChange?.(opt.value)}
          className={`kol-tabs-tab${opt.value === value ? ' is-active' : ''} flex h-full min-w-0 flex-1 items-center justify-center px-3 whitespace-nowrap outline-none focus-visible:outline-solid focus-visible:outline-1 disabled:opacity-40`}>{opt.label}</button>
      ))}
    </div>
  )
}


/* layout="joined" — the segmented control (SegmentedToggle's implementation, moved here 2026-11-06) */
function Joined({ value, onChange, options = [], variant = 'default', size = 'md', tone = 'default', surface = 'solid', ariaLabel, className = '' }) {
  if (variant === 'kolbox') return value == null ? <JoinedKolbox options={options} tone={tone} className={className} /> : <JoinedKolboxChoice value={value} onChange={onChange} options={options} ariaLabel={ariaLabel} className={className} />
  if (variant === 'folio') return <JoinedFolio value={value} onChange={onChange} options={options} ariaLabel={ariaLabel} className={className} />
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
