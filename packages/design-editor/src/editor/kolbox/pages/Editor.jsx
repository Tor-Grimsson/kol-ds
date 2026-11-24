import { TimelineDock, EditorShell, ButtonSplit, Menu } from '@kolkrabbi/kol-component'
import { AppFloatNav } from '@kolkrabbi/kol-shell'
import { useCallback, useEffect, useRef, useState } from 'react'
import { hostClient, hostStore } from '../host.js'
import { sampleMediaClient } from '../app/sampleMedia.js'
import { VariantContext } from '../../variant.js'
import {
  CanvasArea, FilesDialogHost, getAppSettings, isBinding, isTyping, matchCombo, pack, rowLabelForLayer,
  sampleTrack, setMediaClient, setMountedView, setSettingsStore, toggleTimelinePinned, transport, useComposeFile, useComposeState,
  useGeneratorLibrary, useGlobalShortcuts, useTimelinePinned, useTransport, urlIntent,
} from '../editor/engine.js'
import Providers from '../app/Providers.jsx'
import { firstVisit, hasDraft } from '../app/draft.js'
import Properties from '../editor/Properties.jsx'
import LeftRail, { RailPill } from '../ui/LeftRail.jsx'
import { RailPillRight, RailTop, RightRailTop } from '../ui/RightRail.jsx'
import MenuMain from '../ui/MenuMain.jsx'
import Icon from '../ui/Icon.jsx'
import RailResize from '../app/RailResize.jsx'
import { toggleFloat, toggleHidden, toggleMinimize, toggleSwitcher, useChrome, useMainMenu } from '../app/chrome.js'
import { comboLabel, shortcutById } from '../../state/keymap.js'
import ToolDockEditor from '../editor/tools/ToolDockEditor.jsx'
import MenuFile from '../ui/MenuFile.jsx'
import { useFileRows, useMenus, useSaved } from '../editor/MenuBar.jsx'
import Windows, { useWindowEvents, WINDOWS } from '../editor/Windows.jsx'
import { askPrompt } from '../ui/ask.js'
import ModalSearchHost from '../search/ModalSearchHost.jsx'
import { setLayout, toggleLeftRail, useLayout } from '../editor/windows/workspace.js'
import LayersList, { collapseAllLayers } from '../editor/layers/LayersList.jsx'
import LayerMenuHost, { pointAnchor } from '../editor/layers/LayerMenu.jsx'
import { TuneRail, TuneStage } from '../editor/tune/TuneMode.jsx'
import { useTune } from '../editor/tune/store.js'

/* Editor (plan 4.2): the Shell with Editor lit; LeftRail editor (the file header, Pages, the Layers tree), the engine's
   own canvas with the tool dock over it, RightRail editor (../editor/Properties.jsx). State and every write are the
   package's own, through ../editor/engine.js. The timeline is off until Window › Timeline pins it or a layer carries a track. */
/* the host's media, or the sample library when it passed none (W4.2) */
setMediaClient(hostClient() ?? sampleMediaClient)
setSettingsStore(hostStore('kolbox-editor'))

/* the type icon of a Layers row, by the layer's real type (the engine's LayerStack map, then by meaning): a shape by its
   kind, a boolean by its operation, a photo by its source, a generative layer (loop, misc) as sparkles */
const TYPE_ICONS = { frame: 'maximize', background: 'square', pattern: 'ptrn-dot', photo: 'image', text: 'type', group: 'layers', bool: 'boolean-unite', path: 'pen', loop: 'sparkles', misc: 'sparkles', kinetic: 'type' }
const SHAPE_ICONS = { logo: 'shapes', rect: 'rectangle', ellipse: 'circle', triangle: 'triangle', polygon: 'polygon', star: 'star', line: 'line', flatten: 'vector-nodes' }
const iconFor = (l) => {
  if (l.type === 'shape') return SHAPE_ICONS[l.kind ?? 'logo'] ?? 'rectangle'
  if (l.type === 'bool') return l.op ? `boolean-${l.op}` : TYPE_ICONS.bool
  if (l.type === 'photo' && l.srcType === 'video') return 'video'
  return TYPE_ICONS[l.type] ?? 'rectangle'
}

