import { useMemo, useRef, useState } from 'react'
import { AccountMenu, Input, Menu, PopoverLayer, Tooltip, Rail, RailHeader, TreeRow } from '@kolkrabbi/kol-component'
import Icon from '@design-editor-src/editor/kolbox/ui/Icon.jsx'

/* The rail outside a document (Figma plan 7.1, home library; built 2026-11-18 on sheet 14.2): the header (Home; the bell
   is off, plan-2026-11-20 W3.1), the search field, the fixed items, the foldable Starred group (Figma's: folders live under All folders, no Folders group, 2026-11-23), and at its foot the
   account chip with its menu (plan-2026-11-19-kolbox-whats-left C8, W30.4). The Rail shell (its fill and the right edge
   line) with content in its slots; it draws nothing of its own.
   search: the field's value and onChange;
   items [{ id, icon, label, selected, onClick, disabled, hint, onDrop }], a disabled row showing its `hint` in a tooltip;
   a row (or folder) with `onDrop` takes the files dragged from the browser (W3.2), lit while they are over it;
   starred [{ id, icon, label, selected, onClick }], the Starred group (empty: the group with no rows).
   account: { name, initial }; accountMenu: the chip's Menu groups (signed out: the line that says
   so and Sign in; with a session: Profile, Plan, Sign out).
   recent: the search panel's rows (Figma's file-browser search, 2026-11-24): { files: [{ id, name, icon, folder,
   modified, onOpen }], filters: [{ id, label, value, hint, groups }] }, a filter's `groups` the Menu its chip opens. */
