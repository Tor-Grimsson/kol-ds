import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import Find, { openFind, useFind, useFindKey } from './Find.jsx'
import { useLayerKeys, useTouchHold } from './listMoves.js'
import { Button, Input, Rail, RailHeader, LabeledControlSection, TreeRow } from '@kolkrabbi/kol-component'
import { useComposeState } from '../editor/engine.js'
import { folderOf, placeOf, usePlaces } from '../files/places.js'
import { useRailResize } from '../app/RailResize.jsx'

/* the line under the file title: the ONE folder the open file lives in (files/places.js, plan-2026-11-19 C8); a document
   never saved lives nowhere yet and says so */
function FilePlace() {
  const { currentPresetId } = useComposeState()
  usePlaces()
  return <span data-file-place>{currentPresetId ? folderOf(placeOf(currentPresetId)).name : 'Not saved'}</span>
}

/* The left rail (Figma plan 7.1, 16.1): the Rail shell with content in its slots; it draws nothing of its own.
   variant editor: the file header (the title, and under it the folder the file lives in: FilePlace, which reads the
     open file itself; a `fileMeta` prop is no longer read), Pages, the Layers tree.
     file, onCollapse (the header's collapse button); collapsed: nothing (C4.3: the screen draws RailPill over the
     canvas); pages [{ id, label, selected, onClick, onContextMenu }], onAddPage; layers [{ id, label, icon, depth, open,
     selected, onClick }] (open undefined for a layer with no children). The header's button is Minimize UI (W1.2,
     [36]: the file name and its menu at the top, the toggle beside it).
     float (W2.2): { pages, layers } draws only those sections, each its own floating piece under the pill (the undocked
     state), with no header and no Rail. list: a node drawn in the Layers section in the
     place of those rows (the editor's working list, round 4 W1);
     `findRows` (the same row shape, every page's layers, C4.4) gives find (Find.jsx, W12) each hit's icon; the Pages
     search icon and ⌘F open find in the place of Pages and Layers (Figma's), undocked as the one piece; onCollapseAll: the Layers header's collapse-all button at its right (W19.4), absent not drawn. No footer: the
     design draws none (W19.4; its actions are the Layer menu's).
   variant labs: the lab picker alone.
     rows: the catalog [{ key, icon, label, run, active, sub? }], a row with `sub` opens its list; onPick(row). */
export default function LeftRail({ variant = 'editor', ...props }) {
  return variant === 'labs' ? <LabsPicker {...props} /> : <Document {...props} />
}

/* the header's collapse and the section actions are bare glyphs: the collapse a 16 glyph in a 32 box, the section actions
   16 glyphs in 24 boxes 4 apart (the section sets the 24, kol-theme), as Figma's rails measure (W3) */
const action = (icon, label, onClick) => <Button variant="kolbox" iconOnly={icon} aria-label={label} onClick={onClick} className="size-4! text-text!"/>

function Document({ file, onCollapse, collapsed = false, float, pages = [], onAddPage, layers = [], findRows, list, onCollapseAll }) {
  /* the list keys, a touch drag on a row and ⌘F (W10, W12) answer wherever the rail or its pieces are on screen */
  useLayerKeys()
  useTouchHold()
  useFindKey()
  const finding = useFind().open
  /* COLLAPSED (plan-2026-11-19 C4.3, his reference): the rail is gone, no strip; the screen draws the floating pill
     (RailPill below) over the canvas, which takes the freed width */
  if (collapsed) return null
  /* find draws each hit with the type icon its Layers row carries */
  const icons = new Map([...(findRows ?? []), ...layers].map((l) => [l.id, l.icon]))
  const findSection = finding && <Find iconFor={(l) => icons.get(l.id)} />
  const pagesSection = pages.length > 1 ? <Pages pages={pages} onAddPage={onAddPage} /> : (
    <LabeledControlSection variant="kolbox" label="Pages" end={action('plus', 'Add page', onAddPage)} />
  )
  const layersSection = (
    <LabeledControlSection variant="kolbox" label="Layers" end={onCollapseAll && action('fold-vertical', 'Collapse all', onCollapseAll)}>
      {list ?? layers.map((l) => <TreeRow variant="kolbox" key={l.id} tree icon={l.icon} label={l.label} depth={l.depth} expanded={l.open} active={l.selected} onClick={l.onClick} />)}
    </LabeledControlSection>
  )
  /* UNDOCKED (W2.2): each chosen section a floating piece on the one floating surface, stacked under the pill */
  if (float) {
    const piece = (key, node) => <div key={key} className="kol-kolbox-surface flex max-h-full min-h-0 w-(--kol-kolbox-rail-w) flex-col overflow-y-auto rounded-[var(--kol-radius-12)] bg-panel" data-rail="left" data-float-piece={key}>{node}</div>
    /* find, as Figma's, takes the place of Pages and Layers */
    if (finding) return piece('find', findSection)
    return [float.pages && piece('pages', pagesSection), float.layers && piece('layers', layersSection)].filter(Boolean)
  }
  return (
    <Rail variant="kolbox"
      side="left"
      aria-label="Layers"
      header={<RailHeader variant="kolbox" size="sm" title={file} subtitle={<FilePlace />} actions={onCollapse && <Button variant="kolbox" iconOnly="panel-left" aria-label="Minimize UI" onClick={onCollapse} className="size-8! text-text!"/>} />}
    >
      {/* PAGES OPENS CLOSED (his ruling, said five times, last 2026-11-19: "PAGES should open CLOSED like this but just
          Pages"): with the one page a file starts with, the section is its title and a plus and nothing else, as a
          closed Effects section reads. The plus adds a page, and from then on the list and the search are there. */}
      {finding ? findSection : pagesSection}
      {!finding && layersSection}
    </Rail>
  )
}

