import { useRef, useState } from 'react'

/**
 * usePlayback — ONE media element's playback state for a PlaybackBar
 * (PlaybackBarAndAudioSheet, kol-r2b2 2026-08-27, promoted verbatim). The sheet
 * spreads `handlers` on its <audio> / <video> and hands `bar` to the bar; the
 * bar never touches the element (the React-compiler lint forbids mutating a
 * ref passed as a prop, and a presentational bar should not know one exists).
 *
 * @param {Function} onLoaded  (element) => void once metadata lands
 * @returns {{ ref, handlers, bar }} — `bar` = { playing, time, duration, rate, onToggle, onSeek, onVolume, onRate }
 */
export default function usePlayback(onLoaded) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1)
  const handlers = {
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onEnded: () => setPlaying(false),
    onTimeUpdate: (e) => setTime(e.target.currentTime),
    onLoadedMetadata: (e) => { setDuration(e.target.duration); onLoaded?.(e.target) },
  }
  const bar = {
    playing,
    time,
    duration,
    rate,
    onToggle: () => (playing ? ref.current.pause() : ref.current.play()),
    onSeek: (t) => { const v = Math.max(0, Math.min(duration || 0, t)); ref.current.currentTime = v; setTime(v) },
    onVolume: (v) => { ref.current.volume = v },
    /* the bar's `>>` — 1 → 1.5 → 2 → 1 */
    onRate: (r) => { ref.current.playbackRate = r; setRate(r) },
  }
  return { ref, handlers, bar }
}
