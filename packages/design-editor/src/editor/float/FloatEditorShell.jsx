import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, LabeledControlSection, Menu, MenuTrigger, SettingsRow, SettingsSwitch, Tooltip, useMediaQuery } from '@kolkrabbi/kol-component'
import { AppFloatNav, Breadcrumb, DocumentCapsule, GlobalActions, MenuBar, ToolRail } from '@kolkrabbi/kol-shell'
import { Card } from '@kolkrabbi/kol-dashboards'
import '../styles/kol-editor.css'
import { panelsForSlot } from '../state/panels'
import { seedWorkspace } from '../state/workspace'
import { useTool } from '../state/tools'
import { useComposeState } from '../compose/state'
import { findLayerDeep } from '../compose/helpers'
import { useComposeFile } from '../compose/useComposeFile'
import { markSaved, docOf, isDirty, useSavedMark } from '../compose/savedMark'
import { TextSurface } from '../compose/inspectors/TextPanel'
import { useTransport, transport } from '../params/transport'
import { useLabelColumns } from '../params/controlSize'
import { DisplaySettingsDrawer } from '../../settings/AppSettings'
import ShortcutsOverlay from '../shell/ShortcutsOverlay'
import { goMode, navigateTo } from '../mode'
import { pack } from '../packs'
import { ChromeContext } from './chrome'
import { useFloatMenus, toMoreRows } from './useFloatMenus'
import FloatTextToolbar from './FloatTextToolbar'
import FloatCommandSearch from './FloatCommandSearch'
import { useToolUi, setUi } from '../generate/store'

/**
 * FloatEditorShell — the editor in the float chrome (plan-2026-11-05-float-editor W2.1), beside `EditorShell`, which it
 * leaves as is. The SAME state — compose, tools, the panels registry and its tabs, the workspace store seeded from them —
 * under his Section 5 (20:12208): the app's menu bar inside the browser (kol-shell `MenuBar`, its rows `useFloatMenus`),
 * then the canvas edge to edge with the chrome floating over it — the document capsule and its breadcrumb top-left, the
 * transport top-centre, undo · redo · Export · account top-right, the tool rail and its ⋮ left, the cards stacked right
 * (scrolling when taller than the canvas), the mode switch bottom-left, the timeline along the bottom when it is up.
 *
 * THE CARDS (W2.3): every registry tab sits in a float card (dashboards `Card variant="float"`), grouped per his frames —
 * `registry.cards` is `[{ id, tabs: [tabId], labels?, Panel?, title?, folded?, when? }]`; a tab's `when` and `Footer`
 * come from the registry, a card with `Panel` renders it whole (the rail footer). Every opener the rails answered
 * (`kol:open-tab`, `-color-pane`, `-params`, `-effects`, `-pattern`, `-batch-export`) unfolds the card holding that tab
 * and lights it. A text layer selected shows the Typography card open — the text surface, which the float inspector
 * leaves out (`useChrome`).
 *
 * Phone (< 768, his frame 06): the menu bar becomes his menu capsule (File · Edit · View · More — More holds Layer, Text,
 * Vector and Tools as levels; MenuBar `variant="capsule"`), the app menu and Help go to the ⋮ top-right (his Workspace
 * overflow); the tools a row under the canvas, the cards a column under it, the mode pill at the foot.
 *
 * THE DOCK AND ⌘K (7.7, his float-more 30:914): the tools sit in the left Rail or in a bottom dock (View › Tools; the dock
 * is the phone's default) — the horizontal ToolRail with each family's ▾, hand, undo and the ⌘K pill. ⌘K (or the pill)
 * opens FloatCommandSearch: anchored on the dock while it is up, the centred search modal otherwise, the same rows.
 *
 * A card may HOLD tabs it does not show (`holds: { tab: shownTab }` — their openers light the tab holding them), YIELD to
 * another (`yields: id` — it steps out while that one is open) and LEAD (`lead` — open, it heads the stack).
 *
 * @param {Object} registry  `{ canvas, tabs, panes, cards, tools, moreTools, useTabContext, panels }`
 */

