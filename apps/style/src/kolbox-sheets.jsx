import { useContext, useEffect, useRef, useState } from 'react'
import { OverlayMeasure } from './kolbox-measure.js'
import { Avatar, Button, ButtonGroup, ButtonSplit, Dropdown, FieldPair, Input, LabeledControl, Menu, ModalDialog, ModalProvider, ModalShell, PopoverPanel, Slider, SwatchGrid, TabsRow, ToggleCheckbox, ToggleSwitch, Tooltip, WheelTriangle, useModal, Rail, RailHeader, LabeledControlSection, TreeRow, SBSquare, HueStrip, AlphaStrip, ColorInputRow, ColorPickerPopover, TimelineDock, EditorShell, RailSwitcher, CommandOverlay, SectionText, Table, ContentCard, hsvaToHex } from '@kolkrabbi/kol-component'
import { ToolRail, ToolRailSlot, AppFloatNav, CatalogPage, CatalogGrid } from '@kolkrabbi/kol-shell'
/* kolbox's hsv (s and v 0..1) on KOL's color math (W31.2 batch 5: kolbox's ColorField helpers moved) */
const hsvToHex = ({ h, s, v }) => hsvaToHex({ hue: h, sat: s * 100, val: v * 100 })
import HomeRail from '@kolbox-host/ui/HomeRail.jsx'
import Icon from '@kolbox/ui/Icon.jsx'
import LeftRail from '@kolbox/ui/LeftRail.jsx'
import Providers from '@kolbox/app/Providers.jsx'
import MenuBlendMode from '@kolbox/ui/MenuBlendMode.jsx'
import MenuBoolean from '@kolbox/ui/MenuBoolean.jsx'
import MenuEffects from '@kolbox/ui/MenuEffects.jsx'
import MenuFile, { FILE_GROUPS } from '@kolbox/ui/MenuFile.jsx'
import MenuMain from '@kolbox/ui/MenuMain.jsx'
import PopoverEffect from '@kolbox/ui/PopoverEffect.jsx'
import PopoverEffects from '@kolbox/ui/PopoverEffects.jsx'
import PopoverStroke from '@kolbox/ui/PopoverStroke.jsx'
import RightRail, { RailTop, RightRailTop } from '@kolbox/ui/RightRail.jsx'
import { appRows } from '@kolbox/ui/MenuMain.jsx'
import BrowserTopBar from '@kolbox-host/home/BrowserTopBar.jsx'

/* THE KOLBOX SHEETS — what each sheet of #/kolbox shows: kolbox's own parts from apps/kolbox/src/ui (and its file
 * browser from home/), in their states, with static sample props where the app passes the engine's. A row is
 * { part, sub, col, stack, states: [{ label, view, force, target }] }: `force` holds the cell in hover or focus
 * (kolbox-measure.js), `target` picks which element of the part takes it (default the part's own element). A state
 * with `opens` is a trigger: the part lives in the body layer and opens from it. Layout glue only. */

const noop = () => {}
const OPTIONS = [{ value: 'flow', label: 'Flow' }, { value: 'grid', label: 'Grid' }, { value: 'noise', label: 'Noise' }]

/* a trigger for a part that portals to the body: a Button, primary while its part is open; the open panel is
   handed to the page so its measures can be read while it is there */
function Opener({ part, icon, children }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const { register } = useContext(OverlayMeasure)
  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => {
      const layers = document.querySelectorAll('[data-kolbox-overlay]')
      const panel = layers[layers.length - 1]?.firstElementChild
      if (panel) register(part, panel)
    }))
    return () => cancelAnimationFrame(id)
  }, [open, part, register])
  return (
    <span ref={ref} className="inline-flex" data-opener={part}>
      <Button variant="kolbox" iconLeft={icon} tone={open ? 'primary' : 'secondary'} aria-label={`Open ${part}`} onClick={() => setOpen(!open)}>Open</Button>
      {children({ anchor: ref, open, onClose: () => setOpen(false) })}
    </span>
  )
}
const opens = (part, icon, render) => ({ label: 'press to open', opens: part, view: () => <Opener part={part} icon={icon}>{render}</Opener> })

/* the page's own colors, read from the cell's scope (PopoverColor reads them off the document, which holds none here) */
const PAGE = ['ground', 'panel', 'canvas', 'field', 'border', 'text', 'muted', 'accent', 'info', 'success', 'error', 'link']
function useSwatches() {
  const [sw, setSw] = useState([])
  const ref = (n) => { if (n && !sw.length) setSw(PAGE.map((c) => getComputedStyle(n).getPropertyValue(`--kolbox-${c}`).trim().toUpperCase())) }
  return [sw, ref]
}

/* ── live cells that hold state ── */
function DropdownCell(props) {
  const [v, setV] = useState('flow')
  return <Dropdown variant="kolbox" value={v} options={OPTIONS} onChange={setV} className="w-full" ariaLabel="Type" {...props} />
}
function TabsCell({ tabs = ['Generate', 'Style', 'Animation'] }) {
  const [v, setV] = useState('Generate')
  return <TabsRow variant="kolbox" tabs={tabs} value={v} onChange={setV} />
}
function SliderCell({ readout }) {
  const [v, setV] = useState(readout === 'input' ? 72 : 40)
  return <Slider variant="kolbox" readout={readout} aria-label="Scale" value={v} onChange={setV} className="w-full" />
}
function ToggleCell({ on }) {
  const [v, setV] = useState(on)
  return <ToggleSwitch variant="kolbox" aria-label="Loop" checked={v} onChange={setV} />
}
function CheckCell({ on }) {
  const [v, setV] = useState(on)
  return <ToggleCheckbox variant="kolbox" aria-label="Clip" checked={v} onChange={setV} />
}
function ColorFieldCell() {
  const [hsv, setHsv] = useState({ s: 0.82, v: 0.98 })
  return <SBSquare variant="kolbox" hue={42} sat={hsv.s * 100} val={hsv.v * 100} onChange={(sat, val) => setHsv({ s: sat / 100, v: val / 100 })} className="rounded-control" />
}
function WheelCell() {
  const [c, setC] = useState({ h: 42, s: 82, v: 98 })
  return <WheelTriangle variant="kolbox" hue={c.h} sat={c.s} val={c.v} onChangeHue={(h) => setC({ ...c, h })} onChangeSV={(s, v) => setC({ ...c, s, v })} className="w-full" />
}
function HueCell() {
  const [h, setH] = useState(42)
  return <HueStrip variant="kolbox" hue={h} onChange={setH} />
}
function OpacityCell() {
  const [o, setO] = useState(64)
  return <AlphaStrip variant="kolbox" alpha={o / 100} color={hsvToHex({ h: 42, s: 0.82, v: 0.98 })} onChange={(a) => setO(Math.round(a * 100))} />
}
function SwatchCell() {
  const [sw, ref] = useSwatches()
  const [v, setV] = useState(null)
  return <div ref={ref} className="w-full"><SwatchGrid colors={sw} value={v ?? sw[7]} onChange={setV} /></div>
}
function FillCell({ lit, actions }) {
  const [v, setV] = useState('#FABD2F')
  return (
    <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Fill" value={v} onChange={setV} lit={lit} onSwatch={lit ? noop : undefined} opacity={actions ? 100 : undefined}
      actions={actions && <><Button variant="kolbox" iconOnly="eye-on" aria-label="Show fill"/><Button variant="kolbox" iconOnly="minus" aria-label="Remove fill"/></>} />
  )
}

