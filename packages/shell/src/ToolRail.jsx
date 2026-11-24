import { useState } from 'react'
import { Button, ButtonSplit, KbdKeys, Tooltip, MenuPanel, MenuRow, PopoverPanel, usePopover, floatSurfaceClass } from '@kolkrabbi/kol-component'
import { IconLoader } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: molecule — a column of float Buttons, each named by the float Tooltip */

/**
 * ToolRail — The editor's tool column as a float (float-everything W5 row 63, 2026-11-04). A 52 capsule, 6 in, 40 slots
 * (`--kol-float-row`) 4 apart; the armed tool is lit (`--kol-fg-16`, the float selection), the rest at full ink (oq-96, W1.3); every slot is named beside
 * the rail by the float Tooltip with its key. The exploration's `Floating tool rail` (kol-float--style 9:9192).
 *
 * @param {Array}    tools     `[{ id, icon, label, kbd? }]` in rail order — `icon` a kol-icons name, `kbd` the tooltip's key
 * @param {string}   value     the armed tool's id
 * @param {Function} onChange  `(id) => void`
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the rail is made of (default `solid`); a glass puts its own ink on the slots
 * @param {Array}    more      THE OVERFLOW (plan-2026-11-05-float-editor W1.3; his frame 19:6066 — "Tool overflow" 19:6072):
 *                             `[{ label, icon?, kbd?, onClick }]` — a 36 ⋮ circle 16 under the rail, on the rail's surface,
 *                             its rows a float list beside it (Hand, Zoom, Fill/stroke, Reset colours). Unset, no ⋮.
 * @param {string}   className  the rail's — or, with `more`, the column's that holds the rail and its ⋮
 * @param {'vertical'|'horizontal'} orientation  THE PHONE ROW (plan-2026-11-05-float-editor W2.7; his frame 06 19:8598):
 *                             `horizontal` lays the slots in a row and names them above; default `vertical`
 *                             THE DOCK (7.7; his float-more 30:914) is the horizontal rail with these three:
 *                             a tool's own `more` (`[{ id?, label, icon, kbd?, onClick? }]`) draws its ▾ beside the slot, the
 *                             list rising above; a member with an `id` arms that tool and the slot then shows it
 * @param {ReactNode} end      after a rule — the dock's hand and undo
 * @param {Object}   search    `{ onPress, kbd?, label?, pressed? }` — the ⌘K pill at the dock's end, after a rule
 */
function ToolRailDefault({ tools = [], value, onChange, surface = 'solid', more, orientation = 'vertical', end, search, className = '' }) {
  const row = orientation === 'horizontal'
  if (more?.length && !row) {
    return (
      <div className={`inline-flex flex-col items-center gap-4 ${className}`.trim()}>
        <ToolRailDefault tools={tools} value={value} onChange={onChange} surface={surface} />
        <ToolMore items={more} surface={surface} />
      </div>
    )
  }
  return (
    <div role="toolbar" aria-orientation={orientation} aria-label="Tools" className={`kol-tool-rail kol-float-chrome inline-flex ${row ? 'flex-row items-center' : 'flex-col'} gap-1 p-1.5 rounded-full ${floatSurfaceClass(surface)} ${className}`.trim()}>
      {tools.map((t) => {
        /* a slot with its own ▾ shows the member armed from it (the dock's Shapes slot reads Ellipse once Ellipse is picked) */
        const shown = t.more?.find((m) => m.id != null && m.id === value) ?? t
        const slot = (
          <Tooltip key={t.id} variant="float" placement={row ? 'top' : 'right'} offset={12} label={shown.label} shortcut={shown.kbd}>
            {/* every slot at full ink, armed or not (his frame 19:6071 — W1.3; the ghost tone's oq-48 read as disabled) */}
            <Button variant="float" tone="ghost" iconOnly={shown.icon} aria-label={shown.label} pressed={shown.id === value || t.id === value}
              onClick={() => (shown.onClick ? shown.onClick() : onChange?.(shown.id))} className="[--kol-tone-fg:var(--kol-oq-96)]" />
          </Tooltip>
        )
        return t.more?.length && row
          ? <span key={t.id} className="inline-flex items-center">{slot}<ToolMore items={t.more} surface={surface} chevron label={`${t.label} tools`} onPick={(m) => (m.onClick ? m.onClick() : onChange?.(m.id))} active={value} /></span>
          : slot
      })}
      {end && <><span aria-hidden className="mx-2 h-6 w-px shrink-0 bg-fg-08" />{end}</>}
      {search && <><span aria-hidden className="mx-2 h-6 w-px shrink-0 bg-fg-08" /><ToolSearchPill {...search} /></>}
    </div>
  )
}

