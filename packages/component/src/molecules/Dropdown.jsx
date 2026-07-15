import { useEffect, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { MenuDropdownItem } from './MenuItem.jsx'
import { PopoverPanel, usePopover } from '../atoms/Popover.jsx'

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
 */

const SIZE_TYPE = { sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }
const ICON_SIZE = { sm: 14, md: 16, lg: 18 }

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
  const [resolvedSize, setResolvedSize] = useState('md')
  const [dropdownWidth, setDropdownWidth] = useState('100px')

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

  useEffect(() => {
    const determineSize = () => {
      if (size) {
        setResolvedSize(size)
        return
      }

      if (typeof window === 'undefined') {
        setResolvedSize('md')
        return
      }

      if (window.innerWidth >= 1024) {
        setResolvedSize('lg')
      } else if (window.innerWidth >= 768) {
        setResolvedSize('md')
      } else {
        setResolvedSize('sm')
      }
    }

    determineSize()
    window.addEventListener('resize', determineSize)

    return () => {
      window.removeEventListener('resize', determineSize)
    }
  }, [size])

  // Width management — 100px mobile, 140px tablet, 180px desktop
  useEffect(() => {
    const updateWidth = () => {
      if (typeof window === 'undefined') return

      if (window.innerWidth >= 1024) {
        setDropdownWidth('180px')
      } else if (window.innerWidth >= 768) {
        setDropdownWidth('140px')
      } else {
        setDropdownWidth('100px')
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const handleSelect = (option) => {
    onChange?.(option.value)
    setIsOpen(false)
  }

  const currentOption = options.find((opt) => opt.value === value) || options[0]

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
    <div
      className={`relative block ${className}`}
      style={{
        ...(dropdownWidth && !className.includes('w-full') && {
          width: dropdownWidth,
          minWidth: dropdownWidth
        })
      }}
    >
      <button
        ref={popover.refs.setReference}
        {...popover.getReferenceProps()}
        type="button"
        className={triggerCls}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        data-state={isOpen ? 'open' : 'closed'}
      >
        <span>{currentOption?.label}</span>
        <Icon
          name="chevron-down"
          size={ICON_SIZE[resolvedSize]}
          className="ml-auto"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 300ms',
          }}
        />
      </button>

      <PopoverPanel
        popover={popover}
        panel={false}
        focus={false}
        className={`kol-dd-panel kol-dd-panel--${resolvedVariant}`}
      >
        {(resolvedVariant === 'primary' || resolvedVariant === 'grey') && <div className="kol-dd-div" />}

        <div className="flex max-h-[300px] flex-col items-stretch overflow-y-auto" role="listbox">
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
