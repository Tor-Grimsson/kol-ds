import { useState } from 'react'
import { TransportPill } from '@kolkrabbi/kol-shell'

export const stage = 'sm'

const LENGTHS = [2, 4, 8, 12, 16]

export default function TransportPillPreview() {
  const [playing, setPlaying] = useState(false)
  const [loop, setLoop] = useState(4)
  const items = [
    { id: 'play', icon: 'play', label: 'Play', selected: playing, onPress: () => setPlaying(true) },
    { id: 'pause', icon: 'pause', label: 'Pause', selected: !playing, onPress: () => setPlaying(false) },
    { id: 'loop', icon: 'stopwatch-solid', label: 'Loop length' },
    { id: 'stop', icon: 'stop', label: 'Stop', onPress: () => setPlaying(false) },
    { id: 'rewind', icon: 'rewind', label: 'Rewind' },
  ]
  const sheetFor = { loop: LENGTHS.map((n) => ({ label: `${n} s`, checked: n === loop, onPress: () => setLoop(n) })) }
  return (
    /* The real pill is fixed to the viewport and shows below 768 only. The frame's `transform` makes it the containing
     * block for the pill, its sheet and its edge tab, and `!flex` lifts the breakpoint. */
    <div className="w-full max-w-sm">
      <div
        className="relative overflow-hidden rounded border border-fg-08 bg-surface-primary [&_.kol-mobile-tabbar]:!flex [&_.kol-mobile-tabbar-tab]:!flex"
        style={{ height: 360, transform: 'translateZ(0)' }}
      >
        <div className="p-4 kol-mono-12 text-meta">{playing ? 'playing' : 'paused'}, loop {loop} s</div>
        <TransportPill items={items} sheetFor={sheetFor} foldable />
      </div>
    </div>
  )
}
