import './folio-boot.js'
import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { CommandOverlay, FindBar, AlphaStrip, Button, ButtonGroup, ButtonSplit, ColorField, ColorPickerPopover, ColorSwatch, Dropdown, FieldPair, Input, LabeledControl, LabeledControlSection, Menu, MenuTrigger, ModalDialog, NavRail, QuantityInput, Rail, RailFloat, Slider, SpectrumControls, SwatchGrid, TabsRow, TimelineDock, ToggleCheckbox, ToggleSwitch, Tooltip, TreeRow, floatSurfaceClass, SBSquare, HueStrip, ColorInputRow, hsvaToHex } from '@kolkrabbi/kol-component'
/* kolbox's hsv (s and v 0..1) on KOL's color math (W31.2 batch 5: kolbox's ColorField helpers moved) */
const hsvToHex = ({ h, s, v }) => hsvaToHex({ hue: h, sat: s * 100, val: v * 100 })
import { ToolRail, ToolRailSlot, AppFloatNav, MenuBar } from '@kolkrabbi/kol-shell'
import { IconLoader } from '@kolkrabbi/kol-icons'
import { Check, CONTROL } from '@folio/folio/parts.jsx'
import { LangToggle } from '@folio/folio/Chrome.jsx'
import { LibraryTree, folioMenus } from '@folio/folio/EditorChrome.jsx'
import { ACCENTS, KOL_DARKS } from '@folio/folio/settings.js'
import MButton from '@minimal/ui/Button.jsx'
import MFieldRow from '@minimal/ui/FieldRow.jsx'
import MInput from '@minimal/ui/Input.jsx'
import MPanel from '@minimal/ui/Panel.jsx'
import MSection from '@minimal/ui/Section.jsx'
import MSegmented from '@minimal/ui/Segmented.jsx'
import MSelect from '@minimal/ui/Select.jsx'
import { NavRailRow as MNavRailRow } from '@minimal/ui/NavRail.jsx'
import MInputNumber from '@minimal/ui/InputNumber.jsx'
import MInputColor from '@minimal/ui/InputColor.jsx'
import { MenuButton as MMenuButton, MenuRow as MMenuRow, MenuDivider as MMenuDivider } from '@minimal/ui/Menu.jsx'
import MSlider from '@minimal/ui/Slider.jsx'
import MToggle from '@minimal/ui/Toggle.jsx'
import { Toolbar as MToolbar, ToolbarDivider as MToolbarDivider } from '@minimal/ui/Toolbar.jsx'
import MButtonSplit from '@minimal/ui/ButtonSplit.jsx'
import { HueStrip as MHueStrip, SBSquare as MSBSquare } from '@minimal/ui/ColorSpectrum.jsx'
import XRightRail from '@kolbox/ui/RightRail.jsx'
import Icon from '@kolbox/ui/Icon.jsx'

/* THE ROWS OF THE STYLES BOARD — one per part, one cell per style. A cell is `{ from, view }` (the style's own
 * component, imported from where it lives) or `{ near }` / `{}` (a gap: the style has no such part; `near` names the
 * closest thing it does have). Layout glue only — nothing here restyles a part. */

export const STYLES = [
  { id: 'default', name: 'Default', about: 'The shipped KOL parts as they are: square controls on the page.' },
  { id: 'float', name: 'Float', about: 'The same parts with variant="float": capsules that float over a scene.' },
  { id: 'folio', name: 'Folio', about: 'Folio’s own reading-room parts: paper, ink and hairline rules.' },
  { id: 'minimal', name: 'Minimal', about: 'A stand-alone style with its own tokens: small type on black.' },
  { id: 'kolbox', name: 'Kolbox', about: 'A stand-alone style with its own tokens: docked rails on a warm dark ground with a yellow accent.' },
]

const noop = () => {}
const OPTIONS = [{ value: 'flow', label: 'Flow' }, { value: 'grid', label: 'Grid' }, { value: 'noise', label: 'Noise' }]
const TABS = [{ value: 'generate', label: 'Generate' }, { value: 'style', label: 'Style' }]
const MENU = [
  { label: 'Duplicate', icon: 'copy', kbd: '⌘D', onClick: noop },
  { label: 'Rename', onClick: noop },
  { divider: true },
  { label: 'Delete layer', icon: 'trash', tone: 'danger', onClick: noop },
]
const TOOLS = [
  { id: 'select', icon: 'pointer', label: 'Select', kbd: 'V' },
  { id: 'rect', icon: 'square', label: 'Rectangle', kbd: 'R' },
  { id: 'text', icon: 'type', label: 'Text', kbd: 'T' },
]
const SITE_NAV = [{ id: 'labs', label: 'Labs', icon: 'layers', pages: [{ label: 'Flow', to: '/labs/flow' }, { label: 'Scanline', to: '/labs/scanline' }] }]
const FOLIO_MENUS = [
  ['File', [['New', noop, '⌘N'], ['Save', noop, '⌘S'], '-', ['Export', noop]]],
  ['Edit', [['Undo', noop, '⌘Z'], ['Redo', noop, '⌘⇧Z']]],
  ['View', [['Library', noop, null, true], ['Rail', noop]]],
]

/* the float material its controls sit on (apps/float's Plate), over the grey scene the cell draws */
const Plate = ({ className = '', children }) => (
  <div className={`${floatSurfaceClass('solid', true)} flex max-w-full flex-wrap items-center gap-3 rounded-[var(--kol-float-menu-r)] p-3 ${className}`}>{children}</div>
)
const useV = (init) => useState(init)

