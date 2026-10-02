import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { MenuDropdownItem } from './MenuItem.jsx'
import { PopoverPanel, usePopover } from '../utilities/Popover.jsx'
import { indicatorSize } from '../hooks/glyphLadders.js'

/**
 * MultiSelect — Several settings in one dropdown. closed it is the Dropdown's trigger, reading the
 * current value of every setting; open it is a popover with one column per setting, each under
 * its name, and it stays open while you pick across columns.
 *
 * WHY IT EXISTS (user, 2026-10-01, on the preview card's knob bar — variant, tone and size as
 * three controls in a row: *"or make a new component with multi select dropdown toggle, like an
 * 'overlay multi settings' component"*, then on the first mock: *"it should popover … I want this
 * component available for further development"*). First cut — the shape is open.
 *
 * Each setting is pick-one; the component holds several of them. For many-of-N in one list use
 * `SettingsMulti`; for one setting use `Dropdown`.
 *
 * @param {Array}    groups     `[{ id, label, options: [{ value, label }] }]` — one column each
 * @param {Object}   value      `{ [group.id]: value }` (controlled)
 * @param {Function} onChange   `(groupId, value) => void`
 * @param {ReactNode} [label]   the trigger's text; default is every current value, joined
 * @param {'xs'|'sm'|'md'|'lg'} [size='sm']
 * @param {string}   [className]
 */
const SIZE_TYPE = { xs: 'kol-mono-8', sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }

export default function MultiSelect({ groups = [], value = {}, onChange, label, size = 'sm', defaultOpen = false, className = '' }) {
  const [open, setOpen] = useState(defaultOpen)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-start', offset: 4, role: 'dialog' })
  const labelOf = (g) => g.options.find((o) => o.value === value[g.id])?.label ?? value[g.id]
  return (
    <div className={`relative inline-block align-middle ${className}`.trim()}>
      <button
        ref={popover.refs.setReference}
        {...popover.getReferenceProps()}
        type="button"
        className={`kol-btn kol-btn-${size} ${SIZE_TYPE[size] ?? SIZE_TYPE.sm} kol-dd-trigger`}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-state={open ? 'open' : 'closed'}
      >
        <span className="kol-dd-label"><span>{label ?? groups.map(labelOf).filter(Boolean).join(' · ')}</span></span>
        <Icon name="chevron-down" size={indicatorSize(size)} className="kol-dd-caret" />
      </button>
      <PopoverPanel popover={popover} className="w-max p-1">
        <div className="flex">
          {groups.map((g) => (
            <div key={g.id} role="listbox" aria-label={g.label} className="flex min-w-32 flex-col">
              {/* the columns touch, so the headings' rules read as one line */}
              <div className="kol-helper-12 mb-1 flex h-8 shrink-0 items-center border-b border-oq-08 px-3 text-meta">{g.label}</div>
              {g.options.map((o) => (
                <MenuDropdownItem
                  key={o.value}
                  hover={false}
                  size={size}
                  onClick={() => onChange?.(g.id, o.value)}
                  shortcut={o.value === value[g.id] ? <Icon name="check" size={11} /> : null}
                >
                  {o.label ?? o.value}
                </MenuDropdownItem>
              ))}
            </div>
          ))}
        </div>
      </PopoverPanel>
    </div>
  )
}
