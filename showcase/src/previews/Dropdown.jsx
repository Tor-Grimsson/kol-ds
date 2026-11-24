import { useState } from 'react'
import { Dropdown } from '@kolkrabbi/kol-component'

const OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
]

/* ONE instance; variant and size ride the toolbar pickers (2026-09-30, the names audit — the
 * three variants used to stack side by side, one of them open). */
/* `float` (float-everything W2 row 25 · W4 row 54): the capsule on the well, its list 8 under it */
export const variants = ['primary', 'grey', 'outline', 'float', 'kolbox', 'folio']

/* xs is the panel rung (ControlsXsRung, 2026-09-01) — opt-in; the default stays sm */
export const tones = ['default', 'primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'faint', 'sunken']
export const sizes = ['sm', 'md', 'lg', 'xs']
/* the axes as ONE MultiSelect in the toolbar (2026-10-02, the user's preview of it on this page) */
export const picker = 'multi'

export default function DropdownPreview({ variant = 'primary', tone = 'default', size = 'sm' }) {
  const [value, setValue] = useState('newest')
  /* kolbox (W31.2 batch 4): its list opens over the field, the chosen row on it; outlined, and `tone="grey"` the unbordered field */
  if (variant === 'kolbox') return <div className="flex w-56 flex-col gap-3"><Dropdown variant="kolbox" value={value} onChange={setValue} options={OPTIONS} ariaLabel="Sort" /><Dropdown variant="kolbox" tone="grey" value={value} onChange={setValue} options={OPTIONS} ariaLabel="Sort" /></div>
  /* folio (Folio batch B): the button as wide as its text, the list under it in place, the current row green */
  if (variant === 'folio') return <div data-folio-theme="light" className="flex min-h-[380px] w-full items-start justify-center bg-(--kol-folio-paper) p-6 font-(family-name:--kol-font-family-float) leading-[1.21] text-(--kol-folio-ink)"><Dropdown variant="folio" value={value} onChange={setValue} options={OPTIONS} ariaLabel="Sort" className="kol-folio-meta" /></div>
  /* stayOpen: the open list is what this page shows — it stays while the toolbar picks a size or tone */
  return <Dropdown value={value} onChange={setValue} variant={variant} tone={tone} size={size} options={OPTIONS} ariaLabel="Sort" stayOpen />
}

/* Index card: one canonical instance, closed. */
export function Card() {
  const [value, setValue] = useState('newest')
  return <Dropdown value={value} onChange={setValue} options={OPTIONS} />
}
