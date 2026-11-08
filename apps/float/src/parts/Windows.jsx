import { useEffect, useState } from 'react'
import {
  Button, Dialog, Dropdown, EmptyState, Input, LabeledControl, MediaLibrary, ModalProvider, NavDrawer, NoticeBanner,
  QuickLookFrame, QuickLookHeader, SummaryLine, TabsRow, ToggleSwitch, useModal,
  SettingsGroup, SettingsGrid, SettingsCell, SettingsSlider, SettingsRange, SettingsSelect, SettingsSegmented, SettingsToggle, SettingsText,
  SettingsPoint, SettingsRamp, SettingsRampHead, SettingsLights, SettingsFieldMap, SettingsDisclosure,
} from '@kolkrabbi/kol-component'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* float-set W1 — the Windows family (24-float-system.md § The parts, by family, row 6). Every part live from
 * kol-component. Dialog and the useModal confirm open in place inside their Part box through `container`
 * (kol-component 0.338.0, float-operational W2); closed, the box keeps the trigger that reopens them. */
const noop = () => {}
/* the part's showcase component page — relative, so it resolves on ui.kolkrabbi.io and inside the showcase's Float set */
const opt = (...l) => l.map((x) => ({ value: x, label: x }))

/* a sample bucket for the asset window — the one picture under four names, no network */
const IMG = `${import.meta.env.BASE_URL}images/stack-hero-800.jpg`
const ASSETS = ['orbit-field.jpg', 'soft-glow.jpg', 'studio-wall-north.jpg', 'luminous-portrait.jpg']
  .map((key, i) => ({ key, size: 1_240_000 + i * 310_000, kind: 'image', contentType: 'image/jpeg', lastModified: `2026-11-0${i + 1}T10:00:00Z` }))
const CLIENT = { listMedia: async () => ASSETS, mediaUrl: () => IMG }

const NAV = [
  { icon: 'home-01', label: 'Home', path: '/' },
  { icon: 'grid', label: 'Dashboard', path: '/dashboard', sub: [
    { icon: 'checklist', label: 'Tasks', path: '/dashboard/tasks' },
    { icon: 'inbox', label: 'Capture', path: '/dashboard/capture' },
    { icon: 'folder', label: 'Projects', path: '/dashboard/projects' },
  ] },
]

function ExportWindow({ blocking }) {
  const [box, setBox] = useState(null)
  const [open, setOpen] = useState(true)
  const [v, setV] = useState({ format: 'MP4 · H.264', res: '1920 × 1080' })
  const set = (k) => (x) => setV((o) => ({ ...o, [k]: x }))
  return (
    <div ref={setBox} className="relative h-[480px] w-[466px] max-w-full">
      <Button variant="float" tone="secondary" size="md" onClick={() => setOpen(true)}>{blocking ? 'Export scene' : 'Export scene · no scrim'}</Button>
      <Dialog container={box} variant="float" blocking={blocking} open={open && !!box} onClose={() => setOpen(false)} onMinimise={() => setOpen(false)} icon="share" title="Export scene" width={418}>
        <p className="kol-float-body text-fg-64">Still in motion · Scene 01 · 12 seconds</p>
        <LabeledControl variant="float" label="File name"><Input variant="float" value="still-in-motion_01" onChange={noop} width="100%" /></LabeledControl>
        <div className="grid grid-cols-2 gap-3">
          <LabeledControl variant="float" label="Format"><Dropdown variant="float" size="md" value={v.format} onChange={set('format')} options={opt('MP4 · H.264', 'WebM · VP9', 'GIF')} /></LabeledControl>
          <LabeledControl variant="float" label="Resolution"><Dropdown variant="float" size="md" value={v.res} onChange={set('res')} options={opt('1920 × 1080', '1280 × 720')} /></LabeledControl>
        </div>
        <SummaryLine label="Estimated size" value="18.4 MB" />
        <div className="flex items-center justify-between">
          <Button variant="float" tone="ghost" size="md" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="float" tone="inverted" size="md" onClick={() => setOpen(false)}>Export video</Button>
        </div>
      </Dialog>
    </div>
  )
}

function DeleteConfirm() {
  const { confirm } = useModal()
  const ask = () => confirm('Delete “Orbit field”?', {
    variant: 'float', header: 'Delete layer', icon: 'alert-triangle', tone: 'danger',
    body: 'This removes the layer and its 4 keyframes from Scene 01. You can undo this after closing the dialog.',
    okLabel: 'Delete layer', cancelLabel: 'Keep layer',
  })
  useEffect(() => { ask() }, []) // eslint-disable-line react-hooks/exhaustive-deps -- open on arrival
  return <Button variant="float" tone="danger" size="md" onClick={ask}>Delete layer</Button>
}

