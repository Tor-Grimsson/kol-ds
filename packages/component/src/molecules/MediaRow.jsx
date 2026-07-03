import { SelectIndicator } from './MediaCard.jsx'

/**
 * MediaRow — list row for one media object: optional select checkbox, small
 * thumbnail, name (flex), fixed-width date + size columns, then actions.
 * The list-view counterpart to MediaCard (same slot contract).
 *
 * Presentational — the parent supplies rendered slots; interaction outside
 * select mode lives in the thumb / name / actions slots. Column widths are
 * consumer-tunable via `dateWidth` / `sizeWidth`.
 *
 * @param {ReactNode} thumb       small thumbnail (48px square)
 * @param {ReactNode} name        name cell (plain text or an inline editor)
 * @param {string}    date        right-aligned date column
 * @param {string}    size        right-aligned size column
 * @param {ReactNode} actions     row of action buttons (hidden in select mode)
 * @param {string}    dateWidth   Tailwind width class for the date column
 * @param {string}    sizeWidth   Tailwind width class for the size column
 * @param {boolean}   selectMode  selection mode on → checkbox shown, whole row toggles, actions hidden
 * @param {boolean}   selected    this row is selected (highlight + checked box)
 * @param {Function}  onSelect    (event) => void — row click in select mode; gets shiftKey for range
 */
export default function MediaRow({
  thumb,
  name,
  date,
  size,
  actions,
  dateWidth = 'w-24',
  sizeWidth = 'w-20',
  selectMode = false,
  selected = false,
  onSelect,
}) {
  return (
    <li
      onClick={selectMode ? onSelect : undefined}
      className={`flex items-center gap-3 py-2 border-b ${selectMode ? 'cursor-pointer select-none' : ''} ${selected ? 'bg-fg-08' : ''}`}
      style={{ borderColor: 'var(--kol-fg-08)' }}
    >
      {selectMode && <SelectIndicator on={selected} />}
      <div className="w-12 h-12 shrink-0 rounded overflow-hidden">{thumb}</div>
      <div className="flex-1 min-w-0">{name}</div>
      <p className={`kol-mono-12 text-fg-32 shrink-0 text-right ${dateWidth}`}>{date}</p>
      <p className={`kol-mono-12 text-fg-48 shrink-0 text-right ${sizeWidth}`}>{size}</p>
      {!selectMode && <div className="shrink-0">{actions}</div>}
    </li>
  )
}
