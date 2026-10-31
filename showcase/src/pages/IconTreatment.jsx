import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { IconBrowser } from '@kolkrabbi/kol-styleguide'
import { ContextMenu, useContextMenu, MenuRow, MenuFlyout, MenuDivider, ModalProvider, useModal } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import DATA from '../../../_tmp/2026-10-31-icon-page/icon-treatment.json'

/* IconTreatment — DEV ONLY (App.jsx lazy-loads it at /demo/icon-treatment, outside the shell, behind import.meta.env.DEV, so neither the data nor the SVGs reach
 * the ui.kolkrabbi.io bundle). The 559 treated icons of the IconTreatment ticket on kol-styleguide's IconBrowser:
 * every facet a Dropdown, labels off, icons first (2026-10-31 — user: "I really just need to see the icons"). */
const SVG = import.meta.glob('../../../lobby/archive/_assets/IconTreatment/treated/*.svg', { query: '?raw', import: 'default', eager: true })
const svgOf = Object.fromEntries(Object.entries(SVG).map(([p, s]) => [p.split('/').pop().slice(0, -4), s]))

/* an empty bug list reads as `none`, so the Bug dropdown can pick the clean ones too */
const BASE = DATA.map((i) => ({ ...i, bug: i.bug.length ? i.bug : ['none'], svg: svgOf[i.name] ?? null }))
const values = (key) => [...new Set(BASE.flatMap((i) => i[key]))].sort((a, b) => (a === 'none') - (b === 'none') || a.localeCompare(b))
/* Category follows the six Figma frames (library--kol-icon 151:1760), then `other` */
const CATEGORY_ORDER = ['flow-connect', 'faders', 'code', 'input', 'nav', 'shape-design', 'other']
const FACETS = [
  { label: 'Batch', key: 'batch', all: 'All batches' },
  { label: 'Category', key: 'category', all: 'All categories' },
  { label: 'Set group', key: 'setGroup', all: 'All set groups' },
  { label: 'Taxonomy', key: 'taxonomy', all: 'All taxonomy' },
  { label: 'Cut', key: 'cut', all: 'All cuts' },
  { label: 'Clash', key: 'clash', all: 'All clashes' },
  { label: 'Bug', key: 'bug', all: 'All bugs' },
  { label: 'Cluster', key: 'cluster', all: 'All clusters' },
]

/* the tooltip's facts, in this order (2026-10-31 — user: "it would be great to have meta info about the icon") */
const META = [['category', 'category'], ['set group', 'setGroup'], ['taxonomy', 'taxonomy'], ['batch', 'batch'], ['cluster', 'cluster'], ['cut', 'cut'], ['clash', 'clash'], ['bugs', 'bug']]

/* SELECT AND MOVE (2026-10-31 — user: "toggle 5, 10, 20 icons, then I can right click and move those to category").
 * Every move is appended to lobby/archive/_assets/IconTreatment/moves.json by showcase/vite.config.js's dev middleware;
 * the page replays the log over the JSON's categories, so a reload keeps every move. An undo appends the reverse,
 * marked `undoes: <at of the move>`. */
const ENDPOINT = '/__icon-treatment/moves'
const replay = (log) => {
  const cat = Object.fromEntries(BASE.map((i) => [i.name, i.category]))
  for (const m of log) for (const n of m.names) if (n in cat) cat[n] = m.to
  return cat
}
/* the move an undo reverses: the last one not already undone */
const lastLive = (log) => {
  const undone = new Set(log.filter((m) => m.undoes).map((m) => m.undoes))
  return [...log].reverse().find((m) => !m.undoes && !undone.has(m.at)) ?? null
}

/* SURVIVES A RELOAD (2026-10-31 — user: "I cant do anything, it keeps refreshing"): the browser keeps its controls under
 * persistKey; the page keeps the selection and the scroll in sessionStorage. Storage can throw — then it just starts fresh. */
const KEEP = 'icon-treatment'
const kept = (k, fallback) => { try { return JSON.parse(sessionStorage.getItem(`${KEEP}:${k}`)) ?? fallback } catch { return fallback } }
const keep = (k, v) => { try { sessionStorage.setItem(`${KEEP}:${k}`, JSON.stringify(v)) } catch { /* storage blocked */ } }

