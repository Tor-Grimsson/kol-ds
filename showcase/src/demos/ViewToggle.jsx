import { useState } from 'react'
import { ViewToggle, Dropdown, Input, Button, IconFrame } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'

export default function ViewToggleDemo() {
  const [view, setView] = useState('grid')
  return (
    <>
      <ViewToggle viewMode={view} onViewChange={setView} />
      <ViewToggle viewMode={view} onViewChange={setView} variant="icon" />
      <ViewToggle viewMode={view} onViewChange={setView} variant="single" />
      {/* the control set in both tones on the fg-02 wash it was ruled for
        * (ControlToneSunken, 2026-08-28 — was ControlToneInverse's fg-04 row):
        * ViewToggle icon · Dropdown · Input · Button icon-only · IconFrame · ThemeToggle */}
      <ToneOnAWash />
    </>
  )
}

function ToneOnAWash() {
  const [view, setView] = useState('grid')
  const [sort, setSort] = useState('newest')
  const [q, setQ] = useState('')
  const opts = [{ value: 'newest', label: 'Newest first' }, { value: 'oldest', label: 'Oldest first' }]
  return (
    <div className="flex w-full flex-col gap-3 rounded bg-fg-02 p-4">
      {['default', 'sunken'].map((tone) => (
        <div key={tone} className="flex flex-wrap items-center gap-4">
          <span className="kol-helper-10 text-meta w-14">{tone.toUpperCase()}</span>
          <ViewToggle viewMode={view} onViewChange={setView} variant="icon" tone={tone} />
          <Dropdown value={sort} onChange={setSort} options={opts} tone={tone} />
          <Input size="sm" placeholder="search" value={q} onChange={(e) => setQ(e.target.value)} tone={tone} />
          <Button iconOnly="copy" variant="secondary" size="sm" tone={tone} aria-label="Copy" />
          <Button iconOnly="download" variant="secondary" size="sm" tone={tone} aria-label="Download" />
          <IconFrame name="grid" size="sm" tone={tone} />
          <ThemeToggle label={false} size="sm" fill="subtle" tone={tone} />
        </div>
      ))}
    </div>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [view, setView] = useState('grid')
  return <ViewToggle viewMode={view} onViewChange={setView} />
}
