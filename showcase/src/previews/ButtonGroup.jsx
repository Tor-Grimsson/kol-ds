import { useState } from 'react'
import { ButtonGroup, Button } from '@kolkrabbi/kol-component'

function KolboxChoice() {
  const [v, setV] = useState('light')
  return <ButtonGroup layout="joined" variant="kolbox" ariaLabel="Theme" value={v} onChange={setV} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
}

function FolioSeg() {
  const [v, setV] = useState('light')
  return <ButtonGroup layout="joined" variant="folio" ariaLabel="Theme" value={v} onChange={setV} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
}

export const stage = 'full'

export default function ButtonGroupPreview() {
  return (
    <div className="flex w-full flex-col gap-10">
      <ButtonGroup title="Ready to start?">
        <Button tone="primary">Get started</Button>
        <Button tone="outline">Learn more</Button>
      </ButtonGroup>
      <ButtonGroup align="left">
        <Button tone="primary">Save changes</Button>
        <Button tone="outline">Discard</Button>
      </ButtonGroup>
      {/* joined, kolbox's icon group (W31.2 batch 3): its cells, a pressed one lit; sunken, Home's view switch */}
      <div className="flex items-center gap-4">
        <ButtonGroup layout="joined" variant="kolbox" className="w-24" options={[{ icon: 'rotate-left', ariaLabel: 'Rotate' }, { icon: 'flip-horizontal', ariaLabel: 'Flip horizontal', pressed: true }, { icon: 'flip-vertical', ariaLabel: 'Flip vertical' }]} />
        <ButtonGroup layout="joined" variant="kolbox" tone="sunken" options={[{ icon: 'grid-2x2', ariaLabel: 'Grid view', pressed: true }, { icon: 'view-list', ariaLabel: 'List view' }]} />
        {/* with a value (Folio on kolbox, 2026-11-22): kolbox's choice that stays, its tab track */}
        <KolboxChoice />
      </div>
      {/* joined, Folio's (batch A, 2026-11-22): its segmented choice with a value, its tool icons without one */}
      <div data-folio-theme="light" className="flex flex-wrap items-center gap-4 rounded bg-[var(--kol-folio-paper)] p-4 text-[var(--kol-folio-ink)]">
        <FolioSeg />
        <ButtonGroup layout="joined" variant="folio" ariaLabel="Matches" options={[{ icon: 'arrow-left', ariaLabel: 'Previous match' }, { icon: 'arrow-right', ariaLabel: 'Next match' }]} />
      </div>
      {/* wrap and grid: a narrow rail's rows (kolbox, 2026-11-18) */}
      <div className="flex w-[208px] flex-col gap-4">
        <ButtonGroup layout="wrap">
          <Button size="sm" tone="grey">Type</Button>
          <Button size="sm" tone="grey">Category</Button>
          <Button size="sm" tone="grey">Preset</Button>
          <Button size="sm" tone="grey">Settings</Button>
        </ButtonGroup>
        <ButtonGroup layout="grid">
          <Button size="sm" tone="grey">Color</Button>
          <Button size="sm" tone="grey">Motion Frame</Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