/* the confirm's box — the provider mounts once the box exists, so the confirm never lands on <body> */
function ConfirmBox() {
  const [box, setBox] = useState(null)
  return (
    <div ref={setBox} className="relative h-[340px] w-[626px] max-w-full">
      {box && <ModalProvider container={box}><DeleteConfirm /></ModalProvider>}
    </div>
  )
}

/* the generator settings window (plan-2026-11-05-float-editor W7.1 · 7.2; his 12:2282) — Dialog variant="settings", in its
 * box, and every Settings control on its rows */
const CURVES = ['Linear', 'Ease', 'Hump', 'Wave'].map((l) => ({ value: l.toLowerCase(), label: l }))
function SettingsWindowBox() {
  const [box, setBox] = useState(null)
  const [open, setOpen] = useState(true)
  const [section, setSection] = useState('stripe')
  const [v, setV] = useState({ dir: 'rows', count: 48, angle: 0, spacing: 'even', more: false, w: { a: 1, b: 6.8, curve: 'ease' }, g: { a: 2, b: 4, curve: 'linear' } })
  const set = (k) => (x) => setV((o) => ({ ...o, [k]: x }))
  const sections = [
    { key: 'field', label: 'Field', state: 'Radial' }, { key: 'ramp', label: 'Ramp', state: 'Continuous' },
    { key: 'stripe', label: 'Stripe Array', state: `${v.count} rows` }, { key: 'mask', label: 'Mask', state: 'None' },
  ]
  return (
    <div ref={setBox} className="relative h-[700px] w-[912px] max-w-full">
      <Button variant="float" tone="secondary" size="md" onClick={() => setOpen(true)}>Stripe Array settings</Button>
      <Dialog container={box} variant="settings" blocking={false} open={open && !!box} onClose={() => setOpen(false)} title="Stripe Array" kind="Generate"
        headerEnd={<div className="w-[158px]"><SettingsSelect value="custom" onChange={noop} options={[{ value: 'custom', label: 'Custom' }]} ariaLabel="Preset" /></div>}
        sections={sections} section={section} onSection={setSection}
        aside={<SettingsFieldMap background="linear-gradient(90deg, var(--kol-oq-16), var(--kol-fg-96) 50%, var(--kol-oq-16))" left="Radial" right="Centre 0.50 / 0.50" />}
        footer={<><span className="flex-1" /><Button size="sm" onClick={() => setOpen(false)}>Apply</Button></>}>
        <SettingsGroup title="Layout" note="Placement and rhythm">
          <SettingsGrid>
            <SettingsCell label="Direction"><SettingsSegmented value={v.dir} onChange={set('dir')} options={opt('rows', 'columns').map((o) => ({ ...o, label: o.label[0].toUpperCase() + o.label.slice(1) }))} ariaLabel="Direction" /></SettingsCell>
            <SettingsCell label="Count"><SettingsSlider value={v.count} onChange={set('count')} min={1} max={120} step={1} aria-label="Count" /></SettingsCell>
            <SettingsCell label="Angle"><SettingsSlider value={v.angle} onChange={set('angle')} min={-90} max={90} step={1} format={(n) => `${n}°`} aria-label="Angle" /></SettingsCell>
            <SettingsCell label="Spacing"><SettingsSelect value={v.spacing} onChange={set('spacing')} options={[{ value: 'even', label: 'Even' }, { value: 'packed', label: 'Packed' }, { value: 'units', label: 'Units' }]} ariaLabel="Spacing" /></SettingsCell>
          </SettingsGrid>
        </SettingsGroup>
        <SettingsGroup title="Shape ramps" note="Interpolate from A to B">
          <div className="flex flex-col gap-1">
            <SettingsRampHead />
            <SettingsRamp label="Width" value={v.w} onChange={set('w')} curves={CURVES} />
            <SettingsRamp label="Gap" value={v.g} onChange={set('g')} curves={CURVES} />
          </div>
        </SettingsGroup>
        <SettingsDisclosure label="More geometry" note="Waves, dash & offsets" open={v.more} onToggle={set('more')}>
          <SettingsGrid><SettingsCell label="Waves"><SettingsSlider value={0} onChange={noop} min={0} max={12} step={1} disabled aria-label="Waves" /></SettingsCell></SettingsGrid>
        </SettingsDisclosure>
      </Dialog>
    </div>
  )
}