/* W2.2: the right rail's sections that float on their own under the right pill while undocked, each its toggle in
   View › Panels: the layer's (Typography on a text layer) and, with nothing selected, the page's. A piece is the rail
   drawn whole with every other section, its header and its tabs hidden (Properties draws as it does docked), and the
   piece itself hidden when the selection has no such section. Literal classes, one per name, for Tailwind to find. */
const RIGHT_SECTIONS = ['Position', 'Layout', 'Appearance', 'Fill', 'Stroke', 'Effects', 'Typography', 'Export', 'Page', 'Styles']
const ONLY = '[&_[data-rail-header]]:hidden [&_[data-rail-header]+div]:hidden [&_aside]:h-auto [&_aside]:before:hidden'
const SECTION_ONLY = {
  Position: `${ONLY} [&_[data-rail-section]:not([data-rail-section=Position])]:hidden [&:not(:has([data-rail-section=Position]))]:hidden`,
  Layout: `${ONLY} [&_[data-rail-section]:not([data-rail-section=Layout])]:hidden [&:not(:has([data-rail-section=Layout]))]:hidden`,
  Appearance: `${ONLY} [&_[data-rail-section]:not([data-rail-section=Appearance])]:hidden [&:not(:has([data-rail-section=Appearance]))]:hidden`,
  Fill: `${ONLY} [&_[data-rail-section]:not([data-rail-section=Fill])]:hidden [&:not(:has([data-rail-section=Fill]))]:hidden`,
  Stroke: `${ONLY} [&_[data-rail-section]:not([data-rail-section=Stroke])]:hidden [&:not(:has([data-rail-section=Stroke]))]:hidden`,
  Effects: `${ONLY} [&_[data-rail-section]:not([data-rail-section=Effects])]:hidden [&:not(:has([data-rail-section=Effects]))]:hidden`,
  Typography: `${ONLY} [&_[data-rail-section]:not([data-rail-section=Typography])]:hidden [&:not(:has([data-rail-section=Typography]))]:hidden`,
  Export: `${ONLY} [&_[data-rail-section]:not([data-rail-section=Export])]:hidden [&:not(:has([data-rail-section=Export]))]:hidden`,
  Page: `${ONLY} [&_[data-rail-section]:not([data-rail-section=Page])]:hidden [&:not(:has([data-rail-section=Page]))]:hidden`,
  Styles: `${ONLY} [&_[data-rail-section]:not([data-rail-section=Styles])]:hidden [&:not(:has([data-rail-section=Styles]))]:hidden`,
}

/* a few shapes on an empty document, so a layer can be selected (palette references, as the engine's own defaults) */
const SEED_OFF = true
const SEED = [
  ['shape', { kind: 'rect', name: 'Rectangle', x: 140, y: 280, w: 420, h: 420, radius: 24, color: 'palette:primary' }],
  ['shape', { kind: 'ellipse', name: 'Ellipse', x: 520, y: 560, w: 400, h: 400, color: 'palette:secondary' }],
  ['text', { name: 'Title', family: 'inter', x: 140, y: 1040, w: 800, h: 120 }],
]

function useLayerRows() {
  const { layers, selectedIds, select } = useComposeState()
  const rows = (list, depth) => [...list].reverse().flatMap((l) => {
    const kids = (l.type === 'group' || l.type === 'bool') && Array.isArray(l.children) ? l.children : null
    return [
      { id: l.id, label: rowLabelForLayer(l), icon: iconFor(l), depth, open: kids ? true : undefined, selected: selectedIds.includes(l.id), onClick: () => select(l.id) },
      ...(kids ? rows(kids, depth + 1) : []),
    ]
  })
  return rows(layers, 0)
}

/* The timeline (round 3, 4.1: Window › Timeline), the real Timeline's rows on the floating MotionTimeline: a row per
   layer in reading order, its first keyframe track's keys on its lane, its further tracks as rows under it named by
   their parameter; the clock is the engine's transport (as pages/Morph.jsx feeds it). Add keyframe adds a key at the
   head on the selected layer's first track, valued where the track already is, as the real +; with no track on the
   selection it does nothing, as the real one. The panel's own button unpins it. `withTransport`: the transport toolbar
   (Window › Left rail › Transport) stands on the timeline's top edge at the left, where the real footer's Transport tab
   sits, at the foot of the left rail over the timeline. */
