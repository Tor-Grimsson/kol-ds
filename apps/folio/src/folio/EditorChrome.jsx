/* The editor's one set of chrome (plan W16, user 2026-11-04: "there are so many inconsistencies"): the menu bar, the
   find bar, the status bar, New's format Overlay and the library tree Rail (W17). Every format — Markdown, Text, Code —
   renders these same parts; only the writing surface and its toolbar change. */
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './parts'
import { SHELVES, DOCS } from './shelf'
import { CODE_LANGS } from './Fence'

const btn = 'kol-reader-meta flex h-[32px] shrink-0 items-center gap-[8px] whitespace-nowrap rounded-[3px] px-[10px] text-folio-ink hover:bg-folio-surface aria-pressed:bg-folio-mint aria-pressed:text-folio-green disabled:opacity-30'
export const Tool = ({ icon, children, className = '', ...rest }) => (
  <button type="button" onMouseDown={(e) => e.preventDefault()} {...rest} className={`${btn} ${className}`}>{icon && <Icon name={icon} />}{children}</button>
)

/* ── menus: [label, fn, keys, checked] or '-' ── */
const Items = ({ label, items, onDone, className = '', style }) => (
  <span role="menu" aria-label={label} style={style} onMouseDown={(e) => e.stopPropagation()} className={`z-50 flex min-w-[240px] flex-col rounded-[4px] border border-folio-rule bg-folio-paper py-[6px] text-folio-ink shadow-[0_2px_6px_-2px_rgb(0_0_0/0.3),0_8px_24px_-8px_rgb(0_0_0/0.4)] ${className}`}>
    {items.map((it, i) => (it === '-' ? <span key={i} className="my-[6px] h-px bg-folio-rule" /> : (
      <button key={`${it[0]}${i}`} type="button" role="menuitem" disabled={!it[1]} onMouseDown={(e) => e.preventDefault()} onClick={() => { onDone(); it[1]?.() }} className="kol-reader-meta flex h-[32px] items-center gap-[16px] px-[14px] text-left hover:bg-folio-surface disabled:text-folio-muted disabled:hover:bg-transparent">
        <span className="w-[12px] text-folio-green">{it[3] ? '✓' : ''}</span>{it[0]}<span className="ml-auto text-folio-muted">{it[2] ?? ''}</span>
      </button>
    )))}
  </span>
)
/* the right-click menu (19.9): the same items as the menu bar's, at the pointer, in place of the browser's own */
export function ContextMenu({ at, items, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose()
    addEventListener('mousedown', onClose); addEventListener('keydown', esc); addEventListener('scroll', onClose, true); addEventListener('blur', onClose)
    return () => { removeEventListener('mousedown', onClose); removeEventListener('keydown', esc); removeEventListener('scroll', onClose, true); removeEventListener('blur', onClose) }
  }, [onClose])
  const rows = items.filter((it) => it !== '-').length, seps = items.length - rows
  return <Items label="Context" items={items} onDone={onClose} className="fixed" style={{ left: Math.min(at.x, innerWidth - 260), top: Math.max(8, Math.min(at.y, innerHeight - (rows * 32 + seps * 13 + 16) - 8)) }} />
}
function Menu({ label, items, open, setOpen }) {
  return (
    <span className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open === label} onMouseDown={(e) => e.preventDefault()} onClick={() => setOpen(open === label ? null : label)} onMouseEnter={() => open && setOpen(label)} className={`kol-reader-meta flex h-[32px] items-center rounded-[4px] px-[14px] text-folio-ink hover:bg-folio-surface ${open === label ? 'bg-folio-surface' : ''}`}>{label}</button>
      {open === label && <Items label={label} items={items} onDone={() => setOpen(null)} className="absolute left-0 top-[calc(100%+4px)]" />}
    </span>
  )
}
/* the menu bar: File · Edit · Insert · Format · View · Tools · Help, and the tools every format has on the right */
export function MenuBar({ menus, children }) {
  const [open, setOpen] = useState(null)
  useEffect(() => {
    if (!open) return
    const off = (e) => { if (!e.target.closest?.('[role=menu],[aria-haspopup=menu]')) setOpen(null) }
    const esc = (e) => e.key === 'Escape' && setOpen(null)
    addEventListener('mousedown', off); addEventListener('keydown', esc)
    return () => { removeEventListener('mousedown', off); removeEventListener('keydown', esc) }
  }, [open])
  return (
    <div className="flex h-[48px] shrink-0 items-center gap-[2px] border-y border-folio-rule pl-[42px] pr-[48px]">
      {menus.map(([label, items]) => <Menu key={label} label={label} items={items} open={open} setOpen={setOpen} />)}
      <div className="ml-auto flex items-center gap-[4px]">{children}</div>
    </div>
  )
}

