/* The editor's one set of chrome (plan W16, user 2026-11-04: "there are so many inconsistencies"): the menu bar, the
   find bar, the status bar, New's format Overlay and the library tree Rail (W17). Every format — Markdown, Text, Code —
   renders these same parts; only the writing surface and its toolbar change. */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonGroup, CommandOverlay, Input, ModalDialog, Rail, TreeRow } from '@kolkrabbi/kol-component'
import { Icon } from './parts'
import { SHELVES, DOCS } from './shelf'
import { CODE_LANGS } from './Fence'

/* ── menus: [label, fn, keys, checked] or '-', as Folio's menus are written, into Menu's rows (Menu folio, MenuBar
   folio): a row with no fn is disabled; every row keeps the check and key columns, as Folio's list drew them ── */
export const folioItems = (items, variant = 'folio') => items.map((it) => (it === '-' ? { divider: true } : { label: it[0], onClick: it[1], kbd: it[2] ?? '', checked: variant === 'kolbox' && it.length < 4 ? undefined : !!it[3], disabled: !it[1] }))
/* the menu bar's menus, [label, items], as MenuBar's `{ label, items }` */
export const folioMenus = (menus, variant = 'folio') => menus.map(([label, items]) => ({ label, items: folioItems(items, variant) }))

/* ── find & replace: the same bar in every format ── */
export function FindBar({ find, setFind, repl, setRepl, count, onPrev, onNext, onReplace, onReplaceAll, matchCase, setMatchCase, onClose }) {
  return (
    <div className="flex h-[48px] shrink-0 items-center gap-[10px] border-b border-folio-rule bg-folio-surface px-[56px]" onKeyDown={(e) => { if (e.key === 'Escape') onClose(); if (e.key === 'Enter') { e.preventDefault(); e.shiftKey ? onPrev() : onNext() } }}>
      <Icon name="search" />
      <Input variant="kolbox" autoFocus aria-label="Find" placeholder="Find" value={find} onChange={(e) => setFind(e.target.value)} className="w-[220px]" />
      <span className="kol-folio-meta w-[64px] tabular-nums text-folio-muted">{count}</span>
      <ButtonGroup layout="joined" variant="kolbox" ariaLabel="Matches" options={[{ icon: 'arrow-left', ariaLabel: 'Previous match', onPress: onPrev }, { icon: 'arrow-right', ariaLabel: 'Next match', onPress: onNext }]} />
      <Button variant="kolbox" pressed={matchCase} aria-pressed={matchCase} onClick={() => setMatchCase(!matchCase)}>Aa</Button>
      <span className="mx-[8px] h-[20px] w-px bg-folio-rule" />
      <Input variant="kolbox" aria-label="Replace with" placeholder="Replace with" value={repl} onChange={(e) => setRepl(e.target.value)} className="w-[220px]" />
      <Button variant="kolbox" onClick={onReplace}>Replace</Button>
      <Button variant="kolbox" onClick={onReplaceAll}>Replace all</Button>
      <Button variant="kolbox" iconOnly="x" aria-label="Close find" onClick={onClose} className="ml-auto" />
    </div>
  )
}

/* ── the status bar: counts on the left; format, language and the view on the right ── */
export const StatusBar = ({ left, children }) => (
  <div className="kol-folio-meta flex h-[40px] shrink-0 items-center justify-between gap-[24px] whitespace-pre border-t border-folio-rule px-[56px]">
    <p className="text-folio-muted">{left}</p>
    <div className="flex items-center gap-[24px]">{children}</div>
  </div>
)