/* ── cells that hold state ── */
function KSlider({ float }) {
  const [v, setV] = useV(42)
  const s = <Slider variant={float ? 'float' : undefined} aria-label="Radius" value={v} onChange={setV} />
  return float ? <Plate className="w-56 flex-col items-stretch">{s}</Plate> : <div className="w-56">{s}</div>
}
function KQty({ float }) {
  const [v, setV] = useV(3)
  const q = <QuantityInput variant={float ? 'float' : undefined} value={v} onChange={setV} min={1} max={20} />
  return float ? <Plate>{q}</Plate> : q
}
function KDropdown({ float }) {
  const [v, setV] = useV('flow')
  const d = <Dropdown variant={float ? 'float' : undefined} size="md" options={OPTIONS} value={v} onChange={setV} ariaLabel="Type" />
  return float ? <Plate>{d}</Plate> : d
}
function KTabs({ float }) {
  const [v, setV] = useV('generate')
  const t = <ButtonGroup layout="joined" variant={float ? 'float' : undefined} options={TABS} value={v} onChange={setV} ariaLabel="View" />
  return float ? <Plate>{t}</Plate> : t
}
function KSwitch({ float }) {
  const [v, setV] = useV(true)
  const t = <ToggleSwitch variant={float ? 'float' : undefined} checked={v} onChange={setV} aria-label="Invert" />
  return float ? <Plate>{t}</Plate> : t
}
function KCheck({ float }) {
  const [v, setV] = useV(true)
  const c = <ToggleCheckbox variant={float ? 'float' : undefined} label="Snap to grid" checked={v} onChange={setV} />
  return float ? <Plate>{c}</Plate> : c
}
function KFieldRow({ float }) {
  const [v, setV] = useV('Orbit field')
  const v8 = float ? 'float' : undefined
  const r = (
    <LabeledControl variant={v8} horizontal label="Name" className="w-full">
      <Input variant={v8} value={v} onChange={(e) => setV(e.target.value)} width="100%" aria-label="Name" />
    </LabeledControl>
  )
  return float ? <Plate className="w-64">{r}</Plate> : <div className="w-64">{r}</div>
}
function KSection({ float }) {
  const [a, setA] = useV(true)
  const [b, setB] = useV(60)
  const v8 = float ? 'float' : undefined
  const s = (
    <LabeledControlSection variant={v8} label="Layout">
      <LabeledControl variant={v8} horizontal label="Invert"><ToggleSwitch variant={v8} checked={a} onChange={setA} aria-label="Invert" /></LabeledControl>
      <LabeledControl variant={v8} horizontal label="Drift"><Slider variant={v8} value={b} onChange={setB} aria-label="Drift" /></LabeledControl>
    </LabeledControlSection>
  )
  return float ? <Plate className="w-64 flex-col items-stretch">{s}</Plate> : <div className="w-64">{s}</div>
}
function KSiteNav() {
  const [path, setPath] = useV('/labs/flow')
  return (
    <div className="h-[220px] w-[240px] overflow-hidden">
      <NavRail variant="site" navTree={SITE_NAV} currentPath={path} onNavigate={(e, to) => { e?.preventDefault?.(); setPath(to) }} themeToggle={false} footer={false} />
    </div>
  )
}
function KTree() {
  const [open, setOpen] = useV(true)
  return (
    <div className="flex w-[240px] flex-col gap-1">
      <TreeRow icon="layers" label="Labs" expanded={open} open={open} onToggle={() => setOpen(!open)} />
      {open && <TreeRow depth={1} icon="circle" label="Flow" active onClick={noop} />}
      {open && <TreeRow depth={1} icon="filter" label="Scanline" onClick={noop} />}
    </div>
  )
}
function KRail() {
  const [on, setOn] = useV(true)
  return (
    <div className="flex h-[240px] w-[260px] justify-end">
      <Rail mode="push" open side="right" width={260} variant="app" backdrop={false} onClose={noop} header={<span className="kol-doc-section-title">Properties</span>}>
        <LabeledControl horizontal label="Invert"><ToggleSwitch checked={on} onChange={setOn} aria-label="Invert" /></LabeledControl>
      </Rail>
    </div>
  )
}
function KRailFloat() {
  const [on, setOn] = useV(true)
  return (
    <RailFloat title="Properties" width={260}>
      <LabeledControl variant="float" horizontal label="Invert"><ToggleSwitch variant="float" checked={on} onChange={setOn} aria-label="Invert" /></LabeledControl>
    </RailFloat>
  )
}
function KToolRail() {
  const [t, setT] = useV('select')
  return <ToolRail tools={TOOLS} value={t} onChange={setT} orientation="horizontal" />
}
function KMenu({ float }) {
  const v8 = float ? 'float' : undefined
  const m = <Menu variant={v8} items={MENU} minWidth={200} trigger={({ open, props }) => <MenuTrigger variant={v8} open={open} icon="layers" {...props}>Layer</MenuTrigger>} />
  return float ? <Plate>{m}</Plate> : m
}
function KModal({ float }) {
  const [box, setBox] = useState(null)
  const [open, setOpen] = useState(true)
  const v8 = float ? 'float' : undefined
  return (
    <div ref={setBox} className="relative flex h-[300px] w-full items-center justify-center">
      <Button variant={v8} tone={float ? 'secondary' : undefined} size="md" onClick={() => setOpen(true)}>Open window</Button>
      <ModalDialog container={box} variant={float ? 'float' : 'lift'} blocking={false} open={open && !!box} onClose={() => setOpen(false)} title="Export scene">
        <p className={float ? 'kol-float-body text-fg-64' : 'kol-doc-body text-fg-64'}>Still in motion, scene 01, 12 seconds.</p>
      </ModalDialog>
    </div>
  )
}
function KTooltip({ float }) {
  const v8 = float ? 'float' : undefined
  const t = <Tooltip variant={v8} label="Export video"><Button variant={v8} tone={float ? 'secondary' : 'grey'} iconOnly="download" size="md" aria-label="Export" /></Tooltip>
  return float ? <Plate>{t}</Plate> : t
}

