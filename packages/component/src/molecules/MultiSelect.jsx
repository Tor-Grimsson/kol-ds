import { IconLoader } from '@kolkrabbi/kol-icons'
import { MenuRow } from './MenuItem.jsx'
import { Menu } from './Menu.jsx'
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
 * @param {'start'|'end'} [align='start']  the panel's edge flush with the trigger's
 * @param {string}   [className]
 */
const SIZE_TYPE = { xs: 'kol-mono-8', sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }
/* the rows are Dropdown's rows, the same face, padding and height at every size (plan-2026-10-31-menu-engine W1.3 —
 * user: *"mutliple clashing styles in one component — different paddings, alignment off, differnt opacity[ink]"*) */
const ROW = { xs: 'kol-mono-8 px-1 h-[var(--kol-ctl-xs)]', sm: 'kol-mono-12 px-2 h-[var(--kol-ctl-sm)]', md: 'kol-mono-14 px-3 h-[var(--kol-ctl-md)]', lg: 'kol-mono-16 px-4 h-[var(--kol-ctl-lg)]' }

/* `Menu` with columns (W1.3): the trigger is Dropdown's, the panel the menu panel, each column a pick-one list whose
 * current row wears the dot (• for a single pick, W2). The panel opens from the trigger's start edge. */
export default function MultiSelect({ groups = [], value = {}, onChange, label, size = 'sm', align = 'start', defaultOpen = false, className = '' }) {
  const labelOf = (g) => g.options.find((o) => o.value === value[g.id])?.label ?? value[g.id]
  return (
    <Menu
      align={align}
      role="dialog"
      defaultOpen={defaultOpen}
      closeOnSelect={false}
      rootClassName={`relative inline-block align-middle ${className}`.trim()}
      trigger={({ open, props }) => (
        <button
          {...props}
          type="button"
          className={`kol-btn kol-btn-${size} ${SIZE_TYPE[size] ?? SIZE_TYPE.sm} kol-dd-trigger`}
          aria-haspopup="dialog"
          aria-expanded={open}
          data-state={open ? 'open' : 'closed'}
        >
          <span className="kol-dd-label"><span>{label ?? groups.map(labelOf).filter(Boolean).join(' · ')}</span></span>
          <IconLoader name="chevron-down" size={indicatorSize(size)} className="kol-dd-caret" />
        </button>
      )}
    >
      <div className="flex gap-2">
        {groups.map((g) => (
          <div key={g.id} role="listbox" aria-label={g.label} className="flex min-w-32 flex-col">
            <div className={`${ROW[size] ?? ROW.sm} flex shrink-0 items-center text-meta`}>{g.label}</div>
            {g.options.map((o) => (
              <MenuRow key={o.value} hover={false} size={size} rowClass={ROW[size] ?? ROW.sm}
                onClick={() => onChange?.(g.id, o.value)}
                indicator={o.value === value[g.id] ? 'dot' : undefined}>
                {o.label ?? o.value}
              </MenuRow>
            ))}
          </div>
        ))}
      </div>
    </Menu>
  )
}
