import { useState } from 'react'
import { ThemeTile } from '@kolkrabbi/kol-styleguide'

export const stage = 'hug'

const THEMES = [
  { id: 'night', label: 'Night', bg: '#101012', ink: '#fafafa' },
  { id: 'paper', label: 'Paper', bg: '#fafafa', ink: '#101012' },
  { id: 'sepia', label: 'Sepia', bg: '#f1e6d2', ink: '#4a3a24' },
]

/* the reading themes as a pick — the selected tile wears the float ring */
export default function ThemeTilePreview() {
  const [theme, setTheme] = useState('night')
  return (
    <div className="flex items-center gap-3">
      {THEMES.map((t) => <ThemeTile key={t.id} label={t.label} bg={t.bg} ink={t.ink} selected={theme === t.id} onClick={() => setTheme(t.id)} />)}
    </div>
  )
}