/* PAGES (plan-2026-11-19 C4.4): the search icon opens find (Find.jsx, W12) in the section's place. A page row's right
   click is the screen's (`onContextMenu` on the row). THE DRAG (W10, his "as Figma's"): a press on a row and 4 px of
   travel lift it, by mouse or by a finger held still (listMoves.js); the line between rows is the one Layers draws;
   release moves the page there in one undo step through the engine's movePage, Escape cancels. */
function Pages({ pages, onAddPage }) {
  const { movePage } = useComposeState()
  const size = useRailResize('kol-kolbox-pages', 'top')
  const [drag, setDrag] = useState(null)
  const listRef = useRef(null)
  const swallow = useRef(false)
  /* the drop under a client y: { id, pos } of the row and its half, or null on the dragged row itself */
  const placeAt = (dragId, y) => {
    const rows = [...(listRef.current?.querySelectorAll('[data-page-row]') ?? [])]
    if (!rows.length) return null
    const row = rows.find((r) => { const b = r.getBoundingClientRect(); return y >= b.top && y < b.bottom }) ?? (y < rows[0].getBoundingClientRect().top ? rows[0] : rows[rows.length - 1])
    const id = row.getAttribute('data-page-row')
    if (id === dragId) return null
    const b = row.getBoundingClientRect()
    return { id, pos: y < b.top + b.height / 2 ? 'above' : 'below' }
  }
  const down = (e, id) => {
    if (e.button !== 0) return
    const row = e.currentTarget, pid = e.pointerId, x0 = e.clientX, y0 = e.clientY
    let lifted = false, over = null
    const move = (ev) => {
      if (ev.pointerId !== pid) return
      if (!lifted) {
        if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 4) return
        lifted = true
        row.setPointerCapture?.(pid)
        document.documentElement.style.cursor = 'grabbing'
      }
      over = placeAt(id, ev.clientY)
      setDrag({ id, over })
    }
    const end = (drop) => (ev) => {
      if (ev.pointerId !== undefined && ev.pointerId !== pid) return
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
      document.removeEventListener('pointercancel', cancel)
      document.removeEventListener('keydown', esc, true)
      document.documentElement.style.cursor = ''
      if (lifted) {
        swallow.current = true
        setTimeout(() => { swallow.current = false }, 0)
        if (drop && over) {
          const from = pages.findIndex((p) => p.id === id), at = pages.findIndex((p) => p.id === over.id)
          const to = over.pos === 'above' ? (at > from ? at - 1 : at) : (at > from ? at : at + 1)
          if (to !== from) movePage(id, to - from)
        }
      }
      setDrag(null)
    }
    const up = end(true), cancel = end(false)
    const esc = (ev) => { if (ev.key === 'Escape' && lifted) { ev.preventDefault(); ev.stopPropagation(); cancel(ev) } }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
    document.addEventListener('pointercancel', cancel)
    document.addEventListener('keydown', esc, true)
  }
  /* the line under the list drags to share the rail's height with Layers (W2.3, [46], [47]) */
  return (
    <div ref={size.ref} className="relative" data-pages-size>
      <LabeledControlSection variant="kolbox" label="Pages" end={<span className="flex items-center gap-1">{action('search', 'Find', openFind)}{action('plus', 'Add page', onAddPage)}</span>}>
        <div ref={listRef} className="flex flex-col gap-2">
          {pages.map((p) => {
            const pos = drag?.over?.id === p.id ? drag.over.pos : null
            return (
              <div key={p.id} data-page-row={p.id} onPointerDown={(e) => down(e, p.id)}
                onClickCapture={(e) => { if (swallow.current) { swallow.current = false; e.stopPropagation(); e.preventDefault() } }}
                className={`relative rounded-control ${drag?.id === p.id ? 'opacity-40' : ''}
                  ${pos === 'above' ? 'before:absolute before:inset-x-1 before:-top-px before:z-10 before:h-0.5 before:bg-accent' : ''}
                  ${pos === 'below' ? 'after:absolute after:inset-x-1 after:-bottom-px after:z-10 after:h-0.5 after:bg-accent' : ''}`}>
                <TreeRow variant="kolbox" label={p.label} active={p.selected} onClick={p.onClick} onContextMenu={p.onContextMenu} data-page-id={p.id} />
              </div>
            )
          })}
        </div>
      </LabeledControlSection>
      {size.handle}
    </div>
  )
}