/* ── New: what to make (16.3): ModalDialog folio, its body the three formats ── */
export function NewOverlay({ onPick, onClose }) {
  const card = 'flex flex-col items-start gap-[8px] rounded-[4px] border border-folio-rule p-[20px] text-left hover:border-folio-green hover:bg-folio-mint'
  return (
    <ModalDialog variant="kolbox" open title="New document" width={720} onClose={onClose}>
      <div className="grid grid-cols-3 gap-[12px] p-[24px]">
        <button type="button" autoFocus onClick={() => onPick('md')} className={card}>
          <span className="text-[16px] font-semibold">Markdown</span>
          <span className="kol-folio-meta text-folio-muted">Headings, lists and links, with a preview beside it. Saved as .md.</span>
        </button>
        <button type="button" onClick={() => onPick('rich')} className={card}>
          <span className="text-[16px] font-semibold">Text</span>
          <span className="kol-folio-meta text-folio-muted">Fonts, sizes and spacing, like a word processor. ⇧⌘T makes it plain.</span>
        </button>
        <div className={`${card} hover:bg-transparent`}>
          <button type="button" onClick={() => onPick('code', 'js')} className="flex flex-col items-start gap-[8px] text-left">
            <span className="text-[16px] font-semibold">Code</span>
            <span className="kol-folio-meta text-folio-muted">Coloured as you type. Pick a language:</span>
          </button>
          <span className="flex flex-wrap gap-[4px]">
            {CODE_LANGS.map(([e, , label]) => <Button variant="kolbox" key={e} onClick={() => onPick('code', e)}>{label}</Button>)}
          </span>
        </div>
      </div>
    </ModalDialog>
  )
}

/* ── the library as a tree (W17, on the reader too since 7.1): shelves as folders, their documents under them; `reading`
   links each to its reader page instead of its editor ── */
export function LibraryTree({ current, onContext, reading = false, className = 'min-h-0 border-r border-folio-rule' }) {
  const pathOf = (d) => (reading ? d.href : `/edit/${d.collection}/${d.id}`)
  const [q, setQ] = useState('')
  const docs = useMemo(() => {
    const n = q.trim().toLowerCase()
    return DOCS.filter((d) => !d.hidden && (!n || d.title.toLowerCase().includes(n)))
  }, [q])
  const [shut, setShut] = useState(() => new Set(SHELVES.map((s) => s.id).filter((id) => id !== DOCS.find((d) => pathOf(d) === current)?.shelf)))
  const toggle = (id) => setShut((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  return (
    <Rail variant="folio" aria-label="Library" className={className}>
      <div className="shrink-0 px-[16px] pb-[8px] pt-[16px]">
        <Input variant="kolbox" size="md" aria-label="Filter the library" placeholder="Filter" value={q} onChange={(e) => setQ(e.target.value)} className="w-full" />
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[8px] pb-[24px]">
        {SHELVES.map((s) => {
          const list = docs.filter((d) => d.shelf === s.id)
          if (!list.length) return null
          const open = q.trim() || !shut.has(s.id)
          return (
            <div key={s.id}>
              <TreeRow variant="folio" label={s.label} count={list.length} expanded={Boolean(open)} onToggle={() => toggle(s.id)} />
              {open && list.map((d) => {
                const path = pathOf(d)
                return <TreeRow variant="folio" key={d.key} href={path} linkComponent={Link} label={d.title} active={path === current} title={d.title} onContextMenu={(e) => onContext?.(e, path, d.title)} />
              })}
            </div>
          )
        })}
      </nav>
    </Rail>
  )
}

/* ── the command list (19.5, ⇧⌘P or F1): every menu item by name, filtered as you type, like VS Code's palette;
   CommandOverlay folio, this host keeps the query, the lit row and the list ── */
export function CommandPalette({ menus, onClose }) {
  const [q, setQ] = useState('')
  const [at, setAt] = useState(0)
  const all = useMemo(() => menus.flatMap(([group, items]) => items.filter((it) => it !== '-' && it[1]).map((it) => ({ label: `${group}: ${it[0]}`, run: it[1], hint: it[2] }))), [menus])
  const list = useMemo(() => { const n = q.trim().toLowerCase(); return n ? all.filter((c) => n.split(/\s+/).every((w) => c.label.toLowerCase().includes(w))) : all }, [all, q])
  return (
    <CommandOverlay variant="kolbox" mode="commands" open aria-label="Commands" placeholder="Type a command" onClose={onClose}
      query={q} onQueryChange={(v) => { setQ(v); setAt(0) }} results={list} active={at} onActive={setAt}
      onSelect={(c) => { onClose(); c?.run() }} empty={!list.length ? 'No command matches.' : null} />
  )
}
