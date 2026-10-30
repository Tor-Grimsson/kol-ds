import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppHub, PageShell } from '@kolkrabbi/kol-shell'
import { SiteLayout } from '@kolkrabbi/kol-framework'
import { ActionButton, Button, Divider, Dropdown, PageHeader, Rail, RailActions, RailHeader, RailHint, RailNav, RailRow, RailSection, SettingsFooter, SettingsPanel, SettingsSections, Table, TabsRow, useRailKey, VariantsControl } from '@kolkrabbi/kol-component'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'

/* THE RAILS REFERENCE — every rail on one frame (RailRoles, user 2026-10-25: *"this rails is for all rails, I want to see
 * a regular left navrail then I want P , H all to work on shortcuts, I want all to open on top of each other if you
 * want, the action menu just chooses variant like app or site rail"*). Built the way studio-hub is: `AppHub` with the
 * left nav rail, two pages (Stage, Rack — monitor's), the Hub's own settings rail on `,`, the Dev row; on each page the
 * patch rail on P, the page's settings rail on H (the settings rail's shape, the page's rows) and the bottom rail on E — `Rail role` each, their keys from
 * `useRailKey`, stacking in the order they open (Escape closes the top one). The Variants button (top right, catalog's)
 * carries ONE axis, Rail: app · site — apps/shell's switch: site swaps the frame for kol-framework's `SiteLayout`
 * with the site rail on the same pages, and the settings rail at the site tier. Nothing here is a redraw: the settings
 * rail is `SettingsPanel`, the content is the kit. Dark by default, served with --host so a phone on the LAN opens it. */

const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'
const cap = (v) => v[0].toUpperCase() + v.slice(1)
const opts = (xs) => xs.map((v) => ({ value: v.toLowerCase().replace(/\s+/g, '-'), label: v }))

const APP = {
  name: 'Rails',
  subtitle: 'Every rail on one frame',
  logomark,
  defaultTheme: 'dark',
  about: 'The reference for the rails every tool has: the nav rail on the left, the settings rail on comma, and on each page the patch rail on P, the page settings on H and the bottom rail on E. The pages are placeholders; the rails are the product.',
  links: [{ label: 'Design system', url: 'https://ui.kolkrabbi.io' }],
  /* no `docs`: a fourth tab wraps the settings rail's tab row at the app tier's 320 (round 18 should know) */
}

const PAGES = [
  { icon: 'nav-rack', path: '/stage', label: 'Stage' },
  { icon: 'desktop', path: '/rack', label: 'Rack' },
]
const pageOf = (path) => PAGES.find((p) => p.path === path) ?? PAGES[0]

const SHORTCUTS = [
  { section: 'Rails', items: [
    { id: 'patch', label: 'Patch table', combo: 'P' },
    { id: 'page', label: 'Page settings', combo: 'H' },
    { id: 'bottom', label: 'Bottom rail', combo: 'E' },
    { id: 'settings', label: 'Settings', combo: ',' },
  ] },
  { section: 'Navigate', items: [
    { id: 'pages', label: 'Pages', combo: '⌥ 1–9' },
    { id: 'rail', label: 'Hide rail', combo: '\\' },
    { id: 'search', label: 'Search', combo: '⌘ K' },
  ] },
  { section: 'Help', items: [{ id: 'sheet', label: 'Every shortcut', combo: 'S' }] },
]

/* ── the dummy data ── */
const TYPES = opts(['Scanline', 'Halftone', 'Grain'])
const PRESETS = opts(['Default', 'Spaced drift', 'Tight'])
const MODULES = opts(['Clock', 'LFO', 'Mixer', 'Output', 'Noise'])
const PORTS = opts(['out', 'cv', 'gate'])
const DEFAULTS = { aspect: '4:5', grid: true, autoplay: false }

/* ── the three page rails: `Rail role`, the kit inside ── */

/* PATCH (P) — monitor's patch table AS A MATRIX (his review 2026-10-25: *"are we seriously using bullets? can we not
 * show a grided way matrix?"*): the DS `Table` (simple, compact) with aligned columns — FROM · OUT · TO · IN · the
 * remove. Add a cable sits under it as two rows (From: module · port, To: module · port): four dropdowns do not fit the
 * rail's 284 content width side by side. The header is the standard one (title + ×, the Rail's hairline); the foot is
 * the rail's opt-in, here with a reset that clears the table (*"why do all rails get reset except the Patch rail? will
 * that ship with an opt in?"*). */
