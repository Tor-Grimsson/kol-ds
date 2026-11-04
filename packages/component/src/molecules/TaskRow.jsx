import { Icon } from '@kolkrabbi/kol-icons'
import ToggleCheckbox from '../atoms/ToggleCheckbox.jsx'

/* taxonomy-ok: molecule — nests ToggleCheckbox (atom) + kol-icons's Icon. */

/**
 * TaskRow — A task: check · title · date chip. `Design the Tasks tab · 2026-07-01` (float-everything W8 row 118,
 * 2026-11-04 — kol-float--style 48:3522). The float ToggleCheckbox, the title in `kol-float-body-lg` on the emphasis
 * ink (fg-48 and struck once done), and the date as a chip at the right: a capsule on the well (`--kol-float-well`,
 * the field's ground) at the float md height, the calendar glyph on oq-64, the date in `kol-float-timecode`. `onDate`
 * makes the chip a button (open your date picker there); without it the chip is a label. Lists end in an
 * `InlineAddRow variant="float"` — the panel's `+ New brief`.
 *
 * @param {ReactNode} title
 * @param {string}    [date]
 * @param {boolean}   [done] · {Function} [onDone]
 * @param {Function}  [onDate]
 * @param {Function}  [onClick]  the title's press
 * @param {string}    [className]
 */
export default function TaskRow({ title, date, done = false, onDone, onDate, onClick, className = '' }) {
  const Chip = onDate ? 'button' : 'span'
  return (
    <div className={`flex min-h-[var(--kol-float-h-md)] w-full items-center gap-3 ${className}`.trim()}>
      <ToggleCheckbox variant="float" checked={done} onChange={onDone} aria-label="Done" className="shrink-0" />
      <span
        onClick={onClick}
        className={`kol-float-body-lg min-w-0 flex-1 truncate ${onClick ? 'cursor-pointer' : ''} ${done ? 'text-fg-48 line-through' : 'text-fg-emphasis'}`.trim()}
      >
        {title}
      </span>
      {date && (
        <Chip
          {...(onDate ? { type: 'button', onClick: onDate } : {})}
          className={`inline-flex h-[var(--kol-float-h-md)] shrink-0 items-center gap-2 rounded-full bg-[var(--kol-float-well)] px-4 ${onDate ? 'cursor-pointer hover:bg-fg-08 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]' : ''}`.trim()}
        >
          <Icon name="calendar" size={14} className="text-oq-64" />
          <span className="kol-float-timecode tabular-nums text-fg-64">{date}</span>
        </Chip>
      )}
    </div>
  )
}
