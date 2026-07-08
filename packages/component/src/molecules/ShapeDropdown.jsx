import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import { PopoverPanel, usePopover } from '../atoms/Popover.jsx'
import { MenuDropdownItem } from './MenuItem.jsx'

/**
 * ShapeDropdown — split icon-button + variant-menu molecule (the tool-palette
 * idiom: Select · Text · [Shape ▾] · Pattern). The main button reflects the
 * current variant and fires `onAction` with its id; the chevron half opens a
 * menu of all variants — picking one fires `onChange` and closes.
 *
 * Composed from Button (both trigger halves), usePopover/PopoverPanel (menu
 * positioning, dismiss, portal) and MenuDropdownItem (rows — same rows as the
 * Dropdown molecule, ✓ marks the active variant).
 *
 * For single-value list selection with a text trigger use `Dropdown`; this is
 * for tool bars where the trigger is itself an action.
 *
 * @param {Object} props
 * @param {{id: string, label: string, icon?: string}[]} props.options - Variants: menu rows + trigger glyph. `icon` optional — the trigger falls back to the label.
 * @param {string} props.value - Active variant id (controlled)
 * @param {Function} props.onChange - Fires with the picked variant id (menu selection)
 * @param {Function} props.onAction - Fires with the current variant id (main-button click)
 * @param {string} props.className - Additional classes on the wrapper
 */
const ShapeDropdown = ({ options = [], value, onChange, onAction, className = '' }) => {
  const [open, setOpen] = useState(false)
  const popover = usePopover({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    offset: 4,
    role: 'menu',
  })

  const current = options.find((option) => option.id === value) || options[0]

  const handleSelect = (option) => {
    onChange?.(option.id)
    setOpen(false)
  }

  return (
    <div className={`inline-flex items-center ${className}`.trim()}>
      {current?.icon ? (
        <Button
          variant="ghost"
          size="sm"
          quiet
          iconOnly={current.icon}
          aria-label={current.label}
          title={current.label}
          onClick={() => onAction?.(current.id)}
        />
      ) : (
        <Button variant="ghost" size="sm" quiet onClick={() => onAction?.(current?.id)}>
          {current?.label}
        </Button>
      )}
      {/* Button doesn't forward refs — anchor the popover on a span wrapper,
       * same pattern as Tooltip in atoms/Popover.jsx. Clicks on the inner
       * button bubble to the span, where useClick toggles the menu. */}
      <span
        ref={popover.refs.setReference}
        {...popover.getReferenceProps()}
        className="inline-flex"
      >
        <Button variant="ghost" size="sm" quiet iconOnly="chevron-down" iconSize={10} aria-label="Variants" />
      </span>
      <PopoverPanel
        popover={popover}
        panel={false}
        focus={false}
        className="bg-surface-secondary border border-fg-08 rounded shadow-lg"
      >
        {options.map((option) => (
          <MenuDropdownItem
            key={option.id}
            onClick={() => handleSelect(option)}
            iconLeft={option.icon ? <Icon name={option.icon} size={14} /> : undefined}
            shortcut={option.id === current?.id ? <Icon name="check" size={11} /> : undefined}
          >
            {option.label}
          </MenuDropdownItem>
        ))}
      </PopoverPanel>
    </div>
  )
}

export default ShapeDropdown
