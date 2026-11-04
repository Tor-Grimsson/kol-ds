import { useState } from 'react'
import { ReadingSettings } from '@kolkrabbi/kol-component'
import { ThemeTile } from '@kolkrabbi/kol-styleguide'

export const stage = 'hug'

const THEMES = [
  { id: 'night', label: 'Night', bg: '#101012', ink: '#fafafa' },
  { id: 'paper', label: 'Paper', bg: '#e9e2d5', ink: '#242320' },
  { id: 'sepia', label: 'Sepia', bg: '#cbb99c', ink: '#242320' },
]

/* how the text is set — the Reading side of ReadingPanel */
export default function ReadingSettingsPreview() {
  const [s, setS] = useState({ theme: 'night', font: 'literata', size: 22, leading: '1.6', width: '760', flow: 'scroll' })
  const set = (k) => (v) => setS((o) => ({ ...o, [k]: v }))
  return (
    <div className="w-[280px]">
      <ReadingSettings
        themes={THEMES.map((t) => <ThemeTile key={t.id} label={t.label} bg={t.bg} ink={t.ink} selected={s.theme === t.id} onClick={() => set('theme')(t.id)} />)}
        font={s.font} fonts={[{ value: 'literata', label: 'Literata' }, { value: 'georgia', label: 'Georgia' }]} onFont={set('font')}
        size={s.size} onSize={set('size')}
        leading={s.leading} leadings={['1.4', '1.6', '1.8'].map((v) => ({ value: v, label: `${v} ×` }))} onLeading={set('leading')}
        width={s.width} widths={['640', '760', '880'].map((v) => ({ value: v, label: `${v} px` }))} onWidth={set('width')}
        flow={s.flow} onFlow={set('flow')} onReset={() => {}} />
    </div>
  )
}
