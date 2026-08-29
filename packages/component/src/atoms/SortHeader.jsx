import { Icon } from '@kolkrabbi/kol-icons'

/**
 * SortHeader — one sortable field: label + direction arrow. Strip chrome, verbatim
 * from kol-r2b2's FileList (ContentFiltersCollection, 2026-08-27): `kol-helper-12`,
 * uppercase label, `letterSpacing: 1`, `select-none`; active `text-oq-96`, rest
 * `text-oq-48 hover:text-oq-64`. The arrow renders ONLY on the active field —
 * arrow-down = ascending (1→N, A→Z, oldest→newest), arrow-up = descending.
 *
 * @param {ReactNode} label     the field's label (rendered uppercase)
 * @param {boolean}   active    this field is the current sort
 * @param {'asc'|'desc'} dir    direction, read only when active
 * @param {Function}  onClick   () => void
 * @param {string}    className extra classes on the button
 */
export default function SortHeader({ label, active = false, dir = 'asc', onClick, className = '', ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`kol-helper-12 flex items-center gap-1 select-none transition-colors ${active ? 'text-oq-96' : 'text-oq-48 hover:text-oq-64'} ${className}`.replace(/\s+/g, ' ').trim()}
      style={{ letterSpacing: 1 }}
      {...props}
    >
      {typeof label === 'string' ? label.toUpperCase() : label}
      {active && <Icon name={dir === 'asc' ? 'arrow-down' : 'arrow-up'} size={10} />}
    </button>
  )
}