const flatLayers = (list, out = []) => { for (const l of list) { out.push(l); if (Array.isArray(l.children)) flatLayers(l.children, out) } return out }
const tracksOf = (l) => Object.keys(l).filter((k) => isBinding(l[k]) && l[k].bind === 'track').map((k) => ({ key: k, keys: l[k].keys }))

function EditorTimeline({ withTransport }) {
  const { layers, selectedIds, updateLayer, select, toggleLayer, toggleLayerLock, currentPresetName } = useComposeState()
  const c = useTransport()
  const pinned = useTimelinePinned()
  const loop = !!transport.clock.state.looping
  const flat = flatLayers(layers)
  /* the real Timeline's rows (params/Timeline.jsx): a layer with its type icon, eye, lock and lit with the selection;
     its first track on its lane, its further tracks under it named by their parameter; a keyed row's clip reads the
     layer and the parameter (the real one writes a middot between them, kolbox a slash) */
  const rows = flat.flatMap((l) => {
    const own = { layerId: l.id, icon: l.icon ?? iconFor(l), visible: l.visible !== false, locked: !!l.locked, selected: selectedIds.includes(l.id) }
    const ts = tracksOf(l)
    if (!ts.length) return [{ id: l.id, name: rowLabelForLayer(l), keyframes: [], ...own }]
    return ts.map((tr, i) => ({
      id: `${l.id}:${tr.key}`, layerId: l.id, key: tr.key, keys: tr.keys,
      name: i ? tr.key : rowLabelForLayer(l),
      clip: `${rowLabelForLayer(l)} / ${tr.key}`,
      keyframes: tr.keys.map((k) => k.t * c.loopSeconds),
      ...(i ? { sub: true, selected: own.selected } : own),
    }))
  })
  /* the real writeKeys: a track's keys, sorted, back on its layer */
  const writeKeys = (r, keys) => updateLayer(r.layerId, { [r.key]: { bind: 'track', keys: [...keys].sort((a, b) => a.t - b.t) } })
  const target = rows.find((r) => r.key && selectedIds.includes(r.layerId))
  const addKey = (secs) => {
    const t = secs / c.loopSeconds
    writeKeys(target, [...target.keys, { t, v: sampleTrack(target.keys, t), easing: 'linear' }])
  }
  /* the real lane's gestures (KeyLane): a press on a lane adds a key there valued where the track already is, a key
     drags in time, alt-click deletes it (one key always stays, an empty track is a broken binding) */
  const laneAdd = (r, secs) => { if (!r.key) return; const t = secs / c.loopSeconds; writeKeys(r, [...r.keys, { t, v: sampleTrack(r.keys, t), easing: 'linear' }]) }
  const keyMove = (r, i, secs) => writeKeys(r, r.keys.map((k, j) => (j === i ? { ...k, t: secs / c.loopSeconds } : k)))
  const keyDelete = (r, i) => { if (r.keys.length > 1) writeKeys(r, r.keys.filter((_, j) => j !== i)) }
  return (
    <div className="relative h-full">
      {withTransport && (
        <div className="absolute bottom-full left-2 mb-2" data-transport>
          <AppFloatNav variant="kolbox" transport
            playing={c.playing}
            time={c.t * c.loopSeconds}
            loop={loop}
            loopLength={Math.round(c.loopSeconds * 100) / 100}
            onPlay={(on) => (on ? c.play() : c.pause())}
            onRewind={c.rewind}
            onStop={c.stop}
            onLoop={(on) => transport.clock.set({ looping: on })}
            onLoopLength={c.setLoopSeconds}
          />
        </div>
      )}
      <TimelineDock variant="kolbox"
        tracks={rows}
        time={c.t * c.loopSeconds}
        duration={c.loopSeconds}
        playing={c.playing}
        loop={loop}
        onSeek={(s) => c.seek(s / c.loopSeconds)}
        onPlay={(on) => (on ? c.play() : c.pause())}
        onLoop={(on) => transport.clock.set({ looping: on })}
        onAddKeyframe={target ? addKey : undefined}
        title={currentPresetName || 'Untitled'}
        count={flat.length}
        onSelect={(r) => select(r.layerId)}
        onToggleVisible={(r) => toggleLayer(r.layerId)}
        onToggleLock={(r) => toggleLayerLock(r.layerId)}
        onLaneAdd={laneAdd}
        onKeyMove={keyMove}
        onKeyDelete={keyDelete}
        onClose={() => pinned && toggleTimelinePinned()}
      />
    </div>
  )
}
const noTimeline = () => false

