import { useState } from 'react'
import { ReadingPanel, ReadingNotes, ReadingSettings } from '@kolkrabbi/kol-component'
import { ThemeTile } from '@kolkrabbi/kol-styleguide'

export const stage = 'hug'

const THEMES = [
  { id: 'night', label: 'Night', bg: '#101012', ink: '#fafafa' },
  { id: 'paper', label: 'Paper', bg: '#e9e2d5', ink: '#242320' },
  { id: 'sepia', label: 'Sepia', bg: '#cbb99c', ink: '#242320' },
]
const FONTS = [{ value: 'literata', label: 'Literata' }, { value: 'georgia', label: 'Georgia' }, { value: 'inter', label: 'Inter' }]
const LEADINGS = ['1.4', '1.5', '1.6', '1.8'].map((v) => ({ value: v, label: `${v} ×` }))
const WIDTHS = ['640', '760', '880'].map((v) => ({ value: v, label: `${v} px` }))

/* the reader's side sheet — Notes and Reading behind one track */
export default function ReadingPanelPreview() {
  const [tab, setTab] = useState('notes')
  const [note, setNote] = useState('The intervals matter as much as the arrivals. A thought to take into the next chapter.')
  const [s, setS] = useState({ theme: 'night', font: 'literata', size: 22, leading: '1.6', width: '760', flow: 'scroll' })
  const set = (k) => (v) => setS((o) => ({ ...o, [k]: v }))
  return (
    <ReadingPanel tab={tab} onTab={setTab} onFold={() => {}}>
      {tab === 'notes' ? (
        <ReadingNotes quote="Attention is not always a matter of looking harder. Sometimes it is simply a willingness to remain."
          location="Third interlude · Page 125" note={note} onNoteChange={setNote} status="All changes saved"
          onView={() => {}} onRemove={() => {}} footer="Note 1 / Page 125" />
      ) : (
        <ReadingSettings
          themes={THEMES.map((t) => <ThemeTile key={t.id} label={t.label} bg={t.bg} ink={t.ink} selected={s.theme === t.id} onClick={() => set('theme')(t.id)} />)}
          font={s.font} fonts={FONTS} onFont={set('font')} size={s.size} onSize={set('size')}
          leading={s.leading} leadings={LEADINGS} onLeading={set('leading')} width={s.width} widths={WIDTHS} onWidth={set('width')}
          flow={s.flow} onFlow={set('flow')} onReset={() => setS({ theme: 'night', font: 'literata', size: 22, leading: '1.6', width: '760', flow: 'scroll' })} />
      )}
    </ReadingPanel>
  )
}