/* Folio */
function FChoice() {
  const [v, setV] = useV('flow')
  return <Dropdown variant="folio" value={v} onChange={setV} ariaLabel="Type" options={OPTIONS.map((o) => ({ value: o.value, label: o.label }))} className="kol-folio-control" />
}
function FTree() {
  return (
    <MemoryRouter>
      <div className="flex h-[260px] w-[260px]"><LibraryTree reading current="" className="min-h-0 w-full border border-folio-rule" /></div>
    </MemoryRouter>
  )
}
/* the command list's host, as Folio's editor keeps it (the query, the lit row, the list), on the folio look */
function FCommands({ onClose }) {
  const [q, setQ] = useState('')
  const [at, setAt] = useState(0)
  const all = FOLIO_MENUS.flatMap(([group, items]) => items.filter((it) => it !== '-' && it[1]).map((it) => ({ label: `${group}: ${it[0]}`, run: it[1], hint: it[2] })))
  const n = q.trim().toLowerCase()
  const list = n ? all.filter((c) => n.split(/\s+/).every((w) => c.label.toLowerCase().includes(w))) : all
  return (
    <CommandOverlay variant="folio" mode="commands" open aria-label="Commands" placeholder="Type a command" onClose={onClose}
      query={q} onQueryChange={(v) => { setQ(v); setAt(0) }} results={list} active={at} onActive={setAt}
      onSelect={(c) => { onClose(); c?.run() }} empty={!list.length ? 'No command matches.' : null} />
  )
}
function FModal() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative flex h-[300px] w-full items-center justify-center" style={{ transform: 'translateZ(0)' }}>
      <Button variant="folio" iconLeft="search" onClick={() => setOpen(true)}>Command list</Button>
      {open && <FCommands onClose={() => setOpen(false)} />}
    </div>
  )
}
function FFind() {
  const [find, setFind] = useV('raven')
  const [repl, setRepl] = useV('')
  const [mc, setMc] = useV(false)
  /* FindBar focuses its field as it mounts (autoFocus), which would scroll the board to it on load: it opens from its
   * own Tool, the way the editor opens it */
  const [open, setOpen] = useV(false)
  if (!open) return <Button variant="folio" iconLeft="search" onClick={() => setOpen(true)}>Find &amp; replace</Button>
  return (
    <div className="w-full overflow-x-auto">
      <FindBar variant="folio" query={find} onQueryChange={setFind} replacement={repl} onReplacementChange={setRepl} count="3 of 12" onPrev={noop} onNext={noop} onReplace={noop} onReplaceAll={noop} matchCase={mc} onMatchCase={setMc} onClose={() => setOpen(false)} />
    </div>
  )
}
function FStepper() {
  const [v, setV] = useV(16)
  return <div className="w-48"><QuantityInput variant="folio" down="A−" up="A+" downLabel="Smaller text" upLabel="Larger text" value={v} min={12} max={24} unit="px" onChange={setV} /></div>
}
function FSeg() {
  const [v, setV] = useV('generate')
  return <ButtonGroup layout="joined" variant="folio" ariaLabel="View" value={v} onChange={setV} options={TABS} />
}
function FCheck() {
  const [v, setV] = useV(true)
  return <button type="button" aria-pressed={v} onClick={() => setV(!v)} className={`${CONTROL} flex items-center gap-2`}><Check checked={v} />Snap to grid</button>
}
function FSwatches() {
  const [v, setV] = useV('green')
  return <SwatchGrid variant="folio" aria-label="Accent">{ACCENTS.map((a) => <ColorSwatch variant="folio" key={a} hex="var(--kol-folio-green)" frame={false} aria-label={a} selected={v === a} data-folio-accent={a} onClick={() => setV(a)} />)}</SwatchGrid>
}
const FRailCell = () => (
  <div className="flex h-[240px] w-[260px]">
    <Rail variant="folio" aria-label="Library" className="min-h-0 w-full border border-folio-rule">
      <div className="shrink-0 px-[16px] pb-[8px] pt-[16px]"><Input variant="folio" aria-label="Filter the library" placeholder="Filter" className="w-full" /></div>
    </Rail>
  </div>
)
function FLang() {
  const [l, setL] = useV('IS')
  return <LangToggle langs={['IS', 'EN']} lang={l} onLang={setL} />
}
const F_SPLIT = [{ label: 'Export PNG', onPress: noop }, { label: 'Export SVG', onPress: noop }]
function FSwitchCell() {
  const [v, setV] = useV(true)
  return <ToggleSwitch variant="folio" checked={v} onChange={setV} aria-label="Invert" />
}
function FSliderCell() {
  const [v, setV] = useV(42)
  return <div className="w-56"><Slider variant="folio" aria-label="Radius" value={v} onChange={setV} /></div>
}
function FFillCell() {
  const [v, setV] = useV('#121215')
  return <div className="flex w-[240px]"><ColorInputRow variant="folio" picker={ColorPickerPopover} label="Fill" value={v} swatches={KOL_DARKS} onChange={setV} /></div>
}
function FSwatchMenuCell() {
  const [v, setV] = useV('#121215')
  return <ColorPickerPopover variant="folio" label="Background" color={v} swatches={KOL_DARKS} onChange={setV} />
}
function FFieldRowCell() {
  const [v, setV] = useV('Orbit field')
  return <div className="w-64"><LabeledControl variant="folio" horizontal label="Name"><Input variant="folio" aria-label="Name" value={v} onChange={(e) => setV(e.target.value)} className="w-full" /></LabeledControl></div>
}
function FPairCell() {
  const [x, setX] = useV('120')
  const [y, setY] = useV('516')
  return <div className="w-64"><FieldPair variant="folio" fields={[{ prefix: 'X', value: x, onChange: (e) => setX(e.target.value), 'aria-label': 'X' }, { prefix: 'Y', value: y, onChange: (e) => setY(e.target.value), 'aria-label': 'Y' }]} /></div>
}
function FSectionCell() {
  const [a, setA] = useV(true)
  const [b, setB] = useV(60)
  return (
    <div className="w-64">
      <LabeledControlSection variant="folio" label="Layout">
        <LabeledControl variant="folio" horizontal label="Invert"><ToggleSwitch variant="folio" checked={a} onChange={setA} aria-label="Invert" /></LabeledControl>
        <LabeledControl variant="folio" horizontal label="Drift"><Slider variant="folio" aria-label="Drift" value={b} onChange={setB} /></LabeledControl>
      </LabeledControlSection>
    </div>
  )
}
function FTransportCell() {
  const [playing, setPlaying] = useV(false)
  const [loop, setLoop] = useV(true)
  return <AppFloatNav variant="folio" transport playing={playing} onPlay={setPlaying} onStop={() => setPlaying(false)} loop={loop} onLoop={setLoop} timecode={{ current: '00:04', total: '00:12' }} />
}
function FTimelineCell() {
  const [t, setT] = useV(0.34)
  return <Scroll w="w-[640px]"><TimelineDock variant="folio" t={t} onSeek={setT} tracks={[{ id: 'flow', label: 'Obstacle flow', keys: [0, 0.33, 0.66] }, { id: 'opacity', label: 'Opacity', keys: [0.16, 0.5, 0.83] }]} /></Scroll>
}

/* Minimal */
function MSliderCell() {
  const [v, setV] = useV(0.08)
  return <div className="w-56"><MSlider value={v} min={0.03} max={0.16} step={0.01} format={(n) => n.toFixed(2)} onChange={setV} /></div>
}
function MSelectCell() {
  const [v, setV] = useV('Flow')
  return <div className="flex w-48"><MSelect value={v} options={OPTIONS.map((o) => o.label)} onChange={setV} /></div>
}
function MTabsCell() {
  const [v, setV] = useV('Generate')
  return <div className="w-64"><MSegmented value={v} onChange={setV} options={['Generate', 'Style', 'Animation']} /></div>
}
function MToggleCell() {
  const [v, setV] = useV(true)
  return <MToggle checked={v} onChange={setV} />
}
function MFieldRowCell() {
  const [v, setV] = useV('Flow')
  return <div className="w-64"><MFieldRow label="Type"><MSelect value={v} options={OPTIONS.map((o) => o.label)} onChange={setV} /></MFieldRow></div>
}
function MSectionCell() {
  const [a, setA] = useV(true)
  const [b, setB] = useV(0.18)
  return (
    <div className="w-72 bg-panel">
      <MSection title="Parameters">
        <MFieldRow label="Invert"><MToggle checked={a} onChange={setA} /></MFieldRow>
        <MFieldRow label="Drift"><MSlider value={b} min={0} max={0.35} step={0.01} format={(n) => n.toFixed(2)} onChange={setB} /></MFieldRow>
      </MSection>
    </div>
  )
}
function MInputNumberCell() {
  const [v, setV] = useV(3)
  return <MInputNumber value={v} onCommit={setV} aria-label="Obstacles" />
}
function MInputColorCell() {
  const [v, setV] = useV('#121215')
  return <div className="w-56"><MInputColor label="Background" value={v} onChange={setV} /></div>
}
function MSidebarCell() {
  const [open, setOpen] = useV(true)
  const [at, setAt] = useV('Flow')
  return (
    <div className="flex w-[240px] flex-col gap-1">
      <MNavRailRow icon="layers" chevron expanded={open} onClick={() => setOpen(!open)}>Generative</MNavRailRow>
      {open && ['Flow', 'Scanline', 'Pattern'].map((l) => <MNavRailRow key={l} sub active={at === l} onClick={() => setAt(l)}>{l}</MNavRailRow>)}
    </div>
  )
}
function MPanelCell() {
  const [a, setA] = useV(false)
  return (
    <div className="h-[240px]">
      <MPanel side="left">
        <MSection title="Flow"><MFieldRow label="Invert"><MToggle checked={a} onChange={setA} /></MFieldRow></MSection>
      </MPanel>
    </div>
  )
}

