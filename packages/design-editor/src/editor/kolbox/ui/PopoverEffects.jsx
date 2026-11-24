import { useState } from 'react'
import { Button, Input, PopoverPanel } from '@kolkrabbi/kol-component'
import Icon from './Icon.jsx'

/* W13 state 10: the effects picker beside the rail; titled, plus and close; search; the group titles; preview tiles
   two across with the name under each, one selected on the soft tint; the list scrolls inside the panel. The groups and
   tiles are what the host passes (the editor passes the engine's own stage categories, round 2, 3.1). The tiles' images
   are not made: each is an empty well (gap, as the Figma build left them). groups: [{ title, items: [name or
   { value, label }] }]; value: the selected value; onChange(value). onAdd: the header's plus; without it the plus is
   not drawn. */
export const PICKER_GROUPS = [
  { title: 'Halftone', items: ['Halftone Dither', 'ASCII'] },
  { title: 'Scanline', items: ['Scanline'] },
]

const item = (n) => (typeof n === 'object' ? n : { value: n, label: n })

export default function PopoverEffects({ anchor, open, onClose, groups = PICKER_GROUPS, value = null, onChange, onAdd }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(value)
  const shown = groups
    .map((g) => ({ ...g, items: g.items.map(item).filter((n) => n.label.toLowerCase().includes(q.toLowerCase())) }))
    .filter((g) => g.items.length)
  const plus = <Button variant="kolbox" iconOnly="plus" aria-label="Add" onClick={onAdd}/>
  return (
    <PopoverPanel variant="kolbox" anchor={anchor} open={open} onClose={onClose} title="Shader effects" actions={onAdd ? plus : null} className="max-h-120">
      <div className="sticky top-0 z-10 bg-panel px-4 pb-2">
        <Input variant="kolbox" iconLeft="search" aria-label="Search" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)}/>
      </div>
      <div className="flex flex-col gap-3 px-4 pb-4">
        {shown.map((g) => (
          <section key={g.title} className="flex flex-col gap-2">
            <h3 className="text-help text-muted">{g.title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {g.items.map((n) => (
                <button
                  key={n.value}
                  type="button"
                  aria-pressed={n.value === sel}
                  data-stage={n.value}
                  onClick={() => { setSel(n.value); onChange?.(n.value) }}
                  className={`flex flex-col gap-1 rounded-well p-1 text-left outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent ${n.value === sel ? 'bg-accent-tint-soft' : 'hover:bg-field'}`}
                >
                  <span className="aspect-square w-full rounded-control bg-field" />
                  <span className="truncate px-1 text-help text-text">{n.label}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PopoverPanel>
  )
}