const CABLE_ROWS = [['Clock', 'out', 'LFO', 'cv'], ['LFO', 'out', 'Mixer', 'cv'], ['Noise', 'out', 'Mixer', 'gate'], ['Mixer', 'out', 'Output', 'cv']]
const CABLE_COLUMNS = [
  { accessor: 'from', header: 'From' },
  { accessor: 'out', header: 'Out' },
  { accessor: 'to', header: 'To' },
  { accessor: 'in', header: 'In' },
  { accessor: 'remove', header: '', className: 'w-8' },
]
function PatchRail({ open, onClose, tier }) {
  const [cables, setCables] = useState(CABLE_ROWS)
  const [add, setAdd] = useState({ from: 'clock', fromPort: 'out', to: 'lfo', toPort: 'cv' })
  const pick = (k) => (v) => setAdd((a) => ({ ...a, [k]: v }))
  const rows = cables.map(([from, out, to, into], i) => ({ id: `${from}-${out}-${to}-${into}-${i}`, from, out, to, in: into, remove: <ActionButton chrome="inline" size="sm" icon="x" confirmIcon="x" label={`Remove ${from} ${out} to ${to} ${into}`} onAction={() => setCables((cs) => cs.filter((_, j) => j !== i))} /> }))
  return (
    <Rail role="patch" open={open} onClose={onClose} variant={tier} header={<RailHeader title="Patch table" />} footer={<SettingsFooter onReset={() => setCables([])} />}>
      <div className="flex flex-col gap-6">
        {/* two sections, each under its eyebrow, a divider between (his review 2026-10-25: *"put 'PATCH MATRIX' above
          * table? seperate the two by divider?"*) */}
        <RailSection label="Patch matrix">
          {cables.length === 0 ? <RailHint>No cables.</RailHint> : <Table variant="simple" compact width="column" columns={CABLE_COLUMNS} rows={rows} className="w-full" />}
        </RailSection>
        <Divider />
        <RailSection label="Add a cable">
          <RailRow label="From" align="fill" labelWidth="auto">
            <div className="flex w-full gap-2">
              <Dropdown size="sm" className="flex-1 min-w-0" options={MODULES} value={add.from} onChange={pick('from')} ariaLabel="From module" />
              <Dropdown size="sm" className="w-24" options={PORTS} value={add.fromPort} onChange={pick('fromPort')} ariaLabel="From port" />
            </div>
          </RailRow>
          <RailRow label="To" align="fill" labelWidth="auto">
            <div className="flex w-full gap-2">
              <Dropdown size="sm" className="flex-1 min-w-0" options={MODULES} value={add.to} onChange={pick('to')} ariaLabel="To module" />
              <Dropdown size="sm" className="w-24" options={PORTS} value={add.toPort} onChange={pick('toPort')} ariaLabel="To port" />
            </div>
          </RailRow>
          {/* air between the rows and the button (*"also space between button and from/to"*) */}
          <RailActions className="mt-2">
            <Button size="sm" onClick={() => setCables((cs) => [...cs, [cap(add.from), add.fromPort, cap(add.to), add.toPort]])}>Add cable</Button>
          </RailActions>
        </RailSection>
      </div>
    </Rail>
  )
}

/* PAGE (H) — the page's own settings, THE SETTINGS RAIL'S SHAPE WITHOUT THE SCRIM (his review 2026-10-25: *"why is H
 * same as labs siderail and not the same as settings?"* · *"H does not include dark overlay, that is only settings"*):
 * `SettingsPanel variant="rail" role="page"`, typed rows, reset in the foot, titled with the page. When the page has
 * more than one set it takes the settings rail's tab row (*"this would get its own tab in H?"* — yes): the Stage's H is
 * Stage (monitor's parameter panel — the sliders as `type: 'slider'` rows) and Marks (its Mark parameters, switches
 * grouped by module). The Rack's H is plain rows. */
