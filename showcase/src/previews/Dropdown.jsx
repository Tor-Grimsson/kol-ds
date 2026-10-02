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
export const variants = ['primary', 'grey', 'outline']
/* xs is the panel rung (ControlsXsRung, 2026-09-01) — opt-in; the default stays sm */
export const tones = ['default', 'primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'sunken']
export const sizes = ['sm', 'md', 'lg', 'xs']
/* the axes as ONE MultiSelect in the toolbar (2026-10-02, the user's preview of it on this page) */
export const picker = 'multi'

export default function DropdownPreview({ variant = 'primary', tone = 'default', size = 'sm' }) {
  const [value, setValue] = useState('newest')
  /* stayOpen: the open list is what this page shows — it stays while the toolbar picks a size or tone */
  return <Dropdown value={value} onChange={setValue} variant={variant} tone={tone} size={size} options={OPTIONS} stayOpen />
}

/* Index card: one canonical instance, closed. */
export function Card() {
  const [value, setValue] = useState('newest')
  return <Dropdown value={value} onChange={setValue} options={OPTIONS} />
}
