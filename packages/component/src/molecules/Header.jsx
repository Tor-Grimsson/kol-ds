import { isValidElement } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'

/* taxonomy-ok: molecule — a title slot and the header's toggles (Button atoms, kol-icons's IconLoader); the one header of every Rail, modal and settings window */

/**
 * Header — THE header (plan-2026-11-12-one-header W1.1; the user: *"I JUST WANT ONE MOTHERFUCKING COMPONENT FOR THE FUCKING
 * HEADERS"*). One component, `variant` picks the row; the toggles render only when given:
 *
 *   nav       NavRail float's switcher row — the glyph (18) · the title (`kol-float-body-lg`) · the ⌄ when `onSwitch`, one
 *             press filling the title position; then `end` and the toggles. The ⌄ is 12 (`--kol-float-chev-sm`), never lg
 *   property  every float Rail's header (RailFloat, PropertyRail, MenuFloat's card) — the title in `kol-float-panel`
 *             filling the row and truncating, then `end` and the toggles, 4 apart, 8 off the title
 *   modal     the float window's row (ModalDialog float, the useModal float prompts, QuickLookFrame float) — the glyph (16,
 *             oq-64) · the title in `kol-float-panel` · `end` · − (`onMinimise`) · ×, 12 apart, quiet on oq-64
 *   settings  ModalDialog settings' 60 header — the title (Inter 14 semibold) · `kind` in the hint ink · `end` (the preset
 *             select) · ×, an oq-16 rule under it
 *
 * The title is a SLOT: text takes the variant's type, a node fills the title position as it is.
 *
 * The toggles, in this order after `end`:
 *   expand      ↗ `onExpand` — the tool's expanded form
 *   collapse-h  the panel button `onCollapseH` — the Rail collapses sideways out of view
 *   collapse-v  the chevron `onCollapseV` (`collapsedV` its state) — the Rail collapses up to its header bar; ⌄ "Expand"
 *               while collapsed, ⌃ "Collapse" while open; 12 (`--kol-float-chev-sm`, 14 on touch), never the button's 18
 *   close       × `onClose`
 *
 * @param {'nav'|'property'|'modal'|'settings'} [variant='property']
 * @param {string}    [icon]        nav · modal: the lead glyph
 * @param {ReactNode} [title]       the title slot — text, or a node in the title position
 * @param {ReactNode} [kind]        settings · property: the quiet second text beside the title (the preset beside the effect —
 *                                  no middot in a title, plan-2026-11-12-one-header W10.1)
 * @param {Function}  [onSwitch]    nav: the switcher's press; shows the ⌄
 * @param {ReactNode} [end]         the end slot — before the toggles
 * @param {Function}  [onExpand]    · {Function} [onCollapseH] · {boolean} [collapsedV] · {Function} [onCollapseV]
 * @param {Function}  [onMinimise]  modal: the −
 * @param {Function}  [onClose]     the ×
 * @param {string}    [className]
 */
const CTL = 'inline-flex size-6 shrink-0 items-center justify-center rounded-full text-oq-64 hover:text-oq-96 hover:bg-fg-08 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] cursor-pointer'
const CHEV = '[--kol-float-ic:var(--kol-float-chev-sm)]'

export default function Header({ variant = 'property', icon, title, kind, onSwitch, end, onExpand, onCollapseH, collapsedV = false, onCollapseV, onMinimise, onClose, className = '' }) {
  const toggles = <>
    {onExpand && <Button variant="float" tone="ghost" size="sm" iconOnly="arrow-upright" aria-label="Expand" onClick={onExpand} />}
    {onCollapseH && <Button variant="float" tone="ghost" size="sm" iconOnly={variant === 'nav' ? 'panel-left' : 'panel-right'} aria-label="Collapse" onClick={onCollapseH} />}
    {onCollapseV && <Button variant="float" tone="ghost" size="sm" iconOnly={collapsedV ? 'chevron-down' : 'chevron-up'} className={CHEV}
      aria-label={collapsedV ? 'Expand' : 'Collapse'} aria-expanded={!collapsedV} onClick={onCollapseV} />}
  </>
  const any = end || onExpand || onCollapseH || onCollapseV

  if (variant === 'settings') return (
    <header className={`flex items-center gap-4 h-[60px] shrink-0 pl-6 pr-[15px] border-b border-oq-16 ${className}`.trim()}>
      <h2 className="text-[14px] font-semibold leading-none">{title}</h2>
      {kind && <span className="text-[11px] text-oq-64 leading-none mt-px">{kind}</span>}
      {/* `end`: the header's right side pushed by its own margin, no spacer (LAW 10) */}
      <div className="ml-auto flex items-center gap-4">
        {end}{toggles}
        {onClose && <button type="button" aria-label="Close" onClick={onClose}
          className="ml-3 size-7 inline-flex items-center justify-center rounded-md text-[20px] leading-none text-oq-64 hover:text-(--kol-fg-96) hover:bg-(--kol-oq-08) focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]">×</button>}
      </div>
    </header>
  )

  if (variant === 'modal') return (
    <div className={`flex min-h-6 w-full items-center gap-3 ${className}`.trim()}>
      {icon && <IconLoader name={icon} size={16} className="shrink-0 text-oq-64" />}
      {isValidElement(title) ? <div className="flex min-w-0 flex-1">{title}</div> : <span className="kol-float-panel min-w-0 flex-1 truncate text-fg-emphasis">{title}</span>}
      {end}{toggles}
      {onMinimise && <button type="button" aria-label="Minimise" onClick={onMinimise} className={CTL}><IconLoader name="minus" size={14} /></button>}
      {onClose && <button type="button" aria-label="Close" onClick={onClose} className={CTL}><IconLoader name="x" size={16} /></button>}
    </div>
  )

  /* nav · property: the Rail's row */
  const slot = variant === 'nav' && !isValidElement(title) && title != null && title !== false
    ? (
      <button type="button" onClick={onSwitch} className="flex h-10 w-full items-center gap-2.5 rounded-[var(--kol-float-list-r)] px-2.5 text-left cursor-pointer hover:bg-fg-08 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]">
        {icon && <IconLoader name={icon} size={18} className="shrink-0 text-oq-96" />}
        <span className="kol-float-body-lg min-w-0 flex-1 truncate text-fg-emphasis">{title}</span>
        {onSwitch && <IconLoader name="chevron-down" size="var(--kol-float-chev-sm)" className="shrink-0 text-oq-64" />}
      </button>
    )
    : title
  return (
    <div data-float-module-header="" className={`flex w-full min-w-0 shrink-0 items-center justify-between gap-2 ${className}`.trim()}>
      {slot != null && slot !== false && (isValidElement(slot)
        ? <div data-rail-header-title="" className="flex min-w-0 flex-1">{slot}</div>
        : kind != null && kind !== ''
          /* `kind` — the quiet second text beside the title (W10.1: "Drift" + "Storm", never "Drift · Storm") */
          ? <span className="flex min-w-0 flex-1 items-baseline gap-2"><span className="kol-float-panel text-emphasis min-w-0 shrink truncate">{slot}</span><span className="kol-float-panel text-oq-64 min-w-0 truncate">{kind}</span></span>
          : <span className="kol-float-panel text-emphasis min-w-0 flex-1 truncate">{slot}</span>)}
      {(any || onClose) && <span className="ml-auto flex shrink-0 items-center gap-1">
        {end}{toggles}
        {onClose && <Button variant="float" tone="ghost" size="sm" iconOnly="x" aria-label="Close" onClick={onClose} />}
      </span>}
    </div>
  )
}