function SettingsControlsBox() {
  const [v, setV] = useState({ range: [0.2, 0.8], point: [0.5, 0.5], ramp: { a: 1, b: 6.8, curve: 'ease' }, lights: [{ x: 0.35, y: 0.4, radius: 0.3, intensity: 1 }], invert: false, letter: 'A', count: 48 })
  const set = (k) => (x) => setV((o) => ({ ...o, [k]: x }))
  return (
    <div className="w-[408px] max-w-full flex flex-col gap-4 rounded-2xl bg-surface-secondary p-5" data-part-controls>
      <SettingsGrid>
        <SettingsCell label="Count"><SettingsSlider value={v.count} onChange={set('count')} min={1} max={120} step={1} aria-label="Count" /></SettingsCell>
        <SettingsCell label="From / To"><SettingsRange value={v.range} onChange={set('range')} min={0} max={1} format={(n) => n.toFixed(2)} aria-label="From / To" /></SettingsCell>
        <SettingsCell label="Centre"><SettingsPoint value={v.point} onChange={set('point')} min={-0.5} max={1.5} aria-label="Centre" /></SettingsCell>
        <SettingsCell label="Letter"><SettingsText value={v.letter} onChange={set('letter')} aria-label="Letter" /></SettingsCell>
        <SettingsCell><SettingsToggle label="Invert" checked={v.invert} onChange={set('invert')} /></SettingsCell>
      </SettingsGrid>
      <div className="flex flex-col gap-1"><SettingsRampHead /><SettingsRamp label="Width" value={v.ramp} onChange={set('ramp')} curves={CURVES} /></div>
      <SettingsLights value={v.lights} onChange={set('lights')} />
      <SettingsFieldMap background="linear-gradient(90deg, var(--kol-oq-16), var(--kol-fg-96) 50%, var(--kol-oq-16))" left="Radial" right="Centre 0.50 / 0.50" />
    </div>
  )
}

export default function Windows() {
  const [tab, setTab] = useState('canvas')
  const [safe, setSafe] = useState(false)
  const [path, setPath] = useState('/dashboard/tasks')
  return (
    <FamilyPage title="Windows" body="The float windows — blocking, utility and asset — and the lines and states that live in them.">
      {() => (
        <>
          <Part name="QuickLookHeader float" slug="quick-look-header">
            <div className="flex w-[342px] max-w-full flex-col gap-6">
              <QuickLookHeader variant="float" icon="user" title="Account" onMinimise={noop} onClose={noop} />
              <QuickLookHeader variant="float" icon="alert-triangle" title="Delete layer" onClose={noop} />
            </div>
          </Part>
          <Part name="Dialog float" slug="dialog"><ExportWindow blocking /><ExportWindow blocking={false} /></Part>
          <Part name="the useModal float confirm" slug="use-modal"><ConfirmBox /></Part>
          <Part name="Dialog settings" slug="dialog"><SettingsWindowBox /></Part>
          <Part name="Settings controls" slug="settings-ramp"><SettingsControlsBox /></Part>
          <Part name="QuickLookFrame float" slug="quick-look-frame">
            <QuickLookFrame variant="float" icon="align-vertical-center" title="Scene settings" onMinimise={noop} onClose={noop} status="Changes saved automatically" className="max-w-full">
              <TabsRow variant="float" size="xs" tabs={[{ id: 'canvas', label: 'Canvas' }, { id: 'playback', label: 'Playback' }]} value={tab} onChange={setTab} ariaLabel="Settings" />
              <div className="grid grid-cols-2 gap-3">
                <LabeledControl variant="float" label="Width"><Input variant="float" value="1920 px" onChange={noop} width="100%" /></LabeledControl>
                <LabeledControl variant="float" label="Height"><Input variant="float" value="1080 px" onChange={noop} width="100%" /></LabeledControl>
              </div>
              <ToggleSwitch variant="float" label="Show safe area" checked={safe} onChange={setSafe} className="w-full justify-between" />
            </QuickLookFrame>
          </Part>
          <Part name="MediaLibrary float" slug="media-library">
            <MediaLibrary variant="float" client={CLIENT} accept="image" title="Assets" onClose={noop} onSelect={noop} onImport={noop} />
          </Part>
          <Part name="SummaryLine" slug="summary-line"><div className="w-[392px] max-w-full"><SummaryLine label="Estimated size" value="18.4 MB" /></div></Part>
          <Part name="EmptyState float" slug="empty-state">
            <div className="flex h-[300px] w-[308px] max-w-full flex-col gap-4 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-4">
              <span className="kol-float-body text-fg-emphasis">Inspector</span>
              <div className="flex-1 flex flex-col px-2 pt-6">
                <EmptyState variant="float" title="Nothing selected" body={'Select a task to see its fields.\nNo irrelevant controls or empty values.'} footer="Panel stays open." />
              </div>
            </div>
          </Part>
          <Part name="NoticeBanner" slug="notice-banner">
            <div className="w-full max-w-[940px]">
              <NoticeBanner title="Calendar needs attention" body="Unexpected response from gcalcli. Authenticate on this machine to sync events." action="Reconnect" onAction={noop} />
            </div>
          </Part>
          <Part name="NavDrawer" slug="nav-drawer">
            <NavDrawer open fixed={false} title="Studio" items={NAV} currentPath={path} onNavigate={setPath} onClose={noop} defaultExpanded={['/dashboard']} />
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
