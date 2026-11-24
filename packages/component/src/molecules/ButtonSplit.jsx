import { useState } from 'react'
import Button from '../atoms/Button.jsx'
import { IconLoader } from '@kolkrabbi/kol-icons'
import { PopoverPanel, Tooltip, usePopover } from '../utilities/Popover.jsx'
import KolboxGlyph from '../utilities/kolboxGlyph.jsx'
import { floatSurfaceClass } from '../utilities/tone.js'
import MenuFloatRows from './MenuFloat.jsx'
import { Menu } from './Menu.jsx'

/* taxonomy-ok: molecule — two Buttons (atoms) and a divider, the ⌄ opening a PopoverPanel (utility) of rows (MenuFloatRows on a float) */

/**
 * ButtonSplit — the main action, a 1px divider and a ⌄ that opens a menu of the other actions (plan-2026-11-12-one-header
 * W4.1; the user: *"its basically 4 exports and 1 open, isnt that just 2 buttons with menufloat?"*). One shape, two looks:
 *
 *   default  the app's square Buttons at `size`, the menu a plain list (SplitToolButton's rows)
 *   float    the float capsule (`variant="float"`, sm), the menu on the float sheet (`kol-more-sheet-float`): `items` drawn
 *            by MenuFloatRows — the one float menu, beside it in kol-component since 2026-11-12 (it lived in kol-shell and
 *            was redrawn here). `menu(close)` still replaces the rows
 *
 * `tone` is the Buttons' ground (Button's tones); `grey` is the float well on a float (the secondary look).
 * The ⌄ is 12 (`--kol-float-chev-sm` on a float), never the button's glyph.
 *
 * @param {ReactNode} children       the main action's label
 * @param {string}    [icon]         the main action's glyph
 * @param {Function}  onClick        the main action
 * @param {Array}     [items]        `[{ label, icon?, onPress, disabled? }]` — the menu's rows
 * @param {Function}  [menu]         `(close) => ReactNode` — the menu's content instead of `items` (MenuFloatRows on a float)
 * @param {'default'|'float'|'kolbox'|'folio'} [variant='default']  `folio`: Folio's split (see its branch), `tone`
 *                                  primary or unset, `items` on Menu folio; `kolbox`: see the branch below; takes `tone` (primary, secondary), `icon`,
 *                                  `onClick`, `onMenu` (the ⌄'s press; the host opens its menu), `menuLabel`; with `iconOnly`
 *                                  (a glyph name) it is the tool dock's slot: `pressed` the armed look, `tooltip` the
 *                                  main half's tooltip label, `aria-label` the main half's name, `menuOpen` the ⌄'s
 *                                  menu is open (its quiet fill)
 * @param {string}    [tone]         · {'xs'|'sm'|'md'|'lg'} [size='md'] (default only; a float is sm)
 * @param {boolean}   [disabled]     the main action off; the menu still opens
 * @param {string}    [menuLabel='More actions']  the ⌄'s aria-label
 * @param {string}    [placement='bottom-end'] · {string} [className]
 */
const WELL = { '--kol-tone-bg': 'var(--kol-float-well)', '--kol-tone-fg': 'var(--kol-surface-on-primary)' }

