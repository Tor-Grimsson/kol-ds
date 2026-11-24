import { useState } from 'react'
import { Button, Dropdown, IconFrame, Rail, RailActions, RailFoot, RailHeader, RailHint, RailRow, RailSection, RailTabs, SegmentedToggle, LabeledControlSection, TreeRow } from '@kolkrabbi/kol-component'

/* a rail on every edge, over the page — and one pushing the layout, resizable from its inner edge */
export const stage = 'md'
const LINKS = ['Overview', 'Fleet', 'Journal', 'Contact']

export const variants = ['default', 'kolbox', 'folio']

export default function RailPreview({ variant = 'default' }) {
  /* folio (Folio migration batch D): the bare aside, its edge and width the caller's */
  if (variant === 'folio') return (
    <div className="flex h-[240px] w-[260px]" style={{ background: 'var(--kol-folio-paper)', color: 'var(--kol-folio-ink)' }}>
      <Rail variant="folio" aria-label="Library" className="min-h-0 w-full border-r border-[var(--kol-folio-rule)]">
        <TreeRow variant="folio" label="Studio" count={2} expanded onToggle={() => {}} />
        <TreeRow variant="folio" href="#" label="A Markdown sampler" active />
        <TreeRow variant="folio" href="#" label="Laying Plans" />
      </Rail>
    </div>
  )
  /* kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5) */
  if (variant === 'kolbox') return (
    <div className="flex h-[320px] w-full justify-center gap-6">
      <Rail variant="kolbox" side="left" aria-label="Rail" header={<RailHeader variant="kolbox" title="Pages" />}>
        <LabeledControlSection variant="kolbox" label="Layers"><TreeRow variant="kolbox" label="Page 1" active /><TreeRow variant="kolbox" label="Page 2" /></LabeledControlSection>
        <LabeledControlSection variant="kolbox" label="Styles" />
      </Rail>
      <Rail variant="kolbox" side="left" aria-label="Collapsed rail" collapsed />
    </div>
  )
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState('left')
  const [docked, setDocked] = useState(true)
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {['left', 'right', 'top', 'bottom'].map((s) => <Button key={s} onClick={() => { setSide(s); setOpen(true) }}>Over · {s}</Button>)}
        <Button tone="ghost" onClick={() => setDocked((v) => !v)}>{docked ? 'Collapse' : 'Expand'} the bottom rail</Button>
      </div>
      <div className="flex h-72 flex-col overflow-hidden rounded border border-fg-08">
        <div className="flex flex-1 items-center justify-center kol-mono-12 text-meta">the page</div>
        <Rail mode="push" side="bottom" open={docked} height={140} resizable minSize={80} maxSize={240} header={<span className="kol-mono-12 text-meta">BOTTOM RAIL · drag its top edge</span>}>
          <p className="kol-mono-12 text-meta">Docked, pushing the page up.</p>
        </Rail>
      </div>
      <Rail open={open} onClose={() => setOpen(false)} side={side} width={320} height={260} header={<span className="kol-helper-12 text-fg-48">NAVIGATION</span>}>
        <nav className="flex flex-col gap-1">
          {LINKS.map((label) => <a key={label} href="#" onClick={(e) => e.preventDefault()} className="kol-mono-14 rounded px-2 py-2 text-fg-64 no-underline transition-colors hover:bg-fg-04 hover:text-emphasis">{label}</a>)}
        </nav>
      </Rail>
      <Kit />
    </div>
  )
}

/* THE KIT (RailKit, 2026-10-24): the parts a rail's content is built from, laid out as fxr's inspector — at the app tier's
 * width and padding. The whole rails are `apps/rails`. */
function Kit() {
  const [tab, setTab] = useState('generate')
  const [foot, setFoot] = useState('transport')
  const [loop, setLoop] = useState('on')
  const TABS = ['Generate', 'Style', 'Animation'].map((l) => ({ value: l.toLowerCase(), label: l }))
  const FOOT = ['Transport', 'Output', 'File'].map((l) => ({ value: l.toLowerCase(), label: l }))
  return (
    <div className="flex flex-col gap-2">
      <span className="kol-mono-12 text-meta">the kit, at the app tier (320, the overlay inset) — RailHeader · RailTabs · RailSection / RailRow · RailHint · RailActions · RailFoot</span>
      <div className="flex flex-col gap-6 rounded border border-fg-08" style={{ width: 'var(--kol-rail-w-app)', padding: 'var(--kol-pad-rail-app)' }}>
        <RailHeader title="Inspector" subtitle="Scanline · spaced drift" actions={<IconFrame name="refresh" variant="nav" size="sm" aria-label="Reset" onClick={() => {}} />} />
        <RailTabs tabs={TABS} value={tab} onChange={setTab} />
        <RailSection label="Source">
          <RailRow label="Type" align="fill"><Dropdown size="sm" className="w-full" options={[{ value: 'scanline', label: 'Scanline' }, { value: 'halftone', label: 'Halftone' }]} value="scanline" onChange={() => {}} ariaLabel="Type" /></RailRow>
          <RailRow label="Loop"><SegmentedToggle size="sm" options={[{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }]} value={loop} onChange={setLoop} ariaLabel="Loop" /></RailRow>
          <RailHint>Shift-drag a value for fine steps.</RailHint>
        </RailSection>
        <RailActions><Button size="sm">Randomise</Button><Button size="sm" tone="grey">Save as preset</Button></RailActions>
        <RailFoot tabs={FOOT} value={foot} onChange={setFoot}><RailActions row><Button size="sm" tone="grey">Play</Button><Button size="sm" tone="grey">Stop</Button></RailActions></RailFoot>
      </div>
    </div>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return <Button>Open a rail</Button>
}