/* the dock's ⌘K pill (his float-more 30:914): the search glyph and its key on the float well, at the slot's height;
 * `kbd: null` (a phone has no ⌘) draws the glyph alone */
function ToolSearchPill({ onPress, kbd = '⌘K', label = 'Search', pressed }) {
  return (
    <Tooltip variant="float" placement="top" offset={12} label={label} shortcut={kbd}>
      <Button variant="float" tone="ghost" aria-label={label} pressed={pressed} onClick={onPress}
        className={`kol-tool-search gap-2 ${kbd ? 'px-4' : 'px-2.5'} bg-[var(--kol-float-well)] [--kol-tone-fg:var(--kol-oq-96)]`}>
        <IconLoader name="search" size="var(--kol-float-ic)" />
        {kbd && <span className="kol-float-panel">{kbd}</span>}
      </Button>
    </Tooltip>
  )
}

/* the ⋮ under the rail and its list, to the right, top edges on one line — or, `chevron`, a slot's ▾ in the dock, its
 * list rising above it */
function ToolMore({ items, surface, chevron = false, label = 'More tools', onPick, active }) {
  const [open, setOpen] = useState(false)
  const pop = usePopover({ open, onOpenChange: setOpen, placement: chevron ? 'top-start' : 'right-start', offset: 12 })
  return (
    <>
      <span ref={pop.refs.setReference} {...pop.getReferenceProps()} className={chevron ? 'inline-flex' : `kol-float-chrome inline-flex rounded-full ${floatSurfaceClass(surface)}`}>
        <Button variant="float" tone="ghost" iconOnly={chevron ? 'chevron-down' : 'more-vertical'} aria-label={label} pressed={open}
          className={chevron ? 'kol-tool-chevron [--kol-tone-fg:var(--kol-oq-64)]' : '[--kol-tone-fg:var(--kol-oq-96)]'} />
      </span>
      {open && (
        <PopoverPanel popover={pop} panel={false} focus={false}>
          <MenuPanel variant="float" className="min-w-[200px]">
            {items.map((it) => (
              <MenuRow key={it.label} rowClass="kol-menu-row kol-helper-12" kbd={it.kbd} disabled={it.disabled}
                indicator={chevron && it.id != null && it.id === active ? 'dot' : undefined}
                iconLeft={it.icon && <IconLoader name={it.icon} size={16} className="text-oq-88" />}
                onClick={() => { setOpen(false); onPick ? onPick(it) : it.onClick?.() }}>{it.label}</MenuRow>
            ))}
          </MenuPanel>
        </PopoverPanel>
      )}
    </>
  )
}

/* ── kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5, 2026-11-18) ─────────────────────────────────────────────────
 * kolbox's ToolDock (the file's ToolDock 28:9326, plan 10.8; W19.2), carried from apps/kolbox/src/ui/ToolDock.jsx: the
 * panel fill, radius 12, padding 8, on the one floating surface (`kol-kolbox-surface`). The tools, 4 apart; a rule 1 by
 * 24 between groups; `end` a second group after a rule (kolbox's well; the design draws none, the transport fills it).
 * ToolRail's words: `tools` [{ id, icon, label, kbd, more: [{ id, icon, label, kbd, action }] }] (kolbox's `variants`),
 * `value` a tool's id or one of its `more` ids (the tool shows its current member's glyph), `onChange(id)`. Two more
 * kinds in `tools`, as the real ToolPalette's: `{ divider: true }` and a one-shot `{ id, icon, label, kbd, disabled,
 * onClick }` that is never the armed tool. A tool with `more` is `ButtonSplit variant="kolbox"` in its icon-only form:
 * the tool a tile, its chevron a separate 16 by 32 button 1 beside it, `onVariants(tool, element)` its press (the host
 * opens its own menu), `variantsOpen` the id of the tool whose menu is open (its chevron keeps the quiet fill).
 * `children` replace the tools (the transport's own cells).
 * Under 768 the dock and its end wrap onto a second row. Sizes are Figma's dock as measured 2026-11-20 (W16.3): 48 high,
 * padding 8, a slot 32 square, 8 between a tool's chevron and the next tool. Glyphs are your icons by the set's names at
 * 20 in the full ink (his "bigger icons", R3.4): drawn 14 to 15, Figma's 16 to 17 inside its 24 box. */
