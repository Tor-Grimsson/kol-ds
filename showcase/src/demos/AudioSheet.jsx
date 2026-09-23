import { useMemo } from 'react'
import { AudioSheet } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* a silent 2-second WAV, built at runtime (8 kHz · 8-bit · mono ≈ 16 KB) — the
 * showcase carries no audio, and the bar needs a real element with a length */
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

/* Audio in the Quick Look window — the artwork square, the length beside it, the bar docked in
 * the footer. A WAV carries no ID3 cover, so the file icon is what renders. */
export default function AudioSheetDemo() {
  const src = useMemo(() => silentWav(), [])
  return <AudioSheet src={src} ext="wav" frame={{ title: 'silence.wav', meta: '16 KB' }} />
}
