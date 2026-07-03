import { useState } from 'react'
import { SearchInput } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function SearchInputDemo() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
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
    </>
  )
}