const Hint = ({ label, children }) => <div className="flex *:flex-1"><Tooltip variant="kolbox" label={label}>{children}</Tooltip></div>
/* the files' drag type (pages/Home.jsx): a row with `onDrop` takes it, lit while it is over the row */
export const FILES_TYPE = 'application/x-kolbox-files'
function DropRow({ i }) {
  const [over, setOver] = useState(false)
  const tree = <TreeRow variant="kolbox" size="sm" icon={i.icon} label={i.label} active={i.selected || over} disabled={i.disabled} onClick={i.onClick} />
  if (!i.onDrop) return tree
  const takes = (e) => e.dataTransfer.types.includes(FILES_TYPE)
  return (
    <div data-drop-target={i.id} data-drop-over={over || undefined}
      onDragOver={(e) => { if (!takes(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOver(true) }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(false) }}
      onDrop={(e) => { if (!takes(e)) return; e.preventDefault(); setOver(false); i.onDrop(JSON.parse(e.dataTransfer.getData(FILES_TYPE))) }}>
      {tree}
    </div>
  )
}
const row = (i) => <DropRow key={i.id} i={i} />

function Group({ label, open, onToggle, end, children }) {
  return (
    <>
      <div className="flex h-8 items-center justify-between">
        <button type="button" aria-expanded={open} onClick={onToggle} className="kol-kolbox-section flex h-8 items-center gap-1 rounded-control text-left text-text outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">
          <Icon name="chevron-down" size={12} className={open ? '' : '-rotate-90'} />{label}
        </button>
        {end}
      </div>
      {open && children}
    </>
  )
}

/* the recent searches, newest first, five kept in this browser (none when storage is blocked) */
const SEARCHES = 'kol.editor.home.searches'
const readSearches = () => { try { return JSON.parse(localStorage.getItem(SEARCHES)) ?? [] } catch { return [] } }
const keepSearch = (q) => {
  const next = [q, ...readSearches().filter((x) => x !== q)].slice(0, 5)
  try { localStorage.setItem(SEARCHES, JSON.stringify(next)) } catch { /* storage blocked: not kept */ }
}
const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
const STEPS = [[60, 'second'], [60, 'minute'], [24, 'hour'], [7, 'day'], [4.35, 'week'], [12, 'month'], [Infinity, 'year']]
const ago = (t) => {
  let v = (t - Date.now()) / 1000
  for (const [n, unit] of STEPS) { if (Math.abs(v) < n) return rtf.format(Math.round(v), unit); v /= n }
}

/* Figma's file-browser search: a press on the rail's field opens this panel over the rail's top, its own field (the
   rail's md field) on top, the three filter rows (a chip opens its Menu), then Recent: the searches kept here and
   the newest files, filtered as typed. Escape or a press outside closes it (PopoverLayer). */
function SearchPanel({ anchor, open, onClose, search, onSearch, files = [], filters = [] }) {
  const [menu, setMenu] = useState(null)
  const chips = useRef({})
  const rowCls = 'flex h-10 w-full items-center gap-4 rounded-control px-[13px] text-left text-[11px] leading-4 font-normal text-text outline-none hover:bg-hover focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent'
  const input = useRef(null)
  const searches = open ? readSearches() : []
  const run = (q) => { if (q.trim()) keepSearch(q.trim()) }
  return (
    <PopoverLayer anchor={anchor} open={open} onClose={onClose} placement="over" kind="search">
      {/* 380 wide, as Figma's panel measures (no KOL width covers it); the rows' type is Figma's UI 11 / 16, the
          file's second line too (measured 2026-11-24), set here */}
      <section role="dialog" aria-label="Search" data-home-search className="kol-kolbox-surface flex w-[380px] max-w-[calc(100vw-var(--kol-spacing-2))] flex-col rounded-menu bg-panel p-2">
        <Input variant="kolbox" ref={input} size="md" iconLeft="search" className="gap-2.5! pl-2!" placeholder="Search" aria-label="Search" autoFocus value={search}
          onChange={(e) => onSearch?.(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { run(search); onClose() } }} />
        <div className="flex flex-col pt-2">
          {filters.map((f) => (
            <button key={f.id} type="button" data-search-filter={f.id} onClick={() => setMenu(f.id)}
              className="flex h-10 items-center justify-between gap-3 rounded-control px-2 text-left outline-none hover:bg-hover focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">
              <span ref={(el) => { chips.current[f.id] = el }} className="flex h-6 items-center gap-1 rounded-control bg-field px-2 text-[11px] leading-4 font-normal text-text">
                {f.label}{f.value && <span className="text-muted">{f.value}</span>}
              </span>
              <span className="truncate text-[11px] leading-4 font-normal text-muted">{f.hint}</span>
            </button>
          ))}
        </div>
        {(searches.length > 0 || files.length > 0) && <div className="px-3 pt-3 pb-2 text-help text-muted">Recent</div>}
        <div className="flex flex-col">
          {/* Figma's rows: a 16 glyph 21 in, the text 53 in (13 / 16, the ink), 40 high; a file 48 with its folder and age under */}
          {searches.map((q) => (
            <button key={`q:${q}`} type="button" onClick={() => { onSearch?.(q); keepSearch(q) }} className={rowCls}>
              <span className="flex size-4 shrink-0 items-center justify-center"><Icon name="clock" size={18} /></span>
              <span className="truncate">{q}</span>
            </button>
          ))}
          {files.map((f) => (
            <button key={f.id} type="button" onClick={() => { run(search); onClose(); f.onOpen?.() }} className={`${rowCls} h-12`}>
              <span className="flex size-4 shrink-0 items-center justify-center rounded-xs bg-accent text-on-accent"><Icon name={f.icon} size={14} /></span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{f.name}</span>
                <span className="flex gap-1.5 truncate text-[11px] leading-4 text-muted"><span>{f.folder}</span><span>Edited {ago(f.modified)}</span></span>
              </span>
            </button>
          ))}
        </div>
      </section>
      {filters.map((f) => (
        <Menu key={f.id} variant="kolbox" aria-label={f.hint} anchor={chips.current[f.id]} open={menu === f.id} onClose={() => { setMenu(null); input.current?.focus() }} onSelect={(r) => r.run?.()} groups={f.groups} />
      ))}
    </PopoverLayer>
  )
}

export default function HomeRail({ account, accountMenu = [], search = '', onSearch, items = [], starred = [], recent }) {
  const [open, setOpen] = useState(true)
  const [panel, setPanel] = useState(false)
  const field = useRef(null)
  /* the panel lies over the rail's top: its corner 8 up and left of the field's, so its own field sits on this one */
  const over = useMemo(() => ({
    getBoundingClientRect: () => { const r = field.current.getBoundingClientRect(); return new DOMRect(r.left - 8, r.top - 8, r.width, r.height) },
    contains: (n) => !!field.current?.contains(n),
  }), [])
  const [menu, setMenu] = useState(false)
  const chip = useRef(null)
  return (
    <Rail variant="kolbox"
      side="left"
      aria-label="Home"
      header={<RailHeader variant="kolbox" title="Home" />}
      footer={(
        <div className="relative flex h-12 items-center gap-2 px-3 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border" data-rail-account>
          <Tooltip variant="kolbox" asChild label="Account">
          <span ref={chip} className="flex">
            <AccountMenu variant="kolbox" initial={account?.initial} name="Account" aria-expanded={menu} onClick={() => setMenu((o) => !o)} />
          </span>
          </Tooltip>
          <button type="button" onClick={() => setMenu((o) => !o)} data-account className="min-w-0 flex-1 truncate rounded-control text-left text-row text-text outline-none hover:text-accent focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">{account?.name}</button>
          <Menu variant="kolbox" aria-label="Account" anchor={chip} open={menu} onClose={() => setMenu(false)} onSelect={(r) => r.run?.()} groups={accountMenu} />
        </div>
      )}
    >
      <div className="flex flex-col gap-1 px-2 pb-3">
        <div ref={field} onFocus={() => recent && setPanel(true)}>
          <Input variant="kolbox" size="md" iconLeft="search" placeholder="Search" aria-label="Search" type="search" value={search} onChange={(e) => onSearch?.(e.target.value)} className="mb-1.5 gap-2.5! pl-2!"/>
        </div>
        {recent && <SearchPanel anchor={over} open={panel} onClose={() => setPanel(false)} search={search} onSearch={onSearch} files={recent.files} filters={recent.filters} />}
        {items.map((i) => (i.disabled ? <Hint key={i.id} label={i.hint}>{row(i)}</Hint> : row(i)))}
        <Group label="Starred" open={open} onToggle={() => setOpen((o) => !o)}>{starred.map(row)}</Group>
      </div>
    </Rail>
  )
}