export default function ButtonSplit({ children, icon, onClick, items = [], menu, variant = 'default', tone, size = 'md', disabled = false, menuLabel = 'More actions', placement = 'bottom-end', className = '', onMenu, menuOpen, iconOnly, pressed, tooltip, 'aria-label': ariaLabel }) {
  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement, offset: 6, role: 'menu' })
  /* `variant="kolbox"` (plan-2026-11-18-kolbox-system W31.2 batch 3, 2026-11-18): kolbox's SplitButton carried class for
   * class, the action and its ⌄ as two kolbox Buttons of one tone, 1px apart, square where they meet; the hovered half
   * takes the fg-04 hover over its own fill (kol-theme `.kol-btn-split--kolbox`). The host opens its own menu: `onMenu`
   * is the ⌄'s press. */
  if (variant === 'kolbox') {
    /* the icon-only form (the tool dock's slot with a fold), Figma's dock as measured 2026-11-20 (W16.3): two boxes 1
     * apart, no divider and no joined half. The tool a 32 tile with the 22 glyph (Figma's draw 16 to 18, W2), rounded on all four corners, solid
     * accent while `pressed`; the ⌄ its own 16 by 32 button, no fill at rest (pressed or not), the quiet fill on hover
     * and while its menu is open (`menuOpen`); `tooltip` names the main half */
    if (iconOnly) {
      const main = (
        <button type="button" aria-label={ariaLabel} aria-pressed={!!pressed} disabled={disabled} onClick={onClick}
          className="kol-btn-split-main inline-flex size-8 shrink-0 items-center justify-center outline-none focus-visible:outline-solid focus-visible:outline-1">
          <IconLoader name={iconOnly} size={22} className="kol-kolbox-icon shrink-0" />
        </button>
      )
      return (
        <div className={`kol-btn-split--kolbox kol-btn-split--kolbox-icon${pressed ? ' is-pressed' : ''} inline-flex shrink-0 gap-px ${className}`.trim()}>
          {tooltip ? <Tooltip variant="kolbox" label={tooltip}>{main}</Tooltip> : main}
          <Tooltip variant="kolbox" asChild label={menuLabel}>
            <button type="button" aria-label={menuLabel} aria-expanded={!!menuOpen} onClick={onMenu}
              className={`kol-btn-split-menu${menuOpen ? ' is-open' : ''} inline-flex h-8 w-4 shrink-0 items-center justify-center outline-none focus-visible:outline-solid focus-visible:outline-1`}>
              <KolboxGlyph name="chevron-down" />
            </button>
          </Tooltip>
        </div>
      )
    }
    return (
      <div className={`kol-btn-split--kolbox inline-flex shrink-0 gap-px ${className}`}>
        <Button variant="kolbox" tone={tone} iconLeft={icon} onClick={onClick} className="rounded-r-none">{children}</Button>
        <Tooltip variant="kolbox" asChild label={menuLabel}><Button variant="kolbox" tone={tone} iconLeft="chevron-down" onClick={onMenu} aria-label={menuLabel} className="rounded-l-none px-1" /></Tooltip>
      </div>
    )
  }
  /* `variant="folio"` (Folio migration batch B, 2026-11-22): Folio's ActionSplit carried class for class (kol-theme
   * `.kol-btn-split--folio`): two joined 32-high halves at radius 4 inside one line, the label padded 16, the ⌄ a 32
   * square, a hairline in the ink at 20% between; `tone="primary"` the green ground, unset the paper. The ⌄ opens
   * `items` on `Menu variant="folio"` under its right edge, in place (never portalled). Esc or a press outside closes. */
  if (variant === 'folio') {
    return (
      <span className={`kol-btn-split--folio${tone === 'primary' ? ' kol-btn-split--folio-primary' : ''} relative inline-flex ${className}`.trim()}>
        <span className="kol-btn-split-box flex h-[32px] shrink-0 overflow-hidden rounded-[4px] border">
          <button type="button" onClick={onClick} className="kol-btn-split-main whitespace-nowrap px-[16px]">{children}</button>
          <span aria-hidden className="w-px bg-current opacity-20" />
          <button type="button" aria-label={menuLabel} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-[32px] items-center justify-center"><IconLoader name="chevron-down" size={16} /></button>
        </span>
        <Menu variant="folio" open={open} onClose={() => setOpen(false)} aria-label={menuLabel} minWidth={160}
          panelClassName="absolute right-0 top-[calc(100%+4px)] whitespace-nowrap"
          items={items.map((it) => ({ label: it.label, onClick: it.onPress, disabled: it.disabled }))} />
      </span>
    )
  }
  const close = () => setOpen(false)
  const float = variant === 'float'
  const shared = float
    ? { variant: 'float', tone: tone === 'grey' ? undefined : tone, size: 'sm', style: tone === 'grey' ? WELL : undefined }
    : { tone, size }
  const pick = (it) => () => { if (it.disabled) return; it.onPress?.(); close() }
  return (
    <div className={`kol-btn-split inline-flex items-stretch ${className}`.trim()}>
      <Button {...shared} iconLeft={icon} iconSize={float ? undefined : 12} disabled={disabled} onClick={onClick} className="flex-1 min-w-0 rounded-r-none">{children}</Button>
      <span aria-hidden="true" className="w-px shrink-0 bg-oq-16" />
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex">
        <Button {...shared} iconOnly="chevron-down" iconSize={float ? undefined : 12} pressed={open} aria-label={menuLabel}
          className={`rounded-l-none ${float ? '[--kol-float-ic:var(--kol-float-chev-sm)]' : ''}`.trim()} />
      </span>
      <PopoverPanel popover={popover} panel={false} focus={false}
        className={float ? `kol-more-sheet kol-more-sheet-float ${floatSurfaceClass('solid', true)}` : 'w-max bg-surface-secondary border border-oq-08 rounded shadow-lg'}
        style={float ? { minWidth: 220 } : undefined}>
        {menu ? menu(close) : float ? <MenuFloatRows variant="float" actions={items} onPick={close} /> : items.map((it) => (
            <button key={it.label} type="button" disabled={it.disabled} onClick={pick(it)}
              className="w-full kol-helper-12 px-3 h-8 flex items-center gap-2 text-body hover:text-emphasis disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-body text-left">
              <span className="flex-1 truncate">{it.label}</span>
            </button>
          ))}
      </PopoverPanel>
    </div>
  )
}
