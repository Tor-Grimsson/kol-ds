/** TaskCard — a task as a row: a checkbox, the title, its group under it, a date pill at the right (float-everything W7
 * row 112, 2026-11-04; the exploration's "Design the Tasks tab · Brief · 2026-07-01").
 *
 * `size="lg"` (default) is the card: title in Inter window, `group` under it, the `date` in a mono well pill, 8 radius
 * (`--kol-float-list-r`); `selected` lifts it to fg-16 (W0.3). `size="sm"` is the row inside a group card (rows 98 ·
 * 99 · 101): title in body, `date` or a `chip` ("S" — a size) at the right. `done` + `onToggle` drive the checkbox;
 * `onClick` makes the row itself pressable. */
import { ToggleCheckbox } from '@kolkrabbi/kol-component'
import { PRESS, WELL } from './_shared/float.js'

export default function TaskCard({ title, group, date, chip, done = false, onToggle, selected = false, onClick, size = 'lg', className = '' }) {
  const lg = size === 'lg'
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} aria-pressed={onClick ? selected : undefined}
      className={`flex items-start gap-4 min-w-0 text-left w-full rounded-[var(--kol-float-list-r)] ${lg ? 'px-5 py-6' : 'py-1'} ${onClick ? PRESS : ''} ${className}`.trim()}
      style={selected ? { background: 'var(--kol-fg-16)' } : undefined}>
      <ToggleCheckbox checked={done} onChange={onToggle} className={lg ? 'mt-1' : 'mt-0.5'} aria-label={`Mark ${title} done`} />
      <span className="flex-1 min-w-0 flex flex-col gap-1">
        <span className={`${lg ? 'kol-float-window' : 'kol-float-body'} text-fg-96 ${lg ? '' : 'truncate'}`}>{title}</span>
        {group && <span className="kol-float-label text-fg-64">{group}</span>}
      </span>
      {date && (
        lg
          ? <span className="kol-float-timecode text-fg-64 h-9 px-6 inline-flex items-center rounded-full shrink-0" style={WELL}>{date}</span>
          : <span className="kol-float-timecode text-fg-64 shrink-0">{date}</span>
      )}
      {chip && <span className="kol-float-timecode text-fg-64 h-7 min-w-8 px-3 inline-flex items-center justify-center rounded-[var(--kol-float-list-r)] shrink-0" style={WELL}>{chip}</span>}
    </Tag>
  )
}
