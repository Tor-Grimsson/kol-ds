import { useEffect, useState } from 'react'
import { TimeStrip } from '@kolkrabbi/kol-hardware'
import { createTransport } from '@kolkrabbi/kol-hardware/signal'
import { Button } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* one clock, its strip: the readout, the ruler, the head, the loop window lit with IN marked "1"; drag moves the head and
 * never starts the clock. Lanes (fxr's keyframes) go under the bar as children, on the same span. Below it, docked:
 * `framed={false}` `span="loop"` `gutter` — in flow, the loop window exactly, lanes with labels under the ruler. */
const transport = createTransport({ loopIn: 1, loopOut: 5, looping: true })
/* docked (kol-fxr's TimelineDock): in flow, the loop window exactly, a label gutter its lanes share */
const docked = createTransport({ loopIn: 0, loopOut: 2, looping: true })
const LANES = [{ name: 'Scale', keys: [0, 0.5, 1] }, { name: 'Rotate', keys: [0.25, 0.75] }]
const GUTTER = 112

export default function TimeStripPreview() {
  const [playing, setPlaying] = useState(transport.playing)
  useEffect(() => transport.subscribe(() => setPlaying(transport.playing)), [])
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex gap-2">
        <Button size="sm" onClick={() => transport.toggle()}>{playing ? 'Pause' : 'Play'}</Button>
        <Button size="sm" onClick={() => transport.stop()}>Stop</Button>
        <Button size="sm" onClick={() => transport.set({ mode: transport.state.mode === 'pingpong' ? 'forward' : 'pingpong' })}>Ping-pong</Button>
      </div>
      <div className="relative h-20 w-full" data-timestrip-host>
        <TimeStrip transport={transport} />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => docked.toggle()}>Play docked</Button>
        <Button size="sm" onClick={() => docked.setLoopSeconds(docked.state.loopOut === 2 ? 8 : 2)}>2 s / 8 s</Button>
      </div>
      <div className="w-full border-t border-fg-08 px-4 py-3">
        <TimeStrip transport={docked} framed={false} span="loop" gutter={GUTTER}>
          {LANES.map((l) => (
            <div key={l.name} className="flex items-center" style={{ height: 18 }}>
              <span className="shrink-0 text-fg-64" style={{ width: GUTTER }}>{l.name}</span>
              <div className="relative flex-1 h-px" style={{ background: 'var(--kol-fg-12)' }}>
                {l.keys.map((k) => <span key={k} className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rotate-45" style={{ left: `${k * 100}%`, background: 'var(--kol-fg-64)' }} />)}
              </div>
            </div>
          ))}
        </TimeStrip>
      </div>
    </div>
  )
}
