import { useCallback, useEffect, useRef, useState } from 'react'
import { PageShell, ShortcutsOverlay } from '@kolkrabbi/kol-shell'
import { ActionButton, Button, FullscreenOverlay, ViewToggle } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import SlideThumb from './SlideThumb.jsx'
import SlideStage from './SlideStage.jsx'
import SlideInspector from './SlideInspector.jsx'
import DeckSettings from './DeckSettings.jsx'
import DeckFile from './DeckFile.jsx'
import useDeckHistory from './useDeckHistory.js'
import { BLANK_LAYOUT, GREYS, ABSOLUTE_BLACK, clone, newId } from './slideDoc.js'
import { duplicateLayers, pasteLayers, applyDeckSettings, duplicateSlide } from './layerOps.js'

/* taxonomy-ok: organism — SlideStage + SlideInspector + the filmstrip + DeckFile / DeckSettings / the layout picker / present mode */

/**
 * DeckEditor — one deck, open (kol-olina's brand `/slide-deck/:slug/edit`, ported without the router).
 *
 * The stage on top, the inspector a floating card beside it, the filmstrip a rail on the floor. Click
 * a thumb to bring a slide up, drag to reorder, the trailing tile opens the layout picker. Present
 * plays the deck from the current slide (← → Esc); `S` opens the sheet, `G` the layout grid.
 *
 * ONE UNDOABLE VALUE — `{ slides, active, selectedIds }` — so an undo restores what was selected too
 * (useDeckHistory). A drag is one entry.
 *
 * TWO TIERS (olina's): every change autosaves to BROWSER memory (`kol-deck-draft:<slug>`), Save writes
 * the database (`onSave`). A draft is restored only if it is newer than the saved deck.
 *
 * @param {Object}   deck      `{ slug, name, slides, updated_at }`
 * @param {Array}    layouts   `[{ slug, name, doc }]` — what Add slide offers; Blank is always there
 * @param {Function} onSave    (slides) => Promise
 * @param {Function} onClose   back to the decks
 * @param {Object}   mediaClient  the DS picker's client, for image layers
 * @param {Function} onUpload  (file) => Promise<url>, for image layers
 * @param {string}   railLeft  where the fixed filmstrip starts — `0` alone; a site with a sidenav passes
 *                             `var(--kol-sidenav-w)` (olina), so a dragged sidebar carries the rail
 */
const TILE_W = 160
const RAIL_H = Math.round((TILE_W * 9) / 16) + 32
const STAGE_GUTTER = 24

const DRAFT = (slug) => `kol-deck-draft:${slug}`
const readDraft = (slug) => { try { const s = localStorage.getItem(DRAFT(slug)); return s ? JSON.parse(s) : null } catch { return null } }
const writeDraft = (slug, slides) => { try { localStorage.setItem(DRAFT(slug), JSON.stringify({ at: Date.now(), slides })) } catch { /* quota */ } }
const clearDraft = (slug) => { try { localStorage.removeItem(DRAFT(slug)) } catch { /* nothing */ } }

/* the grip glyph turned — kol-icons ships one, vertical */
function Grabber({ orientation = 'vertical', size = 16 }) {
  return <Icon name="drag-handle" size={size} className={orientation === 'horizontal' ? 'rotate-90' : undefined} />
}

/* the inspector's home: a card fixed to the viewport, dragged by its grip; listeners go on at mousedown */
function FloatingPanel({ title, children }) {
  const [pos, setPos] = useState(() => ({ x: Math.max(16, window.innerWidth - 336), y: 120 }))
  const onGrab = (e) => {
    e.preventDefault()
    const start = { x: pos.x, y: pos.y, sx: e.clientX, sy: e.clientY }
    const onMove = (ev) => setPos({ x: start.x + ev.clientX - start.sx, y: start.y + ev.clientY - start.sy })
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }
  const grab = {
    grabber: <span className="absolute left-1/2 -translate-x-1/2 pointer-events-none text-fg-32"><Grabber orientation="horizontal" /></span>,
    handleProps: { onMouseDown: onGrab, role: 'button', 'aria-label': `Move ${title}`, className: 'relative cursor-grab active:cursor-grabbing select-none' },
  }
  return (
    <div className="kol-tone-secondary fixed w-80 max-h-[80vh] flex flex-col bg-surface-primary border border-oq-04 rounded-[var(--kol-radius-sm)]"
      style={{ left: pos.x, top: pos.y, zIndex: 'var(--kol-z-sticky, 20)' }}>
      <div className="p-3 overflow-y-auto">{children(grab)}</div>
    </div>
  )
}

