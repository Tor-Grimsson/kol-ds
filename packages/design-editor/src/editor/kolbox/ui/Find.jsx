import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Button, ButtonGroup, Dropdown, Input, LabeledControlSection, Menu, TreeRow } from '@kolkrabbi/kol-component'
import { matchCombo, rowLabelForLayer, useComposeState } from '../editor/engine.js'
import { setLayout } from '../editor/windows/workspace.js'

/* FIND AND REPLACE (plan-2026-11-20 W12), Figma's find as read in his file 2026-11-20: ⌘F (or the Pages search icon)
   puts find in the left rail in the place of Pages and Layers. The top row is the field, the options button and the
   close. The options menu: Find or Replace, the layer kinds (All and each kind, with their counts), Match case and
   Whole words. Replace adds the "Replace with…" field and Replace and Replace all under it. Then the results: "N
   results · This page" (the scope, This page by default, or All pages) with the previous and next arrows, the hits
   (type icon, the name with the match in bold accent), and on This page "See results on other pages". On All pages
   the hits group under their page, a row with its count that opens and closes; the open page's group starts open.
   It matches layer names and the words in text layers. Enter selects the next hit (the first press the lit one),
   ⇧Enter the one before: its page opens, it is selected and the canvas zooms to it. Replace and Replace all change
   the words in text layers only, each one undo step (the engine's replaceTexts across pages). Escape or the close
   puts Pages and Layers back and the canvas has its keys again. */

let state = { open: false, query: '', replace: '', replacing: false, all: false, kind: 'all', matchCase: false, whole: false, cursor: 0 }
const subs = new Set()
export const setFind = (patch) => { state = { ...state, ...patch }; subs.forEach((f) => f()) }
export const useFind = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => state)
const field = () => document.querySelector('input[aria-label="Find"]')
export const openFind = () => {
  setLayout({ leftCollapsed: false })
  setFind({ open: true })
  requestAnimationFrame(() => { field()?.focus(); field()?.select() })
}
const closeFind = () => { setFind({ open: false, cursor: 0 }); document.activeElement?.blur?.() }

/* ⌘F wherever the rail or its pill is on screen: one window listener however many parts ask for it; the browser's
   own find bar never opens while it is bound */
let mounts = 0
const onKey = (e) => { if (matchCombo(e, 'Mod+F')) { e.preventDefault(); e.stopPropagation(); openFind() } }
export function useFindKey() {
  useEffect(() => {
    if (mounts++ === 0) window.addEventListener('keydown', onKey, true)
    return () => { if (--mounts === 0) window.removeEventListener('keydown', onKey, true) }
  }, [])
}

/* Figma's kinds that this engine has (it has no components or instances) */
const KINDS = [['all', 'All'], ['text', 'Text'], ['frame', 'Frame / Group'], ['image', 'Image'], ['shape', 'Shape'], ['other', 'Other']]
const kindOf = (l) => (l.type === 'text' ? 'text' : ['frame', 'group', 'bool'].includes(l.type) ? 'frame' : l.type === 'image' ? 'image' : ['shape', 'path'].includes(l.type) ? 'shape' : 'other')

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const pattern = ({ query, matchCase, whole }) => new RegExp(whole ? `\\b${escape(query.trim())}\\b` : escape(query.trim()), matchCase ? 'g' : 'gi')

/* every match in the Layers list's order (top first), each frame's layers under it; `kind` filters */
export function findHits(pages, pageId, opts) {
  if (!opts.query.trim()) return []
  const re = pattern(opts)
  const has = (s) => { re.lastIndex = 0; return re.test(String(s ?? '')) }
  const out = []
  for (const p of pages) {
    if (!opts.all && p.id !== pageId) continue
    const walk = (list) => {
      for (const l of [...list].reverse()) {
        const inText = l.type === 'text' && has(l.text)
        if (inText || has(l.name)) out.push({ id: l.id, layer: l, pageId: p.id, page: p.name, inText, kind: kindOf(l) })
        if (Array.isArray(l.children)) walk(l.children)
      }
    }
    walk(p.layers)
  }
  return out
}

/* the row's name with the match in bold accent */
function Marked({ text, re }) {
  re.lastIndex = 0
  const m = re.exec(text)
  if (!m) return text
  return <>{text.slice(0, m.index)}<b className="font-semibold text-accent">{m[0]}</b>{text.slice(m.index + m[0].length)}</>
}