const pad = (n) => String(Math.floor(n)).padStart(2, '0')
/* mm:ss:ff at 30 fps — his "00:01:12 / 00:04:00" */
const timecode = (sec) => `${pad(sec / 60)}:${pad(sec % 60)}:${pad((sec % 1) * 30)}`

export const MODES = [
  { path: '/editor', icon: 'desktop', label: 'Editor' },
  { path: '/labs', icon: 'globe', label: 'Labs' },
  { path: '/randomiser', icon: 'refresh', label: 'Randomiser' },
  { path: '/morph', icon: 'swap', label: 'Morph' },
]
export const MODES_MORE = [
  { path: '/library', icon: 'nav-library', label: 'Library' },
  { path: '/settings', icon: 'nav-settings', label: 'Settings' },
]
export const goPath = (p) => (p === '/labs' ? goMode('labs') : p === '/randomiser' ? goMode('randomiser') : p === '/editor' ? null : navigateTo(p))

/* the transport, on the clock — its own component, so the clock's ticks re-render it alone */
export function Transport({ className }) {
  const { playing, t, loopSeconds } = useTransport()
  const looping = !!transport.clock.state.looping
  const items = [
    { id: 'play', icon: 'play', label: 'Play', selected: playing, onPress: transport.play },
    { id: 'pause', icon: 'pause', label: 'Pause', selected: !playing, onPress: transport.pause },
    { id: 'loop', icon: 'repeat', label: looping ? 'Loop off' : 'Loop on', selected: looping, onPress: () => transport.clock.set({ looping: !looping }) },
    { id: 'stop', icon: 'square', label: 'Stop', onPress: transport.stop },
    { id: 'back', icon: 'skip-back', label: 'Back to start', onPress: transport.rewind },
  ]
  return <AppFloatNav variant="transport" inline items={items} timecode={{ current: timecode(t * loopSeconds), total: timecode(loopSeconds) }} className={className} />
}

/* the settings drawer, answering `kol:open-settings` (EditorShell's host, which this shell may not import from — the
 * classic shell stays as is; the same eleven lines) */
function SettingsDrawerHost() {
  const [open, setOpen] = useState(false)
  const { showGrid, toggleGrid } = useComposeState()
  useEffect(() => {
    const onOpen = (e) => { e.preventDefault?.(); setOpen((v) => !v) }
    window.addEventListener('kol:open-settings', onOpen)
    return () => window.removeEventListener('kol:open-settings', onOpen)
  }, [])
  return (
    <DisplaySettingsDrawer open={open} onClose={() => setOpen(false)}>
      <LabeledControlSection label="Canvas" divided>
        <SettingsRow label="Show grid"><SettingsSwitch label="Show grid" on={showGrid} onChange={toggleGrid} /></SettingsRow>
      </LabeledControlSection>
    </DisplaySettingsDrawer>
  )
}

/* the saved mark (DocTitle's rule): a fresh or opened document is the saved state; an edit since reads Unsaved */
function useDocStatus() {
  const state = useComposeState()
  const doc = docOf(state)
  const saved = useSavedMark()
  const docRef = useRef(doc); docRef.current = doc
  useEffect(() => {
    const id = requestAnimationFrame(() => markSaved(docRef.current))
    return () => cancelAnimationFrame(id)
  }, [state.currentPresetId])
  return isDirty(doc, saved) ? { status: 'Unsaved' } : { status: 'Saved', statusIcon: 'check' }
}

/* the opener events → the card holding the tab (and, for the rail footer's own tabs, the card holding that Panel) */
function useCardOpeners(cards, open) {
  useEffect(() => {
    const on = (tab) => () => open(tab)
    const byDetail = (fallback) => (e) => open(e.detail?.tab ?? fallback)
    const pairs = [
      ['kol:open-tab', byDetail()],
      ['kol:open-color-pane', byDetail('Colour')],
      ['kol:open-params', on('Parameters')],
      ['kol:open-effects', on('Effects')],
      ['kol:open-pattern', on('Pattern')],
      ['kol:open-batch-export', on('Output')],
    ]
    pairs.forEach(([ev, fn]) => window.addEventListener(ev, fn))
    return () => pairs.forEach(([ev, fn]) => window.removeEventListener(ev, fn))
  }, [cards, open])
}

