import { useEffect, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import TreeRow from '../molecules/TreeRow.jsx'

/* taxonomy-ok: organism — nests TreeRow (molecule) + kol-icons's Icon. */

/**
 * NavDrawer — The hidden nav, called up on demand. (float-everything W6 row 94, 2026-11-04 — kol-float--style 46:3115.)
 * When the sidebar is hidden (kol-shell's RailTrigger), this is what the trigger opens: a 280 float overlay on the
 * sheet radius, `kol-float-solid`, 16 in, over the page at its top-left — no scrim, it is not a blocking task. The
 * title (`kol-float-body`) and × on one row; the tree under it — `TreeRow size="md"` for a destination, its `sub` rows
 * `TreeRow size="xs"` (26) indented beneath; `footer` at the foot (`All pages ↓`). Escape and the × close it; picking
 * a row navigates and closes it.
 *
 * @param {boolean}  open · {Function} onClose
 * @param {string}   [title]
 * @param {Array}    items           `{ icon, label, path, count?, sub?: [...] }` (a `{ heading }` draws a section label)
 * @param {string}   [currentPath]
 * @param {Function} [onNavigate]    `(path) => void`
 * @param {Array}    [defaultExpanded]  sections open on open; default — the section holding `currentPath`
 * @param {ReactNode} [footer]
 * @param {boolean}  [fixed=true]    false renders it in flow (a preview, a story)
 */
export default function NavDrawer({ open, onClose, title, items = [], currentPath = '', onNavigate, defaultExpanded, footer, fixed = true, className = '' }) {
  const here = items.filter((it) => it.sub?.some((c) => c.path === currentPath)).map((it) => it.path)
  const [expanded, setExpanded] = useState(() => new Set(defaultExpanded ?? here))
  const toggle = (p) => setExpanded((s) => { const n = new Set(s); n.has(p) ? n.delete(p) : n.add(p); return n })
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  const go = (p) => () => { onNavigate?.(p); onClose?.() }
  return (
    <nav aria-label={title ?? 'Navigation'}
      className={`kol-float-solid flex max-h-[calc(100dvh-32px)] w-[280px] flex-col gap-3 rounded-[var(--kol-float-menu-r)] p-4 ${fixed ? 'fixed left-4 top-4 z-[var(--kol-z-overlay)]' : ''} ${className}`.trim()}>
      <div className="flex items-center gap-3 pl-1">
        <span className="kol-float-body min-w-0 flex-1 truncate text-fg-emphasis">{title}</span>
        {onClose && (
          <button type="button" aria-label="Close" onClick={onClose} className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-oq-64 hover:bg-fg-08 hover:text-oq-96 cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]">
            <Icon name="x" size={16} />
          </button>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto [scrollbar-width:none]">
        {items.map((it, i) => {
          if (it.heading) return <span key={`h${i}`} className="kol-float-ruler px-2.5 pb-1 pt-3 text-fg-64">{it.heading}</span>
          const kids = it.sub ?? []
          const isOpen = expanded.has(it.path)
          return (
            <div key={it.path ?? it.label} className="flex flex-col gap-0.5">
              <TreeRow size="md" icon={it.icon} label={it.label} count={it.count}
                active={it.path === currentPath} open={isOpen && kids.some((c) => c.path === currentPath)}
                onClick={kids.length ? () => toggle(it.path) : go(it.path)} aria-expanded={kids.length ? isOpen : undefined} />
              {isOpen && kids.map((c) => (
                <TreeRow key={c.path} size="xs" depth={1} icon={c.icon} label={c.label} count={c.count} active={c.path === currentPath} onClick={go(c.path)} />
              ))}
            </div>
          )
        })}
      </div>
      {footer && <div className="shrink-0 pl-1">{footer}</div>}
    </nav>
  )
}