/* the toolbar row under the menus — its contents are the format's own */
export const ToolRow = ({ children }) => (
  <div className="flex h-[56px] shrink-0 items-center gap-[8px] overflow-x-auto border-b border-folio-rule px-[56px] [scrollbar-width:none]">{children}</div>
)

/* ── find & replace: the same bar in every format ── */
export function FindBar({ find, setFind, repl, setRepl, count, onPrev, onNext, onReplace, onReplaceAll, matchCase, setMatchCase, onClose }) {
  const field = 'kol-reader-meta h-[32px] w-[220px] rounded-[3px] border border-folio-rule bg-folio-paper px-[10px] text-folio-ink outline-none focus:border-folio-green'
  const icon = 'flex size-[28px] items-center justify-center rounded-[3px] hover:bg-folio-paper'
  return (
    <div className="flex h-[48px] shrink-0 items-center gap-[10px] border-b border-folio-rule bg-folio-surface px-[56px]" onKeyDown={(e) => { if (e.key === 'Escape') onClose(); if (e.key === 'Enter') { e.preventDefault(); e.shiftKey ? onPrev() : onNext() } }}>
      <Icon name="search" />
      <input autoFocus aria-label="Find" placeholder="Find" value={find} onChange={(e) => setFind(e.target.value)} className={field} />
      <span className="kol-reader-meta w-[64px] tabular-nums text-folio-muted">{count}</span>
      <button type="button" aria-label="Previous match" onMouseDown={(e) => e.preventDefault()} onClick={onPrev} className={icon}><Icon name="arrow-left" size={14} /></button>
      <button type="button" aria-label="Next match" onMouseDown={(e) => e.preventDefault()} onClick={onNext} className={icon}><Icon name="arrow-right" size={14} /></button>
      <button type="button" aria-pressed={matchCase} onClick={() => setMatchCase(!matchCase)} className={`kol-reader-meta h-[28px] rounded-[3px] px-[8px] ${matchCase ? 'bg-folio-mint text-folio-green' : 'text-folio-muted hover:bg-folio-paper'}`}>Aa</button>
      <span className="mx-[8px] h-[20px] w-px bg-folio-rule" />
      <input aria-label="Replace with" placeholder="Replace with" value={repl} onChange={(e) => setRepl(e.target.value)} className={field} />
      <Tool onClick={onReplace}>Replace</Tool>
      <Tool onClick={onReplaceAll}>Replace all</Tool>
      <button type="button" aria-label="Close find" onClick={onClose} className={`ml-auto text-folio-muted ${icon}`}><Icon name="x" size={14} /></button>
    </div>
  )
}

/* ── the status bar: counts on the left; format, language and the view on the right ── */
export const StatusBar = ({ left, children }) => (
  <div className="kol-reader-meta flex h-[40px] shrink-0 items-center justify-between gap-[24px] whitespace-pre border-t border-folio-rule px-[56px]">
    <p className="text-folio-muted">{left}</p>
    <div className="flex items-center gap-[24px]">{children}</div>
  </div>
)

