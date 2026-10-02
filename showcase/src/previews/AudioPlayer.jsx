import { useMemo } from 'react'
import { AudioPlayer } from '@kolkrabbi/kol-component'

/* A one-second tone, built here — the repo ships no audio fixture, and the player renders nothing
 * without a src (W18, 2026-09-30). */
function toneUrl() {
  const rate = 8000
  const n = rate
  const buf = new ArrayBuffer(44 + n)
  const v = new DataView(buf)
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)))
  str(0, 'RIFF'); v.setUint32(4, 36 + n, true); str(8, 'WAVEfmt ')
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
  v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true)
  str(36, 'data'); v.setUint32(40, n, true)
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128 + Math.round(40 * Math.sin((2 * Math.PI * 440 * i) / rate)))
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }))
}

export default function AudioPlayerPreview() {
  const src = useMemo(toneUrl, [])
  return <AudioPlayer src={src} label="A4 · 440 Hz" className="w-72" />
}
