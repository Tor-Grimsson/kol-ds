import { Button, Input, SegmentedToggle, TabsRow, Tooltip, floatSurfaceClass } from '@kolkrabbi/kol-component'
import { AccountForm, AppFloatNav } from '@kolkrabbi/kol-shell'

/* THE APPFLOATNAV BOARD (FloatingStyleAndSignInDemos § 5 — *"DS should consider hosting such a page on showcase"*; round 3's
 * values, W16 2026-10-31). Every variant on every surface over a busy ground, then the float controls on each surface.
 * The nav is fixed to the viewport; each frame is transformed, so it is the nav's containing block and the nav sits in it. */

export const stage = 'full'

const SURFACES = ['solid', 'glass-dark', 'glass-light']

/* fxr's rows on the board, as data */
const NAV = [
  { id: 'editor', icon: 'desktop', label: 'Editor' },
  { id: 'labs', icon: 'globe', label: 'Labs' },
  { id: 'randomiser', icon: 'refresh', label: 'Randomiser', sub: [{ label: 'Generate', icon: 'shuffle' }, { label: 'Effects', icon: 'layers' }] },
  { id: 'morph', icon: 'swap', label: 'Morph' },
]
const MORE = [
  { path: '#library', icon: 'nav-library', label: 'Library' },
  { path: '#new', icon: 'plus', label: 'New File' },
  { path: '#signin', icon: 'user', label: 'Sign in' },
  { path: '#settings', icon: 'nav-settings', label: 'Settings' },
]
const PANEL = [
  { id: 'home', icon: 'nav-home', label: 'Home', onPress: () => {} },
  { id: 'catalog', icon: 'nav-library', label: 'Catalog', onPress: () => {} },
  { id: 'params', icon: 'slider-01', label: 'Params', onPress: () => {}, selected: true },
  { id: 'transport', icon: 'play', label: 'Transport', onPress: () => {} },
]
const TRANSPORT = [
  { id: 'play', icon: 'play', label: 'Play', selected: true },
  { id: 'pause', icon: 'pause', label: 'Pause' },
  { id: 'loop', icon: 'repeat', label: 'Loop length' },
  { id: 'stop', icon: 'stop', label: 'Stop' },
  { id: 'rewind', icon: 'rewind', label: 'Rewind' },
]

const SHAPES = {
  mobile: (surface) => <AppFloatNav variant="mobile" shape="pill" surface={surface} items={NAV} sheetItems={MORE} currentPath="labs" onNavigate={() => {}} />,
  dock: (surface) => <AppFloatNav variant="dock" shape="pill" shadow surface={surface} items={NAV} sheetItems={MORE} currentPath="labs" onNavigate={() => {}} />,
  panel: (surface) => <AppFloatNav variant="panel" shape="pill" surface={surface} items={PANEL} actions={[{ label: 'Settings', icon: 'nav-settings', onPress: () => {} }]} currentPath="#none" onNavigate={() => {}} />,
  transport: (surface) => <AppFloatNav variant="transport" surface={surface} items={TRANSPORT} timecode={{ current: '00:04:12', total: '00:12:00' }} sheetFor={{ loop: [{ label: '1 bar', checked: false, onPress: () => {} }, { label: '4 bars', checked: true, onPress: () => {} }] }} />,
  labels: (surface) => <AppFloatNav variant="mobile" shape="pill" labels surface={surface} items={NAV} sheetItems={MORE} currentPath="labs" onNavigate={() => {}} />,
}

/* a busy ground, so glass has something to work on */
const GROUND = {
  background: [
    'radial-gradient(40% 55% at 22% 70%, rgb(214 98 52 / .75), transparent 70%)',
    'radial-gradient(35% 50% at 78% 30%, rgb(70 110 220 / .7), transparent 70%)',
    'radial-gradient(30% 40% at 60% 85%, rgb(230 200 80 / .55), transparent 70%)',
    'var(--kol-surface-primary)',
  ].join(', '),
}

function Frame({ label, children, height = 280 }) {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <span className="kol-mono-12 text-meta">{label}</span>
      <div
        data-frame={label}
        className="relative w-full overflow-hidden rounded-[var(--kol-radius-sm)] [--kol-shell-rail-width:0px] [&_.kol-mobile-tabbar]:!flex"
        style={{ ...GROUND, height, transform: 'translateZ(0)' }}
      >
        <span className="absolute left-4 top-3 kol-mono-16 text-fg-48 pointer-events-none">Labs Randomiser Morph</span>
        {children}
      </div>
    </div>
  )
}

/* the float controls on one surface: buttons at each size, a field, the menu, the toggle, the tabs, the box */
function Controls({ surface }) {
  return (
    <div data-controls={surface} className="flex flex-col gap-4 rounded-[var(--kol-radius-sm)] p-5 min-w-0" style={GROUND}>
      <div className="flex flex-wrap items-center gap-3">
        {['sm', 'md', 'lg'].map((size) => (
          <Button key={size} data-size={size} variant="float" size={size}>Sign in</Button>
        ))}
        <Tooltip label="Labs" variant="float" placement="top"><Button variant="float" tone="grey" iconOnly="globe" size="md" aria-label="Labs" /></Tooltip>
      </div>
      <div className={`kol-more-sheet kol-more-sheet-float ${floatSurfaceClass(surface, true)} w-[230px]`} role="menu" aria-label="More">
        {MORE.map((r, i) => (
          <Button key={r.label} variant="nav" size="lg" iconLeft={r.icon} iconSize="var(--kol-float-ic)" aria-current={i === 2 ? 'page' : undefined} className="w-full justify-start kol-btn-float">{r.label}</Button>
        ))}
      </div>
      <SegmentedToggle variant="float" surface={surface} value="grid" onChange={() => {}} options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'columns', label: 'Columns' }]} ariaLabel="View" className="self-start" />
      <TabsRow variant="float" value="all" onChange={() => {}} tabs={[{ id: 'all', label: 'All' }, { id: 'laptops', label: 'Laptops' }, { id: 'desktops', label: 'Desktops' }]} ariaLabel="Kind" />
      <AccountForm
        variant="box"
        surface={surface}
        title="Sign in"
        fields={[{ id: 'email', placeholder: 'Email', autoComplete: 'email' }, { id: 'password', placeholder: 'Password', type: 'password', autoComplete: 'current-password' }]}
        okLabel="Sign in"
        footer={{ text: "Don't have an account?", link: 'Sign up', onPress: () => {} }}
        onSubmit={async () => {}}
      />
      <Input variant="float" size="md" placeholder="Search" aria-label="Search" className="w-full max-w-[340px]" />
    </div>
  )
}

export default function AppFloatNavPreview() {
  return (
    <div className="@container flex flex-col gap-8 w-full">
      {Object.entries(SHAPES).map(([shape, nav]) => (
        <div key={shape} className="grid gap-4 @4xl:grid-cols-3">
          {SURFACES.map((surface) => (
            <Frame key={surface} label={`${shape} · ${surface}`}>{nav(surface)}</Frame>
          ))}
        </div>
      ))}
      <div className="grid gap-4 @4xl:grid-cols-3">
        {SURFACES.map((surface) => <Controls key={surface} surface={surface} />)}
      </div>
    </div>
  )
}
