import { useState } from 'react'
import { SortControls } from '@kolkrabbi/kol-component'

const OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' },
  { value: 'size', label: 'Size' },
  { value: 'kind', label: 'Kind' },
]

/* one state write per click: an inactive field becomes the sort, ascending;
 * the active field flips its direction */
export default function SortControlsDemo() {
  const [sort, setSort] = useState({ sortBy: 'date', sortDir: 'desc' })
  const onSort = (field) =>
    setSort((s) => (s.sortBy === field ? { ...s, sortDir: s.sortDir === 'asc' ? 'desc' : 'asc' } : { sortBy: field, sortDir: 'asc' }))
  return <SortControls options={OPTIONS} sortBy={sort.sortBy} sortDir={sort.sortDir} onSort={onSort} />
}
