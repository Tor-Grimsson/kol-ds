import { useEffect, useRef } from 'react'
import { fixtureClient } from 'media-fixture'
import {
  CanvasArea, composePanes, getAppSettings, composeTabs, docOf, EditorProviders, FilesDialogHost, findLayerDeep, isDirty, markSaved,
  ModalLayerEffects, seedWorkspace, setActive, setMediaClient, setSettingsStore, ShortcutsOverlay, transport, useComposeState,
  useGlobalShortcuts, useSavedMark, useWorkspace, useZoom, WorkspaceEffects,
} from './engine.js'
import Menus from './Menus.jsx'
import { ActionBar, ToolStrip } from './Tools.jsx'
import { ColorTab, StrokeTab, SwatchesTab } from './ColorTabs.jsx'
import { AssetsTab, HistoryTab, LayerActions, LayersTab, NavigatorTab } from './LayersTabs.jsx'
import Inspector from './Inspector.jsx'
import Parameters from './Parameters.jsx'
import Effects from './Effects.jsx'
import Dock from '../labs/Dock.jsx'
import Segmented from '../ui/Segmented.jsx'

/* The editor as the real one is (apps/editor: DesignEditor), in the minimal style. The regions in the real order: the
   menu bar, the action band, then the tools strip, the left rail (Stroke, Color, Swatches; Layers, Assets, History,
   Navigator; the Transport, Output, File dock), the canvas column (the title line over the engine's own canvas with its
   rulers and frame) and the right rail (Inspector, Parameters, Effects). Which tab sits in which pane is the package's
   workspace record, so Window and every opener move these tabs as they move the real ones. The host's configuration is
   apps/editor's own. */
setMediaClient(fixtureClient)
setSettingsStore({
  load: () => fixtureClient.loadToolSettings('minimal-editor'),
  save: (s) => fixtureClient.saveToolSettings('minimal-editor', s),
})

const TABS = composeTabs()
const BODIES = {
  Stroke: StrokeTab, Colour: ColorTab, Swatches: SwatchesTab,
  Layers: LayersTab, Assets: AssetsTab, History: HistoryTab, Navigator: NavigatorTab,
  Inspector, Parameters, Effects,
  Pattern: () => <p className="p-4 text-label text-faint">The pattern surface is not redrawn in the minimal style.</p>,
}
const FOOTERS = { Layers: LayerActions }
const byId = new Map(TABS.map((t) => [t.tab, t]))

/* one pane: its tabs (those whose `when` holds), the open one's body, its footer */
function Pane({ pane, ctx, grow }) {
  const visible = pane.tabs.map((id) => byId.get(id)).filter((t) => t && (!t.when || t.when(ctx)))
  const active = visible.find((t) => t.tab === pane.active) ?? visible[0]
  if (!active) return null
  const Body = BODIES[active.tab]
  const Footer = FOOTERS[active.tab]
  return (
    <section data-pane={pane.id} className={`flex min-h-0 flex-col border-b border-line ${grow ? 'flex-1' : 'shrink-0'}`}>
      <header className="flex h-10 shrink-0 items-center border-b border-line px-2">
        <Segmented className="w-full" options={visible.map((t) => ({ value: t.tab, label: t.label ?? t.tab }))} value={active.tab} onChange={(t) => setActive(pane.id, t)} />
      </header>
      {/* a 264 rail is narrower than Labs' 380: a row of choices shrinks to it and clips its words rather than spill */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto [&_button.flex-1]:min-w-0 [&_button.flex-1]:truncate [&_div.flex-1]:min-w-0">{Body && <Body />}</div>
      {Footer && <Footer />}
    </section>
  )
}

function Rail({ side, ctx, children, className = '' }) {
  const { ws } = useWorkspace()
  const panes = ws[side] ?? []
  return (
    <aside data-region={`${side}-dock`} className={`flex w-[264px] shrink-0 flex-col bg-panel ${className}`}>
      {panes.map((p, i) => <Pane key={p.id} pane={p} ctx={ctx} grow={i === panes.length - 1} />)}
      {children}
    </aside>
  )
}

/* the document's name, a star while it differs from its last save, and the zoom */
function DocTitle() {
  const state = useComposeState()
  const doc = docOf(state)
  const saved = useSavedMark()
  const ref = useRef(doc); ref.current = doc
  useEffect(() => { const id = requestAnimationFrame(() => markSaved(ref.current)); return () => cancelAnimationFrame(id) }, [state.currentPresetId])
  const zoom = useZoom()
  return (
    <div data-region="title" className="kol-editor-doctitle flex h-5 shrink-0 items-center justify-center bg-panel px-3 text-caps text-muted">
      <span className="truncate">{`${state.currentPresetName || 'Untitled'}${isDirty(doc, saved) ? '*' : ''} @ ${Math.round(zoom * 100)}%`}</span>
    </div>
  )
}

function Screen() {
  useGlobalShortcuts()
  seedWorkspace(composePanes, TABS)
  const { selectedId, layers, setAspect, aspect } = useComposeState()
  const ctx = { layer: selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null }
  /* the editor's boot: autoplay and the default aspect from the app settings; without a default, the provider's square
     frame is matched to its aspect once (Labs does the same) */
  useEffect(() => {
    const s = getAppSettings()
    if (s.autoplay) transport.play()
    setAspect(s.defaultAspect && s.defaultAspect !== 'custom' ? s.defaultAspect : aspect)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex h-full min-w-[1280px] flex-col bg-ground font-sans text-label text-fg" data-editor-keep-selection>
      <header data-region="menu-bar" className="flex h-8 shrink-0 items-center border-b border-line bg-ground px-2"><Menus /></header>
      <div data-region="options-bar" className="flex h-10 shrink-0 items-center border-b border-line bg-panel px-2"><ActionBar /></div>
      <div className="flex min-h-0 flex-1">
        <aside data-region="tools" className="flex w-11 shrink-0 flex-col border-r border-line bg-panel"><ToolStrip /></aside>
        <Rail side="left" ctx={ctx} className="border-r border-line">
          <div data-region="footer-dock"><Dock /></div>
        </Rail>
        <div data-region="canvas-column" className="kol-editor-canvas-column flex min-w-0 flex-1 flex-col">
          <DocTitle />
          {/* the engine's own canvas: its rulers, frame, aspect label and tools, in its dark tokens; `.kol-design-editor`
              is the root class its sheet scopes to */}
          <main data-region="canvas" data-theme="dark" className="kol-editor-canvas kol-design-editor relative min-h-0 flex-1">
            <CanvasArea />
          </main>
        </div>
        <Rail side="right" ctx={ctx} className="border-l border-line" />
      </div>
      <WorkspaceEffects />
      <ModalLayerEffects />
      <FilesDialogHost />
      <ShortcutsOverlay />
    </div>
  )
}

/* persistDraft off: each visit starts from an empty document, as the real one does without a draft */
export default function Editor() {
  return (
    <EditorProviders persistDraft={false}>
      <Screen />
    </EditorProviders>
  )
}