export default function FloatEditorShell({ registry }) {
  useLabelColumns()
  seedWorkspace(registry?.panes ?? [], registry?.tabs ?? [])
  const phone = useMediaQuery('(max-width: 767px)')
  const state = useComposeState()
  const { layers, selectedId, currentPresetName, undo, redo, canUndo, canRedo, showRulers, toggleRulers } = state
  /* his design draws no rulers: the float chrome starts with them off (View › Show / hide rulers brings them back) */
  const rulersOff = useRef(false)
  useEffect(() => {
    if (rulersOff.current) return /* once — StrictMode runs a mount's effects twice, and a toggle twice is no toggle */
    rulersOff.current = true
    if (showRulers) toggleRulers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const { tool, setTool } = useTool()
  const { onExportPng } = useComposeFile()
  const docStatus = useDocStatus()
  const ctx = (registry?.useTabContext ?? (() => ({})))()
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  const textLayer = layer?.type === 'text' ? layer : null
  const Canvas = registry?.canvas ?? null
  const overlays = panelsForSlot(registry?.panels, 'canvas.overlay')

  /* the cards: the registry's tabs, grouped; a tab whose `when` fails is left out, a card with none left is too */
  const tabsById = useMemo(() => new Map((registry?.tabs ?? []).map((t) => [t.tab, t])), [registry])
  const cards = registry?.cards ?? []
  const [folded, setFolded] = useState(() => Object.fromEntries(cards.map((c) => [c.id, !!c.folded])))
  const [lit, setLit] = useState({})
  const pending = useRef(null)
  const open = useCallback((tab) => {
    /* a tab a card HOLDS (the inspector's Design holds Inspector · Parameters · Pattern) lights the tab holding it */
    const card = cards.find((c) => c.tabs?.includes(tab) || c.answers?.includes(tab) || c.holds?.[tab])
    if (!card) return
    const shown = card.holds?.[tab] ?? tab
    if (card.tabs?.includes(shown)) setLit((m) => ({ ...m, [card.id]: shown }))
    setFolded((f) => {
      /* a folded Panel card mounts on the unfold — its own opener missed the event, so it is sent again once it is up */
      if (f[card.id] && card.Panel) pending.current = tab
      return f[card.id] ? { ...f, [card.id]: false } : f
    })
  }, [cards])
  useCardOpeners(cards, open)
  useEffect(() => {
    if (!pending.current) return
    const tab = pending.current
    pending.current = null
    const id = requestAnimationFrame(() => window.dispatchEvent(new CustomEvent(tab === 'Output' ? 'kol:open-batch-export' : 'kol:open-tab', { detail: { tab } })))
    return () => cancelAnimationFrame(id)
  }, [folded])
  /* selecting a layer brings its card up — the text surface for text, the inspector for the rest (the rails' auto-flip) */
  useEffect(() => {
    if (!selectedId || selectedId === 'canvas') return
    const isText = findLayerDeep(layers, selectedId)?.type === 'text'
    const card = cards.find((c) => (isText ? c.id === 'type' : c.tabs?.includes('Inspector') || c.holds?.Inspector))
    if (card) setFolded((f) => (f[card.id] ? { ...f, [card.id]: false } : f))
    if (!isText) open('Inspector')
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  /* `\` shows / hides the chrome over the canvas (MenuTop's Show / hide rail — the float chrome is the rail here) */
  const [chromeHidden, setChromeHidden] = useState(false)
  const toggleRail = useCallback(() => setChromeHidden((h) => !h), [])
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '\\' || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target
      if (t?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t?.tagName)) return
      setChromeHidden((h) => !h)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* the tools' place: the Rail (desk default) or the dock (the phone's); View › Tools picks */
  const [placeChoice, setPlaceChoice] = useState(null)
  const place = placeChoice ?? (phone ? 'dock' : 'rail')
  const [searchOpen, setSearchOpen] = useState(false)
  const dockRef = useRef(null)
  const { app, menus, end } = useFloatMenus({ cards: { open }, toggleRail, tools: { place, setPlace: setPlaceChoice } })
  /* a generator tool's Rail (Tools › Generate · Repeat · Paratype letter, W7.6) takes the right-hand column while it is open */
  const { rail: openRail } = useToolUi()
  const GeneratorRail = pack('generators')?.GeneratorRail
  const toolRail = GeneratorRail ? openRail : null

  /* the timeline's height, so the cards and the mode switch stand above it */
  const tlRef = useRef(null)
  const [tlH, setTlH] = useState(0)
  useEffect(() => {
    const el = tlRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(() => setTlH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const Timeline = pack('motion')?.TimelineDock

  const tools = registry?.tools ?? []
  const pickTool = (id) => {
    const t = tools.find((x) => x.id === id)
    if (t?.onPick) t.onPick(state)
    else setTool(id)
  }
  const more = (registry?.moreTools ?? []).map((m) => ({ ...m, onClick: m.onPick ? () => m.onPick(state) : () => setTool(m.id) }))
  /* the dock: a member with `onPick` runs it on the state; the rest arm their tool */
  const withPick = (m) => (m.onPick ? { ...m, onClick: () => m.onPick(state) } : m)
  /* the phone's dock: his row's first five and the search glyph (Pattern, sixth, is a 48 slot too many at 390 — ⌘K's Tools has it) */
  const dockTools = (phone ? (registry?.phoneTools ?? tools).slice(0, 5) : (registry?.dockTools ?? tools)).map((t) => ({ ...withPick(t), more: t.more?.map(withPick) }))
  const dockEnd = phone ? null : (
    <>
      <Tooltip variant="float" placement="top" offset={12} label="Hand" shortcut="H">
        <Button variant="float" tone="ghost" iconOnly="hand" aria-label="Hand" pressed={tool === 'hand'} onClick={() => setTool('hand')} className="[--kol-tone-fg:var(--kol-oq-96)]" />
      </Tooltip>
      <Tooltip variant="float" placement="top" offset={12} label="Undo" shortcut="⌘Z">
        <Button variant="float" tone="ghost" iconOnly="undo" aria-label="Undo" disabled={!canUndo} onClick={() => canUndo && undo()} className="[--kol-tone-fg:var(--kol-oq-96)]" />
      </Tooltip>
    </>
  )
  const dock = (
    <ToolRail orientation="horizontal" tools={dockTools} value={tool} onChange={pickTool} end={dockEnd}
      search={{ onPress: () => setSearchOpen((o) => !o), pressed: searchOpen, kbd: phone ? null : '⌘K' }}
      className="kol-tool-dock rounded-[var(--kol-float-menu-r)] p-3 max-md:w-full max-md:justify-between max-md:p-2" />
  )
  /* ⌘K's rows: every tool the editor arms (the Rail's, its ⋮, the dock's families), once each by label */
  const searchTools = (() => {
    const seen = new Set()
    return [...tools, ...more, ...dockTools.flatMap((t) => [t, ...(t.more ?? [])])].filter((t) => t.label && !seen.has(t.label) && seen.add(t.label))
      .map((t) => ({ id: t.id ?? t.label, label: t.label, icon: t.icon, kbd: t.kbd, run: t.onClick ?? (() => pickTool(t.id)) }))
  })()
  const searchPages = [
    { id: 'doc', label: currentPresetName || 'Untitled', icon: 'file', hint: 'Editor', run: () => {} },
    ...[...MODES, ...MODES_MORE].filter((m) => m.path !== '/editor').map((m) => ({ id: m.path, label: m.label, icon: m.icon, hint: 'Page', run: () => goPath(m.path) })),
  ]
  const name = currentPresetName || 'Untitled'

  const renderCard = (c) => {
    if (c.when && !c.when({ layer: textLayer ?? layer, ...ctx })) return null
    /* a card that yields to another steps out while that one is open (Transform and Appearance to the inspector) */
    if (c.yields && folded[c.yields] === false) return null
    const isFolded = !!folded[c.id]
    const fold = () => setFolded((f) => ({ ...f, [c.id]: !f[c.id] }))
    if (c.Panel) {
      const Panel = c.Panel
      return <Card key={c.id} variant="float" radius="window" tabs={[{ key: c.id, label: c.title }]} folded={isFolded} onFold={fold}>{() => <Panel key={(textLayer ?? layer)?.id} layer={textLayer ?? layer} bare />}</Card>
    }
    const tabs = c.tabs.map((id) => tabsById.get(id)).filter((t) => t && (!t.when || t.when(ctx)))
    if (!tabs.length) return null
    const current = tabs.some((t) => t.tab === lit[c.id]) ? lit[c.id] : tabs[0].tab
    const def = tabsById.get(current)
    const Footer = def?.Footer
    return (
      <Card key={c.id} variant="float" radius="window" folded={isFolded} onFold={fold}
        tabs={tabs.map((t) => ({ key: t.tab, label: c.labels?.[t.tab] ?? t.label }))} tab={current} onTab={(k) => setLit((m) => ({ ...m, [c.id]: k }))}
        foot={Footer ? <Footer /> : undefined}>
        {() => { const Body = def.Component; return <Body /> }}
      </Card>
    )
  }
  /* an open `lead` card heads the stack (the inspector, frame 04); the rest keep Section 5's order */
  const leads = (c) => c.lead && folded[c.id] === false
  const stack = [...cards.filter(leads), ...cards.filter((c) => !leads(c))].map(renderCard)

  const capsule = (
    <DocumentCapsule name={name} {...docStatus} onBack={() => navigateTo('/')}
      menuItems={toMoreRows(menus[0].items)} />
  )
  const crumbs = <Breadcrumb items={['FXR', 'Editor', name]} />
  /* the phone's menus (frame 06): the capsule's four, the ⋮'s app rows and Help */
  const byLabel = (l) => menus.find((m) => m.label === l)
  const phoneMenus = [byLabel('File'), byLabel('Edit'), byLabel('View'),
    { label: 'More', items: menus.filter((m) => !['File', 'Edit', 'View'].includes(m.label)).map((m) => ({ label: m.label, items: m.items })) }].filter(Boolean)
  const overflow = (
    <Menu variant="float" align="end" minWidth={220} items={[...(app.items ?? []), { divider: true }, ...end.flatMap((m) => m.items)]}
      trigger={({ open: isOpen, props }) => <MenuTrigger variant="float" iconOnly open={isOpen} aria-label="More" {...props} />} />
  )
  const actions = <GlobalActions onUndo={() => canUndo && undo()} onRedo={() => canRedo && redo()} onAction={onExportPng} onAccount={() => navigateTo('/settings')} />
  /* the phone draws the pill glyphs-only, its names a line above (his frame 06) */
  const modeSwitch = <AppFloatNav variant="mobile" shape="pill" labels={!phone} items={MODES} sheetItems={MODES_MORE} currentPath="/editor" onNavigate={goPath} />

  return (
    <ChromeContext.Provider value="float">
      <div className="kol-float-editor kol-editor-shell flex flex-col h-full w-full overflow-hidden bg-surface-primary" data-editor-keep-selection data-phone={phone ? 'true' : undefined}>
        {!phone && <MenuBar app={app} menus={menus} end={end} />}
        <div className="relative flex-1 min-h-0">
          <main className="kol-editor-canvas absolute inset-0">
            {Canvas ? <Canvas /> : null}
            {overlays.map(({ Component }, i) => <Component key={i} />)}
          </main>

          {!chromeHidden && !phone && (
            <>
              <div className="absolute left-6 top-6 flex flex-col items-start gap-10">{capsule}{crumbs}</div>
              <Transport className="absolute! left-1/2 -translate-x-1/2 top-6" />
              {actions && <div className="absolute right-6 top-9">{actions}</div>}
              {place === 'rail' && <ToolRail tools={tools} value={tool} onChange={pickTool} more={more} className="absolute left-6 top-[296px]" />}
              {place === 'dock' && <div ref={dockRef} className="absolute left-1/2 -translate-x-1/2" style={{ bottom: tlH ? tlH + 12 : 24 }}>{dock}</div>}
              {textLayer && <FloatTextToolbar layer={textLayer} className="absolute left-1/2 -translate-x-1/2 top-[242px]" />}
              <div className={`absolute right-6 top-[108px] ${toolRail ? 'w-96' : 'w-80'} flex flex-col gap-4 overflow-y-auto overscroll-contain rounded-[var(--kol-float-window-r)] scrollbar-none`}
                style={{ bottom: tlH ? tlH + 12 : 24 }}>
                {toolRail ? <GeneratorRail key={toolRail} id={toolRail} onClose={() => setUi({ rail: null })} className="shrink-0" /> : stack}
              </div>
              {/* the mode pill is fixed to the viewport (a phone's); a transformed box is its containing block */}
              <div className={`absolute ${place === 'dock' ? 'left-6' : 'left-[141px]'} w-[418px] h-[66px] [transform:translateZ(0)] [&_.kol-mobile-tabbar]:!flex`} style={{ bottom: tlH ? tlH + 12 : 35 }}>
                {modeSwitch}
              </div>
            </>
          )}

          {!chromeHidden && phone && (
            <div className="absolute inset-0 pointer-events-none [&>*]:pointer-events-auto">
              <div className="absolute left-4 top-5">{capsule}</div>
              <div className="absolute right-4 top-[26px]">{overflow}</div>
              <MenuBar variant="capsule" menus={phoneMenus} className="absolute left-4 right-4 top-[130px]" />
              <div className="absolute left-4 top-[80px]">{crumbs}</div>
              <div className="absolute right-4 top-[82px] [&_.kol-global-actions]:gap-2">{actions}</div>
              {place === 'rail' && <ToolRail orientation="horizontal" tools={registry?.phoneTools ?? tools} value={tool} onChange={pickTool} className="absolute left-4 right-4 top-[304px] justify-between px-5 py-5 rounded-[var(--kol-float-window-r)]" />}
              {place === 'dock' && <div ref={dockRef} className="absolute left-4 right-4 bottom-[136px]">{dock}</div>}
              <div className={`absolute left-9 right-9 ${place === 'dock' ? 'top-[304px]' : 'top-[412px]'} flex flex-col gap-4 overflow-y-auto overscroll-contain scrollbar-none`} style={{ bottom: place === 'dock' ? 216 : 136 }}>
                {stack}
              </div>
              <span className="absolute left-0 right-0 bottom-[94px] text-center kol-float-timecode text-emphasis pointer-events-none">Editor / Labs / Randomiser / Morph</span>
              {modeSwitch}
            </div>
          )}

          {/* the timeline floats along the bottom while it is up (frame 05; the shipped TimelineRail) */}
          {Timeline && !phone && (
            <div ref={tlRef} className="absolute left-[52px] right-[52px] bottom-3 [&_.kol-timeline-dock]:p-3">
              <Timeline />
            </div>
          )}
        </div>
        <FloatCommandSearch open={searchOpen} onOpenChange={setSearchOpen} menus={[app, ...menus, ...end]} tools={searchTools} pages={searchPages}
          anchor={place === 'dock' && !chromeHidden ? dockRef : undefined} />
        <ShortcutsOverlay />
        <SettingsDrawerHost />
      </div>
    </ChromeContext.Provider>
  )
}