const STAGE_PARAMS = [['cells', 'Cells', 0, 64, 0], ['angle', 'Angle', 0, 360, 180], ['scale', 'Scale', 0, 200, 0], ['repeat', 'Repeat', 0, 100, 45], ['speed', 'Speed', 0, 100, 50]]
const MARKS = [
  ['Gen Hifi', ['p1', 'p2', 'p3', 'p4', 'spd', 'amp', 'dty', 'ofs']],
  ['Dither', ['spd', 'size', 'gap', 'scl', 'ctr', 'ang', 'int', 'blur']],
  ['Magneto', ['dryCV', 'spdCV', 'recCV', 'rptCV', 'sclCV', 'ofsCV', 'sprng', 'cutCV', 'wowCV']],
]
const MARKS_ON = new Set(['Dither size', 'Dither scl', 'Dither ang', 'Magneto spdCV', 'Magneto rptCV'])
function PageRail({ open, onClose, tier, title }) {
  const stage = title === 'Stage'
  const [tab, setTab] = useState('stage')
  const PARAM_RESET = Object.fromEntries(STAGE_PARAMS.map(([k, , , , v]) => [k, v]))
  const [params, setParams] = useState(PARAM_RESET)
  const [marks, setMarks] = useState(MARKS_ON)
  const RACK_RESET = { type: 'scanline', preset: 'default', loop: true, mirror: false }
  const [src, setSrc] = useState(RACK_RESET)
  const set = (k) => (v) => setSrc((s) => ({ ...s, [k]: v }))
  const reset = () => { setParams(PARAM_RESET); setMarks(MARKS_ON); setSrc(RACK_RESET) }
  const stageSections = tab === 'stage'
    ? [{ label: 'Parameters', rows: STAGE_PARAMS.map(([k, label, min, max]) => ({ label, type: 'slider', min, max, step: 1, value: params[k], onChange: (v) => setParams((p) => ({ ...p, [k]: v })) })) }]
    : MARKS.map(([mod, keys]) => ({ label: mod, rows: keys.map((k) => ({ label: k, type: 'switch', on: marks.has(`${mod} ${k}`), onChange: (on) => setMarks((m) => { const n = new Set(m); if (on) n.add(`${mod} ${k}`); else n.delete(`${mod} ${k}`); return n }) })) }))
  const rackSections = [
    { label: 'Source', rows: [
      { label: 'Type', type: 'choice', options: TYPES, value: src.type, onChange: set('type') },
      { label: 'Preset', type: 'choice', options: PRESETS, value: src.preset, onChange: set('preset') },
    ] },
    { label: 'Motion', rows: [
      { label: 'Loop', type: 'switch', on: src.loop, onChange: set('loop') },
      { label: 'Mirror', type: 'switch', on: src.mirror, onChange: set('mirror') },
    ] },
  ]
  return (
    <SettingsPanel open={open} onClose={onClose} variant="rail" tier={tier} role="page" title={title} footer={<SettingsFooter onReset={reset} />}>
      {/* the settings rail's tab row, prop for prop (AppHub.jsx: `variant="text" size={12} tracked`) — never a second style */}
      {stage && <TabsRow variant="text" size={12} tracked overflow="wrap" className="gap-x-6" tabs={[{ value: 'stage', label: 'Stage' }, { value: 'marks', label: 'Marks' }]} value={tab} onChange={setTab} ariaLabel="Page tabs" />}
      <SettingsSections divided sections={stage ? stageSections : rackSections} />
    </SettingsPanel>
  )
}

/* BOTTOM (E) — monitor's Workbench, OVER the nav rail (his review 2026-10-25: *"it should OVERLAY the navrail … because
 * then we can use same icon system as collapsed siderail … just icons for Edit Rack and library, like a siderail in the
 * bottom rail"*): the rail runs the full width; `RailNav` — the collapsed nav rail's 48 icon column — stands at its
 * edge under the nav rail with the views as glyphs, and the header (title + ×, as every rail's — *"why do you think
 * header should follow different rule on bottomrail"*), the content and the foot sit beside it at the rail's inset. The content is the kit: the Case rows as a `Table`, Parked as a hint. Resizable from its top edge, no
 * scrim. */
