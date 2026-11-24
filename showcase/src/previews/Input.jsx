import { useState } from 'react'
import { Input, ColorSwatch } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* The main instance takes the variant and size pickers (2026-09-30 — filled and outline used to
 * stack); the examples below it are different PROPS (commit on blur, a slot, a property pair),
 * not variants of the same thing. */
export const variants = ['filled', 'outline', 'float', 'kolbox', 'folio']
export const tones = ['default', 'primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'sunken']
export const sizes = ['sm', 'md', 'lg', 'xs']

export default function InputPreview({ variant = 'filled', tone = 'default', size = 'md' }) {
  const [v, setV] = useState('')
  const [name, setName] = useState('scope-04')
  const [hex, setHex] = useState('FFCF33')
  const [x, setX] = useState('240')
  const [pct, setPct] = useState('100')
  const onChange = (e) => setV(e?.target?.value ?? e)
  /* kolbox (W31.2 batch 3): its three fields as sizes, sm the field (a lead letter, a unit), md the rail's search,
     lg the search modal's field */
  if (variant === 'kolbox') {
    return (
      <div className="flex w-full max-w-md flex-col gap-3">
        <div className="flex gap-2">
          <Input variant="kolbox" prefix="X" value={x} onChange={(e) => setX(e.target.value)} aria-label="X" className="w-24" />
          <Input variant="kolbox" prefix="W" value={pct} onChange={(e) => setPct(e.target.value)} suffix="%" hug aria-label="Width" className="w-24" />
          <Input variant="kolbox" placeholder="Disabled" disabled aria-label="Disabled" className="w-24" />
        </div>
        <Input variant="kolbox" size="md" iconLeft="search" placeholder="Search" aria-label="Search" />
        <Input variant="kolbox" size="lg" iconLeft="search" placeholder="Search files and commands" aria-label="Search files and commands" />
      </div>
    )
  }
  /* folio (Folio batch A, 2026-11-22): the bare field on Folio's paper, the width the caller's */
  if (variant === 'folio') {
    return <div data-folio-theme="light" className="flex w-full max-w-md flex-col gap-3 rounded bg-[var(--kol-folio-paper)] p-4 text-[var(--kol-folio-ink)]"><Input variant="folio" placeholder="Find" value={v} onChange={onChange} aria-label="Find" className="w-[220px]" /><Input variant="folio" placeholder="Disabled" disabled aria-label="Disabled" className="w-full" /></div>
  }
  /* float (float-everything W3 row 36): the capsule's states — rest · focus (click in) · error with its message · disabled */
  if (variant === 'float') {
    return (
      <div className="grid w-full max-w-2xl grid-cols-2 gap-4">
        <Input variant="float" size={size} placeholder="Scene name" value={v} onChange={onChange} width="100%" />
        <Input variant="float" size={size} value="Still in motion" onChange={() => {}} width="100%" autoFocus />
        <Input variant="float" size={size} type="email" value="alex@" onChange={() => {}} error="Enter a valid email address." width="100%" />
        <Input variant="float" size={size} placeholder="Available after sign in" disabled width="100%" />
      </div>
    )
  }
  return (
    <>
      <Input variant={variant} tone={tone} size={size} placeholder={variant} value={v} onChange={onChange} />
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
