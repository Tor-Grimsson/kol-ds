import { useState } from 'react'
import { Input, ColorSwatch } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* Variants ramp inline; size rides the toolbar picker. */
export const sizes = ['sm', 'md', 'lg', 'xs']

export default function InputDemo({ size = 'md' }) {
  const [v, setV] = useState('')
  const [name, setName] = useState('scope-04')
  const [hex, setHex] = useState('FFCF33')
  const [x, setX] = useState('240')
  const [pct, setPct] = useState('100')
  const onChange = (e) => setV(e?.target?.value ?? e)
  return (
    <>
      <Input variant="filled" size={size} placeholder="filled" value={v} onChange={onChange} />
      <Input variant="outline" size={size} placeholder="outline" value={v} onChange={onChange} />
      {/* xs + onCommit (ControlsXsRung, 2026-09-01): the panel rung, committing on blur / Enter — the value beside it is what was committed */}
      <div className="flex items-center gap-2">
        <Input variant="outline" size="xs" value={name} onCommit={setName} placeholder="module name" chars={12} />
        <span className="kol-helper-8 text-meta" data-committed={name}>{name}</span>
      </div>
      {/* paint bar — slotLeft puts the swatch INSIDE the shell: one container */}
      <Input
        variant="filled"
        size="sm"
        slotLeft={<ColorSwatch hex={`#${hex}`} size={18} />}
        chars={6}
        value={hex}
        onChange={(e) => setHex(e.target.value.replace(/^#/, '').toUpperCase())}
      />
      {/* property fields — dim affordance, hugging value, unit ADJACENT */}
      <div className="grid grid-cols-2 gap-2 max-w-55">
        <Input variant="property" size="sm" affordance="X" value={x} onChange={(e) => setX(e.target.value)} />
        <Input variant="property" size="sm" value={pct} onChange={(e) => setPct(e.target.value)} unit="%" />
      </div>
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [v, setV] = useState('')
  return (
    <div className="w-full max-w-xs">
      <Input variant="filled" placeholder="Input" value={v} onChange={(e) => setV(e?.target?.value ?? e)} />
    </div>
  )
}