/* THE COLLAPSED RAIL'S PILL (plan-2026-11-19 C4.3): over the canvas at its top left, on the one floating surface: the
   mark (the accent tile at the control height, 24), the file name, and the same panel icon the rail's
   header carries, which brings the rail back. The undocked state's left pill (W2.1): there RailSwitcher is gone, so the
   mark opens the main menu (onMark, markRef); `children` are the floating pieces stacked under it (W2.2). */
export function RailPill({ name, onExpand, onMark, markRef, children }) {
  /* ⌘F with the rail collapsed opens it on find (W12) */
  useFindKey()
  const mark = <span className="inline-flex size-(--kol-kolbox-ctl) shrink-0 items-center justify-center rounded-track bg-accent text-on-accent"><Icon name="wave" size={16} /></span>
  return (
    <div className="pointer-events-none absolute top-3 bottom-3 left-3 z-10 flex flex-col items-start gap-2 *:pointer-events-auto" data-rail-pill-stack>
    <div className="kol-kolbox-surface flex h-8 max-w-60 shrink-0 items-center gap-2 rounded-[var(--kol-radius-12)] bg-panel pr-2 pl-1" data-rail-pill>
      {onMark ? <button ref={markRef} type="button" aria-label="Main menu" aria-haspopup="menu" onClick={onMark} data-mark className="flex rounded-track outline-none hover:brightness-110 focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">{mark}</button> : <span className="flex" data-mark>{mark}</span>}
      <span className="min-w-0 truncate text-row text-text">{name}</span>
      <Button variant="kolbox" iconOnly="panel-left" aria-label="Expand" onClick={onExpand} className="size-4! shrink-0 text-text!"/>
    </div>
    {children}
    </div>
  )
}

function LabsPicker({ rows = [], onPick }) {
  /* a category opens its list in place; the list holding the open lab is open */
  const [expanded, setExpanded] = useState(() => new Set())
  const activeSection = rows.find((r) => r.sub?.some((s) => s.active))?.key
  useEffect(() => { if (activeSection) setExpanded((cur) => new Set(cur).add(activeSection)) }, [activeSection])
  const toggle = (key) => setExpanded((cur) => { const n = new Set(cur); if (n.has(key)) n.delete(key); else n.add(key); return n })

  return (
    <Rail variant="kolbox" side="left" aria-label="Labs">
      <nav className="flex flex-col gap-2 p-2" data-lab-picker>
        {rows.map((r) => {
          const open = r.sub ? expanded.has(r.key) : undefined
          return (
            <div key={r.key} className="flex flex-col gap-2">
              <TreeRow variant="kolbox" tree icon={r.icon} label={r.label} expanded={open} active={!r.sub && !!r.active} onClick={() => (r.sub ? toggle(r.key) : onPick?.(r))} />
              {open && r.sub.map((s) => <TreeRow variant="kolbox" key={s.key} tree depth={1} icon={s.icon} label={s.label} active={!!s.active} onClick={() => onPick?.(s)} />)}
            </div>
          )
        })}
      </nav>
    </Rail>
  )
}
