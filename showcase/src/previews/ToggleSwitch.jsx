import { useState } from 'react'
import { LabeledControl, ToggleSwitch } from '@kolkrabbi/kol-component'

/* float (float-everything W2 row 21): the 32 × 20 track, one size */
export const variants = ['bare', 'primary', 'outline', 'float', 'kolbox', 'folio']
export const sizes = ['md', 'xs', 'sm', 'lg']

export default function ToggleSwitchPreview({ variant = 'bare', size = 'md' }) {
  const [on, setOn] = useState(true)
  const [off, setOff] = useState(false)
  /* kolbox (W31.2): one size, no label of its own; a kolbox LabeledControl gives the words */
  if (variant === 'kolbox') {
    return (
      <div className="flex w-52 flex-col">
        <LabeledControl variant="kolbox" horizontal label="On"><ToggleSwitch variant="kolbox" checked={on} onChange={setOn} aria-label="On" /></LabeledControl>
        <LabeledControl variant="kolbox" horizontal label="Off"><ToggleSwitch variant="kolbox" checked={off} onChange={setOff} aria-label="Off" /></LabeledControl>
      </div>
    )
  }
  /* folio (Folio batch A, 2026-11-22): one size, no label of its own, on Folio's paper */
  if (variant === 'folio') {
    return <div data-folio-theme="light" className="flex flex-wrap items-center gap-6 rounded bg-[var(--kol-folio-paper)] p-4 text-[var(--kol-folio-ink)]"><ToggleSwitch variant="folio" checked={on} onChange={setOn} aria-label="On" /><ToggleSwitch variant="folio" checked={off} onChange={setOff} aria-label="Off" /></div>
  }
  return (
    <>
      {/* the switch is bare; its words are a LabeledControl (`label` deprecated 2026-11-12) */}
      <LabeledControl variant={variant === 'float' ? 'float' : undefined} horizontal label="On" labelWidth="fit-content"><ToggleSwitch checked={on} onChange={setOn} variant={variant} size={size} aria-label="On" /></LabeledControl>
      <LabeledControl variant={variant === 'float' ? 'float' : undefined} horizontal label="Off" labelWidth="fit-content"><ToggleSwitch checked={off} onChange={setOff} variant={variant} size={size} aria-label="Off" /></LabeledControl>
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [on, setOn] = useState(true)
  return <LabeledControl horizontal label="Autosave" labelWidth="fit-content"><ToggleSwitch checked={on} onChange={setOn} aria-label="Autosave" /></LabeledControl>
}