/* KOL parts for the rows kolbox brought (Icon group, Property row, Color picker, Color popover, Timeline, Transport) */
const TRANSFORM = [
  { value: 'rotate', icon: 'rotate-left', ariaLabel: 'Rotate' },
  { value: 'flip-h', icon: 'flip-horizontal', ariaLabel: 'Flip horizontal' },
  { value: 'flip-v', icon: 'flip-vertical', ariaLabel: 'Flip vertical' },
]
function KIconGroup({ float }) {
  /* no value: the stateless action strip (ButtonGroup's segmented state law) */
  const g = <ButtonGroup layout="joined" variant={float ? 'float' : 'filled'} options={TRANSFORM.map(({ icon, ...o }) => ({ ...o, label: <IconLoader name={icon} size={16} /> }))} onChange={noop} ariaLabel="Transform" />
  return float ? <Plate>{g}</Plate> : g
}
function KPair({ float }) {
  const [x, setX] = useV('120')
  const [y, setY] = useV('516')
  const v8 = float ? 'float' : undefined
  const p = <FieldPair variant={v8} fields={[{ prefix: 'X', value: x, onChange: (e) => setX(e.target.value), 'aria-label': 'X' }, { prefix: 'Y', value: y, onChange: (e) => setY(e.target.value), 'aria-label': 'Y' }]} />
  return float ? <Scroll><Plate className="w-64">{p}</Plate></Scroll> : <div className="w-64">{p}</div>
}
function KPicker({ float }) {
  const [hsv, setHsv] = useV({ hue: 40, sat: 80, val: 95 })
  const [a, setA] = useV(1)
  const p = (
    <div className="flex h-[220px] w-56 flex-col gap-3">
      <SpectrumControls value={hsv} onChange={setHsv} />
      <AlphaStrip alpha={a} color={`hsl(${hsv.hue} 100% 50%)`} onChange={setA} />
    </div>
  )
  return float ? <Plate className="flex-col items-stretch">{p}</Plate> : p
}
function KColorPopover({ float }) {
  const [c, setC] = useV('#121215')
  const p = <ColorPickerPopover color={c} onChange={setC} label="Background" size="sm" />
  return float ? <Plate>{p}</Plate> : p
}
/* a part wider than a narrow column: centred while it fits, else it scrolls from its start (a centred overflow would cut
 * its left side off) */
const Scroll = ({ w = 'w-max', children }) => <div className="w-full overflow-x-auto"><div className={`mx-auto ${w}`}>{children}</div></div>
const KEYS = (ts) => ts.map((t) => ({ t, v: 0 }))
function KTimeline() {
  const [t, setT] = useV(0.34)
  const [tracks, setTracks] = useV([
    { id: 'flow', label: 'Obstacle flow', keys: KEYS([0, 0.33, 0.66]) },
    { id: 'opacity', label: 'Opacity', keys: KEYS([0.16, 0.5, 0.83]) },
  ])
  return (
    <Scroll w="w-[640px]">
      <TimelineDock tracks={tracks} t={t} onSeek={setT} onChange={(id, keys) => setTracks(tracks.map((r) => (r.id === id ? { ...r, keys } : r)))} />
    </Scroll>
  )
}
const TRANSPORT = [
  { id: 'play', icon: 'play', label: 'Play', selected: true },
  { id: 'pause', icon: 'pause', label: 'Pause' },
  { id: 'loop', icon: 'repeat', label: 'Loop' },
  { id: 'stop', icon: 'stop', label: 'Stop' },
  { id: 'back', icon: 'skip-start', label: 'Back' },
]
/* the transport pill is fixed to the viewport (a phone's); a transformed box is its containing block — apps/float's glue */
const KTransportFloat = () => (
  <Scroll>
    <div className="relative h-[82px] w-[306px] [transform:translateZ(0)] [&_.kol-mobile-tabbar]:!flex">
      <AppFloatNav variant="transport" items={TRANSPORT} timecode={{ current: '00:04:12', total: '00:12:00' }} />
    </div>
  </Scroll>
)

/* Minimal, for the rows kolbox brought */
const MSplitCell = () => <MButtonSplit onClick={noop} items={[{ label: 'Export PNG' }, { label: 'Export SVG' }]}>Export</MButtonSplit>
function MPickerCell() {
  const [h, setH] = useV(40)
  const [sv, setSv] = useV([80, 95])
  return (
    <div className="flex w-56 flex-col gap-3">
      <MSBSquare hue={h} sat={sv[0]} val={sv[1]} onChange={(s, v) => setSv([s, v])} className="aspect-square w-full" />
      <MHueStrip hue={h} onChange={setH} />
    </div>
  )
}

