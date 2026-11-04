import { useEffect, useState } from 'react'
import {
  Button, Dialog, Dropdown, EmptyState, Input, LabeledControl, MediaLibrary, ModalProvider, NavDrawer, NoticeBanner,
  QuickLookFrame, QuickLookHeader, SummaryLine, TabsRow, ToggleSwitch, useModal,
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
