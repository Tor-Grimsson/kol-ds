import { useState } from 'react'
import SearchInput from './SearchInput.jsx'
import { MenuDropdownItem } from './MenuItem.jsx'
import { PopoverPanel, usePopover } from '../utilities/Popover.jsx'

/**
 * Combobox — A searchable value field: type to filter, pick a row. (MetricDashboardUpstream, kol-website 2026-10-31 —
 * metric's filter-value picker, plausible.io's.) Built from the parts, never a fork of them: the field is `SearchInput`
 * (outline, sm) and the list is `Dropdown`'s own panel (`kol-dd-panel` · `kol-dd-div` · `kol-dd-list`, rows
 * `MenuDropdownItem` at Dropdown's sm row), matched to the field's width and hung 1px under it.
 *
 *   <Combobox value={q} onChange={setQ} options={[{ value: '/blog', label: '/blog' }]} placeholder="Select a value" />
 *
 * `value` is the field's text; picking a row hands its `value` to `onChange`. Rows match on label or value, capped at 50.
 */

/* the row Dropdown sets at sm (Dropdown.jsx ROW.sm) */
const ROW_SM = 'kol-mono-12 px-2 h-[var(--kol-ctl-sm)]'

export default function Combobox({ value, onChange, options = [], placeholder, ariaLabel, className = '' }) {
  const [open, setOpen] = useState(false)
  const popover = usePopover({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    offset: -1,
    flip: false,
    matchReferenceWidth: true,
    click: false,
    role: 'listbox',
  })
  const q = value.toLowerCase()
  const shown = options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)).slice(0, 50)
  return (
    <div ref={popover.refs.setReference} className={`relative ${className}`}>
      <SearchInput
        className="w-full"
        variant="outline"
        size="sm"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onFocus={() => setOpen(true)}
        onChange={(e) => { onChange(e.target?.value ?? e); setOpen(true) }}
        onClear={() => onChange('')}
      />
      <PopoverPanel popover={popover} panel={false} focus={false} className="kol-dd-panel" style={{ '--kol-dd-max-rows': 8, '--kol-dd-row-h': 'var(--kol-ctl-sm)' }}>
        <div className="kol-dd-div" />
        <div className="kol-dd-list" role="listbox">
          {shown.map((o) => (
            <MenuDropdownItem key={o.value} hover={false} size="sm" rowClass={ROW_SM} onClick={() => { onChange(o.value); setOpen(false) }}>
              {o.label}
            </MenuDropdownItem>
          ))}
          {!shown.length && <div className={`${ROW_SM} flex items-center text-meta`}>No matches</div>}
        </div>
      </PopoverPanel>
    </div>
  )
}
