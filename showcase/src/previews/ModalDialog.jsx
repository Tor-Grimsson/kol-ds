import { useState } from 'react'
import { Button, ButtonGroup, ModalDialog, ModalProvider, useModal, Input, PasswordInput, LabeledControl, Dropdown, Slider, TabsRow, ToggleSwitch, ToggleCheckbox, SummaryLine, LabeledControlSection, SettingsGrid } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['default', 'float', 'settings', 'kolbox', 'folio']

const opt = (...l) => l.map((x) => ({ value: x, label: x }))

/* float (W6 rows 84 · 89 · 90 · 91): the export window — a blocking task, so the scrim stays; open on arrival */
function ExportWindow() {
  const [open, setOpen] = useState(true)
  const [loop, setLoop] = useState(true)
  const [v, setV] = useState({ format: 'MP4 · H.264', res: '1920 × 1080', fps: '30 fps', range: 'Entire scene' })
  const set = (k) => (x) => setV((o) => ({ ...o, [k]: x }))
  return (
    <>
      <Button variant="float" tone="secondary" size="md" onClick={() => setOpen(true)}>Export scene</Button>
      <ModalDialog variant="float" open={open} onClose={() => setOpen(false)} onMinimise={() => setOpen(false)} icon="share" title="Export scene">
        <div className="flex flex-col gap-1">
          <p className="font-[family-name:var(--kol-font-family-float)] text-[20px] font-medium leading-[28px] text-fg-emphasis">Ready for the outside world.</p>
          <p className="kol-float-body text-fg-64">Still in motion · Scene 01 · 12 seconds</p>
        </div>
        {/* the fields: File name first, the pickers, then Loop playback (a LabeledControl, the switch bare) — P8 */}
        <LabeledControlSection variant="float">
          <LabeledControl variant="float" label="File name"><Input variant="float" value="still-in-motion_01" onChange={() => {}} width="100%" /></LabeledControl>
          <div className="grid grid-cols-2 gap-3">
            <LabeledControl variant="float" label="Format"><Dropdown variant="float" size="md" value={v.format} onChange={set('format')} options={opt('MP4 · H.264', 'WebM · VP9', 'GIF')} /></LabeledControl>
            <LabeledControl variant="float" label="Resolution"><Dropdown variant="float" size="md" value={v.res} onChange={set('res')} options={opt('1920 × 1080', '1280 × 720', '3840 × 2160')} /></LabeledControl>
            <LabeledControl variant="float" label="Frame rate"><Dropdown variant="float" size="md" value={v.fps} onChange={set('fps')} options={opt('24 fps', '30 fps', '60 fps')} /></LabeledControl>
            <LabeledControl variant="float" label="Range"><Dropdown variant="float" size="md" value={v.range} onChange={set('range')} options={opt('Entire scene', 'Selection')} /></LabeledControl>
          </div>
          <LabeledControl variant="float" horizontal label="Loop playback" labelWidth="auto">
            <ToggleSwitch variant="float" checked={loop} onChange={setLoop} aria-label="Loop playback" />
          </LabeledControl>
        </LabeledControlSection>
        <SummaryLine label="Estimated size" value="18.4 MB" />
        <ButtonGroup align="between">
          <Button variant="float" tone="ghost" size="md" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="float" tone="inverted" size="md" onClick={() => setOpen(false)}>Export video</Button>
        </ButtonGroup>
      </ModalDialog>
    </>
  )
}

/* float (W6 row 83): the sign-in window — the same Dialog, the account's fields composed in it */
function SignInWindow() {
  const [open, setOpen] = useState(false)
  const [keep, setKeep] = useState(true)
  return (
    <>
      <Button variant="float" tone="secondary" size="md" onClick={() => setOpen(true)}>Sign in</Button>
      <ModalDialog variant="float" open={open} onClose={() => setOpen(false)} onMinimise={() => setOpen(false)} icon="user" title="Account" width={370}>
        <div className="flex flex-col gap-1">
          <p className="font-[family-name:var(--kol-font-family-float)] text-[20px] font-medium leading-[28px] text-fg-emphasis">Sign in</p>
          <p className="kol-float-body text-fg-64">Pick up where your ideas left off.</p>
        </div>
        <LabeledControl variant="float" label="Email"><Input variant="float" type="email" value="alex@studio.design" onChange={() => {}} width="100%" /></LabeledControl>
        <LabeledControl variant="float" label="Password"><PasswordInput variant="float" value="correct-horse" onChange={() => {}} /></LabeledControl>
        <div className="flex items-center justify-between gap-3">
          <ToggleCheckbox variant="float" label="Keep me signed in" checked={keep} onChange={setKeep} />
          <Button variant="float" tone="ghost" size="sm">Forgot password?</Button>
        </div>
        <Button variant="float" tone="inverted" size="md" className="self-start" onClick={() => setOpen(false)}>Sign in</Button>
        <p className="kol-float-hint text-fg-64">Don’t have an account? Sign up</p>
      </ModalDialog>
    </>
  )
}

