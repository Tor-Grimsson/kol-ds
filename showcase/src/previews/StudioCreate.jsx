import { useState } from 'react'
import { StudioCreate, StudioCreateAction } from '@kolkrabbi/kol-shell'

export const stage = 'full'
export const frame = 720

const PARTS = ['clock', 'lfo', 'mixer', 'scope', 'noise', 'filter'].map((type, i) => ({
  type, name: type, title: type[0].toUpperCase() + type.slice(1), category: i % 2 ? 'control' : 'generators', u_label: i % 3 ? '3U' : '1U',
}))

/* Create: a catalog of parts beside the case on the studio canvas — monitor's page made once. INSERT a part, it lands in the case */
export default function StudioCreatePreview() {
  const [placed, setPlaced] = useState(['clock'])
  const [name, setName] = useState('Untitled')
  const [description, setDescription] = useState('Design a new case')
  const [showCase, setShowCase] = useState(true)
  return (
    <StudioCreate
      header={{ title: name, subtitle: description, onTitleChange: setName, onSubtitleChange: setDescription }}
      parts={PARTS}
      partGroups={[{ label: 'Category', key: 'category', values: ['control', 'generators'], exclusive: true }]}
      toCard={(m) => ({ key: m.type, title: m.title, detail: `${m.u_label}, ${m.category}`, media: <img src={`/previews/modules/${m.type}.png`} alt={m.title} /> })}
      onPlace={(m) => setPlaced((p) => [...p, m.type])}
      caseCount={placed.length}
      showCase={showCase}
      caseActions={<StudioCreateAction icon="grid" label="Case preview" pressed={showCase} onClick={() => setShowCase((v) => !v)} />}
    >
      <div className="inline-flex gap-1 rounded-[var(--kol-radius-sm)] border border-fg-12 bg-surface-secondary p-2" style={{ margin: 48 }}>
        {placed.map((t, i) => <img key={i} src={`/previews/modules/${t}.png`} alt={t} style={{ height: 160, width: 'auto' }} />)}
      </div>
    </StudioCreate>
  )
}