const CASE_ROWS = [['Row 1', '1U', '104hp'], ['Row 2', '3U', '96hp'], ['Row 3', '3U', '98hp'], ['Row 4', '3U', '94hp'], ['Row 5', '1U', '88hp']]
const VIEWS = [{ id: 'edit', label: 'Edit', icon: 'edit' }, { id: 'rack', label: 'Rack', icon: 'nav-rack' }, { id: 'library', label: 'Library', icon: 'nav-library' }]
function BottomRail({ open, onClose, tier }) {
  const [tab, setTab] = useState('edit')
  const [rows, setRows] = useState(CASE_ROWS)
  const view = VIEWS.find((v) => v.id === tab)
  const columns = [{ accessor: 'name', header: 'Row' }, { accessor: 'u', header: 'Height' }, { accessor: 'hp', header: 'Width' }, { accessor: 'remove', header: '', className: 'w-8' }]
  const caseRows = rows.map(([name, u, hp]) => ({ id: name, name, u, hp, remove: <ActionButton chrome="inline" size="sm" icon="x" confirmIcon="x" label={`Remove ${name}`} onAction={() => setRows((rs) => rs.filter((r) => r[0] !== name))} /> }))
  return (
    <Rail role="bottom" open={open} onClose={onClose} variant={tier} nav={<RailNav items={VIEWS} value={tab} onChange={setTab} />} header={<RailHeader title={view.label} />}>
      {tab === 'edit' ? (
        <div className="grid min-w-0 grid-cols-1 gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <RailSection label="Case">
            <Table variant="simple" compact width="column" columns={columns} rows={caseRows} className="w-full" />
            <div className="flex items-center gap-2">
              <Button size="sm" tone="grey" onClick={() => setRows((rs) => [...rs, [`Row ${rs.length + 1}`, '1U', '104hp']])}>Add 1U row</Button>
              <Button size="sm" tone="grey" onClick={() => setRows((rs) => [...rs, [`Row ${rs.length + 1}`, '3U', '104hp']])}>Add 3U row</Button>
            </div>
          </RailSection>
          <RailSection label="Parked">
            <RailHint>Nothing parked. A module sent to the bench waits here until it returns to the rack.</RailHint>
          </RailSection>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center kol-mono-12 text-meta">{view.label} — the view fills the height</div>
      )}
    </Rail>
  )
}

/* the page — the tool frame, its title, a dashed stage where the rack runs; the three rails open from the keys, and from
 * these buttons where there are no keys (a phone) */
function Page({ label, open, toggle }) {
  const rows = [['patch', 'Patch table', 'P'], ['page', 'Page settings', 'H'], ['bottom', 'Bottom rail', 'E']]
  return (
    <PageShell mode="fixed" className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader title={label.toUpperCase()} />
      <div className="flex flex-wrap gap-2">
        {rows.map(([id, text, key]) => (
          <Button key={id} size="sm" tone="grey" pressed={open[id]} onClick={() => toggle(id)}>{text}<span className="ml-2 opacity-50">{key}</span></Button>
        ))}
      </div>
      <div className="flex-1 min-h-0 rounded border border-dashed border-oq-12" />
    </PageShell>
  )
}

/* the rails a page wears, with their keys — the same set under either nav rail */
function useRails() {
  const [open, setOpen] = useState({ patch: false, page: false, bottom: false, settings: false })
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }))
  const close = (k) => () => setOpen((o) => ({ ...o, [k]: false }))
  useRailKey('patch', () => toggle('patch'))
  useRailKey('page', () => toggle('page'))
  useRailKey('bottom', () => toggle('bottom'))
  return { open, toggle, close }
}

function PageRails({ open, close, tier, label }) {
  return (
    <>
      <PatchRail open={open.patch} onClose={close('patch')} tier={tier} />
      <PageRail open={open.page} onClose={close('page')} tier={tier} title={label} />
      <BottomRail open={open.bottom} onClose={close('bottom')} tier={tier} />
    </>
  )
}

/* catalog's Variants button, one axis: Rail */
const RAIL_KEY = 'rails:rail'
const loadRail = () => { try { return localStorage.getItem(RAIL_KEY) === 'site' ? 'site' : 'app' } catch { return 'app' } }