/* Kolbox: its own parts from apps/kolbox/src/ui, set as its dev pages set them (pages/DevControls, DevOverlays, DevTimeline) */
function XSliderCell() {
  const [a, setA] = useV(40)
  const [b, setB] = useV(72)
  return (
    <div className="flex w-56 flex-col gap-2">
      <Slider variant="kolbox" aria-label="Scale" value={a} onChange={setA} />
      <Slider variant="kolbox" readout="input" aria-label="Density" value={b} onChange={setB} />
    </div>
  )
}
function XDropdownCell() {
  const [v, setV] = useV('flow')
  return <Dropdown variant="kolbox" value={v} options={OPTIONS} onChange={setV} className="w-40" />
}
function XTabsCell() {
  const [v, setV] = useV('generate')
  return <TabsRow variant="kolbox" tabs={TABS} value={v} onChange={setV} />
}
function XToggleCell() {
  const [v, setV] = useV(true)
  return <ToggleSwitch variant="kolbox" aria-label="Invert" checked={v} onChange={setV} />
}
function XCheckCell() {
  const [v, setV] = useV(true)
  return <ToggleCheckbox variant="kolbox" aria-label="Snap to grid" checked={v} onChange={setV} />
}
function XFieldRowCell() {
  const [v, setV] = useV('Orbit field')
  return <div className="w-full max-w-64"><LabeledControl variant="kolbox" horizontal label="Name"><Input variant="kolbox" aria-label="Name" value={v} onChange={(e) => setV(e.target.value)} className="flex-1" /></LabeledControl></div>
}
function XSectionCell() {
  const [a, setA] = useV(true)
  const [b, setB] = useV(60)
  return (
    <div className="w-[240px] bg-panel">
      <LabeledControlSection variant="kolbox" label="Layout">
        <LabeledControl variant="kolbox" horizontal label="Invert"><ToggleSwitch variant="kolbox" aria-label="Invert" checked={a} onChange={setA} /></LabeledControl>
        <LabeledControl variant="kolbox" horizontal label="Drift"><Slider variant="kolbox" aria-label="Drift" value={b} onChange={setB} className="flex-1" /></LabeledControl>
      </LabeledControlSection>
    </div>
  )
}
function XSidebarCell() {
  const [open, setOpen] = useV(true)
  const [at, setAt] = useV('Flow')
  return (
    <div className="flex w-[240px] flex-col gap-2">
      <TreeRow variant="kolbox" tree icon="layers" label="Labs" expanded={open} onClick={() => setOpen(!open)} />
      {open && ['Flow', 'Scanline'].map((l) => <TreeRow variant="kolbox" key={l} tree depth={1} icon="circle" label={l} active={at === l} onClick={() => setAt(l)} />)}
    </div>
  )
}
function XRailCell() {
  const [on, setOn] = useV(true)
  return (
    <div className="h-[240px]">
      <XRightRail title="Properties">
        <LabeledControlSection variant="kolbox" label="Layout"><LabeledControl variant="kolbox" horizontal label="Invert"><ToggleSwitch variant="kolbox" aria-label="Invert" checked={on} onChange={setOn} /></LabeledControl></LabeledControlSection>
      </XRightRail>
    </div>
  )
}
const X_TOOLS = [
  { id: 'select', icon: 'pointer', label: 'Select', kbd: 'V', more: [{ id: 'node', icon: 'select-cursor', label: 'Node select', kbd: 'A' }] },
  { id: 'rectangle', icon: 'rectangle', label: 'Rectangle', kbd: 'R' },
  { id: 'text', icon: 'type', label: 'Text', kbd: 'T' },
]
function XToolbarCell() {
  const [t, setT] = useV('select')
  const [lit, setLit] = useV(true)
  return (
    <Scroll>
      <ToolRail variant="kolbox"
        tools={X_TOOLS}
      value={t}
      onChange={setT}
      onVariants={(tool) => setT(t === tool.more[0].id ? tool.id : tool.more[0].id)}
        end={<ToolRailSlot icon="panel-bottom" label="Timeline" lit={lit} onClick={() => setLit(!lit)} />}
      />
    </Scroll>
  )
}
/* Menu and Popover portal to the body: they open from their trigger, as Folio's palette does, and take kolbox's tokens
   through `data-kolbox-overlay` (index.css) */
const X_MENU = [[{ label: 'Duplicate', icon: 'copy', shortcut: '⌘D' }, { label: 'Rename' }], [{ label: 'Delete layer', icon: 'trash' }]]
function XMenuCell() {
  const [at, setAt] = useState(null)
  return (
    <>
      <Button variant="kolbox" iconLeft="layers" onClick={(e) => setAt(e.currentTarget)}>Layer</Button>
      <Menu variant="kolbox" aria-label="Layer" anchor={at} open={!!at} onClose={() => setAt(null)} groups={X_MENU} />
    </>
  )
}
/* Modal portals to the body as a centred dialog on its dim: it opens from its trigger, with the default cell's title and sentence */
function XModalCell() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="kolbox" onClick={() => setOpen(true)}>Open window</Button>
      <ModalDialog variant="kolbox" open={open} onClose={() => setOpen(false)} title="Export scene">
        <p className="px-4 pb-4 text-label text-muted">Still in motion, scene 01, 12 seconds.</p>
      </ModalDialog>
    </>
  )
}
function XColorFieldCell() {
  const [v, setV] = useV('#121215')
  return <div className="flex w-56"><ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Background" value={v} onChange={setV} /></div>
}
function XFillCell() {
  const [v, setV] = useV('#FABD2F')
  const [shown, setShown] = useV(true)
  return (
    <div className="flex w-[240px]">
      <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Fill" value={v} onChange={setV} opacity={100} actions={<><Button variant="kolbox" iconOnly={shown ? 'eye-on' : 'eye-off'} aria-label="Show fill" onClick={() => setShown(!shown)}/><Button variant="kolbox" iconOnly="minus" aria-label="Remove fill"/></>} />
    </div>
  )
}
/* the page's own colors, read from the cell (kolbox's PopoverColor reads them off the document, which holds none here) */
const X_PAGE = ['ground', 'panel', 'canvas', 'field', 'border', 'text', 'muted', 'accent', 'info', 'success', 'error', 'link']
const readPage = (node) => X_PAGE.map((n) => getComputedStyle(node).getPropertyValue(`--kolbox-${n}`).trim().toUpperCase())
function XPickerCell() {
  const [hsv, setHsv] = useV({ h: 42, s: 0.82, v: 0.98 })
  const [o, setO] = useV(100)
  const [sw, setSw] = useV([])
  const hex = hsvToHex(hsv)
  return (
    <div ref={(n) => { if (n && !sw.length) setSw(readPage(n)) }} className="flex w-56 flex-col gap-3">
      <SBSquare variant="kolbox" hue={hsv.h} sat={hsv.s * 100} val={hsv.v * 100} onChange={(sat, val) => setHsv({ ...hsv, s: sat / 100, v: val / 100 })} className="rounded-control" />
      <HueStrip variant="kolbox" hue={hsv.h} onChange={(h) => setHsv({ ...hsv, h })} />
      <AlphaStrip variant="kolbox" alpha={o / 100} color={hex} onChange={(a) => setO(Math.round(a * 100))} />
      <SwatchGrid colors={sw} />
    </div>
  )
}
function XPopoverCell() {
  const [at, setAt] = useState(null)
  const [c, setC] = useV({ value: '#121215', opacity: 100 })
  const [sw, setSw] = useV([])
  return (
    <div ref={(n) => { if (n && !sw.length) setSw(readPage(n)) }} className="flex w-56">
      <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Background" value={c.value} onChange={(value) => setC({ ...c, value })} onSwatch={(e) => setAt(e.currentTarget)} lit={!!at} />
      <ColorPickerPopover variant="kolbox" anchor={at} open={!!at} onClose={() => setAt(null)} color={c.value} opacity={c.opacity} swatches={sw} onChange={({ value, opacity }) => setC({ value, opacity })} />
    </div>
  )
}
function XTimelineCell() {
  const [time, setTime] = useV(4.12)
  const [playing, setPlaying] = useV(false)
  const [loop, setLoop] = useV(true)
  const tracks = [{ id: 'flow', name: 'Obstacle flow', keyframes: [0, 4, 8] }, { id: 'opacity', name: 'Opacity', keyframes: [2, 6, 10] }]
  return <Scroll w="w-[640px]"><TimelineDock variant="kolbox" tracks={tracks} time={time} duration={12} playing={playing} loop={loop} onSeek={setTime} onPlay={setPlaying} onLoop={setLoop} /></Scroll>
}
function XTransportCell() {
  const [playing, setPlaying] = useV(false)
  const [loop, setLoop] = useV(true)
  const [len, setLen] = useV(4)
  return <Scroll><AppFloatNav variant="kolbox" transport playing={playing} time={4.12} loop={loop} loopLength={len} onPlay={setPlaying} onLoop={setLoop} onLoopLength={setLen} /></Scroll>
}

