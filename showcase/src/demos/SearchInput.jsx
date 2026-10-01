import { useState } from 'react'
import { SearchInput } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* Index card: one canonical instance. */
export function Card() {
  const [v, setV] = useState('')
  return (
    <div className="w-full max-w-xs">
      <SearchInput value={v} onChange={(e) => setV(e.target.value)} onClear={() => setV('')} shortcutHint="⌘K" />
    </div>
  )
}

export const variants = ['filled', 'ghost', 'outline']
export const tones = ['default', 'inverse']
export const sizes = ['md', 'xs', 'sm']

export default function SearchInputDemo({ variant = 'filled', tone = 'default', size = 'md' }) {
  const [a, setA] = useState('')
  const [d, setD] = useState('')
  const [e, setE] = useState('')
  return (
    <>
      <SearchInput
        variant={variant}
        tone={tone}
        size={size}
        value={a}
        onChange={(e) => setA(e.target.value)}
        onClear={() => setA('')}
        shortcutHint="⌘K"
      />
      {/* bare body plan — the overlay palette's field, chrome off */}
      <SearchInput
        bare
        value={e}
        onChange={(ev) => setE(ev.target.value)}
        onClear={() => setE('')}
      />
      {/* expanding body plan — the /work navbar pattern (uncontrolled open) */}
      <SearchInput
        expanding
        value={d}
        onChange={(e) => setD(e.target.value)}
        placeholder="Search projects…"
      />
    </>
  )
}