/* ── New: what to make (16.3) ── */
export function NewOverlay({ onPick, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose()
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [onClose])
  const card = 'flex flex-col items-start gap-[8px] rounded-[4px] border border-folio-rule p-[20px] text-left hover:border-folio-green hover:bg-folio-mint'
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[rgb(38_41_34/0.32)] px-[16px] pt-[14vh]" onMouseDown={onClose}>
      <div role="dialog" aria-label="New document" onMouseDown={(e) => e.stopPropagation()} className="w-[720px] max-w-full rounded-[4px] border border-folio-rule bg-folio-paper shadow-[0_2px_6px_-2px_rgb(0_0_0/0.3),0_8px_24px_-8px_rgb(0_0_0/0.4)]">
        <div className="flex h-[64px] items-center justify-between border-b border-folio-rule pl-[24px] pr-[16px]">
          <p className="text-[18px] font-semibold leading-[22px]">New document</p>
          <button type="button" aria-label="Close" onClick={onClose} className="flex size-[32px] items-center justify-center rounded-[3px] text-folio-muted hover:bg-folio-surface"><Icon name="x" size={14} /></button>
        </div>
        <div className="grid grid-cols-3 gap-[12px] p-[24px]">
          <button type="button" autoFocus onClick={() => onPick('md')} className={card}>
            <span className="text-[16px] font-semibold">Markdown</span>
            <span className="kol-reader-meta text-folio-muted">Headings, lists and links, with a preview beside it. Saved as .md.</span>
          </button>
          <button type="button" onClick={() => onPick('rich')} className={card}>
            <span className="text-[16px] font-semibold">Text</span>
            <span className="kol-reader-meta text-folio-muted">Fonts, sizes and spacing, like a word processor. ⇧⌘T makes it plain.</span>
          </button>
          <div className={`${card} hover:bg-transparent`}>
            <button type="button" onClick={() => onPick('code', 'js')} className="flex flex-col items-start gap-[8px] text-left">
              <span className="text-[16px] font-semibold">Code</span>
              <span className="kol-reader-meta text-folio-muted">Coloured as you type. Pick a language:</span>
            </button>
            <span className="flex flex-wrap gap-[4px]">
              {CODE_LANGS.map(([e, , label]) => <button key={e} type="button" onClick={() => onPick('code', e)} className="kol-reader-meta-sm rounded-[3px] border border-folio-rule px-[6px] py-[2px] hover:border-folio-green hover:text-folio-green">{label}</button>)}
            </span>
          </div>
        </div>
      </div>
    </div>
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
    <aside aria-label="Library" className={`flex min-w-0 flex-col overflow-hidden ${className}`}>
      <div className="shrink-0 px-[16px] pb-[8px] pt-[16px]">
        <input aria-label="Filter the library" placeholder="Filter" value={q} onChange={(e) => setQ(e.target.value)} className="kol-reader-meta h-[32px] w-full rounded-[3px] border border-folio-rule bg-folio-paper px-[10px] text-folio-ink outline-none focus:border-folio-green" />
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[8px] pb-[24px]">
        {SHELVES.map((s) => {
          const list = docs.filter((d) => d.shelf === s.id)
          if (!list.length) return null
          const open = q.trim() || !shut.has(s.id)
          return (
            <div key={s.id}>
              <button type="button" aria-expanded={Boolean(open)} onClick={() => toggle(s.id)} className="kol-reader-meta flex h-[32px] w-full items-center gap-[8px] rounded-[3px] px-[8px] text-left font-semibold hover:bg-folio-surface">
                <Icon name={open ? 'chevron-down' : 'chevron-right'} size={12} />{s.label}<span className="ml-auto font-normal text-folio-muted">{list.length}</span>
              </button>
              {open && list.map((d) => {
                const path = pathOf(d)
                return <Link key={d.key} to={path} onContextMenu={(e) => onContext?.(e, path, d.title)} aria-current={path === current ? 'page' : undefined} title={d.title} className={`kol-reader-meta block truncate rounded-[3px] py-[6px] pl-[28px] pr-[8px] ${path === current ? 'bg-folio-mint text-folio-green' : 'text-folio-muted hover:bg-folio-surface hover:text-folio-ink'}`}>{d.title}</Link>
              })}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

/* ── the command list (19.5, ⇧⌘P or F1): every menu item by name, filtered as you type, like VS Code's palette ── */
export function CommandPalette({ menus, onClose }) {
  const [q, setQ] = useState('')
  const [at, setAt] = useState(0)
  const all = useMemo(() => menus.flatMap(([group, items]) => items.filter((it) => it !== '-' && it[1]).map((it) => ({ label: `${group}: ${it[0]}`, run: it[1], keys: it[2] }))), [menus])
  const list = useMemo(() => { const n = q.trim().toLowerCase(); return n ? all.filter((c) => n.split(/\s+/).every((w) => c.label.toLowerCase().includes(w))) : all }, [all, q])
  const go = (c) => { onClose(); c?.run() }
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-[16px] pt-[12vh]" onMouseDown={onClose}>
      <div role="dialog" aria-label="Commands" onMouseDown={(e) => e.stopPropagation()} className="flex max-h-[60vh] w-[640px] max-w-full flex-col overflow-hidden rounded-[4px] border border-folio-rule bg-folio-paper text-folio-ink shadow-[0_2px_6px_-2px_rgb(0_0_0/0.3),0_8px_24px_-8px_rgb(0_0_0/0.4)]">
        <input autoFocus aria-label="Command" placeholder="Type a command" value={q} onChange={(e) => { setQ(e.target.value); setAt(0) }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowDown') { e.preventDefault(); setAt((i) => Math.min(i + 1, list.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setAt((i) => Math.max(i - 1, 0)) }
            if (e.key === 'Enter') { e.preventDefault(); go(list[at]) }
          }}
          className="kol-reader-meta h-[48px] shrink-0 border-b border-folio-rule bg-transparent px-[16px] outline-none" />
        <div role="listbox" aria-label="Commands" className="min-h-0 overflow-y-auto py-[6px]">
          {list.map((c, i) => (
            <button key={c.label} type="button" role="option" aria-selected={i === at} onMouseEnter={() => setAt(i)} onClick={() => go(c)} className={`kol-reader-meta flex h-[32px] w-full items-center px-[16px] text-left ${i === at ? 'bg-folio-surface' : ''}`}>
              {c.label}<span className="ml-auto text-folio-muted">{c.keys ?? ''}</span>
            </button>
          ))}
          {!list.length && <p className="kol-reader-meta px-[16px] py-[8px] text-folio-muted">No command matches.</p>}
        </div>
      </div>
    </div>
  )
}
