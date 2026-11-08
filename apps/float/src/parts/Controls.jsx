import { ThemeTile } from '@kolkrabbi/kol-styleguide'
import { useState } from 'react'
import {
  Badge, Button, Delta, Dropdown, Kbd, LiveDot, MenuDatePicker, Pill, ProgressBar, QuantityInput, ButtonGroup, SizeChip,
  Slider, Tag, ToggleCheckbox, ToggleSwitch, ViewToggle, floatSurfaceClass,
} from '@kolkrabbi/kol-component'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* float-set W1 — family 2, Controls (24-float-system.md § The parts, by family). Each part sits on the page's float
 * material (`floatSurfaceClass`) and links to its showcase page. Layout glue only; every part is the shipped one. */
/* reading themes for ThemeTile, on the theme's own grounds and inks (no hex) */
const READING_THEMES = [
  { id: 'night', label: 'Night', bg: 'var(--kol-surface-inverse)', ink: 'var(--kol-surface-primary)' },
  { id: 'day', label: 'Day', bg: 'var(--kol-surface-primary)', ink: 'var(--kol-fg-emphasis)' },
  { id: 'grey', label: 'Grey', bg: 'var(--kol-surface-tertiary)', ink: 'var(--kol-fg-emphasis)' },
]
const Plate = ({ surface, className = '', children }) => (
  <div className={`${floatSurfaceClass(surface, true)} flex max-w-full flex-wrap items-center gap-4 rounded-[var(--kol-float-menu-r)] p-4 ${className}`}>{children}</div>
)

const ROLES = [['inverted', 'Export video'], ['secondary', 'Duplicate'], ['ghost', 'Learn more'], ['danger', 'Delete layer']]
const WORKSPACES = [{ value: 'personal', label: 'Personal' }, { value: 'studio', label: 'Studio' }, { value: 'archive', label: 'Archive' }]
const RANGES = [[{ key: 'today', label: 'Today', kbd: 'D' }, { key: '7d', label: 'Last 7 days', kbd: 'W' }, { key: '30d', label: 'Last 30 days', kbd: 'M' }], [{ key: 'year', label: 'This year', kbd: 'Y' }]]