/* Rulers are on until hidden: kolbox keeps its own choice, so View › Show / hide rulers is remembered across files
   and reloads; the engine's draft's copy gives way to it */
const RULERS_KEY = 'kolbox.editor.rulers'
function useRulersPref() {
  const { showRulers, toggleRulers } = useComposeState()
  const want = useRef(null)
  if (want.current == null) { try { want.current = localStorage.getItem(RULERS_KEY) !== 'off' } catch { want.current = true } }
  const synced = useRef(false)
  useEffect(() => {
    if (!synced.current) { synced.current = true; if (showRulers !== want.current) toggleRulers(); return }
    want.current = showRulers
    try { localStorage.setItem(RULERS_KEY, showRulers ? 'on' : 'off') } catch { /* ignore */ }
  }, [showRulers]) // eslint-disable-line react-hooks/exhaustive-deps
}

/* Rename…, the Files window's own prompt ("Rename file:", Rename: FilesDialog's modal.prompt) on the open file, in the
   one ModalPrompt (round 3, 3.1): the library's rename and the name the editor shows */
function useRename() {
  const { currentPresetId, currentPresetName, setCurrentPresetName } = useComposeState()
  const { renameItem } = useGeneratorLibrary()
  return async () => {
    const n = (await askPrompt({ title: 'Rename file:', value: currentPresetName ?? '', action: 'Rename' }))?.trim()
    if (n && n !== currentPresetName) { renameItem('preset', currentPresetId, n); setCurrentPresetName(n) }
  }
}