export default function Find({ iconFor }) {
  const { pages, pageId, selectedIds, setPage, select, updateLayer, replaceTexts } = useComposeState()
  const opts = useFind()
  const { query, replace, replacing, all, kind, matchCase, whole, cursor } = opts
  const optsRef = useRef(null)
  const [menu, setMenu] = useState(false)
  const [shut, setShut] = useState(() => new Set())
  const found = findHits(pages, pageId, opts)
  const hits = kind === 'all' ? found : found.filter((h) => h.kind === kind)
  const lit = Math.min(cursor, Math.max(0, hits.length - 1))
  const re = query.trim() ? pattern(opts) : null
  const go = (i) => {
    const h = hits[i]
    if (!h) return
    setFind({ cursor: i })
    if (h.pageId !== pageId) setPage(h.pageId)
    select(h.id)
    /* the engine's View › Zoom › To Selection, once the selection has rendered */
    setTimeout(() => window.dispatchEvent(new CustomEvent('kol:command', { detail: { id: 'zoom-selection' } })), 50)
  }
  const step = (by) => hits.length && go((lit + by + hits.length) % hits.length)
  const next = () => step(selectedIds.includes(hits[lit]?.id) ? 1 : 0)
  const replaced = (l) => String(l.text ?? '').replace(pattern(opts), replace)
  const textHits = hits.filter((h) => h.inText)
  const replaceOne = () => {
    const h = hits[lit]
    if (!h?.inText) return
    replaceTexts([{ pageId: h.pageId, id: h.id, text: replaced(h.layer) }], 'Replace')
  }
  const replaceAll = () => { if (textHits.length) replaceTexts(textHits.map((h) => ({ pageId: h.pageId, id: h.id, text: replaced(h.layer) })), `Replace ${textHits.length}`) }
  const onKeyDown = (e) => {
    e.stopPropagation()
    if (e.key === 'Escape') { e.preventDefault(); closeFind() }
    else if (e.key === 'Enter' && e.currentTarget.getAttribute('aria-label') === 'Replace') { e.preventDefault(); replaceOne() }
    else if (e.key === 'Enter') { e.preventDefault(); if (e.shiftKey) step(-1); else next() }
  }
  const count = (k) => (k === 'all' ? found.length : found.filter((h) => h.kind === k).length)
  const menuGroups = [
    [{ label: 'Find', value: 'find', check: !replacing }, { label: 'Replace', value: 'replace', check: replacing }],
    KINDS.map(([k, label]) => ({ label, value: `kind:${k}`, check: kind === k, shortcut: count(k) ? String(count(k)) : undefined })),
    [{ label: 'Match case', value: 'case', check: matchCase }, { label: 'Whole words', value: 'whole', check: whole }],
  ]
  const pick = (row) => {
    const v = String(row.value)
    if (v === 'find' || v === 'replace') setFind({ replacing: v === 'replace' })
    else if (v.startsWith('kind:')) setFind({ kind: v.slice(5), cursor: 0 })
    else if (v === 'case') setFind({ matchCase: !matchCase, cursor: 0 })
    else if (v === 'whole') setFind({ whole: !whole, cursor: 0 })
  }
  const row = (h) => {
    const i = hits.indexOf(h)
    return <TreeRow variant="kolbox" key={`${h.pageId}:${h.id}`} icon={iconFor?.(h.layer)} label={re ? <Marked text={rowLabelForLayer(h.layer)} re={re} /> : rowLabelForLayer(h.layer)} active={i === lit} onClick={() => go(i)} data-find-hit />
  }
  const groups = all ? pages.map((p) => ({ p, rows: hits.filter((h) => h.pageId === p.id) })).filter((g) => g.rows.length) : null
  const open = (id) => (id === pageId ? !shut.has(id) : shut.has(id))
  const toggle = (id) => setShut((cur) => { const n = new Set(cur); if (n.has(id)) n.delete(id); else n.add(id); return n })

  return (
    <>
      <LabeledControlSection variant="kolbox">
        <div className="flex items-center gap-2">
          <Input variant="kolbox" size="md" iconLeft="search" autoFocus aria-label="Find" placeholder="Find" className="min-w-0 flex-1"
            value={query} onChange={(e) => setFind({ query: e.target.value, cursor: 0 })} onKeyDown={onKeyDown} />
          <span ref={optsRef} className="flex"><Button variant="kolbox" iconOnly="sliders-rows" aria-label="Find options" aria-expanded={menu} onClick={() => setMenu((o) => !o)} className="size-4! text-text!"/></span>
          <Button variant="kolbox" iconOnly="x" aria-label="Close find" onClick={closeFind} className="size-4! text-text!"/>
        </div>
        {replacing && (
          <>
            <Input variant="kolbox" size="md" iconLeft="arrow-right" aria-label="Replace" placeholder="Replace with…"
              value={replace} onChange={(e) => setFind({ replace: e.target.value })} onKeyDown={onKeyDown} />
            <ButtonGroup align="right">
              <Button variant="kolbox" disabled={!hits[lit]?.inText} onClick={replaceOne}>Replace</Button>
              <Button variant="kolbox" disabled={!textHits.length} onClick={replaceAll}>Replace all</Button>
            </ButtonGroup>
          </>
        )}
        <Menu variant="kolbox" aria-label="Find options" anchor={optsRef} open={menu} onClose={() => setMenu(false)} onSelect={pick} groups={menuGroups} />
      </LabeledControlSection>
      {query.trim() && (
        <LabeledControlSection variant="kolbox">
          <div className="flex items-center gap-1 text-row text-muted" data-find-count>
            <span className="shrink-0">{hits.length} result{hits.length === 1 ? '' : 's'} ·</span>
            <Dropdown variant="kolbox" tone="grey" size="xs" ariaLabel="Find in" options={['This page', 'All pages']} value={all ? 'All pages' : 'This page'} onChange={(v) => { setFind({ all: v === 'All pages', cursor: 0 }); setShut(new Set()) }} />
            <span className="ml-auto flex items-center gap-2">
              <Button variant="kolbox" iconOnly="chevron-up" aria-label="Previous result" disabled={!hits.length} onClick={() => step(-1)} className="size-4! text-text!"/>
              <Button variant="kolbox" iconOnly="chevron-down" aria-label="Next result" disabled={!hits.length} onClick={next} className="size-4! text-text!"/>
            </span>
          </div>
          {groups
            ? groups.map(({ p, rows }) => [
              <TreeRow variant="kolbox" key={p.id} tree label={p.name} count={rows.length} expanded={open(p.id)} onClick={() => toggle(p.id)} onToggle={() => toggle(p.id)} data-find-page />,
              ...(open(p.id) ? rows.map(row) : []),
            ])
            : hits.map(row)}
          {!all && <button type="button" className="self-start px-1.5 text-row text-accent hover:underline" onClick={() => setFind({ all: true, cursor: 0 })}>See results on other pages</button>}
        </LabeledControlSection>
      )}
    </>
  )
}