/* ── overlays ── */
const MENU_KINDS = [
  { title: 'Group title', rows: [{ label: 'Highlighted', icon: 'copy', shortcut: '⌘D', highlighted: true }, { label: 'Shortcut', shortcut: '⌘⇧S' }, { label: 'Tag', tag: 'New' }] },
  [{ label: 'Checked', check: true }, { label: 'Unchecked', check: false }],
  [{ label: 'Opens a child', submenu: [[{ label: 'Child row', shortcut: '⌘1' }, { label: 'Second child' }], [{ label: 'Disabled child', disabled: true }]] }, { label: 'Disabled', disabled: true }],
]
/* the app's rows without their routes: here a press would leave the page */
const APP_ROWS = appRows({ mode: 'editor' }).map(({ run, submenu, ...r }) => ({ ...r, ...(submenu ? { submenu: submenu.map((g) => g.map(({ run: _, ...c }) => c)) } : {}) }))
const MAIN_MENUS = [
  { label: 'File', groups: FILE_GROUPS },
  { label: 'Edit', groups: [[{ label: 'Undo', shortcut: '⌘Z' }, { label: 'Redo', shortcut: '⌘⇧Z' }]] },
]
function ModalCell(p) {
  const [format, setFormat] = useState('PNG')
  return (
    <ModalDialog variant="kolbox" {...p} title="Export" footer={<><Button variant="kolbox" onClick={p.onClose}>Cancel</Button><Button variant="kolbox" tone="primary" onClick={p.onClose}>Export</Button></>}>
      <div className="flex flex-col gap-2 px-4 pb-4">
        <LabeledControl variant="kolbox" horizontal label="Name"><Input variant="kolbox" aria-label="Name" defaultValue="Untitled" className="flex-1" /></LabeledControl>
        <LabeledControl variant="kolbox" horizontal label="Format"><Dropdown variant="kolbox" ariaLabel="Format" value={format} options={['PNG', 'SVG', 'MP4']} onChange={setFormat} className="flex-1" /></LabeledControl>
      </div>
    </ModalDialog>
  )
}
const SEARCH_TABS = [{ value: 'overview', label: 'Overview' }, { value: 'actions', label: 'Actions' }, { value: 'tools', label: 'Tools' }, { value: 'pages', label: 'Pages' }]
const SEARCH_GROUPS = [
  { title: 'Recent', rows: [{ id: 'rect', icon: 'rectangle', label: 'Rectangle', hint: 'R' }, { id: 'export', icon: 'download', label: 'Export…', hint: '⌘E' }, { id: 'boolean', icon: 'boolean-unite', label: 'Unite', disabled: true, disabledHint: 'Select two layers' }] },
  { title: 'Pages', rows: [{ id: 'editor', icon: 'file', label: 'Editor' }, { id: 'labs', icon: 'file', label: 'Labs' }, { id: 'morph', icon: 'file', label: 'Morph' }] },
]
function SearchCell({ open, onClose }) {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('overview')
  const [active, setActive] = useState(0)
  return <CommandOverlay variant="kolbox" open={open} onClose={onClose} query={q} onQueryChange={setQ} tabs={SEARCH_TABS} tab={tab} onTab={setTab} groups={SEARCH_GROUPS} active={active} onActive={setActive} onSelect={onClose} />
}
function ColorPopoverCell(p) {
  const [sw, ref] = useSwatches()
  const [c, setC] = useState({ value: '#FABD2F', opacity: 100 })
  return <span ref={ref}><ColorPickerPopover variant="kolbox" {...p} color={c.value} opacity={c.opacity} swatches={sw} onChange={({ value, opacity }) => setC({ value, opacity })} /></span>
}
function StrokeCell(p) {
  const [v, setV] = useState({ style: 'Solid', join: 'Miter' })
  return <PopoverStroke {...p} value={v} onChange={(patch) => setV({ ...v, ...patch })} />
}
/* a sample effect schema in the engine's param grammar (the app passes the engine's own) */
const EFFECT_PARAMS = [
  { key: 'x', label: 'Offset X', type: 'range', min: -100, max: 100, default: 4 },
  { key: 'y', label: 'Offset Y', type: 'range', min: -100, max: 100, default: 8 },
  { key: 'blur', label: 'Blur', type: 'range', min: 0, max: 100, default: 24 },
  { key: 'color', label: 'Color', type: 'color', default: '#000000' },
  { key: 'mode', label: 'Blend', type: 'select', options: ['Normal', 'Multiply'], default: 'Normal' },
  { key: 'knockout', label: 'Knockout', type: 'toggle', default: false },
]
function EffectCell(p) {
  const [values, setValues] = useState({})
  return <PopoverEffect {...p} name="Outer Shadow" icon="drop-circle" params={EFFECT_PARAMS} values={values} onChange={(k, v) => setValues((c) => ({ ...c, [k]: v }))} />
}
/* kolbox's prompt and confirm are ModalProvider variant="kolbox" (W31.2 batch 4): the cell asks through useModal */
function Ask({ open, onClose, ask }) {
  const modal = useModal()
  useEffect(() => { if (open) ask(modal).then(onClose) }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
function PromptCell(p) {
  return <ModalProvider variant="kolbox"><Ask {...p} ask={(m) => m.prompt('Rename', 'Flow study', { okLabel: 'Rename' })} /></ModalProvider>
}
function ConfirmCell(p) {
  return <ModalProvider variant="kolbox"><Ask {...p} ask={(m) => m.confirm('Delete Flow study?', { okLabel: 'Delete', body: 'It leaves the library.' })} /></ModalProvider>
}

/* ── rails ── */
const LAYERS = [
  { id: 'group', label: 'Group', icon: 'layers', depth: 0, open: true },
  { id: 'title', label: 'Title', icon: 'type', depth: 1, selected: true },
  { id: 'circle', label: 'Circle', icon: 'circle', depth: 1 },
  { id: 'flow', label: 'Flow', icon: 'sparkles', depth: 0 },
]
const LABS = [
  { key: 'color', icon: 'color-swatch', label: 'Color', sub: [{ key: 'gradient', icon: 'circle', label: 'Gradient' }] },
  { key: 'effects', icon: 'sparkles', label: 'Effects', sub: [{ key: 'scanline', icon: 'circle', label: 'Scanline' }] },
  { key: 'generative', icon: 'layers', label: 'Generative', sub: [{ key: 'flow', icon: 'circle', label: 'Flow', active: true }, { key: 'grid', icon: 'circle', label: 'Grid' }] },
  { key: 'vector', icon: 'pen', label: 'Vector' },
]
const PLACES = [
  { id: 'recents', icon: 'clock', label: 'Recents', selected: true },
  { id: 'drafts', icon: 'file', label: 'Drafts' },
  { id: 'community', icon: 'users', label: 'Community', disabled: true },
  { id: 'folders', icon: 'grid-2x2', label: 'All folders', disabled: true },
  { id: 'resources', icon: 'book-open', label: 'Resources', disabled: true },
  { id: 'trash', icon: 'trash', label: 'Trash', disabled: true },
  { id: 'admin', icon: 'shield', label: 'Admin', disabled: true },
]
const RailBox = ({ children }) => <div className="flex h-[400px]">{children}</div>
function RightEditor() {
  const [x, setX] = useState('120')
  return (
    <RightRail title="Rectangle" actions={<Button variant="kolbox" iconOnly="more" aria-label="More"/>}>
      <LabeledControlSection variant="kolbox" label="Position">
        <FieldPair variant="kolbox" first={<Input variant="kolbox" prefix="X" aria-label="X" value={x} onChange={(e) => setX(e.target.value)} className="flex-1" />} second={<Input variant="kolbox" prefix="Y" aria-label="Y" defaultValue="516" className="flex-1" />} />
      </LabeledControlSection>
      <LabeledControlSection variant="kolbox" label="Fill" end={<Button variant="kolbox" iconOnly="plus" aria-label="Add fill"/>}><FillCell actions /></LabeledControlSection>
      <LabeledControlSection variant="kolbox" label="Effects" end={<Button variant="kolbox" iconOnly="plus" aria-label="Add effect"/>} />
    </RightRail>
  )
}
function RightLabs() {
  const [tab, setTab] = useState('Generate')
  const [v, setV] = useState(40)
  return (
    <RightRail variant="labs" title="Flow" meta="Preset 1" tabs={['Generate', 'Style', 'Animation']} tab={tab} onTab={setTab}>
      <LabeledControlSection variant="kolbox" label="Field">
        <LabeledControl variant="kolbox" horizontal label="Density"><Slider variant="kolbox" readout="input" aria-label="Density" value={v} onChange={setV} className="flex-1" /></LabeledControl>
        <LabeledControl variant="kolbox" horizontal label="Invert"><ToggleSwitch variant="kolbox" aria-label="Invert" checked /></LabeledControl>
      </LabeledControlSection>
    </RightRail>
  )
}
const HOME_ITEMS = PLACES

/* ── docks and shell ── */
const TOOLS = [
  { id: 'select', icon: 'pointer', label: 'Select', kbd: 'V', more: [{ id: 'node', icon: 'select-cursor', label: 'Node select', kbd: 'A' }] },
  { id: 'pen', icon: 'pen', label: 'Pen', kbd: 'P' },
  { id: 'rectangle', icon: 'rectangle', label: 'Rectangle', kbd: 'R' },
  { id: 'text', icon: 'type', label: 'Text', kbd: 'T' },
  { id: 'hand', icon: 'hand', label: 'Hand', kbd: 'H' },
]
function DockCell({ timeline = true }) {
  const [t, setT] = useState('select')
  const [lit, setLit] = useState(timeline)
  return <ToolRail variant="kolbox" tools={TOOLS} value={t} onChange={setT} onVariants={noop} end={<ToolRailSlot icon="panel-bottom" label="Timeline" lit={lit} onClick={() => setLit(!lit)} />} />
}
function TransportCell({ playing: p0 = false }) {
  const [playing, setPlaying] = useState(p0)
  const [loop, setLoop] = useState(true)
  const [len, setLen] = useState(4)
  return <AppFloatNav variant="kolbox" transport playing={playing} time={4.12} loop={loop} loopLength={len} onPlay={setPlaying} onLoop={setLoop} onLoopLength={setLen} />
}
const TRACKS = [{ id: 'flow', name: 'Obstacle flow', keyframes: [0, 4, 8] }, { id: 'opacity', name: 'Opacity', keyframes: [2, 6, 10] }, { id: 'morph', name: 'Morph', keyframes: [{ t: 1, label: 'Circle' }, { t: 7, label: 'Star' }] }]
function TimelineCell() {
  const [time, setTime] = useState(4.12)
  const [playing, setPlaying] = useState(false)
  const [loop, setLoop] = useState(true)
  return <TimelineDock variant="kolbox" tracks={TRACKS} time={time} duration={12} playing={playing} loop={loop} onSeek={setTime} onPlay={setPlaying} onLoop={setLoop} />
}
/* the shell since the top rail went (plan-2026-11-20 W1): RailSwitcher at the far left, the file name at the left rail's
   top, the zoom, Preview and Export at the right rail's top. On this page a space's press would leave it, so it is held */
const SPACES = [['/home', 'home-01', 'Home'], ['/editor', 'file', 'File'], ['/library', 'image', 'Media'], ['/labs', 'globe', 'Labs'], ['/morph', 'swap', 'Morph'], ['/randomiser', 'refresh', 'Randomiser']].map(([value, icon, label]) => ({ value, icon, label }))
const SwitcherCell = ({ value = '/editor' }) => <RailSwitcher variant="kolbox" items={SPACES} foot={[{ icon: 'nav-settings', label: 'Settings', onClick: noop }]} value={value} onSelect={noop} onMark={noop} />
const RightTopCell = ({ zoom = true }) => <div className="w-[240px] bg-panel"><RightRailTop zoom={zoom} onPreview={noop} onExport={noop} /></div>
function ShellCell({ timeline }) {
  return (
    <div className="flex h-[560px] w-full">
      <SwitcherCell />
      <div className="min-w-0 flex-1">
      <EditorShell variant="kolbox"
        left={<Providers persistDraft={false}><LeftRail file="Flow study" pages={[{ id: 'p1', label: 'Page 1', selected: true }]} layers={LAYERS} onCollapse={noop} /></Providers>}
        right={<RailTop.Provider value={<RightRailTop zoom onPreview={noop} onExport={noop} />}><RightEditor /></RailTop.Provider>}
        toolbar={<DockCell timeline={timeline} />}
        canvasFooter={timeline && <TimelineCell />}
      />
      </div>
    </div>
  )
}

/* ── file browser ── */
const HOUR = 36e5
const FILES = [
  { id: 'a', name: 'Flow study', modified: Date.now() - 2 * HOUR, created: Date.now() - 50 * HOUR },
  { id: 'b', name: 'Poster grid', modified: Date.now() - 26 * HOUR, created: Date.now() - 80 * HOUR },
  { id: 'c', name: 'Untitled', modified: Date.now() - 200 * HOUR, created: Date.now() - 300 * HOUR },
]
const NotWired = ({ children }) => <Tooltip variant="kolbox" label="Not wired">{children}</Tooltip>
const TopBarCell = () => (
  <BrowserTopBar crumbs={['Recents']} actions={<>
    <Button variant="kolbox" tone="primary" iconLeft="plus" className="mr-3 h-8!">Create<Icon name="chevron-down" size={12} /></Button>
    <NotWired><Button variant="kolbox" tone="ghost" disabled>Share</Button></NotWired>
    <NotWired><Button variant="kolbox" iconOnly="adjust-sliders" aria-label="Adjust" disabled/></NotWired>
    <NotWired><Button variant="kolbox" iconOnly="star" aria-label="Star" disabled/></NotWired>
  </>} />
)
function TitleRowCell({ view, setView }) {
  return (
    <SectionText variant="kolbox" headline="Recents" menu={<NotWired><Button variant="kolbox" iconOnly="chevron-down" aria-label="Recents menu" disabled/></NotWired>} actions={<>
      <Dropdown variant="kolbox" size="xs" ariaLabel="Type" value="all" options={[{ value: 'all', label: 'All types' }]} />
      <Dropdown variant="kolbox" size="xs" ariaLabel="Sort" value="modified" options={[{ value: 'modified', label: 'Last modified' }]} />
      <ButtonGroup layout="joined" variant="kolbox" tone="sunken" options={[
        { icon: 'grid-2x2', ariaLabel: 'Grid view', pressed: view === 'grid', onPress: () => setView?.('grid') },
        { icon: 'view-list', ariaLabel: 'List view', pressed: view === 'list', onPress: () => setView?.('list') },
      ]}/>
    </>} />
  )
}
function BrowserCell({ start }) {
  const [view, setView] = useState(start)
  return (
    <div className="h-[600px] w-full">
      <CatalogPage variant="kolbox" sidebar={<HomeRail account="Studio" items={HOME_ITEMS} />}>
        <TopBarCell />
        <TitleRowCell view={view} setView={setView} />
        {view === 'grid' ? <CatalogGrid variant="kolbox">{FILES.map((f) => <ContentCard variant="kolbox" key={f.id} file={f} onOpen={noop} />)}</CatalogGrid> : <Table variant="kolbox" rows={FILES} sort="modified" onOpen={noop} />}
      </CatalogPage>
    </div>
  )
}

/* ── the screens: the editor's routes under the kolbox style, on its dev server (pnpm editor, 5180) or its built folder ── */
const KOLBOX = import.meta.env.DEV ? `${window.location.protocol}//${window.location.hostname}:5180/` : '/apps/editor/'
const screen = (route, note) => ({
  label: 'opens', col: 'w-[520px]',
  view: () => (
    <div className="flex flex-col gap-1">
      <a href={`${KOLBOX}#/${route}`} target="_blank" rel="noreferrer" className="font-mono text-value text-link underline-offset-4 hover:underline">{`${KOLBOX}#/${route}`}</a>
      <span className="text-help text-muted">{note}</span>
    </div>
  ),
})

/* ── the sheets, in his reference page's order ── */
const S = (label, view, more) => ({ label, view, ...more })
const hover = (view, target) => S('hover', view, { force: 'hover', target })
const focus = (view, target) => S('focus', view, { force: 'focus', target })

export const SHEETS = [
  { id: 'surfaces', title: 'Surfaces and color', note: 'Every color kolbox paints with, as its tokens hold them.', resources: ['apps/kolbox/src/index.css'], tokens: 'color' },
  { id: 'type', title: 'Type', note: 'The two faces and the six type steps: size, line height and weight.', resources: ['apps/kolbox/src/index.css'], tokens: 'type' },
  { id: 'space', title: 'Space, radius and sizes', note: 'The space steps, the fixed sizes, the radii and the menu shadow.', resources: ['apps/kolbox/src/index.css'], tokens: 'space' },
  {
    id: 'controls', title: 'Controls', note: 'Each control in the states it has: rest, hover, focus, lit and disabled.', panelNote: 'rest, hover and other states, sizes in CSS px',
    resources: ['apps/kolbox/src/ui', 'apps/kolbox/src/pages/DevControls.jsx'],
    rows: [
      { part: 'Button', sub: 'variant primary', states: [S('rest', () => <Button variant="kolbox" tone="primary">Export</Button>), hover(() => <Button variant="kolbox" tone="primary">Export</Button>), focus(() => <Button variant="kolbox" tone="primary">Export</Button>), S('disabled', () => <Button variant="kolbox" tone="primary" disabled>Export</Button>)] },
      { part: 'Button', sub: 'variant secondary', states: [S('rest', () => <Button variant="kolbox">Preview</Button>), hover(() => <Button variant="kolbox">Preview</Button>), focus(() => <Button variant="kolbox">Preview</Button>), S('disabled', () => <Button variant="kolbox" disabled>Preview</Button>)] },
      { part: 'Button', sub: 'variant ghost', states: [S('rest', () => <Button variant="kolbox" tone="ghost" iconLeft="plus">Add</Button>), hover(() => <Button variant="kolbox" tone="ghost" iconLeft="plus">Add</Button>), focus(() => <Button variant="kolbox" tone="ghost" iconLeft="plus">Add</Button>), S('disabled', () => <Button variant="kolbox" tone="ghost" iconLeft="plus" disabled>Add</Button>)] },
      { part: 'IconButton', states: [S('rest', () => <Button variant="kolbox" iconOnly="plus" aria-label="Add"/>), hover(() => <Button variant="kolbox" iconOnly="plus" aria-label="Add"/>), focus(() => <Button variant="kolbox" iconOnly="plus" aria-label="Add"/>), S('lit', () => <Button variant="kolbox" iconOnly="plus" aria-label="Add" pressed/>), S('disabled', () => <Button variant="kolbox" iconOnly="plus" aria-label="Add" disabled/>)] },
      { part: 'SplitButton', sub: 'variant primary', states: [S('rest', () => <ButtonSplit variant="kolbox" tone="primary" menuLabel="More">Export</ButtonSplit>), hover(() => <ButtonSplit variant="kolbox" tone="primary" menuLabel="More">Export</ButtonSplit>, 'button:first-child'), S('hover, chevron', () => <ButtonSplit variant="kolbox" tone="primary" menuLabel="More">Export</ButtonSplit>, { force: 'hover', target: 'button:last-child', kind: 'other' }), focus(() => <ButtonSplit variant="kolbox" tone="primary" menuLabel="More">Export</ButtonSplit>, 'button:first-child')] },
      { part: 'SplitButton', sub: 'variant secondary', states: [S('rest', () => <ButtonSplit variant="kolbox" menuLabel="More">Export</ButtonSplit>), hover(() => <ButtonSplit variant="kolbox" menuLabel="More">Export</ButtonSplit>, 'button:first-child'), S('hover, chevron', () => <ButtonSplit variant="kolbox" menuLabel="More">Export</ButtonSplit>, { force: 'hover', target: 'button:last-child', kind: 'other' }), focus(() => <ButtonSplit variant="kolbox" menuLabel="More">Export</ButtonSplit>, 'button:first-child')] },
      { part: 'Input', sub: 'variant field', states: [S('rest, lead', () => <Input variant="kolbox" prefix="X" aria-label="X" defaultValue="120" className="w-full" />), S('rest, icon', () => <Input variant="kolbox" iconLeft="corner-radius" aria-label="Radius" defaultValue="0°" className="w-full"/>, { kind: 'other' }), focus(() => <Input variant="kolbox" prefix="X" aria-label="X" defaultValue="120" className="w-full" />), S('disabled', () => <Input variant="kolbox" prefix="X" aria-label="X" defaultValue="120" disabled className="w-full" />)] },
      { part: 'Input', sub: 'variant search', states: [S('rest', () => <Input variant="kolbox" size="md" iconLeft="search" placeholder="Search" aria-label="Search" className="w-full"/>), focus(() => <Input variant="kolbox" size="md" iconLeft="search" placeholder="Search" aria-label="Search" className="w-full"/>)] },
      { part: 'Input', sub: 'variant command', col: 'w-[336px]', states: [S('rest', () => <Input variant="kolbox" size="lg" iconLeft="search" placeholder="Search tools, actions, pages…" aria-label="Search" className="w-full" slotRight={<span className="font-mono text-meta text-muted">⌘K</span>}/>)] },
      { part: 'Dropdown', sub: 'variant field', states: [S('rest', () => <DropdownCell />), focus(() => <DropdownCell />), S('disabled', () => <DropdownCell disabled />), S('press to open', () => <DropdownCell />, { kind: 'none' })] },
      { part: 'Dropdown', sub: 'variant outline', states: [S('rest', () => <DropdownCell variant="outline" className="" />), focus(() => <DropdownCell variant="outline" className="" />)] },
      { part: 'Tabs', col: 'w-[220px]', states: [S('rest', () => <TabsCell />), hover(() => <TabsCell />, 'button[aria-selected="false"]'), focus(() => <TabsCell />, 'button'), S('disabled tab', () => <TabsCell tabs={['Basic', { value: 'Dynamic', label: 'Dynamic', disabled: true }, { value: 'Brush', label: 'Brush', disabled: true }]} />, { kind: 'none' })] },
      { part: 'Slider', sub: 'variant plain', col: 'w-[200px]', states: [S('rest', () => <SliderCell />), focus(() => <SliderCell />, 'input')] },
      { part: 'Slider', sub: 'variant field', col: 'w-[200px]', states: [S('rest', () => <SliderCell readout="input" />), focus(() => <SliderCell readout="input" />, 'input')] },
      { part: 'Toggle', states: [S('on', () => <ToggleCell on />), S('off', () => <ToggleCell on={false} />, { kind: 'other' }), focus(() => <ToggleSwitch variant="kolbox" aria-label="Loop" checked />), S('disabled', () => <ToggleSwitch variant="kolbox" aria-label="Loop" checked disabled />)] },
      { part: 'Checkbox', states: [S('checked', () => <CheckCell on />), S('unchecked', () => <CheckCell on={false} />, { kind: 'other' }), focus(() => <ToggleCheckbox variant="kolbox" aria-label="Clip" checked />)] },
      { part: 'Tooltip', states: [S('rest', () => <Tooltip variant="kolbox" label="Add effect"><Button variant="kolbox" iconOnly="plus" aria-label="Add effect"/></Tooltip>), S('shown', () => <Tooltip variant="kolbox" label="Add effect"><Button variant="kolbox" iconOnly="plus" aria-label="Add effect"/></Tooltip>, { force: 'hover', kind: 'none', tall: true })] },
      { part: 'IconGroup', sub: 'variant cells', states: [S('rest', () => <ButtonGroup layout="joined" variant="kolbox" className="w-24" options={[{ icon: 'rotate-left', ariaLabel: 'Rotate' }, { icon: 'flip-horizontal', ariaLabel: 'Flip horizontal' }, { icon: 'flip-vertical', ariaLabel: 'Flip vertical' }]}/>), S('lit', () => <ButtonGroup layout="joined" variant="kolbox" className="w-24" options={[{ icon: 'rotate-left', ariaLabel: 'Rotate' }, { icon: 'flip-horizontal', ariaLabel: 'Flip horizontal', pressed: true }, { icon: 'flip-vertical', ariaLabel: 'Flip vertical' }]}/>, { kind: 'none' }), hover(() => <ButtonGroup layout="joined" variant="kolbox" className="w-24" options={[{ icon: 'rotate-left', ariaLabel: 'Rotate' }, { icon: 'flip-horizontal', ariaLabel: 'Flip horizontal' }, { icon: 'flip-vertical', ariaLabel: 'Flip vertical' }]}/>, 'button:nth-child(2)')] },
      { part: 'IconGroup', sub: 'variant track', states: [S('rest', () => <ButtonGroup layout="joined" variant="kolbox" tone="sunken" options={[{ icon: 'grid-2x2', ariaLabel: 'Grid view', pressed: true }, { icon: 'view-list', ariaLabel: 'List view' }]}/>)] },
      { part: 'Icon', states: [S('12', () => <Icon name="sparkles" size={12} />), S('16', () => <Icon name="sparkles" />, { kind: 'none' }), S('20', () => <Icon name="sparkles" size={20} />, { kind: 'none' })] },
    ],
  },
  {
    id: 'menus', title: 'Menus', note: 'Every list that drops from a trigger is a Menu on the darker surface; each opens from its row.', panelNote: 'each opens from its trigger, Escape or a press outside closes it',
    resources: ['apps/kolbox/src/ui/Menu.jsx', 'apps/kolbox/src/pages/DevOverlays.jsx'],
    rows: [
      { part: 'Menu', sub: 'row kinds and a child panel', states: [opens('Menu', 'layers', (p) => <Menu variant="kolbox" {...p} aria-label="Row kinds" groups={MENU_KINDS} />)] },
      { part: 'MenuMain', sub: 'the menu on the logo', states: [opens('MenuMain', 'wave', (p) => <MenuMain {...p} menus={MAIN_MENUS} app={APP_ROWS} />)] },
      { part: 'MenuFile', sub: 'the file name’s rows', states: [opens('MenuFile', 'file', (p) => <MenuFile {...p} />)] },
      { part: 'MenuBlendMode', states: [opens('MenuBlendMode', 'blend', (p) => <MenuBlendMode {...p} />)] },
      { part: 'MenuBoolean', states: [opens('MenuBoolean', 'boolean-unite', (p) => <MenuBoolean {...p} />)] },
      { part: 'MenuEffects', states: [opens('MenuEffects', 'plus', (p) => <MenuEffects {...p} />)] },
    ],
  },
  {
    id: 'modals', title: 'Modals and popovers', note: 'The panel shell, drawn beside a rail as a Popover or centred on the dim as a Modal, and the color parts.', panelNote: 'the shell inline, the rest from their triggers',
    resources: ['apps/kolbox/src/ui/Popover.jsx', 'apps/kolbox/src/ui/Modal.jsx', 'apps/kolbox/src/pages/DevOverlays.jsx'],
    rows: [
      { part: 'Popover', sub: 'PopoverShell inline, and from a trigger', col: 'w-[240px]', states: [
        S('shell', () => <ModalShell variant="kolbox" title="Popover" onClose={noop}><p className="px-4 pb-4 text-help text-muted">The body is the children.</p></ModalShell>),
        S('shell with footer', () => <ModalShell variant="kolbox" title="Popover" onClose={noop} footer={<><Button variant="kolbox" tone="ghost">Cancel</Button><Button variant="kolbox" tone="primary">Apply</Button></>}><p className="px-4 pb-4 text-help text-muted">A footer of buttons under it.</p></ModalShell>, { kind: 'none' }),
        opens('Popover', 'maximize', (p) => <PopoverPanel variant="kolbox" {...p} title="Popover"><p className="px-4 pb-4 text-help text-muted">Beside its trigger.</p></PopoverPanel>),
      ] },
      { part: 'Modal', states: [opens('Modal', 'maximize', (p) => <ModalCell {...p} />)] },
      { part: 'ModalPrompt', states: [opens('ModalPrompt', 'edit', (p) => <PromptCell {...p} />)] },
      { part: 'ModalConfirm', states: [opens('ModalConfirm', 'trash', (p) => <ConfirmCell {...p} />)] },
      { part: 'ModalSearch', states: [opens('ModalSearch', 'search', (p) => <SearchCell {...p} />)] },
      { part: 'PopoverColor', states: [opens('PopoverColor', 'color-swatch', (p) => <ColorPopoverCell {...p} />)] },
      { part: 'PopoverStroke', states: [opens('PopoverStroke', 'sliders-rows', (p) => <StrokeCell {...p} />)] },
      { part: 'PopoverEffect', states: [opens('PopoverEffect', 'drop-circle', (p) => <EffectCell {...p} />)] },
      { part: 'PopoverEffects', states: [opens('PopoverEffects', 'sparkles', (p) => <PopoverEffects {...p} />)] },
      { part: 'ColorField', col: 'w-[208px]', states: [S('rest', () => <ColorFieldCell />)] },
      { part: 'ColorWheel', col: 'w-[208px]', states: [S('rest', () => <WheelCell />), focus(() => <WheelCell />)] },
      { part: 'HueSlider', col: 'w-[208px]', states: [S('rest', () => <HueCell />)] },
      { part: 'OpacitySlider', col: 'w-[208px]', states: [S('rest', () => <OpacityCell />)] },
      { part: 'SwatchGrid', col: 'w-[208px]', states: [S('rest, one picked', () => <SwatchCell />)] },
    ],
  },
  {
    id: 'rails', title: 'Rails', note: 'One Rail shell carries the fill, the edge line and the 240 width; every rail is that shell with content in its slots.', panelNote: 'rails at their own size, on the canvas color', ground: 'bg-canvas',
    resources: ['apps/kolbox/src/ui/Rail.jsx'],
    rows: [
      { part: 'Rail', col: 'w-[240px]', states: [S('side left', () => <RailBox><Rail variant="kolbox" side="left" aria-label="Rail" header={<RailHeader variant="kolbox" title="Header slot" />} footer={<div className="px-4 py-3 text-help text-muted">Footer slot</div>}><p className="px-4 text-help text-muted">The body scrolls.</p></Rail></RailBox>), S('side right', () => <RailBox><Rail variant="kolbox" side="right" aria-label="Rail" header={<RailHeader variant="kolbox" title="Header slot" />}><p className="px-4 text-help text-muted">The body scrolls.</p></Rail></RailBox>, { kind: 'none' }), S('collapsed', () => <RailBox><Rail variant="kolbox" side="left" aria-label="Rail" collapsed /></RailBox>, { kind: 'none' })] },
      { part: 'LeftRail', col: 'w-[240px]', states: [S('variant editor', () => <RailBox><Providers persistDraft={false}><LeftRail file="Flow study" pages={[{ id: 'p1', label: 'Page 1' }]} layers={LAYERS} onCollapse={noop} /></Providers></RailBox>), S('editor, collapsed', () => <RailBox><Providers persistDraft={false}><LeftRail collapsed layers={LAYERS} onCollapse={noop} /></Providers></RailBox>, { kind: 'none' }), S('variant labs', () => <RailBox><LeftRail variant="labs" rows={LABS} /></RailBox>, { kind: 'none' })] },
      { part: 'RightRail', col: 'w-[240px]', states: [S('variant editor', () => <RailBox><RightEditor /></RailBox>), S('variant labs', () => <RailBox><RightLabs /></RailBox>, { kind: 'none' })] },
      { part: 'HomeRail', col: 'w-[240px]', states: [S('rest', () => <RailBox><HomeRail account="Studio" items={HOME_ITEMS} /></RailBox>)] },
      { part: 'RailHeader', col: 'w-[240px]', states: [S('title, meta, actions', () => <div className="w-full bg-panel"><RailHeader variant="kolbox" title="Flow" subtitle="Preset 1" actions={<Button variant="kolbox" iconOnly="more" aria-label="More"/>} /></div>), S('leading', () => <div className="w-full bg-panel"><RailHeader variant="kolbox" leading={<Avatar initial="S" size="xs" className="-ml-1" />} title="Studio" /></div>, { kind: 'none' })] },
      { part: 'RailSection', col: 'w-[240px]', states: [S('with rows', () => <div className="w-full bg-panel"><LabeledControlSection variant="kolbox" label="Layout" end={<Button variant="kolbox" iconOnly="plus" aria-label="Add"/>}><LabeledControl variant="kolbox" horizontal label="Invert"><ToggleSwitch variant="kolbox" aria-label="Invert" checked /></LabeledControl></LabeledControlSection></div>), S('empty', () => <div className="w-full bg-panel"><LabeledControlSection variant="kolbox" label="Effects" end={<Button variant="kolbox" iconOnly="plus" aria-label="Add effect"/>} /></div>, { kind: 'none' })] },
      { part: 'ListRow', sub: 'variant plain', col: 'w-[224px]', states: [S('rest', () => <TreeRow variant="kolbox" label="Page 1" />), hover(() => <TreeRow variant="kolbox" label="Page 1" />), S('selected', () => <TreeRow variant="kolbox" label="Page 1" active />), S('disabled', () => <TreeRow variant="kolbox" label="Page 1" disabled />)] },
      { part: 'ListRow', sub: 'tree', col: 'w-[224px]', states: [S('open', () => <TreeRow variant="kolbox" tree icon="layers" label="Group" expanded />), S('child, selected', () => <TreeRow variant="kolbox" tree depth={1} icon="type" label="Title" active />), S('no children', () => <TreeRow variant="kolbox" tree icon="sparkles" label="Flow" />, { kind: 'none' })] },
      { part: 'ListRow', sub: 'variant accent', col: 'w-[224px]', states: [S('rest', () => <TreeRow variant="kolbox" size="sm" icon="file" label="Drafts" />), hover(() => <TreeRow variant="kolbox" size="sm" icon="file" label="Drafts" />), S('selected', () => <TreeRow variant="kolbox" size="sm" icon="clock" label="Recents" active />), S('disabled', () => <TreeRow variant="kolbox" size="sm" icon="trash" label="Trash" disabled />)] },
      { part: 'ListRow', sub: 'variant search', col: 'w-[224px]', states: [S('rest', () => <TreeRow variant="kolbox" size="lg" icon="rectangle" label="Rectangle" />), S('selected', () => <TreeRow variant="kolbox" size="lg" icon="rectangle" label="Rectangle" active />)] },
      { part: 'PropertyRow', col: 'w-[208px]', states: [S('rest', () => <FieldPair variant="kolbox" first={<Input variant="kolbox" prefix="X" aria-label="X" defaultValue="120" className="flex-1" />} second={<Input variant="kolbox" prefix="Y" aria-label="Y" defaultValue="516" className="flex-1" />} />)] },
      { part: 'FillRow', col: 'w-[208px]', states: [S('rest', () => <FillCell />), S('swatch open', () => <FillCell lit />), S('opacity, actions', () => <FillCell actions />, { kind: 'none' })] },
      { part: 'LabeledControl', col: 'w-[208px]', states: [S('rest', () => <LabeledControl variant="kolbox" horizontal label="Opacity"><Input variant="kolbox" aria-label="Opacity" defaultValue="100%" className="flex-1" /></LabeledControl>), S('stacked', () => <LabeledControl variant="kolbox" label="Palette"><Input variant="kolbox" aria-label="Palette" defaultValue="Gruvbox" className="flex-1" /></LabeledControl>, { kind: 'none' }), S('wide', () => <div className="w-[320px]"><LabeledControl variant="kolbox" horizontal label="Default aspect" labelWidth={160}><Input variant="kolbox" aria-label="Default aspect" defaultValue="4:5" className="flex-1" /></LabeledControl></div>, { kind: 'none' })] },
      { part: 'Avatar', states: [S('rest', () => <Avatar initial="S" size="xs" />)] },
    ],
  },
  {
    id: 'docks', title: 'Docks and timeline', note: 'The tool dock and the transport toolbar share one shell; the motion timeline floats over the window’s foot.', panelNote: 'on the canvas color, as they float over it', ground: 'bg-canvas',
    resources: ['apps/kolbox/src/ui/ToolDock.jsx', 'apps/kolbox/src/pages/DevTimeline.jsx'],
    rows: [
      { part: 'ToolDock', col: 'w-[300px]', states: [S('rest, timeline lit', () => <DockCell />), S('hover on a tool', () => <DockCell />, { force: 'hover', target: 'button[aria-label="Pen"]', kind: 'hover' })] },
      { part: 'ToolbarTransport', col: 'w-[300px]', states: [S('stopped', () => <TransportCell />), S('playing', () => <TransportCell playing />, { kind: 'none' })] },
      { part: 'MotionTimeline', stack: true, states: [S('rest', () => <TimelineCell />)] },
    ],
  },
  {
    id: 'shell', title: 'Shell', note: 'The one shell: RailSwitcher, left rail, canvas and right rail, with the dock and the timeline over the canvas.', panelNote: 'the shell at a reduced window, with sample content, on the ground', ground: 'bg-ground',
    resources: ['packages/component/src/utilities/EditorShell.jsx', 'packages/component/src/organisms/RailSwitcher.jsx', 'packages/design-editor/src/editor/kolbox/ui/RightRail.jsx'],
    rows: [
      { part: 'Shell', stack: true, states: [S('timeline off', () => <ShellCell />), S('timeline on', () => <ShellCell timeline />, { kind: 'none' })] },
      { part: 'RailSwitcher', states: [S('File lit', () => <SwitcherCell />), S('Home lit', () => <SwitcherCell value="/home" />, { kind: 'none' })] },
      { part: 'RightRailTop', col: 'w-[240px]', states: [S('editor, with the zoom', () => <RightTopCell />), S('labs', () => <RightTopCell zoom={false} />, { kind: 'none' })] },
    ],
  },
  {
    id: 'browser', title: 'File browser', note: 'Home: the HomeRail beside the browser, in grid and in list, with sample files.', panelNote: 'sample files; the app lists the engine’s library',
    resources: ['apps/kolbox/src/home', 'apps/kolbox/src/pages/Home.jsx'],
    rows: [
      { part: 'Browser', sub: 'grid, with FileGrid', also: 'FileGrid', stack: true, states: [S('rest', () => <BrowserCell start="grid" />)] },
      { part: 'Browser', sub: 'list, with FileList', also: 'FileList', stack: true, states: [S('rest', () => <BrowserCell start="list" />)] },
      { part: 'BrowserTopBar', stack: true, states: [S('rest', () => <div className="w-full bg-panel"><TopBarCell /></div>)] },
      { part: 'BrowserTitleRow', stack: true, states: [S('rest', () => <div className="w-full bg-panel"><TitleRowCell view="grid" /></div>)] },
      { part: 'FileCard', col: 'w-[356px]', states: [S('rest', () => <div className="grid w-full"><ContentCard variant="kolbox" file={FILES[0]} /></div>, { target: '[data-file-card]' }), focus(() => <div className="grid w-full"><ContentCard variant="kolbox" file={FILES[0]} /></div>, '[data-file-card]')] },
      { part: 'FileListHeader', stack: true, states: [S('rest', () => <div className="w-full"><Table variant="kolbox" sort="modified" className="pt-0!" /></div>)] },
      { part: 'FileListRow', stack: true, states: [S('rest', () => <div className="w-full"><Table variant="kolbox" rows={[FILES[0]]} className="pt-0! [&>[role=row]:first-child]:hidden" /></div>), hover(() => <div className="w-full"><Table variant="kolbox" rows={[FILES[0]]} className="pt-0! [&>[role=row]:first-child]:hidden" /></div>, '[role=row]')] },
    ],
  },
  {
    id: 'screens', title: 'Screens', note: 'The four screens on the real engine, in the kolbox app.', panelNote: 'each opens the app’s route in a new tab; run it with pnpm editor with the Kolbox style',
    resources: ['apps/kolbox/src/pages'],
    rows: [
      { part: 'Editor', screen: true, states: [screen('editor', 'The editor engine: layers, the property rail, the tool dock.')] },
      { part: 'Labs', screen: true, states: [screen('labs', 'The generators, the lab picker and their settings.')] },
      { part: 'Morph', screen: true, states: [screen('morph', 'Steps between shapes, on the timeline.')] },
      { part: 'Home', screen: true, states: [screen('home', 'The file browser on the engine’s library.')] },
    ],
  },
]
