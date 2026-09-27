import { useEffect, useState } from 'react'
import { Button, Input, Tooltip } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { useTransport } from './transport'

/**
 * TransportBar — the loop clock's controls: rewind · play / pause · stop, and the loop length.
 *
 * Editor DS sync (2026-09-27, review #2 "transport controls incorrectly laid out"): rebuilt from KOL
 * parts. It was two hand-built button strips — play and pause as separate cells, stop and rewind
 * in a second strip after the field — each with a browser tooltip. Now one row in transport order,
 * play / pause as ONE toggle, every control a `Button` with the KOL `Tooltip`, the length the DS
 * property field. (Not `PlaybackBar`: that is a media player's bar — time, scrubber, volume,
 * speed — and this is a loop clock.)
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
    <Tooltip label="Loop length">
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

function Control({ icon, label, shortcut, onClick, size, pressed }) {
  return (
    <Tooltip label={label} shortcut={shortcut}>
      <Button variant="ghost" size={size} iconOnly={icon} iconComponent={Icon} aria-label={label} pressed={pressed} onClick={onClick} />
    </Tooltip>
  )
}

export default function TransportBar({ size = 'sm' }) {
  const { playing, loopSeconds, play, pause, stop, rewind, setLoopSeconds } = useTransport()
  return (
    <div className="flex items-center gap-1">
      <Control icon="rewind" label="Rewind" onClick={rewind} size={size} />
      <Control icon={playing ? 'pause' : 'play'} label={playing ? 'Pause' : 'Play'} shortcut="Space" onClick={playing ? pause : play} size={size} />
      <Control icon="stop" label="Stop" onClick={stop} size={size} />
      <div className="ml-auto">
        <LoopField seconds={loopSeconds} onCommit={setLoopSeconds} size={size} />
      </div>
    </div>
  )
}