function Screen() {
  useGlobalShortcuts()
  const state = useComposeState()
  const { layers, setAspect, aspect, addLayer, select, beginTransaction, commitTransaction, currentPresetName, currentPresetId } = state
  useRulersPref()
  /* the window open over the editor (Batch export, Color Modes, Shortcuts, Settings, Layer Effects: ../editor/Windows.jsx),
     opened by its menu row, its real key or its real event */
  /* the open window lives in the editor's layout store (editor/windows/workspace.js), so a workspace can hold it */
  const layout = useLayout()
  const win = layout.window
  const setWin = useCallback((v) => setLayout((s) => ({ window: typeof v === 'function' ? v(s.window) : v })), [])
  const onWindow = useWindowEvents(setWin)
  /* the timeline's one gate, the real one's (a track exists or Window › Timeline pins it) */
  const timelineUp = (pack('motion')?.useTimelineUp ?? noTimeline)()
  /* Export and Preview at the top rail's right: the File menu's Export PNG and the output window, as the real buttons */
  const { onExportPng, openOutputWindow } = useComposeFile()
  /* the real editor's ten menus: the logo's menu opens nine of them as children and ends on FXR's rows (round 3, 10.1);
     the file name opens the file's own rows */
  const menus = useMenus({ onWindow, windows: WINDOWS })
  /* THE SHELL'S STATES (plan-2026-11-20 W1.3, W2): docked, undocked (two pills over the canvas, the chosen parts floating
     under them) and hidden (the canvas alone), and RailSwitcher shown or not; View's rows as Figma's [35], under its
     Zoom and display rows, with Panels choosing what floats while undocked */
  const chrome = useChrome()
  const keyOf = (id) => comboLabel(shortcutById(id).combo)
  const viewRows = [
    [
      { label: 'Minimize left navigation bar', check: !chrome.switcher, shortcut: keyOf('kolbox-switcher'), run: toggleSwitcher },
      { label: 'Minimize UI', check: chrome.ui === 'undocked', shortcut: keyOf('minimize-ui'), run: toggleMinimize },
      { label: 'Show/Hide UI', check: chrome.ui !== 'hidden', shortcut: keyOf('show-hide-ui'), run: toggleHidden },
    ],
    [{ label: 'Panels', submenu: [[
      { label: 'Pages', check: !!chrome.floats.pages, run: () => toggleFloat('pages') },
      { label: 'Layers', check: !!chrome.floats.layers, run: () => toggleFloat('layers') },
    ], RIGHT_SECTIONS.map((n) => ({ label: n, check: !!chrome.floats[`rs:${n}`], run: () => toggleFloat(`rs:${n}`) }))] }],
  ]
  const shellMenus = menus.map((m) => (m.label === 'View' ? { ...m, groups: [...m.groups, ...viewRows] } : m))
  /* the switcher's mark opens these (the retired top rail's mark menu): the nine menus, then FXR's rows */
  useMainMenu({ menus: shellMenus.filter((m) => m.label !== 'FXR'), app: shellMenus.find((m) => m.label === 'FXR').groups.flat() })
  const pillMark = useRef(null)
  const [pillMenu, setPillMenu] = useState(false)
  const fileRows = useFileRows({ onRename: useRename() })
  /* Saved is a notification (W19.5): the hook raises the save toast; the top rail draws no mark */
  useSaved()

  /* the editor's boot (apps/minimal Editor.jsx): the default aspect, then the seed once on an empty document, and only
     when there is nothing else to show: no file asked for (`?open`, `?new`) and no draft for the restore prompt */
  /* the engine drops the selection on a press outside `[data-editor-keep-selection]`; the real editor marks its whole
     shell, and kolbox's overlays portal to <body>, so the mark sits on <body> while this screen is up */
  /* THE KEYS BOUND IN PARTS KOLBOX DOES NOT MOUNT (round 4, W5): the engine asks `currentView()` which chrome is on
     screen and reads it from the path; kolbox's path is `/`, so it answered none and every view-gated key stood down
     (⌘S, ⇧⌘S in the package's FilesDialogHost; the shortcuts sheet's editor rows). The editor says it is on screen, as
     the real Labs and randomiser chromes do (setMountedView), and stands down when it leaves. */
  useEffect(() => { setMountedView('editor'); return () => setMountedView(null) }, [])
  useEffect(() => {
    document.body.setAttribute('data-editor-keep-selection', '')
    /* an Escape that closes an overlay stops there: the engine's own Escape (on window) would also deselect */
    const onKey = (e) => { if (e.key === 'Escape' && document.querySelector('[data-kolbox-overlay]')) e.stopPropagation() }
    document.addEventListener('keydown', onKey)
    return () => { document.body.removeAttribute('data-editor-keep-selection'); document.removeEventListener('keydown', onKey) }
  }, [])
  /* ⇧\ for Window › Show / hide rail in kolbox (W1.3: `\` is RailSwitcher's here, app/chrome.js useSwitcherKey), as
     Home's own rail key; on the key's place, which Shift rewrites */
  useEffect(() => {
    const onKey = (e) => { if (!isTyping(e) && e.code === 'Backslash' && e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); toggleLeftRail() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const seeded = useRef(false)
  useEffect(() => {
    const s = getAppSettings()
    setAspect(s.defaultAspect && s.defaultAspect !== 'custom' ? s.defaultAspect : aspect)
    /* firstVisit() last: it marks the visit, so it is asked only when the seed would otherwise apply */
    /* a new file is an empty page (C1, his ruling 2026-11-19: "frame is not automatically there when you open page"):
       the first-visit seed of three shapes is off (decided for review) */
    if (SEED_OFF || seeded.current || layers.length || urlIntent().open || urlIntent().fresh || hasDraft() || !firstVisit()) return
    seeded.current = true
    beginTransaction()
    const ids = SEED.map(([type, extras]) => addLayer(type, extras))
    commitTransaction()
    if (ids[0]) select(ids[0])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* Pages are the document's (plan-2026-11-19 C4.4, design-editor compose/frame.js): each with its own frames, layers
     and page color, in the file, the draft and undo. A row opens its page; the plus adds one and opens it; one page is
     a plain section (Figma plan 19.3) */
  const { pages, pageId, setPage, addPage, renamePage, duplicatePage, deletePage, movePage } = state
  /* a page row's right click (C4.2): the menu at the pointer, each row the engine's write */
  const [pageMenu, setPageMenu] = useState(null)
  /* Figma's page menu (read 2026-11-19): Copy link to page, Rename, Duplicate, Move up and Move down, Delete. The
     link opens this file on this page (`?open=` the saved file, `&page=` the page). Move up is greyed on the
     first page, Move down on the last */
  const pageLink = (p) => {
    const q = new URLSearchParams()
    if (currentPresetId) q.set('open', currentPresetId)
    q.set('page', p.id)
    return `${window.location.origin}${window.location.pathname}?${q}#/editor`
  }
  const pageRows = (p) => [[
    { label: 'Copy link to page', run: () => { try { navigator.clipboard?.writeText(pageLink(p))?.catch(() => {}) } catch { /* not allowed */ } } },
  ], [
    { label: 'Rename…', run: async () => { const n = (await askPrompt({ title: 'Rename page:', value: p.name, action: 'Rename' }))?.trim(); if (n) renamePage(p.id, n) } },
    { label: 'Duplicate', run: () => duplicatePage(p.id) },
    { label: 'Move up', disabled: pages[0]?.id === p.id, run: () => movePage(p.id, -1) },
    { label: 'Move down', disabled: pages[pages.length - 1]?.id === p.id, run: () => movePage(p.id, 1) },
  ], [
    { label: 'Delete', disabled: pages.length < 2, run: () => deletePage(p.id) },
  ]]
  /* a page link (`?page=`): that page opens once the file has it */
  const wantPage = useRef(new URLSearchParams(window.location.search).get('page'))
  useEffect(() => {
    const id = wantPage.current
    if (id && pages.some((p) => p.id === id)) { wantPage.current = null; setPage(id) }
  }, [pages, setPage])
  /* find in Pages (C4.1) reaches every page: Enter opens the layer's page and selects it */
  const findRows = pages.flatMap((p) => flatLayers(p.layers).map((l) => ({
    id: l.id, label: rowLabelForLayer(l), icon: iconFor(l), onClick: () => { setPage(p.id); select(l.id) },
  })))

  const fileRef = useRef(null)
  const [fileOpen, setFileOpen] = useState(false)

  const layerRows = useLayerRows()
  /* the tune mode on one shape (C6.2): its rail in the inspector's place, its board over the canvas */
  const tuning = !!useTune()
  const docked = chrome.ui === 'docked'
  const hidden = chrome.ui === 'hidden'
  const rightRail = tuning ? <TuneRail /> : <Properties />
  /* the left rail: docked whole; undocked (`float`) only the chosen sections, each floating under the pill */
  const leftRail = (float) => (
    <LeftRail
      variant="editor"
      float={float}
      collapsed={!float && layout.leftCollapsed}
      onCollapse={toggleMinimize}
      file={(
        /* the file title is a SPLIT BUTTON (his words 2026-11-19: "this is a split button"), the DS's own
           `ButtonSplit variant="kolbox"` in the ghost tone: no fill at rest, both halves take the field fill on hover
           and while the menu is open, the hovered half a step lighter. Both halves open the file menu. It is 24 high (his frame
           2386:62529), the name half padded 6, the chevron half 24 square; -ml-1.5 keeps the name on the rail's 16
           inset and -my-px lets the 24 button sit in the header's 22 title row (Figma's, W3). */
        /* with RailSwitcher minimized (W1.3) its mark stands before the file name, as Figma's logo does, opening the main menu */
        <span className="-my-px flex min-w-0 items-center gap-2">
        {!chrome.switcher && !float && (
          <button ref={pillMark} type="button" aria-label="Main menu" aria-haspopup="menu" onClick={() => setPillMenu((o) => !o)} data-mark
            className="inline-flex size-(--kol-kolbox-ctl) shrink-0 items-center justify-center rounded-track bg-accent text-on-accent outline-none hover:brightness-110 focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">
            <Icon name="wave" size={16} />
          </button>
        )}
        <span ref={fileRef} className="-ml-1.5 flex min-w-0 max-w-[calc(100%+0.375rem)]">
          <ButtonSplit variant="kolbox" tone="ghost" menuLabel="File menu" aria-expanded={fileOpen}
            onClick={() => setFileOpen((o) => !o)} onMenu={() => setFileOpen((o) => !o)}
            className={`min-w-0 [&>button]:px-[5px]! [&>button:first-child]:min-w-0 ${fileOpen ? 'is-open' : ''}`}>
            <span className="truncate">{currentPresetName || 'Untitled'}</span>
          </ButtonSplit>
        </span>
        </span>
      )}
      pages={pages.map((p) => ({ id: p.id, label: p.name, selected: p.id === pageId, onClick: () => setPage(p.id), onContextMenu: (e) => { e.preventDefault(); setPageMenu({ p, at: pointAnchor(e.clientX, e.clientY) }) } }))}
      onAddPage={() => addPage()}
      layers={layerRows}
      findRows={findRows}
      list={<LayersList iconFor={iconFor} />}
      onCollapseAll={collapseAllLayers}
    />
  )

  return (
    <EditorShell variant="kolbox"
      left={(
        <>
        {/* the layer menu on a row and on the canvas (round 4, W1); mounted with the rail so a collapsed rail keeps it */}
        <LayerMenuHost />
        {docked && !layout.leftCollapsed && <RailResize token="kol-kolbox-rail-left" side="left">{leftRail()}</RailResize>}
        </>
      )}
      right={docked && (
        <RailResize token="kol-kolbox-rail-right" side="right">
          <RailTop.Provider value={<RightRailTop zoom onPreview={openOutputWindow} onExport={() => onWindow('export')} />}>{rightRail}</RailTop.Provider>
        </RailResize>
      )}
      canvasFooter={!hidden && timelineUp && <EditorTimeline withTransport={layout.transport} />}
      toolbar={!hidden && (
        /* the real tools, the dock's two band actions and the paint pair (round 4, W3) */
        <ToolDockEditor />
      )}
    >
      {/* the engine's own canvas: its rulers and frame (its aspect tag hidden, index.css), in its dark tokens; `.kol-design-editor` is the root
          class its sheet scopes to; `.kol-editor-canvas` is the real shell's canvas cell, which the engine's View › Zoom
          In and Out find to zoom about its centre (CanvasArea's zoomBy), so the menu rows zoom as ⌘= and ⌘- do */}
      <div data-theme="dark" className="kol-design-editor kol-editor-canvas relative h-full">
        {/* the engine's canvas parts draw kolbox's look (R2: the one selection drawing), apps/kolbox included */}
        <VariantContext.Provider value="kolbox"><CanvasArea /></VariantContext.Provider>
      </div>
      <TuneStage />
      {/* the collapsed rail's pill (C4.3): the rail is gone and this brings it back */}
      {docked && layout.leftCollapsed && <RailPill name={currentPresetName || 'Untitled'} onExpand={toggleLeftRail} />}
      {/* UNDOCKED (W2.1, 2.2): the two pills, the chosen parts floating under them; the pill's panel icon docks again */}
      {chrome.ui === 'undocked' && (
        <>
          <RailPill name={currentPresetName || 'Untitled'} onExpand={toggleMinimize} markRef={pillMark} onMark={() => setPillMenu((o) => !o)}>
            {leftRail({ pages: chrome.floats.pages, layers: chrome.floats.layers })}
          </RailPill>
          <RailPillRight onPreview={openOutputWindow}>
            {RIGHT_SECTIONS.filter((n) => chrome.floats[`rs:${n}`]).map((n) => (
              <div key={n} className={`kol-kolbox-surface max-h-full w-(--kol-kolbox-rail-w) shrink-0 overflow-y-auto rounded-[var(--kol-radius-12)] ${SECTION_ONLY[n]}`} data-float-piece="right" data-float-section={n}>{rightRail}</div>
            ))}
          </RailPillRight>
        </>
      )}
      {/* the main menu on the undocked pill's mark, or on the rail header's when RailSwitcher is minimized */}
      <MenuMain anchor={pillMark} open={pillMenu} onClose={() => setPillMenu(false)} menus={shellMenus.filter((m) => m.label !== 'FXR')} app={shellMenus.find((m) => m.label === 'FXR').groups.flat()} />
      <Menu variant="kolbox" aria-label="Page" anchor={pageMenu?.at} open={!!pageMenu} onClose={() => setPageMenu(null)} onSelect={(row) => row.run?.()} groups={pageMenu ? pageRows(pageMenu.p) : []} />
      <MenuFile anchor={fileRef} open={fileOpen} onClose={() => setFileOpen(false)} groups={fileRows} />
      <FilesDialogHost />
      <Windows open={win} onClose={() => setWin(null)} />
      <ModalSearchHost mode="editor" menus={shellMenus} />
    </EditorShell>
  )
}

/* the real editor's draft (round 4, W9): autosaved to the engine's own slot (`kol.editor.draft`), offered back with
   "Restore your last canvas?" when the editor mounts again, after a move or a reload */
export default function Editor() {
  return (
    <Providers layerModel frames>
      <Screen />
    </Providers>
  )
}
