import { useState } from 'react'
import { SearchInput } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Variants = () => {
  const [v, setV] = useState('')
  return (
    <Row>
      {['filled', 'ghost', 'outline'].map((variant) => (
        <SearchInput
          key={variant}
          variant={variant}
          placeholder={variant}
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
      ))}
    </Row>
  )
}

export const Sizes = () => {
  const [v, setV] = useState('')
  return (
    <Row>
      {['sm', 'md'].map((size) => (
        <SearchInput
          key={size}
          size={size}
          placeholder={`size ${size}`}
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
      ))}
    </Row>
  )
}

export const ClearAndShortcut = () => {
  const [v, setV] = useState('')
  return (
    <Row>
      <SearchInput
        value={v}
        onChange={(e) => setV(e.target.value)}
        onClear={() => setV('')}
        shortcutHint="⌘K"
      />
      <p className="kol-mono-12 text-fg-48">Chip while empty · × while non-empty</p>
    </Row>
  )
}

export const Bare = () => {
  const [v, setV] = useState('')
  return (
    <div className="bg-surface-primary border border-fg-08 rounded" style={{ maxWidth: 320 }}>
      <SearchInput bare value={v} onChange={(e) => setV(e.target.value)} />
    </div>
  )
}