export default function Controls() {
  const [theme, setTheme] = useState('night')
  const [snap, setSnap] = useState(true)
  const [grid, setGrid] = useState(false)
  const [sw, setSw] = useState(true)
  const [level, setLevel] = useState(65)
  const [qty, setQty] = useState(3)
  const [ws, setWs] = useState('personal')
  const [view, setView] = useState('grid')
  const [status, setStatus] = useState('open')
  const [tag, setTag] = useState('Video')
  const [size, setSize] = useState('M')
  const [range, setRange] = useState('7d')
  return (
    <FamilyPage title="Controls" body="Buttons, chips, toggles and readouts — the float shape on its ground.">
      {(surface) => (
        <>
          <Part name="Button float (roles × states, icon-only, kbd, bare)" slug="button">
            <Plate surface={surface} className="flex-col items-start">
              {ROLES.map(([tone, label]) => (
                <div key={tone} className="flex flex-wrap items-center gap-3">
                  <Button variant="float" tone={tone}>{label}</Button>
                  <Button variant="float" tone={tone} pressed>{label}</Button>
                  <Button variant="float" tone={tone} disabled>{label}</Button>
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="float" size="sm" tone="secondary" iconOnly="plus" aria-label="Add" />
                <Button variant="float" size="md" tone="secondary" iconOnly="download" aria-label="Download" />
                <Button variant="float" size="lg" tone="secondary" iconOnly="search" aria-label="Search" />
                <Button variant="float" tone="secondary" kbd="⌘E">Export video</Button>
                <Button variant="float" tone="inverted" iconLeft="plus">New task</Button>
                <Button variant="bare" className="kol-float-panel text-fg-64 hover:text-fg-emphasis">Forgot password?</Button>
              </div>
            </Plate>
          </Part>

          <Part name="Tag" slug="tag">
            <Plate surface={surface}>
              {['Video', 'Stills', 'Audio'].map((t) => <Tag key={t} variant="float" active={tag === t} onClick={() => setTag(t)}>{t}</Tag>)}
            </Plate>
          </Part>

          <Part name="Badge" slug="badge">
            <Plate surface={surface}><Badge variant="float">3 effects</Badge><Badge variant="float">12</Badge></Plate>
          </Part>

          <Part name="Pill" slug="pill">
            <Plate surface={surface}><Pill variant="float">Reading · 42%</Pill><Pill variant="float">Draft</Pill></Plate>
          </Part>

          <Part name="ToggleSwitch" slug="toggle-switch">
            <Plate surface={surface}><ToggleSwitch variant="float" label="Autoplay" checked={sw} onChange={setSw} /></Plate>
          </Part>

          <Part name="ToggleCheckbox" slug="toggle-checkbox">
            <Plate surface={surface}>
              <ToggleCheckbox variant="float" label="Snap" checked={snap} onChange={setSnap} />
              <ToggleCheckbox variant="float" label="Grid" checked={grid} onChange={setGrid} />
            </Plate>
          </Part>

          <Part name="Slider" slug="slider">
            <Plate surface={surface} className="w-64 flex-col items-stretch">
              <Slider variant="float" label="Intensity" value={level} onChange={setLevel} readout="value" formatValue={(n) => `${Math.round(n)}%`} />
              <Slider variant="float" label="Disabled" value={40} onChange={() => {}} readout="value" formatValue={(n) => `${n}%`} disabled />
            </Plate>
          </Part>

          <Part name="QuantityInput" slug="quantity-input">
            <Plate surface={surface}><QuantityInput variant="float" value={qty} onChange={setQty} min={1} max={20} /></Plate>
          </Part>

          <Part name="Dropdown trigger" slug="dropdown">
            <Plate surface={surface}><Dropdown variant="float" size="md" options={WORKSPACES} value={ws} onChange={setWs} ariaLabel="Workspace" /></Plate>
          </Part>

          <Part name="ViewToggle" slug="view-toggle">
            <Plate surface={surface}>
              <ViewToggle variant="float" viewMode={view} onViewChange={setView} />
              <ViewToggle variant="float" viewMode="2" onViewChange={() => {}} options={['1', '2', '3'].map((n) => ({ value: n, label: n }))} />
            </Plate>
          </Part>

          <Part name="ProgressBar" slug="progress-bar">
            <Plate surface={surface} className="w-64 flex-col items-stretch"><ProgressBar variant="float" value={42} caption="Uploading · 42%" ariaLabel="Upload" /></Plate>
          </Part>

          <Part name="SegmentedToggle count" slug="segmented-toggle">
            <Plate surface={surface}>
              <ButtonGroup layout="joined" variant="float" surface={surface} value={status} onChange={setStatus} options={[{ value: 'open', label: 'Open', count: 5 }, { value: 'done', label: 'Completed', count: 12 }]} ariaLabel="Status" />
            </Plate>
          </Part>

          <Part name="Kbd" slug="kbd">
            <Plate surface={surface}><Kbd icon="command">K</Kbd><Kbd>Esc</Kbd><Kbd>↵</Kbd><Kbd size="sm">⇧E</Kbd></Plate>
          </Part>

          <Part name="Delta" slug="delta">
            <Plate surface={surface}><Delta value="19.8%" from="10,740" /><Delta value="4.2%" direction="down" from="1,204" /></Plate>
          </Part>

          <Part name="LiveDot" slug="live-dot">
            <Plate surface={surface}><LiveDot count={8} label="active visitors" /></Plate>
          </Part>

          <Part name="SizeChip" slug="size-chip">
            <Plate surface={surface}>{['S', 'M', 'B'].map((s) => <SizeChip key={s} active={size === s} onClick={() => setSize(s)}>{s}</SizeChip>)}</Plate>
          </Part>

          <Part name="ThemeTile (kol-styleguide)" slug="theme-tile">
            <Plate surface={surface}>
              {READING_THEMES.map((t) => <ThemeTile key={t.id} label={t.label} bg={t.bg} ink={t.ink} selected={theme === t.id} onClick={() => setTheme(t.id)} />)}
            </Plate>
          </Part>

          <Part name="the date chip" slug="menu-date-picker">
            <Plate surface={surface}>
              <MenuDatePicker variant="float" groups={RANGES} value={range} onChange={setRange} label={RANGES.flat().find((r) => r.key === range)?.label} />
            </Plate>
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