const TYPE = { heading: 'Heading', body: 'Body text sets the reading line of the style.', label: 'Small label' }
const TypeSample = ({ h, b, l }) => (
  <div className="flex w-full max-w-[260px] flex-col gap-2">
    <p className={h}>{TYPE.heading}</p>
    <p className={b}>{TYPE.body}</p>
    <p className={l}>{TYPE.label}</p>
  </div>
)

/* every row; `wide` lets a cell scroll sideways instead of clipping a part wider than its stage */
export const ROWS = [
  { name: 'Button', cells: {
    default: { from: 'kol-component Button', view: () => <div className="flex flex-wrap items-center justify-center gap-2"><Button tone="inverted">Export</Button><Button tone="outline">Duplicate</Button><Button tone="ghost">Cancel</Button></div> },
    float: { from: 'kol-component Button variant="float"', view: () => <Plate><Button variant="float" tone="inverted">Export</Button><Button variant="float" tone="secondary">Duplicate</Button><Button variant="float" tone="ghost">Cancel</Button></Plate> },
    folio: { from: 'kol-component Button variant="folio" (size lg, md)', view: () => <div className="flex flex-wrap items-center justify-center gap-2"><Button variant="folio" size="lg" tone="primary" glyph="→">Export</Button><Button variant="folio" size="lg" glyph="+">Duplicate</Button><Button variant="folio">Cancel</Button></div> },
    minimal: { from: 'minimal/ui/Button.jsx', view: () => <div className="flex items-center gap-1"><MButton variant="filled">Export</MButton><MButton variant="outline">Duplicate</MButton><MButton>Cancel</MButton></div> },
    kolbox: { from: 'kolbox/ui/Button.jsx', view: () => <div className="flex flex-wrap items-center justify-center gap-2"><Button variant="kolbox" tone="primary">Export</Button><Button variant="kolbox" tone="secondary">Duplicate</Button><Button variant="kolbox" tone="ghost">Cancel</Button></div> },
  } },
  { name: 'Icon button', cells: {
    default: { from: 'kol-component Button iconOnly', view: () => <div className="flex gap-2"><Button tone="grey" iconOnly="plus" aria-label="Add" /><Button tone="ghost" iconOnly="download" aria-label="Download" /></div> },
    float: { from: 'kol-component Button variant="float" iconOnly', view: () => <Plate><Button variant="float" tone="secondary" iconOnly="plus" aria-label="Add" /><Button variant="float" tone="ghost" iconOnly="download" aria-label="Download" /></Plate> },
    folio: { from: 'kol-component Button variant="folio" iconOnly', view: () => <div className="flex gap-2"><Button variant="folio" iconOnly="plus" aria-label="Add" /><Button variant="folio" iconOnly="download" aria-label="Download" /></div> },
    minimal: { from: 'minimal/ui/Button.jsx icon', view: () => <div className="flex gap-1"><MButton variant="outline" icon="dices" aria-label="Re-roll colors" /><MButton icon="sidebar-expand" aria-label="Show labs" /></div> },
    kolbox: { from: 'kolbox/ui/IconButton.jsx, lit and plain', view: () => <div className="flex gap-1"><Button variant="kolbox" iconOnly="corner-radius" aria-label="Split corners" pressed/><Button variant="kolbox" iconOnly="plus" aria-label="Add"/></div> },
  } },
  { name: 'Split button', cells: {
    default: {}, float: {},
    folio: { from: 'kol-component ButtonSplit variant="folio"', view: () => <div className="flex flex-wrap items-center justify-center gap-2"><ButtonSplit variant="folio" tone="primary" items={F_SPLIT}>Export</ButtonSplit><ButtonSplit variant="folio" items={F_SPLIT}>Duplicate</ButtonSplit></div> },
    minimal: { from: 'minimal/ui/ButtonSplit.jsx', view: () => <MSplitCell /> },
    kolbox: { from: 'kolbox/ui/SplitButton.jsx', view: () => <div className="flex flex-wrap items-center justify-center gap-2"><ButtonSplit variant="kolbox" tone="primary" menuLabel="More">Export</ButtonSplit><ButtonSplit variant="kolbox" tone="secondary" menuLabel="More">Duplicate</ButtonSplit></div> },
  } },
  { name: 'Icon group', cells: {
    default: { from: 'kol-component ButtonGroup layout="joined" variant="filled", stateless', view: () => <KIconGroup /> },
    float: { from: 'kol-component ButtonGroup layout="joined" variant="float", stateless', view: () => <KIconGroup float /> },
    folio: { from: 'kol-component ButtonGroup layout="joined" variant="folio", stateless', view: () => <ButtonGroup layout="joined" variant="folio" ariaLabel="Transform" options={TRANSFORM.map(({ icon, ariaLabel }) => ({ icon, ariaLabel }))} /> },
    minimal: { near: 'Toolbar sets icon Buttons in a row (see Toolbar)' },
    kolbox: { from: 'kolbox/ui/IconGroup.jsx', view: () => <ButtonGroup layout="joined" variant="kolbox" className="w-24" options={[{ icon: 'rotate-left', ariaLabel: 'Rotate' }, { icon: 'flip-horizontal', ariaLabel: 'Flip horizontal', pressed: true }, { icon: 'flip-vertical', ariaLabel: 'Flip vertical' }]}/> },
  } },
  { name: 'Text input', cells: {
    default: { from: 'kol-component Input', view: () => <div className="w-56"><Input placeholder="Scene name" aria-label="Scene name" width="100%" /></div> },
    float: { from: 'kol-component Input variant="float"', view: () => <Plate className="w-60"><Input variant="float" placeholder="Scene name" aria-label="Scene name" width="100%" /></Plate> },
    folio: { from: 'kol-component Input variant="folio"', view: () => <div className="w-56"><Input variant="folio" placeholder="Scene name" aria-label="Scene name" className="w-full" /></div> },
    minimal: { from: 'minimal/ui/Input.jsx', view: () => <div className="flex w-56"><MInput placeholder="Scene name" aria-label="Scene name" /></div> },
    kolbox: { from: 'kolbox/ui/Input.jsx', view: () => <div className="flex w-56"><Input variant="kolbox" placeholder="Scene name" aria-label="Scene name" className="flex-1" /></div> },
  } },
  { name: 'Number input', cells: {
    default: { from: 'kol-component QuantityInput', view: () => <KQty /> },
    float: { from: 'kol-component QuantityInput variant="float"', view: () => <KQty float /> },
    folio: { from: 'kol-component QuantityInput variant="folio"', view: () => <FStepper /> },
    minimal: { from: 'minimal/ui/InputNumber.jsx', view: () => <MInputNumberCell /> },
    kolbox: { near: 'Input with a lead letter (X 120) holds a number as text; the field Slider has its own number box' },
  } },
  { name: 'Slider', cells: {
    default: { from: 'kol-component Slider', view: () => <KSlider /> },
    float: { from: 'kol-component Slider variant="float"', view: () => <KSlider float /> },
    folio: { from: 'kol-component Slider variant="folio"', view: () => <FSliderCell /> },
    minimal: { from: 'minimal/ui/Slider.jsx', view: () => <MSliderCell /> },
    kolbox: { from: 'kolbox/ui/Slider.jsx variant plain, field', view: () => <XSliderCell /> },
  } },
  { name: 'Select', cells: {
    default: { from: 'kol-component Dropdown', view: () => <KDropdown /> },
    float: { from: 'kol-component Dropdown variant="float"', view: () => <KDropdown float /> },
    folio: { from: 'kol-component Dropdown variant="folio"', view: () => <FChoice /> },
    minimal: { from: 'minimal/ui/Select.jsx', view: () => <MSelectCell /> },
    kolbox: { from: 'kolbox/ui/Dropdown.jsx', view: () => <XDropdownCell /> },
  } },
  { name: 'Tabs', cells: {
    default: { from: 'kol-component ButtonGroup layout="joined"', view: () => <KTabs /> },
    float: { from: 'kol-component ButtonGroup layout="joined" variant="float"', view: () => <KTabs float /> },
    folio: { from: 'kol-component ButtonGroup layout="joined" variant="folio"', view: () => <FSeg /> },
    minimal: { from: 'minimal/ui/Segmented.jsx', view: () => <MTabsCell /> },
    kolbox: { from: 'kolbox/ui/Tabs.jsx', view: () => <XTabsCell /> },
  } },
  { name: 'Toggle', cells: {
    default: { from: 'kol-component ToggleSwitch', view: () => <KSwitch /> },
    float: { from: 'kol-component ToggleSwitch variant="float"', view: () => <KSwitch float /> },
    folio: { from: 'kol-component ToggleSwitch variant="folio"', view: () => <FSwitchCell /> },
    minimal: { from: 'minimal/ui/Toggle.jsx', view: () => <MToggleCell /> },
    kolbox: { from: 'kol-component ToggleSwitch variant="kolbox"', view: () => <XToggleCell /> },
  } },
  { name: 'Checkbox', cells: {
    default: { from: 'kol-component ToggleCheckbox', view: () => <KCheck /> },
    float: { from: 'kol-component ToggleCheckbox variant="float"', view: () => <KCheck float /> },
    folio: { from: 'folio/parts.jsx Check', view: () => <FCheck /> },
    minimal: {},
    kolbox: { from: 'kol-component ToggleCheckbox variant="kolbox"', view: () => <XCheckCell /> },
  } },
  { name: 'Color field', cells: {
    default: { from: 'kol-component ColorField', view: () => <div className="w-60"><ColorField label="Background" value="#121215" /></div> },
    float: { from: 'kol-component ColorField (one look, no variant)', view: () => <Plate className="w-64 flex-col items-stretch"><ColorField label="Background" value="#121215" /></Plate> },
    folio: { from: 'kol-component ColorSwatch variant="folio"', view: () => <ColorSwatch variant="folio" hex="#121215" aria-label="Background #121215" /> },
    minimal: { from: 'minimal/ui/InputColor.jsx', view: () => <MInputColorCell /> },
    kolbox: { from: 'kolbox/ui/FillRow.jsx, swatch and hex', view: () => <XColorFieldCell /> },
  } },
  { name: 'Fill row', cells: {
    default: { near: 'ColorField is the swatch and hex alone (see Color field)' },
    float: { near: 'ColorField is the swatch and hex alone (see Color field)' },
    folio: { from: 'kol-component ColorInputRow variant="folio", its picker ColorPickerPopover variant="folio"', view: () => <FFillCell /> },
    minimal: { near: 'InputColor is the swatch and hex alone (see Color field)' },
    kolbox: { from: 'kolbox/ui/FillRow.jsx with opacity and actions', view: () => <XFillCell /> },
  } },
  { name: 'Color picker', cells: {
    default: { from: 'kol-component SpectrumControls, AlphaStrip', view: () => <KPicker /> },
    float: { from: 'kol-component SpectrumControls, AlphaStrip (one look, no variant)', view: () => <KPicker float /> },
    folio: { from: 'kol-component SwatchGrid variant="folio", ColorSwatch variant="folio"', view: () => <FSwatches /> },
    minimal: { from: 'minimal/ui/ColorSpectrum.jsx SBSquare, HueStrip', view: () => <MPickerCell /> },
    kolbox: { from: 'kolbox/ui ColorField, HueSlider, OpacitySlider, SwatchGrid', view: () => <XPickerCell /> },
  } },
  { name: 'Color popover', cells: {
    default: { from: 'kol-component ColorPickerPopover', view: () => <KColorPopover /> },
    float: { from: 'kol-component ColorPickerPopover (one look, no variant)', view: () => <KColorPopover float /> },
    folio: { from: 'kol-component ColorPickerPopover variant="folio"', view: () => <FSwatchMenuCell /> },
    minimal: { near: 'InputColor’s swatch opens the platform’s own picker' },
    kolbox: { from: 'kolbox/ui/PopoverColor.jsx, from FillRow’s swatch', view: () => <XPopoverCell /> },
  } },
  { name: 'Field row', cells: {
    default: { from: 'kol-component LabeledControl horizontal', view: () => <KFieldRow /> },
    float: { from: 'kol-component LabeledControl variant="float" horizontal', view: () => <KFieldRow float /> },
    folio: { from: 'kol-component LabeledControl variant="folio" horizontal, EditorChrome.jsx Input', view: () => <FFieldRowCell /> },
    minimal: { from: 'minimal/ui/FieldRow.jsx', view: () => <MFieldRowCell /> },
    kolbox: { from: 'kol-component LabeledControl variant="kolbox"', view: () => <XFieldRowCell /> },
  } },
  { name: 'Property row', cells: {
    default: { from: 'kol-component FieldPair', view: () => <KPair /> },
    float: { from: 'kol-component FieldPair variant="float"', view: () => <KPair float /> },
    folio: { from: 'kol-component FieldPair variant="folio"', view: () => <FPairCell /> },
    minimal: {},
    kolbox: { from: 'kol-component FieldPair variant="kolbox"', view: () => <div className="w-56"><FieldPair variant="kolbox" first={<Input variant="kolbox" prefix="X" aria-label="X" defaultValue="120" className="flex-1" />} second={<Input variant="kolbox" prefix="Y" aria-label="Y" defaultValue="516" className="flex-1" />} /></div> },
  } },
  { name: 'Section', cells: {
    default: { from: 'kol-component LabeledControlSection', view: () => <KSection /> },
    float: { from: 'kol-component LabeledControlSection variant="float"', view: () => <KSection float /> },
    folio: { from: 'kol-component LabeledControlSection variant="folio", LabeledControl variant="folio", ToggleSwitch variant="folio", Slider variant="folio"', view: () => <FSectionCell /> },
    minimal: { from: 'minimal/ui/Section.jsx', wide: true, view: () => <MSectionCell /> },
    kolbox: { from: 'kolbox/ui/RailSection.jsx', view: () => <XSectionCell /> },
  } },
  { name: 'Sidebar item', cells: {
    default: { from: 'kol-component NavRail variant="site"', view: () => <KSiteNav /> },
    float: { from: 'kol-component TreeRow', view: () => <KTree /> },
    folio: { from: 'folio/EditorChrome.jsx LibraryTree on kol-component Rail, TreeRow variant="folio"', view: () => <FTree /> },
    minimal: { from: 'minimal/ui/NavRail.jsx NavRailRow', view: () => <MSidebarCell /> },
    kolbox: { from: 'kolbox/ui/ListRow.jsx tree', view: () => <XSidebarCell /> },
  } },
  { name: 'Rail', cells: {
    default: { from: 'kol-component Rail mode="push"', view: () => <KRail /> },
    float: { from: 'kol-component RailFloat', view: () => <KRailFloat /> },
    folio: { from: 'kol-component Rail variant="folio"', view: () => <FRailCell /> },
    minimal: { from: 'minimal/ui/Panel.jsx', wide: true, view: () => <MPanelCell /> },
    kolbox: { from: 'kolbox/ui/RightRail.jsx on Rail', view: () => <XRailCell /> },
  } },
  { name: 'Toolbar', cells: {
    default: { near: 'ButtonGroup sets buttons in a row; ToolRail is float only' },
    float: { from: 'kol-shell ToolRail orientation="horizontal"', view: () => <KToolRail /> },
    folio: { from: 'kol-shell ToolRail variant="folio", kol-component Button variant="folio"', wide: true, view: () => <ToolRail variant="folio"><Button variant="folio" iconLeft="image">Image</Button><Button variant="folio" iconLeft="download">Export</Button><Button variant="folio" iconLeft="search" pressed>Find</Button></ToolRail> },
    minimal: { from: 'minimal/ui/Toolbar.jsx', view: () => <MToolbar><MButton icon="plus" aria-label="Add" /><MToolbarDivider /><MButton>Save</MButton><MButton variant="filled">Export PNG</MButton></MToolbar> },
    kolbox: { from: 'kolbox/ui/ToolDock.jsx', view: () => <XToolbarCell /> },
  } },
  { name: 'Transport', cells: {
    default: { near: 'AppFloatNav variant="transport" is the float pill (see Float)' },
    float: { from: 'kol-shell AppFloatNav variant="transport"', view: () => <KTransportFloat /> },
    folio: { from: 'kol-shell AppFloatNav variant="folio" transport', view: () => <FTransportCell /> },
    minimal: { near: 'labs/ToolbarDock.jsx sets the transport from Toolbar and Button, bound to the engine' },
    kolbox: { from: 'kolbox/ui/ToolbarTransport.jsx', view: () => <XTransportCell /> },
  } },
  { name: 'Timeline', cells: {
    default: { from: 'kol-component TimelineDock', view: () => <KTimeline /> },
    float: { near: 'TimelineRail ships in design-editor/core, not kol-component; apps/float draws it from there' },
    folio: { from: 'kol-component TimelineDock variant="folio"', view: () => <FTimelineCell /> },
    minimal: {},
    kolbox: { from: 'kolbox/ui/MotionTimeline.jsx', view: () => <XTimelineCell /> },
  } },
  { name: 'Menu', cells: {
    default: { from: 'kol-component Menu, MenuTrigger', view: () => <KMenu /> },
    float: { from: 'kol-component Menu variant="float"', view: () => <KMenu float /> },
    folio: { from: 'kol-shell MenuBar variant="folio", its lists Menu variant="folio"', wide: true, view: () => <MenuBar variant="folio" menus={folioMenus(FOLIO_MENUS)} /> },
    minimal: { from: 'minimal/ui/Menu.jsx MenuButton, MenuRow', view: () => <MMenuButton label="Layer"><MMenuRow>Duplicate</MMenuRow><MMenuRow>Group</MMenuRow><MMenuDivider /><MMenuRow>Remove</MMenuRow></MMenuButton> },
    kolbox: { from: 'kolbox/ui/Menu.jsx, from a Button', view: () => <XMenuCell /> },
  } },
  { name: 'Modal', cells: {
    default: { from: 'kol-component ModalDialog', view: () => <KModal /> },
    float: { from: 'kol-component ModalDialog variant="float"', view: () => <KModal float /> },
    folio: { from: 'kol-component CommandOverlay variant="folio" mode="commands"', view: () => <FModal /> },
    minimal: {},
    kolbox: { from: 'kolbox/ui/Modal.jsx, from a Button', view: () => <XModalCell /> },
  } },
  { name: 'Tooltip', cells: {
    default: { from: 'kol-component Tooltip', view: () => <KTooltip /> },
    float: { from: 'kol-component Tooltip variant="float"', view: () => <KTooltip float /> },
    folio: { from: 'kol-component Tooltip variant="folio"', view: () => <Tooltip variant="folio" label="Export video"><Button variant="folio" iconOnly="download" aria-label="Export" /></Tooltip> },
    minimal: {},
    kolbox: { from: 'kolbox/ui/Tooltip.jsx', view: () => <Tooltip variant="kolbox" label="Export video"><Button variant="kolbox" iconOnly="download" aria-label="Export"/></Tooltip> },
  } },
  { name: 'Type sample', cells: {
    default: { from: 'kol-sans-heading-05, kol-sans-body-02, kol-helper-10', view: () => <TypeSample h="kol-sans-heading-05" b="kol-sans-body-02 text-fg-64" l="kol-helper-10 text-fg-48" /> },
    float: { from: 'kol-float-section, kol-float-body, kol-float-label', view: () => <TypeSample h="kol-float-section" b="kol-float-body text-fg-64" l="kol-float-label text-fg-48" /> },
    folio: { from: 'kol-folio-section, kol-folio-body, kol-folio-label', view: () => <TypeSample h="kol-folio-section" b="kol-folio-body" l="kol-folio-label text-folio-muted" /> },
    minimal: { from: 'minimal text-nav, text-label, text-caps', view: () => <TypeSample h="text-nav font-medium" b="text-label text-muted" l="text-caps text-faint" /> },
    kolbox: { from: 'kolbox text-title, text-help, font-mono text-meta', view: () => <TypeSample h="text-title" b="text-help text-text" l="font-mono text-meta text-muted" /> },
  } },
  /* parts only one style has */
  { name: 'Find bar', cells: {
    default: {}, float: {},
    folio: { from: 'kol-component FindBar variant="folio"', wide: true, view: () => <FFind /> },
    minimal: {}, kolbox: {},
  } },
  { name: 'Language toggle', cells: {
    default: {}, float: {},
    folio: { from: 'folio/Chrome.jsx LangToggle', view: () => <FLang /> },
    minimal: {}, kolbox: {},
  } },
]
