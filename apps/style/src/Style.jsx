import { Button, Input, Tooltip } from '@kolkrabbi/kol-component'
import { AppFloatNav } from '@kolkrabbi/kol-shell'

/* A BESIDE B (FloatingStyleAndSignInDemos, kol-fxr 2026-10-30 — user: *"the Floating style. and actually the current style
 * as well"*). Each row draws the shipped components twice: A as they are (today's square controls, the default), B with
 * `variant="float"` — the house word for a look. Nothing here is styled by hand; B's shapes are the variant's. */

/* fxr's rows on the Round 3 board, as data */
const NAV = [
  { id: 'editor', icon: 'desktop', label: 'Editor' },
  { id: 'labs', icon: 'globe', label: 'Labs' },
  { id: 'randomiser', icon: 'refresh', label: 'Randomiser', sub: [{ label: 'Generate', icon: 'shuffle' }, { label: 'Effects', icon: 'layers' }] },
  { id: 'morph', icon: 'swap', label: 'Morph' },
]
const MORE = [
  { path: '#library', icon: 'nav-library', label: 'Library' },
  { path: '#new', icon: 'plus', label: 'New File' },
  { path: '#walkthrough', icon: 'book-open', label: 'Walkthrough' },
  { path: '#signin', icon: 'user', label: 'Sign in' },
  { path: '#settings', icon: 'nav-settings', label: 'Settings' },
]
const ROWS = MORE.slice(1, 4)

function Row({ title, ships, children }) {
  const [a, b] = children
  return (
    <section className="flex flex-col gap-3 border-t border-fg-08 py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="kol-doc-section-title">{title}</h2>
        {ships && <code className="kol-doc-code-inline">{ships}</code>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Stage label="A">{a}</Stage>
        <Stage label="B">{b}</Stage>
      </div>
    </section>
  )
}

function Stage({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="kol-eyebrow text-meta">{label}</span>
      <div className="flex flex-wrap items-start gap-4 rounded-[var(--kol-radius-sm)] bg-surface-secondary p-4">{children}</div>
    </div>
  )
}

/* the nav is fixed to the viewport; a transformed frame is its containing block, so it can be seen in a stage */
function NavFrame({ image, children }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[var(--kol-radius-sm)] bg-surface-primary [--kol-shell-rail-width:0px] [&_.kol-mobile-tabbar]:!flex" style={{ height: 320, transform: 'translateZ(0)' }}>
      {image && <img src="/kol-images/tt-01.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />}
      {children}
    </div>
  )
}

const Buttons = ({ v }) => (
  <>
    <Button variant={v} tone="primary" size="md">Primary</Button>
    <Button variant={v} tone="inverted" size="md">Sign in</Button>
    <Button variant={v} tone="grey" size="md">Grey</Button>
    <Button variant={v} iconOnly="plus" size="md" tone="grey" aria-label="New" />
  </>
)
const Fields = ({ v }) => (
  <div className="flex flex-col gap-2 w-full max-w-[360px]">
    <Input variant={v} size="md" placeholder="Email" aria-label="Email" className="w-full" />
    <Input variant={v} size="md" type="password" placeholder="Password" aria-label="Password" className="w-full" />
  </div>
)
/* the menu rows: kol-shell's MoreRows draw these Buttons; `float` is what AppFloatNav passes */
const MenuRows = ({ v }) => ROWS.map((r) => (
  <Button key={r.label} variant="nav" size="lg" iconLeft={r.icon} iconSize={22} className={`w-full justify-start h-11 gap-3${v ? ' kol-btn-float' : ''}`}>{r.label}</Button>
))
const Tip = ({ v }) => <Tooltip label="Labs"><Button variant={v} iconOnly="globe" size="md" tone="grey" aria-label="Labs" /></Tooltip>
const nav = (props) => <AppFloatNav items={NAV} sheetItems={MORE} currentPath="#none" onNavigate={() => {}} {...props} />

export default function Style() {
  return (
    <div>
      <Row title="Button" ships="kol-component · Button">
        <Buttons />
        <Buttons v="float" />
      </Row>
      <Row title="Input" ships="kol-component · Input">
        <Fields />
        <div className="w-full max-w-[372px] rounded-3xl bg-surface-secondary p-1.5"><Fields v="float" /></div>
      </Row>
      <Row title="Menu rows" ships="kol-shell · .kol-more-sheet">
        <div className="kol-more-sheet min-w-[220px]"><MenuRows /></div>
        <div className="kol-more-sheet kol-more-sheet-float min-w-[220px]"><MenuRows v="float" /></div>
      </Row>
      <Row title="Tooltip" ships="kol-component · Tooltip">
        <Tip />
        <Tip v="float" />
      </Row>
      <Row title="Float shadow" ships="kol-theme · --kol-shadow-float">
        <NavFrame image>{nav({ variant: 'mobile', shape: 'bar' })}</NavFrame>
        <NavFrame image>{nav({ variant: 'dock', shape: 'pill', shadow: true })}</NavFrame>
      </Row>
    </div>
  )
}
