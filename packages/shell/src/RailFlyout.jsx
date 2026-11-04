import { Button, usePopover, PopoverPanel, floatSurfaceClass } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: molecule — a float card of nav Buttons with counts */

/**
 * RailFlyout — A section's children beside the rail (float-everything W9 row 130, 2026-11-04): the hover card a 72
 * rail opens for a row that holds pages — the section's glyph and name (`kol-float-body`), then its rows 34 tall on
 * the `--kol-float-list-r` round (a 16 glyph, the label in `kol-float-hint`, a count in `kol-float-ruler` at the end),
 * the current one lit. With `anchor` it hangs right of that element (the popover); without, it is the card alone.
 * The exploration's `Dashboard rail flyout` (kol-float--style 9:14981).
 *
 * @param {string}   icon · {string} title   the section
 * @param {Array}    items    `[{ path, label, icon?, count? }]`
 * @param {string}   active   the current path
 * @param {Function} onPick   `(item) => void`
 * @param {Element}  anchor   the rail row the card hangs off; `open` shows it, `onOpenChange` hears it close
 * @param {boolean}  open · {Function} onOpenChange
 * @param {number}   width    the card's width (default 302)
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the card is made of (default `solid`)
 * @param {string}   className
 */
export default function RailFlyout({ icon, title, items = [], active, onPick, anchor, open = true, onOpenChange, width = 302, surface = 'solid', className = '' }) {
  const popover = usePopover({ open: !!anchor && open, onOpenChange, placement: 'right-start', offset: 8, click: false, referenceElement: anchor ?? null, role: 'menu' })
  const card = (
    <div role="menu" aria-label={title} className={`kol-rail-flyout kol-float-chrome flex flex-col gap-0.5 p-2 rounded-[var(--kol-float-menu-r)] ${floatSurfaceClass(surface, true)} ${anchor ? '' : className}`.trim()} style={{ width }}>
      <div className="flex items-center gap-3 px-2 pt-2 pb-3">
        {icon && <Icon name={icon} size={18} className="text-oq-96" />}
        <span className="kol-float-body text-emphasis">{title}</span>
      </div>
      {items.map((i) => (
        <Button key={i.path ?? i.label} variant="nav" size="lg" iconLeft={i.icon} iconSize={16} aria-current={i.path != null && i.path === active ? 'page' : undefined} className="kol-btn-float w-full justify-start" onClick={() => onPick?.(i)}>
          <span className="flex-1 text-left">{i.label}</span>
          {i.count != null && <span className="kol-float-ruler text-oq-64">{i.count}</span>}
        </Button>
      ))}
    </div>
  )
  if (!anchor) return card
  return <PopoverPanel popover={popover} panel={false} focus={false} className={className}>{card}</PopoverPanel>
}
