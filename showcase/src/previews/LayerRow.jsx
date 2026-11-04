import { useState } from 'react'
import { LayerRow } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* a layers list — the selected layer lifted; the eye and the lock toggle */
export default function LayerRowPreview() {
  const [layers, setLayers] = useState([
    { id: 'orbit', name: 'Orbit field', icon: 'circles-three', visible: true, locked: false },
    { id: 'glow', name: 'Soft glow', icon: 'drop-circle', visible: false, locked: false },
    { id: 'bg', name: 'Background', icon: 'layers', visible: true, locked: true },
  ])
  const [sel, setSel] = useState('orbit')
  const flip = (id, k) => setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, [k]: !l[k] } : l)))
  return (
    <div className="flex w-[268px] flex-col gap-1">
      {layers.map((l) => (
        <LayerRow key={l.id} icon={l.icon} name={l.name} selected={sel === l.id} onClick={() => setSel(l.id)}
          visible={l.visible} onToggleVisible={() => flip(l.id, 'visible')} locked={l.locked} onToggleLock={() => flip(l.id, 'locked')} />
      ))}
    </div>
  )
}
