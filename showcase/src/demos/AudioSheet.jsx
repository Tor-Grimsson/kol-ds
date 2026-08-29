import { useMemo, useState } from 'react'
import { AudioSheet, SegmentedToggle } from '@kolkrabbi/kol-component'

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

/* Audio in the overlay, both variants — `cover` (the artwork is the frame, the bar
 * floats) and `sheet` (the QuickTime audio window). A WAV carries no ID3 cover,
 * so the light square with the `music-note` glyph is what renders. */
export default function AudioSheetDemo() {
  const src = useMemo(() => silentWav(), [])
  const [variant, setVariant] = useState('sheet')
  return (
    <div className="flex w-full flex-col items-start gap-6">
      <SegmentedToggle size="sm" value={variant} onChange={setVariant} options={[{ value: 'cover', label: 'Cover' }, { value: 'sheet', label: 'Sheet' }]} ariaLabel="Variant" />
      <AudioSheet key={variant} src={src} variant={variant} />
    </div>
  )
}
