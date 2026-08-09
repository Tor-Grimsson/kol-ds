import { useEffect, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { MenuDropdownItem } from './MenuItem.jsx'
import { PopoverPanel, usePopover } from '../atoms/Popover.jsx'
import { indicatorSize } from '../hooks/glyphLadders.js'

/**
 * Dropdown — trigger IS button chrome (2026-07-08 chrome law).
 *
 * The trigger emits `kol-btn kol-btn-{variant} kol-btn-{size}` so it renders
 * pixel-identical to a Button of the same variant/size — fills, hover,
 * active, focus ring all come from the button rules in kol-theme.
 * `.kol-dd-*` classes only add trigger layout + the open/panel fusion.
 *
 *   variant="primary" (default) — filled trigger; open panel continues the
 *     same fill (one piece: no border, no gap, hairline divider inside)
 *   variant="grey"              — oq-12 filled trigger (opaque per the fill
 *                                 law); panel continues it
 *   variant="outline"           — bordered trigger; open panel carries the
 *     same border, trigger's bottom edge acts as the divider
 *
 * Legacy aliases (pre-law variants, kept so call-sites don't break):
 *   default → primary · subtle → primary · minimal → outline
 *
 * Size: dropdowns are `sm` at EVERY viewport unless the consumer passes an
 * explicit `size` prop (user law 2026-07-28 — desktop is sm, always, and
 * smaller viewports never resolve larger than desktop). The old auto-ramp
 * (lg ≥1024 / md ≥768 / sm below) is gone.
 */

const SIZE_TYPE = { sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }
/* Caret size comes from the INDICATOR ladder (glyphLadders.js) — the private
 * map that lived here was a transcription of ADJACENT, which is the wrong
 * ladder for a decoration: it put a caret one rung HEAVIER than the label
 * beside it (2026-08-09 user call). */

const LEGACY_VARIANTS = { default: 'primary', subtle: 'primary', minimal: 'outline' }

const Dropdown = ({
  options = [],
  value,
  onChange,
  size,
  variant = 'primary',
  defaultOpen = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // sm everywhere unless explicitly overridden (see docblock size law).
  const resolvedSize = size || 'sm'

  const resolvedVariant = LEGACY_VARIANTS[variant] || variant

  /* Floating-ui popover. `flip: false` keeps the panel below the button
   * — the seamless fused edge between trigger and panel assumes the panel
   * sits below; flipping above would visually disconnect them.
   * `matchReferenceWidth: true` pins panel min-width to the button. */
  const popover = usePopover({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    offset: -1,
    flip: false,
    matchReferenceWidth: true,
    role: 'listbox',
  })

  /* Width belongs to the CALL SITE (2026-08-09 user call — "width without any
   * regard to context"). The viewport-keyed resize listener that handed every
   * dropdown a fixed width by window size is gone: default is hug-content,
   * and the consumer sizes it through className exactly as on Input. The open
   * panel follows the trigger via matchReferenceWidth either way. */

  const handleSelect = (option) => {
    onChange?.(option.value)
    setIsOpen(false)
  }

  const currentOption = options.find((opt) => opt.value === value) || options[0]

  /* A clamped list (Popover caps the panel to the viewport) can open with the
   * checked row past the fold — scroll it into reach. Keyboard focus after
   * that scrolls natively; the list's children are the option buttons 1:1. */
  const listRef = useRef(null)
  useEffect(() => {
    if (!isOpen) return
    const idx = options.findIndex((opt) => opt.value === currentOption?.value)
    listRef.current?.children[idx]?.scrollIntoView({ block: 'nearest' })
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const triggerCls = [
    'kol-btn',
    /* grey is dropdown-only chrome (2026-07-15) — no kol-btn-* class so it
     * never leaks into Button's variant set */
    resolvedVariant === 'grey' ? 'kol-dd-trigger--grey' : `kol-btn-${resolvedVariant}`,
    `kol-btn-${resolvedSize}`,
    SIZE_TYPE[resolvedSize],
    'kol-dd-trigger',
    isOpen && 'kol-dd-trigger--open',
  ].filter(Boolean).join(' ')

  return (
    <div className={`relative inline-block align-middle ${className}`}>
      <button
        ref={popover.refs.setReference}
        {...popover.getReferenceProps()}
        type="button"
        className={triggerCls}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {/* every option's label rides along hidden so the trigger is as wide
          * as its widest value — the panel matches the trigger's width, so
          * trigger and list stay one piece at every selection */}
        <span className="kol-dd-label">
          <span>{currentOption?.label}</span>
          {options.map((option) => (
            <span key={option.value} className="kol-dd-ghost" aria-hidden="true">
              {option.label}
            </span>
          ))}
        </span>
        {/* chrome lives in .kol-dd-caret (trailing edge + open-state flip) —
          * keyed off the trigger's data-state, no inline styles */}
        <Icon name="chevron-down" size={indicatorSize(resolvedSize)} className="kol-dd-caret" />
      </button>

      <PopoverPanel
        popover={popover}
        panel={false}
        focus={false}
        className={`kol-dd-panel kol-dd-panel--${resolvedVariant}`}
      >
        {(resolvedVariant === 'primary' || resolvedVariant === 'grey') && <div className="kol-dd-div" />}

        <div ref={listRef} className="kol-dd-list" role="listbox">
          {options.map((option) => {
            const isActive = option.value === currentOption?.value
            return (
              <MenuDropdownItem
                key={option.value}
                onClick={() => handleSelect(option)}
                shortcut={isActive ? <Icon name="check" size={11} /> : undefined}
              >
                {option.label}
              </MenuDropdownItem>
            )
          })}
        </div>
      </PopoverPanel>
    </div>
  )
}

export default Dropdown