export default function DeckEditor({ deck, layouts = [], onSave, onClose, mediaClient, onUpload, railLeft = 0 }) {
  const slug = deck.slug
  const savedAt = deck.updated_at ? Date.parse(deck.updated_at) : 0
  const [restored] = useState(() => { const d = readDraft(slug); return d && d.at > savedAt ? d.slides : null })
  const history = useDeckHistory(() => ({ slides: restored ?? deck.slides ?? [], active: 0, selectedIds: [] }))
  const { slides, active, selectedIds } = history.value
  const selectedId = selectedIds[selectedIds.length - 1] ?? null
  const setSelectedId = (id) => history.set((v) => ({ ...v, selectedIds: id ? [id] : [] }))
  const toggleSelected = (id) => history.set((v) => ({
    ...v, selectedIds: v.selectedIds.includes(id) ? v.selectedIds.filter((x) => x !== id) : [...v.selectedIds, id],
  }))
  const [locked, setLocked] = useState(false)
  const [shortcuts, setShortcuts] = useState(false)
  const [picker, setPicker] = useState(false)
  const [present, setPresent] = useState(null)
  const [dragI, setDragI] = useState(null)
  const clipboard = useRef([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [fileOpen, setFileOpen] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [base, setBase] = useState(deck.slides ?? [])
  const [status, setStatus] = useState(restored ? 'Draft restored — not saved' : '')
  const dirty = slides !== base

  const importSlides = (next) => history.set((v) => ({ ...v, slides: next, active: 0, selectedIds: [] }))
  const applySettings = (next) => history.set((v) => ({ ...v, slides: applyDeckSettings(v.slides, next) }))
  const duplicateSlideAt = (i) => history.set((v) => ({ ...v, slides: duplicateSlide(v.slides, i), active: i + 1, selectedIds: [] }))
  const duplicateSelection = useCallback(() => history.set((v) => {
    const slide = v.slides[v.active]
    if (!slide || !v.selectedIds.length) return v
    const [doc, ids] = duplicateLayers(slide.doc, v.selectedIds)
    return { ...v, slides: v.slides.map((s, i) => (i === v.active ? { ...s, doc } : s)), selectedIds: ids }
  }), [history])
  const copySelection = useCallback(() => {
    const s = slides[active]
    if (!s) return
    clipboard.current = s.doc.layers.filter((l) => selectedIds.includes(l.id)).map((l) => ({ ...l }))
  }, [slides, active, selectedIds])
  const pasteClipboard = useCallback(() => history.set((v) => {
    const slide = v.slides[v.active]
    if (!slide || !clipboard.current.length) return v
    const [doc, ids] = pasteLayers(slide.doc, clipboard.current)
    return { ...v, slides: v.slides.map((s, i) => (i === v.active ? { ...s, doc } : s)), selectedIds: ids }
  }), [history])

  /* the stage's width cap: everything above it (measured — three things this file does not own) plus
     the rail and a gutter, so the slide never sits behind the filmstrip */
  const stageRef = useRef(null)
  const [stageTop, setStageTop] = useState(0)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return undefined
    const measure = () => setStageTop(el.getBoundingClientRect().top + window.scrollY)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  /* the draft, on every change that differs from the saved deck */
  useEffect(() => {
    if (slides === base) return
    writeDraft(slug, slides)
    setStatus('Edited — not saved')
  }, [slug, slides, base])

  const save = async (toSave = slides) => {
    setStatus('Saving…')
    try {
      await onSave(toSave)
      setBase(toSave)
      clearDraft(slug)
      setStatus('Saved')
    } catch (err) { setStatus(`Not saved: ${err.message || err}`); throw err }
  }
  const saveRef = useRef(save)
  saveRef.current = save

  const slide = slides[active] ?? null
  const setDoc = (doc) => history.set((v) => ({ ...v, slides: v.slides.map((x, i) => (i === v.active ? { ...x, doc } : x)) }))
  const go = (i) => history.set((v) => ({ ...v, active: i, selectedIds: [] }))
  const remove = (i) => history.set((v) => {
    const next = v.slides.filter((_, j) => j !== i)
    const at = v.active >= i && v.active > 0 ? v.active - 1 : Math.min(v.active, next.length - 1)
    return { slides: next, active: Math.max(0, at), selectedIds: [] }
  })
  const addFrom = (layout) => {
    history.set((v) => ({ slides: [...v.slides, { id: newId('slide'), doc: clone(layout.doc) }], active: v.slides.length, selectedIds: [] }))
    setPicker(false)
  }
  const reorder = (from, to) => {
    if (from === to) return
    history.set((v) => {
      const n = [...v.slides]; const [m] = n.splice(from, 1); n.splice(to, 0, m)
      return { slides: n, active: to, selectedIds: [] }
    })
  }

  useEffect(() => {
    const onKey = (e) => {
      if (present != null) {
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); setPresent((p) => Math.min(p + 1, slides.length - 1)) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); setPresent((p) => Math.max(p - 1, 0)) }
        return
      }
      const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (typing) return
        e.preventDefault()
        if (e.shiftKey) history.redo(); else history.undo()
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveRef.current().catch(() => {}); return }
      if ((e.metaKey || e.ctrlKey) && !typing) {
        const k = e.key.toLowerCase()
        if (k === 'd') { e.preventDefault(); duplicateSelection(); return }
        if (k === 'c') { e.preventDefault(); copySelection(); return }
        if (k === 'v') { e.preventDefault(); pasteClipboard(); return }
      }
      if (e.metaKey || e.ctrlKey || e.altKey || typing) return
      if (e.key === 'g' || e.key === 'G') { setShowGrid((v) => !v); return }
      if (e.key === 'p' || e.key === 'P') { setPresent(active); return }
      if (e.key !== 's') return
      setShortcuts((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [present, active, slides.length, history, duplicateSelection, copySelection, pasteClipboard])

  const allLayouts = [...layouts, BLANK_LAYOUT]

  return (
    <PageShell width="capped">
      <div className="pt-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {onClose && <Button size="sm" variant="ghost" iconLeft="chevron-left" onClick={onClose}>Decks</Button>}
          <ViewToggle variant="icon" tone="sunken" viewMode={locked ? 'lock' : 'edit'} onViewChange={(v) => setLocked(v === 'lock')}
            options={[{ value: 'edit', label: 'Edit', icon: 'pen-nib' }, { value: 'lock', label: 'Lock', icon: 'lock' }]} />
          <span className="kol-mono-12 text-fg-48 truncate">{deck.name}{status ? ` · ${status}` : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" iconOnly="settings-01" aria-label="Deck settings" onClick={() => setSettingsOpen(true)} />
          <Button size="sm" variant="ghost" iconLeft="file" onClick={() => setFileOpen(true)}>File</Button>
          <Button size="sm" variant="ghost" iconLeft="play" disabled={!slides.length} onClick={() => setPresent(active)}>Present</Button>
          <Button size="sm" variant="secondary" disabled={!dirty} onClick={() => save().catch(() => {})}>Save</Button>
        </div>
      </div>

      <div ref={stageRef} className="mt-4 mx-auto w-full"
        style={{ maxWidth: `calc((100vh - ${stageTop + RAIL_H + STAGE_GUTTER}px) * 16 / 9)` }}>
        {slide ? (locked
          ? <SlideThumb doc={slide.doc} />
          : <SlideStage doc={slide.doc} onChange={setDoc} selectedId={selectedId} selectedIds={selectedIds} onSelect={setSelectedId}
              onEditStart={history.begin} onEditEnd={history.end} showGrid={showGrid} />)
          : <p className="kol-mono-12 text-fg-48 pt-10 text-center">No slides. Add one from the rail below.</p>}
      </div>
      {slide && !locked && (
        <FloatingPanel title="Inspector">
          {(grab) => <SlideInspector doc={slide.doc} selectedIds={selectedIds} onChange={setDoc} onSelect={setSelectedId} onToggleSelect={toggleSelected}
            onDuplicate={duplicateSelection} mediaClient={mediaClient} onUpload={onUpload} grab={grab} />}
        </FloatingPanel>
      )}

      {/* the filmstrip — a fixed rail on the floor */}
      <div className="fixed bottom-0 right-0 bg-oq-04 border-t border-oq-08"
        style={{ left: railLeft, zIndex: 'var(--kol-z-sticky, 20)' }}>
        <div className="flex items-stretch gap-3 overflow-x-auto px-6 py-4">
          {slides.map((s, i) => (
            <div key={s.id} className={`group relative shrink-0 ${dragI === i ? 'opacity-30' : ''}`} style={{ width: TILE_W }}
              draggable
              onDragStart={() => setDragI(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragI != null) reorder(dragI, i); setDragI(null) }}
              onDragEnd={() => setDragI(null)}
            >
              <button type="button" onClick={() => go(i)} aria-label={`Slide ${i + 1}`} aria-current={i === active}
                className={`block w-full overflow-hidden rounded-[var(--kol-radius-sm)] transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-48 hover:opacity-80'}`}>
                <SlideThumb doc={s.doc} />
              </button>
              {/* absolute ink with an absolute shadow — a slide's ground does not flip with the app theme */}
              <span className="pointer-events-none absolute bottom-1.5 left-2 kol-helper-12 uppercase text-ab-white"
                style={{ textShadow: '0 1px 3px var(--kol-color-absolute-black)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="absolute top-1 right-1 flex opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <ActionButton chrome="inline" size="sm" icon="copy" label="Duplicate slide" onAction={() => duplicateSlideAt(i)} />
                <ActionButton chrome="inline" size="sm" icon="trash" confirmIcon="check" label="Remove" confirmLabel="Removed" onAction={() => remove(i)} />
              </span>
            </div>
          ))}
          <button type="button" onClick={() => setPicker(true)} aria-label="Add slide"
            className="shrink-0 flex items-center justify-center rounded-[var(--kol-radius-sm)] border border-dashed border-fg-16 text-fg-48 hover:text-fg-96 hover:border-fg-48"
            style={{ width: TILE_W, aspectRatio: '16 / 9' }}>
            <span className="kol-helper-12 uppercase">+ Add</span>
          </button>
        </div>
      </div>
      <div style={{ height: RAIL_H }} aria-hidden="true" />

      <DeckFile open={fileOpen} onClose={() => setFileOpen(false)} slug={slug} name={deck.name} slides={slides} active={active}
        onSave={onSave ? (s) => save(s) : undefined} onImport={importSlides} />

      <DeckSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} slides={slides} greys={GREYS} absoluteBlack={ABSOLUTE_BLACK}
        onApply={(next) => { applySettings(next); setSettingsOpen(false) }} />

      <FullscreenOverlay open={picker} onClose={() => setPicker(false)}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 w-[80vw] max-w-[1400px] max-h-[80vh] overflow-y-auto">
          {allLayouts.map((l) => (
            <button key={l.slug} type="button" onClick={() => addFrom(l)} className="text-left group">
              <div className="overflow-hidden rounded-[var(--kol-radius-sm)] opacity-64 group-hover:opacity-100 transition-opacity border border-oq-08"><SlideThumb doc={l.doc} /></div>
              <div className="mt-2 kol-helper-12 uppercase text-fg-48 group-hover:text-fg-96">{l.name}</div>
            </button>
          ))}
        </div>
      </FullscreenOverlay>

      <FullscreenOverlay open={present != null} onClose={() => setPresent(null)}>
        <div className="w-[92vw] max-w-[1800px] pt-[50px] pr-[38px]">
          {present != null && slides[present] && <SlideThumb doc={slides[present].doc} />}
          <div className="mt-3 text-right kol-helper-12 uppercase text-fg-48">{String((present ?? 0) + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</div>
        </div>
      </FullscreenOverlay>

      {shortcuts && (
        <ShortcutsOverlay onClose={() => setShortcuts(false)} shortcuts={DECK_SHORTCUTS} />
      )}
    </PageShell>
  )
}

export const DECK_SHORTCUTS = [
  { section: 'Stage', items: [
    { label: 'Select layer', combo: 'Click' }, { label: 'Move', combo: 'Drag' }, { label: 'Resize', combo: 'Drag handle' },
    { label: 'Nudge', combo: '← ↑ → ↓' }, { label: 'Nudge ×10', combo: '⇧ + arrows' }, { label: 'Delete layer', combo: '⌫' }, { label: 'Deselect', combo: 'Esc' },
  ] },
  { section: 'Deck', items: [
    { label: 'Reorder slide', combo: 'Drag thumb' }, { label: 'Present', combo: 'P' }, { label: 'Next / previous', combo: '→ ←  (presenting)' }, { label: 'Leave presentation', combo: 'Esc' },
  ] },
  { section: 'Page', items: [
    { label: 'Save', combo: '⌘ S' }, { label: 'Undo', combo: '⌘ Z' }, { label: 'Redo', combo: '⌘ ⇧ Z' },
    { label: 'Duplicate', combo: '⌘ D' }, { label: 'Copy', combo: '⌘ C' }, { label: 'Paste', combo: '⌘ V' },
    { label: 'Layout grid', combo: 'G' }, { label: 'Shortcuts', combo: 'S' },
  ] },
]
