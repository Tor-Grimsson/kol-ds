import { useState } from 'react'
import { QuickLookFrame, ActionButton, FileIcon, TabsRow, LabeledControl, Dropdown, Input, ColorField, ToggleSwitch } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* `nav` draws the pager only for a multi-selection (total > 1) — the window pages the selection. */
const FILES = [['notes.txt', 'txt', undefined, '0 B'], ['voice.wav', 'wav', 'music-note', '2.1 MB']]

export const variants = ['default', 'float']

/* float (W6 rows 86 · 88): the utility window — non-modal, chip tabs, float fields, the autosave line and its corner */
function UtilityWindow() {
  const [tab, setTab] = useState('canvas')
  const [safe, setSafe] = useState(false)
  return (
    <div className="p-8">
      <QuickLookFrame variant="float" icon="align-vertical-center" title="Scene settings" onMinimise={() => {}} onClose={() => {}} status="Changes saved automatically">
        <TabsRow variant="float" size="xs" tabs={[{ id: 'canvas', label: 'Canvas' }, { id: 'playback', label: 'Playback' }]} value={tab} onChange={setTab} ariaLabel="Settings" />
        <div className="grid grid-cols-2 gap-3">
          <LabeledControl variant="float" label="Width"><Input variant="float" value="1920 px" onChange={() => {}} width="100%" /></LabeledControl>
          <LabeledControl variant="float" label="Height"><Input variant="float" value="1080 px" onChange={() => {}} width="100%" /></LabeledControl>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <LabeledControl variant="float" label="Frame rate"><Dropdown variant="float" size="md" value="30" onChange={() => {}} options={[{ value: '24', label: '24 fps' }, { value: '30', label: '30 fps' }, { value: '60', label: '60 fps' }]} /></LabeledControl>
          <LabeledControl variant="float" label="Duration"><Input variant="float" value="00:12:00" onChange={() => {}} width="100%" /></LabeledControl>
        </div>
        <ColorField label="Background" value="#0B0B0B" />
        <ToggleSwitch variant="float" label="Show safe area" checked={safe} onChange={setSafe} className="w-full justify-between" />
      </QuickLookFrame>
    </div>
  )
}

export default function QuickLookFramePreview({ variant = 'default' }) {
  if (variant === 'float') return <UtilityWindow />
  return <FileWindow />
}

function FileWindow() {
  const [i, setI] = useState(0)
  const [name, ext, glyph, meta] = FILES[i]
  const step = (d) => setI((n) => (n + d + FILES.length) % FILES.length)
  return (
    <QuickLookFrame title={name} meta={meta} onClose={() => {}}
      nav={{ index: i, total: FILES.length, onPrev: () => step(-1), onNext: () => step(1) }}
      actions={<ActionButton chrome="inline" size="sm" icon="download" label="Download" href="#" />}>
      <FileIcon ext={ext} glyph={glyph} className="w-[160px] m-16" />
    </QuickLookFrame>
  )
}