export function ToolRailSlot({ icon, label, kbd, active = false, lit = false, className = '', ...rest }) {
  return (
    <Tooltip variant="kolbox" label={kbd ? <>{label}<KbdKeys variant="kolbox" size="sm" keys={kbd} className="ml-2" /></> : label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active || lit}
        data-dock-cell
        className={`kol-tool-slot--kolbox${active ? ' is-active' : lit ? ' is-lit' : ''} inline-flex size-8 shrink-0 items-center justify-center outline-none focus-visible:outline-solid focus-visible:outline-1 ${active || lit ? '' : 'disabled:opacity-40'} ${className}`.trim()}
        {...rest}
      >
        <IconLoader name={icon} size={22} className="kol-kolbox-icon shrink-0" />
      </button>
    </Tooltip>
  )
}

function ToolRailKolbox({ tools = [], value, onChange, onVariants, variantsOpen, end, children, className = '' }) {
  const rule = (key) => <span key={key} className="kol-tool-rail-rule h-6 w-px shrink-0" />
  return (
    <div data-kol-dock className={`kol-tool-rail--kolbox kol-kolbox-surface inline-flex items-center gap-2 p-2 max-md:max-w-full max-md:flex-wrap max-md:justify-center ${className}`.trim()}>
      <div className="flex items-center gap-2">
        {children ??
          tools.map((t, i) => {
            if (t.divider) return rule(`d${i}`)
            if (t.onClick) return <ToolRailSlot key={t.id} icon={t.icon} label={t.label} kbd={t.kbd} disabled={t.disabled} onClick={t.onClick} />
            const current = t.more?.find((v) => v.id === value)
            const icon = current?.icon ?? t.icon
            const label = current?.label ?? t.label
            const kbd = current ? current.kbd : t.kbd
            const active = value === t.id || !!current
            const arm = () => onChange?.(current?.id ?? t.id)
            if (!t.more?.length) return <ToolRailSlot key={t.id} icon={icon} label={label} kbd={kbd} active={active} onClick={arm} />
            return (
              <ButtonSplit key={t.id} variant="kolbox" iconOnly={icon} aria-label={label} pressed={active} onClick={arm}
                tooltip={kbd ? <>{label}<KbdKeys variant="kolbox" size="sm" keys={kbd} className="ml-2" /></> : label}
                menuLabel={`${t.label} variants`} menuOpen={variantsOpen === t.id} onMenu={(e) => onVariants?.(t, e.currentTarget)} />
            )
          })}
      </div>
      {end && (
        <>
          {rule('end')}
          <div className="flex items-center gap-1 max-md:flex-wrap max-md:justify-center">{end}</div>
        </>
      )}
    </div>
  )
}

/* ── folio (Folio migration batch D, 2026-11-22) ──────────────────────────────────────────────────────────────────────
 * Folio's toolbar row under the menus (ToolRow), carried from apps/folio's EditorChrome.jsx: 56 high, 56 in, 8 between
 * its tools, a rule under it in Folio's rule ink; a row wider than the window scrolls sideways with no scrollbar. Its
 * tools are the format's own, as `children` (kolbox's word for cells in the dock's place). */
function ToolRailFolio({ children, className = '' }) {
  return <div className={`kol-tool-rail--folio flex h-[56px] shrink-0 items-center gap-[8px] overflow-x-auto border-b px-[56px] [scrollbar-width:none] ${className}`.trim()}>{children}</div>
}

export default function ToolRail(props) {
  if (props.variant === 'folio') return <ToolRailFolio {...props} />
  return props.variant === 'kolbox' ? <ToolRailKolbox {...props} /> : <ToolRailDefault {...props} />
}
