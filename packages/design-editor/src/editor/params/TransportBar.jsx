import { useEffect, useState } from 'react'
import { Input, SegmentedToggle, Tooltip, glyphSize } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { useTransport } from './transport'

/**
 * TransportBar — the loop clock's controls: rewind · play / pause · stop, and the loop length.
 *
 * fxr's two strips on KOL's SegmentedToggle — the 2026-09-27 sync's single row of ghost buttons
 * lost the shape the user wanted. (Not `PlaybackBar`: that is a media player's bar, this is a loop
 * clock.)
 *
 * Stop and rewind bump the transport's reset epoch — stateful loops (sims, trails, video) restart
 * fresh. Pause never does.
 *
 * @param {'sm'|'md'|'lg'} size  the rung — the desktop footer is sm, the phone overlay lg
 */

/* Draft-then-commit: what is typed is the draft, Enter / blur commits, Escape restores */
function LoopField({ seconds, onCommit, size }) {
  const shown = String(seconds)
  const [draft, setDraft] = useState(shown)
  const [editing, setEditing] = useState(false)
  useEffect(() => { if (!editing) setDraft(shown) }, [shown, editing])
  const commit = () => {
    setEditing(false)
    const n = Number(draft.trim())
    if (draft.trim() === '' || !Number.isFinite(n)) { setDraft(shown); return }
    onCommit(n)
  }
  return (
    <Tooltip label="Loop length" triggerClassName="flex w-full">
      <Input
        type="text"
        inputMode="decimal"
        variant="property"
        size={size}
        affordance="Loop /"
        unit="s"
        chars={3}
        aria-label="Loop length in seconds"
        value={draft}
        onFocus={(e) => { setEditing(true); e.target.select() }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          if (e.key === 'Escape') { setDraft(shown); setEditing(false); e.currentTarget.blur() }
        }}
        inputClassName="text-center"
      />
    </Tooltip>
  )
}

const glyph = (name, size) => <Icon name={name} size={glyphSize(size, true)} />

export default function TransportBar({ size = 'sm' }) {
  const { playing, loopSeconds, play, pause, stop, rewind, setLoopSeconds } = useTransport()
  /* fxr's shape (inspector rebuild 2026-09-27 — user: "should look closer to this"): play | pause
   * as one strip with the current state lit, the loop field filling the row, stop | rewind as a
   * second strip. Glyph cells take their tooltips from `ariaLabel` (SegmentedToggle). */
  return (
    <div className="flex items-center gap-2">
      <SegmentedToggle
        size={size} ariaLabel="Playback" value={playing ? 'play' : 'pause'}
        onChange={(v) => (v === 'play' ? play() : pause())}
        options={[
          { value: 'play', ariaLabel: 'Play', tooltip: 'Play (Space)', label: glyph('play', size) },
          { value: 'pause', ariaLabel: 'Pause', tooltip: 'Pause (Space)', label: glyph('pause', size) },
        ]}
      />
      <div className="flex-1 min-w-0">
        <LoopField seconds={loopSeconds} onCommit={setLoopSeconds} size={size} />
      </div>
      <SegmentedToggle
        size={size} ariaLabel="Reset" value={null}
        onChange={(v) => (v === 'stop' ? stop() : rewind())}
        options={[
          { value: 'stop', ariaLabel: 'Stop', label: glyph('stop', size) },
          { value: 'rewind', ariaLabel: 'Rewind', label: glyph('rewind', size) },
        ]}
      />
    </div>
  )
}
