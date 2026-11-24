import { useState } from 'react'
import { DividerLabel, Input, PopoverPanel } from '@kolkrabbi/kol-component'
import { SPEC } from '../../../../generate/lineSwell/index.js'
import LineSwellPicture from './LineSwellPicture.jsx'

/* Effects › Line Swell: the picker docked beside the rail, its top on the anchor (the Effects row), as the shader
   effects picker (ui/PopoverEffects.jsx): title and close, a search that filters by name, a rule per group, the tiles two
   across with the name under each, each the form drawn by the board engine at that tile's values. The canvas stays
   clear and live. onPick(tile). */
export default function WindowLineSwell({ anchor, onPick, onClose }) {
  const [q, setQ] = useState('')
  const shown = SPEC.tiles
    .map((g) => ({ ...g, items: g.items.filter((t) => t.label.toLowerCase().includes(q.trim().toLowerCase())) }))
    .filter((g) => g.items.length)
  return (
    <PopoverPanel variant="kolbox" anchor={anchor} open onClose={onClose} title="Line Swell" aria-label="Line Swell" className="max-h-120">
      <div className="sticky top-0 z-10 bg-panel px-4 pb-2">
        <Input variant="kolbox" iconLeft="search" aria-label="Search Line Swell" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
      </div>
      <div className="flex flex-col gap-3 px-4 pb-4" data-line-swell-picker>
        {shown.map((g) => (
          <section key={g.group} className="flex flex-col gap-2" aria-label={g.group}>
            <DividerLabel>{g.group}</DividerLabel>
            <div className="grid grid-cols-2 gap-2">
              {g.items.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  data-tile={t.id}
                  onClick={() => onPick(t)}
                  className="flex flex-col gap-1 rounded-well p-1 text-left outline-none hover:bg-field focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent"
                >
                  <LineSwellPicture form={t.form} values={t.values} />
                  <span className="truncate px-1 text-help text-text">{t.label}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PopoverPanel>
  )
}
