import SortHeader from '../atoms/SortHeader.jsx'

/**
 * SortControls — the sortable-header group (ContentFiltersCollection, kol-r2b2
 * 2026-08-27): `flex items-center gap-4` of SortHeaders. Click an inactive field
 * → it becomes the sort, ASCENDING; click the active field → the direction
 * flips. `onSort(field)` fires once per click — the consumer writes ONE state
 * (two setter calls spreading the same stale state clobbered each other in the
 * original; the fixed reference is in the ticket).
 *
 * @param {{value: string, label: ReactNode}[]} options  the fields
 * @param {string}   sortBy    the active field's value
 * @param {'asc'|'desc'} sortDir
 * @param {Function} onSort    (field) => void
 * @param {string}   className extra classes on the group
 */
export default function SortControls({ options = [], sortBy, sortDir = 'asc', onSort = () => {}, className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`.trim()}>
      {options.map((opt) => (
        <SortHeader
          key={opt.value}
          label={opt.label}
          active={sortBy === opt.value}
          dir={sortDir}
          onClick={() => onSort(opt.value)}
        />
      ))}
    </div>
  )
}
