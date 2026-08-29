import { useEffect, useState } from 'react'
import { PlaybackBar } from '@kolkrabbi/kol-component'

export const stage = 'lg'

const poster = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3a55"/><stop offset="1" stop-color="#0d1017"/></linearGradient></defs><rect width="960" height="540" fill="url(#g)"/></svg>')

/* The QuickTime bar, presentational — the showcase carries no video, so this
 * drives it with a simulated clock: play runs the elapsed time against a 25 s
 * length, seek and skip move it, `>>` cycles the speed. Over a poster frame the
 * way VideoSheet floats it (inset 16, radius 12). */
export default function PlaybackBarDemo() {
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(12)
  const [rate, setRate] = useState(1)
  const duration = 25
  useEffect(() => {
    if (!playing) return undefined
    const id = setInterval(() => setTime((t) => (t + 0.1 * rate >= duration ? (setPlaying(false), duration) : t + 0.1 * rate)), 100)
    return () => clearInterval(id)
  }, [playing, rate])
  return (
    <div className="relative w-full max-w-[960px] aspect-video rounded overflow-hidden">
      <img src={poster} alt="" className="w-full h-full object-cover" />
      <PlaybackBar
        playing={playing}
        time={time}
        duration={duration}
        rate={rate}
        onToggle={() => setPlaying((p) => !p)}
        onSeek={(t) => setTime(Math.max(0, Math.min(duration, t)))}
        onVolume={() => {}}
        onRate={setRate}
      />
    </div>
  )
}
