import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { PopoverPanel, usePopover } from '../atoms/Popover.jsx'

/**
 * SplitToolButton — single-trigger split tool button + variant menu (the
 * tool-palette idiom: Select · Text · [Shape ◢] · Pattern). A 28×28
 * quiet/pressed trigger shows the current variant while the group is `active`
 * (else the `lastPicked` variant) plus a corner fold indicator; ONE click both
 * arms that variant (`onChange`) and opens the variant menu (floating-ui's own
 * click handling), so the user can immediately re-pick. Menu rows show ✓ on
 * the active variant, else the variant's shortcut.
 *
 * The trigger is a plain `kol-btn` element, not DS Button: Button doesn't
 * forward refs (the popover must anchor on the real button), can't host the
 * corner fold inside its own box, and `blurOnClick` must blur the button
 * itself. The class output — kol-btn kol-btn-ghost + kol-btn-quiet /
 * kol-btn-pressed — is exactly what `<Button variant="ghost" quiet pressed>`
 * emits, so the visual contract stays Button's.
 *
 * For a text-trigger single-select use `Dropdown`; for the two-button
 * action-half + chevron-half split use `ShapeDropdown`.
 *
 * @param {Object} props
 * @param {{id: string, label: string, icon: string, shortcut?: string}[]} props.variants - Variants: menu rows + trigger glyph
 * @param {string} props.value - Active variant id (controlled)
 * @param {Function} props.onChange - Fires with a variant id — on menu pick, and on trigger click while inactive (arming)
 * @param {string} props.lastPicked - Variant id the trigger shows while the group is inactive (default: variants[0])
 * @param {boolean} props.active - Whether this tool group is the active tool — lit trigger, `aria-pressed`
 * @param {number} props.size - Trigger box in px (default: 28)
 * @param {boolean} props.blurOnClick - Blur the trigger after click so a canvas can reclaim focus and refresh its cursor (default: false)
 * @param {string} props.aria-label - Trigger label fallback when no variant resolves
 * @param {string} props.className - Additional classes on the trigger
 */

/* Corner fold marker. `tool-fold-indicator` doesn't exist in kol-icons yet —
 * icon-set candidate; inline until promoted. Lives inside the button so it
 * dims with kol-btn-quiet and inverts with kol-btn-pressed (currentColor). */
const FoldIndicator = () => (
  <svg
    aria-hidden="true"
    width={4}
    height={4}
    viewBox="0 0 4 4"
    className="pointer-events-none absolute right-0.5 bottom-0.5 opacity-70"
  >
    <path d="M4 0v4H0z" fill="currentColor" />
  </svg>
)

const SplitToolButton = ({
  variants = [],
  value,
  onChange,
  lastPicked,
  active = false,
  size = 28,
  blurOnClick = false,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const [open, setOpen] = useState(false)
  const popover = usePopover({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    offset: 4,
    role: 'menu',
  })

  const byId = (id) => variants.find((v) => v.id === id)
  const triggerVariant = (active && byId(value)) || byId(lastPicked) || variants[0]
  const label = triggerVariant?.label ?? ariaLabel
  const title = triggerVariant?.shortcut ? `${label} (${triggerVariant.shortcut})` : label

  /* Arm the last-picked variant on the same click that toggles the menu —
   * floating-ui's useClick (on the reference) handles the open/close half. */
  const handleTriggerClick = (event) => {
    if (!active && triggerVariant) onChange?.(triggerVariant.id)
    if (blurOnClick) event.currentTarget.blur()
  }

  const handleSelect = (variant) => {
    onChange?.(variant.id)
    setOpen(false)
  }

  return (
    <>
      <button
        ref={popover.refs.setReference}
        {...popover.getReferenceProps({ onClick: handleTriggerClick })}
        type="button"
        className={`relative kol-btn kol-btn-ghost ${active ? 'kol-btn-pressed' : 'kol-btn-quiet'} ${className}`.trim()}
        style={{ width: size, height: size, padding: 6 }}
        aria-pressed={active}
        aria-label={label}
        title={title}
      >
        {triggerVariant && <Icon name={triggerVariant.icon} size={14} />}
        <FoldIndicator />
      </button>
      <PopoverPanel
        popover={popover}
        panel={false}
        focus={false}
        className="bg-surface-secondary border border-fg-08 rounded shadow-lg"
      >
        {variants.map((variant) => {
          const isActive = active && variant.id === value
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => handleSelect(variant)}
              className="w-full kol-helper-12 px-3 h-8 inline-flex items-center gap-2 text-body hover:text-emphasis text-left"
            >
              <span className="shrink-0 w-4 inline-flex items-center justify-center">
                <Icon name={variant.icon} size={14} />
              </span>
              <span className="flex-1 truncate">{variant.label}</span>
              <span className="kol-helper-10 text-emphasis shrink-0">
                {isActive ? '✓' : variant.shortcut}
              </span>
            </button>
          )
        })}
      </PopoverPanel>
    </>
  )
}

export default SplitToolButton
