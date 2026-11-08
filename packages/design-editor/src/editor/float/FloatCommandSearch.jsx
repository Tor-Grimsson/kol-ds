import { useEffect, useMemo, useState } from 'react'
import { CommandOverlay } from '@kolkrabbi/kol-component'

/**
 * FloatCommandSearch — the float editor's ⌘K (plan-2026-11-05-float-editor 7.7, his float-more 30:914): every command of
 * the menu bar (Actions), every tool (Tools) and every place (Pages) in kol-component's CommandOverlay, under his tabs
 * All · Actions · Tools · Pages. Empty, it opens on Recent (the last four run — Text, Rectangle, Pen and Layers until
 * something is) and Pages. With the dock on, the card anchors above it; with the Rail, it is the centred search modal —
 * the same rows, the same look. ⌘K toggles it from anywhere but a field.
 *
 * @param {boolean}  open · {Function} onOpenChange
 * @param {Array}    menus     the menu bar's data (`useFloatMenus`) — `[{ label, items }]`, nested `items` are paths
 * @param {Array}    tools     `[{ id, label, icon, kbd?, run }]`
 * @param {Array}    pages     `[{ id, label, icon, hint?, run }]`
 * @param {Object}   [anchor]  the dock's ref — set, the card sits on it
 */
const TABS = [{ id: 'all', label: 'All' }, { id: 'actions', label: 'Actions' }, { id: 'tools', label: 'Tools' }, { id: 'pages', label: 'Pages' }]
const SEED = ['tool:text', 'tool:rect', 'tool:pen', 'action:View›Cards›Layers']
let recent = [] /* this session's last runs, newest first — kept across opens, not across reloads */

/* the menu bar's leaves as rows: a row's path is its id, its key (or its menu) the hint */
function actionRows(menus) {
  const out = []
  const walk = (items, path) => (items ?? []).forEach((it) => {
    if (!it || it.divider || it.heading || it.disabled) return
    if (it.items?.length) return walk(it.items, [...path, it.label])
    if (typeof it.onClick !== 'function' || !it.label) return
    out.push({ id: `action:${[...path, it.label].join('›')}`, label: it.label, icon: it.icon ?? 'command', hint: it.kbd ?? path.join(' › '), tab: 'actions', menu: path[0], run: it.onClick })
  })
  menus.forEach((m) => walk(m.items, [m.label]))
  /* a label met twice keeps its first row (View › Cards › Layers and Layers' own opener) */
  const seen = new Set()
  return out.filter((r) => (seen.has(r.id) ? false : seen.add(r.id)))
}

export default function FloatCommandSearch({ open, onOpenChange, menus = [], tools = [], pages = [], anchor }) {
  const [query, setQuery] = useState('')
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k' || e.shiftKey || e.altKey) return
      const t = e.target
      if (!open && (t?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t?.tagName))) return
      e.preventDefault()
      onOpenChange(!open)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])
  useEffect(() => { if (!open) setQuery('') }, [open])

  const rows = useMemo(() => [
    ...actionRows(menus),
    ...tools.map((t) => ({ id: `tool:${t.id ?? t.label}`, label: t.label, icon: t.icon, hint: t.kbd, tab: 'tools', run: t.run })),
    ...pages.map((p) => ({ ...p, id: `page:${p.id}`, tab: 'pages' })),
  ], [menus, tools, pages])
  const byId = useMemo(() => new Map(rows.map((r) => [r.id, r])), [rows])

  const suggestions = useMemo(() => {
    if (!open) return []
    const ids = [...recent, ...SEED.filter((s) => !recent.includes(s))].slice(0, 4)
    return [
      ...ids.map((id) => byId.get(id)).filter(Boolean).map((r) => ({ ...r, id: `recent:${r.id}`, group: 'Recent', key: r.id })),
      ...rows.filter((r) => r.tab === 'pages').map((r) => ({ ...r, group: 'Pages' })),
      /* an empty Actions or Tools tab lists all of them; All leaves them to Recent */
      ...rows.filter((r) => r.tab !== 'pages').map((r) => ({ ...r, group: r.tab === 'tools' ? 'Tools' : r.menu, tabOnly: true })),
    ]
  }, [open, rows, byId])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const group = { actions: 'Actions', tools: 'Tools', pages: 'Pages' }
    return rows
      .map((r) => ({ r, at: r.label.toLowerCase().indexOf(q), hinted: String(r.hint ?? '').toLowerCase().includes(q) }))
      .filter((x) => x.at >= 0 || x.hinted)
      .sort((a, b) => (b.at === 0) - (a.at === 0))
      .slice(0, 40)
      .map(({ r }) => ({ ...r, group: group[r.tab] }))
  }, [rows, query])

  const run = (item) => {
    const id = item.key ?? item.id
    recent = [id, ...recent.filter((x) => x !== id)].slice(0, 8)
    item.run?.()
  }

  return (
    <CommandOverlay
      open={open}
      onClose={() => onOpenChange(false)}
      query={query}
      onQueryChange={setQuery}
      results={results}
      suggestions={suggestions}
      onSelect={run}
      tabs={TABS}
      anchor={anchor}
      shortcutHint="⌘K"
      placeholder="Search tools, actions, pages…"
      selectLabel="Run"
    />
  )
}
