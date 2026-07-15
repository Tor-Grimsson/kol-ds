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

export default function SearchInputDemo() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  const [d, setD] = useState('')
  return (
    <>
      <SearchInput
        value={a}
        onChange={(e) => setA(e.target.value)}
        onClear={() => setA('')}
        shortcutHint="⌘K"
      />
      <SearchInput
        variant="ghost"
        placeholder="Filter…"
        value={b}
        onChange={(e) => setB(e.target.value)}
        onClear={() => setB('')}
      />
      <SearchInput
        size="sm"
        value={c}
        onChange={(e) => setC(e.target.value)}
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
