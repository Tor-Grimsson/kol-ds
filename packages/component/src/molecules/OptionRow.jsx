/**
 * OptionRow — one row in a list you move through: the palette's results, a browser's rows, a
 * dropdown's options. Lifted out of ShellSearchOverlay (2026-09-30), where it was hand-rolled next to
 * DropdownTagFilter's, FieldRow's and ColumnBrowser's own — four rows for one job.
 *
 * The box is the control's: `min-h` on the --kol-ctl-* ramp (22 · 26 · 32 · 40) with a 1px
 * transparent ring, so a row lines up with the field or button beside it at the same size.
 *
 * States, strongest first:
 *   selected — the picked item: the tone's PRESSED fill (white in dark, as the grid's picked name)
 *   active   — the keyboard cursor / hover: the tone fill, full ink
 *   trail    — on the path to the picked item (a browser's parent folders): oq-08
 *
 * Renders no role — the caller owns the list semantics (`role="option"`, `aria-selected`, ids)
 * and passes them through `...rest`.
 *
 * @param {'xs'|'sm'|'md'|'lg'} size   the control ramp step
 * @param {string}    type     a type class instead of the ramp's (file lists: `kol-item-name`)
 * @param {string}    icon     kol-icons name, drawn in oq (icons-use-oq law)
 * @param {ReactNode} leading  anything else in the icon column (a check, a thumb) — wins over icon
 * @param {ReactNode} label
 * @param {ReactNode} hint     secondary text — beside the label, right-aligned on its baseline
 * @param {ReactNode} trailing right-aligned (a shortcut, a count, a menu button)
 * @param {string}    as       element to render (`div` · `button` · `li`)
 * @param {boolean}   hover    false = hover paints nothing (the media browser's ruling, 2026-09-02)
 * @param {boolean}   muted    a row that is there but not the point (fg-48)
 *
 * `ROW_HEIGHT` / `ROW_TYPE` / `ROW_FILL` are exported for a row that cannot take this anatomy (the
 * media rows view's table row: twisty, drag hit, columns) — it still sits on the same ramp and fills.
 */
import { Icon } from '@kolkrabbi/kol-icons'
import { glyphSize } from '../hooks/glyphLadders.js'

/* the box: min-height on the ramp, and a pad that lands one line of the step's type exactly on it —
 * xs 2+1+16+1+2 = 22 · sm 4+1+16+1+4 = 26 · md 6+1+18+1+6 = 32 · lg 10+1+18+1+10 = 40 */
export const ROW_HEIGHT = {
  xs: 'min-h-[var(--kol-ctl-xs)] py-0.5',
  sm: 'min-h-[var(--kol-ctl-sm)] py-1',
  md: 'min-h-[var(--kol-ctl-md)] py-1.5',
  lg: 'min-h-[var(--kol-ctl-lg)] py-2.5',
}
export const ROW_TYPE = { xs: 'kol-mono-12', sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-14' }

const TONE = 'bg-[var(--kol-tone-bg,var(--kol-surface-secondary))]'
/* SELECTED IS THE TONE'S PRESSED STATE (user 2026-09-30: *"use white as focused item like grid
 * already does"*) — `--kol-tone-pressed-*`, the fill a pressed button takes; outside a tone, the
 * same surface-on-primary / surface-primary pair the grid's picked name paints. */
export const ROW_FILL = {
  selected: 'bg-[var(--kol-tone-pressed-bg,var(--kol-surface-on-primary))] text-[var(--kol-tone-pressed-fg,var(--kol-surface-primary))]',
  active: `${TONE} text-fg`,
  trail: 'bg-oq-08 text-fg',
}

export default function OptionRow({
  as: Tag = 'div',
  size = 'md',
  type,
  active = false,
  selected = false,
  trail = false,
  hover = true,
  muted = false,
  icon,
  leading,
  label,
  hint,
  trailing,
  className = '',
  children,
  ...rest
}) {
  const state = selected ? ROW_FILL.selected : active ? ROW_FILL.active : trail ? ROW_FILL.trail
    : `${muted ? 'text-fg-48' : 'text-fg-80'}${hover ? ` hover:${TONE}` : ''}`
  const lead = leading ?? (icon && <Icon name={icon} size={glyphSize(size)} />)
  return (
    <Tag
      className={`flex items-center gap-2 px-4 border border-transparent ${ROW_HEIGHT[size] ?? ROW_HEIGHT.md} rounded-[var(--kol-radius-sm)] cursor-pointer text-left ${type ?? ROW_TYPE[size] ?? ROW_TYPE.md} transition-colors ${state} ${className}`.trim()}
      {...rest}
    >
      {/* the glyph takes the row's ink when selected — a grey mark on a white fill reads as a hole */}
      {lead && <span aria-hidden="true" className={`flex shrink-0${selected ? '' : ' text-oq-48'}`}>{lead}</span>}
      {/* ONE LINE (user 2026-09-30): the hint sits beside the label on its baseline, right-aligned,
       * so the names read as one column and a long name never pushes the path around */}
      <span className="flex flex-1 items-baseline gap-3 min-w-0">
        <span className="truncate">{label ?? children}</span>
        {hint && <span className={`kol-mono-12 ml-auto truncate${selected ? ' opacity-60' : ' text-fg-48'}`}>{hint}</span>}
      </span>
      {trailing && <span className="flex shrink-0 items-center">{trailing}</span>}
    </Tag>
  )
}