export default function ModalDialogPreview({ variant = 'default' }) {
  if (variant === 'float') return <div className="flex gap-3"><ExportWindow /><SignInWindow /></div>
  if (variant === 'settings') return <SettingsWindow />
  if (variant === 'kolbox') return <KolboxWindow />
  if (variant === 'folio') return <FolioWindow />
  return <DefaultDialog />
}

/* folio (Folio batch B): Folio's dialog on its dim, in a box here so it stays in the preview */
function FolioWindow() {
  const [open, setOpen] = useState(true)
  return (
    <div data-folio-theme="light" className="relative flex h-[420px] w-full items-center justify-center bg-(--kol-folio-paper) font-(family-name:--kol-font-family-float) leading-[1.21] text-(--kol-folio-ink)" style={{ transform: 'translateZ(0)' }}>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <ModalDialog variant="folio" open={open} onClose={() => setOpen(false)} title="New document" width={480}>
        <p className="kol-folio-body p-[24px]">Any content, under Folio's header.</p>
      </ModalDialog>
    </div>
  )
}

/* kolbox (W31.2 batch 4): the window on the dim, and a confirm from ModalProvider variant="kolbox" */
function KolboxAsk() {
  const { confirm } = useModal()
  return <Button variant="kolbox" onClick={() => confirm('Restore your last canvas?', { okLabel: 'Restore', cancelLabel: 'New file' })}>Open confirm</Button>
}
function KolboxWindow() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex gap-3">
      <Button variant="kolbox" onClick={() => setOpen(true)}>Open window</Button>
      <ModalDialog variant="kolbox" open={open} onClose={() => setOpen(false)} title="Export"
        footer={<><Button variant="kolbox" onClick={() => setOpen(false)}>Cancel</Button><Button variant="kolbox" tone="primary" onClick={() => setOpen(false)}>Export</Button></>}>
        <p className="kol-kolbox-help px-4 pb-4 text-oq-64">Any content, in the kolbox shell.</p>
      </ModalDialog>
      <ModalProvider variant="kolbox"><KolboxAsk /></ModalProvider>
    </div>
  )
}

function DefaultDialog() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>Open dialog</Button>
      <ModalDialog open={open} onClose={() => setOpen(false)} title="Dialog" width={420}>
        <div className="p-5 flex flex-col gap-4">
          <p className="kol-mono-12 text-emphasis">Any content, above the page, under its floats.</p>
          <Button size="sm" onClick={() => setOpen(false)}>Close</Button>
        </div>
      </ModalDialog>
    </>
  )
}

/* settings (plan-2026-11-05-float-editor W7.1, his 12:2282): the generator settings window — sections left, the body, the preview column */
function SettingsWindow() {
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState('stripe')
  const [dir, setDir] = useState('rows')
  const [count, setCount] = useState(48)
  const sections = [{ key: 'field', label: 'Field', state: 'Radial' }, { key: 'ramp', label: 'Ramp', state: 'Continuous' }, { key: 'stripe', label: 'Stripe Array', state: `${count} rows` }]
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>Open settings</Button>
      <ModalDialog variant="settings" open={open} onClose={() => setOpen(false)} title="Stripe Array" kind="Generate"
        sections={sections} section={section} onSection={setSection}
        aside={<p className="text-[10px] text-oq-64">Preview column</p>}
        footer={<ButtonGroup align="right" className="flex-1"><Button variant="float" tone="inverted" size="sm" onClick={() => setOpen(false)}>Apply</Button></ButtonGroup>}>
        <LabeledControlSection variant="settings" label="Layout" end="Placement and rhythm" divided>
          <SettingsGrid>
            <LabeledControl variant="float" label="Direction"><TabsRow variant="float" size="xs" tabs={[{ value: 'rows', label: 'Rows' }, { value: 'columns', label: 'Columns' }]} value={dir} onChange={setDir} ariaLabel="Direction" className="w-full [&>*]:flex-1" /></LabeledControl>
            <LabeledControl variant="float" label="Count"><Slider variant="float" readout="input" value={count} onChange={setCount} min={1} max={120} step={1} aria-label="Count" /></LabeledControl>
          </SettingsGrid>
        </LabeledControlSection>
      </ModalDialog>
    </>
  )
}
