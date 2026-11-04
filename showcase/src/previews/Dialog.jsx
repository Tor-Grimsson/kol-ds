import { useState } from 'react'
import { Button, Dialog, Input, PasswordInput, LabeledControl, Dropdown, ToggleSwitch, ToggleCheckbox, SummaryLine } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['default', 'float']

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
      <Dialog variant="float" open={open} onClose={() => setOpen(false)} onMinimise={() => setOpen(false)} icon="share" title="Export scene" width={418}>
        <div className="flex flex-col gap-1">
          <p className="font-[family-name:var(--kol-font-family-float)] text-[20px] font-medium leading-[28px] text-fg-emphasis">Ready for the outside world.</p>
          <p className="kol-float-body text-fg-64">Still in motion · Scene 01 · 12 seconds</p>
        </div>
        <LabeledControl variant="float" label="File name"><Input variant="float" value="still-in-motion_01" onChange={() => {}} width="100%" /></LabeledControl>
        <div className="grid grid-cols-2 gap-3">
          <LabeledControl variant="float" label="Format"><Dropdown variant="float" size="md" value={v.format} onChange={set('format')} options={opt('MP4 · H.264', 'WebM · VP9', 'GIF')} /></LabeledControl>
          <LabeledControl variant="float" label="Resolution"><Dropdown variant="float" size="md" value={v.res} onChange={set('res')} options={opt('1920 × 1080', '1280 × 720', '3840 × 2160')} /></LabeledControl>
          <LabeledControl variant="float" label="Frame rate"><Dropdown variant="float" size="md" value={v.fps} onChange={set('fps')} options={opt('24 fps', '30 fps', '60 fps')} /></LabeledControl>
          <LabeledControl variant="float" label="Range"><Dropdown variant="float" size="md" value={v.range} onChange={set('range')} options={opt('Entire scene', 'Selection')} /></LabeledControl>
        </div>
        <ToggleSwitch variant="float" label="Loop playback" checked={loop} onChange={setLoop} className="w-full justify-between" />
        <SummaryLine label="Estimated size" value="18.4 MB" />
        <div className="flex items-center justify-between">
          <Button variant="float" tone="ghost" size="md" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="float" tone="inverted" size="md" onClick={() => setOpen(false)}>Export video</Button>
        </div>
      </Dialog>
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
      <Dialog variant="float" open={open} onClose={() => setOpen(false)} onMinimise={() => setOpen(false)} icon="user" title="Account" width={370}>
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
      </Dialog>
    </>
  )
}

export default function DialogPreview({ variant = 'default' }) {
  if (variant === 'float') return <div className="flex gap-3"><ExportWindow /><SignInWindow /></div>
  return <DefaultDialog />
}

function DefaultDialog() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Dialog" width={420}>
        <div className="p-5 flex flex-col gap-4">
          <p className="kol-mono-12 text-emphasis">Any content, above the page, under its floats.</p>
          <Button size="sm" onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Dialog>
    </>
  )
}