function Treatment() {
  const [log, setLog] = useState([])
  /* the moves log changes which icons a filter shows, so the scroll is put back only once it has loaded */
  const [ready, setReady] = useState(false)
  const [selected, setSelected] = useState(() => kept('selected', []))
  const menu = useContextMenu()
  const { prompt } = useModal()

  useEffect(() => keep('selected', selected), [selected])
  /* a layout effect, so it runs again when the shell's Suspense shows the page after an HMR update hid it (2026-10-31): the
   * page collapses for a frame, the window clamps to 0 — that clamp is never saved, and the kept scroll comes back */
  useLayoutEffect(() => {
    if (!ready) return undefined
    /* the wall can still be growing on the first frames: try for up to a second, saving nothing until it lands */
    const y = kept('scroll', 0)
    let restoring = y > 0, tries = 0, frame = 0
    const restore = () => {
      window.scrollTo(0, y)
      if (Math.abs(window.scrollY - y) > 1 && tries++ < 60) frame = requestAnimationFrame(restore)
      else restoring = false
    }
    if (restoring) restore()
    const onScroll = () => { if (!restoring && document.documentElement.scrollHeight > window.innerHeight + 1) keep('scroll', window.scrollY) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll) }
  }, [ready])

  useEffect(() => { fetch(ENDPOINT).then((r) => r.json()).then(setLog).catch(() => {}).finally(() => setReady(true)) }, [])

  const cat = useMemo(() => replay(log), [log])
  /* the label under a plate reads its CURRENT category, and the tooltip lists every facet — a move shows at once */
  const items = useMemo(() => BASE.map((i) => {
    const it = { ...i, category: cat[i.name], group: cat[i.name] }
    return { ...it, meta: META.map(([label, key]) => [label, it[key]]) }
  }), [cat])
  const order = useMemo(() => [...CATEGORY_ORDER, ...new Set(Object.values(cat).filter((c) => !CATEGORY_ORDER.includes(c)))], [cat])
  /* the Category dropdown lists only categories that hold icons now: CATEGORY_ORDER's first, then the rest A–Z (the move menu keeps `order`) */
  const held = useMemo(() => {
    const has = new Set(Object.values(cat))
    return [...CATEGORY_ORDER.filter((c) => has.has(c)), ...[...has].filter((c) => !CATEGORY_ORDER.includes(c)).sort()]
  }, [cat])
  const groups = useMemo(() => FACETS.map((g) => ({ ...g, values: g.key === 'category' ? held : values(g.key) })), [held])

  const append = useCallback((entries) => {
    setLog((l) => [...l, ...entries])
    fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entries) })
      .then((r) => r.json()).then(setLog).catch(() => {})
  }, [])

  const move = (picked, to) => {
    const names = picked.map((i) => i.name).filter((n) => cat[n] !== to)
    if (!names.length) return
    const froms = [...new Set(names.map((n) => cat[n]))]
    /* `from` is the one category they left, or a name → category map when they came from several */
    const from = froms.length === 1 ? froms[0] : Object.fromEntries(names.map((n) => [n, cat[n]]))
    append([{ at: new Date().toISOString(), names, from, to }])
    setSelected([])
  }
  const newCategory = async (picked) => {
    const name = (await prompt('New category', '', { okLabel: 'Move', placeholder: 'category-name' }))?.trim()
    if (name) move(picked, name)
  }
  const undo = useCallback(() => {
    const m = lastLive(log)
    if (!m) return
    const fromOf = (n) => (typeof m.from === 'string' ? m.from : m.from[n])
    const back = Object.groupBy(m.names, fromOf)
    const at = new Date().toISOString()
    append(Object.entries(back).map(([to, names]) => ({ at, names, from: m.to, to, undoes: m.at })))
  }, [log, append])

  /* cmd/ctrl-z undoes the last move */
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.shiftKey || e.key.toLowerCase() !== 'z' || e.target.closest?.('input, textarea')) return
      e.preventDefault()
      undo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo])

  return (
    <main id="icons-treatment" className="min-h-dvh w-full bg-surface-primary px-4 pt-6 pb-24">
      <IconBrowser
        items={items}
        title="Icon treatment"
        filters="dropdown"
        filterGroups={groups}
        labels={false}
        labelToggle
        perRowControl
        selectable
        persistKey={KEEP}
        selected={selected}
        onSelect={setSelected}
        onContextMenu={(picked, e) => menu.openAt(e, picked)}
        actions={<ThemeToggle label={false} />}
      />
      <ContextMenu menu={menu} className="overflow-visible! max-h-none!">
        {(picked) => (
          <>
            <MenuFlyout flyout scroll label="Move to category">
              {order.map((c) => <MenuRow key={c} onClick={() => move(picked, c)}>{c}</MenuRow>)}
              <MenuDivider />
              <MenuRow onClick={() => newCategory(picked)}>New category…</MenuRow>
            </MenuFlyout>
            <MenuDivider />
            <MenuRow onClick={undo} disabled={!lastLive(log)} kbd="⌘Z">Undo last move</MenuRow>
            <MenuRow onClick={() => setSelected([])}>Clear selection</MenuRow>
          </>
        )}
      </ContextMenu>
    </main>
  )
}

export default function IconTreatment() {
  return <ModalProvider><Treatment /></ModalProvider>
}
