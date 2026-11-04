import ToggleCheckbox from '../atoms/ToggleCheckbox.jsx'

/* taxonomy-ok: molecule — nests ToggleCheckbox (atom). */

/**
 * IndexRow — One line of a dense index: check · title · columns. `□ Design the Tasks tab · Briefs · — · Open`
 * (float-everything W8 row 117, 2026-11-04 — kol-float--style 48:3503). 28 tall on the list radius, 10 in: a float
 * ToggleCheckbox (when `onCheck` is given), the title in `kol-float-hint` on the emphasis ink taking the room, then
 * `cells` — short facts in fixed columns (`kol-float-label` on fg-64; a cell `{ value, mono: true }` is mono, a date or
 * a count). `selected` lifts the row to fg-16; hover lifts it to fg-08. The whole row is the press.
 *
 * @param {ReactNode} title
 * @param {Array<ReactNode|{value: ReactNode, mono?: boolean, width?: number}>} [cells]  each 96 wide unless `width`
 * @param {boolean}   [checked] · {Function} [onCheck]
 * @param {boolean}   [selected]
 * @param {Function}  [onClick]
 * @param {string}    [className]
 */
export default function IndexRow({ title, cells = [], checked = false, onCheck, selected = false, onClick, className = '' }) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(e) } : undefined}
      aria-selected={onClick ? selected : undefined}
      className={`flex h-7 w-full items-center gap-3 rounded-[var(--kol-float-list-r)] px-2.5 ${onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]' : ''} ${selected ? 'bg-fg-16' : 'hover:bg-fg-08'} ${className}`.trim()}
    >
      {onCheck && <span onClick={(e) => e.stopPropagation()} className="inline-flex shrink-0"><ToggleCheckbox variant="float" checked={checked} onChange={onCheck} aria-label="Done" /></span>}
      <span className={`kol-float-hint min-w-0 flex-1 truncate ${checked ? 'text-fg-48' : 'text-fg-emphasis'}`}>{title}</span>
      {cells.map((c, i) => {
        const cell = c && typeof c === 'object' && 'value' in c ? c : { value: c }
        return <span key={i} className={`${cell.mono ? 'kol-float-ruler' : 'kol-float-label'} shrink-0 truncate text-fg-64`} style={{ width: cell.width ?? 96 }}>{cell.value}</span>
      })}
    </div>
  )
}
