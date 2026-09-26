import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { PopoverPanel, usePopover, Tooltip } from '../utilities/Popover.jsx'
import { glyphSize } from '../hooks/glyphLadders.js'

/**
 * SplitToolButton — single-trigger split tool button + variant menu (the
 * tool-palette idiom: Select · Text · [Shape ◢] · Pattern). A pinned-square
 * quiet/pressed trigger shows the current variant while the group is `active`
 * (else the `lastPicked` variant) plus a corner fold indicator; ONE click both
 * arms that variant (`onChange`) and opens the variant menu (floating-ui's own
 * click handling), so the user can immediately re-pick. Menu rows show ✓ on
 * the active variant, else the variant's shortcut.
 *
 * The trigger is a plain `kol-btn` element, not DS Button: Button doesn't
 * forward refs (the popover must anchor on the real button), can't host the
 * corner fold inside its own box, and `blurOnClick` must blur the button
 * itself. The class output — kol-btn kol-btn-ghost kol-btn-icon kol-btn-{size}
 * + kol-btn-quiet / kol-btn-pressed — is exactly what
 * `<Button variant="ghost" quiet pressed iconOnly>` emits, so the box and the
 * visual contract stay Button's.
 *
 * `size` was a raw px number (28) with a transcribed 14px glyph until 0.182.0:
 * off the 22 · 26 · 32 · 40 ladder in a set whose whole point is that one row
 * is one box, and the glyph pinned where the SOLO ladder should have decided
 * it. kol-fxr's tool rail hand-rolls this trigger at 36/22 rather than
 * importing it (design-editor-set-is-a-half-port, 2026-09-03) — 36 is not a
 * rung either, and the DS answer to a bespoke 36 is `size="lg"`.
 *
 * For a text-trigger single-select use `Dropdown`; for the two-button
 * action-half + chevron-half split use `ShapeDropdown`.
 *
 * WHY THIS IS STILL ITS OWN COMPONENT, after `Dropdown` grew the icon-only
 * square trigger it was asked to (2026-09-03, `editor-set-is-behind-its-
 * source`). The ticket's premise — *"it hand-rolls a `<button>` re-emitting
 * Button's classes"* — is gone: since 0.182.0 this wears
 * `kol-btn-icon kol-btn-{size}`, the same class output at the same rungs, so
 * there is no second implementation of the box left to collapse. What remains
 * is ONE behaviour Dropdown does not have and should not grow for one caller:
 * a click on the trigger both ARMS the last-picked variant and opens the menu,
 * so a tool is selected and re-pickable in one gesture. Dropdown is a
 * controlled select — its trigger opens, it does not choose — and giving it an
 * `onTriggerClick` seam to serve this would be a seam for exactly one consumer.
 * Two components, one class output, one popover utility, one glyph ladder: the
 * duplication the ticket named is closed, and the difference that is left is
 * real. What DID move to Dropdown is the part that generalises — per-option
 * `icon` and `shortcut` rows, which any menu wants.
 *
 * @param {Object} props
 * @param {{id: string, label: string, icon: string, shortcut?: string}[]} props.variants - Variants: menu rows + trigger glyph
 * @param {string} props.value - Active variant id (controlled)
 * @param {Function} props.onChange - Fires with a variant id — on menu pick, and on trigger click while inactive (arming)
 * @param {string} props.lastPicked - Variant id the trigger shows while the group is inactive (default: variants[0])
 * @param {boolean} props.active - Whether this tool group is the active tool — lit trigger, `aria-pressed`
 * @param {'xs'|'sm'|'md'|'lg'} props.size - Trigger box on the pinned-square ladder — 22 · 26 · 32 · 40 (default: 'md'). The glyph follows the SOLO ladder; it is never set at the call site
 * @param {boolean} props.blurOnClick - Blur the trigger after click so a canvas can reclaim focus and refresh its cursor (default: false)
 * @param {Function} props.onTrigger - Replaces the trigger's arm: fires with the trigger variant's id on every click. For a fold of one-shot ACTIONS (Boolean: the trigger re-runs the last-picked op) — no pressed state is implied (default: arm via `onChange`)
 * @param {boolean} props.disabled - Disables the trigger — `.kol-btn:disabled` dims it (default: false)
 * @param {ElementType} props.iconComponent - Glyph renderer receiving `{ name, size, className, style }` — Button's seam (default: DS `Icon`)
 * @param {string} props.aria-label - Trigger label fallback when no variant resolves
 *
 * A variant may carry its own `onSelect()` — that row does its own thing instead of `onChange`
 * (Text: "Text" arms the tool, "Kinetic type" inserts a layer). Without `lastPicked` the trigger
 * remembers the last row picked from the menu (kol-fxr ToolPalette, editor-panels-the-held-specs A3).
 * @param {string} props.className - Additional classes on the trigger
 */

/* Corner fold marker — `fold-indicator`, promoted into kol-icon-set-v1
 * 2026-09-03 from kol-fxr's own drawing (editor-set-is-behind-its-source); the
 * comment that stood here said it did not exist yet and should be promoted, so
 * this is that. Lives inside the button so it dims with kol-btn-quiet and
 * inverts with kol-btn-pressed (currentColor). */
const FoldIndicator = () => (
  <span aria-hidden="true" className="pointer-events-none absolute right-0.5 bottom-0.5 opacity-70 inline-flex">
    <Icon name="fold-indicator" size={4} />
  </span>
)

const SplitToolButton = ({
  variants = [],
  value,
  onChange,
  lastPicked,
  active = false,
  size = 'md',
  blurOnClick = false,
  onTrigger,
  disabled = false,
  iconComponent: IconC = Icon,
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

  const [ownLast, setOwnLast] = useState(null)
  const byId = (id) => variants.find((v) => v.id === id)
  const triggerVariant = (active && byId(value)) || byId(lastPicked ?? ownLast) || variants[0]
  const label = triggerVariant?.label ?? ariaLabel
  const title = triggerVariant?.shortcut ? `${label} (${triggerVariant.shortcut})` : label

  /* Arm the last-picked variant on the same click that toggles the menu —
   * floating-ui's useClick (on the reference) handles the open/close half. */
  const handleTriggerClick = (event) => {
    if (onTrigger) { if (triggerVariant) onTrigger(triggerVariant.id) }
    else if (!active && triggerVariant) onChange?.(triggerVariant.id)
    if (blurOnClick) event.currentTarget.blur()
  }

  const handleSelect = (variant) => {
    if (variant.onSelect) variant.onSelect()
    else { onChange?.(variant.id); setOwnLast(variant.id) }
    setOpen(false)
  }

  return (
    <>
      <Tooltip label={title} asChild>
      <button
        ref={popover.refs.setReference}
        {...popover.getReferenceProps({ onClick: handleTriggerClick })}
        type="button"
        className={`relative kol-btn kol-btn-ghost kol-btn-icon kol-btn-${size} ${active ? 'kol-btn-pressed' : 'kol-btn-quiet'} ${className}`.trim()}
        disabled={disabled}
        aria-pressed={onTrigger ? undefined : active}
        aria-label={label}
      >
        {triggerVariant && <IconC name={triggerVariant.icon} size={glyphSize(size, true)} />}
        <FoldIndicator />
      </button>
      </Tooltip>
      {/* w-max — floats size to content, the menu-family law (2026-08-09). */}
      <PopoverPanel
        popover={popover}
        panel={false}
        focus={false}
        className="w-max bg-surface-secondary border border-fg-08 rounded shadow-lg"
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
                <IconC name={variant.icon} size={14} />
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