/* ── the app rail: AppHub on the hash, studio-hub's frame ── */
function AppFrame() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (p) => { location.hash = encodeURI(p) }
  const [prefs, setPrefs] = useState(DEFAULTS)
  const set = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }))
  const { open, toggle, close } = useRails()
  const page = pageOf(path)
  return (
    <>
      <AppHub
        app={APP}
        items={PAGES}
        currentPath={path}
        onNavigate={navigate}
        shortcuts={SHORTCUTS}
        /* the Hub's Dev row, on every rail on a dev server even with nothing in it (user 2026-10-24) */
        dev={{ tabs: [] }}
        /* THE ROWS ARE TYPED DATA: the Hub draws the settings rail — `,` is its key */
        settings={{
          sections: [
            { label: 'Defaults', rows: [
              { label: 'Default aspect', type: 'choice', options: ['1:1', '4:5', '16:9'].map((v) => ({ value: v, label: v })), value: prefs.aspect, onChange: set('aspect') },
              { label: 'Show grid', type: 'switch', on: prefs.grid, onChange: set('grid') },
            ] },
            { label: 'Transport', rows: [{ label: 'Autoplay', type: 'switch', on: prefs.autoplay, onChange: set('autoplay') }] },
          ],
          tone: 'secondary',
          themeIn: 'drawer',
          drawer: { onReset: () => setPrefs(DEFAULTS) },
        }}
      >
        <Page label={page.label} open={open} toggle={toggle} />
      </AppHub>
      <PageRails open={open} close={close} label={page.label} />
    </>
  )
}

/* ── the site rail: SiteLayout on the same hash routes, the settings rail at the site tier ── */
const TREE = PAGES.map((p) => ({ id: p.path.slice(1), label: p.label, icon: p.icon, to: p.path }))
function SitePage({ open, toggle }) {
  const { pathname } = useLocation()
  return <Page label={pageOf(pathname).label} open={open} toggle={toggle} />
}
function SiteFrame() {
  const [prefs, setPrefs] = useState(DEFAULTS)
  const set = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }))
  const { open, toggle, close } = useRails()
  /* the settings rail's key is the Hub's on the app frame; here the frame has no Hub, so the role's key is bound the same way */
  useRailKey('settings', () => toggle('settings'))
  const bottom = [{ id: 'settings', label: 'Settings', icon: 'nav-settings', onSelect: () => toggle('settings'), active: open.settings }]
  const label = pageOf(parse()).label
  return (
    <>
      <HashRouter>
        <Routes>
          <Route element={<SiteLayout navTree={TREE} sideNav={{ bottomItems: bottom }} pageWash="var(--kol-fg-02)" />}>
            {PAGES.map((p) => <Route key={p.path} path={p.path} element={<SitePage open={open} toggle={toggle} />} />)}
            <Route path="*" element={<Navigate to="/stage" replace />} />
          </Route>
        </Routes>
      </HashRouter>
      <PageRails open={open} close={close} tier="site" label={label} />
      <SettingsPanel open={open.settings} onClose={close('settings')} variant="rail" tier="site" title="Settings" footer={<SettingsFooter onReset={() => setPrefs(DEFAULTS)} />}>
        <SettingsSections divided sections={[
          { label: 'Defaults', rows: [
            { label: 'Default aspect', type: 'choice', options: ['1:1', '4:5', '16:9'].map((v) => ({ value: v, label: v })), value: prefs.aspect, onChange: set('aspect') },
            { label: 'Show grid', type: 'switch', on: prefs.grid, onChange: set('grid') },
          ] },
          { label: 'Transport', rows: [{ label: 'Autoplay', type: 'switch', on: prefs.autoplay, onChange: set('autoplay') }] },
        ]} />
      </SettingsPanel>
    </>
  )
}

export default function App() {
  const [rail, setRailState] = useState(loadRail)
  const setRail = (v) => { setRailState(v); try { localStorage.setItem(RAIL_KEY, v) } catch { /* storage blocked */ } }
  return (
    <>
      {rail === 'site' ? <SiteFrame /> : <AppFrame />}
      <VariantsControl axes={[{ key: 'rail', label: 'Rail', values: ['app', 'site'] }]} value={{ rail }} onChange={(_, v) => setRail(v)} />
    </>
  )
}
