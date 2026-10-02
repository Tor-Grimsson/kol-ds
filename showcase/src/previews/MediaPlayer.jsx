import { useMemo } from 'react'
import { MediaPlayer } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* `variant` is what plays, `frame` is where: inline, or in the Quick Look window. */
export const variants = ['video', 'audio']
export const states = ['inline', 'frame']

/* a silent 2-second WAV, built at runtime (8 kHz · 8-bit · mono ≈ 16 KB) — the showcase carries no
 * audio, and the bar needs a real element with a length */
function silentWav(seconds = 2, rate = 8000) {
  const n = seconds * rate
  const buf = new ArrayBuffer(44 + n)
  const v = new DataView(buf)
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)) }
  str(0, 'RIFF'); v.setUint32(4, 36 + n, true); str(8, 'WAVE'); str(12, 'fmt ')
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
  v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true)
  str(36, 'data'); v.setUint32(40, n, true)
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128)
  let bin = ''
  new Uint8Array(buf).forEach((b) => { bin += String.fromCharCode(b) })
  return 'data:audio/wav;base64,' + btoa(bin)
}

const poster = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3a55"/><stop offset="1" stop-color="#0d1017"/></linearGradient></defs><rect width="960" height="540" fill="url(#g)"/></svg>')

/* The showcase carries no video file, so the video variant shows its poster and a bar at 00:00 —
 * the shape of the player, not a playing one. Audio plays: a WAV has no ID3 cover, so the window
 * shows the file icon. */
export default function MediaPlayerPreview({ variant = 'video', state = 'inline' }) {
  const wav = useMemo(() => silentWav(), [])
  const audio = variant === 'audio'
  const frame = state === 'frame' ? { title: audio ? 'silence.wav' : 'reel.mp4', meta: audio ? '16 KB' : '960 × 540 px' } : undefined
  return audio
    ? <MediaPlayer variant="audio" src={wav} ext="wav" frame={frame} className="w-[640px] max-w-full" />
    : <MediaPlayer variant="video" poster={poster} frame={frame} className="w-[960px] max-w-full rounded overflow-hidden" />
}
