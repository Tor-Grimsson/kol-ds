import { useEffect, useRef, useState } from 'react'
import { toneClass } from '../utilities/tone.js'
import { Icon } from '@kolkrabbi/kol-icons'
import { MenuDropdownItem } from './MenuItem.jsx'
import { PopoverPanel, usePopover } from '../utilities/Popover.jsx'
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
 *   tone="inverse"              — the dark chip (`fg-ab-24`) for a washed
 *                                 plane, the panel continuing it (ControlToneInverse,
 *                                 kol-website 2026-08-27); same prop on ViewToggle · Input
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
  tone = 'default',
  /* DropdownGhostWidthAndListHeight (kol-mirror 2026-08-28 — user, on the
   * studio's 30-option Source picker in a ~300px shelf: "1 it's way too tall,
   * 2 it's not fitting"):
   *   `maxRows`   how many rows the panel shows before the list scrolls
   *               (default 10). Popover's size middleware clamps the panel to
   *               the VIEWPORT, which does nothing for a 30-row slab opened at
   *               the top of a tall page — and its inline maxHeight cannot be
   *               overridden from a consumer stylesheet, so the ceiling is ours.
   *   `rowHeight` the row pitch (number = px, or any CSS length) for a chrome
   *               whose own rows are shorter than the h-8 rung. Inline on the
   *               row, because `h-8` is a utility and a rule cannot out-rank it.
   * Both write variables on the panel that `.kol-dd-list` reads. */
  maxRows = 10,
  rowHeight,
  /* `onOptionHover(value | null)` (DropdownOptionHoverPreview, kol-mirror
   * 2026-08-28): the pointer entering a row reports its value, leaving reports
   * `null` — so a picker over a VISUAL setting can preview the hovered option
   * live and revert on leave. mirror's blend-mode picker applies the hovered
   * mode to the composite: you scrub 16 modes against the actual image instead
   * of committing to each one to look at it. The same case is every picker over
   * easing curves, palettes, filters, fonts — the DS owns the panel, only the
   * consumer knows what to preview, so this reports and nothing else.
   *
   * `null` fires ON CLOSE too, and that half is load-bearing: a panel dismissed
   * while a row is hovered would otherwise leave the consumer previewing
   * forever. It never fires while closed — a closed dropdown has no rows. */
  onOptionHover,
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

  /* the hover report, and the close that ends it. `hovered` is a ref, not
   * state — the preview is the consumer's business and re-rendering the panel
   * on every row crossed would be a render per pointermove for nothing. */
  const hovered = useRef(null)
  const reportHover = (v) => {
    if (hovered.current === v) return
    hovered.current = v
    onOptionHover?.(v)
  }
  useEffect(() => {
    if (isOpen || hovered.current == null) return
    hovered.current = null
    onOptionHover?.(null)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

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
    /* the dark chip on a washed plane; the panel continues it (ControlToneInverse, 2026-08-27) */
    toneClass(tone),
  ].filter(Boolean).join(' ')

  return (
    <div className={`kol-dd-root relative inline-block align-middle ${className}`}>
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
        className={`kol-dd-panel kol-dd-panel--${resolvedVariant} ${toneClass(tone)}`.trim()}
        style={{
          '--kol-dd-max-rows': maxRows ?? 10,
          ...(rowHeight != null ? { '--kol-dd-row-h': typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight } : null),
        }}
      >
        {(resolvedVariant === 'primary' || resolvedVariant === 'grey') && <div className="kol-dd-div" />}

        <div ref={listRef} className="kol-dd-list" role="listbox">
          {options.map((option) => {
            const isActive = option.value === currentOption?.value
            return (
              <MenuDropdownItem
                key={option.value}
                /* NO HOVER STATE ANYWHERE ON A DROPDOWN (user 2026-08-28,
                 * "delete any hover state on dropdowns"): the trigger was
                 * already pinned in all three variants — primary and outline
                 * back to rest in kol-theme, grey carrying no hover rule at
                 * all — and this was the last one left, the option row's ink
                 * brighten. The check mark is what marks the current value. */
                hover={false}
                height={rowHeight}
                onPointerEnter={onOptionHover ? () => reportHover(option.value) : undefined}
                onPointerLeave={onOptionHover ? () => reportHover(null) : undefined}
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
